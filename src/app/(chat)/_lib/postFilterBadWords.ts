import fetchWrapper from '@/lib/fetchWrapper';
import getToken from '@/lib/getToken';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';

type Props = {
  message: string;
  agoraId: number;
};

const USER_NOT_PARTICIPATING = 'User is not participating in the agora';

const postFilterBadWords = async ({ message, agoraId }: Props) => {
  if (tokenManager.getToken() === undefined) {
    await getToken();
  }

  const res = await fetchWrapper.call(
    `/api/v1/auth/agoras/${agoraId}/chats/filter`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenManager.getToken()}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        type: 'CHAT',
        message,
      }),
    },
  );

  if (res.success === false) {
    if (res.error.code === 1102) {
      if (res.error.message === USER_NOT_PARTICIPATING) {
        showToast(
          '채팅을 작성중인 유저가 현재 아고라에 존재하지 않습니다',
          'error',
        );
      }
    }
    return null;
  }

  return res;
};

export default postFilterBadWords;
