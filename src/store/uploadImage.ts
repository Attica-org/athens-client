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
  resetUploadImageState: () => void;
}

const initialState: UploadImageState = {
  uploadImage: initialImage,
  cropedPreview: initialImage,
  setCropedPreview: () => {},
  setUploadImage: () => {},
  resetUploadImageState: () => {},
};

export const useUploadImage = create(
  immer<UploadImageState>((set) => ({
    ...initialState,
    setCropedPreview: (cropedPreview) => set({ cropedPreview }),
    setUploadImage: (uploadImage) => set({ uploadImage }),
    resetUploadImageState: () =>
      set({
        cropedPreview: initialImage,
        uploadImage: initialImage,
      }),
  })),
);
