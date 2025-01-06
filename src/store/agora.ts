import { COLOR } from '@/constants/consts';
import { create } from 'zustand';

type Agora = {
  id: number;
  thumbnail: string;
  title: string;
  status: string;
  agoraColor: string;
};

type EnterAgora = {
  id: number;
  userId?: number;
  thumbnail: string;
  title: string;
  status: string;
  role: string;
  isCreator: boolean;
  agoraColor: string;
};

interface AgoraState {
  selectedAgora: Agora;
  enterAgora: EnterAgora;
  setEnterAgora: (agora: EnterAgora) => void;
  setSelectedAgora: (agora: Agora) => void;
  reset: () => void;
}

// eslint-disable-next-line import/prefer-default-export
export const useAgora = create<AgoraState>((set) => ({
  selectedAgora: {
    id: 0,
    thumbnail: '',
    title: '',
    status: '',
    agoraColor: COLOR[0].value,
  },
  enterAgora: {
    id: 0,
    userId: 0,
    thumbnail: '',
    title: '',
    status: '',
    role: '',
    isCreator: false,
    agoraColor: COLOR[0].value,
  },
  setEnterAgora(agora: EnterAgora) {
    set((state) => ({
      enterAgora: {
        ...state.enterAgora,
        ...agora,
        userId: agora.userId ?? 0,
      },
    }));
  },
  setSelectedAgora(agora: Agora) {
    set({ selectedAgora: agora });
  },
  reset() {
    set({
      selectedAgora: {
        id: 0,
        thumbnail: '',
        title: '',
        status: '',
        agoraColor: COLOR[0].value,
      },
    });
  },
}));
