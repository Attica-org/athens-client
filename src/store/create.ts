import { create } from 'zustand';
import { AgoraConfig as State, AgoraTitle, Duration } from '@/app/model/Agora';
import { AGORA_CREATE } from '@/constants/agora';
import { COLOR, AGORACATEGORY, ColorValue } from '@/constants/consts';

const initialState: State = {
  title: '',
  category: '1',
  imageUrl: '',
  color: { idx: 0, value: COLOR[0].value },
  capacity: AGORA_CREATE.DEFAULT_PARTICIPANTS_CNT,
  duration: AGORA_CREATE.DEFAULT_TIME,
};

interface Action {
  setTitle: (title: AgoraTitle) => void;
  setImageUrl: (imageUrl: string) => void;
  setCategory: (category: keyof typeof AGORACATEGORY) => void;
  setColor: (color: ColorValue, idx: number) => void;
  setCapacity: (capacity: State['capacity']) => void;
  setDuration: (duration: Duration) => void;
  reset: () => void;
}

export const useCreateAgora = create<State & Action>((set) => ({
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
