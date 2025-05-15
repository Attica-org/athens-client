'use client';

import ModalBase from '@/app/_components/molecules/ModalBase';
import { useAgora } from '@/store/agora';
import { useChatInfo } from '@/store/chatInfo';
import { useVoteStore } from '@/store/vote';
import getKey from '@/utils/getKey';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { updateSession } from '@/serverActions/auth';
import VoteTimer from '../atoms/VoteTimer';
import VoteActionButtons from '../atoms/VoteActionButtons';
import ServiceWorkerErrorHandler from '../../utils/ServiceWorkerErrorHandler';
import VoteResultLoader from '../atoms/VoteResultLoader';

export default function EndAgora() {
  const [isFinished, setIsFinished] = useState(false);
  const { title } = useChatInfo(
    useShallow((state) => ({
      title: state.title,
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
  const { voteErrorHandler } = ServiceWorkerErrorHandler();

  useEffect(() => {
    const getUrl = async () => {
      const key = await getKey();
      setURL({
        BASE_URL: key.BASE_URL || '',
      });
    };

    getUrl();
  }, []);

  // 타이머 시작 및 Service Worker와의 통신 설정
  useEffect(() => {
    if (!URL.BASE_URL) return () => {};

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data.action === 'voteSent') {
        setIsFinished(true);

        if (event.data.newAccessToken.length > 0) {
          updateSession(event.data.newAccessToken);
        }
      } else if (event.data.action === 'voteResult') {
        setVoteResult(event.data.result);
        setVoteEnd(true);

        if (event.data.newAccessToken.length > 0) {
          updateSession(event.data.newAccessToken);
        }

        router.replace(`/agoras/${agoraId}/flow/result-agora`);
      } else if (event.data.action === 'fetchError') {
        voteErrorHandler(event);
      }
    };

    navigator.serviceWorker.addEventListener(
      'message',
      handleServiceWorkerMessage,
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        'message',
        handleServiceWorkerMessage,
      );
    };
  }, [
    URL.BASE_URL,
    agoraId,
    router,
    setVoteResult,
    setVoteEnd,
    voteErrorHandler,
  ]);

  return (
    <ModalBase title="토론 종료" closeIcon={false} animation={false}>
      <div className="flex justify-center items-center flex-col">
        <p
          id="description"
          className="text-xs text-athens-gray-thick dark:text-dark-line-light"
        >
          최종 투표를 진행해주세요.
          <span className="sr-only">총 15초 동안 진행됩니다.</span>
        </p>
        <VoteTimer baseUrl={URL.BASE_URL} />
        <h2
          aria-label="토론 주제"
          className="p-1rem pt-1rem text-base break-keep text-center"
        >
          {title}
        </h2>
        <VoteActionButtons disabled={isFinished} />
        <VoteResultLoader isFinished={isFinished} isVoteEnd={voteEnd} />
      </div>
    </ModalBase>
  );
}
