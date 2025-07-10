'use client';

import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useUploadImage } from '@/store/uploadImage';
import { useShallow } from 'zustand/react/shallow';
import isNull from '@/utils/validation/validateIsNull';
import { useHandleImgCrop } from '@/hooks/useHandleImgCrop';
import Loading from '../atoms/loading';
import ImageCropperHeader from '../atoms/ImageCropperHeader';
import RenderMedia from '../atoms/RenderMedia';

export default function ImageCropper() {
  const [crop, setCrop] = useState<Crop>();
  const [opacity, setOpacity] = useState('opacity-0');
  const imgRef = useRef<HTMLImageElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [makeCrop, setMakeCrop] = useState<Crop>();
  const { uploadImage, setCropedPreview } = useUploadImage(
    useShallow((state) => ({
      uploadImage: state.uploadImage,
      setCropedPreview: state.setCropedPreview,
    })),
  );

  const { loading, handleImgCrop } = useHandleImgCrop(setCropedPreview);

  const cropUserCustomImage = useCallback(() => {
    if (!isNull(makeCrop)) {
      handleImgCrop({ makeCrop, imgRef, canvasRef });
    }
  }, [makeCrop, handleImgCrop]);

  const handleKeyDownImgCrop = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter') {
        cropUserCustomImage();
      }
    },
    [cropUserCustomImage],
  );

  useEffect(() => {
    setOpacity('opacity-100');
  }, []);

  return (
    <>
      <div
        ref={dialogRef}
        id="agora-profile-image-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="이미지 자르기 창"
        aria-describedby="이미지를 원하는 영역으로 자르고 완료 버튼을 눌러주세요."
        className="flex flex-col z-50 fixed top-0 left-0 w-full h-full dark:bg-dark-bg-dark bg-dark-line-light"
      >
        <main
          className={`${opacity} transition duration-300 transform scale-100 h-full w-full`}
        >
          <ImageCropperHeader
            handleImgCrop={cropUserCustomImage}
            handleKeyDownImgCrop={handleKeyDownImgCrop}
          />
          <section
            aria-label="이미지 영역"
            className="w-full h-full flex justify-center items-center pb-25"
          >
            <ReactCrop
              crop={crop}
              aspect={1}
              keepSelection
              ruleOfThirds
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={(newCrop) => setMakeCrop(newCrop)}
              className="w-fit h-fit"
              aria-label="이미지 자르기"
            >
              {!isNull(uploadImage.dataUrl) && (
                <RenderMedia
                  file={uploadImage}
                  imgRef={imgRef}
                  setCrop={setCrop}
                />
              )}
            </ReactCrop>
          </section>
          <div>
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
        </main>
      </div>
      {loading && (
        <div className="min-w-300 w-full h-full flex absolute justify-center items-center z-50 top-0 right-0 left-0 bottom-0 bg-opacity-50 bg-dark-bg-dark">
          <Loading
            w="20"
            h="20"
            className="m-2 flex justify-center items-center"
          />
        </div>
      )}
    </>
  );
}
