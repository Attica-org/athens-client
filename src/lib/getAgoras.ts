import { AgoraId } from '@/app/model/Agora';
import isNull from '@/utils/validation/validateIsNull';
import { callFetchWrapper } from './fetchWrapper';

type AgoraIdsResponse = {
  id: AgoraId[];
};

// eslint-disable-next-line import/prefer-default-export
export const getAgoraList = async () => {
  const res = await callFetchWrapper<AgoraIdsResponse>(
    '/api/v1/open/agoras/ids',
    {
      method: 'get',
      credentials: 'include',
    },
  );

  if (!res.ok && !res.success) {
    if (res.error.code === 1301) {
      // 아고라 id가 하나도 존재하지 않을 때
      return [];
    }

    return [];
  }

  if (isNull(res.response)) {
    return [];
  }

  const result = res.response;

  return result.id;
};
