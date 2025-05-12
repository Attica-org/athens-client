'use client';

import ModalBase from '@/app/_components/molecules/ModalBase';
import { useChatInfo } from '@/store/chatInfo';
import { useVoteStore } from '@/store/vote';
import Confetti from '@/app/_components/utils/Confetti';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export default function ResultAgora() {
  const prosColor = 'bg-blue-400';
  const consColor = 'bg-red-400';
  const { voteResult, setVoteEnd } = useVoteStore(
    useShallow((state) => ({
      voteResult: state.voteResult,
      setVoteEnd: state.setVoteEnd,
      reset: state.reset,
    })),
  );
  const { title } = useChatInfo(
    useShallow((state) => ({
      title: state.title,
    })),
  );

  useEffect(() => {
    setVoteEnd(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Confetti />
      <ModalBase title="투표 결과" closeIcon animation>
        <div className="flex justify-center items-center flex-col">
          <h2
            aria-label="토론 주제"
            className="break-keep text-center text-sm lg:text-base font-semibold"
          >
            {title}
          </h2>
          <p className="flex justify-center items-center">
            <span id="description" className="sr-only">
              찬성에 {voteResult.prosCount}명, 반대에 {voteResult.consCount}명이
              투표하였습니다.
            </span>
            <div
              aria-label="찬성 표 수"
              className={`${prosColor} mt-1.5rem text-white p-5 pl-1.5rem pr-1.5rem text-sm rounded-lg mr-16`}
            >
              찬성 {voteResult.prosCount || 0}
            </div>
            <div
              aria-label="반대 표 수"
              className={`${consColor} mt-1.5rem text-white p-5 pl-1.5rem pr-1.5rem text-sm rounded-lg`}
            >
              반대 {voteResult.consCount || 0}
            </div>
          </p>
          <Link
            prefetch
            aria-label="홈으로 가기"
            href="/home"
            className="pt-1.5rem text-sm text-athens-gray-thick dark:text-dark-line"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </ModalBase>
    </>
  );
}
