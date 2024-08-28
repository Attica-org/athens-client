import React from 'react';
import LoveIcon from '@/assets/icons/LoveIcon';
import DislikeIcon from '@/assets/icons/DislikeIcon';
import LikeIcon from '@/assets/icons/LikeIcon';
import SadIcon from '@/assets/icons/SadIcon';
import HappyIcon from '@/assets/icons/HappyIcon';

type Props = {
  className?: string;
};

export default function EmojiModal({ className }: Props) {
  const handleEmojiClick = () => {};
  const emojis = [
    { reactionType: 'LIKE', svg: <LikeIcon className={className} /> },
    { reactionType: 'DISLIKE', svg: <DislikeIcon className={className} /> },
    { reactionType: 'LOVE', svg: <LoveIcon className={className} /> },
    { reactionType: 'HAPPY', svg: <HappyIcon className={className} /> },
    { reactionType: 'SAD', svg: <SadIcon className={className} /> },
  ];

  return (
    <div className="flex justify-center items-center">
      {emojis.map((emoji) => (
        <button
          type="button"
          className="py-4 px-6 hover:bg-gray-200 hover:rounded-full"
          key={emoji.reactionType}
          onClick={handleEmojiClick}
          aria-label={emoji.reactionType}
        >
          {emoji.svg}
        </button>
      ))}
    </div>
  );
}
