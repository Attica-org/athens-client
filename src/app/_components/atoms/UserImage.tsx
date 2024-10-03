import Image from 'next/image';
import React from 'react';

type Props = {
  className: string;
  file?: string | null;
  name?: string | null;
  w: number;
  h: number;
};

export default function UserImage({
  className,
  file = null,
  name = null,
  w,
  h,
}: Props) {
  return (
    <div
      className={`rounded-2xl ${className} border-1 dark:border-athens-gray flex p-2 justify-center items-center`}
    >
      {(file || name) && (
        <Image
          className="object-cover rounded-full"
          src={`/img/${file || name}`}
          alt={`${name} 프로필`}
          width={w}
          height={h}
          aria-hidden
        />
      )}
    </div>
  );
}
