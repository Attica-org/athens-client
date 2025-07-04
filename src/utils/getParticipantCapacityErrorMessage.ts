import { ParticipantCountAction } from '@/app/model/Agora';
import { AGORA_CREATE } from '@/constants/agora';

export const getParticipantCapacityErrorMessage = (
  value: number,
  state?: ParticipantCountAction,
): string | null => {
  if (
    state === ParticipantCountAction.INCREASE ||
    value < AGORA_CREATE.MIN_PARTICIPANTS_CNT
  ) {
    return AGORA_CREATE.MIN_PARTICIPANTS_CNT_MESSAGE;
  }
  if (
    state === ParticipantCountAction.DECREASE ||
    value > AGORA_CREATE.MAX_PARTICIPANTS_CNT
  ) {
    return AGORA_CREATE.MAX_PARTICIPANTS_CNT_MESSAGE;
  }

  return null;
};
