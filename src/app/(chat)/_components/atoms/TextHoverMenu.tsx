import React from 'react';
import HeartIcon from '@/assets/icons/HeartIcon';

type Props = {
  className?: string;
  toggleEmojiModal: () => void;
};
export default function TextHoverMenu({ className, toggleEmojiModal }: Props) {
  return (
    <div className={className}>
      <HeartIcon
        className="w-20 h-20 cursor-pointer"
        fill="#424542"
        onClick={toggleEmojiModal}
      />
    </div>
  );
}
