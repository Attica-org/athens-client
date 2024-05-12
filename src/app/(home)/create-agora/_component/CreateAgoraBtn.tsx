'use client';

import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';
// import { useRouter } from 'next/navigation';
import { postCreateAgora } from '../../_api/postCreateAgora';

function CreateAgoraBtn() {
  const {
    title, category, capacity, duration, color,
  } = useCreateAgora(useShallow((state) => ({
    title: state.title,
    category: state.category,
    capacity: state.capacity,
    duration: state.duration,
    color: state.color,
  })));
  // const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const info = {
        title,
        category,
        color,
        capacity,
        duration,
      };
      return postCreateAgora(info);
    },
    onSuccess: async (response) => {
      console.log(response);
      // router.push('/agora/flow/enter-agora');
    },
    onError: (error) => {
      console.dir(error);
      alert('문제가 발생했습니다. 다시 시도해주세요.');
    },
  });

  const createAgora = () => {
    mutation.mutate();
  };

  return (
    <div className="mt-1rem w-full">
      <button
        onClick={createAgora}
        type="button"
        aria-label="아고라 생성하기"
        className="w-full bg-athens-main text-white font-semibold pt-10 pb-10 under-mobile:pt-10 under-mobile:pb-10 under-mobile:mt-1rem text-base rounded-lg"
      >
        아고라 생성
      </button>
    </div>
  );
}

export default React.memo(CreateAgoraBtn);
