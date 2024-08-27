import React from 'react';
import SpeakerIcon from '@/assets/icons/SpeakerIcon';

const dummyData = {
  type: 'CHAT',
  data: {
    agoraId: 2,
    memberId: 52,
    username: 'user51',
  },
};

export default function KickNotification() {
  return (
    <div className="flex p-0.5rem pl-1rem pr-1rem">
      <div className="w-full flex flex-col justify-center items-center">
        <span
          aria-live="polite"
          className="flex items-center rounded-3xl p-14 px-16 text-center text-xs lg:text-sm under-mobile:text-xs text-black bg-athens-gray dark:bg-dark-light-200 dark:text-dark-line w-fit  break-keep"
        >
          <SpeakerIcon className="w-16 h-16 mr-8 fill-white" />
          {dummyData.data.username} 님이 추방당하셨습니다.
        </span>
      </div>
    </div>
  );
}
