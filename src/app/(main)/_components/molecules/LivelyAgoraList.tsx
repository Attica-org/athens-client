'use client';

import Loading from '@/app/_components/atoms/loading';
import DeferredComponent from '@/app/_components/utils/DefferedComponent';
import { useQueryClient } from '@tanstack/react-query';
import RefreshIcon from '@/assets/icons/RefreshIcon';
import React, { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLivelyAgoraQuery } from '@/hooks/query/useLivelyAgoraQuery';
import { useLivelyAgoraSwiper } from '@/hooks/useLivelyAgoraSwiper';
import NoAgoraMessage from '../atoms/NoAgoraMessage';
import CategoryAgora from '../atoms/CategoryAgora';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/mousewheel';

export default function LivelyAgoraList() {
  const queryClient = useQueryClient();
  const swiperContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const {
    data: agoras,
    refetch,
    isFetching,
    isPending,
  } = useLivelyAgoraQuery({ queryClient });

  const { setSwiperInstance, isMounted, key } = useLivelyAgoraSwiper({
    agoras,
    isFetching,
    pathname,
    swiperContainerRef,
  });

  const refetchLivelyAgoraList = () => {
    setSwiperInstance(null);
    refetch();
  };

  const handleKeyDownRefresh = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      refetchLivelyAgoraList();
    }
  };

  const content = () => {
    if (isFetching || isPending) {
      return (
        <div className="min-h-64 w-full">
          <DeferredComponent>
            <Loading
              w="25"
              h="25"
              className="m-5 flex justify-center items-center"
            />
          </DeferredComponent>
        </div>
      );
    }
    if (!agoras || agoras.length < 1 || agoras[0] === null) {
      return <NoAgoraMessage />;
    }
    return (
      isMounted &&
      agoras.length > 0 && (
        <div className="w-full px-0.5rem pb-32 flex overflow-hidden ml-5">
          <div
            key={key}
            id="lively-agora-swiper"
            ref={swiperContainerRef}
            className="lively-agora-swiper pr-1rem w-full h-full"
          >
            <div className="swiper-wrapper h-full">
              {agoras.map(
                (agora) =>
                  agora && (
                    <div key={agora.id} className="swiper-slide h-full">
                      <CategoryAgora agora={agora} />
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      )
    );
  };

  return (
    <section aria-label="인기 아고라 리스트" className="w-full h-fit">
      <h2
        aria-label="실시간 인기 아고라"
        className="flex justify-between items-center gap-x-6 text-md font-semibold dark:text-dark-line-light text-left pl-10 w-full mb-16 mt-7"
      >
        🔥 실시간 HOT 아고라
        <button
          type="button"
          aria-label="인기 아고라 새로고침"
          onClick={refetchLivelyAgoraList}
          onKeyDown={handleKeyDownRefresh}
          className="cursor-pointer flex font-normal mr-5"
        >
          <span className="text-xs mr-5 text-athens-sub font-bold">
            새로고침
          </span>
          <RefreshIcon className="w-16 h-16" />
        </button>
      </h2>
      {content()}
    </section>
  );
}
