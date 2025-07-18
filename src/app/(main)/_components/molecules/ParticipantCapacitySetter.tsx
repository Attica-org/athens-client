'use client';

import React, { ChangeEventHandler, useState } from 'react';
import { useCreateAgora } from '@/store/create';
import { useShallow } from 'zustand/react/shallow';
import { ParticipantCountAction } from '@/app/model/Agora';
import { AGORA_CREATE } from '@/constants/agora';
import { getParticipantCapacityErrorMessage } from '@/utils/getParticipantCapacityErrorMessage';
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
    setMessage(getParticipantCapacityErrorMessage(value, state));
    setCapacity(value);
  };

  const handleParticipants: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseInt(e.target.value, 10);
    validateCapacity(value);
  };

  const handleParticipantsBtn = (action: ParticipantCountAction) => {
    switch (action) {
      case ParticipantCountAction.DECREASE:
        validateCapacity(capacity - 1);
        break;
      case ParticipantCountAction.INCREASE:
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
          inputAriaLabel="설정한 최대 참여 인원"
          controlLabel={{
            increase: '참여 인원 증가',
            decrease: '참여 인원 감소',
          }}
          handleChange={handleParticipants}
          handleControlButtonClick={handleParticipantsBtn}
          value={capacity}
          range={{
            max: AGORA_CREATE.MAX_PARTICIPANTS_CNT,
            min: AGORA_CREATE.MIN_PARTICIPANTS_CNT,
          }}
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
