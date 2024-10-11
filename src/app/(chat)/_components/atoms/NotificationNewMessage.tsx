import React, { KeyboardEventHandler, useEffect } from 'react';
import UserImage from '@/app/_components/atoms/UserImage';
import { Message } from '@/app/model/Message';
import PROFLELIST from '@/constants/userProfileImage';

type Props = {
  message: Message;
  listRef: React.RefObject<HTMLDivElement>;
  setView: React.Dispatch<React.SetStateAction<boolean>>;
  view: boolean;
};

export default function NotificationNewMessage({
  message,
  listRef,
  setView,
  view,
}: Props) {
  const clickMessage = () => {
    if (listRef.current) {
      setView(false);
      listRef.current.scrollTo(0, listRef.current.scrollHeight);
    }
  };

  const keyDownMessage: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === 'Enter') {
      clickMessage();
    }
  };

  useEffect(() => {
    if (!view || !listRef.current) return () => {};

    // 스크롤이 아래로 내려가면 새 메시지 알림을 숨김
    const handleScroll = () => {
      if (listRef.current) {
        const scrollPosition =
          listRef.current.scrollTop + listRef.current.clientHeight;
        const { scrollHeight } = listRef.current;

        if (scrollHeight - scrollPosition <= 100) {
          setView(false);
        }
      }
    };

    const currentRef = listRef.current;
    currentRef.addEventListener('scroll', handleScroll);

    return () => {
      currentRef.removeEventListener('scroll', handleScroll);
    };
  }, [view, listRef, setView]);

  return (
    <div className="w-full px-8 fixed bottom-55">
      <button
        type="button"
        aria-label="새로운 메시지"
        onKeyDown={keyDownMessage}
        onClick={clickMessage}
        className="flex w-full rounded-lg justify-start items-center gap-x-5 py-7 px-10 dark:bg-dark-light-200 dark:opacity-90 bg-white opacity-90"
      >
        <UserImage
          name={message.user.nickname}
          file={
            message.user.photoNumber
              ? PROFLELIST[message.user.photoNumber - 1].file
              : PROFLELIST[0].file
          }
          className="w-35 h-35 under-mobile:w-40 under-mobile:h-40 flex rounded-2xl bg-white"
          w={35}
          h={35}
        />
        <span
          aria-label="닉네임"
          className="dark:text-dark-line text-dark-light-500 text-sm pl-2"
        >
          {message.user.nickname}
        </span>
        <span
          aria-label="내용"
          className="dark:text-white text-black text-ellipsis text-sm pl-2"
        >
          {message.content}
        </span>
      </button>
    </div>
  );
}
