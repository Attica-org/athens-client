'use client';

import { useQueryClient } from '@tanstack/react-query';
import React, { KeyboardEventHandler, useCallback, useEffect } from 'react';
import { useCreateAgora } from '@/store/create';
import { useRouter } from 'next/navigation';
import Loading from '@/app/_components/atoms/loading';
import showToast from '@/utils/showToast';
import { useShallow } from 'zustand/react/shallow';
import { useUploadImage } from '@/store/uploadImage';
import { validateCreateAgora } from '@/utils/validation/validateCreateAgora';
import { useCreateAgoraAction } from '@/hooks/useCreateAgoraAction';

function CreateAgoraBtn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const routeAgoraPage = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const { resetUploadImageState } = useUploadImage(
    useShallow((state) => ({
      resetUploadImageState: state.resetUploadImageState,
    })),
  );

  const { isLoading, createAgoraMutation, setCreateAgora } =
    useCreateAgoraAction({
      routeAgoraPage,
      queryClient,
      resetUploadImageState,
    });

  const handleClick = () => {
    const { title, imageUrl, category, color, capacity, duration } =
      useCreateAgora.getState();

    if (!validateCreateAgora({ title, color, category, duration })) {
      showToast('입력값을 확인해주세요.', 'error');
      return;
    }

    setCreateAgora({
      title,
      imageUrl,
      category,
      color,
      capacity,
      duration,
    });

    createAgoraMutation.mutate();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  useEffect(() => {
    return () => {
      const { reset: createStoreReset } = useCreateAgora.getState();

      createStoreReset(); // 언마운트시 초기
      resetUploadImageState();
    };
  }, []);

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type="submit"
      disabled={isLoading}
      aria-label="아고라 생성하기"
      className="mt-1rem w-full bg-athens-main text-white pt-6 pb-6 under-mobile:pt-6 under-mobile:pb-6 under-mobile:mt-1rem text-base rounded-lg"
    >
      {isLoading ? (
        <Loading
          w="19"
          h="19"
          className="m-2 flex justify-center items-center"
        />
      ) : (
        '아고라 생성'
      )}
    </button>
  );
}

export default CreateAgoraBtn;
