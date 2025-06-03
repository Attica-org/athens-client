import { AgoraTitle, Participants } from '@/app/model/Agora';
import BoltIcon from '@/assets/icons/BoltIcon';
import React from 'react';

type Props = {
  title: AgoraTitle;
  isClosed?: boolean;
} & Partial<Omit<Participants, 'observer'>>;

export default React.memo(function AgoraInfo({
  title,
  pros,
  cons,
  isClosed,
}: Props) {
  return (
    <section
      aria-labelledby="agora-info"
      className="flex flex-col justify-center items-center w-full dark:bg-dark-light-300 pb-5"
    >
      <h1
        id="agora-info"
        className="dark:text-white dark:text-opacity-85 foldable:text-sm text-xs break-keep text-center font-semibold flex justify-center items-center p-5"
      >
        <BoltIcon className="w-16 mr-0.5rem under-mobile:w-14" fill="#10AE5D" />
        {title}
      </h1>
      {!isClosed && (
        <>
          <span role="status" className="sr-only">
            현재 찬성 {pros}명, 반대 {cons}명이 참여중입니다.
          </span>
          <div
            aria-label="현재 참여 인원"
            className="flex justify-around items-center w-full foldable:text-xs text-xxs p-6 pt-0"
          >
            <div className="text-blue-600 dark:text-dark-pro-color">
              찬성 {pros} 명
            </div>
            <div className="text-red-600 dark:text-dark-con-color">
              반대 {cons} 명
            </div>
          </div>
        </>
      )}
    </section>
  );
});
