'use client';

import EyeIcon from '@/assets/icons/EyeIcon';
import React, { useState } from 'react';
import { useSidebarStore } from '@/store/sidebar';
import { useShallow } from 'zustand/react/shallow';
import BackButton from '../../../_components/atoms/BackButton';
import ShareButton from '../atoms/ShareButton';
import AgoraTitle from './AgoraTitle';
import HamburgerButton from '../atoms/HamburgerButton';

const title = '기후 변화 대책에 대한 토론';

export default function Header() {
  const { toggle } = useSidebarStore(
    useShallow((state) => ({ toggle: state.toggle })),
  );
  const [progress, setProgress] = useState(false);

  const toggleMenu = () => {
    toggle();
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
          <ShareButton title={title} />
          <HamburgerButton toggleMenu={toggleMenu} />
        </div>
      </div>
      <div className="flex justify-center items-center pt-0.5rem">
        <AgoraTitle title={title} />
      </div>
    </div>
  );
}
