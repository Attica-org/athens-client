'use client';

import React, { KeyboardEventHandler } from 'react';
import { useRouter } from 'next/navigation';
import { Agora } from '@/app/model/Agora';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import UserImage from '../../../_components/atoms/UserImage';

type Props = {
  agora: Agora
};

export default function SearchAgora({ agora }: Props) {
  const router = useRouter();
  const {
    id, agoraTitle, agoraColor, participants, createdAt, status,
  } = agora;

  // TODO: 아고라 id를 받아서 해당 아고라로 이동
  const enterAgora = () => {
    router.push('/flow/enter-agora');
  };

  const handleKeyDownEnterAgora:KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === 'Enter') {
      enterAgora();
    }
  };

  const getRelativeTime = () => {
    const relativeDate = formatDistanceToNow(createdAt as string, { addSuffix: true, locale: ko });
    return relativeDate;
  };

  return (
    <article id={`${id}`} className="w-full">
      <div role="button" tabIndex={0} aria-label="아고라" onKeyDown={handleKeyDownEnterAgora} onClick={enterAgora} className="w-full flex mb-15 pb-15 pl-1rem pr-1rem justify-center items-center cursor-pointer border-b-1 border-gray-100 dark:border-0">
        <div className="flex-1 p-0.5rem pl-0">
          <div className="flex justify-between items-start mb-12">
            <h3 className="text-base under-mobile:text-xs break-words break-keep line-clamp-2 max-w-prose dark:text-white dark:text-opacity-85">
              {agoraTitle}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-nowrap">
              <span className="text-blue-500 dark:text-dark-pro-color">
                찬성
                <span className="text-athens-gray-thick pl-3 dark:text-dark-line">
                  {participants.pros}
                  명
                  <span aria-hidden> | </span>
                </span>
              </span>
              <span className="text-red-500 dark:text-dark-con-color">
                반대
                <span className="text-athens-gray-thick pl-3 dark:text-dark-line">
                  {participants.cons}
                  명
                  <span aria-hidden> | </span>
                </span>
              </span>
              <span className="dark:text-white dark:text-opacity-80">
                관찰자
                <span className="pl-3 text-athens-gray-thick dark:text-dark-line">
                  {participants.observer}
                  명
                </span>
              </span>
            </div>
            <div className="text-xs dark:text-dark-line">{getRelativeTime()}</div>
          </div>
        </div>
        <div className="relative">
          <UserImage className={`w-67 h-67 bg-${agoraColor} rounded-3xl`} w={67} h={67} />
          <span className={`absolute top-0 left-53 inline-block w-13 h-13 ${status === 'queued' ? 'bg-athens-button' : 'bg-red-400'} rounded-full ml-3`} />
        </div>
      </div>
    </article>
  );
}
