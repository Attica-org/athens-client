import React from 'react';
import { AgoraEmojis } from '@/app/model/Agora';
import { useShallow } from 'zustand/react/shallow';
import { useAgora } from '@/store/agora';
import { useWebSocketClient } from '@/store/webSocket';
import isNull from '@/utils/validation/validateIsNull';
import Emojis from './Emojis';

type Props = {
  className: string;
  chatId: number;
  setShowEmojiModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EmojiModal({
  className,
  chatId,
  setShowEmojiModal,
}: Props) {
  const { enterAgora } = useAgora(
    useShallow((state) => ({ enterAgora: state.enterAgora })),
  );
  const { webSocketClient, webSocketClientConnected } = useWebSocketClient(
    useShallow((state) => ({
      webSocketClient: state.webSocketClient,
      webSocketClientConnected: state.webSocketClientConnected,
    })),
  );
  const toggleEmojiModal = () => {
    setShowEmojiModal((prev) => !prev);
  };

  const handleEmojiClick = (reaction: string) => {
    if (webSocketClientConnected && !isNull(webSocketClient)) {
      webSocketClient.publish({
        destination: `/app/agoras/${enterAgora.id}/chats/${chatId}/reactions`,
        body: JSON.stringify({
          type: 'REACTION',
          reactionType: reaction,
        }),
      });
      setTimeout(() => {
        toggleEmojiModal();
      }, 200);
    }
  };

  const emojis = Emojis({ className });
  return (
    <div className="flex justify-center items-center">
      {Object.keys(emojis).map((reactionType) => (
        <button
          type="button"
          className="py-4 px-6 hover:bg-gray-200 hover:rounded-full"
          key={reactionType}
          onClick={() => handleEmojiClick(reactionType)}
          aria-label={reactionType}
        >
          {emojis[reactionType as keyof AgoraEmojis].icon}
        </button>
      ))}
    </div>
  );
}
