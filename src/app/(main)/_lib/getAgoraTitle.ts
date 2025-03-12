/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { QueryFunction } from '@tanstack/react-query';
import { getSelectedAgoraQueryKey as getSelectedAgoraTags } from '@/constants/queryKey';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import {
  AGORA_INFO,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import { Status } from '@/app/model/Agora';

export const getAgoraTitle: QueryFunction<
  { title: string; status: Status | ''; imageUrl: string; agoraColor: string },
  [_1: string, _2: string]
> = async ({ queryKey }) => {
  const [_, agoraId] = queryKey;

  const res = await callFetchWrapper(`/api/v1/open/agoras/${agoraId}/title`, {
    next: {
      tags: getSelectedAgoraTags(agoraId),
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(AGORA_INFO.UNKNOWN_ERROR);
    }

    if (res.error.code === 1301) {
      throw new Error(AGORA_INFO.NOT_EXIST_AGORA);
    } else if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    }

    throw new Error(AGORA_INFO.FAILED_TO_GET_AGORA_INFO);
    // redirect(`${homeSegmentKey}?status=active`);
  }

  const result = res.response;

  return result;
};
