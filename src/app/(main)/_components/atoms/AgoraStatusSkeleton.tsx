import React from 'react';

export default function AgoraStatusSkeleton() {
  return (
    <div className="flex flex-row justify-around items-center h-2rem w-full text-xs pl-5 pr-5 dark:text-white">
      <div className="border-b-1 border-athens-sub flex flex-1 justify-center p-6">활성화</div>
      <div className="flex flex-1 justify-center p-6 border-b-1 dark:border-dark-light-300">종료</div>
    </div>
  );
}
