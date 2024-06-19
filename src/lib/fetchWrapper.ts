import showToast from '@/utils/showToast';
import getKey from '@/utils/getKey';
import { getToken } from './getToken';
import { getReissuanceToken } from './getReissuanceToken';

const tokenErrorHandler = async (result: any) => {
  if(fetchWrapper.retry < 1) return;
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
  retry = 3;

  async call(url: string, fetchNext: any): Promise<any> {
    console.log('retry는', this.retry);

    if (!this.baseUrl) {
      await getURL().then((baseUrl) => {
        this.baseUrl = baseUrl;
      });
    }
    if(this.retry < 1){
      return new Error;
    }

    const response = await fetch(this.baseUrl + url, fetchNext);
    const result = await response.json();

    if (!response.ok) {
      this.retry -= 1;
      if (response.status === 401 && this.retry > 0) {
        console.log('토큰 요청');
        await tokenErrorHandler(result);
        // 재발급 후 재요청
        return this.call(url, fetchNext);
      } else {
        // 인증 외 오류는 호출한 곳에서 처리
        return result;
      }
    } else { 
      // 정상 동작일 때는 retry 초기화.
      this.retry = 3;
    }

    return result;
  }
}

const fetchWrapper = new FetchWrapper();

export default fetchWrapper;
