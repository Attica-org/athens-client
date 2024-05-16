import React from 'react';

export default function AgoraStatus() {
  return (
    <div className="flex flex-col justify-start items-start p-10">
      <div className="flex items-center text-xxs text-athens-gray-thick whitespace-nowrap dark:text-white">
        <div className="bg-red-400 w-8 h-8 rounded-full mr-10" />
        대기중
      </div>
      <div className="flex items-center text-xxs pt-5 text-athens-gray-thick dark:text-white">
        <div className="bg-athens-button w-8 h-8 rounded-full mr-10" />
        진행중
      </div>
    </div>
  );
}
