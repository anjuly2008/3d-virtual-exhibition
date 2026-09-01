import { useEffect, useState } from 'react';
{/*useState保存页面中的状态  useEffect页面加载或者 id 变化以后执行请求*/}
import { useParams, Link } from 'react-router-dom';
{/*useParams是React Router 提供的一个现成函数，用来从当前网址中读取动态参数*/}
import { ArrowLeft, Heart, Download, Share2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { api } from '@/api/client';
import type { Exhibit } from '@/types';
{/*告诉Typescript作品对象的结构*/}
import ModelViewer from '@/components/3D/ModelViewer';
{/* 真正负责显示 3D 模型的组件*/}

export default function Viewer() {
  {/*定义 Viewer 页面组件*/}
  const { id } = useParams<{ id: string }>();
  {/*useParams把字符串形式的整数转换成数字*/}
  {/*获取 URL 中的 id*/}
  const [exhibit, setExhibit] = useState<Exhibit | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    api.exhibits.get(id)
      .then((data) => setExhibit(data.exhibit))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!exhibit) return;
    try {
      const data = await api.exhibits.like(String(exhibit.id));
      setExhibit({ ...exhibit, likes: data.likes });
      setLiked(true);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">加载作品中...<br /><span className="text-xs text-slate-500">Loading artworks...</span></p>
        </div>
      </div>
    );
  }

  if (error || !exhibit) {
    return (
      <div className="min-h-screen pt-16 bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">作品未找到<br /><span className="text-xs text-slate-500">Work Not Found</span></h2>
          <p className="text-slate-400 mb-6">该作品不存在或已被移除<br /><span className="text-xs text-slate-500">This work does not exist or has been removed</span></p>
          <Link to="/gallery" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-accent rounded-xl text-white font-medium hover:opacity-90 transition-opacity">
            <ArrowLeft className="w-4 h-4" /><span>返回作品库<br /><span className="text-xs text-slate-500">Back to Gallery</span></span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="h-screen flex flex-col lg:flex-row">
        <div className="lg:w-2/3 relative">
          <div className="absolute top-4 left-4 z-20">
            <Link to="/gallery" className="flex items-center gap-2 px-4 py-2 bg-slate-800/90 backdrop-blur-md rounded-lg text-white hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-4 h-4" /><span>返回<br /><span className="text-xs text-slate-500">Back</span></span>
            </Link>
          </div>
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button className="p-2 bg-slate-800/90 backdrop-blur-md rounded-lg text-white hover:bg-slate-700 transition-colors"><ZoomIn className="w-5 h-5" /></button>
            <button className="p-2 bg-slate-800/90 backdrop-blur-md rounded-lg text-white hover:bg-slate-700 transition-colors"><ZoomOut className="w-5 h-5" /></button>
            <button className="p-2 bg-slate-800/90 backdrop-blur-md rounded-lg text-white hover:bg-slate-700 transition-colors"><RotateCcw className="w-5 h-5" /></button>
          </div>
          <div className="h-[50vh] lg:h-full">
            <ModelViewer exhibit={exhibit} />
          </div>
        </div>

        <div className="lg:w-1/3 bg-slate-800/50 border-l border-slate-700/50 p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent-500/90 text-white">{exhibit.category}</span>
            {exhibit.status === 'pending' && <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-500/90 text-white">审核中<br /><span className="text-xs text-slate-500">Under Review</span></span>}
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{exhibit.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center">
                <span className="text-sm font-medium text-white">{exhibit.creator_name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-white font-medium">{exhibit.creator_name}</p>
                <p className="text-xs text-slate-400">{new Date(exhibit.created_at).toLocaleDateString('zh-CN')}</p>
              </div>
            </div>
          </div>

          <p className="text-slate-300 mb-6">{exhibit.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${liked ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} /><span>{exhibit.likes}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg text-slate-300 font-medium hover:bg-slate-600 transition-colors">
              <Download className="w-5 h-5" /><span>下载<br /><span className="text-xs text-slate-500">Download</span></span>
            </button>
            <button className="p-2 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors"><Share2 className="w-5 h-5" /></button>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-white font-semibold mb-4">操作提示<br /><span className="text-xs text-slate-500">Operation Tips</span></h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent-500" /><span>拖动鼠标旋转模型<br /><span className="text-xs text-slate-500">Drag to rotate model</span></span></li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent-500" /><span>滚轮缩放视角<br /><span className="text-xs text-slate-500">Scroll to zoom</span></span></li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent-500" /><span>右键拖动平移视角<br /><span className="text-xs text-slate-500">Right-click drag to pan</span></span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}