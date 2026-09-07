import { useEffect, useState, type ReactNode } from 'react';
import { useAppStore } from '@/store/appStore';
import { api } from '@/api/client';
import type { Exhibit } from '@/types';
import Card from '@/components/UI/Card';

const categories = ['Character', 'Architecture', 'Vehicle', 'Prop', 'Environment'];
const availableTags = ['Low Poly', 'Sci-Fi', 'Fantasy', 'Cartoon', 'Realistic', 'Animated', 'Game Ready'];
const usages = ['Game', 'Education', 'Exhibition', 'Design'];

function PageContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`relative z-10 mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export default function Gallery() {
  const {
    selectedCategory,
    selectCategory,
    selectedTags,
    setSelectedTags,
    selectedUsages,
    setSelectedUsages,
    searchQuery,
    setSearchQuery,
    clearFilters,
  } = useAppStore();

  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params: Record<string, string> = {};

    if (searchQuery) {
      params.search = searchQuery;
    } else {
      if (selectedCategory) params.category = selectedCategory;
      if (selectedTags.length > 0) params.tags = JSON.stringify(selectedTags);
      if (selectedUsages.length > 0) params.usage = JSON.stringify(selectedUsages);
    }

    setLoading(true);

    api.exhibits
      .list(params)
      .then((data) => setExhibits(data.exhibits))
      .catch(() => setExhibits([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedTags, selectedUsages, searchQuery]);

  const handleCategoryClick = (categoryName: string) => {
    setSearchQuery('');

    if (categoryName === 'all') {
      clearFilters();
      return;
    }

    selectCategory(categoryName);
  };

  return (
    <div
      className="relative min-h-screen pt-[72px]"
      style={{
        backgroundImage: "url('/backgrounds/1.jpg')",
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <PageContainer className="max-w-7xl py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            <span>作品库</span>
            <br />
            <span className="text-xs text-slate-500">Gallery</span>
          </h1>
        </div>

        <p className="text-sm text-white/80 font-medium mb-2">作品种类 / Category</p>

        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => handleCategoryClick('all')} className={`glass-btn relative ${!selectedCategory ? 'is-active' : ''}`}>
            {!selectedCategory && (
              <img
                src="/gallery-icons/28.gif"
                alt=""
                className="absolute -top-5 -left-0.5 w-10 h-7 object-contain pointer-events-none"
              />
            )}
            全部 / All
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`glass-btn relative ${selectedCategory === category ? 'is-active' : ''}`}
            >
              {selectedCategory === category && (
                <img
                  src="/gallery-icons/28.gif"
                  alt=""
                  className="absolute -top-5 -left-0.5 w-10 h-7 object-contain pointer-events-none"
                />
              )}
              {category}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <p className="text-sm text-white/80 font-medium mb-2">标签 / Tags</p>

          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const selected = selectedTags.includes(tag);

              return (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTags(
                      selected
                        ? selectedTags.filter((item) => item !== tag)
                        : [...selectedTags, tag],
                    )
                  }
                  className={`glass-btn relative ${selected ? 'is-active' : ''}`}
                >
                  {selected && (
                    <img
                      src="/gallery-icons/27.gif"
                      alt=""
                      className="absolute -top-5 -right-2 w-10 h-7 object-contain pointer-events-none"
                    />
                  )}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm text-white/80 font-medium mb-2">用途 / Usage</p>

          <div className="flex flex-wrap gap-2">
            {usages.map((usage) => {
              const selected = selectedUsages.includes(usage);

              return (
                <button
                  key={usage}
                  onClick={() =>
                    setSelectedUsages(
                      selected
                        ? selectedUsages.filter((item) => item !== usage)
                        : [...selectedUsages, usage],
                    )
                  }
                  className={`glass-btn relative ${selected ? 'is-active' : ''}`}
                >
                  {selected && (
                    <img
                      src="/gallery-icons/29.gif"
                      alt=""
                      className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-7 object-contain pointer-events-none"
                    />
                  )}
                  {usage}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

            <p className="text-slate-300">
              <span>加载中...</span>
              <br />
              <span className="text-xs text-slate-500">Loading...</span>
            </p>
          </div>
        ) : exhibits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibits.map((exhibit) => (
              <Card key={exhibit.id} exhibit={exhibit} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <img src="/icons/26.gif" alt="No works found" className="w-12 h-12 object-contain" />
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
              <span>没有找到作品</span>
              <br />
              <span className="text-xs text-slate-500">No works found</span>
            </h3>

            <p className="text-slate-400">
              <span>尝试更换筛选条件或搜索关键词</span>
              <br />
              <span className="text-xs text-slate-500">
                Try changing filter conditions or search keywords
              </span>
            </p>
          </div>
        )}
      </PageContainer>
    </div>
  );
}