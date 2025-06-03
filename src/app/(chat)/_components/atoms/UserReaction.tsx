import React from 'react';
import { useAgora } from '@/store/agora';
import { useShallow } from 'zustand/react/shallow';
import { useQuery } from '@tanstack/react-query';
import { getUserReactionQueryKey } from '@/constants/queryKey';
import { EMOJI_TYPES, Reaction } from '@/app/model/Reaction';
import { AgoraId } from '@/app/model/Agora';
import Emojis from './Emojis';

const initReactionCount: Reaction = {
  LIKE: 0,
  DISLIKE: 0,
  LOVE: 0,
  HAPPY: 0,
  SAD: 0,
};

type Props = {
  className: string;
  chatId: AgoraId;
};
export default function UserReaction({ className, chatId }: Props) {
  const emojis = Emojis({ className });

  const { enterAgora } = useAgora(
    useShallow((state) => ({ enterAgora: state.enterAgora })),
  );

  const { data: reactionCount = initReactionCount }: { data: Reaction } =
    useQuery({
      queryKey: getUserReactionQueryKey(enterAgora.id, chatId),
      initialData: initReactionCount,
      enabled: false,
    });

  return (
    <div className="flex" aria-labelledby="reaction">
      {EMOJI_TYPES.map((reaction) => {
        const count = reactionCount[reaction];
        return count > 0 ? (
          <React.Fragment key={reaction}>
            <span id="reaction" className="sr-only">
              {reaction} 리액션 {count}개
            </span>
            <div
              className={`mb-5 flex justify-center items-center border-1 py-4 px-4 rounded-md bg-white ${reaction === 'LIKE' ? '' : 'ml-4'}`}
              key={reaction}
            >
              <span className="mr-2">{emojis[reaction].icon}</span>
              <span className="text-xs">{count}</span>
            </div>
          </React.Fragment>
        ) : null;
      })}
    </div>
  );
}
