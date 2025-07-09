import { useUploadImage } from '@/store/uploadImage';
import { Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { useShallow } from 'zustand/react/shallow';
import React from 'react';
import ImageRenderer from './ImageRenderer';

type RenderMediaProps = {
  file: { dataUrl: string; file: File };
  imgRef: React.RefObject<HTMLImageElement>;
  setCrop: React.Dispatch<Crop>;
};

export function RenderMedia({ file, imgRef, setCrop }: RenderMediaProps) {
  const { setCropedPreview, resetUploadImageState } = useUploadImage(
    useShallow((state) => ({
      setCropedPreview: state.setCropedPreview,
      resetUploadImageState: state.resetUploadImageState,
    })),
  );
  const fileType = file.file.type.split('/')[0];

  const onImageLoaded = (e: HTMLImageElement) => {
    const { width, height } = e;
    const maxSize = Math.min(width, height);

    const initialCrop: Crop = centerCrop(
      makeAspectCrop(
        {
          unit: 'px', // 픽셀 단위로 설정
          width: maxSize,
          height: maxSize,
        },
        1, // 1:1 비율 (정사각형)
        width,
        height,
      ),
      width,
      height,
    );

    setCrop(initialCrop);
    return false;
  };

  if (fileType === 'image') {
    return (
      <ImageRenderer
        file={file}
        imgRef={imgRef}
        onImageLoaded={onImageLoaded}
      />
    );
  }
  if (file.file.type === 'image/gif') {
    setCropedPreview(file);
    resetUploadImageState();
  }

  return null; // 이미지 또는 비디오가 아닌 파일이 선택된 경우
}
