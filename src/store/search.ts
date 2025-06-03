import { AgoraTabStatus } from '@/app/model/Agora';
import { create } from 'zustand';

interface State {
  search: string;
  tabStatus: AgoraTabStatus;
}

interface Action {
  setSearch: (search: string) => void;
  setTabStatus: (tabStatus: AgoraTabStatus) => void;
  reset: () => void;
}

const initialState: State = {
  search: '',
  tabStatus: AgoraTabStatus.ACTIVE,
};

export const useSearchStore = create<State & Action>((set) => ({
  ...initialState,
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
