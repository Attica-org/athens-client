let baseUrl = '';
let voteType = '';

const tokenErrorHandler = async (response, baseUrl) => {
  const { error } = response;
  switch (error.code) {
    case 1002:
      fetch(`${baseUrl}/api/v1/reissue`, {
        method: 'POST',
        credentials: 'include',
      }).then(res => {
        if (!res.ok) {
          // console.log(res);
        }
        else {
          reissueToken = res.json().accessToken;
        }
      })
      break;
    case 1201:
      fetch(`${baseUrl}/api/v1/temp-user`, {
        method: 'POST',
        credentials: 'include',
      }).then(res => {
        if (!res.ok) {
          // console.log(res);
        }
        else {
          reissueToken = res.json().response.accessToken;
        }
      });
      break;
    default:
      break;
  }
};

const call = async (url, fetchNext, retry = 3) => {
  const response = await fetch(url, fetchNext);

  if (!response.ok) {
    const res = await response.json();
    // 인증 자격에 관한 오류 처리
    if (response.status === 401) {
      await tokenErrorHandler(res);
      // 재발급 후 재요청
      if (retry !== 0) {
        call(url, fetchNext, retry - 1);
      }
    } else {
      // 인증 외 오류는 호출한 곳에서 처리
      return res;
    }
  }

  const result = await response.json();
  return result;
}

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', event => {

  const { action, data } = event.data;

  if (action === 'initialize') {
    baseUrl = event.data.baseUrl;
  }

  if (action === 'updateVote') {
    // console.log('Updating vote data:', data.voteType);
    voteType = data.voteType;
  }

  if (action === 'startTimer') {
    // Set a timeout to send the POST request after 15 seconds
    setTimeout(async () => {
      const res = await call(`${data.baseUrl}/api/v1/auth/agoras/${data.agoraId}/vote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          voteType: voteType || 'DEFAULT',
          isOpinionVoted: 'true'
        }),
      })

      if (res.success === false) {
        event.source.postMessage({
          action: 'fetchError',
          message: res.error
        });
      }
      else {
        const result = res.response;
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              action: 'voteSent',
              data: result,
            });
          });
        });
      }

      voteType = '';

      // Set another timeout to send the GET request after an additional 5 seconds
      setTimeout(async () => {
        const res = await call(`${data.baseUrl}/api/v1/auth/agoras/${data.agoraId}/results`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
          },
        });

        if (res.success === false) {
          // console.log('Error fetching vote result:', res.error)
          event.source.postMessage({
            action: 'fetchError',
            message: res.error
          });
        }
        else {
          const result = res.response;
          self.clients.matchAll().then(clients => {
            // console.log('Sending vote result:', result);
            clients.forEach(client => {
              client.postMessage({
                action: 'voteResult',
                result: result,
              });
            });
          });
        }
      }, 5000);
    }, 15000);
  }
});
