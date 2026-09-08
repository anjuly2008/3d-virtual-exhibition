import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { api } from '@/api/client';
import type { Exhibit } from '@/types';
import ModelViewer from '@/components/3D/ModelViewer';

export default function AdminPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exhibit, setExhibit] = useState<Exhibit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(false);

    api.admin
      .preview(id)
      .then((data) => {
        setExhibit(data.exhibit);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div
      className="relative min-h-screen pt-16"
      style={{
        backgroundImage: "url('/backgrounds/4.gif')",
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {loading ? (
        <div className="relative z-10 min-h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

            <p className="text-white">
              加载作品中...
              <br />
              <span className="text-xs text-slate-300">Loading artwork...</span>
            </p>
          </div>
        </div>
      ) : error || !exhibit ? (
        <div className="relative z-10 min-h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="text-center">
            <div className="glass-card w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              作品未找到
              <br />
              <span className="text-xs text-slate-300">Work Not Found</span>
            </h2>

            <p className="text-slate-200 mb-6">
              无法获取该作品的预览信息
              <br />
              <span className="text-xs text-slate-300">
                Unable to load preview information
              </span>
            </p>

            <button
              type="button"
              className="glass-btn inline-flex items-center gap-2"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                返回管理后台
                <br />
                <span className="text-xs">Back to Admin</span>
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 min-h-[calc(100vh-64px)] p-4 md:p-6">
          <div className="h-[calc(100vh-96px)] flex flex-col lg:flex-row gap-4">
            <div className="lg:w-2/3 relative">
              <div className="absolute top-4 left-4 z-20">
                <button
                  type="button"
                  className="glass-btn inline-flex items-center gap-2"
                  onClick={() => navigate('/admin')}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>
                    返回
                    <br />
                    <span className="text-xs">Back</span>
                  </span>
                </button>
              </div>

              <div className="absolute top-4 right-4 z-20">
                <span className="glass-badge px-3 py-1 text-xs">
                  管理员预览
                  <br />
                  <span className="text-xs">Admin Preview</span>
                </span>
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
                <span className="glass-badge px-3 py-1 text-xs">
                  {exhibit.category}
                </span>

                {exhibit.status === 'pending' && (
                  <span className="glass-badge px-3 py-1 text-xs">
                    待审核
                    <br />
                    <span className="text-xs">Pending</span>
                  </span>
                )}

                {exhibit.status === 'approved' && (
                  <span className="glass-badge px-3 py-1 text-xs">
                    已通过
                    <br />
                    <span className="text-xs">Approved</span>
                  </span>
                )}

                {exhibit.status === 'rejected' && (
                  <span className="glass-badge px-3 py-1 text-xs">
                    已拒绝
                    <br />
                    <span className="text-xs">Rejected</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                {exhibit.title}
              </h1>

              <div className="flex items-center gap-2 mb-6">
                <div className="glass-avatar w-10 h-10">
                  <span className="text-sm font-medium text-white">
                    {exhibit.creator_name.charAt(0).toUpperCase()}
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

              <p className="text-slate-200 mb-6">
                {exhibit.description}
              </p>

              <div className="flex items-center gap-2 mb-6">
                <div className="glass-btn flex items-center gap-2 px-4 py-2">
                  <Heart className="w-5 h-5" />
                  <span>{exhibit.likes}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/20">
                <h3 className="text-white font-semibold mb-4">
                  预览提示
                  <br />
                  <span className="text-xs text-slate-300">
                    Preview Tips
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
      )}
    </div>
  );
}