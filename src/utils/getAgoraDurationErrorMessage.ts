import { AGORA_CREATE } from '@/constants/agora';
import isNull from './validation/validateIsNull';

export const getAgoraDurationErrorMessage = (
  inputValue: string,
): string | null => {
  const value = Number(inputValue);

  if (value < AGORA_CREATE.MIN_DISCUSSION_TIME) {
    return AGORA_CREATE.MIN_TIME_MESSAGE;
  }
  if (value > AGORA_CREATE.MAX_DISCUSSION_TIME) {
    return AGORA_CREATE.MAX_TIME_MESSAGE;
  }
  if (isNull(value) || Number.isNaN(value)) {
    return '숫자로 시간을 입력해주세요.';
  }

  return null;
};
