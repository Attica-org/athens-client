'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function Agora() {
  const router = useRouter();

  // TODO: 아고라 id를 받아서 해당 아고라로 이동
  const enterAgora = () => {
    router.push('/flow/enter-agora');
  };

  const title = '국가 발전에는 유능한 독재자가 필요한 시기가 있다';

  return (
    <article className="w-165 under-mobile:w-130 p-10 border-1 rounded-lg flex flex-col justify-center items-center dark:bg-dark-light-300 dark:border-gray-500">
      <div className="under-mobile:w-3rem under-mobile:h-3rem w-4rem h-4rem rounded-3xl bg-yellow-400 relative">
        <div className="w-0.5rem h-0.5rem rounded-full bg-red-400 absolute top-2 right-1 z-5" />
      </div>
      <h3 className="text-xs under-mobile:text-xs under-mobile:font-semibold pt-10 dark:text-white">
        {title}
      </h3>
      <p aria-label="아고라 참여 인원" className="text-xs pt-7">
        <span className="pr-5 text-athens-gray-thick text-nowrap dark:text-dark-line">
          <span className="text-blue-600 pr-3 dark:text-dark-pro-color">찬성</span>
          10명
        </span>
        <span className="pr-5 text-athens-gray-thick text-nowrap dark:text-dark-line">
          <span className="text-red-600 pr-3 dark:text-dark-con-color">반대</span>
          10명
        </span>
        <span className="under-mobile:bloc break-keep">
          <span className="pr-3 dark:text-white dark:text-opacity-85">관찰자</span>
          <span className="text-athens-gray-thick dark:text-dark-line">10명</span>
        </span>
      </p>
      <button
        aria-label="아고라 입장하기"
        onClick={enterAgora}
        type="button"
        className="text-sm under-mobile:text-xs text-white bg-athens-main p-4 pt-5 pb-5 mt-10 w-8rem under-mobile:w-6rem rounded-md"
      >
        입장하기
      </button>
    </article>
  );
}
