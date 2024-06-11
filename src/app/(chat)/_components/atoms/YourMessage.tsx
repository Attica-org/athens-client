import { Message } from '@/app/model/Message';
import React from 'react';
import PROFLELIST from '@/constants/userProfileImage';
import UserImage from '../../../_components/atoms/UserImage';

type Props = {
  message: Message;
  isSameUser: boolean;
};

export default function YourMessage({ message, isSameUser }: Props) {
  return (
    <article className={`flex justify-start items-start p-0.5rem ${isSameUser && 'pt-0'} pl-12 pb-0 h-full`}>
      {!isSameUser ? (
        <div aria-hidden className="border-1 border-gray-300 w-fit rounded-3xl dark:bg-white">
          <UserImage
            className="w-50 h-50 under-mobile:w-40 under-mobile:h-40 flex rounded-3xl"
            name={message.user.nickname || '익명'}
            file={message.user.photoNumber
              ? PROFLELIST[message.user.photoNumber - 1].file
              : PROFLELIST[0].file}
            w={50}
            h={50}
          />
        </div>
      ) : (
        <div className="w-50 under-mobile:w-40" />
      )}
      <div className={`p-0.5rem ${isSameUser && 'pt-0'} flex flex-col justify-center items-start`}>
        {!isSameUser && (
        <div role="region" aria-label="사용자 이름" className="text-xs pb-5 dark:text-white">
          {message.user.nickname}
        </div>
        )}
        <div className="flex justify-start items-end">
          <div className={`max-w-[60vw] whitespace-pre-line ${message.user.type === 'CONS' ? 'bg-red-200' : 'bg-blue-200'} rounded-tr-xl ${isSameUser && 'rounded-tl-lg'} rounded-bl-xl rounded-br-xl p-0.5rem pl-10 pr-10 text-sm under-mobile:text-xs`}>
            {message.content}
          </div>
          <div className="flex flex-col justify-end items-end h-full">
            <time className="text-xxs pl-8 h-full dark:text-dark-line">{new Date(message.createdAt).toLocaleTimeString().slice(0, -3)}</time>
          </div>
        </div>
      </div>
    </article>
  );
}
