import React from 'react';
import HeartIcon from '@/assets/icons/HeartIcon';

type Props = {
  className?: string;
  toggleEmojiModal: () => void;
};

export default function ReactionMenuButton({
  className,
  toggleEmojiModal,
}: Props) {
  return (
    <div className={className}>
      <HeartIcon
        className="w-16 h-16 cursor-pointer"
        fill="#FFFFFF"
        onClick={toggleEmojiModal}
      />
    </div>
  );
}
