'use client';

import {
  ClosedAgora,
  CategoryAgora as ICategoryAgora,
} from '@/app/model/Agora';
import { useRouter } from 'next/navigation';
import React, { useCallback, useRef, useState } from 'react';
import { enterAgoraSegmentKey } from '@/constants/segmentKey';
import Image from 'next/image';
import { AGORA_STATUS } from '@/constants/agora';
import { isValidImgUrl } from '@/utils/validation/validateImage';
import { COLOR, ColorValue } from '@/constants/consts';
import Loading from '@/app/_components/atoms/loading';
import { isActiveAgora } from '@/utils/validation/validateAgora';
import { useEnterClosedAgoraAction } from '@/hooks/useEnterClosedAgoraAction';
import ClosedAgoraVoteResultBar from './ClosedAgoraVoteResultBar';
import {
  getAgoraDetailString,
  getAgoraIntroduceString,
} from '../../utils/getScreenReaderString';

type Props = {
  agora: ICategoryAgora | ClosedAgora;
  className?: string;
};

function CategoryAgora({ agora, className }: Props) {
  const router = useRouter();
  const agoraColor: ColorValue =
    COLOR.find((color) => color.value === agora.agoraColor)?.value ||
    COLOR[0].value;

  const [isActiveScreenReaderDetails, setIsActiveScreenReaderDetails] =
    useState(false);
  const articleRef = useRef<HTMLButtonElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const routeAgoraPage = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const { isLoading, setSelectAgoraData, enterClosedAgoraMutation } =
    useEnterClosedAgoraAction({
      routeAgoraPage,
      agora,
    });

  const handleEnterAgora = () => {
    if (agora.status === AGORA_STATUS.CLOSED) {
      enterClosedAgoraMutation.mutate();
      return;
    }

    if (
      agora.status === AGORA_STATUS.QUEUED ||
      agora.status === AGORA_STATUS.RUNNING
    ) {
      setSelectAgoraData();
      routeAgoraPage(`/flow${enterAgoraSegmentKey}/${agora.id}`);
    }
  };

  function onKeyDownAgoraSRDetail(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsActiveScreenReaderDetails(true);
      buttonRef.current?.focus();
    } else if (e.key === 'Tab' && e.shiftKey) {
      setIsActiveScreenReaderDetails(false);
    }
  }

  function handleEnterAgoraPress(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Tab') {
      setIsActiveScreenReaderDetails(false);
    } else if (e.key === 'Escape') {
      setIsActiveScreenReaderDetails(false);
      articleRef.current?.focus();
    } else if (e.key === 'Enter') {
      handleEnterAgora();
    }
  }

  function onClickAgoraDetail() {
    setIsActiveScreenReaderDetails(true);
    buttonRef.current?.focus();
  }

  const getButtonText = useCallback((status: string) => {
    if (status === AGORA_STATUS.CLOSED) {
      return '결과보기';
    }
    return '입장하기';
  }, []);

  return (
    <article
      /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
      tabIndex={0}
      /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
      role="button"
      ref={articleRef}
      onKeyDown={onKeyDownAgoraSRDetail}
      onClick={onClickAgoraDetail}
      onBlur={() => setIsActiveScreenReaderDetails(false)}
      id={`${agora.id}`}
      className={`${className} w-165 under-mobile:w-130 p-10 border-1 rounded-lg flex flex-col justify-center items-center dark:bg-dark-light-300 dark:border-dark-light-600 border-slate-200 bg-slate-50 cursor-default`}
      aria-label={getAgoraIntroduceString(agora)}
    >
      <div
        className={`${agoraColor} under-mobile:w-3rem under-mobile:h-3rem w-4rem h-4rem rounded-3xl under-mobile:rounded-2xl relative`}
      >
        {isValidImgUrl(agora.imageUrl) && (
          <Image
            src={agora.imageUrl}
            alt="아고라 이미지"
            layout="fill"
            objectFit="cover"
            className="rounded-3xl under-mobile:rounded-2xl"
          />
        )}
        {agora.status !== AGORA_STATUS.CLOSED && (
          <div
            className={`w-0.5rem h-0.5rem rounded-full ${agora.status === AGORA_STATUS.RUNNING ? 'bg-athens-button' : 'bg-red-400'} absolute top-3 right-2 under-mobile:top-2 under-mobile:right-1 z-5`}
          />
        )}
      </div>
      <h3 className="text-xs under-mobile:font-semibold pt-10 dark:text-white w-full text-center whitespace-nowrap overflow-hidden text-ellipsis">
        {agora.agoraTitle}
      </h3>
      <div
        role="group"
        aria-label={
          agora.status === AGORA_STATUS.CLOSED
            ? '투표 결과'
            : '아고라 참여 인원'
        }
        className="text-xs pt-7 w-full"
      >
        {isActiveAgora(agora) ? (
          <>
            <span className="pr-5 text-athens-gray-thick text-nowrap dark:text-dark-line">
              <span className="text-blue-600 pr-3 dark:text-dark-pro-color">
                찬성
              </span>
              {agora.participants.pros}명
            </span>
            <span className="pr-5 text-athens-gray-thick text-nowrap dark:text-dark-line">
              <span className="text-red-600 pr-3 dark:text-dark-con-color">
                반대
              </span>
              {agora.participants.cons}명
            </span>
            <span className="under-mobile:block break-keep">
              <span className="pr-3 dark:text-white dark:text-opacity-85">
                관찰자
              </span>
              <span className="text-athens-gray-thick dark:text-dark-line">
                {agora.participants.observer}명
              </span>
            </span>
          </>
        ) : (
          <ClosedAgoraVoteResultBar
            prosCount={agora.prosCount}
            consCount={agora.consCount}
            totalMember={agora.totalMember}
          />
        )}
      </div>
      <button
        aria-label={getAgoraDetailString(agora)}
        ref={buttonRef}
        onClick={handleEnterAgora}
        onKeyDown={handleEnterAgoraPress}
        tabIndex={isActiveScreenReaderDetails ? 0 : -1}
        type="button"
        className="flex justify-center items-center text-sm under-mobile:text-xs text-white bg-athens-main p-4 pt-5 pb-5 mt-10 w-9rem under-mobile:w-110 rounded-md"
      >
        {isLoading ? <Loading w="19" /> : getButtonText(agora.status)}
      </button>
    </article>
  );
}

export default React.memo(CategoryAgora);
