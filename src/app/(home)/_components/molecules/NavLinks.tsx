import HomeIcon from '@/assets/icons/homeIcon';
import AddIcon from '@/assets/icons/AddIcon';
import React from 'react';
import MobileNavLink from '../atoms/MobileNavLink';
import DesktopNavLink from '../atoms/DesktopNavLink';

export default function NavLinks() {
  return (
    <>
      <div className="hidden lg:block">
        <ul>
          <DesktopNavLink href="/" innerText="홈" label="홈으로 가기">
            <HomeIcon className="w-1.5rem" />
          </DesktopNavLink>
          <DesktopNavLink
            href="/create-agora"
            innerText="아고라 생성"
            label="아고라 생성하기"
          >
            <AddIcon className="w-1.5rem" />
          </DesktopNavLink>
        </ul>
      </div>
      <div className="sticky bottom-0 block lg:hidden w-full h-58 border-t-1 border-gray-100 dark:border-gray-500">
        <ul className="flex flex-row h-full justify-around">
          <MobileNavLink
            className="flex p-5 text-xs flex-col justify-center items-center"
            href="/"
            label="홈으로 가기"
          >
            <HomeIcon className="w-23 pb-2" />
            홈
          </MobileNavLink>
          <MobileNavLink
            label="아고라 생성하기"
            className="flex flex-col text-xs justify-center items-center p-10"
            href="/create-agora"
          >
            <AddIcon className="w-23 pb-2" />
            아고라생성
          </MobileNavLink>
        </ul>
      </div>
    </>
  );
}
