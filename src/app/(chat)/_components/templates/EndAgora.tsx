'use client';

import ModalBase from '@/app/_components/molecules/ModalBase';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

type ResultPosition = 'pro' | 'con' | 'abs';

export default function EndAgora() {
  const [selectedResultPosition, setSelectedResultPosition] = useState<ResultPosition>('abs');
  const [sec, setSec] = useState<number>(15);
  const timerId = useRef<NodeJS.Timeout>();
  const router = useRouter();

  useEffect(() => {
    timerId.current = setInterval(() => {
      setSec((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(timerId.current);
    };
  }, []);

  useEffect(() => {
    if (sec < 1) {
      // TODO: 투표 결과를 서버로 전송
      clearInterval(timerId.current);

      router.back();
    }
  });

  const selectResultPosition = (position: ResultPosition) => {
    setSelectedResultPosition(position);
  };

  // TODO: 사용자가 선택하지 않고 화면을 이탈할 경우 abs로 처리

  return (
    <ModalBase title="토론 종료" removeIcon={false} animation={false}>
      <div className="flex justify-center items-center flex-col">
        <p className="text-xs text-athens-gray-thick dark:text-dark-line-light">
          최종 투표를 진행해주세요.
        </p>
        <div
          role="status"
          aria-label="투표 종료까지 남은 시간"
          className={`pt-0.5rem ${sec <= 5 && 'text-red-500 dark:text-dark-con-color'}`}
        >
          {sec}
        </div>
        <h2
          aria-label="토론 주제"
          className="p-1rem pt-1rem text-base break-keep text-center"
        >
          국가 발전에 유능한 독재자가 필요한 시기가 있다.
        </h2>
        <div className="pt-0.5rem pb-0.5rem">
          <button
            type="button"
            aria-label="찬성하기"
            onClick={() => selectResultPosition('pro')}
            className={`${
              selectedResultPosition === 'pro'
                ? 'bg-blue-400 text-white'
                : 'text-blue-600 bg-white dark:text-white dark:bg-dark-light-500'
            } mr-1rem text-sm p-6 pl-1.5rem pr-1.5rem rounded-xl`}
          >
            찬성
          </button>
          <button
            type="button"
            aria-label="반대하기"
            onClick={() => selectResultPosition('con')}
            className={`${
              selectedResultPosition === 'con'
                ? 'bg-red-400 text-white '
                : 'bg-white text-red-500 dark:text-white dark:bg-dark-light-500'
            } text-sm p-6 pl-1.5rem pr-1.5rem rounded-xl`}
          >
            반대
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
