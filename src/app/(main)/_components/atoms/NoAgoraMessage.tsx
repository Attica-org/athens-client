import React from 'react';

export default function NoAgoraMessage() {
  return (
    <div
      className="flex flex-col items-center justify-start pt-12 pb-32"
      /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
      tabIndex={0}
      /* 사용자가 없는 아고라를 건너뛰기 보다, 직접 방이 없음을 인식하는게 낫다고 판단하여 tabIndex 적용하였음. */
    >
      <p className="text-gray-500 dark:text-dark-line-light text-sm">
        아직 등록된 아고라가 없습니다.
      </p>
    </div>
  );
}
