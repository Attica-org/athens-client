import { ActiveAgora } from '@/app/model/Agora';
import { useEffect, useLayoutEffect, useState } from 'react';
import Swiper from 'swiper';

type LivelyAgoraSwiperArg = {
  pathname: string;
  agoras: ActiveAgora[] | undefined;
  isFetching: boolean;
  swiperContainerRef: React.RefObject<HTMLDivElement>;
};

export const useLivelyAgoraSwiper = ({
  pathname,
  agoras,
  isFetching,
  swiperContainerRef,
}: LivelyAgoraSwiperArg) => {
  const [swiperInstance, setSwiperInstance] = useState<Swiper | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [key, setKey] = useState(0); // 강제 리렌더링을 위한 키

  useEffect(() => {
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
    // 페이지 변경 시 key를 업데이트하여 강제 리렌더링
    setKey((prevKey) => prevKey + 1);
    setSwiperInstance(null);
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

  return {
    isMounted,
    key,
    setSwiperInstance,
  };
};
