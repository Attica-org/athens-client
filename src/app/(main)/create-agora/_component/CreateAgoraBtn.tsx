'use client';

import {
  QueryClient,
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import React, { KeyboardEventHandler, useEffect, useState } from 'react';
import { useCreateAgora } from '@/store/create';
import { useRouter } from 'next/navigation';
import { useAgora } from '@/store/agora';
import Loading from '@/app/_components/atoms/loading';
import showToast from '@/utils/showToast';
import { AgoraConfig } from '@/app/model/Agora';
import { enterAgoraSegmentKey } from '@/constants/segmentKey';
import { AGORA_CREATE, AGORA_STATUS } from '@/constants/agora';
import useApiError from '@/hooks/useApiError';
import { COLOR } from '@/constants/consts';
import { useShallow } from 'zustand/react/shallow';
import { useUploadImage } from '@/store/uploadImage';
import { useSearchStore } from '@/store/search';
import { postCreateAgora } from '../../_lib/postCreateAgora';

function CreateAgoraBtn() {
  const [createAgora, setCreateAgora] = useState<AgoraConfig>({
    title: '',
    imageUrl: '',
    category: '1',
    color: { idx: 0, value: COLOR[0].value },
    capacity: 5,
    duration: 60,
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { handleError } = useApiError();
  const { reset } = useCreateAgora(
    useShallow((state) => ({
      reset: state.reset,
    })),
  );
  const { resetUploadImageState } = useUploadImage(
    useShallow((state) => ({
      resetUploadImageState: state.resetUploadImageState,
    })),
  );
  const { setSelectedAgora } = useAgora(
    useShallow((state) => ({
      setSelectedAgora: state.setSelectedAgora,
    })),
  );

  const invalidAgora = async (client: QueryClient, queryKey: string[]) => {
    await client.invalidateQueries({ queryKey });
  };

  const failedCreateAgora = async (
    error: Error,
    mutation: UseMutateFunction<any, Error, void, unknown>,
  ) => {
    setIsLoading(false);
    await handleError(error, mutation);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const info = {
        ...createAgora,
      };
      return postCreateAgora(info);
    },
    onSuccess: async (response) => {
      reset();
      resetUploadImageState();

      if (response.id) {
        setSelectedAgora({
          id: response.id,
          imageUrl: createAgora.imageUrl,
          agoraTitle: createAgora.title,
          status: AGORA_STATUS.QUEUED,
          agoraColor: createAgora.color.value,
        });

        setIsLoading(false);

        await invalidAgora(queryClient, ['agora']);
        router.push(`/flow${enterAgoraSegmentKey}/${response.id}`);
        return;
      }
      await failedCreateAgora(
        new Error('아고라 생성에 실패했습니다.'),
        mutation.mutate,
      );
    },
    onError: async (error) => {
      await failedCreateAgora(error, mutation.mutate);
    },
  });

  const handleClick = () => {
    const { title, imageUrl, category, color, capacity, duration } =
      useCreateAgora.getState();

    if (
      title.trim() === '' ||
      title.length > 15 ||
      !color ||
      !category ||
      !duration ||
      duration > AGORA_CREATE.MAX_DISCUSSION_TIME ||
      duration < AGORA_CREATE.MIN_DISCUSSION_TIME
    ) {
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

    setIsLoading(true);
    mutation.mutate();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  useEffect(() => {
    return () => {
      const { reset: createStoreReset } = useCreateAgora.getState();
      const { reset: searchReset } = useSearchStore.getState();

      createStoreReset(); // 언마운트시 초기
      searchReset();
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
