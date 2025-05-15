'use client';

import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactCrop, {
  Crop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import getCroppedImg from '@/utils/getCroppedImg';
import { initialImage, useUploadImage } from '@/store/uploadImage';
import { useShallow } from 'zustand/react/shallow';
import { useRouter } from 'next/navigation';
import showToast from '@/utils/showToast';
import isNull from '@/utils/validation/validateIsNull';
import Loading from '../atoms/loading';
import ImageRenderer from '../atoms/ImageRenderer';
import ImageCropperHeader from '../atoms/ImageCropperHeader';

export default function ImageCropper() {
  const [crop, setCrop] = useState<Crop>();
  const [makeCrop, setMakeCrop] = useState<Crop>();
  const [opacity, setOpacity] = useState('opacity-0');
  const imgRef = useRef<HTMLImageElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const {
    uploadImage,
    setCropedPreview,
    resetUploadImageState,
    setUploadImage,
  } = useUploadImage(
    useShallow((state) => ({
      uploadImage: state.uploadImage,
      setUploadImage: state.setUploadImage,
      setCropedPreview: state.setCropedPreview,
      resetUploadImageState: state.resetUploadImageState,
    })),
  );
  const router = useRouter();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

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

  const handleImgCrop = useCallback(async () => {
    setLoading(true);

    try {
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          if (
            isNull(imgRef.current) ||
            isNull(canvasRef.current) ||
            isNull(makeCrop)
          ) {
            return;
          }

          const croppedImage = await getCroppedImg(
            imgRef.current,
            canvasRef.current,
            convertToPixelCrop(
              makeCrop,
              imgRef.current?.width,
              imgRef.current?.height,
            ),
            'image/jpeg',
            0.9, // 90% 품질의 JPEG로 변환
          );

          setCropedPreview({
            dataUrl: croppedImage,
            file: new File([croppedImage], 'image.jpeg', {
              type: 'image/jpeg',
            }),
          });

          resolve();
        }, 0); // 다음 이벤트 루프에서 실행
      });
    } catch (error) {
      showToast('이미지 자르기에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
      router.back();
    }
  }, [makeCrop]);

  const handleKeyDownImgCrop = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter') {
        handleImgCrop();
      }
    },
    [handleImgCrop],
  );

  const handleCancelCrop = useCallback(() => {
    setUploadImage(initialImage);
    router.back();
  }, []);

  const handleKeyDownCancelCrop = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter') {
        resetUploadImageState();
      }
    },
    [handleCancelCrop],
  );

  function setInitialFocus() {
    cancelButtonRef.current?.focus();
  }

  useEffect(() => {
    setOpacity('opacity-100');
    setInitialFocus();
  }, []);

  const renderMedia = (file: { dataUrl: string; file: File }) => {
    const fileType = file.file.type.split('/')[0];

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
  };

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
            ref={cancelButtonRef}
            handleCancelCrop={handleCancelCrop}
            handleImgCrop={handleImgCrop}
            handleKeyDownCancelCrop={handleKeyDownCancelCrop}
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
              {!isNull(uploadImage.dataUrl) && renderMedia(uploadImage)}
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
