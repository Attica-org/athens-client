'use client';

import ShareIcon from '@/assets/icons/ShareIcon';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function ShareButton() {
  const router = useRouter();

  const shareSNS = () => {
    // TODO: SNS 공유 기능 추가
    router.push('/agora/flow/end-agora');
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
