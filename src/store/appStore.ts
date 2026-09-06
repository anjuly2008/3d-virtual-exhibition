import { create } from 'zustand';
import type { Exhibit, Category } from '@/types';

interface AppStore {
  exhibits: Exhibit[];
  categories: Category[];
  selectedCategory: string | null;
  selectedTags: string[];
  selectedUsages: string[];
  searchQuery: string;
  loading: boolean;

  setExhibits: (exhibits: Exhibit[]) => void;
  setCategories: (categories: Category[]) => void;
  selectCategory: (category: string | null) => void;
  setSelectedTags: (tags: string[]) => void;
  setSelectedUsages: (usages: string[]) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  likeExhibit: (id: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  exhibits: [],
  categories: [],
  selectedCategory: null,
  selectedTags: [],
  selectedUsages: [],
  searchQuery: '',
  loading: false,

  setExhibits: (exhibits) => set({ exhibits }),
  setCategories: (categories) => set({ categories }),
  selectCategory: (category) => set({ selectedCategory: category }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  setSelectedUsages: (usages) => set({ selectedUsages: usages }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  clearFilters: () =>
    set({
      selectedCategory: null,
      selectedTags: [],
      selectedUsages: [],
      searchQuery: '',
    }),

  setLoading: (loading) => set({ loading }),

  likeExhibit: (id) =>
    set((state) => ({
      exhibits: state.exhibits.map((exhibit) =>
        exhibit.id === id
          ? { ...exhibit, likes: exhibit.likes + 1 }
          : exhibit
      ),
    })),
}));