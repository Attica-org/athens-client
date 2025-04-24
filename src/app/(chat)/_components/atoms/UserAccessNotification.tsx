import { AccessStatus } from '@/app/model/AccessStatus';
import React from 'react';

type Props = {
  className?: string;
  nickname: string;
  access: AccessStatus;
};

export default function UserAccessNotification({
  className,
  nickname,
  access,
}: Props) {
  const getAccessString = () => {
    let baseStr = `${nickname} 님이`;

    if (access === AccessStatus.ENTER) baseStr += '입장했습니다.';
    else if (access === AccessStatus.KICKED)
      baseStr += '강퇴 투표로 퇴장 처리되었습니다.';
    else if (access === AccessStatus.EXIT) baseStr += '나갔습니다.';
    return baseStr;
  };

  return (
    <div className={className}>
      <div className="w-full flex flex-col justify-center items-center">
        <span
          aria-live="polite"
          className="rounded-3xl p-8 px-16 text-center foldable:text-xs text-xxs text-black bg-athens-gray dark:bg-dark-light-200 dark:text-dark-line w-fit  break-keep"
        >
          {getAccessString()}
        </span>
      </div>
    </div>
  );
}
