import { ParticipationPosition } from '@/app/model/Agora';
import { AGORA_POSITION, AGORA_STATUS } from '@/constants/agora';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { SIGNIN_REQUIRED, TOKEN_EXPIRED } from '@/constants/authErrorMessage';
import { getSession } from '@/serverActions/auth';
import { AGORA_ENTER } from '@/constants/responseErrorMessage';

type Props = {
  info: {
    name?: string;
    id?: number;
    file?: string;
    role: ParticipationPosition;
    nickname?: string;
  };
  agoraId: number;
};

const splitMessage = (message: string) => {
  const split = message.split('.');
  return split[0];
};

export const postEnterAgoraInfo = async ({ info, agoraId }: Props) => {
  const session = await getSession();
  if (!session) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper(
    `/api/v1/auth/agoras/${agoraId}/participants`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user?.accessToken}`,
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

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(AGORA_ENTER.UNKNOWN_ERROR);
    }

    if (res.error.code === 1001) {
      if (info.id === null) {
        throw new Error(AGORA_ENTER.PROFILE_NULL);
      } else if (info.nickname === null) {
        throw new Error(AGORA_ENTER.NICKNAME_NULL);
      } else if (
        info.role !== AGORA_POSITION.OBSERVER &&
        info.role !== AGORA_POSITION.PROS &&
        info.role !== AGORA_POSITION.CONS
      ) {
        throw new Error(AGORA_ENTER.NOT_ALLOWED_POSITION);
      }
    } else if (res.error.code === 1002) {
      if (res.error.message === TOKEN_EXPIRED) {
        throw new Error(res.error.message);
      }

      return AGORA_STATUS.CLOSED;
    } else if (res.error.code === 1004) {
      if (
        splitMessage(res.error.message) ===
        AGORA_ENTER.SERVER_RESPONSE_ALREADY_PARTICIPATED
      ) {
        throw new Error(AGORA_ENTER.ALREADY_PARTICIPATED);
      } else if (
        splitMessage(res.error.message) ===
        AGORA_ENTER.SERVER_RESPONSE_NICKNAME_DUPLICATED
      ) {
        throw new Error(AGORA_ENTER.NICKNAME_DUPLICATED);
      }
    } else if (res.error.code === 2000) {
      throw new Error(AGORA_ENTER.FULL_CAPACITY);
    }

    throw new Error(AGORA_ENTER.FAILED_TO_ENTER_AGORA);
    // return null;
  }

  console.log('post enter aogra into res', res);
  const result = res.response;

  return result;
};
