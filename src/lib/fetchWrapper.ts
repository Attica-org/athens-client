import showToast from '@/utils/showToast';
import getKey from '@/utils/getKey';
import { getToken } from './getToken';
import { getReissuanceToken } from './getReissuanceToken';

// const TOKEN_EXPIRED = 'The token has expired.';
// const REFRESH_NOT_EXIST = 'Refresh Token Not Exist.';
// const NOT_VALID_REFRESH_TOKEN = 'Invalid JWT signature.';
// const NOT_VALID_TOKEN = 'Authorization header is missing or does not start with Bearer';
// const UNSUPPORTED_TOKEN = 'Unsupported JWT token.';

const tokenErrorHandler = async (result: any) => {
  switch (result.error.code) {
    case 1003:
      await getToken();
      break;
    case 1002:
      await getReissuanceToken();
      break;
    case 1202:
      await getToken();
      break;
    case 1201:
      await getReissuanceToken();
      break;
    default:
      showToast('토큰 오류가 발생했습니다.', 'error');
      break;
  }
};

const getURL = async () => {
  const key = await getKey();
  return key.BASE_URL || '';
};

class FetchWrapper {
  baseUrl = '';

  constructor() {
    getURL().then((url) => {
      this.baseUrl = url;
    });
  }

  async call(url: string, fetchNext: any, retry = 3) {
    if(!this.baseUrl) {
      await getURL().then((url) => {
        this.baseUrl = url;
      });
    }
    const response = await fetch(this.baseUrl + url, fetchNext);
    const result = await response.json();

    if (!response.ok) {
      // 인증 자격에 관한 오류 처리
      if (response.status === 401) {
        await tokenErrorHandler(result);
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

const fetchWrapper = new FetchWrapper();

export default fetchWrapper;
