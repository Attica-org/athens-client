import { HttpResponse, http } from 'msw';

const delay = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

// eslint-disable-next-line import/prefer-default-export
export const handlers = [
  http.get('/api/v1/agoras', async ({ request }) => {
    delay(1000);
    const url = new URL(request.url);
    const cursor = parseInt(url.searchParams.get('next') as string, 10) || 0;

    return HttpResponse.json({
      success: true,
      response: {
        agoras: [
          {
            id: cursor * 4 + 1,
            agoraTitle: '소득 불평등 심화가 사회 양극화를 야기하는가?',
            agoraColor: 'agora-point-color3',
            participants: {
              pros: 10,
              cons: 10,
              observer: 10,
            },
            createdAt: '2024-04-18T10:30:00Z',
            status: 'queued',
          },
          {
            id: cursor * 4 + 2,
            agoraTitle: '인공지능 기술의 발전이 사회의 일자리를 빼앗는가?',
            agoraColor: 'agora-point-color4',
            participants: {
              pros: 10,
              cons: 10,
              observer: 10,
            },
            createdAt: '2024-04-18T10:30:00Z',
            status: 'running',
          },
          {
            id: cursor * 4 + 3,
            agoraTitle: '소득 불평등 심화가 사회 양극화를 야기하는가?',
            agoraColor: 'agora-point-color1',
            participants: {
              pros: 10,
              cons: 10,
              observer: 10,
            },
            createdAt: '2024-04-18T10:30:00Z',
            status: 'queued',
          },
          {
            id: cursor * 4 + 4,
            agoraTitle: '인공지능 기술의 발전이 사회의 일자리를 빼앗는가?',
            agoraColor: 'agora-point-color2',
            participants: {
              pros: 10,
              cons: 10,
              observer: 10,
            },
            createdAt: '2024-04-18T10:30:00Z',
            status: 'running',
          },
        ],
        next: cursor + 1,
        hasNext: true,
      },
    });
  }),
  http.get('/api/v1/agorasId', async () => HttpResponse.json({
    success: true,
    response: {
      agoras: [
        { id: '5f9f1b9b9c9d1b0b8c8b4568', updatedAt: '2024-04-18T10:30:00Z' },
        { id: '5f9f1b9b9c9d1b0b8c8b4569', updatedAt: '2024-04-18T10:30:00Z' },
        { id: '5f9f1b9b9c9d1b0b8c8b4570', updatedAt: '2024-04-18T10:30:00Z' },
        { id: '5f9f1b9b9c9d1b0b8c8b4571', updatedAt: '2024-04-18T10:30:00Z' },
      ],
    },
    error: null,
  })),
  http.post('/api/v1/agoras/:agoraId/participants', async () => {
    delay(500);

    return HttpResponse.json({
      success: true,
      response: {
        participant_id: '5f9f1b9b9c9d1b0b8c8b4567',
        agoraId: '5f9f1b9b9c9d1b0b8c8b4568',
        userId: 'abcdef1234567890',
        role: 'pros',
      },
      // {
      //   "success": false,
      //   "response": null,
      //   "error": {
      //     "code": "INVALID_ROLE",
      //     "message": "Invalid role selected. Please choose from 'pros', 'cons', or 'observer'."
      //   }
      // }
    });
  }),
  http.post('/api/v1/agoras', async () => {
    delay(1500);

    return HttpResponse.json({
      success: true,
      response: {
        id: 2,
      },
    });
  }),
];
