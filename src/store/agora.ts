import { create } from 'zustand';

type Agora = {
  id: number,
  title: string,
  status: string,
};

type EnterAgora = {
  id: number,
  title: string,
  status: string,
  role: string,
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
    role: string,
  }
  setEnterAgora: (agora: EnterAgora) => void;
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
    role: '',
  },
  setEnterAgora(agora: EnterAgora) {
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
