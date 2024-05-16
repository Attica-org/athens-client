'use client';

import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useCreateAgora } from '@/store/create';
import { useRouter } from 'next/navigation';
import { useAgora } from '@/store/agora';
import Loading from '@/app/_components/atoms/loading';
import { postCreateAgora } from '../../_lib/postCreateAgora';

type Agora = {
  title: string,
  category: string,
  color: string,
  capacity: number,
  duration: number | null,
};

function CreateAgoraBtn() {
  const [createAgora, setCreateAgora] = useState<Agora>({
    title: '',
    category: 'all',
    color: 'agora-point-color1',
    capacity: 5,
    duration: 60,
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const info = {
        ...createAgora,
      };
      return postCreateAgora(info);
    },
    onSuccess: async (response) => {
      const { setSelectedAgora } = useAgora.getState();
      setSelectedAgora({ id: response.id, title: createAgora.title });

      const { reset } = useCreateAgora.getState();
      reset();

      setIsLoading(false);
      router.push('/flow/enter-agora');
    },
    onError: (error) => {
      console.error(error);
      alert('문제가 발생했습니다. 다시 시도해주세요.');
    },
  });

  const handleClick = () => {
    const {
      title, category, color, capacity, duration,
    } = useCreateAgora.getState();
    setCreateAgora({
      title, category, color, capacity, duration,
    });

    if (title.trim() === '') return;

    setIsLoading(true);
    mutation.mutate();
  };

  return (
    <div className="mt-1rem w-full">
      <button
        onClick={handleClick}
        type="button"
        disabled={isLoading}
        aria-label="아고라 생성하기"
        className="w-full bg-athens-main text-white font-semibold pt-10 pb-10 under-mobile:pt-10 under-mobile:pb-10 under-mobile:mt-1rem text-base rounded-lg"
      >
        {isLoading ? <Loading w="16" h="16" /> : '아고라 생성'}
      </button>
    </div>
  );
}

export default React.memo(CreateAgoraBtn);
