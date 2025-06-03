import { Agora, ParticipantPosition } from '@/app/model/Agora';
import { AGORA_STATUS } from '@/constants/agora';
import { COLOR } from '@/constants/consts';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const storageKey = 'athens-chat-info';

interface EnterAgora extends Agora {
  userId?: number;
  role: ParticipantPosition;
  isCreator: boolean;
}

interface State {
  selectedAgora: Agora;
  enterAgora: EnterAgora;
}

interface Action {
  setEnterAgora: (agora: EnterAgora) => void;
  setSelectedAgora: (agora: Agora) => void;
  reset: () => void;
  enterAgoraReset: () => void;
}

const selectedAgoraInitialState: Agora = {
  id: 0,
  imageUrl: '',
  agoraTitle: '',
  status: AGORA_STATUS.CLOSED,
  agoraColor: COLOR[0].value,
};

const enterAgoraInitialState: EnterAgora = {
  id: 0,
  userId: 0,
  imageUrl: '',
  agoraTitle: '',
  status: AGORA_STATUS.CLOSED,
  role: ParticipantPosition.OBSERVER,
  isCreator: false,
  agoraColor: COLOR[0].value,
};

export const useAgora = create(
  persist<State & Action>(
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
