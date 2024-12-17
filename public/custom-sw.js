importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js',
);

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

const CACHE = 'athens-cache-v1';
const offlineFallbackPage = 'offline.html';

// offlineFallbackPage를 캐싱
this.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage)),
  );
});

// Workbox로 네비게이션 요청 처리
if (this.workbox.navigationPreload.isSupported()) {
  this.workbox.navigationPreload.enable();
}

this.workbox.routing.registerRoute(
  '/api/v1/auth/reissue',
  new this.workbox.strategies.NetworkOnly({
    plugins: [], // 추가 플러그인 비활성화
  }),
);

this.workbox.routing.registerRoute(
  ({ url }) => {
    return !url.pathname.startsWith('/login');
  },
  // new RegExp('/*'),
  new this.workbox.strategies.NetworkFirst({
    cacheName: CACHE,
    maxAgeSeconds: 5 * 24 * 60 * 60, // 5일간만 유지
  }),
);

let newAccessToken = '';
const voteType = {
  type: 'DEFAULT',
};

const isNull = (value) => {
  return value === null || value === undefined || value === '';
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
      if (!isNull(res.error) && AUTH_MESSAGE.includes(response.error.message)) {
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

// fetch 이벤트 처리 (pwabuilder 기본 로직 사용)
this.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;
          if (preloadResp) return preloadResp;

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })(),
    );
  }
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
