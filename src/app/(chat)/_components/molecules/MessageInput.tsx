'use client';

import SendIcon from '@/assets/icons/SendIcon';
import React from 'react';

export default function MessageInput() {
  return (
    <section className="flex border-t-1 dark:border-dark-light-300 sticky bottom-0 right-0 left-0 w-full bg-white dark:bg-dark-light-300">
      <form className="pl-1.5rem p-12 flex flex-1 justify-start items-center h-full">
        <input
          aria-label="보낼 메세지 입력창"
          type="text"
          placeholder="Type a message"
          className="placeholder:text-athens-gray-thick dark:placeholder:text-white dark:placeholder:text-opacity-85 dark:text-opacity-85 dark:text-white text-base w-full focus-visible:outline-none dark:bg-dark-light-300"
        />
      </form>
      <button
        type="button"
        aria-label="메세지 보내기"
        className="bg-athens-main pl-10 pr-10 cursor-pointer h-full"
      >
        <SendIcon className="w-30" fill="white" />
      </button>
    </section>
  );
}
