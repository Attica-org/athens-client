import { Message } from '@/app/model/Message';
import React, { KeyboardEventHandler, useRef, useState } from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import useTouchHandler from '@/hooks/useTouchHandler';
import { AGORA_POSITION } from '@/constants/agora';
import { PROFLELIST } from '@/constants/consts';
import MoreVertIcon from '@/assets/icons/MoreVertIcon';
import UserImage from '../../../_components/atoms/UserImage';
import ReactionMenuButton from './ReactionMenuButton';
import useIsEmojiSendable from '../../../../hooks/useIsEmojiSendable';
import EmojiModal from './EmojiModal';
import UserReaction from './UserReaction';

type Props = {
  message: Message;
  isNavigationMode: boolean;
  isSameUser: boolean;
  shouldShowTime: boolean;
  innerRef: React.RefObject<HTMLButtonElement> | undefined;
};

function MyMessage({
  message,
  isSameUser,
  shouldShowTime,
  isNavigationMode,
  innerRef,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [showEmojiModal, setShowEmojiModal] = useState(false);

  const toggleEmojiModal = () => {
    setShowEmojiModal((prev) => !prev);
  };

  const canSendEmoji = useIsEmojiSendable();
  const modalRef = useRef<HTMLDivElement>(null);

  const { handleTouchStart, handleTouchEnd, handleTouchCancel } =
    useTouchHandler(() => setIsHovered(true));
  useClickOutside(modalRef, () => setShowEmojiModal(false), showEmojiModal);

  const toggleReactionModal: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === 'Enter') {
      setShowEmojiModal((prev) => !prev);
    }
  };

  const userType =
    message.user.type === AGORA_POSITION.PROS ? '찬성측' : '반대측';

  return (
    <article
      key={message.chatId}
      aria-labelledby={`msg-${message.chatId}`}
      className="flex justify-end items-center p-0.5rem pr-12 py-0 h-full"
    >
      <span id={`msg-${message.chatId}`} className="sr-only">
        {`${userType} ${message.user.nickname}의 메시지: ${message.content}`}
      </span>
      <div
        ref={modalRef}
        className={`p-0.5rem ${isSameUser ? 'pt-0' : 'pt-3'} pb-0 flex flex-col justify-center items-end`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {!isSameUser && (
          <div aria-hidden className="text-xs lg:text-sm pb-5 dark:text-white">
            {message.user.nickname}
          </div>
        )}
        <div className="flex justify-end">
          <div className="flex flex-col items-end justify-end relative">
            <div className="flex justify-end">
              {isHovered && canSendEmoji ? (
                <div className="flex justify-center items-center">
                  <ReactionMenuButton
                    className="mr-10 p-4 bg-dark-light-600 rounded-md"
                    toggleEmojiModal={toggleEmojiModal}
                  />
                </div>
              ) : (
                shouldShowTime && (
                  <div aria-hidden className="flex justify-end items-end">
                    <time className="text-xxs pr-8 dark:text-dark-line">
                      {message.createdAt &&
                        new Date(message.createdAt)
                          ?.toLocaleTimeString()
                          .slice(0, -3)}
                    </time>
                  </div>
                )
              )}
              <div
                aria-hidden
                className={`max-w-[60vw] relative whitespace-pre-line ${message.user.type === AGORA_POSITION.CONS ? 'bg-red-200' : 'bg-blue-200'} rounded-tl-lg ${isSameUser && 'rounded-tr-lg'} rounded-bl-lg rounded-br-lg p-7 pl-10 pr-10 text-xs lg:text-sm`}
              >
                {message.content}
              </div>
            </div>
            {showEmojiModal && (
              <div
                className="z-20 relative mt-6 whitespace-nowrap bg-athens-gray dark:bg-white p-4 rounded-md border-1 border-gray-200
            before:content-[''] before:absolute before:top-[-14px] before:right-0 before:-translate-x-1/2 before:border-8 before:border-transparent custom-before before:z-10"
              >
                <EmojiModal
                  className="w-20 h-20"
                  chatId={message.chatId}
                  setShowEmojiModal={setShowEmojiModal}
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5">
          <UserReaction className="w-16 h-16" chatId={message.chatId} />
        </div>
      </div>
      {!isSameUser ? (
        <div aria-hidden className="w-fit mt-12 rounded-3xl dark:bg-white">
          <UserImage
            name={message.user.nickname}
            file={
              message.user.photoNumber
                ? PROFLELIST[message.user.photoNumber - 1].file
                : PROFLELIST[0].file
            }
            className="w-45 h-45 under-mobile:w-35 under-mobile:h-35 flex rounded-3xl"
            w={40}
            h={40}
          />
        </div>
      ) : (
        <div className="w-45 under-mobile:w-35" />
      )}

      <button
        type="button"
        tabIndex={isNavigationMode ? 0 : -1}
        ref={innerRef}
        aria-haspopup="listbox"
        aria-label="reaction 추가"
        className="flex justify-center items-center sr-only focus:not-sr-only text-sm dark:text-white rounded-full p-15 bg-dark-light-600"
        onKeyDown={toggleReactionModal}
      >
        <MoreVertIcon className="w-17" />
      </button>
    </article>
  );
}

export default React.memo(MyMessage);
