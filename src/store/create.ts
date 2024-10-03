import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  DEFAULT_PARTICIPANTS_CNT,
  DEFAULT_TIME,
} from '@/constants/createAgora';
import COLOR from '@/constants/agoraColor';
import { AgoraConfig } from '@/app/model/Agora';

interface AgoraState extends AgoraConfig {
  setTitle: (title: string) => void;
  setCategory: (category: string) => void;
  setColor: (color: string, idx: number) => void;
  setCapacity: (capacity: number) => void;
  setDuration: (duration: number | null) => void;
  reset: () => void;
}

const initialState: AgoraState = {
  title: '',
  category: '1',
  color: { idx: 0, value: COLOR[0].value },
  capacity: DEFAULT_PARTICIPANTS_CNT,
  duration: DEFAULT_TIME,
  setTitle: () => {},
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
        category: '1',
        color: { idx: 0, value: COLOR[0].value },
        capacity: DEFAULT_PARTICIPANTS_CNT,
        duration: DEFAULT_TIME,
      }),
  })),
);
