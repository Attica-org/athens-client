import fetchWrapper from '@/lib/fetchWrapper';
import getToken from '@/lib/getToken';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';

type Props = {
  info: {
    name?: string;
    id?: number;
    file?: string;
    role: 'PROS' | 'CONS' | 'OBSERVER';
    nickname?: string;
  };
  agoraId: number;
};

const ALREADY_PARTICIPATED = 'User has already participated';
const NICKNAME_DUPLICATED = 'The nickname is already in use';

const splitMessage = (message: string) => {
  const split = message.split('.');
  return split[0];
};

// eslint-disable-next-line import/prefer-default-export
export const postEnterAgoraInfo = async ({ info, agoraId }: Props) => {
  // 토큰을 가지고 있는지 확인
  if (tokenManager.getToken() === undefined) {
    await getToken();
  }

  const res = await fetchWrapper.call(
    `/api/v1/auth/agoras/${agoraId}/participants`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenManager.getToken()}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        nickname: info.nickname ? info.nickname : '',
        photoNum: info.id ? info.id : 1,
        type: info.role,
        voteType: null,
      }),
    },
  );

  if (res.success === false) {
    if (res.error.code === 1001) {
      if (info.id === null) {
        showToast('프로필을 선택해주세요.', 'error');
      } else if (info.nickname === null) {
        showToast('닉네임을 입력해주세요.', 'error');
      } else if (
        info.role !== 'OBSERVER' &&
        info.role !== 'PROS' &&
        info.role !== 'CONS'
      ) {
        showToast('허용되지 않는 입장 타입 입니다.', 'error');
      } else {
        showToast('입장 실패했습니다.\n 다시 시도해주세요.', 'error');
      }
    } else if (res.error.code === 1004) {
      if (splitMessage(res.error.message) === ALREADY_PARTICIPATED) {
        showToast('이미 참여한 아고라입니다.', 'error');
      } else if (splitMessage(res.error.message) === NICKNAME_DUPLICATED) {
        showToast('닉네임이 중복됩니다.', 'error');
      }
    } else if (res.error.code === 2000) {
      showToast('선택한 타입의 인원이 꽉 찼습니다.', 'error');
    }
    return null;
  }

  const result = res.response;

  return result;
};
