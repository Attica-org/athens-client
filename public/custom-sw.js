const INVALID_JWT_TOKEN = 'Invalid JWT token.';
const TOKEN_EXPIRED = 'The token has expired.';
const INVALID_JWT_SIGNATURE = 'Invalid JWT signature.';
const INVALID_AUTHORIZATION_HEADER =
  'Authorization header is missing or does not start with Bearer';
const UNSUPPORTED_JWT = 'Unsupported JWT token.';

const AUTH_MESSAGE = [
  INVALID_JWT_TOKEN,
  TOKEN_EXPIRED,
  INVALID_JWT_SIGNATURE,
  INVALID_AUTHORIZATION_HEADER,
  UNSUPPORTED_JWT,
];

let newAccessToken = '';
const voteType = {
  type: 'DEFAULT',
};

const tokenErrorHandler = async (baseUrl) => {
  fetch(`${baseUrl}/api/v1/reissue`, {
    method: 'POST',
    credentials: 'include',
  }).then((res) => {
    if (!res.ok) {
      this.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            action: 'fetchError',
            message: 'signin required',
          });
        });
      });
    } else {
      newAccessToken = res.json().accessToken;
    }
  });
};

const call = async (baseUrl, url, fetchNext, retry = 3) => {
  const response = await fetch(url, fetchNext);

  if (!response.ok) {
    try {
      const res = await response.json();
      // 인증 자격에 관한 오류 처리
      if (res.error !== null && AUTH_MESSAGE.includes(response.error.message)) {
        await tokenErrorHandler(baseUrl);
        // 재발급 후 재요청
        if (retry !== 0) {
          const newFetchNext = {
            ...fetchNext,
            headers: {
              ...fetchNext.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          };
          call(baseUrl, url, newFetchNext, retry - 1);
        }
      } else {
        // 인증 외 오류는 호출한 곳에서 처리
        return res;
      }
    } catch (error) {
      // HTTP 에러
      return {
        success: false,
        error: response.statusText,
      };
    }
  }

  const result = await response.json();
  return result;
};

this.addEventListener('install', () => {
  this.skipWaiting();
});

this.addEventListener('activate', (event) => {
  event.waitUntil(this.clients.claim());
});

this.addEventListener('message', async (event) => {
  const { action, data } = event.data;

  if (action === 'updateVote') {
    voteType.type = data.voteType;
  }

  if (action === 'startTimer') {
    const voteDuration = data.voteEndTime - new Date().getTime();
    setTimeout(async () => {
      const voteRes = await call(
        data.baseUrl,
        `${data.baseUrl}/api/v1/auth/agoras/${data.agoraId}/vote`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            voteType: voteType.type || 'DEFAULT',
            isOpinionVoted: 'true',
          }),
        },
      );

      if (voteRes.success === false) {
        event.source.postMessage({
          action: 'fetchError',
          message: voteRes.error,
        });
      } else {
        const result = voteRes.response;
        this.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              action: 'voteSent',
              data: result,
              newAccessToken,
            });
          });
        });
      }

      voteType.type = 'DEFAULT';

      // Set another timeout to send the GET request after an additional 5 seconds
      setTimeout(async () => {
        const voteResultRes = await call(
          data.baseUrl,
          `${data.baseUrl}/api/v1/auth/agoras/${data.agoraId}/results`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.token}`,
            },
          },
        );

        if (voteResultRes.success === false) {
          // console.log('Error fetching vote result:', res.error)
          event.source.postMessage({
            action: 'fetchError',
            message: voteResultRes.error,
          });
        } else {
          const result = voteResultRes.response;
          this.clients.matchAll().then((clients) => {
            // console.log('Sending vote result:', result);
            clients.forEach((client) => {
              client.postMessage({
                action: 'voteResult',
                result,
                newAccessToken,
              });
            });
          });
        }
      }, 5000);
    }, voteDuration);
  }
});
