import React from 'react';

type Props = {
  className?: string;
  nickname: string;
  access: string;
};

export default function UserAccessNotification({
  className,
  nickname,
  access,
}: Props) {
  const accessString = access === 'enter' ? '입장했습니다.' : '나갔습니다.';
  return (
    <div className={className}>
      <div className="w-full flex flex-col justify-center items-center">
        <span
          aria-live="polite"
          className="rounded-3xl p-8 px-16 text-center text-xs under-mobile:text-xxs text-black bg-athens-gray dark:bg-dark-light-200 dark:text-dark-line w-fit  break-keep"
        >
          {nickname} 님이 {accessString}
        </span>
      </div>
    </div>
  );
}
