import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  DEFAULT_PARTICIPANTS_CNT,
  DEFAULT_TIME,
} from '@/constants/createAgora';

interface AgoraState {
  title: string;
  category: string;
  color: string;
  capacity: number;
  duration: number | null;
  setTitle: (title: string) => void;
  setCategory: (category: string) => void;
  setColor: (color: string) => void;
  setCapacity: (capacity: number) => void;
  setDuration: (duration: number | null) => void;
  reset: () => void;
}

const initialState: AgoraState = {
  title: '',
  category: '1',
  color: 'agora-point-color1',
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
    setColor: (color: string) => set({ color }),
    setCapacity: (capacity: number) => set({ capacity }),
    setDuration: (duration: number | null) => set({ duration }),
    reset: () =>
      set({
        title: '',
        category: '',
        color: '',
        capacity: DEFAULT_PARTICIPANTS_CNT,
        duration: DEFAULT_TIME,
      }),
  })),
);
