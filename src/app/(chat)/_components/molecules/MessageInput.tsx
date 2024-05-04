'use client';

import SendIcon from '@/assets/icons/SendIcon';
import React, {
  ChangeEventHandler, useState,
} from 'react';

export default function MessageInput() {
  const [message, setMessage] = useState<string>('');
  // const inputRef = useRef<HTMLInputElement>(null);

  const handleMessage: ChangeEventHandler<HTMLInputElement> = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (message.trim().length < 1) return;

    // TODO: 메시지 소켓 전송

    setMessage('');
  };

  // useEffect(() => {
  //   const handleOutSideClick = (e: MouseEvent) => {
  //     if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
  //       inputRef.current.focus();
  //     }
  //   };

  //   window.addEventListener('click', handleOutSideClick);

  //   const cleanup = () => {
  //     window.removeEventListener('click', handleOutSideClick);
  //   };

  //   return cleanup;
  // }, []);

  return (
    <section className="flex border-t-1 dark:border-dark-light-300 sticky bottom-0 right-0 left-0 w-full bg-white dark:bg-dark-light-300">
      <form className="pl-1.5rem p-12 flex flex-1 justify-start items-center h-full">
        <input
          aria-label="보낼 메세지 입력창"
          type="text"
          value={message}
          onChange={handleMessage}
          placeholder=""
          className="placeholder:text-athens-gray-thick dark:placeholder:text-white dark:placeholder:text-opacity-85 dark:text-opacity-85 dark:text-white text-base w-full focus-visible:outline-none dark:bg-dark-light-300"
        />
      </form>
      <button
        type="button"
        onClick={sendMessage}
        aria-label="메세지 보내기"
        className="bg-athens-main pl-10 pr-10 cursor-pointer h-full"
      >
        <SendIcon className="w-30" fill="white" />
      </button>
    </section>
  );
}
