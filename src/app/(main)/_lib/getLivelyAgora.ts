import { ActiveAgora } from '@/app/model/Agora';
import {
  AGORA_ACTIVE,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import isNull from '@/utils/validation/validateIsNull';

type ActiveAgoraList = {
  agoras: ActiveAgora[];
};

export const getLivelyAgora = async (): Promise<ActiveAgora[]> => {
  const res = await callFetchWrapper<ActiveAgoraList>(
    '/api/v1/open/agoras/active',
    {
      next: {
        tags: ['agoras', 'lively'],
      },
      credentials: 'include',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(AGORA_ACTIVE.UNKNOWN_ERROR);
    }

    if (res.error.code === 1002) {
      throw new Error(AGORA_ACTIVE.BAD_REQUEST);
    } else if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    }
  }

  const result = res.response;

  if (!isNull(result) && !isNull(result.agoras)) {
    return result.agoras;
  }

  // 인기 아고라가 없을 땐 빈 배열 반환
  return [];
};
