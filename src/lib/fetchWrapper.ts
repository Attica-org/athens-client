'use server';

import { getSession } from '@/serverActions/auth';
import {
  AUTHORIZATION_FAIL,
  AUTHORIZATION_HEADER_ISSUE,
  AUTHORIZATION_SUCCESS,
  INVALID_JWT_SIGNATURE,
  INVALID_JWT_TOKEN,
  TOKEN_EXPIRED,
  UNSUPPORTED_JWT,
} from '@/constants/AuthErrorMessage';
import { getReissuanceToken } from './getReissuanceToken';
import retryConfig from './retryConfig';

const tokenErrorHandler = async (result: any) => {
  if (
    result.error.message === INVALID_JWT_TOKEN ||
    result.error.message === TOKEN_EXPIRED ||
    result.error.message === INVALID_JWT_SIGNATURE ||
    result.error.message === AUTHORIZATION_HEADER_ISSUE ||
    result.error.message === UNSUPPORTED_JWT
  ) {
    const reissueResponse = await getReissuanceToken();

    if (reissueResponse === AUTHORIZATION_FAIL) {
      return AUTHORIZATION_FAIL;
    }
    return AUTHORIZATION_SUCCESS;
  }

  return false;
};

const makeCustomError = (message: string) => {
  const customError = {
    success: false,
    error: {
      code: -1,
      message,
    },
  };

  return customError;
};

class FetchWrapper {
  async call(url: string, fetchNext: any): Promise<any> {
    if (retryConfig.retry < 1) {
      retryConfig.retry = 3; // retry 초기화
      return makeCustomError(
        'API 요청 재시도 횟수를 초과했습니다. 다시 시도해주세요.',
      );
    }

    const response = await fetch(process.env.NEXT_BASE_URL + url, fetchNext);
    const result = await response.json();
    const session = await getSession();

    if (!response.ok) {
      retryConfig.retry -= 1;

      if (response.status === 401 || response.status === 400) {
        const isAuthError = await tokenErrorHandler(result);

        // console.log('isAuthError', isAuthError, result);
        // 재발급 후 재요청
        if (isAuthError) {
          // 토큰 재발급 실패시 로그아웃 처리를 위한 오류 메시지 반환
          if (isAuthError === AUTHORIZATION_FAIL) {
            return makeCustomError(AUTHORIZATION_FAIL);
          }

          if (!fetchNext.headers.Authorization) {
            // Authorization이 없을 경우, fetchNext를 동일하게 재요청
            return this.call(url, fetchNext);
          }

          const newFetchNext = {
            ...fetchNext,
            headers: {
              ...fetchNext.headers,
              Authorization: `Bearer ${session?.user?.accessToken || fetchNext.headers.Authorization}`,
            },
          };

          return this.call(url, newFetchNext);
        }

        return result;
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

// 서버 컴포넌트는 aysnc 함수를 export 해야한다.
export async function callFetchWrapper(url: string, fetchNext: any) {
  return fetchWrapper.call(url, fetchNext);
}
