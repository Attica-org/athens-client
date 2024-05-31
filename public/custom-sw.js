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
      console.log('Sending vote data:', voteData);
      console.log('Sending vote data to:', `${baseUrl}/api/v1/vote`)
      fetch(`${baseUrl}/api/v1/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({voteData}),
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
            console.log('Fetching vote result:', `${baseUrl}/api/v1/vote-result`)
            fetch(`${baseUrl}/api/v1/vote-result`)
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
