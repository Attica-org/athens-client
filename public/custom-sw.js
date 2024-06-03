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
      console.log('Sending vote data to:', `${data.baseUrl}/api/v1/auth/agoras/vote`)
      fetch(`${data.baseUrl}/api/v1/auth/agoras/vote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({voteType: data.voteType}),
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
        .then(result => {
          console.log('Vote data sent:', result);
          self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({
                action: 'voteSent',
              });
            });
          });

          // Set another timeout to send the GET request after an additional 5 seconds
          setTimeout(() => {
            console.log('Fetching vote result:', `${data.baseUrl}/api/v1/auth/agoras/${data.agoraId}voteResult`, {
              method: 'GET',
              Authorization: `Bearer ${data.token}`,
            })
            fetch(`${data.baseUrl}/api/v1/auth/agoras/${data.agoraId}/voteResult`)
              .then(response => response.json())
              .then(result => {
                self.clients.matchAll().then(clients => {
                  clients.forEach(client => {
                    client.postMessage({
                      action: 'voteResult',
                      result: result.response,
                    });
                  });
                });
              });
          }, 5000);
        });
    }, 15000);
  }
});
