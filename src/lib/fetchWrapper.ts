import showToast from '@/utils/showToast';
import getKey from '@/utils/getKey';
import tokenManager from '@/utils/tokenManager';
import getToken from './getToken';
import { getReissuanceToken } from './getReissuanceToken';
import retryConfig from './retryConfig';

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

const customError = {
  success: false,
  error: {
    code: -1,
    message: 'API 요청 재시도 횟수를 초과했습니다. 다시 시도해주세요.',
  },
};

class FetchWrapper {
  baseUrl = '';

  async call(url: string, fetchNext: any): Promise<any> {
    if (!this.baseUrl) {
      await getURL().then((baseUrl) => {
        this.baseUrl = baseUrl;
      });
    }

    if (retryConfig.retry < 1) {
      retryConfig.retry = 3; // retry 초기화
      return customError;
    }

    const response = await fetch(this.baseUrl + url, fetchNext);
    const result = await response.json();

    if (!response.ok) {
      retryConfig.retry -= 1;

      if (response.status === 401 || response.status === 400) {
        await tokenErrorHandler(result);
        // 재발급 후 재요청

        if (!fetchNext.headers.Authorization) {
          // Authorization이 없을 경우, fetchNext를 동일하게 재요청
          return this.call(url, fetchNext);
        }

        const newFetchNext = {
          ...fetchNext,
          headers: {
            ...fetchNext.headers,
            Authorization: `Bearer ${tokenManager.getToken()}`,
          },
        };

        return this.call(url, newFetchNext);
      }
      // 인증 외 오류는 호출한 곳에서 처리
      return result;
    }
    // 정상 동작일 때는 retry 초기화.
    retryConfig.retry = 3;

    return result;
  }
}

const fetchWrapper = new FetchWrapper();

export default fetchWrapper;
