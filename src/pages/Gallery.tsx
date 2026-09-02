import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { api } from '@/api/client';
import type { Exhibit } from '@/types';
import Card from '@/components/UI/Card';

const mockCats = [
  { id: '1', name: 'Architecture', icon: 'Building2', color: '#3b82f6' },
  { id: '2', name: 'Product Design', icon: 'Box', color: '#10b981' },
  { id: '3', name: 'Game Assets', icon: 'Gamepad2', color: '#f59e0b' },
  { id: '4', name: 'Art', icon: 'Palette', color: '#ec4899' },
  { id: '5', name: 'Education', icon: 'GraduationCap', color: '#8b5cf6' },
];

export default function Gallery() {
  const { selectedCategory, selectCategory, searchQuery } = useAppStore();
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [activeFilter, setActiveFilter] = useState(selectedCategory || 'all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params: Record<string, string> = { limit: '30' };
    if (activeFilter !== 'all') params.category = activeFilter;
    if (searchQuery) params.search = searchQuery;

    setLoading(true);
    api.exhibits.list(params)
      .then((data) => setExhibits(data.exhibits))
      .catch(() => setExhibits([]))
      .finally(() => setLoading(false));
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    setActiveFilter(selectedCategory || 'all');
  }, [selectedCategory]);

  const handleCategoryClick = (categoryName: string) => {
    setActiveFilter(categoryName);
    selectCategory(categoryName === 'all' ? null : categoryName);
  };

  return (
    <div
      className="min-h-screen pt-16"
      style={{
        backgroundImage: "url('/gallery-backgrounds/1.jpg')",
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4"><span>作品库</span><br /><span className="text-xs text-slate-500">Gallery</span></h1>
          <p className="text-slate-400"><span>浏览所有虚拟仿真作品</span><br /><span className="text-xs text-slate-500">Browse all virtual simulation works</span></p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => handleCategoryClick('all')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'all' ? 'bg-gradient-accent text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
            <span>全部</span><br /><span className="text-xs text-slate-500">All</span>
          </button>
          {mockCats.map((category) => (
            <button key={category.id} onClick={() => handleCategoryClick(category.name)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === category.name ? 'bg-gradient-accent text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-300"><span>加载中...</span><br /><span className="text-xs text-slate-500">Loading...</span></p>
          </div>
        ) : exhibits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibits.map((exhibit) => (
              <Card key={exhibit.id} exhibit={exhibit} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📭</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2"><span>没有找到作品</span><br /><span className="text-xs text-slate-500">No works found</span></h3>
            <p className="text-slate-400"><span>尝试更换筛选条件或搜索关键词</span><br /><span className="text-xs text-slate-500">Try changing filter conditions or search keywords</span></p>
          </div>
        )}
      </div>
    </div>
  );
}