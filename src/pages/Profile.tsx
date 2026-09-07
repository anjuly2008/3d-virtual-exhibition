import { useEffect, useRef, useState } from 'react';
import { Heart, Upload, User, Mail, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/client';
import Card from '@/components/UI/Card';
import type { Exhibit } from '@/types';

export default function Profile() {
  const { user, updateAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [myWorks, setMyWorks] = useState<Exhibit[]>([]);
  const [worksLoading, setWorksLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'works' | 'likes'>('works');
  const [myLikes, setMyLikes] = useState<Exhibit[]>([]);
  const [likesLoading, setLikesLoading] = useState(false);
  useEffect(() => {
  api.exhibits
    .mine()
    .then((data) => setMyWorks(data.exhibits))
    .catch(() => setMyWorks([]))
    .finally(() => setWorksLoading(false));
}, []);

const loadMyLikes = async () => {
  setLikesLoading(true);

  try {
    const data = await api.exhibits.likes();
    setMyLikes(data.exhibits);
  } catch {
    setMyLikes([]);
  } finally {
    setLikesLoading(false);
  }
};
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  setAvatarLoading(true);

  try {
    await updateAvatar(file);
  } catch (err) {
    alert(err instanceof Error ? err.message : '头像上传失败');
  } finally {
    setAvatarLoading(false);
    e.target.value = '';
  }
};

  if (!user) return null;

  return (
    <div className="relative min-h-screen pt-[72px]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/backgrounds/4.gif')",
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="absolute inset-0 z-0 bg-black/20 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            个人中心
            <br />
            <span className="text-xs text-slate-300">Personal Center</span>
          </h1>
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex flex-col items-center">
              <div className="glass-avatar w-24 h-24 overflow-hidden">
                <img
                  src={user.avatar_url || '/icons/26.gif'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <button
                type="button"
                className="glass-btn mt-4 px-3 py-1"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
              >
                {avatarLoading ? (
                  <>
                    上传中...
                    <br />
                    <span className="text-xs">Uploading...</span>
                  </>
                ) : (
                  <>
                    更换头像
                    <br />
                    <span className="text-xs">Change</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">{user.username}</h2>

              <div className="space-y-2 text-slate-300">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-2">
                  <User className="w-4 h-4" />
                  <span>{user.role === 'admin' ? '管理员 / Admin' : '普通用户 / User'}</span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>注册时间将在后续接入</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('works')}
            className={`glass-btn ${activeTab === 'works' ? 'is-active' : ''}`}
          >
            <Upload className="w-4 h-4" />
            我的作品
            <br />
            <span className="text-xs">My Works</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('likes');
              if (myLikes.length === 0) loadMyLikes();
            }}
            className={`glass-btn ${activeTab === 'likes' ? 'is-active' : ''}`}
          >
            <Heart className="w-4 h-4" />
            我的点赞
            <br />
            <span className="text-xs">My Likes</span>
          </button>
        </div>

        {activeTab === 'works' ? (
          worksLoading ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-slate-400">作品加载中...</p>
            </div>
          ) : myWorks.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <User className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                我的作品
                <br />
                <span className="text-xs text-slate-300">My Works</span>
              </h3>

              <p className="text-slate-400">
                你还没有创建作品
                <br />
                <span className="text-xs text-slate-500">You haven't created any works yet</span>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myWorks.map((exhibit) => (
                <Card key={exhibit.id} exhibit={exhibit} />
              ))}
            </div>
          )
        ) : likesLoading ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-slate-400">点赞作品加载中...</p>
          </div>
        ) : myLikes.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Heart className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
              我的点赞
              <br />
              <span className="text-xs text-slate-300">My Likes</span>
            </h3>

            <p className="text-slate-400">
              你还没有点赞任何作品
              <br />
              <span className="text-xs text-slate-500">You haven't liked any works yet</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myLikes.map((exhibit) => (
              <Card key={exhibit.id} exhibit={exhibit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}