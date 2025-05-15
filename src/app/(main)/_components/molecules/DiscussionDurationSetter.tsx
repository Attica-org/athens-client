'use client';

import React, { ChangeEventHandler, useState } from 'react';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';
import { AGORA_CREATE } from '@/constants/agora';

export default function DiscussionDurationSetter() {
  const [message, setMessage] = useState<string | null>(null);
  const { duration, setDuration } = useCreateAgora(
    useShallow((state) => ({
      duration: state.duration,
      setDuration: state.setDuration,
    })),
  );

  const validateAgoraDuration: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseInt(e.target.value, 10);

    if (value < AGORA_CREATE.MIN_DISCUSSION_TIME) {
      setMessage(AGORA_CREATE.MIN_TIME_MESSAGE);
    } else if (value > AGORA_CREATE.MAX_DISCUSSION_TIME) {
      setMessage(AGORA_CREATE.MAX_TIME_MESSAGE);
    } else if (!value) {
      setMessage('시간을 입력해주세요.');
    } else {
      setMessage(null);
    }
    setDuration(value);
  };

  return (
    <div className="text-sm flex flex-col w-full under-mobile:flex-row justify-center under-mobile:justify-start items-start under-mobile:items-center">
      <div className="flex justify-start items-center">
        <input
          aria-label="토론 제한시간 입력창"
          min={AGORA_CREATE.MIN_DISCUSSION_TIME}
          max={AGORA_CREATE.MAX_DISCUSSION_TIME}
          type="text"
          value={duration || ''}
          onChange={validateAgoraDuration}
          className="input-number-hide focus-visible:outline-none text-sm mr-0.5rem text-center p-5 w-4rem lg:w-5rem border-1 border-athens-gray rounded-md dark:bg-dark-bg-light dark:border-gray-500"
        />
        <div className="text-xs lg:text-base">분</div>
      </div>
      {message && (
        <div
          role="alert"
          aria-live="polite"
          className="text-xs text-red-600 p-5 pb-0 pl-0 dark:text-dark-con-color"
        >
          {message}
        </div>
      )}
    </div>
  );
}
