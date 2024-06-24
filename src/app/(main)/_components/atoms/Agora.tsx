'use client';

import { Agora as IAgora } from '@/app/model/Agora';
import { useAgora } from '@/store/agora';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import COLOR from '@/constants/agoraColor';
import tokenManager from '@/utils/tokenManager';

type Props = {
  agora: IAgora;
};

export default function Agora({ agora }: Props) {
  const { id, agoraTitle, agoraColor, participants, status } = agora;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSelectedAgora, setEnterAgora } = useAgora();

  const routePage = () => {
    router.push(`/agoras/${id}`);
  };

  const redirectChat = () => {
    setEnterAgora({
      id,
      title: agoraTitle,
      status,
      role: 'OBSERVER' as const,
    });
    routePage();
  };

  // TODO: 아고라 id를 받아서 해당 아고라로 이동
  const enterAgora = () => {
    setSelectedAgora({ id, title: agoraTitle, status });

    const AgoraStatus = searchParams.get('status');
    if (AgoraStatus === 'active') {
      router.push(`/flow/enter-agora/${id}`);
    } else if (AgoraStatus === 'closed') {
      // 바로 채팅방으로 이동
      tokenManager.clearRedirectUrl();
      redirectChat();
    }
  };

  return (
    <article
      id={`${id}`}
      className="w-165 under-mobile:w-130 p-10 border-1 rounded-lg flex flex-col justify-center items-center dark:bg-dark-light-300 dark:border-gray-500"
    >
      <div
        className={`under-mobile:w-3rem under-mobile:h-3rem w-4rem h-4rem rounded-3xl under-mobile:rounded-2xl ${COLOR.some((color) => color.value === agoraColor) ? agoraColor : COLOR[0].value} relative`}
      >
        {status !== 'CLOSED' && (
          <div
            className={`w-0.5rem h-0.5rem rounded-full ${status === 'RUNNING' ? 'bg-athens-button' : 'bg-red-400'} absolute top-3 right-2 under-mobile:top-2 under-mobile:right-1 z-5`}
          />
        )}
      </div>
      <h2 className="text-xs under-mobile:text-xs under-mobile:font-semibold pt-10 dark:text-white">
        {agoraTitle}
      </h2>
      <p aria-label="아고라 참여 인원" className="text-xs pt-7">
        <span className="pr-5 text-athens-gray-thick text-nowrap dark:text-dark-line">
          <span className="text-blue-600 pr-3 dark:text-dark-pro-color">
            찬성
          </span>
          {participants.pros}명
        </span>
        <span className="pr-5 text-athens-gray-thick text-nowrap dark:text-dark-line">
          <span className="text-red-600 pr-3 dark:text-dark-con-color">
            반대
          </span>
          {participants.cons}명
        </span>
        <span className="under-mobile:bloc break-keep">
          <span className="pr-3 dark:text-white dark:text-opacity-85">
            관찰자
          </span>
          <span className="text-athens-gray-thick dark:text-dark-line">
            {participants.observer}명
          </span>
        </span>
      </p>
      <button
        aria-label="아고라 입장하기"
        onClick={enterAgora}
        type="button"
        className="text-sm under-mobile:text-xs text-white bg-athens-main p-4 pt-5 pb-5 mt-10 w-9rem under-mobile:w-110 rounded-md"
      >
        {searchParams.get('status') === 'closed' ? '결과보기' : '입장하기'}
      </button>
    </article>
  );
}
