import fetchWrapper from '@/lib/fetchWrapper';
import { getToken } from '@/lib/getToken';
import tokenManager from '@/utils/tokenManager';

type Props = {
  info: {
    name?: string,
    id?: number,
    file?: string,
    role: 'PROS' | 'CONS' | 'OBSERVER',
    nickname?: string,
  },
  agoraId: number,
};

// eslint-disable-next-line import/prefer-default-export
export const postEnterAgoraInfo = async ({ info, agoraId }: Props) => {
  // 토큰을 가지고 있는지 확인
  if (tokenManager.getToken() === undefined) {
    await getToken();
  }

  const res = await fetchWrapper.call(`/api/v1/auth/agoras/${agoraId}/participants`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenManager.getToken()}`,
    },
    credentials: 'include',
    body: JSON.stringify({
      nickname: info.nickname ? info.nickname : '',
      photo_num: info.id ? info.id : 0,
      type: info.role,
      voteType: null,
    }),
  });

  if (res.success === false) {
    const message = res.error;
    console.log(message);
    throw new Error('Network response was not ok');
  }

  const result = res.response;

  return result;
};
