import getKey from '@/utils/getKey';

class FetchWrapper {
  static #baseURL: string;

  constructor() {
    FetchWrapper.#setBaseUrl();
  }

  static async #setBaseUrl() {
    this.#baseURL = (await getKey()).BASE_URL || '';
  }

  static async call(url: string, fetchNext: any): Promise<any> {
    if (!this.#baseURL) {
      await this.#setBaseUrl();
    }

    let response;

    try {
      response = await fetch(`${this.#baseURL}${url}`, {
        ...fetchNext,
        headers: {
          ...fetchNext.headers,
          Connection: 'keep-alive',
        },
      });
      return await response.json();
    } catch (error) {
      console.log('error', error);
      return response;
    }
  }
}

// 서버 컴포넌트는 aysnc 함수를 export 해야한다.
export async function callFetchWrapper(url: string, fetchNext: any) {
  return FetchWrapper.call(url, fetchNext);
}
