import errorMessage from '@/utils/errorMessage';
import { getToken } from './getToken';
import { getReissuanceToken } from './getReissuanceToken';

// const TOKEN_EXPIRED = 'The token has expired.';
// const REFRESH_NOT_EXIST = 'Refresh Token Not Exist.';
// const NOT_VALID_REFRESH_TOKEN = 'Invalid JWT signature.';
// const NOT_VALID_TOKEN = 'Authorization header is missing or does not start with Bearer';
// const UNSUPPORTED_TOKEN = 'Unsupported JWT token.';

const tokenErrorHandler = async (response: any) => {
  const { error } = response;
  switch (error.code) {
    case 1002:
      await getReissuanceToken();
      break;
    case 1201:
      await getToken();
      break;
    default:
      errorMessage.setMessage(error.message);
      break;
  }
};

class FetchWrapper {
  baseUrl = '';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async call(url: string, fetchNext: any, retry = 3) {
    const response = await fetch(`${this.baseUrl}${url}`, fetchNext);

    if (!response.ok) {
      const res = await response.json();
      // 인증 자격에 관한 오류 처리
      if (response.status === 401) {
        await tokenErrorHandler(res);
        // 재발급 후 재요청
        if (retry !== 0) {
          this.call(url, fetchNext, retry - 1);
        }
      } else {
        // 인증 외 오류는 호출한 곳에서 처리
        return res;
      }
    }

    return response.json();
  }
}

const fetchWrapper = new FetchWrapper(`${process.env.NEXT_PUBLIC_BASE_URL}` || '');

export default fetchWrapper;
