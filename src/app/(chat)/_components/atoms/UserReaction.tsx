import React from 'react';
import { useAgora } from '@/store/agora';
import { useShallow } from 'zustand/react/shallow';
import { useQuery } from '@tanstack/react-query';
import { getUserReactionQueryKey } from '@/constants/queryKey';
import { Reaction } from '@/app/model/Reaction';
import Emojis from './Emojis';

const initReactionCount = {
  LIKE: 0,
  DISLIKE: 0,
  LOVE: 0,
  HAPPY: 0,
  SAD: 0,
};

type Props = {
  className: string;
  chatId: number;
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
    <div className="flex">
      {Object.keys(reactionCount).map((reactionType) => {
        const count = reactionCount[reactionType as keyof Reaction];
        return count > 0 ? (
          <div
            className={`mb-5 flex justify-center items-center border-1 py-4 px-4 rounded-md bg-white ${reactionType === 'LIKE' ? '' : 'ml-4'}`}
            key={reactionType}
          >
            <span className="mr-2">
              {emojis[reactionType as keyof Reaction].icon}
            </span>
            <span className="text-xs">{count}</span>
          </div>
        ) : null;
      })}
    </div>
  );
}
