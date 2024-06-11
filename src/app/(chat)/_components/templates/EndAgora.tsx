'use client';

import Loading from '@/app/_components/atoms/loading';
import ModalBase from '@/app/_components/molecules/ModalBase';
import { useAgora } from '@/store/agora';
import { useVoteStore } from '@/store/vote';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';
import { differenceInSeconds } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

type ResultPosition = 'PROS' | 'CONS' | 'DEFAULT';
const DUPLICATE_VOTE = 'User has already voted for Opinion in this agora';

export default function EndAgora() {
  const [selectedResultPosition, setSelectedResultPosition] = useState<ResultPosition>('DEFAULT');
  const [remainingTime, setRemainingTime] = useState(15);
  const [isFinished, setIsFinished] = useState(false);
  const [vote, setVote] = useState<string | null>(null);
  const { setVoteResult, setVoteEnd, voteEnd } = useVoteStore(useShallow((state) => ({
    setVoteEnd: state.setVoteEnd,
    voteEnd: state.voteEnd,
    setVoteResult: state.setVoteResult,
  })));
  const agoraId = useAgora((state) => state.enterAgora.id);
  const router = useRouter();

  // 투표 상태 업데이트
  useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        action: 'updateVote',
        data: {
          voteType: vote,
        },
      });
    }
  }, [vote]);

  // 타이머 시작 및 Service Worker와의 통신 설정
  useEffect(() => {
    const startTime = new Date();
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        action: 'startTimer',
        startTime: startTime.toISOString(),
        data: {
          agoraId,
          voteType: vote,
          token: tokenManager.getToken(),
          baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
        },
      });
    }

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data.action === 'voteSent') {
        setIsFinished(true);
      } else if (event.data.action === 'voteResult') {
        console.log('voteResult', event.data);
        setVoteResult(event.data.result);
        setVoteEnd(true);
        router.replace(`/agoras/${agoraId}/flow/result-agora`);
      } else if (event.data.action === 'fetchError') {
        console.log('fetchError', event.data);
        switch (event.data.message.code) {
          case 1301:
            showToast('존재하지 않는 유저 혹은 아고라 입니다.', 'error');
            break;
          case 1002:
            if (event.data.message.message === DUPLICATE_VOTE) {
              showToast('이미 투표하였습니다.', 'error');
            } else {
              showToast('아직 토론이 진행중인 아고라 입니다.', 'error');
            }
            break;
          default:
            showToast(event.data.message, 'error');
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

    const timerId = setInterval(() => {
      const diffTime = differenceInSeconds(new Date(), startTime);
      setRemainingTime(15 - diffTime > 0 ? 15 - diffTime : 0);
      if (15 - diffTime <= 0) {
        clearInterval(timerId);
      }
    }, 1000);

    return () => {
      clearInterval(timerId);
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agoraId, router, setVoteEnd, setVoteResult]);

  const selectResultPosition = (position: ResultPosition) => {
    setSelectedResultPosition(position);
    setVote(position);
  };

  return (
    <ModalBase title="토론 종료" removeIcon={false} animation={false}>
      <div className="flex justify-center items-center flex-col">
        <p className="text-xs text-athens-gray-thick dark:text-dark-line-light">
          최종 투표를 진행해주세요.
        </p>
        <div
          role="status"
          aria-label="투표 종료까지 남은 시간"
          className={`pt-0.5rem ${remainingTime <= 5 && 'text-red-500 dark:text-dark-con-color'}`}
        >
          {remainingTime}
        </div>
        <h2
          aria-label="토론 주제"
          className="p-1rem pt-1rem text-base break-keep text-center"
        >
          국가 발전에 유능한 독재자가 필요한 시기가 있다.
        </h2>
        <div className="pt-0.5rem pb-0.5rem">
          <button
            type="button"
            aria-label="찬성하기"
            disabled={isFinished}
            onClick={() => selectResultPosition('PROS')}
            className={`${
              selectedResultPosition === 'PROS'
                ? 'bg-blue-400 text-white'
                : 'text-blue-600 bg-white dark:text-white dark:bg-dark-light-500'
            } mr-1rem text-sm p-6 pl-1.5rem pr-1.5rem rounded-xl`}
          >
            찬성
          </button>
          <button
            type="button"
            aria-label="반대하기"
            disabled={isFinished}
            onClick={() => selectResultPosition('CONS')}
            className={`${
              selectedResultPosition === 'CONS'
                ? 'bg-red-400 text-white '
                : 'bg-white text-red-500 dark:text-white dark:bg-dark-light-500'
            } text-sm p-6 pl-1.5rem pr-1.5rem rounded-xl`}
          >
            반대
          </button>
        </div>
        {isFinished && !voteEnd && (
        <div className="flex p-10 text-sm">
          투표 결과 집계 중...
          <Loading w="16" h="16" />
        </div>
        )}
      </div>
    </ModalBase>
  );
}
