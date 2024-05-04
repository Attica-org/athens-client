'use client';

import React, { ChangeEventHandler, useState } from 'react';
import {
  DEFAULT_PARTICIPANTS_CNT,
  MAX_PARTICIPANTS_CNT,
  MIN_PARTICIPANTS_CNT,
} from '@/constants/createAgora';

type Message = {
  participants: string | null;
  time: string | null;
};

type Props = {
  label: string;
};

export default function ModifyNumberInput({ label }: Props) {
  const [message, setMessage] = useState<Message>({
    participants: null,
    time: null,
  });
  const [participants, setParticipants] = useState<number>(
    DEFAULT_PARTICIPANTS_CNT,
  );

  const handleMessage = (value: number, state?: 'INCREASE' | 'DECREASE') => {
    if (state === 'INCREASE' || value < MIN_PARTICIPANTS_CNT) {
      setMessage({
        ...message,
        participants: '최소 참여 인원은 각 1명입니다.',
      });
      return;
    }
    if (state === 'DECREASE' || value > MAX_PARTICIPANTS_CNT) {
      setMessage({
        ...message,
        participants: '최대 참여 인원은 각 5명입니다.',
      });
      return;
    }

    setMessage({
      ...message,
      participants: null,
    });

    setParticipants(value);
  };

  const inputParticipants: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseInt(e.target.value, 10);
    handleMessage(value);
  };

  const clickParticipantsBtn = (action: 'DECLEASE' | 'INCREASE') => {
    switch (action) {
      case 'DECLEASE':
        handleMessage(participants - 1);
        break;
      case 'INCREASE':
        handleMessage(participants + 1);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div className="p-3 flex justify-between items-center">
        <label htmlFor="modify-number-input" className="text-sm under-mobile:text-xs flex justify-center items-center">
          {label}
          <div className="ml-0.5rem pl-7 pr-7 border-1 border-athens-gray rounded-md dark:border-gray-500 flex justify-center items-center">
            <button
              type="button"
              aria-label="각 입장 참여 인원 감소"
              className="text-xl cursor-pointer"
              onClick={() => clickParticipantsBtn('DECLEASE')}
            >
              -
            </button>
            <input
              id="modify-number-input"
              aria-label="설정한 최대 참여 인원"
              value={participants}
              onChange={inputParticipants}
              type="number"
              className="text-center max-w-32 w-32 text-xs input-number-hide focus-visible:outline-none dark:bg-dark-bg-light"
            />
            <button
              type="button"
              aria-label="각 입장 참여 인원 증가"
              className="text-xl cursor-pointer"
              onClick={() => clickParticipantsBtn('INCREASE')}
            >
              +
            </button>
          </div>
        </label>
      </div>
      {message.participants && (
      <div
        aria-live="polite"
        role="alert"
        className="text-xs under-mobile:text-xxs text-red-600 p-5 pl-0 dark:text-dark-con-color"
      >
        {message.participants}
      </div>
      )}
    </div>
  );
}
