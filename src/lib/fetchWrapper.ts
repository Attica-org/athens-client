import showToast from '@/utils/showToast';
import { getToken } from './getToken';
import { getReissuanceToken } from './getReissuanceToken';

// const TOKEN_EXPIRED = 'The token has expired.';
// const REFRESH_NOT_EXIST = 'Refresh Token Not Exist.';
// const NOT_VALID_REFRESH_TOKEN = 'Invalid JWT signature.';
// const NOT_VALID_TOKEN = 'Authorization header is missing or does not start with Bearer';
// const UNSUPPORTED_TOKEN = 'Unsupported JWT token.';

const tokenErrorHandler = async (response: any) => {
  const { error } = await response.json();
  switch (error.code) {
    case 1002:
      await getReissuanceToken();
      break;
    case 1201:
      await getToken();
      break;
    default:
      showToast('토큰 오류가 발생했습니다.', 'error');
      break;
  }
};

class FetchWrapper {
  baseUrl = '';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async call(url: string, fetchNext: any, retry = 3) {
    const response = await fetch(this.baseUrl + url, fetchNext);
    const result = await response.json();

    if (!response.ok) {
      // 인증 자격에 관한 오류 처리
      if (response.status === 401) {
        await tokenErrorHandler(response);
        // 재발급 후 재요청
        if (retry !== 0) {
          this.call(url, fetchNext, retry - 1);
        }
      } else {
        // 인증 외 오류는 호출한 곳에서 처리
        return result;
      }
    }

    return result;
  }
}

const fetchWrapper = new FetchWrapper(`${process.env.NEXT_PUBLIC_BASE_URL}` || '');

export default fetchWrapper;
