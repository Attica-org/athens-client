const DB_NAME = 'TabDatabase';
const STORE_NAME = 'Tabs';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function getTabIds() {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

function transactionComplete(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = (event) => {
      reject(event.target.error);
    };
    transaction.onabort = (event) => {
      reject(event.target.error);
    };
  });
}

let baseUrl = '';
let voteType = '';
let tabVotes = {};

const tokenErrorHandler = async (response, baseUrl) => {
  const { error } = response;
  switch (error.code) {
    case 1002:
      fetch(`${baseUrl}/api/v1/reissue`, {
        method: 'POST',
        credentials: 'include',
      }).then((res) => {
        if (!res.ok) {
          // console.log(res);
        } else {
          reissueToken = res.json().accessToken;
        }
      });
      break;
    case 1201:
      fetch(`${baseUrl}/api/v1/temp-user`, {
        method: 'POST',
        credentials: 'include',
      }).then((res) => {
        if (!res.ok) {
          // console.log(res);
        } else {
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
};

async function loadTabVotesFromDB() {
  const tabIds = await getTabIds();
  tabIds.forEach((tab) => {
    tabVotes[tab.id] = { voteType: '' };
  });
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', async (event) => {
  const { action, data } = event.data;

  if (action === 'initialize') {
    if (event.data.baseUrl) {
      baseUrl = event.data.baseUrl;
    }

    if (!Object.keys(tabVotes).length) {
      await loadTabVotesFromDB();
    }

    tabVotes = {
      ...tabVotes,
      [event.data.tabId]: { voteType: '' },
    };
  }

  if (action === 'updateVote') {
    tabVotes[event.data.tabId].voteType = data.voteType;
  }

  if (action === 'startTimer') {
    // Set a timeout to send the POST request after 15 seconds
    const voteDuration = data.voteEndTime - new Date().getTime();
    setTimeout(async () => {
      const res = await call(
        `${data.baseUrl}/api/v1/auth/agoras/${data.agoraId}/vote`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            voteType: tabVotes[event.data.tabId].voteType || 'DEFAULT',
            isOpinionVoted: 'true',
          }),
        },
      );

      if (res.success === false) {
        event.source.postMessage({
          action: 'fetchError',
          message: res.error,
          tabId: event.data.tabId,
        });
      } else {
        const result = res.response;
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              action: 'voteSent',
              data: result,
              tabId: event.data.tabId,
            });
          });
        });
      }

      tabVotes[event.data.tabId].voteType = '';

      // Set another timeout to send the GET request after an additional 5 seconds
      setTimeout(async () => {
        const res = await call(
          `${data.baseUrl}/api/v1/auth/agoras/${data.agoraId}/results`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.token}`,
            },
          },
        );

        if (res.success === false) {
          // console.log('Error fetching vote result:', res.error)
          event.source.postMessage({
            action: 'fetchError',
            message: res.error,
            tabId: event.data.tabId,
          });
        } else {
          const result = res.response;
          self.clients.matchAll().then((clients) => {
            // console.log('Sending vote result:', result);
            clients.forEach((client) => {
              client.postMessage({
                action: 'voteResult',
                result,
                tabId: event.data.tabId,
              });
            });
          });
        }
      }, 5000);
    }, voteDuration);
  }
});
