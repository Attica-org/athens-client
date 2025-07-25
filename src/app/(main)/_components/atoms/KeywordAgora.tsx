'use client';

import React, { KeyboardEventHandler, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { enterAgoraSegmentKey } from '@/constants/segmentKey';
import Image from 'next/image';
import { AGORA_STATUS } from '@/constants/agora';
import { isValidImgUrl } from '@/utils/validation/validateImage';
import { COLOR } from '@/constants/consts';
import { UnionAgora, KeywordAgora as IKeywordAgora } from '@/app/model/Agora';
import {
  isActiveAgora,
  isKeywordAgora,
} from '@/utils/validation/validateAgora';
import { useEnterClosedAgoraAction } from '@/hooks/useEnterClosedAgoraAction';
import ClosedAgoraVoteResultBar from './ClosedAgoraVoteResultBar';
import { getAgoraDetailString } from '../../utils/getScreenReaderString';

type Props = {
  agora: UnionAgora;
};

export default function KeywordAgora({ agora }: Props) {
  const router = useRouter();
  const routeAgoraPage = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const { enterClosedAgoraMutation, setSelectAgoraData } =
    useEnterClosedAgoraAction({
      routeAgoraPage,
      agora,
    });

  const handleEnterAgora = () => {
    if (
      agora.status === AGORA_STATUS.QUEUED ||
      agora.status === AGORA_STATUS.RUNNING
    ) {
      setSelectAgoraData();
      routeAgoraPage(`/flow${enterAgoraSegmentKey}/${agora.id}`);
    } else if (agora.status === AGORA_STATUS.CLOSED) {
      enterClosedAgoraMutation.mutate();
    }
  };

  const handleKeyDownEnterAgora: KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === 'Enter') {
      handleEnterAgora();
    }
  };

  const getRelativeTime = (time: IKeywordAgora['createdAt']) => {
    const relativeDate = formatDistanceToNow(time, {
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
        aria-label={`${agora.agoraTitle}, ${getAgoraDetailString(agora)}`}
        onKeyDown={handleKeyDownEnterAgora}
        onClick={handleEnterAgora}
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
              {isKeywordAgora(agora) && getRelativeTime(agora.createdAt)}
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
                prosCount={agora.prosCount}
                consCount={agora.consCount}
                totalMember={agora.totalMember}
              />
            )}
          </div>
        </div>
        <div className="relative w-67 h-67">
          {isValidImgUrl(agora.imageUrl) ? (
            <Image
              src={agora.imageUrl}
              alt="아고라 이미지"
              objectFit="cover"
              layout="fill"
              className="rounded-3xl under-mobile:rounded-2xl"
            />
          ) : (
            <div
              className={`w-67 h-67 ${COLOR.some((color) => color.value === agora.agoraColor) ? agora.agoraColor : COLOR[0].value} rounded-3xl border-1 dark:border-athens-gray`}
            />
          )}
          {agora.status !== AGORA_STATUS.CLOSED && (
            <span
              className={`absolute top-2 left-50 inline-block w-13 h-13 ${agora.status === AGORA_STATUS.QUEUED ? 'bg-athens-button' : 'bg-red-400'} rounded-full ml-3`}
            />
          )}
        </div>
      </div>
    </article>
  );
}
