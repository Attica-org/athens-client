import { AgoraConfig } from '@/app/model/Agora';
import { AGORA_CREATE } from '@/constants/agora';

type ValidateCreateAgoraArg = Omit<AgoraConfig, 'imageUrl' | 'capacity'>;

export const validateCreateAgora = ({
  title,
  color,
  category,
  duration,
}: ValidateCreateAgoraArg) => {
  if (
    title.trim() === '' ||
    title.length > 15 ||
    !color ||
    !category ||
    !duration ||
    duration > AGORA_CREATE.MAX_DISCUSSION_TIME ||
    duration < AGORA_CREATE.MIN_DISCUSSION_TIME
  ) {
    return false;
  }
  return true;
};
