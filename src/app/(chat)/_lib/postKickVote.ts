import { SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import { PATCH_USER_KICK_VOTE_ERROR_MESSAGE } from '@/constants/responseErrorMessage';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import isNull from '@/utils/validation/validateIsNull';

const NOT_FOUND_USER = (agoraId: number, memberId: number) =>
  `Agora user not found with agora id: ${agoraId} agoraMemberId: ${memberId}`;

const NOT_FOUND_AGORA = (agoraId: number) =>
  `Not found agora. agoraId: ${agoraId}`;

export const postKickVote = async (
  targetMemberId: number,
  currentMemberCount: number,
  agoraId: number,
) => {
  // Authorization: Bearer accessToken
  // Cookie: 'ATKN=~'

  const session = await getSession();

  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper(
    `/api/v1/auth/agoras/${agoraId}/kick-vote`,
    {
      method: 'POST',
      next: {
        tags: [],
      },
      credentials: 'include',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user?.accessToken}`,
      },
      body: JSON.stringify({
        targetMemberId,
        currentMemberCount,
      }),
    },
  );

  if (!res.ok && !res.success) {
    if (res.error.code === 1301) {
      if (res.error.message === NOT_FOUND_USER(agoraId, targetMemberId)) {
        throw new Error(PATCH_USER_KICK_VOTE_ERROR_MESSAGE.NOT_FOUND_USER);
      } else if (res.error.message === NOT_FOUND_AGORA(agoraId)) {
        throw new Error(PATCH_USER_KICK_VOTE_ERROR_MESSAGE.NOT_FOUND_AGORA);
      } else if (res.error.code === 1004) {
        throw new Error(PATCH_USER_KICK_VOTE_ERROR_MESSAGE.ALREADY_VOTE);
      }
    }

    if (!res.error) {
      throw new Error(PATCH_USER_KICK_VOTE_ERROR_MESSAGE.UNKNOWN_ERROR);
    }

    throw new Error(PATCH_USER_KICK_VOTE_ERROR_MESSAGE.FAILED_TO_KICK_VOTE);
  }

  return res;
};
