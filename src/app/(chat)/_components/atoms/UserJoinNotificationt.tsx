import React from 'react';

const dummyData = {
  type: 'CHAT',
  data: {
    agoraId: 2,
    memberId: 52,
    username: 'user51',
  },
};

export default function UserExitNotification() {
  return (
    <div className="flex p-0.5rem pl-1rem pr-1rem">
      <div className="w-full flex flex-col justify-center items-center">
        <span
          aria-live="polite"
          className="rounded-3xl p-14 px-16 text-center text-xs lg:text-sm under-mobile:text-xs text-black bg-athens-gray dark:bg-dark-light-200 dark:text-dark-line w-fit  break-keep"
        >
          {dummyData.data.username} 님이 들어왔습니다.
        </span>
      </div>
    </div>
  );
}
