'use client';

import React, { KeyboardEventHandler } from 'react';
import { useRouter } from 'next/navigation';
import { AgoraData } from '@/app/model/Agora';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAgora } from '@/store/agora';
import COLOR from '@/constants/agoraColor';
import isActiveAgora from '@/utils/isActiveAgora';
import UserImage from '../../../_components/atoms/UserImage';
import ClosedAgoraVoteResultBar from './ClosedAgoraVoteResultBar';

type Props = {
  agora: AgoraData;
};

export default function KeywordAgora({ agora }: Props) {
  const router = useRouter();
  const { setSelectedAgora } = useAgora();

  // TODO: 아고라 id를 받아서 해당 아고라로 이동
  const enterAgora = () => {
    setSelectedAgora({
      id: agora.id,
      title: agora.agoraTitle,
      status: agora.status,
    });

    if (agora.status === 'QUEUED' || agora.status === 'RUNNING') {
      router.push(`/flow/enter-agora/${agora.id}`);
    } else if (agora.status === 'CLOSED') {
      // 만약 status가 closed라면, /agoras/${id}로 이동
      router.push(`/agoras/${agora.id}`);
    }
  };

  const handleKeyDownEnterAgora: KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === 'Enter') {
      enterAgora();
    }
  };

  const getRelativeTime = () => {
    const relativeDate = formatDistanceToNow(agora.createdAt as string, {
      addSuffix: true,
      locale: ko,
    });
    return relativeDate;
  };

  return (
    <article id={`${agora.id}`} className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="아고라"
        onKeyDown={handleKeyDownEnterAgora}
        onClick={enterAgora}
        className="w-full flex mb-15 pb-15 pl-1rem pr-1rem justify-center items-center cursor-pointer border-b-1 border-gray-100 dark:border-0"
      >
        <div className="flex-1 p-0.5rem pl-0">
          <div className="flex justify-between items-start mb-12">
            <h3 className="text-sm under-mobile:text-xs break-words break-keep line-clamp-2 max-w-prose dark:text-white dark:text-opacity-85">
              {agora.agoraTitle}
            </h3>
            <time
              aria-label="아고라 생성 날짜"
              className="text-xs pl-10 pr-3 text-nowrap dark:text-dark-line"
            >
              {getRelativeTime()}
            </time>
          </div>
          <div className="flex justify-between items-center">
            {isActiveAgora(agora) ? (
              <div className="text-xs text-nowrap">
                <span className="text-blue-500 dark:text-dark-pro-color">
                  찬성
                  <span className="text-athens-gray-thick ml-3 dark:text-dark-line">
                    {agora.participants.pros}명<span aria-hidden> | </span>
                  </span>
                </span>
                <span className="text-red-500 dark:text-dark-con-color">
                  반대
                  <span className="text-athens-gray-thick pl-3 dark:text-dark-line">
                    {agora.participants.cons}명<span aria-hidden> | </span>
                  </span>
                </span>
                <span className="dark:text-white dark:text-opacity-80">
                  관찰자
                  <span className="pl-3 text-athens-gray-thick dark:text-dark-line">
                    {agora.participants.observer}명
                  </span>
                </span>
              </div>
            ) : (
              <ClosedAgoraVoteResultBar
                prosPercentage={agora.prosCount}
                consPercentage={agora.consCount}
              />
            )}
          </div>
        </div>
        <div className="relative">
          <UserImage
            className={`w-67 h-67 ${COLOR.some((color) => color.value === agora.agoraColor) ? agora.agoraColor : COLOR[0].value} rounded-3xl`}
            w={67}
            h={67}
          />
          {agora.status !== 'CLOSED' && (
            <span
              className={`absolute top-2 left-50 inline-block w-13 h-13 ${agora.status === 'queued' ? 'bg-athens-button' : 'bg-red-400'} rounded-full ml-3`}
            />
          )}
        </div>
      </div>
    </article>
  );
}
