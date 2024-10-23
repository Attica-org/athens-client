import { callFetchWrapper } from '@/lib/fetchWrapper';
import getToken from '@/lib/getToken';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';

const NOT_FOUND_AGORA = 'Not found agora. agoraId: 1';
const NOT_FOUND_USER = 'Agora user not found with agora id: 1 user id: 1';

type Props = {
  agoraId: number;
};

const patchChatExit = async ({ agoraId }: Props) => {
  if (tokenManager.getToken() === undefined) {
    await getToken();
  }

  const res = await callFetchWrapper(`/api/v1/auth/agoras/${agoraId}/exit`, {
    method: 'PATCH',
    next: {
      tags: [],
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      Authorization: `Bearer ${tokenManager.getToken()}`,
    },
  });

  if (res.success === false) {
    if (res.error.code === 1301) {
      if (res.error.message === NOT_FOUND_AGORA) {
        showToast('존재하지 않는 아고라입니다', 'error');
      } else if (res.error.message === NOT_FOUND_USER) {
        showToast('존재하지 않는 사용자입니다', 'error');
      }
    }
    return null;
  }

  const result = res.response;

  return result;
};

export default patchChatExit;
