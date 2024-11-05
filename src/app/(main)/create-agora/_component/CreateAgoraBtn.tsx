'use client';

import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
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
import { postCreateAgora } from '../../_lib/postCreateAgora';

function CreateAgoraBtn() {
  const [createAgora, setCreateAgora] = useState<AgoraConfig>({
    title: '',
    thumbnail: '',
    category: '1',
    color: { idx: 0, value: COLOR[0].value },
    capacity: 5,
    duration: 60,
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  const invalidAgora = (client: QueryClient, queryKey: string[]) => {
    client.invalidateQueries({ queryKey });
  };

  const failedCreateAgora = (error: Error) => {
    showToast('아고라 생성에 실패했습니다.', 'error');
    setIsLoading(false);
    handleError(error);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const info = {
        ...createAgora,
      };
      return postCreateAgora(info);
    },
    onSuccess: async (response) => {
      const { reset } = useCreateAgora.getState();
      const { setSelectedAgora } = useAgora.getState();
      reset();

      if (response.id) {
        setSelectedAgora({
          id: response.id,
          thumbnail: createAgora.thumbnail,
          title: createAgora.title,
          status: AGORA_STATUS.QUEUED,
          agoraColor: createAgora.color.value,
        });

        setIsLoading(false);

        invalidAgora(queryClient, ['agora']);
        router.push(`/flow${enterAgoraSegmentKey}/${response.id}`);
        return;
      }
      failedCreateAgora(new Error('아고라 생성에 실패했습니다.'));
    },
    onError: (error) => {
      failedCreateAgora(error);
    },
  });

  const handleClick = () => {
    const { title, thumbnail, category, color, capacity, duration } =
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
      thumbnail,
      category,
      color,
      capacity,
      duration,
    });

    setIsLoading(true);
    mutation.mutate();
  };
  useEffect(() => {
    return () => {
      const { reset } = useCreateAgora.getState();
      reset(); // 언마운트시 초기화
    };
  }, []);

  return (
    <div className="mt-1rem w-full">
      <button
        onClick={handleClick}
        type="button"
        disabled={isLoading}
        aria-label="아고라 생성하기"
        className="w-full bg-athens-main text-white font-semibold pt-10 pb-10 under-mobile:pt-10 under-mobile:pb-10 under-mobile:mt-1rem text-base rounded-lg"
      >
        {isLoading ? (
          <Loading
            w="16"
            h="16"
            className="m-2 flex justify-center items-center"
          />
        ) : (
          '아고라 생성'
        )}
      </button>
    </div>
  );
}

export default CreateAgoraBtn;
