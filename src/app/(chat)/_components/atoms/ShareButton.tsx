'use client';

import ShareIcon from '@/assets/icons/ShareIcon';
import showToast from '@/utils/showToast';
import { useParams } from 'next/navigation';
import React, { MouseEventHandler, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';

import 'react-spring-bottom-sheet/dist/style.css';

type Props = {
  title: string;
};

export default function ShareButton({ title }: Props) {
  const pathname = useParams();
  const [open, setOpen] = useState(false);

  const shareSNS:MouseEventHandler<HTMLButtonElement> = async () => {
    const url = `${process.env.NEXT_PUBLIC_CLIENT_URL}/agoras/${pathname.agora}`;

    if (window.navigator.share) {
      try {
        await window.navigator.share({
          title,
          text: '다양한 사람들과 토론에 함께하세요!',
          url,
        });
      } catch (error) {
        await navigator.clipboard.writeText(url);
        showToast('공유기능 미지원 환경으로, 클립보드에 링크가 복사되었습니다.', 'error');
      }
    } else if (window.innerWidth < 1024) {
      setOpen(true);
    } else {
      // 모달로 공유하기 창 띄우기
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
      className="cursor-pointer"
    >
      <ShareIcon className="w-17 mr-1rem under-mobile:mr-0.5rem" />
      <BottomSheet onDismiss={handleDismiss} open={open}>
        SNS 공유하기
      </BottomSheet>
    </button>
  );
}
