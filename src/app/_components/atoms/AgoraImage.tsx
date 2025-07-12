import { ImageData } from '@/app/model/Agora';
import ImageIcon from '@/assets/icons/ImageIcon';
import Image from 'next/image';
import React from 'react';

type AgoraImageProps = {
  viewImageIcon: boolean;
  file: ImageData;
  color?: string;
};

export default function AgoraImage({
  viewImageIcon,
  file,
  color,
}: AgoraImageProps) {
  return viewImageIcon ? (
    <div
      aria-hidden
      className={`flex justify-center items-center h-full w-full ${color || 'dark:bg-dark-light-500 bg-gray-200'} rounded-3xl under-mobile:rounded-2xl`}
    >
      <ImageIcon className="w-22 h-22" />
    </div>
  ) : (
    <Image
      alt="아고라 프로필"
      layout="fill"
      objectFit="cover"
      className="rounded-3xl under-mobile:rounded-2xl"
      src={file.dataUrl}
    />
  );
}
