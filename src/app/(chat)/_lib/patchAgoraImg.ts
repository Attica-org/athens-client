import getToken from '@/lib/getToken';
import showToast from '@/utils/showToast';
import tokenManager from '@/utils/tokenManager';
import { base64ToFile } from '@/utils/base64ToFile';
import { callFetchWrapper } from '@/lib/fetchWrapper';

type Props = {
  agoraId: number;
  fileUrl: string;
};

// eslint-disable-next-line import/prefer-default-export
export const patchAgoraImg = async ({ agoraId, fileUrl }: Props) => {
  // 토큰을 가지고 있는지 확인
  if (tokenManager.getToken() === undefined) {
    await getToken();
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
      Authorization: `Bearer ${tokenManager.getToken()}`,
    },
    body: formData,
  });

  if (res.success === false) {
    if (res.error.code === 1202) {
      showToast('방장만 이미지를 변경할 수 있습니다.', 'error');
    } else if (res.error.code === 1301) {
      showToast('존재하지 않는 아고라이거나 사용자입니다.', 'error');
    }

    return null;
  }

  const result = res.response;

  return result;
};
