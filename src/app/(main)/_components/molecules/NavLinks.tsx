import React from 'react';
import {
  homeSegmentKey,
  createAgoraSegmentKey,
  userInfoSegmentKey,
} from '@/constants/segmentKey';
import MobileNavLink from '../atoms/MobileNavLink';
import DesktopNavLink from '../atoms/DesktopNavLink';
import NavIconDecider from '../atoms/NavIconDecider';

export default function NavLinks() {
  return (
    <>
      <div className="hidden lg:block">
        <ul>
          <DesktopNavLink
            href={homeSegmentKey}
            innerText="홈"
            label="홈으로 가기"
          >
            <NavIconDecider segment={homeSegmentKey} className="w-1.5rem" />
          </DesktopNavLink>
          <DesktopNavLink
            href={createAgoraSegmentKey}
            innerText="아고라 생성"
            label="아고라 생성하기"
          >
            <NavIconDecider
              segment={createAgoraSegmentKey}
              className="w-1.5rem"
            />
          </DesktopNavLink>
        </ul>
      </div>
      <div className="sticky bottom-0 block lg:hidden w-full h-58 border-t-1 border-gray-100 dark:border-gray-500">
        <ul className="flex flex-row h-full justify-around">
          <MobileNavLink
            className="flex p-5 text-xs flex-col justify-center items-center"
            href={homeSegmentKey}
            label="홈으로 가기"
          >
            <NavIconDecider segment={homeSegmentKey} className="w-23 pb-4" />홈
          </MobileNavLink>
          <MobileNavLink
            label="아고라 생성하기"
            className="flex flex-col text-xs justify-center items-center p-10"
            href={createAgoraSegmentKey}
          >
            <NavIconDecider
              segment={createAgoraSegmentKey}
              className="w-23 pb-4"
            />
            아고라생성
          </MobileNavLink>
          <MobileNavLink
            className="flex flex-col text-xs justify-center items-center p-10"
            href={userInfoSegmentKey}
            label="사용자 정보"
          >
            <NavIconDecider segment={userInfoSegmentKey} className="w-28" />
            사용자정보
          </MobileNavLink>
        </ul>
      </div>
    </>
  );
}
