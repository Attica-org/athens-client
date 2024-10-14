import { create } from 'zustand';

interface SearchState {
  search: string;
  setSearch: (search: string) => void;
  tabStatus: string;
  setTabStatus: (tabStatus: string) => void;
  reset: () => void;
}

// eslint-disable-next-line import/prefer-default-export
export const useSearchStore = create<SearchState>((set) => ({
  search: '',
  tabStatus: 'active',
  setSearch(search: string) {
    set({ search });
  },
  setTabStatus(tabStatus: string) {
    set({ tabStatus });
  },
  reset() {
    set({ search: '' });
  },
}));
