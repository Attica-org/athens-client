'use client';

import SendIcon from '@/assets/icons/SendIcon';
import { useMessageStore } from '@/store/message';
import React, {
  ChangeEventHandler, KeyboardEventHandler, useEffect, useRef, useState,
} from 'react';

export default function MessageInput() {
  const [message, setMessage] = useState<string>('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { setGoDown } = useMessageStore();

  const handleMessage: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (message.trim().length < 1) return;

    // TODO: 메시지 소켓 전송

    setMessage('');
    setGoDown(true);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleKeyDown:KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    const handleOutSideClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('click', handleOutSideClick);

    const cleanup = () => {
      window.removeEventListener('click', handleOutSideClick);
    };

    return cleanup;
  }, []);

  return (
    <section className="flex border-t-1 dark:border-dark-light-300 sticky bottom-0 right-0 left-0 w-full bg-white dark:bg-dark-light-300">
      <form className="pl-1.5rem p-12 pb-0 flex flex-1 justify-start items-center">
        <textarea
          aria-label="보낼 메세지 입력창"
          ref={inputRef}
          value={message}
          onChange={handleMessage}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder="메시지 보내기"
          className="placeholder:text-athens-gray-thick dark:placeholder:text-dark-light-400
          dark:placeholder:text-opacity-85 dark:text-opacity-85 dark:text-white w-full text-base
          focus-visible:outline-none dark:bg-dark-light-300 resize-none overflow-hidden h-40"
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
