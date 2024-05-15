'use client';

import React, { ChangeEventHandler, useState } from 'react';
import { DEFAULT_TIME, MIN_DISCUSSION_TIME, MIN_TIME_MESSAGE } from '@/constants/createAgora';
import CheckIcon from '@/assets/icons/CheckIcon';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';

function DiscussionDurationSetter() {
  const [message, setMessage] = useState<string | null>(null);
  const [timeCheck, setTimeCheck] = useState<boolean>(false);
  const { duration, setDuration } = useCreateAgora(
    useShallow((state) => ({ duration: state.duration, setDuration: state.setDuration })),
  );

  const handleAgoraTime: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseInt(e.target.value, 10);

    if (value < MIN_DISCUSSION_TIME) {
      setMessage(MIN_TIME_MESSAGE);
    } else {
      setMessage(null);
    }
    setDuration(value);
  };

  const handleNoTime = () => {
    if (timeCheck) {
      setDuration(DEFAULT_TIME);
      setTimeCheck(false);
    } else {
      setDuration(null);
      setTimeCheck(true);
      setMessage(null);
    }
  };

  return (
    <div className="text-sm flex flex-col w-full under-mobile:flex-row justify-center under-mobile:justify-start items-start under-mobile:items-center">
      <div className="flex justify-start items-center">
        <input
          aria-label="토론 제한시간 입력창"
          type="number"
          value={duration || ''}
          onChange={handleAgoraTime}
          disabled={timeCheck}
          className="input-number-hide focus-visible:outline-none text-sm mr-0.5rem text-center p-5 w-5rem border-1 border-athens-gray rounded-md dark:bg-dark-bg-light dark:border-gray-500"
        />
        <div className="under-mobile:text-xs">분</div>
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
      <button
        type="button"
        onClick={handleNoTime}
        className="under-mobile:ml-1rem cursor-pointer mt-12 under-mobile:mt-0 flex justify-start items-center text-athens-gray-thick text-center"
      >
        <CheckIcon
          className="w-1rem"
          fill="rgb(107 114 128)"
          check={timeCheck}
        />
        <div className="ml-8 text-sm under-mobile:text-xs dark:text-white dark:text-opacity-65">
          제한 없음
        </div>
      </button>
    </div>
  );
}

export default React.memo(DiscussionDurationSetter);
