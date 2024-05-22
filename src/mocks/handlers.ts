import { HttpResponse, http } from 'msw';

const delay = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

// eslint-disable-next-line import/prefer-default-export
export const handlers = [
  http.get('/api/v1/agoras', async ({ request }) => {
    delay(500);
    const url = new URL(request.url);
    const cursor = parseInt(url.searchParams.get('next') as string, 10) || 0;

    return HttpResponse.json({
      success: true,
      response: {
        agoras: [
          {
            id: cursor * 8 + 1,
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
            id: cursor * 8 + 2,
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
            id: cursor * 8 + 3,
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
            id: cursor * 8 + 4,
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
          {
            id: cursor * 8 + 5,
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
            id: cursor * 8 + 6,
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
            id: cursor * 8 + 7,
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
            id: cursor * 8 + 8,
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
  http.get('/api/v1/agoras/:agoraId/users', async () => {
    delay(500);

    return HttpResponse.json({
      success: true,
      response: {
        agoraId: 1,
        participants: [
          {
            id: 1,
            nickname: 'EnvironmentalActivist',
            photoNumber: 1,
            type: 'PROS',
          },
          {
            id: 2,
            nickname: 'BusinessLeader',
            photoNumber: 2,
            type: 'CONS',
          },
          {
            id: 3,
            nickname: 'PolicyExpert',
            photoNumber: 3,
            type: 'OBSERVER',
          },
          {
            id: 16,
            nickname: 'dd',
            photoNumber: 1,
            type: 'PROS',
          },
        ],
      },
      error: null,
    });
  }),
  http.get('/api/v1/agoras/:agoraId/chats', async () => {
    HttpResponse.json({
      agoraId: 1,
      chats: [
        {
          chatId: 22,
          user: {
            id: 16,
            nickname: 'dd',
            photoNumber: 1,
            agoraUserType: 'PROS',
          },
          content: 'ha ha yo',
          createdAt: '2024-05-20T21:03:02.470432',
        },
        {
          chatId: 21,
          user: {
            id: 16,
            nickname: 'dd',
            photoNumber: 1,
            agoraUserType: 'PROS',
          },
          content: 'hey yo',
          createdAt: '2024-05-20T21:02:56.182039',
        },
        {
          chatId: 20,
          user: {
            id: 16,
            nickname: 'dd',
            photoNumber: 1,
            agoraUserType: 'PROS',
          },
          content: 'hihi',
          createdAt: '2024-05-20T21:02:51.196496',
        },
        {
          chatId: 19,
          user: {
            id: 16,
            nickname: 'dd',
            photoNumber: 1,
            agoraUserType: 'PROS',
          },
          content: 'hihi',
          createdAt: '2024-05-20T21:02:48.942878',
        },
        {
          chatId: 18,
          user: {
            id: 16,
            nickname: 'dd',
            photoNumber: 1,
            agoraUserType: 'PROS',
          },
          content: 'hihi',
          createdAt: '2024-05-20T20:39:51.957223',
        },
        {
          chatId: 17,
          user: {
            id: 16,
            nickname: 'dd',
            photoNumber: 1,
            agoraUserType: 'PROS',
          },
          content: 'nicetoMeetyou',
          createdAt: '2024-05-20T15:33:42.603558',
        },
        {
          chatId: 16,
          user: {
            id: 16,
            nickname: 'dd',
            photoNumber: 1,
            agoraUserType: 'PROS',
          },
          content: 'hi',
          createdAt: '2024-05-20T15:33:34.023178',
        },
        {
          chatId: 3,
          user: {
            id: 3,
            nickname: 'PolicyExpert',
            photoNumber: 3,
            agoraUserType: 'OBSERVER',
          },
          content: '양측의 입장을 고려하여 균형 잡힌 정책을 수립해야 할 것 같습니다.',
          createdAt: '2024-05-21T00:24:43',
        },
        {
          chatId: 2,
          user: {
            id: 2,
            nickname: 'BusinessLeader',
            photoNumber: 2,
            agoraUserType: 'CONS',
          },
          content: '그렇게 되면 경제에 타격이 갈 것입니다. 현실적인 대안이 필요합니다.',
          createdAt: '2024-05-21T00:24:43',
        },
        {
          chatId: 1,
          user: {
            id: 1,
            nickname: 'EnvironmentalActivist',
            photoNumber: 1,
            agoraUserType: 'PROS',
          },
          content: '기후 변화 대책으로 화석 연료 사용을 점진적으로 중단해야 합니다.',
          createdAt: '2024-05-21T00:24:43',
        },
      ],
      meta: {
        key: 1,
        effectiveSize: 10,
      },
    });
  }),
];
