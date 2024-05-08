import { HttpResponse, http } from 'msw';

const delay = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

// eslint-disable-next-line import/prefer-default-export
export const handlers = [
  http.get('/api/v1/agoras', async ({ request }) => {
    delay(500);
    const url = new URL(request.url);
    // const status = url.searchParams.get('status');
    // const category = url.searchParams.get('category');
    const cursor = parseInt(url.searchParams.get('cursor') as string, 10) || 0;

    return HttpResponse.json([
      {
        id: cursor + 1,
        agoraTitle: '소득 불평등 심화가 사회 양극화를 야기하는가?',
        agoraColor: 'bg-yellow-400',
        participants: {
          pros: 10,
          cons: 10,
          observer: 10,
        },
        status: 'queued',
      },
      {
        id: cursor + 2,
        agoraTitle: '인공지능 기술의 발전이 사회의 일자리를 빼앗는가?',
        agoraColor: 'bg-yellow-400',
        participants: {
          pros: 10,
          cons: 10,
          observer: 10,
        },
        status: 'running',
      },
      {
        id: cursor + 3,
        agoraTitle: '소득 불평등 심화가 사회 양극화를 야기하는가?',
        agoraColor: 'bg-yellow-400',
        participants: {
          pros: 10,
          cons: 10,
          observer: 10,
        },
        status: 'queued',
      },
      {
        id: cursor + 4,
        agoraTitle: '인공지능 기술의 발전이 사회의 일자리를 빼앗는가?',
        agoraColor: 'bg-yellow-400',
        participants: {
          pros: 10,
          cons: 10,
          observer: 10,
        },
        status: 'running',
      },
    ]);
  }),
];
