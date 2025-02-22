'use client';

import React from 'react';
import BackButton from '@/app/_components/atoms/BackButton';
import Loading from '@/app/_components/atoms/loading';
import HamburgerIcon from '@/assets/icons/HamburgerIcon';
import SendIcon from '@/assets/icons/SendIcon';
import ShareButton from '../molecules/ShareButton';
import DiscussionStatus from '../molecules/DiscussionStatus';
import AgoraInfo from '../molecules/AgoraInfo';

export default function () {
  return (
    <div className="h-dvh w-full relative">
      <div className="min-w-300 w-full h-dvh flex absolute justify-center items-center z-10 top-0 right-0 left-0 bottom-0 bg-opacity-50 bg-dark-bg-dark">
        <Loading className="absolute z-20" w="32" h="32" />
      </div>
      <div className="w-full overflow-y-hidden overflow-x-hidden h-dvh flex justify-center items-center xl:w-[1580px] relative">
        <section className="w-full flex flex-1 h-dvh max-lg:pb-3rem min-w-270 flex-grow max-width-screen absolute top-0">
          <section className="flex flex-1 flex-col w-full relative h-dvh">
            <section className="sticky w-full top-0 bg-white dark:bg-dark-bg-light pt-10 min-w-270 border-b-1 border-gray-200 dark:border-dark-light-300">
              <div className="flex flex-col w-full h-full justify-center dark:text-white dark:text-opacity-85">
                <div className="flex justify-between items-center pb-10 border-b-1 border-gray-200 dark:border-dark-bg-light">
                  <BackButton />
                  <div className="flex justify-center items-center text-xs">
                    <DiscussionStatus meta={undefined} />
                  </div>
                  <div className="flex justify-end items-center mr-0.5rem">
                    <ShareButton title="" />
                    <HamburgerIcon className="w-20 lg:w-22 cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <AgoraInfo
                    title="[ 채팅방을 세팅하는 중입니다... ]"
                    pros={0}
                    cons={0}
                  />
                </div>
              </div>
            </section>
            <div className="h-full w-full flex overflow-auto flex-col transform-scale-y-inverted">
              <div className="relative w-full flex flex-col" />
            </div>
            <section className="flex border-t-1 dark:border-dark-light-300 sticky bottom-0 right-0 left-0 w-full bg-white dark:bg-dark-light-300">
              <form className="pl-1rem p-10 pb-0 flex flex-1 justify-start items-center">
                <div
                  role="textbox"
                  tabIndex={0}
                  aria-label="보낼 메세지 입력창"
                  contentEditable
                  data-placeholder="메시지 보내기"
                  className="placeholder:text-athens-gray-thick dark:placeholder:text-dark-light-400
            dark:placeholder:text-opacity-85 dark:text-opacity-85 dark:text-white w-full text-sm lg:text-base
            focus-visible:outline-none dark:bg-dark-light-300 resize-none overflow-hidden h-35"
                />
              </form>
              <div
                aria-label="메세지 보내기"
                className="bg-athens-main pl-10 pr-10 cursor-pointer h-full"
              >
                <SendIcon className="w-30" fill="white" />
              </div>
            </section>
          </section>
        </section>
      </div>
    </div>
  );
}
