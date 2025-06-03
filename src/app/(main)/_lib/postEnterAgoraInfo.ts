import { AgoraId, ParticipantPosition } from '@/app/model/Agora';
import { AGORA_POSITION } from '@/constants/agora';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { AUTH_MESSAGE, SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import { getSession } from '@/serverActions/auth';
import {
  AGORA_ENTER,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import isNull from '@/utils/validation/validateIsNull';

type Props = {
  info: {
    name?: string;
    id?: number;
    file?: string;
    role: ParticipantPosition;
    nickname?: string;
  };
  agoraId: AgoraId;
};

type EnterAgoraInfoResponse = {
  agoraId: AgoraId;
  userId: number;
  type: ParticipantPosition;
  isCreator: boolean;
};

export enum FinishedAgoraInfo {
  agoraId = -1,
}

const finishAgoraInfo: EnterAgoraInfoResponse = {
  agoraId: FinishedAgoraInfo.agoraId,
  userId: -1,
  type: ParticipantPosition.OBSERVER,
  isCreator: false,
};

const splitMessage = (message: string) => {
  const split = message.split('.');
  return split[0];
};

export const postEnterAgoraInfo = async ({
  info,
  agoraId,
}: Props): Promise<EnterAgoraInfoResponse> => {
  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper<EnterAgoraInfoResponse>(
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

    const errorMessage =
      typeof res.error.message === 'string' ? res.error.message : 'ERROR';

    if (AUTH_MESSAGE.includes(errorMessage)) {
      throw new Error(errorMessage);
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
      if (errorMessage === AGORA_ENTER.SERVER_RESPONSE_CLOSED_AGORA) {
        return finishAgoraInfo;
      }
    } else if (res.error.code === 1004) {
      if (
        splitMessage(errorMessage) ===
        AGORA_ENTER.SERVER_RESPONSE_ALREADY_PARTICIPATED
      ) {
        throw new Error(AGORA_ENTER.ALREADY_PARTICIPATED);
      } else if (
        splitMessage(errorMessage) ===
        AGORA_ENTER.SERVER_RESPONSE_NICKNAME_DUPLICATED
      ) {
        throw new Error(AGORA_ENTER.NICKNAME_DUPLICATED);
      }
    } else if (res.error.code === 2000) {
      throw new Error(AGORA_ENTER.FULL_CAPACITY);
    } else if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    }

    throw new Error(AGORA_ENTER.FAILED_TO_ENTER_AGORA);
    // return null;
  }

  const result = res.response;

  if (isNull(result)) {
    throw new Error(AGORA_ENTER.UNKNOWN_ERROR);
  }

  return result;
};
