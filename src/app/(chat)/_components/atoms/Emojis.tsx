import React from 'react';
import LoveIcon from '@/assets/icons/LoveIcon';
import DislikeIcon from '@/assets/icons/DislikeIcon';
import LikeIcon from '@/assets/icons/LikeIcon';
import SadIcon from '@/assets/icons/SadIcon';
import HappyIcon from '@/assets/icons/HappyIcon';
import { EmojiType } from '@/app/model/Reaction';

type Props = {
  className: string;
};

type EmojiMap = {
  [key in EmojiType]: {
    icon: JSX.Element;
  };
};

const Emojis = ({ className }: Props): EmojiMap => ({
  LIKE: { icon: <LikeIcon className={className} /> },
  DISLIKE: { icon: <DislikeIcon className={className} /> },
  LOVE: { icon: <LoveIcon className={className} /> },
  HAPPY: { icon: <HappyIcon className={className} /> },
  SAD: { icon: <SadIcon className={className} /> },
});

export default Emojis;
