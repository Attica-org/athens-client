import getKey from '@/utils/getKey';
import showToast from '@/utils/showToast';

type Props = {
  redirectUri?: string;
  socialService: string;
};

export function OAuthRequest({ redirectUri, socialService }: Props) {
  const baseUrl = (await getKey()).BASE_URL;
  const response = await fetch(
    `${baseUrl}/oauth2/authorization/${socialService}?redirect_uri=${redirectUri}`,
    {
      method: 'GET',
      next: {
        tags: [],
      },
      credentials: 'include',
      cache: 'no-cache',
      // redirect: 'manual', // 리다이렉트를 수동으로 처리
    },
  );

  if (response.status === 302 || response.status === 301) {
    const redirectUrl = response.headers.get('location');

    if (!redirectUrl) {
      showToast('로그인에 실패했습니다.', 'error');
      return null;
    }

    // const url = new URL(redirectUrl);
    // const tempToken = url.searchParams.get('temp-token');
  }

  // if (response.success === false) {
  // if (res.error.code === 1301) {
  //   showToast('존재하지 않는 아고라 혹은 사용자입니다.', 'error');
  // } else if (res.error.code === 1002) {
  //   if (res.error.message === AGORA_STATUS_ERROR) {
  //     showToast('이미 종료된 아고라입니다.', 'error');
  //   } else if (res.error.message === ALREADY_VOTED) {
  //     showToast('이미 투표하였습니다.', 'error');
  //   } else {
  //     showToast('토론 종료에 실패했습니다.\n 다시 시도해주세요.', 'error');
  //   }
  // } else if (res.error.code === 1102) {
  //   showToast('관찰자는 토론을 종료할 수 없습니다.', 'error');
  // } else {
  //   showToast('토론 종료에 실패했습니다.\n 다시 시도해주세요.', 'error');
  // }
  // return null;
  // }

  // const result = res.response;

  // return result;
}
