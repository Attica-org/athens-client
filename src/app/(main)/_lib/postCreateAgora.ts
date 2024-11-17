import { AgoraConfig } from '@/app/model/Agora';
import { base64ToFile } from '@/utils/base64ToFile';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSession } from '@/serverActions/auth';
import { AUTH_MESSAGE, SIGNIN_REQUIRED } from '@/constants/authErrorMessage';
import { AGORA_CREATE } from '@/constants/responseErrorMessage';
import isNull from '@/utils/isNull';

const TITLE_NULL = { title: '공백일 수 없습니다' };
const CATEGORY_ERROR = { capacity: '1 이상이어야 합니다' };
const COLOR_NULL = { color: '공백일 수 없습니다' };
const CAPACITY_NULL = { categoryId: '널이어서는 안됩니다' };
const DURATION_UNDER_ERROR = { duration: '1 이상이어야 합니다' };
const DURATION_OVER_ERROR = { duration: '180 이하이어야 합니다' };

export const postCreateAgora = async (info: AgoraConfig) => {
  const requestInfo = {
    title: info.title,
    categoryId: info.category,
    color: info.color.value,
    capacity: info.capacity,
    duration: info.duration,
  };

  const formData = new FormData();
  const json = JSON.stringify(requestInfo);

  const blob = new Blob([json], {
    type: 'application/json',
  });

  // base64로 인코딩된 이미지를 디코딩하여 파일로 변환
  const file = info.thumbnail
    ? base64ToFile(info.thumbnail, `${info.title}.jpg`)
    : '';

  formData.append('request', blob);
  formData.append('file', file);

  const session = await getSession();
  if (isNull(session)) {
    throw new Error(SIGNIN_REQUIRED);
  }

  const res = await callFetchWrapper('/api/v1/auth/agoras', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    credentials: 'include',
    body: formData,
  });

  if (!res.ok && !res.success) {
    if (!res.error) {
      throw new Error(AGORA_CREATE.UNKNOWN_ERROR);
    }

    if (res.error.code === 1001) {
      if (Number(info.category) < 1 || res.error.message === CATEGORY_ERROR) {
        throw new Error(AGORA_CREATE.NOT_ALLOWED_CATEGORY);
      } else if (info.color === null || res.error.message === COLOR_NULL) {
        throw new Error(AGORA_CREATE.COLOR_NULL);
      } else if (
        info.capacity === null ||
        res.error.message === CAPACITY_NULL
      ) {
        throw new Error(AGORA_CREATE.CAPACITY_NULL);
      } else if (
        info.title.trim() === null ||
        res.error.message === TITLE_NULL
      ) {
        throw new Error(AGORA_CREATE.TITLE_NULL);
      } else if (
        info.duration === null ||
        info.duration < 1 ||
        res.error.message === DURATION_UNDER_ERROR
      ) {
        throw new Error(AGORA_CREATE.DURATION_UNDER);
      } else if (
        info.duration === null ||
        info.duration > 180 ||
        res.error.message === DURATION_OVER_ERROR
      ) {
        throw new Error(AGORA_CREATE.DURATION_OVER);
      }
    } else if (AUTH_MESSAGE.includes(res.error.message)) {
      throw new Error(res.error.message);
    }

    throw new Error(AGORA_CREATE.FAIED_TO_CREATE_AGORA);
    // return null;
  }

  const result = res.response;

  return result;
};
