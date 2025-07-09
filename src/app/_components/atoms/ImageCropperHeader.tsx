import React, { KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import BackIcon from '@/assets/icons/BackIcon';
import CheckIcon from '@/assets/icons/CheckIcon';
import { initialImage, useUploadImage } from '@/store/uploadImage';
import { useShallow } from 'zustand/react/shallow';

type CropImgHeaderProps = {
  handleImgCrop: () => void;
  movePage: () => void;
  handleKeyDownImgCrop: (e: KeyboardEvent<HTMLButtonElement>) => void;
};

export default function ImageCropperHeader({
  handleImgCrop,
  handleKeyDownImgCrop,
  movePage,
}: CropImgHeaderProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const { resetUploadImageState, setUploadImage } = useUploadImage(
    useShallow((state) => ({
      uploadImage: state.uploadImage,
      setUploadImage: state.setUploadImage,
      setCropedPreview: state.setCropedPreview,
      resetUploadImageState: state.resetUploadImageState,
    })),
  );

  useEffect(() => {
    cancelButtonRef.current?.focus();
  }, []);

  const handleCancelCrop = useCallback(() => {
    setUploadImage(initialImage);
    movePage();
  }, []);

  const handleKeyDownCancelCrop = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter') {
        resetUploadImageState();
      }
    },
    [handleCancelCrop],
  );

  return (
    <header
      aria-label="이미지 자르기 작업 메뉴"
      className="dark:text-dark-line-light text-dark-bg-dark font-semibold flex flex-row justify-between items-center p-10"
    >
      <button
        ref={cancelButtonRef}
        type="button"
        aria-label="이미지 변경 취소하기"
        className="font-normal flex items-center gap-x-5 flex-grow basis-1/3 focus:focus-sr"
        onClick={handleCancelCrop}
        onKeyDown={handleKeyDownCancelCrop}
      >
        <BackIcon className="w-20 h-20 " />
        취소
      </button>
      <h1 className="flex flex-grow basis-1/3 justify-center items-center ">
        자르기
      </h1>
      <button
        className="flex flex-grow basis-1/3 justify-end items-center"
        aria-label="이미지 변경 완료"
        onClick={handleImgCrop}
        onKeyDown={handleKeyDownImgCrop}
        type="button"
      >
        <CheckIcon className="w-25 h-25" />
      </button>
    </header>
  );
}

// export default React.memo(ImageCropperHeader);
