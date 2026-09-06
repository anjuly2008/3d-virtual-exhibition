import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Download, Share2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { api } from '@/api/client';
import type { Exhibit } from '@/types';
import ModelViewer from '@/components/3D/ModelViewer';

export default function Viewer() {
  const { id } = useParams<{ id: string }>();

  const [exhibit, setExhibit] = useState<Exhibit | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(false);

    api.exhibits.get(id)
      .then((data) => {
        setExhibit(data.exhibit);

        return api.exhibits.getLike(id)
          .then((likeData) => {
            setLiked(likeData.liked);
          })
          .catch(() => {});
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleLike = async () => {
    if (!exhibit) return;

    try {
      const data = await api.exhibits.like(String(exhibit.id));

      setExhibit({
        ...exhibit,
        likes: data.likes,
      });

      setLiked(data.liked);
    } catch {}
  };

  if (loading) {
    return (
      <div
        className="min-h-screen pt-16 relative flex items-center justify-center"
        style={{
          backgroundImage: "url('/home-backgrounds/4.gif')",
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-white">
            加载作品中...
            <br />
            <span className="text-xs text-slate-300">
              Loading artworks...
            </span>
          </p>
        </div>
      </div>
    );
  }

  if (error || !exhibit) {
    return (
      <div
        className="min-h-screen pt-16 relative flex items-center justify-center"
        style={{
          backgroundImage: "url('/home-backgrounds/4.gif')",
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="relative z-10 text-center">
          <div className="glass-card w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔍</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            作品未找到
            <br />
            <span className="text-xs text-slate-300">
              Work Not Found
            </span>
          </h2>

          <p className="text-slate-200 mb-6">
            该作品不存在或已被移除
            <br />
            <span className="text-xs text-slate-300">
              This work does not exist or has been removed
            </span>
          </p>

          <Link
            to="/gallery"
            className="gallery-filter-btn inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />

            <span>
              返回作品库
              <br />
              <span className="text-xs">Back to Gallery</span>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-16 relative"
      style={{
        backgroundImage: "url('/home-backgrounds/4.gif')",
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="relative z-10 min-h-[calc(100vh-64px)] p-4 md:p-6">
        <div className="h-[calc(100vh-96px)] flex flex-col lg:flex-row gap-4">
          <div className="lg:w-2/3 relative">
            <div className="absolute top-4 left-4 z-20">
              <Link
                to="/gallery"
                className="gallery-filter-btn inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />

                <span>
                  返回
                  <br />
                  <span className="text-xs">Back</span>
                </span>
              </Link>
            </div>

            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button
                className="gallery-filter-btn p-2"
                type="button"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              <button
                className="gallery-filter-btn p-2"
                type="button"
              >
                <ZoomOut className="w-5 h-5" />
              </button>

              <button
                className="gallery-filter-btn p-2"
                type="button"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="h-[50vh] lg:h-full">
              <ModelViewer exhibit={exhibit} />
            </div>
          </div>

          <div
            className="lg:w-1/3 p-6 overflow-y-auto rounded-2xl bg-[rgba(210,230,248,0.16)] backdrop-blur-md border border-white/30"
            style={{
              boxShadow: `
                inset 0 0 30px rgba(255,255,255,0.06),
                0 0 25px rgba(180,220,255,0.10)
              `,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="gallery-filter-btn px-3 py-1 text-xs">
                {exhibit.category}
              </span>

              {exhibit.status === 'pending' && (
                <span className="gallery-filter-btn px-3 py-1 text-xs">
                  审核中
                  <br />
                  <span className="text-xs">Under Review</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              {exhibit.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[rgba(180,220,245,0.25)] backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {exhibit.creator_name.charAt(0)}
                  </span>
                </div>

                <div>
                  <p className="text-white font-medium">
                    {exhibit.creator_name}
                  </p>

                  <p className="text-xs text-slate-300">
                    {new Date(exhibit.created_at).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-slate-200 mb-6">
              {exhibit.description}
            </p>

            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <button
                onClick={handleLike}
                className={`gallery-filter-btn flex items-center gap-2 px-4 py-2 ${
                  liked ? 'is-active' : ''
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${liked ? 'fill-current' : ''}`}
                />

                <span>{exhibit.likes}</span>
              </button>

              <button
                type="button"
                className="gallery-filter-btn flex items-center gap-2 px-4 py-2"
              >
                <Download className="w-5 h-5" />

                <span>
                  下载
                  <br />
                  <span className="text-xs">Download</span>
                </span>
              </button>

              <button
                type="button"
                className="gallery-filter-btn p-2"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="pt-6 border-t border-white/20">
              <h3 className="text-white font-semibold mb-4">
                操作提示
                <br />
                <span className="text-xs text-slate-300">
                  Operation Tips
                </span>
              </h3>

              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-300 shadow-[0_0_8px_rgba(180,220,255,0.8)]" />

                  <span>
                    拖动鼠标旋转模型
                    <br />
                    <span className="text-xs text-slate-400">
                      Drag to rotate model
                    </span>
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-300 shadow-[0_0_8px_rgba(180,220,255,0.8)]" />

                  <span>
                    滚轮缩放视角
                    <br />
                    <span className="text-xs text-slate-400">
                      Scroll to zoom
                    </span>
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-300 shadow-[0_0_8px_rgba(180,220,255,0.8)]" />

                  <span>
                    右键拖动平移视角
                    <br />
                    <span className="text-xs text-slate-400">
                      Right-click drag to pan
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}