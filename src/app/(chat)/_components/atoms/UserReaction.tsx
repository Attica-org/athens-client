import React from 'react';
import Emojis from './Emojis';

type ReactionCount = {
  LIKE?: number;
  DISLIKE?: number;
  LOVE?: number;
  HAPPY?: number;
  SAD?: number;
};

const dummyData = {
  type: 'REACTION',
  data: {
    chatId: 23,
    reactionCount: {
      LIKE: 3,
      DISLIKE: 0,
      LOVE: 1,
      HAPPY: 1,
      SAD: 0,
    },
  },
};

export default function UserReaction({ className }: { className: string }) {
  const emojis = Emojis({ className });

  return (
    <div className="flex mt-10">
      {Object.keys(dummyData.data.reactionCount).map((reactionType) => {
        const count =
          dummyData.data.reactionCount[reactionType as keyof ReactionCount];
        return count ? (
          <div
            className="flex justify-center items-center border-1 py-2 px-6 rounded-md ml-5 bg-white"
            key={reactionType}
          >
            <span className="mr-4">
              {emojis[reactionType as keyof ReactionCount].icon}
            </span>
            <span className="text-sm">{count}</span>
          </div>
        ) : null;
      })}
    </div>
  );
}
