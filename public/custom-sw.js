/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-48407bd3'], (function (workbox) { 'use strict';

  importScripts();
  self.skipWaiting();
  workbox.clientsClaim();
  workbox.registerRoute("/", new workbox.NetworkFirst({
    "cacheName": "start-url",
    plugins: [{
      cacheWillUpdate: async ({
        request,
        response,
        event,
        state
      }) => {
        if (response && response.type === 'opaqueredirect') {
          return new Response(response.body, {
            status: 200,
            statusText: 'OK',
            headers: response.headers
          });
        }
        return response;
      }
    }]
  }), 'GET');
  workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
    "cacheName": "dev",
    plugins: []
  }), 'GET');

}));
//# sourceMappingURL=sw.js.map

let reissueToken = '';
const tokenErrorHandler = async (response, baseUrl) => {
  const { error } = response;
  switch (error.code) {
    case 1002:
      fetch(`${baseUrl}/api/v1/reissue`, {
        method: 'POST',
        credentials: 'include',
      }).then(res => {
        if (!res.ok) {
          console.log(res);
        }
        else {
          reissueToken = res.json().accessToken;
        }
      })
      break;
    case 1201:
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/temp-user`, {
        method: 'POST',
        credentials: 'include',
      }).then(res => {
        if (!res.ok) {
          console.log(res);
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

const call = async (url, fetchNext, retry = 3, baseUrl) => {
  const response = await fetch(`${baseUrl}${url}`, fetchNext);

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

  return response.json();
}

let baseUrl = '';
let voteData = {};

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
    console.log('Base URL received:', baseUrl);
  }

  if (action === 'updateVote') {
    voteData = data;
    console.log('Vote data received:', voteData);
  }

  if (action === 'startTimer') {
    // Set a timeout to send the POST request after 15 seconds
    setTimeout(() => {
      console.log('Sending vote data:', data);
      const res = call(`/api/v1/auth/agoras/${data.agoraId}/vote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          voteType: data.voteType,
          opinionVoted: 'true'
        }),
      }, `${data.baseUrl}`)

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

      // Set another timeout to send the GET request after an additional 5 seconds
      setTimeout(() => {
        console.log('Fetching vote result:', `${data.baseUrl}/api/v1/auth/agoras/${data.agoraId}/results`, {
          method: 'GET',
          Authorization: `Bearer ${data.token}`,
        })

        const res = call(`/api/v1/auth/agoras/${data.agoraId}/results`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
          },
        }, `${baseUrl}`);

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
                action: 'voteResult',
                result: result.response,
              });
            });
          });
        }
      }, 5000);
    }, 15000);
  }
});
