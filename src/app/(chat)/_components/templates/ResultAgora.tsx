'use client';

import ModalBase from '@/app/_components/molecules/ModalBase';
import { useVoteStore } from '@/store/vote';
import Confetti from '@/utils/Confetti';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export default function ResultAgora() {
  const prosColor = 'bg-blue-400';
  const consColor = 'bg-red-400';
  const { voteResult, setVoteEnd, reset } = useVoteStore(useShallow((state) => ({
    voteResult: state.voteResult,
    setVoteEnd: state.setVoteEnd,
    reset: state.reset,
  })));

  useEffect(() => {
    setVoteEnd(false);
    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Confetti />
      <ModalBase title="투표 결과" removeIcon animation>
        <div className="flex justify-center items-center flex-col">
          <h2
            aria-label="토론 주제"
            className="break-keep text-center text-base font-semibold"
          >
            기후 변화 대책에 대한 토론
          </h2>
          <div className="flex justify-center items-center">
            <div
              aria-label="찬성 표 수"
              className={`${prosColor} mt-1.5rem text-white p-5 pl-1.5rem pr-1.5rem text-sm rounded-lg mr-16`}
            >
              찬성
              {' '}
              {voteResult.prosCount || 0}
            </div>
            <div
              aria-label="반대 표 수"
              className={`${consColor} mt-1.5rem text-white p-5 pl-1.5rem pr-1.5rem text-sm rounded-lg`}
            >
              반대
              {' '}
              {voteResult.consCount || 0}
            </div>
          </div>
          <Link
            aria-label="홈으로 가기"
            href="/"
            className="pt-1.5rem text-sm text-athens-gray-thick dark:text-dark-line"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </ModalBase>
    </>
  );
}
