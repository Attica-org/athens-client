'use client';

import RemoveIcon from '@/assets/icons/RemoveIcon';
import React, { KeyboardEventHandler, MouseEventHandler, useState } from 'react';
import AgoraUserList from '../molecules/AgoraUserList';

type UserList = {
  id: number;
  name: string;
  position: 'pro' | 'con';
  file: string;
};

export default function AgoraUserSide() {
  const userList: UserList[] = [
    {
      id: 1,
      name: '총 든 토끼',
      file: 'rabbit.png',
      position: 'con',
    },
    {
      id: 2,
      name: '도끼 든 회색 곰',
      position: 'pro',
      file: 'bear.png',
    },
    {
      id: 3,
      name: '노트북 하는 병아리',
      position: 'pro',
      file: 'chick.png',
    },
  ];

  // TODO: 전역 상태로 메뉴를 열고 닫도록 수정
  const [toggle, setToggle] = useState(true);
  const toggleMenu = () => {
    setToggle(!toggle);
  };

  const onClickOutside: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) toggleMenu();
  };

  const closeModal:KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleMenu();
    }
  };

  return (
    <aside aria-label="채팅 참여자 목록" aria-hidden={!toggle}>
      <div
        role="button"
        tabIndex={0}
        aria-label="모달 외부 클릭으로 참여자 목록 닫기"
        className={`absolute inset-0 bg-opacity-50 bg-dark-bg-dark duration-500 transition-opacity ${
          !toggle && 'pointer-events-none opacity-0'
        }`}
        onClick={onClickOutside}
        onKeyDown={closeModal}
      />
      <div
        className={`absolute inset-y-0 right-0 flex max-w-full pl-10 ${
          toggle ? 'z-15' : 'pointer-events-none'
        }`}
      >
        <section
          className={`p-1rem right-0 transition duration-500 ease-in-out w-screen inset-y-0 bg-white dark:bg-dark-light-300 flex-1 flex-col h-dvh border-l-1 border-athens-gray dark:border-dark-light-300 max-w-15rem xl:w-15rem under-mobile:w-[70vw] ${
            toggle ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div
            aria-hidden={!toggle}
            className="flex justify-between items-center pb-1rem"
          >
            <h2 className="text-base font-semibold dark:text-white">대화상대</h2>
            <button type="button" aria-label="아이콘으로 참여자 목록 닫기" onClick={toggleMenu}>
              <RemoveIcon className="w-22 cursor-pointer" />
            </button>
          </div>
          <AgoraUserList position="pro" userList={userList} />
          <div className="border-b-1 border-gray-200 mb-1rem dark:border-gray-500" />
          <AgoraUserList position="con" userList={userList} />
        </section>
      </div>
    </aside>
  );
}
