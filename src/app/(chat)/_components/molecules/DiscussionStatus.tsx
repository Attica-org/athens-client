'use client';

import { useMutation } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import EyeIcon from '@/assets/icons/EyeIcon';
import { useChatInfo } from '@/store/chatInfo';
import { useAgora } from '@/store/agora';
import Loading from '@/app/_components/atoms/loading';
import { AgoraMeta } from '@/app/model/AgoraMeta';
import { useShallow } from 'zustand/react/shallow';
import toast from 'react-hot-toast';
import showToast from '@/utils/showToast';
import { patchAgoraStart } from '../../_lib/patchAgoraStart';
import { patchAgoraEnd } from '../../_lib/patchAgoraEnd';
import DiscussionTimer from '../atoms/DiscussionTimer';
import VoteResult from '../atoms/VoteResult';

type Props = {
  meta: AgoraMeta | undefined;
};

export default function DiscussionStatus({ meta }: Props) {
  const { enterAgora } = useAgora();
  const { endVoteCount, start } = useChatInfo(useShallow((state) => ({
    endVoteCount: state.endVoteCount,
    start: state.start,
  })));

  const agoraStart = useMutation({
    mutationFn: async () => patchAgoraStart(enterAgora.id),
    onMutate: () => {
    },
    onSuccess: async (response) => {
      // 타이머 시작
      if (response) {
        toast.success('토론이 시작되었습니다.');
      } else {
        showToast('토론 시작에 실패했습니다.', 'error');
      }
    },
    onError: () => {
      // console.dir(error);
      // alert('문제가 발생했습니다. 다시 시도해주세요.');
    },
  });

  const agoraEnd = useMutation({
    mutationFn: async () => patchAgoraEnd(enterAgora.id),
    onSuccess: async (response) => {
      if (response) {
        toast.success('토론 종료에 투표하였습니다.');
      } else {
        toast.error('토론 종료 투표에 실패했습니다.');
      }
    },
    onError: () => {
      // console.dir(error);
      // alert('문제가 발생했습니다. 다시 시도해주세요.');
    },
  });

  const toggleProgress = () => {
    if (!start) {
      // 시작 api 호출
      agoraStart.mutate();
    } else {
      // 종료 api 호출
      agoraEnd.mutate();
    }
  };

  return (
    enterAgora.status !== 'CLOSED' ? (
      <>
        <button
          type="button"
          onClick={toggleProgress}
          aria-label={`토론 ${start ? '종료하기' : '시작하기'}`}
          className={`italic ${start ? 'bg-athens-main' : 'bg-red-500'} p-4 pl-15 pr-15 under-mobile:pl-10 under-mobile:pr-10 rounded-lg text-white mr-0.5rem`}
        >
          {start ? 'END' : 'START'}
        </button>
        <div
          role="group"
          aria-label="아고라 정보"
          className="flex justify-center items-center"
        >
          <DiscussionTimer
            duration={meta?.agora.duration || 0}
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
            {meta && meta.participants.map((participant) => (
              participant.type === 'OBSERVER' && (
                <span key={meta.agora.id} className="pl-5 text-xs text-athens-gray-thick dark:text-white dark:text-opacity-85">
                  {participant.count || 0}
                </span>
              )
            ))}
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
