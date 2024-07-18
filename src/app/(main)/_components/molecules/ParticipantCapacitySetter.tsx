'use client';

import React, { ChangeEventHandler, useState } from 'react';
import {
  MAX_PARTICIPANTS_CNT,
  MIN_PARTICIPANTS_CNT,
} from '@/constants/createAgora';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';
import { ParticipantCountAction } from '@/app/model/Agora';
import ControlNumberInput from '../atoms/ControlNumberInput';

function ParticipantCapacitySetter() {
  const [message, setMessage] = useState<string | null>('');
  const { capacity, setCapacity } = useCreateAgora(
    useShallow((state) => ({
      capacity: state.capacity,
      setCapacity: state.setCapacity,
    })),
  );

  const validateCapacity = (value: number, state?: ParticipantCountAction) => {
    if (state === 'INCREASE' || value < MIN_PARTICIPANTS_CNT) {
      setMessage('최소 참여 인원은 각 1명입니다.');
      return;
    }
    if (state === 'DECREASE' || value > MAX_PARTICIPANTS_CNT) {
      setMessage('최대 참여 인원은 각 5명입니다.');
      return;
    }

    setMessage(null);

    setCapacity(value);
  };

  const handleParticipants: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseInt(e.target.value, 10);
    validateCapacity(value);
  };

  const handleParticipantsBtn = (action: ParticipantCountAction) => {
    switch (action) {
      case 'DECREASE':
        validateCapacity(capacity - 1);
        break;
      case 'INCREASE':
        validateCapacity(capacity + 1);
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
          value={capacity}
          handleChange={handleParticipants}
          handleButtonClick={handleParticipantsBtn}
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

export default React.memo(ParticipantCapacitySetter);
