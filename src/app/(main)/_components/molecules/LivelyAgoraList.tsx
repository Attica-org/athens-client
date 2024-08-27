'use client';

import Loading from '@/app/_components/atoms/loading';
import DeferredComponent from '@/app/_components/utils/DefferedComponent';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Agora } from '@/app/model/Agora';
import RefreshIcon from '@/assets/icons/RefreshIcon';
import Swiper from 'swiper';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLivelyAgora } from '../../_lib/getLivelyAgora';
import NoAgoraMessage from '../atoms/NoAgoraMessage';
import CategoryAgora from '../atoms/CategoryAgora';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/mousewheel';

export default function LivelyAgoraList() {
  const queryClient = useQueryClient();
  const swiperContainerRef = useRef<HTMLDivElement>(null);
  const [swiperInstance, setSwiperInstance] = useState<Swiper | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [key, setKey] = useState(0); // 강제 리렌더링을 위한 키
  const pathname = usePathname();

  const {
    data: agoras,
    refetch,
    isFetching,
    isPending,
  } = useQuery<Agora[], Object, Agora[], [string, string]>({
    queryKey: ['agoras', 'lively'],
    queryFn: getLivelyAgora,
    retry: 2,
    initialData: () => {
      return queryClient.getQueryData(['agoras', 'lively']);
    },
  });

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
    setIsMounted(true);

    return () => {
      setIsMounted(false);
      if (swiperInstance && !swiperInstance.destroyed) {
        swiperInstance.destroy();
      }
    };
  }, [swiperInstance]);

  useEffect(() => {
    if (swiperInstance && !swiperInstance.destroyed) {
      swiperInstance.destroy();
    }
    setSwiperInstance(null);
    // 페이지 변경 시 key를 업데이트하여 강제 리렌더링
    setKey((prevKey) => prevKey + 1);
  }, [pathname, swiperInstance]);

  useLayoutEffect(() => {
    if (
      agoras &&
      !isFetching &&
      isMounted &&
      swiperContainerRef.current &&
      !swiperInstance
    ) {
      setTimeout(() => {
        const element = document.getElementById('lively-agora-swiper');

        if (element) {
          const swiper = new Swiper('.lively-agora-swiper', {
            direction: 'horizontal',
            loop: false,
            centeredSlides: false,
            touchRatio: 1,
            freeMode: true,
            grabCursor: true,
            slidesPerView: 'auto',
            spaceBetween: 10,
            keyboard: {
              enabled: true,
              onlyInViewport: false,
            },
          });

          setSwiperInstance(swiper);
        }
      }, 0);
    }
  }, [isMounted, agoras, key, swiperContainerRef, swiperInstance, isFetching]);

  const refetchLivelyAgoraList = () => {
    setSwiperInstance(null);
    refetch();
  };

  const handleClickRefresh = () => {
    refetchLivelyAgoraList();
  };

  const handleKeyDownRefresh = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      refetchLivelyAgoraList();
    }
  };

  const content = () => {
    if (isFetching || isPending) {
      return (
        <div className="h-36 w-full">
          <DeferredComponent>
            <Loading
              w="32"
              h="32"
              className="m-5 flex justify-center items-center"
            />
          </DeferredComponent>
        </div>
      );
    }
    if (!agoras || agoras.length < 1) {
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
              {agoras.map((agora) => (
                <div key={agora.id} className="swiper-slide h-full">
                  <CategoryAgora agora={agora} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    );
  };

  return (
    <section aria-label="인기 아고라 리스트" className="w-full h-1/2">
      <h2
        aria-label="실시간 인기 아고라"
        className="flex justify-between items-center gap-x-6 text-md font-semibold dark:text-dark-line-light text-left pl-10 w-full mb-16 mt-7"
      >
        🔥 실시간 HOT 아고라
        <button
          type="button"
          aria-label="활발한 아고라 다시 불러오기"
          onClick={handleClickRefresh}
          onKeyDown={handleKeyDownRefresh}
          className="cursor-pointer flex font-normal mr-5"
        >
          <span className="text-xs mr-5 text-athens-sub">새로고침</span>
          <RefreshIcon className="w-16 h-16" fill="#FEAC3E" />
        </button>
      </h2>
      {content()}
    </section>
  );
}
