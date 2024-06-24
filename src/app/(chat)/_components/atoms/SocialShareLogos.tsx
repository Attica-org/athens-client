'use client';

import { useChatInfo } from '@/store/chatInfo';
import getKey from '@/utils/getKey';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import {
  EmailShareButton,
  EmailIcon,
  FacebookIcon,
  FacebookShareButton,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  LineShareButton,
  LineIcon,
  XIcon,
  TwitterShareButton,
} from 'react-share';
import Swiper from 'swiper';

import 'swiper/css/free-mode';
import 'swiper/css/mousewheel';

type Props = {
  title?: string;
  url?: string;
};

export default function SocialShareLogos({ title, url }: Props) {
  const pathname = useParams();
  const sendUrl =
    url || `${process.env.NEXT_PUBLIC_CLIENT_URL}/agoras/${pathname.agora}`; // 공유할 URL

  useEffect(() => {
    const swiper = new Swiper('.swiper', {
      direction: 'horizontal',
      loop: false,
      centeredSlides: false,
      touchRatio: 1,
      freeMode: true,
      grabCursor: true,
      slidesPerView: 'auto',
      spaceBetween: 0,
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
    });

    return () => {
      swiper.destroy();
    };
  }, []);

  useEffect(() => {
    const setKakao = async () => {
      const key = await getKey();

      if (typeof window !== 'undefined') {
        const { Kakao } = window;

        if (!Kakao.isInitialized()) {
          Kakao.init(key.kakaoKey);
        }
      }
    };

    setKakao();
  }, []);

  const getTitleFromState = () => {
    const agoraTitle = useChatInfo.getState().title;
    return agoraTitle;
  };

  const shareKakao = () => {
    const imgUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/opengraph.png`;
    const { Kakao } = window;

    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${title || getTitleFromState()}`,
        description: '아고라에 참여하고 실시간 토론을 시작하세요.',
        imageUrl: imgUrl,
        link: {
          mobileWebUrl: sendUrl,
          webUrl: sendUrl,
        },
      },
      buttons: [
        {
          title: '아고라 바로가기',
          link: {
            mobileWebUrl: sendUrl,
            webUrl: sendUrl,
          },
        },
      ],
    });
  };

  return (
    <div className="overflow-hidden text-nowrap w-full pl-16 lg:pl-0 pb-16 pt-20">
      <div className="swiper w-full">
        <div className="swiper-wrapper flex lg:justify-center">
          <div className="swiper-slide">
            <FacebookShareButton
              url={sendUrl}
              className="mr-20"
              aria-label="페이스북으로 공유하기"
            >
              <FacebookIcon size={45} round />
              <div className="text-xs pt-5 text-white lg:text-black lg:dark:text-white">
                Facebook
              </div>
            </FacebookShareButton>
          </div>
          <div className="swiper-slide">
            <FacebookMessengerShareButton
              url={sendUrl}
              appId="521270401588372"
              className="mr-20"
              aria-label="페이스북 메신저로 공유하기"
            >
              <FacebookMessengerIcon size={45} round />
              <div className="text-xs pt-5 text-white lg:text-black lg:dark:text-white">
                Messanger
              </div>
            </FacebookMessengerShareButton>
          </div>
          <div className="swiper-slide">
            <TwitterShareButton
              url={sendUrl}
              title={title}
              className="mr-20"
              aria-label="트위터로 공유하기"
            >
              <XIcon size={45} round />
              <div className="text-xs pt-5 text-white lg:text-black lg:dark:text-white">
                X
              </div>
            </TwitterShareButton>
          </div>
          <div className="swiper-slide">
            <button
              aria-label="카카오톡으로 공유하기"
              type="button"
              className="mr-20 flex flex-col justify-center items-center"
              onClick={shareKakao}
            >
              <Image
                src="/img/kakao_logo.png"
                alt="카카오톡 로고"
                width={45}
                height={45}
              />
              <div className="text-xs pt-5 text-white lg:text-black lg:dark:text-white">
                Kakao Talk
              </div>
            </button>
          </div>
          <div className="swiper-slide">
            <EmailShareButton
              url={sendUrl}
              subject={`athens-${title}`}
              body={`athens-${title}`}
              className="mr-20"
              aria-label="이메일로 공유하기"
            >
              <EmailIcon size={45} round />
              <div className="text-xs pt-5 text-white lg:text-black lg:dark:text-white">
                Email
              </div>
            </EmailShareButton>
          </div>
          <div className="swiper-slide">
            <LineShareButton
              url={sendUrl}
              title={title}
              className="mr-20"
              aria-label="라인으로 공유하기"
            >
              <LineIcon size={45} round />
              <div className="text-xs pt-5 text-white lg:text-black lg:dark:text-white">
                Line
              </div>
            </LineShareButton>
          </div>
        </div>
      </div>
    </div>
  );
}
