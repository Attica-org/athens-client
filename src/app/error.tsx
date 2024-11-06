'use client';

// -> error component는 client component여아함

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { homeSegmentKey } from '@/constants/segmentKey';
import { PROFLELIST } from '@/constants/consts';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // console.dir(error);
  }, [error]);

  const randomIndex = Math.floor(Math.random() * PROFLELIST.length);
  const randomProfile = PROFLELIST[randomIndex];
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center w-dvw h-dvh scrollbar-hide">
      <h1 className="text-3xl dark:text-white mb-26">Athens</h1>
      <div className="w-250 h-250 rounded-full bg-white flex justify-center items-center">
        <Image
          className="rounded-full object-contain"
          src={`/img/${randomProfile.file}`}
          alt={`${randomProfile.name} 프로필`}
          width={250}
          height={250}
        />
      </div>
      <div className="dark:text-white text-sm mt-12">{randomProfile.name}</div>
      <h2 className="dark:text-white text-lg mt-32">
        예기치 않은 에러가 발생했습니다.
      </h2>
      <p className="dark:text-white text-sm mt-12">
        문제가 지속되면 관리자에게 문의해주세요.
      </p>
      <button
        className="bg-athens-main text-white rounded-full px-16 py-7 mt-20 text-sm"
        type="button"
        onClick={
          // 재시도
          () => reset()
        }
      >
        재시도하기
      </button>
      <button
        className="dark:text-white text-black rounded-md px-16 py-8 mt-12 text-sm"
        type="button"
        onClick={() => router.replace(`${homeSegmentKey}?status=active`)}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
