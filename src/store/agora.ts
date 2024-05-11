import { create } from 'zustand';

type Agora = {
  id: number,
  title: string,
};

interface AgoraState {
  selectedAgora: {
    id: number,
    title: string
  };
  setSelectedAgora: (agora: Agora) => void;
  reset: () => void;
}

// eslint-disable-next-line import/prefer-default-export
export const useAgora = create<AgoraState>((set) => ({
  selectedAgora: {
    id: 0,
    title: '',
  },
  setSelectedAgora(agora: Agora) {
    set({ selectedAgora: agora });
  },
  reset() {
    set({
      selectedAgora: {
        id: 0,
        title: '',
      },
    });
  },
}));
