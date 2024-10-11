'only client';

import CameraIcon from '@/assets/icons/CameraIcon';
import ImageIcon from '@/assets/icons/ImageIcon';
import Image from 'next/image';
import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import ImageCropper from '../atoms/ImageCropper';

type Props = {
  image?: string;
  setPreView: React.Dispatch<Array<{ dataUrl: string; file: File }>>;
  preView: Array<{ dataUrl: string; file: File }>;
};

export default function AgoraImageUpload({
  image = '',
  setPreView,
  preView,
}: Props) {
  const [uploadImage, setUploadImage] = useState<
    Array<{ dataUrl: string; file: File }>
  >(image ? [{ dataUrl: image, file: new File([], 'image') }] : []);
  const [viewPopup, setViewPopup] = useState(false);
  const [viewCropModal, setViewCropModal] = useState(false);
  const [popupPosition, setPopupPosition] = useState('top');
  const imageRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const onUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();

    if (e.target.files) {
      Array.from(e.target.files).forEach((file, idx) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadImage((prevView) => {
            const prev = [...prevView];
            prev[idx] = {
              dataUrl: reader.result as string,
              file,
            };
            return prev;
          });
          setViewCropModal(true);
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    }
  };

  const clickFileInput = () => {
    imageRef.current?.click();
    setViewPopup(false);
  };

  const onCancelCrop = () => {
    setViewCropModal(false);
  };

  const removeImage = () => {
    setUploadImage([]);
    setPreView([]);
    setViewPopup(false);
  };

  useEffect(() => {
    if (preView.length === 0 && uploadImage.length) {
      removeImage();
    }
  }, [preView, uploadImage]);

  const calculatePopupPosition = () => {
    if (popupRef.current) {
      const popupTop = popupRef.current.getBoundingClientRect().top;
      const popupBottom =
        window.innerHeight - popupRef.current.getBoundingClientRect().bottom;

      if (popupTop < popupBottom) {
        setPopupPosition('bottom');
      } else {
        setPopupPosition('top');
      }
    }
  };

  const viewPopupHandler = () => {
    calculatePopupPosition();
    setViewPopup(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setViewPopup(false);
    }
  };

  const handlleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setViewPopup(false);
    }
  };

  useEffect(() => {
    if (viewPopup) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handlleKeyDown);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handlleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handlleKeyDown);
    };
  }, [viewPopup]);

  const handleKeyDownPopupHandler: KeyboardEventHandler<HTMLDivElement> = (
    e,
  ) => {
    if (e.key === 'Enter') {
      viewPopupHandler();
    }
  };

  return (
    <>
      <div className="relative">
        <div
          role="button"
          tabIndex={0}
          aria-label="클릭하여 아고라 프로필 설정"
          ref={popupRef}
          className="relative w-60 h-60 rounded-3xl under-mobile:rounded-2xl cursor-pointer"
          onClick={viewPopupHandler}
          onKeyDown={handleKeyDownPopupHandler}
        >
          {preView[0]?.dataUrl || image ? (
            <Image
              src={preView[0]?.dataUrl ?? image}
              alt="아고라 프로필"
              layout="fill"
              objectFit="cover"
              className="rounded-3xl under-mobile:rounded-2xl"
            />
          ) : (
            <div
              aria-hidden
              className="flex justify-center items-center h-full w-full dark:bg-dark-light-500 bg-gray-200 rounded-3xl under-mobile:rounded-2xl"
            >
              <ImageIcon className="w-22 h-22" />
            </div>
          )}
          <input
            type="file"
            accept=".png, .jpeg, .jpg"
            ref={imageRef}
            onChange={onUpload}
            hidden
          />
          <div
            aria-hidden
            className="flex justify-center items-center absolute top-40 left-40 w-22 h-22 rounded-full bg-dark-line-semilight"
          >
            <CameraIcon className="w-14 h-14" fill="#fffff" />
          </div>
        </div>
        <div
          role="menu"
          aria-label="이미지 선택 및 제거 선택 팝업메뉴"
          ref={popupRef}
          className={`transform transition-opacity duration-300 ease-out ${viewPopup ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'} cursor-pointer rounded-md gap-20 flex flex-col absolute ${popupPosition === 'top' ? 'bottom-10' : 'top-1/2'} left-50 p-10 dark:bg-dark-light-200 bg-dark-light-500 text-white text-xs`}
        >
          <button
            role="menuitem"
            type="button"
            className="break-keep"
            onClick={clickFileInput}
          >
            이미지 선택
          </button>
          <button
            role="menuitem"
            type="button"
            className="break-keep"
            onClick={removeImage}
          >
            이미지 제거
          </button>
        </div>
      </div>
      {viewCropModal && (
        <ImageCropper
          uploadImage={uploadImage}
          setCropedPreview={setPreView}
          onCancelCrop={onCancelCrop}
        />
      )}
    </>
  );
}
