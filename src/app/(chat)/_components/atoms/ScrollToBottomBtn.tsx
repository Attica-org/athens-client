'use client';

import ArrowDownIcon from '@/assets/icons/ArrowDownIcon';
import React, { KeyboardEventHandler, useEffect, useState } from 'react';

type Props = {
  listRef: React.RefObject<HTMLDivElement>;
  lastMessageRef: React.RefObject<HTMLButtonElement>;
};

export default function ScrollToBottomBtn({ listRef, lastMessageRef }: Props) {
  const [scrollToBottom, setScrollToBottom] = useState(false);

  const handleScrollToBottom = () => {
    if (listRef.current) {
      setScrollToBottom(false);
      listRef.current.scrollTo({ top: 0 });

      requestAnimationFrame(() => {
        lastMessageRef.current?.focus();
      });
    }
  };

  const keyDownScrollToBottom: KeyboardEventHandler<HTMLButtonElement> = (
    e,
  ) => {
    if (e.key === 'Enter') {
      handleScrollToBottom();
    }
  };

  useEffect(() => {
    if (!listRef.current) return () => {};

    // 스크롤이 아래로 내려가면 새 메시지 알림을 숨김
    const handleScroll = () => {
      if (listRef.current) {
        if (listRef.current.scrollTop <= 200) {
          setScrollToBottom(false);
        } else {
          setScrollToBottom(true);
        }
      }
    };

    const currentRef = listRef.current;
    currentRef.addEventListener('scroll', handleScroll);

    return () => {
      currentRef.removeEventListener('scroll', handleScroll);
    };
  }, [listRef]);

  return (
    scrollToBottom && (
      <button
        type="button"
        aria-label="스크롤 하단으로 내리기"
        onKeyDown={keyDownScrollToBottom}
        onClick={handleScrollToBottom}
        className="rounded-full flex justify-center items-center cursor-pointer fixed bottom-65 right-10 dark:bg-dark-light-300 bg-gray-100 border-1 border-gray-300 dark:border-dark-light-300 opacity-90"
      >
        <ArrowDownIcon className="w-40 h-40" />
      </button>
    )
  );
}
