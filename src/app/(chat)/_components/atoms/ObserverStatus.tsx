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
    return null;
  }

  const { participants, agora } = meta;
  return (
    <div
      aria-label="관찰자 수"
      aria-describedby="watcher"
      className="flex justify-center items-center ml-10"
    >
      <EyeIcon className="w-1rem" />
      {participants.map(
        (participant) =>
          participant.type === AGORA_POSITION.OBSERVER && (
            <>
              <span
                key={agora.id}
                className="pl-5 text-xs text-athens-gray-thick dark:text-white dark:text-opacity-85"
              >
                {participant.count || 0}
              </span>
              <span className="sr-only" id="watcher" aria-live="polite">
                {participant.count}명의 관찰자가 토론을 지켜보고 있습니다.
              </span>
            </>
          ),
      )}
    </div>
  );
});
