import { base64ToFile } from '@/utils/base64ToFile';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import { AUTH_MESSAGE, SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import {
  AGORA_IMAGE_UPDATE,
  NETWORK_ERROR_MESSAGE,
} from '@/constants/responseErrorMessage';
import isNull from '@/utils/validation/validateIsNull';
import { AgoraId, ImageURL } from '@/app/model/Agora';

type PatchAgoraImgArg = {
  agoraId: AgoraId;
  fileUrl: ImageURL;
};

export const patchAgoraImg = async ({ agoraId, fileUrl }: PatchAgoraImgArg) => {
  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const formData = new FormData();
  const file = fileUrl ? base64ToFile(fileUrl, `아고라${agoraId}.jpg`) : '';
  formData.append('file', file);

  const res = await callFetchWrapper(`/api/v1/auth/agoras/${agoraId}`, {
    method: 'PATCH',
    next: {
      tags: [],
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      Authorization: `Bearer ${session.user?.accessToken}`,
    },
    body: formData,
  });

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(AGORA_IMAGE_UPDATE.UNKNOWN_ERROR);
    }

    const errorMessage =
      typeof res.error.message === 'string' ? res.error.message : 'ERROR';

    if (res.error.code === 1202) {
      throw new Error(AGORA_IMAGE_UPDATE.ONLY_HOST_CAN_UPDATE);
    } else if (res.error.code === 1301) {
      throw new Error(AGORA_IMAGE_UPDATE.NOT_FOUND_AGORA_OR_USER);
    } else if (res.error.code === 503) {
      throw new Error(NETWORK_ERROR_MESSAGE.OFFLINE);
    } else if (AUTH_MESSAGE.includes(errorMessage)) {
      throw new Error(errorMessage);
    }

    throw new Error(AGORA_IMAGE_UPDATE.FAILED_TO_UPDATE_IMAGE);
    // return null;
  }

  const result = res.response;

  return result;
};
