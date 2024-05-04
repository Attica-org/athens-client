'use client';

import CategoryButtonList from '@/app/(home)/_components/molecules/CategoryButtonList';
import CheckIcon from '@/assets/icons/CheckIcon';
import NotificationIcon from '@/assets/icons/NotificationIcon';
import React, { ChangeEventHandler, useState } from 'react';
import PageTitle from '@/app/(home)/_components/atoms/PageTitle';
import AgoraPointColorList from '@/app/(home)/_components/molecules/AgoraPointColorList';
import {
  DEFAULT_TIME,
} from '@/constants/createAgora';
import ModifyNumberInput from '../_components/atoms/ModifyNumberInput';

type Message = {
  participants: string | null;
  time: string | null;
};

export default function CreateAgora() {
  const [message, setMessage] = useState<Message>({
    participants: null,
    time: null,
  });

  const [time, setTime] = useState<number | null>(DEFAULT_TIME);
  const [timeCheck, setTimeCheck] = useState<boolean>(false);

  const handleAgoraTime: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseInt(e.target.value, 10);

    if (value < 30) {
      setMessage({
        ...message,
        time: '최소 제한시간은 30분입니다.',
      });
    } else {
      setMessage({
        ...message,
        time: null,
      });
    }
    setTime(value);
  };

  const handleNoTime = () => {
    if (timeCheck) {
      setTime(DEFAULT_TIME);
      setTimeCheck(false);
    } else {
      setTime(null);
      setTimeCheck(true);
      setMessage({
        ...message,
        time: null,
      });
    }
  };

  return (
    <section className="overflow-y-scroll scrollbar-hide flex flex-col pb-57 lg:pb-25 flex-1 h-dvh min-w-270 flex-grow">
      <header className="p-1rem pb-0 relative min-w-270">
        <PageTitle
          title="아고라 생성"
          desc="생성할 아고라 정보를 입력해주세요."
        />
      </header>
      <main className="flex h-dvh flex-1 flex-grow min-w-270 justify-between items-stretch p-1rem pt-0 under-mobile:pl-1rem under-mobile:pr-1rem flex-col">
        <div className="flex flex-col w-full under-mobile:mt-10 dark:text-white dark:text-opacity-85">
          <input
            aria-label="생성할 아고라 주제 입력창"
            type="text"
            placeholder="토론 할 주제를 입력해주세요."
            className="placeholder:text-athens-gray-thick w-full p-0.5rem text-sm border-0 border-athens-gray rounded-md dark:bg-dark-light-300 dark:placeholder:text-white dark:placeholder:text-opacity-85 dark:text-white"
          />
          <div className="flex justify-around flex-col w-full">
            <section className="mt-1.5rem w-full">
              <div role="region" className="text-md mb-10 under-mobile:text-sm">
                아고라 카테고리 분류
              </div>
              <div aria-label="카테고리 리스트" className="w-full">
                <CategoryButtonList />
              </div>
            </section>
            <section className="mt-1.5rem w-full">
              <div role="region" className="text-md mb-10 under-mobile:text-sm">
                포인트 색상
              </div>
              <div className="flex justify-start items-center">
                <AgoraPointColorList />
              </div>
            </section>
            <section className="mt-2rem w-full">
              <div role="region" className="mb-8 text-md under-mobile:text-sm">
                최대 참여 인원
              </div>
              <div className="flex justify-start items-center">
                <ModifyNumberInput label="찬성 / 반대" />
              </div>
              <div className="flex justify-start items-center mt-5">
                <NotificationIcon className="w-1rem mr-0.5rem" />
                <span className="text-xs text-athens-gray-thick break-keep under-mobile:text-xxs dark:text-white dark:text-opacity-65">
                  관찰자는 인원 제한없이 참여할 수 있습니다.
                </span>
              </div>
            </section>
            <section className="mt-2rem w-full">
              <div role="region" className="mb-10 under-mobile:text-sm text-md">
                토론 제한시간
              </div>
              <div className="text-sm flex flex-col w-full under-mobile:flex-row justify-center under-mobile:justify-start items-start under-mobile:items-center">
                <div className="flex justify-start items-center">
                  <input
                    aria-label="토론 제한시간 입력창"
                    type="number"
                    value={time || ''}
                    onChange={handleAgoraTime}
                    disabled={timeCheck}
                    className="input-number-hide focus-visible:outline-none text-sm mr-0.5rem text-center p-5 w-5rem border-1 border-athens-gray rounded-md dark:bg-dark-bg-light dark:border-gray-500"
                  />
                  <div className="under-mobile:text-xs">분</div>
                </div>
                {message.time && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="text-xs under-mobile:text-xxs text-red-600 p-5 pb-0 pl-0 dark:text-dark-con-color"
                  >
                    {message.time}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleNoTime}
                  className="under-mobile:ml-1rem cursor-pointer mt-12 under-mobile:mt-0 flex justify-start items-center text-athens-gray-thick text-center"
                >
                  <CheckIcon
                    className="w-1rem"
                    fill="rgb(107 114 128)"
                    check={timeCheck}
                  />
                  <div className="ml-8 text-sm under-mobile:text-xs dark:text-white dark:text-opacity-65">
                    제한 없음
                  </div>
                </button>
              </div>
            </section>
          </div>
        </div>
        <div className="max-h-5rem w-ful">
          <button
            type="button"
            aria-label="아고라 생성하기"
            className="w-full bg-athens-main text-white font-semibold pt-10 pb-10 mt-1.5rem under-mobile:pt-10 under-mobile:pb-10 under-mobile:mt-1rem text-base rounded-lg"
          >
            아고라 생성
          </button>
        </div>
      </main>
    </section>
  );
}
