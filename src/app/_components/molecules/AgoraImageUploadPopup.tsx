import React, { useEffect, useRef } from 'react';

type AgoraImageUploadPopupProps = {
  selectImage: () => void;
  removeImage: () => void;
  viewPopup: boolean;
  setViewPopup: React.Dispatch<boolean>;
  popupPosition: 'top' | 'bottom';
};

export function AgoraImageUploadPopup({
  selectImage,
  removeImage,
  viewPopup,
  popupPosition,
  setViewPopup,
}: AgoraImageUploadPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const imageChoiceRef = useRef<HTMLButtonElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setViewPopup(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setViewPopup(false);
    } else if (e.key === 'Escape') {
      setViewPopup(false);
    }
  };

  useEffect(() => {
    if (viewPopup) {
      imageChoiceRef.current?.focus();
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewPopup]);

  return (
    <div
      role="menu"
      className={`transform transition-opacity duration-300 ease-out ${viewPopup ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'} cursor-pointer rounded-md gap-20 flex flex-col absolute ${popupPosition === 'top' ? 'bottom-10' : 'top-1/2'} left-50 p-10 dark:bg-dark-light-200 bg-dark-light-500 text-white text-xs`}
      ref={popupRef}
    >
      <button
        role="menuitem"
        type="button"
        className="break-keep focus:focus-sr rounded px-2 py-1"
        onClick={selectImage}
        ref={imageChoiceRef}
        tabIndex={viewPopup ? 0 : -1}
      >
        이미지 선택
      </button>
      <button
        role="menuitem"
        type="button"
        className="break-keep focus:focus-sr rounded px-2 py-1"
        onClick={removeImage}
        tabIndex={viewPopup ? 0 : -1}
      >
        이미지 제거
      </button>
    </div>
  );
}
