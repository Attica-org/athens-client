import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ParticipationPosition, ProfileImage } from '@/app/model/Agora';
import { AGORA_POSITION } from '@/constants/agora';

interface EnterState {
  nickname: string;
  message: string;
  selectedProfileImage: ProfileImage;
  selectedPosition: ParticipationPosition;
  setMessage: (message: string) => void;
  setNickname: (nickname: string) => void;
  setProfileImage: (profileImage: ProfileImage) => void;
  setSelectedPosition: (selectedPosition: ParticipationPosition) => void;
  reset: () => void;
}

const initialState: EnterState = {
  nickname: '',
  message: '관찰자는 프로필을 설정할 수 없습니다.',
  selectedProfileImage: {
    id: 1,
    name: '도끼 든 회색 곰',
    file: 'bear.png',
  },
  selectedPosition: AGORA_POSITION.OBSERVER,
  setMessage: () => {},
  setSelectedPosition: () => {},
  setNickname: () => {},
  setProfileImage: () => {},
  reset: () => {},
};

// eslint-disable-next-line import/prefer-default-export
export const useEnter = create(
  immer<EnterState>((set) => ({
    ...initialState,
    setMessage: (message: string) => set({ message }),
    setSelectedPosition: (selectedPosition: ParticipationPosition) =>
      set({ selectedPosition }),
    setNickname: (nickname: string) => set({ nickname }),
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
        selectedPosition: AGORA_POSITION.OBSERVER,
      }),
  })),
);
