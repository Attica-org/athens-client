import { AgoraTabStatus } from '@/app/model/Agora';
import { create } from 'zustand';

interface SearchState {
  search: string;
  setSearch: (search: string) => void;
  tabStatus: AgoraTabStatus;
  setTabStatus: (tabStatus: AgoraTabStatus) => void;
  reset: () => void;
}

// eslint-disable-next-line import/prefer-default-export
export const useSearchStore = create<SearchState>((set) => ({
  search: '',
  tabStatus: AgoraTabStatus.ACTIVE,
  setSearch(search) {
    set({ search });
  },
  setTabStatus(tabStatus) {
    set({ tabStatus });
  },
  reset() {
    set({ search: '' });
  },
}));
