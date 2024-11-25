import { AgoraMeta } from '@/app/model/AgoraMeta';
import EyeIcon from '@/assets/icons/EyeIcon';
import { AGORA_POSITION } from '@/constants/agora';
import isNull from '@/utils/validation/validateIsNull';
import React from 'react';

type Props = {
  meta: AgoraMeta | undefined;
};

export default React.memo(function ObserverStatus({ meta }: Props) {
  if (isNull(meta)) {
    return (
      <div
        role="status"
        aria-label="관찰자 수"
        className="flex justify-center items-center ml-10"
      >
        <EyeIcon className="w-1rem" />
        <span className="pl-5 text-xs text-athens-gray-thick dark:text-white dark:text-opacity-85">
          0
        </span>
      </div>
    );
  }

  const { participants, agora } = meta;
  return (
    <div
      role="status"
      aria-label="관찰자 수"
      className="flex justify-center items-center ml-10"
    >
      <EyeIcon className="w-1rem" />
      {participants.map(
        (participant) =>
          participant.type === AGORA_POSITION.OBSERVER && (
            <span
              key={agora.id}
              className="pl-5 text-xs text-athens-gray-thick dark:text-white dark:text-opacity-85"
            >
              {participant.count || 0}
            </span>
          ),
      )}
    </div>
  );
});
