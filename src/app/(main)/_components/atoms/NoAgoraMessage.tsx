import React from 'react';

export default function NoAgoraMessage() {
  return (
    <div className="flex flex-col items-center justify-start pt-12 pb-32">
      <p className="text-gray-500 dark:text-dark-line-light text-sm">
        아직 등록된 아고라가 없습니다.
      </p>
    </div>
  );
}
