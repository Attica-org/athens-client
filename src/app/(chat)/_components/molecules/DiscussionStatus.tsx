'use client';

import { useMutation } from '@tanstack/react-query';
import React, { Suspense, useState } from 'react';
import { usePathname } from 'next/navigation';
import EyeIcon from '@/assets/icons/EyeIcon';
import { useChatInfo } from '@/store/chatInfo';
import { useAgora } from '@/store/agora';
import Loading from '@/app/_components/atoms/loading';
import { AgoraMeta } from '@/app/model/AgoraMeta';
import { useShallow } from 'zustand/react/shallow';
import { patchAgoraStart } from '../../_lib/patchAgoraStart';
import { patchAgoraEnd } from '../../_lib/patchAgoraEnd';
import DiscussionTimer from '../atoms/DiscussionTimer';
import VoteResult from '../atoms/VoteResult';

type Props = {
  meta: AgoraMeta | undefined;
};

export default function DiscussionStatus({ meta }: Props) {
  const [progress, setProgress] = useState(false);
  const agoraId = usePathname().split('/').pop() as string;
  const { enterAgora } = useAgora();
  const { endVoteCount } = useChatInfo(useShallow((state) => ({
    endVoteCount: state.endVoteCount,
  })));

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
    } else {
      // 시작 api 호출
      agoraStart.mutate();
    }
  };

  return (
    enterAgora.status !== 'closed' ? (
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
          <DiscussionTimer
            duration={meta?.agora.duration || 60}
            start={progress}
            agoraId={meta?.agora.id || 0}
          />
          <div
            role="status"
            aria-label="토론 종료 버튼을 누른 인원 수"
            className="text-xs text-athens-gray-thick pl-0.5rem pr-0.5rem dark:text-white dark:text-opacity-85"
          >
            {endVoteCount}
          </div>
          <div
            role="status"
            aria-label="관찰자 수"
            className="flex justify-center items-center"
          >
            <EyeIcon className="w-1rem" />
            <span className="pl-5 text-xs text-athens-gray-thick dark:text-white dark:text-opacity-85">{meta?.participants[2].count}</span>
          </div>
        </div>
      </>
    ) : (
      <Suspense fallback={(
        <div className="flex text-sm justify-center items-center">
          결과 불러오는 중...
          <Loading w="12" h="12" />
        </div>
      )}
      >
        <VoteResult agoraId={meta?.agora.id || 0} />
      </Suspense>
    )
  );
}
