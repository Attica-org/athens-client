'use client';

import CategoryButtonList from '@/app/(home)/_components/molecules/CategoryButtonList';
import NotificationIcon from '@/assets/icons/NotificationIcon';
import React from 'react';
import PageTitle from '@/app/(home)/_components/atoms/PageTitle';
import AgoraPointColorList from '@/app/(home)/_components/molecules/AgoraPointColorList';
import ParticipantCapacitySetter from '../_components/molecules/ParticipantCapacitySetter';
import DiscussionDurationSetter from '../_components/molecules/DiscussionDurationSetter';

export default function CreateAgora() {
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
            className="placeholder:text-athens-gray-thick w-full p-0.5rem text-sm border-1 border-gray-300 rounded-md dark:bg-dark-light-300 dark:placeholder:text-white dark:placeholder:text-opacity-85 dark:border-0 dark:text-white"
          />
          <div className="flex justify-around flex-col w-full">
            <section className="mt-1.5rem w-full">
              <div role="region" className="text-md mb-10 under-mobile:text-sm">
                아고라 카테고리 분류
              </div>
              <CategoryButtonList />
            </section>
            <section className="mt-1.5rem w-full">
              <div role="region" className="text-md mb-10 under-mobile:text-sm">
                포인트 색상
              </div>
              <AgoraPointColorList />
            </section>
            <section className="mt-2rem w-full">
              <div role="region" className="mb-8 text-md under-mobile:text-sm">
                최대 참여 인원
              </div>
              <ParticipantCapacitySetter />
              <div className="flex justify-start items-center mt-5">
                <NotificationIcon className="w-1rem mr-0.5rem" />
                <div className="text-xs text-athens-gray-thick break-keep dark:text-white dark:text-opacity-65">
                  관찰자는 인원 제한없이 참여할 수 있습니다.
                </div>
              </div>
            </section>
            <section className="mt-2rem w-full">
              <div role="region" className="mb-10 under-mobile:text-sm text-md">
                토론 제한시간
              </div>
              <DiscussionDurationSetter />
            </section>
          </div>
        </div>
        <div className="max-h-5rem w-full">
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
