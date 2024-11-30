'use client';

import { AgoraData } from '@/app/model/Agora';
import { useAgora } from '@/store/agora';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import isActiveAgora from '@/utils/validation/validateIsActiveAgora';
import { enterAgoraSegmentKey } from '@/constants/segmentKey';
import Image from 'next/image';
import { AGORA_POSITION, AGORA_STATUS } from '@/constants/agora';
import { isValidImgUrl } from '@/utils/validation/validateImage';
import { COLOR } from '@/constants/consts';
import ClosedAgoraVoteResultBar from './ClosedAgoraVoteResultBar';

type Props = {
  agora: AgoraData;
  className?: string;
};

export default function CategoryAgora({ agora, className }: Props) {
  const router = useRouter();
  const { setSelectedAgora, setEnterAgora } = useAgora();
  const [selectedColor, setSelectedColor] = useState(COLOR[0].value);

  const routeAgoraPage = () => {
    router.push(`/agoras/${agora.id}`);
  };

  const setAgoraData = () => {
    setEnterAgora({
      id: agora.id,
      thumbnail: agora.imageUrl,
      title: agora.agoraTitle,
      status: agora.status,
      role: AGORA_POSITION.OBSERVER,
      isCreator: false,
      agoraColor: agora.agoraColor,
    });
  };

  // TODO: 아고라 id를 받아서 해당 아고라로 이동
  const enterAgora = () => {
    setSelectedAgora({
      id: agora.id,
      thumbnail: agora.imageUrl,
      title: agora.agoraTitle,
      status: agora.status,
      agoraColor: agora.agoraColor,
    });

    if (
      agora.status === AGORA_STATUS.QUEUED ||
      agora.status === AGORA_STATUS.RUNNING
    ) {
      router.push(`/flow${enterAgoraSegmentKey}/${agora.id}`);
    } else if (agora.status === AGORA_STATUS.CLOSED) {
      setAgoraData();
      routeAgoraPage();
    }
  };

  useEffect(() => {
    setSelectedColor(
      COLOR.find((color) => color.value === agora.agoraColor)?.value ||
        COLOR[0].value,
    );
  }, []);

  return (
    <article
      id={`${agora.id}`}
      className={`${className} w-165 under-mobile:w-130 p-10 border-1 rounded-lg flex flex-col justify-center items-center dark:bg-dark-light-300 dark:border-dark-light-600 border-slate-200 bg-slate-50`}
    >
      <div
        className={`${selectedColor} under-mobile:w-3rem under-mobile:h-3rem w-4rem h-4rem rounded-3xl under-mobile:rounded-2xl relative`}
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
      <h3 className="text-xs under-mobile:font-semibold pt-10 dark:text-white break-all w-full text-center">
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
        aria-label="아고라 입장하기"
        onClick={enterAgora}
        type="button"
        className="text-sm under-mobile:text-xs text-white bg-athens-main p-4 pt-5 pb-5 mt-10 w-9rem under-mobile:w-110 rounded-md"
      >
        {agora.status === AGORA_STATUS.CLOSED ? '결과보기' : '입장하기'}
      </button>
    </article>
  );
}
