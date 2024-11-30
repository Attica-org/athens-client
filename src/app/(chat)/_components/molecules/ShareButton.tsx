'use client';

import CopyContentIcon from '@/assets/icons/CopyContentIcon';
import ShareIcon from '@/assets/icons/ShareIcon';
import { useParams, useRouter } from 'next/navigation';
import React, { MouseEventHandler, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import SocialShareLogos from '../atoms/SocialShareLogos';

import 'react-spring-bottom-sheet/dist/style.css';

type Props = {
  title: string;
};

export default function ShareButton({ title }: Props) {
  const pathname = useParams();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const url = `${process.env.NEXT_PUBLIC_CLIENT_URL}/agoras/${pathname.agora}`;

  const clipboardCopy = async () => {
    await navigator.clipboard.writeText(url);
  };

  const shareSNS: MouseEventHandler<HTMLButtonElement> = async () => {
    if (window.innerWidth < 1024) {
      setOpen(true);
    } else {
      // 모달로 공유하기 창 띄우기
      router.push(`/agoras/${pathname.agora}/flow/social-share`);
    }
  };

  const handleDismiss = () => {
    setOpen(false);
  };

  return (
    <button
      type="button"
      aria-label="SNS 공유하기"
      onClick={shareSNS}
      className="cursor-pointer pr-5"
    >
      <ShareIcon className="w-18 lg:w-20 mr-1rem under-mobile:mr-0.5rem" />
      <BottomSheet onDismiss={handleDismiss} open={open}>
        <div className="px-10 pb-22 pl-20 text-sm border-b-1 border-dark-light-500 text-white">
          <div className="pt-5 text-xs flex justify-between items-center">
            <div>
              다양한 사람들과 토론에 함께하세요!
              <div>{url}</div>
            </div>
            <div>
              <button
                type="button"
                aria-label="url 클립보드에 복사하기"
                onClick={clipboardCopy}
              >
                <CopyContentIcon className="w-20 mr-5" />
              </button>
            </div>
          </div>
        </div>
        <SocialShareLogos title={title} url={url} />
      </BottomSheet>
    </button>
  );
}
