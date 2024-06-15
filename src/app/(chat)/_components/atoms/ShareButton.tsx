'use client';

import ShareIcon from '@/assets/icons/ShareIcon';
import showToast from '@/utils/showToast';
import { useParams } from 'next/navigation';
import React, { MouseEventHandler } from 'react';

type Props = {
  title: string;
};

export default function ShareButton({ title }: Props) {
  const pathname = useParams();

  const shareSNS:MouseEventHandler<HTMLButtonElement> = async () => {
    const url = `${process.env.NEXT_PUBLIC_CLIENT_URL}/agoras/${pathname.agora}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: '다양한 사람들과 토론에 함께하세요!',
          url,
        });
      } catch (error) {
        showToast('공유기능을 불러오는데 실패했습니다.', 'error');
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        showToast('공유기능 미지원 환경으로, 클립보드에 링크가 복사되었습니다.', 'error');
      } catch (error) {
        showToast('클립보드 복사에 실패했습니다.', 'error');
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
      <ShareIcon className="w-17 mr-1rem under-mobile:mr-0.5rem" />
    </button>
  );
}
