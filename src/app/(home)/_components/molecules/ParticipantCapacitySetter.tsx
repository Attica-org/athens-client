'use client';

import React, { ChangeEventHandler, useState } from 'react';
import {
  DEFAULT_PARTICIPANTS_CNT,
  MAX_PARTICIPANTS_CNT,
  MIN_PARTICIPANTS_CNT,
} from '@/constants/createAgora';
import ControlNumberInput from '../atoms/ControlNumberInput';

export default function ParticipantCapacitySetter() {
  const [message, setMessage] = useState<string | null>('');
  const [participants, setParticipants] = useState<number>(
    DEFAULT_PARTICIPANTS_CNT,
  );

  const handleMessage = (value: number, state?: 'INCREASE' | 'DECREASE') => {
    if (state === 'INCREASE' || value < MIN_PARTICIPANTS_CNT) {
      setMessage('최소 참여 인원은 각 1명입니다.');
      return;
    }
    if (state === 'DECREASE' || value > MAX_PARTICIPANTS_CNT) {
      setMessage('최대 참여 인원은 각 5명입니다.');
      return;
    }

    setMessage(null);

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
    <div className="flex justify-center items-start flex-col">
      <div className="p-3 flex justify-between items-center">
        <ControlNumberInput
          label="찬성 / 반대"
          value={participants}
          handleChange={inputParticipants}
          handleButtonClick={clickParticipantsBtn}
          increaseLabel="참여 인원 증가"
          decreaseLabel="참여 인원 감소"
          inputLabel="설정한 최대 참여 인원"
        />
      </div>
      <div>
        {message && (
        <div
          aria-live="polite"
          role="alert"
          className="text-xs text-red-600 p-5 pl-0 dark:text-dark-con-color"
        >
          {message}
        </div>
        )}
      </div>
    </div>
  );
}
