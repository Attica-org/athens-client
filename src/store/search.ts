import { create } from 'zustand';

interface SearchState {
  search: string;
  setSearch: (search: string) => void;
  reset: () => void;
}

// eslint-disable-next-line import/prefer-default-export
export const useSearchStore = create<SearchState>((set) => ({
  search: '',
  setSearch(search: string) {
    set({ search });
  },
  reset() {
    set({ search: '' });
  },
}));
