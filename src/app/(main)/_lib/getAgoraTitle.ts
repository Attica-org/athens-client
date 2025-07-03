import { QueryFunction } from '@tanstack/react-query';
import { getSelectedAgoraQueryKey as getSelectedAgoraTags } from '@/constants/queryKey';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import {
  AGORA_INFO,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import { AgoraTitleResponse } from '@/app/model/Agora';
import isNull from '@/utils/validation/validateIsNull';

export const getAgoraTitle: QueryFunction<
  AgoraTitleResponse,
  [_1: string, _2: string]
> = async ({ queryKey }) => {
  const [, agoraId] = queryKey;

  const res = await callFetchWrapper<AgoraTitleResponse>(
    `/api/v1/open/agoras/${agoraId}/title`,
    {
      next: {
        tags: getSelectedAgoraTags(agoraId),
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
      throw new Error(AGORA_INFO.UNKNOWN_ERROR);
    }

    if (res.error.code === 1301 || res.error.code === 1002) {
      throw new Error(AGORA_INFO.NOT_EXIST_AGORA);
    } else if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    }

    throw new Error(AGORA_INFO.FAILED_TO_GET_AGORA_INFO);
  }

  const result = res.response;

  if (isNull(result)) {
    throw new Error(AGORA_INFO.FAILED_TO_GET_AGORA_INFO);
  }

  return result;
};
