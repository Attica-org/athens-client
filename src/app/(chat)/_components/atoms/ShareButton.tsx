'use client';

import ShareIcon from '@/assets/icons/ShareIcon';
import { useParams } from 'next/navigation';
import React, { MouseEventHandler } from 'react';

type Props = {
  title: string;
};

export default function ShareButton({ title }: Props) {
  const pathname = useParams();

  const shareSNS:MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (navigator.share) {
      e.preventDefault();
      if (navigator.canShare()) {
        navigator.share({
          title,
          text: '다양한 사람들과 토론에 함께하세요!',
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/agoras/${pathname.agora}`,
        });
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/agoras/${pathname.agora}`);
        alert('공유기능이 제공되지 않는 환경입니다.\n클립보드에 링크가 복사되었습니다.');
      } catch (error) {
        alert('공유와 복사가 제공되지 않는 환경입니다.');
      }
    }
  };

  return (
    <button
      type="button"
      aria-label="SNS 공유하기"
      onClick={shareSNS}
      className="cursor-pointer"
    >
      <ShareIcon className="w-20 mr-1rem under-mobile:mr-0.5rem" />
    </button>
  );
}
