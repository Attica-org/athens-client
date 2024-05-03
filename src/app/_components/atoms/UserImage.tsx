import Image from 'next/image';
import React from 'react';

type Props = {
  className: string;
  name: string;
  w: number;
  h: number;
};

// min-w-5rem h-5rem bg-yellow-400
export default function UserImage({
  className, name, w, h,
}: Props) {
  return (
    <div
      className={`rounded-2xl ${className} border-1 border-athens-gray flex justify-center items-center`}
    >
      {name && (
        <Image
          className="object-cover rounded-full"
          src={`/img/${name}.png`}
          alt={`${name} 프로필`}
          width={w}
          height={h}
          aria-hidden
        />
      )}
    </div>
  );
}
