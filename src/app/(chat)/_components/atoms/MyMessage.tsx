import { Message } from '@/app/model/Message';
import React from 'react';
import PROFLELIST from '@/constants/userProfileImage';
import UserImage from '../../../_components/atoms/UserImage';

type Props = {
  message: Message;
  isSameUser: boolean;
  shouldShowTime: boolean;
};

function MyMessage({ message, isSameUser, shouldShowTime }: Props) {
  return (
    <article
      key={message.chatId}
      className={`flex justify-end items-start p-0.5rem ${isSameUser && 'pt-0'} pr-12 pb-0 h-full`}
    >
      <div
        className={`p-0.5rem ${isSameUser && 'pt-0'} flex flex-col justify-center items-end`}
      >
        {!isSameUser && (
          <div
            role="region"
            aria-label="사용자 이름"
            className="text-xs lg:text-sm pb-5 dark:text-white"
          >
            {message.user.nickname}
          </div>
        )}
        <div className="flex justify-end items-end">
          {shouldShowTime && (
            <div className="flex flex-col justify-end items-end h-full">
              <time className="text-xxs pr-8 h-full dark:text-dark-line">
                {message.createdAt &&
                  new Date(message.createdAt)
                    ?.toLocaleTimeString()
                    .slice(0, -3)}
              </time>
            </div>
          )}
          <div
            className={`max-w-[60vw] whitespace-pre-line ${message.user.type === 'CONS' ? 'bg-red-200' : 'bg-blue-200'} rounded-tl-lg ${isSameUser && 'rounded-tr-lg'} rounded-bl-lg rounded-br-lg p-7 pl-10 pr-10 text-xs lg:text-sm`}
          >
            {message.content}
          </div>
        </div>
      </div>
      {!isSameUser ? (
        <div
          aria-hidden
          className="border-1 border-gray-300 w-fit rounded-3xl dark:bg-white"
        >
          <UserImage
            name={message.user.nickname}
            file={
              message.user.photoNumber
                ? PROFLELIST[message.user.photoNumber - 1].file
                : PROFLELIST[0].file
            }
            className="w-50 h-50 under-mobile:w-40 under-mobile:h-40 flex rounded-3xl"
            w={50}
            h={50}
          />
        </div>
      ) : (
        <div className="w-50 under-mobile:w-40" />
      )}
    </article>
  );
}

export default React.memo(MyMessage);
