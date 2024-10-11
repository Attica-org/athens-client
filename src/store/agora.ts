import COLOR from '@/constants/agoraColor';
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
  thumbnail: string;
  title: string;
  status: string;
  role: string;
  isCreator: boolean;
  agoraColor: string;
};

interface AgoraState {
  selectedAgora: {
    id: number;
    thumbnail: string;
    title: string;
    status: string;
    agoraColor: string;
  };
  enterAgora: {
    id: number;
    thumbnail: string;
    title: string;
    status: string;
    role: string;
    isCreator: boolean;
    agoraColor: string;
  };
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
    thumbnail: '',
    title: '',
    status: '',
    role: '',
    isCreator: false,
    agoraColor: COLOR[0].value,
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
        thumbnail: '',
        title: '',
        status: '',
        agoraColor: COLOR[0].value,
      },
    });
  },
}));
