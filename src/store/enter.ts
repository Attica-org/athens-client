import { create } from 'zustand';
import { ParticipantPosition, ProfileImage, UserName } from '@/app/model/Agora';
import { createJSONStorage, persist } from 'zustand/middleware';

const storageKey = 'athens-chat-user-profile';

interface State {
  nickname: UserName;
  message: string;
  selectedProfileImage: ProfileImage;
  selectedPosition: ParticipantPosition;
}

interface Action {
  setMessage: (message: string) => void;
  setNickname: (nickname: UserName) => void;
  setProfileImage: (profileImage: ProfileImage) => void;
  setSelectedPosition: (selectedPosition: ParticipantPosition) => void;
  reset: () => void;
}

const initialState: State = {
  nickname: '',
  message: '관찰자는 프로필을 설정할 수 없습니다.',
  selectedProfileImage: {
    id: 1,
    name: '도끼 든 회색 곰',
    file: 'bear.png',
  },
  selectedPosition: ParticipantPosition.OBSERVER,
};

export const useEnter = create(
  persist<State & Action>(
    (set) => ({
      ...initialState,
      setMessage: (message) => set({ message }),
      setSelectedPosition: (selectedPosition: ParticipantPosition) =>
        set({ selectedPosition }),
      setNickname: (nickname) => set({ nickname }),
      setProfileImage: (profileImage: ProfileImage) =>
        set({ selectedProfileImage: profileImage }),
      reset: () =>
        set({
          nickname: '',
          message: '관찰자는 프로필을 설정할 수 없습니다.',
          selectedProfileImage: {
            id: 1,
            name: '도끼 든 회색 곰',
            file: 'bear.png',
          },
          selectedPosition: ParticipantPosition.OBSERVER,
        }),
    }),
    {
      name: storageKey,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
