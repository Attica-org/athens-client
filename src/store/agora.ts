import { COLOR } from '@/constants/consts';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
  enterAgoraReset: () => void;
}

const storageKey = 'athens-chat-info';

const selectedAgoraInitialState: Agora = {
  id: 0,
  thumbnail: '',
  title: '',
  status: '',
  agoraColor: COLOR[0].value,
};

const enterAgoraInitialState: EnterAgora = {
  id: 0,
  userId: 0,
  thumbnail: '',
  title: '',
  status: '',
  role: '',
  isCreator: false,
  agoraColor: COLOR[0].value,
};

// eslint-disable-next-line import/prefer-default-export
export const useAgora = create(
  persist<AgoraState>(
    (set) => ({
      selectedAgora: selectedAgoraInitialState,
      enterAgora: enterAgoraInitialState,
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
          selectedAgora: selectedAgoraInitialState,
        });
      },
      enterAgoraReset() {
        set({
          enterAgora: enterAgoraInitialState,
        });
      },
    }),
    {
      name: storageKey,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
