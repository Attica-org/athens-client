import React, { FocusEventHandler, useEffect, useRef } from 'react';
import { AgoraEmojis } from '@/app/model/Agora';
import { useShallow } from 'zustand/react/shallow';
import { useAgora } from '@/store/agora';
import { useWebSocketClient } from '@/store/webSocket';
import isNull from '@/utils/validation/validateIsNull';
import Emojis from './Emojis';

type Props = {
  className: string;
  chatId: number;
  reactionToggleBtnRef: React.RefObject<HTMLButtonElement> | undefined;
  setShowEmojiModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EmojiModal({
  className,
  chatId,
  reactionToggleBtnRef,
  setShowEmojiModal,
}: Props) {
  const emojiModalContainerRef = useRef<HTMLUListElement>(null);
  const { enterAgora } = useAgora(
    useShallow((state) => ({ enterAgora: state.enterAgora })),
  );
  const { webSocketClient, webSocketClientConnected } = useWebSocketClient(
    useShallow((state) => ({
      webSocketClient: state.webSocketClient,
      webSocketClientConnected: state.webSocketClientConnected,
    })),
  );

  const handleEmojiClick = (reaction: string) => {
    if (webSocketClientConnected && !isNull(webSocketClient)) {
      webSocketClient.publish({
        destination: `/app/agoras/${enterAgora.id}/chats/${chatId}/reactions`,
        body: JSON.stringify({
          type: 'REACTION',
          reactionType: reaction,
        }),
      });

      (
        reactionToggleBtnRef as React.RefObject<HTMLButtonElement>
      ).current?.focus();
      setTimeout(() => {
        setShowEmojiModal(false);
      }, 200);
    }
  };

  const handleEmojiKeyDown =
    (reactionType: string) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.code === 'Enter') {
        handleEmojiClick(reactionType);
      }
    };

  useEffect(() => {
    // 모달창이 열릴 때 첫 번째 포커스 가능한 요소에 초점 설정
    const focusableElements = emojiModalContainerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements) {
      const firstFocusableElement = focusableElements[0] as HTMLElement;

      // requestAnimationFrame을 통해 키 이벤트 처리가 끝난 뒤에 포커스
      requestAnimationFrame(() => {
        firstFocusableElement?.focus();
      });
    }
  }, [emojiModalContainerRef]);

  const handleFocusOut: FocusEventHandler<HTMLUListElement> = (e) => {
    // 리액션 모달에서 포커스가 사라지면 모달창 닫기
    if (
      emojiModalContainerRef.current &&
      !emojiModalContainerRef.current.contains(e.relatedTarget as Node)
    ) {
      setShowEmojiModal(false);
    }
  };

  const emojis = Emojis({ className });
  return (
    <ul
      ref={emojiModalContainerRef}
      onBlur={handleFocusOut}
      className="flex justify-center items-center"
      aria-label="메시지에 리액션 달기"
    >
      {Object.keys(emojis).map((reactionType) => (
        <li key={reactionType}>
          <button
            type="button"
            className="py-4 px-6 hover:bg-gray-200 hover:rounded-full"
            onClick={() => handleEmojiClick(reactionType)}
            onKeyDown={handleEmojiKeyDown(reactionType)}
            aria-label={`${reactionType} 이모티콘`}
          >
            {emojis[reactionType as keyof AgoraEmojis].icon}
          </button>
        </li>
      ))}
    </ul>
  );
}
