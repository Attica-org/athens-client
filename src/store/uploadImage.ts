import { create } from 'zustand';
import { ImageData } from '@/app/model/Agora';

interface State {
  uploadImage: ImageData;
  cropedPreview: ImageData;
}

interface Action {
  setCropedPreview: (cropedPreview: ImageData) => void;
  setUploadImage: (uploadImage: ImageData) => void;
  resetUploadImageState: () => void;
}

export const initialImage: ImageData = {
  dataUrl: '',
  file: new File([], 'image'),
};

const initialState: State = {
  uploadImage: initialImage,
  cropedPreview: initialImage,
};

export const useUploadImage = create<State & Action>((set) => ({
  ...initialState,
  setCropedPreview: (cropedPreview) => set({ cropedPreview }),
  setUploadImage: (uploadImage) => set({ uploadImage }),
  resetUploadImageState: () =>
    set({
      cropedPreview: initialImage,
      uploadImage: initialImage,
    }),
}));
