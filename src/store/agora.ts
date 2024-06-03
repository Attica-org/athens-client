import { create } from 'zustand';

type Agora = {
  id: number,
  title: string,
  status: string,
};

interface AgoraState {
  selectedAgora: {
    id: number,
    title: string
    status: string
  };
  enterAgora: {
    id: number,
    title: string,
    status: string,
  }
  setEnterAgora: (agora: Agora) => void;
  setSelectedAgora: (agora: Agora) => void;
  reset: () => void;
}

// eslint-disable-next-line import/prefer-default-export
export const useAgora = create<AgoraState>((set) => ({
  selectedAgora: {
    id: 0,
    title: '',
    status: '',
  },
  enterAgora: {
    id: 0,
    title: '',
    status: '',
  },
  setEnterAgora(agora: Agora) {
    set({ enterAgora: agora });
  },
  setSelectedAgora(agora: Agora) {
    set({ selectedAgora: agora });
  },
  reset() {
    set({
      selectedAgora: {
        id: 0,
        title: '',
        status: '',
      },
    });
  },
}));
