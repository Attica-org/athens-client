'use client';

import EyeIcon from '@/assets/icons/EyeIcon';
import React, { useState } from 'react';
import BackButton from '../../../_components/atoms/BackButton';
import ShareButton from '../atoms/ShareButton';
import AgoraTitle from './AgoraTitle';
import HamburgerButton from '../atoms/HamburgerButton';

export default function Header() {
  const [progress, setProgress] = useState(false);
  // TODO: 전역 상태로 메뉴를 열고 닫도록 수정
  const [toggle, setToggle] = useState(false);

  const toggleMenu = () => {
    setToggle(!toggle);
  };

  const toggleProgress = () => {
    setProgress(!progress);
  };

  return (
    <div className="flex flex-col w-full justify-center dark:text-white dark:text-opacity-85">
      <div className="flex justify-between items-center pb-10 border-b-1 border-gray-200 dark:border-dark-bg-light">
        <BackButton />
        <div className="flex justify-center items-center text-sm under-mobile:text-xs">
          <button
            type="button"
            onClick={toggleProgress}
            aria-label={`토론 ${progress ? '종료하기' : '시작하기'}`}
            className="italic bg-athens-main p-4 pl-15 pr-15 under-mobile:pl-10 under-mobile:pr-10 rounded-lg text-white mr-0.5rem"
          >
            {progress ? 'END' : 'START'}
          </button>
          <div
            role="group"
            aria-label="아고라 정보"
            className="flex justify-center items-center"
          >
            <div
              role="timer"
              aria-label="토론 제한 시간"
              className="italic border-1 border-athens-main p-4 pl-15 pr-15 under-mobile:pl-10 under-mobile:pr-10 rounded-lg"
            >
              60:00
            </div>
            <div
              role="status"
              aria-label="토론 종료 버튼을 누른 인원 수"
              className="text-xs text-athens-gray-thick pl-0.5rem pr-0.5rem dark:text-white dark:text-opacity-85"
            >
              8
            </div>
            <div
              role="status"
              aria-label="관찰자 수"
              className="flex justify-center items-center"
            >
              <EyeIcon className="w-1rem" />
              <span className="pl-5 text-xs text-athens-gray-thick dark:text-white dark:text-opacity-85">12</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center mr-0.5rem">
          <ShareButton />
          <HamburgerButton toggleMenu={toggleMenu} />
        </div>
      </div>
      <div className="flex justify-center items-center pt-0.5rem">
        <AgoraTitle />
      </div>
    </div>
  );
}
