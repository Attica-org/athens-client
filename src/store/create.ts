import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { AgoraConfig } from '@/app/model/Agora';
import { AGORA_CREATE } from '@/constants/agora';
import { COLOR } from '@/constants/consts';

interface AgoraState extends AgoraConfig {
  setTitle: (title: string) => void;
  setImageUrl: (imageUrl: string) => void;
  setCategory: (category: string) => void;
  setColor: (color: string, idx: number) => void;
  setCapacity: (capacity: number) => void;
  setDuration: (duration: number | null) => void;
  reset: () => void;
}

const initialState: AgoraState = {
  title: '',
  category: '1',
  imageUrl: '',
  color: { idx: 0, value: COLOR[0].value },
  capacity: AGORA_CREATE.DEFAULT_PARTICIPANTS_CNT,
  duration: AGORA_CREATE.DEFAULT_TIME,
  setTitle: () => {},
  setImageUrl: () => {},
  setCategory: () => {},
  setColor: () => {},
  setCapacity: () => {},
  setDuration: () => {},
  reset: () => {},
};

// eslint-disable-next-line import/prefer-default-export
export const useCreateAgora = create(
  immer<AgoraState>((set) => ({
    ...initialState,
    setTitle: (title: string) => set({ title }),
    setImageUrl: (imageUrl: string) => set({ imageUrl }),
    setCategory: (category: string) => set({ category }),
    setColor: (color: string, idx: number) =>
      set({
        color: {
          idx,
          value: color,
        },
      }),
    setCapacity: (capacity: number) => set({ capacity }),
    setDuration: (duration: number | null) => set({ duration }),
    reset: () =>
      set({
        title: '',
        imageUrl: '',
        category: '1',
        color: { idx: 0, value: COLOR[0].value },
        capacity: AGORA_CREATE.DEFAULT_PARTICIPANTS_CNT,
        duration: AGORA_CREATE.DEFAULT_TIME,
      }),
  })),
);
