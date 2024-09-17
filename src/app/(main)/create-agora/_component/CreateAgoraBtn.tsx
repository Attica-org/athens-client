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
import {
  MAX_DISCUSSION_TIME,
  MIN_DISCUSSION_TIME,
} from '@/constants/createAgora';
import showToast from '@/utils/showToast';
import COLOR from '@/constants/agoraColor';
import { AgoraConfig } from '@/app/model/Agora';
import { enterAgoraSegmentKey } from '@/constants/segmentKey';
import { postCreateAgora } from '../../_lib/postCreateAgora';

function CreateAgoraBtn() {
  const [createAgora, setCreateAgora] = useState<AgoraConfig>({
    title: '',
    category: '1',
    color: { idx: 0, value: COLOR[0].value },
    capacity: 5,
    duration: 60,
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const invalidAgora = (client: QueryClient, queryKey: string[]) => {
    client.invalidateQueries({ queryKey });
  };

  const failedCreateAgora = () => {
    showToast('아고라 생성에 실패했습니다.', 'error');
    setIsLoading(false);
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
          title: createAgora.title,
          status: 'QUEUED',
        });

        setIsLoading(false);

        invalidAgora(queryClient, ['agora']);
        router.push(`/flow${enterAgoraSegmentKey}/${response.id}`);
      } else {
        failedCreateAgora();
      }
    },
    onError: () => {
      failedCreateAgora();
    },
  });

  const handleClick = () => {
    const { title, category, color, capacity, duration } =
      useCreateAgora.getState();

    if (
      title.trim() === '' ||
      title.length > 15 ||
      !color ||
      !category ||
      !duration ||
      duration > MAX_DISCUSSION_TIME ||
      duration < MIN_DISCUSSION_TIME
    ) {
      showToast('입력값을 확인해주세요.', 'error');
      return;
    }

    setCreateAgora({
      title,
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
