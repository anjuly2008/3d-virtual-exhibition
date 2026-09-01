//就是这个项目的“全局状态仓库”。
import { create } from 'zustand';
//Zustand 是一个状态管理库 多个组件、多个页面可以共同使用的状态
import type { Exhibit, Category } from '@/types';

interface AppStore {
  exhibits: Exhibit[];
  categories: Category[];
  selectedCategory: string | null;
  searchQuery: string;
  loading: boolean;//就是修改全局的 loading
  //这就是这个仓库的初始状态
  
  setExhibits: (exhibits: Exhibit[]) => void;
  setCategories: (categories: Category[]) => void;
  selectCategory: (category: string | null) => void;
  //把全局的 selectedCategory 改成传进来的 category
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  likeExhibit: (id: number) => void;
}
//这个全局仓库里面有哪些数据，以及有哪些修改数据的方法

export const useAppStore = create<AppStore>((set) => ({
  exhibits: [],
  categories: [],
  selectedCategory: null,
  searchQuery: '',
  loading: false,

  setExhibits: (exhibits) => set({ exhibits }),
  setCategories: (categories) => set({ categories }),
  selectCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLoading: (loading) => set({ loading }),
  likeExhibit: (id) => set((state) => ({
    //set()修改 Zustand 里面保存的状态  set((state)当前 Zustand 里面原来的整个状态
    exhibits: state.exhibits.map((exhibit) =>
      //state.exhibits.map把作品列表一个一个拿出来检查
      exhibit.id === id ? { ...exhibit, likes: exhibit.likes + 1 } : exhibit
    ),
  })),
}));