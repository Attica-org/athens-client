'use client';

import React from 'react';
import { AgoraEmojis } from '@/app/model/Agora';
import * as StompJs from '@stomp/stompjs';
import { useShallow } from 'zustand/react/shallow';
import { useAgora } from '@/store/agora';
import Emojis from './Emojis';

type Props = {
  className: string;
  chatId: number;
  client: React.RefObject<StompJs.Client> | null;
};

export default function EmojiModal({ className, chatId, client }: Props) {
  const { enterAgora } = useAgora(
    useShallow((state) => ({ enterAgora: state.enterAgora })),
  );

  const handleEmojiClick = (reaction: string) => {
    if (client?.current?.connected) {
      client?.current?.publish({
        destination: `/app/agoras/${enterAgora.id}/chats/${chatId}/reactions`,
        body: JSON.stringify({
          type: 'REACTION',
          reactionType: reaction,
        }),
      });
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
