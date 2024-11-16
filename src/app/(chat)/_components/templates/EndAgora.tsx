'use client';

import Loading from '@/app/_components/atoms/loading';
import ModalBase from '@/app/_components/molecules/ModalBase';
import { deleteTabId } from '@/utils/indexedDB';
import { useAgora } from '@/store/agora';
import { useChatInfo } from '@/store/chatInfo';
import { useVoteStore } from '@/store/vote';
import swManager from '@/utils/swManager';
import getKey from '@/utils/getKey';
import showToast from '@/utils/showToast';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { AGORA_POSITION } from '@/constants/agora';
import { VotePosition } from '@/app/model/Agora';
import { useSession } from 'next-auth/react';

const DUPLICATE_VOTE = 'User has already voted for Opinion in this agora';

export default function EndAgora() {
  const [selectedResultPosition, setSelectedResultPosition] =
    useState<VotePosition>(AGORA_POSITION.DEFAULT);
  const [remainingTime, setRemainingTime] = useState(15);
  const [isFinished, setIsFinished] = useState(false);
  const [vote, setVote] = useState<string | null>(null);
  const { title, end } = useChatInfo(
    useShallow((state) => ({
      title: state.title,
      end: state.end,
    })),
  );
  const { setVoteResult, setVoteEnd, voteEnd } = useVoteStore(
    useShallow((state) => ({
      setVoteEnd: state.setVoteEnd,
      voteEnd: state.voteEnd,
      setVoteResult: state.setVoteResult,
    })),
  );
  const agoraId = useAgora((state) => state.enterAgora.id);
  const router = useRouter();
  const [URL, setURL] = useState({
    BASE_URL: '',
  });
  const tabId = swManager.getTabId();
  const session = useSession();

  const getUrl = async () => {
    const key = await getKey();
    setURL({
      BASE_URL: key.BASE_URL || '',
    });
  };

  const isServiceWorkerActive = () => {
    return 'serviceWorker' in navigator && navigator.serviceWorker.controller;
  };

  useEffect(() => {
    getUrl();
  }, []);

  const updateVoteState = () => {
    if (isServiceWorkerActive()) {
      const controller = navigator.serviceWorker.controller!;
      controller.postMessage({
        action: 'updateVote',
        data: {
          voteType: vote,
        },
        tabId,
      });
    }
  };

  const startTimer = (voteEndTime: number) => {
    if (isServiceWorkerActive() && session) {
      const controller = navigator.serviceWorker.controller!;
      controller.postMessage({
        action: 'startTimer',
        data: {
          voteEndTime,
          agoraId,
          voteType: vote,
          token: session.data?.user?.accessToken,
          baseUrl: URL.BASE_URL,
        },
        tabId,
      });
    }
  };

  const handleVoteError = (event: MessageEvent) => {
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
  };
  // 투표 상태 업데이트
  useEffect(() => {
    updateVoteState();
  }, [vote, tabId]);

  // 타이머 시작 및 Service Worker와의 통신 설정
  useEffect(() => {
    if (!URL.BASE_URL) return () => {};

    const voteEndTime = new Date(end).getTime() + 15 * 1000;

    const timerId = setInterval(() => {
      const diffTime = voteEndTime - new Date().getTime();
      setRemainingTime(diffTime > 0 ? Math.floor(diffTime / 1000) : 0);
      if (diffTime <= 0) {
        clearInterval(timerId);
      }
    }, 1000);

    startTimer(voteEndTime);

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data.tabId !== tabId) return; // 다른 탭에서 온 메시지는 무시

      console.log('event.data', event.data);
      if (event.data.action === 'voteSent') {
        setIsFinished(true);
      } else if (event.data.action === 'voteResult') {
        // console.log('voteResult', event.data);
        setVoteResult(event.data.result);
        setVoteEnd(true);

        if (tabId) {
          deleteTabId(tabId);
        }

        router.replace(`/agoras/${agoraId}/flow/result-agora`);
      } else if (event.data.action === 'fetchError') {
        // console.log('fetchError', event.data);
        handleVoteError(event);
      }
    };

    console.log('navigator.serviceWorker', navigator.serviceWorker);
    navigator.serviceWorker.addEventListener(
      'message',
      handleServiceWorkerMessage,
    );

    return () => {
      clearInterval(timerId);
      navigator.serviceWorker.removeEventListener(
        'message',
        handleServiceWorkerMessage,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agoraId, router, setVoteEnd, setVoteResult, URL.BASE_URL]);

  const selectResultPosition = (position: VotePosition) => {
    setSelectedResultPosition(position);
    setVote(position);
  };

  console.log('isFinished', isFinished, 'voteEnd', voteEnd);
  return (
    <ModalBase
      title="토론 종료"
      closeIcon={remainingTime <= 0}
      animation={false}
    >
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
          {title}
        </h2>
        <div className="pt-0.5rem pb-0.5rem">
          <button
            type="button"
            aria-label="찬성하기"
            disabled={isFinished}
            onClick={() => selectResultPosition(AGORA_POSITION.PROS)}
            className={`${
              selectedResultPosition === AGORA_POSITION.PROS
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
            onClick={() => selectResultPosition(AGORA_POSITION.CONS)}
            className={`${
              selectedResultPosition === AGORA_POSITION.CONS
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
            <Loading
              w="16"
              h="16"
              className="m-2 flex justify-center items-center"
            />
          </div>
        )}
      </div>
    </ModalBase>
  );
}
