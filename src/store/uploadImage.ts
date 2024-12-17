import { create } from 'zustand';
import { ImageData } from '@/app/model/Agora';
import { immer } from 'zustand/middleware/immer';

export const initialImage: ImageData = {
  dataUrl: '',
  file: new File([], 'image'),
};

interface UploadImageState {
  uploadImage: ImageData;
  cropedPreview: ImageData;
  setCropedPreview: (cropedPreview: ImageData) => void;
  setUploadImage: (uploadImage: ImageData) => void;
  cancleCrop: () => void;
}

const initialState: UploadImageState = {
  uploadImage: initialImage,
  cropedPreview: initialImage,
  setCropedPreview: () => {},
  setUploadImage: () => {},
  cancleCrop: () => {},
};

export const useUploadImage = create(
  immer<UploadImageState>((set) => ({
    ...initialState,
    setCropedPreview: (cropedPreview: ImageData) => set({ cropedPreview }),
    setUploadImage: (uploadImage: ImageData) => set({ uploadImage }),
    cancleCrop: () =>
      set({
        cropedPreview: initialImage,
        uploadImage: initialImage,
      }),
  })),
);
