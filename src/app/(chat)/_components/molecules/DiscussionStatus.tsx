'use client';

import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import EyeIcon from '@/assets/icons/EyeIcon';
import { useChatInfo } from '@/store/chatInfo';
import { patchAgoraStart } from '../../_lib/patchAgoraStart';
import { patchAgoraEnd } from '../../_lib/patchAgoraEnd';
import DiscussionTimer from '../atoms/DiscussionTimer';

export default function DiscussionStatus() {
  const [progress, setProgress] = useState(false);
  const agoraId = usePathname().split('/').pop() as string;

  const agoraStart = useMutation({
    mutationFn: async () => patchAgoraStart(agoraId as string),
    onMutate: () => {
      setProgress((prev) => !prev);
    },
    onSuccess: async (response) => {
      // 타이머 시작
      const setStart = useChatInfo.getState().setDiscussionStart;
      setStart(response.startTime);
      console.log('아고라 시작!', response.startTime);
    },
    onError: () => {
      setProgress((prev) => !prev);
      // console.dir(error);
      // alert('문제가 발생했습니다. 다시 시도해주세요.');
    },
  });

  const agoraEnd = useMutation({
    mutationFn: async () => patchAgoraEnd(agoraId as string),
    onMutate: () => {
      // END 버튼을 누른 인원이 2/3 이상이면 종료
      // router.push(`/agoras/${agoraId}/flow/end-agora`);
    },
    onSuccess: async (response) => {
      console.log('아고라 종료!', response);
    },
    onError: () => {
      // console.dir(error);
      // alert('문제가 발생했습니다. 다시 시도해주세요.');
    },
  });

  const toggleProgress = () => {
    if (progress) {
      const { setIsClosed } = useChatInfo.getState();
      setIsClosed(true);
      // 종료 api 호출
      agoraEnd.mutate();
    } else if (!progress) {
      // 시작 api 호출
      agoraStart.mutate();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleProgress}
        aria-label={`토론 ${progress ? '종료하기' : '시작하기'}`}
        className={`italic ${progress ? 'bg-athens-main' : 'bg-red-500'} p-4 pl-15 pr-15 under-mobile:pl-10 under-mobile:pr-10 rounded-lg text-white mr-0.5rem`}
      >
        {progress ? 'END' : 'START'}
      </button>
      <div
        role="group"
        aria-label="아고라 정보"
        className="flex justify-center items-center"
      >
        <DiscussionTimer duration={13} start={progress} agoraId={agoraId} />
        <div
          role="status"
          aria-label="토론 종료 버튼을 누른 인원 수"
          className="text-xs text-athens-gray-thick pl-0.5rem pr-0.5rem dark:text-white dark:text-opacity-85"
        >
          8
        </div>
        <div
          role="status"
          aria-label="관찰자 수"
          className="flex justify-center items-center"
        >
          <EyeIcon className="w-1rem" />
          <span className="pl-5 text-xs text-athens-gray-thick dark:text-white dark:text-opacity-85">12</span>
        </div>
      </div>
    </>
  );
}
