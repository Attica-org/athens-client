import 'client-only';

import BackIcon from '@/assets/icons/BackIcon';
import CheckIcon from '@/assets/icons/CheckIcon';
import Image from 'next/image';
import React, { KeyboardEvent, useRef, useState } from 'react';
import ReactCrop, {
  Crop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import getCroppedImg from '@/utils/getCroppedImg';
import { createPortal } from 'react-dom';

type Props = {
  uploadImage: Array<{ dataUrl: string; file: File }>;
  setCropedPreview: React.Dispatch<
    React.SetStateAction<Array<{ dataUrl: string; file: File }>>
  >;
  onCancelCrop: () => void;
};

export default function ImageCropper({
  uploadImage,
  setCropedPreview,
  onCancelCrop,
}: Props) {
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const handleImgCrop = () => {
    if (!imgRef.current || !canvasRef.current || !crop) {
      return;
    }

    getCroppedImg(
      imgRef.current,
      canvasRef.current,
      convertToPixelCrop(crop, imgRef.current?.width, imgRef.current?.height),
    );
    const dataUrl = canvasRef.current.toDataURL();
    const file = new File([dataUrl], 'image');
    setCropedPreview([{ dataUrl, file }]);
    onCancelCrop();
  };

  const handleKeyDownImgCrop = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') {
      handleImgCrop();
    }
  };

  const handleKeyDownCancelCrop = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') {
      onCancelCrop();
    }
  };

  const modalContent = (
    <div className="flex flex-col z-50 fixed top-0 left-0 w-screen h-screen bg-dark-bg-dark">
      <div className="text-dark-line-light font-semibold flex justify-between items-center p-10">
        <button
          type="button"
          aria-label="이미지 변경 취소하기"
          className="font-normal flex items-center gap-x-5"
          onClick={onCancelCrop}
          onKeyDown={handleKeyDownCancelCrop}
        >
          <BackIcon className="w-20 h-20" />
          취소
        </button>
        자르기
        <button
          aria-label="이미지 변경 완료"
          onClick={handleImgCrop}
          onKeyDown={handleKeyDownImgCrop}
          type="button"
        >
          <CheckIcon className="w-25 h-25" fill="#fffff" />
        </button>
      </div>
      <div className="w-full h-full flex flex-1 justify-center items-center p-32">
        <ReactCrop
          crop={crop}
          aspect={1}
          keepSelection
          onChange={(newCrop) => setCrop(newCrop)}
          className="w-fit h-fit"
        >
          <Image
            aria-label="선택한 이미지"
            ref={imgRef}
            onLoad={({ currentTarget }) => onImageLoaded(currentTarget)}
            src={uploadImage[0].dataUrl}
            alt="preview"
            width={500}
            height={500}
            style={{ height: '100%', width: '100%' }}
          />
        </ReactCrop>
      </div>
      {crop && (
        <canvas
          aria-hidden
          ref={canvasRef}
          className="mt-12"
          style={{
            display: 'none',
            border: '1px solid #000',
            objectFit: 'contain',
            width: Math.round(crop.width ?? 0),
            height: Math.round(crop.height ?? 0),
          }}
        />
      )}
    </div>
  );

  return createPortal(modalContent, document.body); // 포탈로 모달을 body로 이동
}
