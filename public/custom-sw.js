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
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  ({url}) => {
    return !url.pathname.startsWith('/login');
  },
  // new RegExp('/*'),
  new workbox.strategies.NetworkFirst({
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

// this.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(CACHED_URLS);
//     }),
//   );
//   // this.skipWaiting();
// });

// const offlineData = {
//   success: false,
//   response: null,
//   error: {
//     code: 503,
//     message: '인터넷 연결이 필요합니다. 다시 시도해주세요.',
//   },
// };

// const offlineResponse = new Response(JSON.stringify(offlineData), {
//   status: 200,
//   statusText: 'OK',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// this.addEventListener('fetch', async (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       const requestUrl = new URL(event.request.url);

//       // chrome-extension 스킴을 가진 요청 제외
//       if (requestUrl.protocol === 'chrome-extension:') {
//         return fetch(event.request, { redirect: 'follow' });
//       }

//       // 네트워크 POST, PATCH 요청은 캐싱하지 않음
//       if (['POST', 'PATCH'].includes(event.request.method)) {
//         return fetch(event.request, { redirect: 'follow' }).catch(() => {
//           return offlineResponse.clone();
//         });
//       }

//       // 로그인 요청은 캐싱하지 않음
//       if (requestUrl.pathname.startsWith('/login')) {
//         return fetch(event.request).catch(() => {
//           return offlineResponse.clone();
//         });
//       }

//       // 그외 API 요청은 오프라인 상태에서의 캐싱 응답을 위해 캐싱한 후 네트워크 응답 반환
//       if (requestUrl.pathname.startsWith('/api/')) {
//         return fetch(event.request, { redirect: 'follow' })
//           .then(async (res) => {
//             const cache = await caches.open(DYNAMIC_CACHE_NAME);
//             // 캐시에 이미 같은 URL이 있다면 삭제 후 새로운 응답 캐싱 (캐시 업데이트)
//             const cachedResponse = await cache.match(event.request.url);
//             if (!isNull(cachedResponse)) {
//               await cache.delete(event.request.url);
//             }
//             await cache.put(event.request.url, res.clone());
//             return res;
//           })
//           .catch(() => {
//             // 네트워크 요청 실패 시 캐싱된 응답 반환
//             if (response) {
//               return response;
//             }
//             // 캐싱된 응답이 없다면 서비스 불가 응답 반환
//             return offlineResponse.clone();
//           });
//       }

//       // 리디렉션 응답 처리
//       if (response && response.redirected) {
//         return fetch(response.url, { redirect: 'follow' });
//       }

//       // 캐싱이 되어 있다면 캐싱된 응답을 반환
//       if (!isNull(response)) {
//         return response;
//       }

//       // 캐싱이 되어 있지 않다면 네트워크에서 가져온 응답을 반환
//       return fetch(event.request)
//         .then(async (res) => {
//           const cache = await caches.open(DYNAMIC_CACHE_NAME);
//           cache.put(event.request.url, res.clone());
//           return res;
//         })
//         .catch(() => {
//           return offlineResponse.clone();
//         });
//     }),
//   );
// });

// this.addEventListener('activate', (event) => {
//   event.waitUntil(
//     // 현재 캐시된 캐시 이름을 제외한 다른 캐시들을 삭제 (최신 캐시로 업데이트)
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (
//             cacheName !== CACHE_NAME &&
//             cacheName.startsWith('athens-cache')
//           ) {
//             return caches.delete(cacheName);
//           }
//           return null;
//         }),
//       );
//     }),
//     this.clients.claim(),
//   );
// });

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
