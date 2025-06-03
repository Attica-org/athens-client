import { create } from 'zustand';
import { AgoraConfig, AgoraTitle, Duration } from '@/app/model/Agora';
import { AGORA_CREATE } from '@/constants/agora';
import { COLOR, AGORACATEGORY, ColorValue } from '@/constants/consts';

interface AgoraState extends AgoraConfig {
  setTitle: (title: AgoraTitle) => void;
  setImageUrl: (imageUrl: string) => void;
  setCategory: (category: keyof typeof AGORACATEGORY) => void;
  setColor: (color: ColorValue, idx: number) => void;
  setCapacity: (capacity: AgoraConfig['capacity']) => void;
  setDuration: (duration: Duration) => void;
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

export const useCreateAgora = create<AgoraState>((set) => ({
  ...initialState,
  setTitle: (title) => set({ title }),
  setImageUrl: (imageUrl) => set({ imageUrl }),
  setCategory: (category) => set({ category }),
  setColor: (color, idx) =>
    set({
      color: {
        idx,
        value: color,
      },
    }),
  setCapacity: (capacity) => set({ capacity }),
  setDuration: (duration) => set({ duration }),
  reset: () =>
    set({
      title: '',
      imageUrl: '',
      category: '1',
      color: { idx: 0, value: COLOR[0].value },
      capacity: AGORA_CREATE.DEFAULT_PARTICIPANTS_CNT,
      duration: AGORA_CREATE.DEFAULT_TIME,
    }),
}));
