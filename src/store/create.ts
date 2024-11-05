import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { AgoraConfig } from '@/app/model/Agora';
import { AGORA_CREATE } from '@/constants/Agora';
import { COLOR } from '@/constants/consts';

interface AgoraState extends AgoraConfig {
  setTitle: (title: string) => void;
  setThumbnail: (thumbnail: string) => void;
  setCategory: (category: string) => void;
  setColor: (color: string, idx: number) => void;
  setCapacity: (capacity: number) => void;
  setDuration: (duration: number | null) => void;
  reset: () => void;
}

const initialState: AgoraState = {
  title: '',
  category: '1',
  thumbnail: '',
  color: { idx: 0, value: COLOR[0].value },
  capacity: AGORA_CREATE.DEFAULT_PARTICIPANTS_CNT,
  duration: AGORA_CREATE.DEFAULT_TIME,
  setTitle: () => {},
  setThumbnail: () => {},
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
    setThumbnail: (thumbnail: string) => set({ thumbnail }),
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
        thumbnail: '',
        category: '1',
        color: { idx: 0, value: COLOR[0].value },
        capacity: AGORA_CREATE.DEFAULT_PARTICIPANTS_CNT,
        duration: AGORA_CREATE.DEFAULT_TIME,
      }),
  })),
);
