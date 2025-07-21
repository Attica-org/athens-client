import CameraIcon from '@/assets/icons/CameraIcon';
import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import isNull from '@/utils/validation/validateIsNull';
import { initialImage, useUploadImage } from '@/store/uploadImage';
import { useShallow } from 'zustand/react/shallow';
import { calculatePopupPosition } from '@/utils/calculatePopupPosition';
import { useAgoraImageUploadAction } from '@/hooks/useAgoraImageUploadAction';
import AgoraImage from '../atoms/AgoraImage';
import { AgoraImageUploadPopup } from '../molecules/AgoraImageUploadPopup';

type Props = {
  image?: string;
  page?: string;
  color?: string;
};

export default function AgoraImageUpload({ image = '', page, color }: Props) {
  const { uploadImage, setUploadImage, cropedPreview, setCropedPreview } =
    useUploadImage(
      useShallow((state) => ({
        uploadImage: state.uploadImage,
        setUploadImage: state.setUploadImage,
        cropedPreview: state.cropedPreview,
        setCropedPreview: state.setCropedPreview,
      })),
    );

  const [viewPopup, setViewPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<'top' | 'bottom'>('top');
  const imageRef = useRef<HTMLInputElement>(null);
  const imageBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (image) {
      setUploadImage({ dataUrl: image, file: new File([image], 'image') });
    }
  }, [image, setUploadImage]);

  const onUploadAction = useAgoraImageUploadAction({ page, setUploadImage });
  const onUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();

    if (e.target.files) {
      onUploadAction(e.target.files);
      e.target.value = '';
    }
  };

  const selectImage = () => {
    imageRef.current?.click();
    setViewPopup(false);
  };

  const removeImage = () => {
    setUploadImage(initialImage);
    setCropedPreview(initialImage);
    setViewPopup(false);
  };

  const viewPopupHandler = () => {
    if (imageBtnRef.current) {
      setPopupPosition(
        calculatePopupPosition(imageBtnRef.current.getBoundingClientRect()),
      );
    }
    setViewPopup(true);
  };

  const handleKeyDownPopupHandler: KeyboardEventHandler<HTMLDivElement> = (
    e,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      viewPopupHandler();
    }
  };

  return (
    <div className="relative">
      <div
        role="button"
        tabIndex={0}
        aria-label="아고라 프로필 설정"
        ref={imageBtnRef}
        className="relative w-60 h-60 rounded-3xl under-mobile:rounded-2xl cursor-pointer"
        onClick={viewPopupHandler}
        onKeyDown={handleKeyDownPopupHandler}
      >
        <AgoraImage
          viewImageIcon={
            isNull(cropedPreview.dataUrl) && isNull(uploadImage.dataUrl)
          }
          file={cropedPreview.dataUrl ? cropedPreview : uploadImage}
          color={color}
        />
        <input
          type="file"
          accept="image/*, jpg, jpeg, png, webp"
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
      <AgoraImageUploadPopup
        selectImage={selectImage}
        removeImage={removeImage}
        viewPopup={viewPopup}
        setViewPopup={setViewPopup}
        popupPosition={popupPosition}
      />
    </div>
  );
}
