import { AccessStatus } from '@/app/model/AccessStatus';
import { UserName } from '@/app/model/Agora';
import React from 'react';

type Props = {
  className?: string;
  nickname: UserName;
  access: AccessStatus;
};

export default function UserAccessNotification({
  className,
  nickname,
  access,
}: Props) {
  const getAccessString = () => {
    if (access === AccessStatus.ENTER) return `${nickname} 님이 입장했습니다.`;
    if (access === AccessStatus.KICKED)
      return `${nickname} 님이 강퇴 투표로 퇴장 처리되었습니다.`;
    if (access === AccessStatus.EXIT) return `${nickname} 님이 나갔습니다.`;
    return '';
  };

  const message = getAccessString();

  return (
    <div key={`${nickname}-${access}`} className={className} aria-live="polite">
      <div className="w-full flex flex-col justify-center items-center">
        <span className="sr-only">{message}</span>
        <span
          aria-hidden
          className="rounded-3xl p-8 px-16 text-center foldable:text-xs text-xxs text-black bg-athens-gray dark:bg-dark-light-200 dark:text-dark-line w-fit  break-keep"
        >
          {getAccessString()}
        </span>
      </div>
    </div>
  );
}
