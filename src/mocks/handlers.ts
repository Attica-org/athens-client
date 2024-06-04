import { HttpResponse, http } from 'msw';

const delay = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

// eslint-disable-next-line import/prefer-default-export
export const handlers = [
  http.get('/api/v1/auth/agoras/:agoraId/chats', async ({ request }) => {
    delay(500);
    const url = new URL(request.url);
    const cursor = parseInt(url.searchParams.get('key') as string, 10) || 0;

    return HttpResponse.json({
      success: true,
      response: {
        chats: [
          {
            chatId: cursor + 10,
            user: {
              id: 16,
              nickname: '사용자A',
              photoNumber: 0,
              type: 'PROS',
            },
            content: '안녕하세요! 토론 시작해볼까요?',
            createdAt: '2024-05-23T21:01:21.382692',
          },
          {
            chatId: cursor + 9,
            user: {
              id: 16,
              nickname: '사용자B',
              photoNumber: 1,
              type: 'PROS',
            },
            content: '좋습니다! 먼저 시작하시죠',
            createdAt: '2024-05-23T17:18:18.976027',
          },
          {
            chatId: cursor + 8,
            user: {
              id: 16,
              nickname: '사용자C',
              photoNumber: 2,
              type: 'CONS',
            },
            content: '좋아용',
            createdAt: '2024-05-23T17:16:13.287576',
          },
          {
            chatId: cursor + 7,
            user: {
              id: 16,
              nickname: '사용자D',
              photoNumber: 3,
              type: 'CONS',
            },
            content: '코테 어렵지 않았나요? 너무 구현 문제가 많아서 시간이 오래 걸리던데',
            createdAt: '2024-05-23T16:03:15.601187',
          },
          {
            chatId: cursor + 6,
            user: {
              id: 16,
              nickname: '사용자F',
              photoNumber: 4,
              type: 'PROS',
            },
            content: '맞아요!!! 너무 시간이 부족해요',
            createdAt: '2024-05-23T16:02:35.484386',
          },
          {
            chatId: cursor + 5,
            user: {
              id: 16,
              nickname: '사용자A',
              photoNumber: 0,
              type: 'PROS',
            },
            content: '너무 힘들어요~ 미세먼지도 많고~',
            createdAt: '2024-05-23T15:59:45.284732',
          },
          {
            chatId: cursor + 4,
            user: {
              id: 16,
              nickname: '사용자B',
              photoNumber: 1,
              type: 'PROS',
            },
            content: '하하하하하하 저는 합격 기대도 안합니다.',
            createdAt: '2024-05-23T15:36:01.016162',
          },
          {
            chatId: cursor + 3,
            user: {
              id: 16,
              nickname: '사용자C',
              photoNumber: 2,
              type: 'CONS',
            },
            content: '그래도 혹시 모르는거죠!',
            createdAt: '2024-05-23T15:35:13.458079',
          },
          {
            chatId: cursor + 2,
            user: {
              id: 16,
              nickname: '사용자D',
              photoNumber: 3,
              type: 'CONS',
            },
            content: '쉬익쉬익 그럴 수가 없어요',
            createdAt: '2024-05-23T15:34:40.632097',
          },
          {
            chatId: cursor + 1,
            user: {
              id: 16,
              nickname: '사용자B',
              photoNumber: 1,
              type: 'PROS',
            },
            content: 'ㅠㅜ...',
            createdAt: '2024-05-23T14:58:11.330042',
          },
        ],
        meta: {
          key: cursor + 10,
          size: 10,
        },
      },
      error: null,
    });
  }),
  http.get('/api/v1/open/agoras', async ({ request }) => {
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
  http.get('/api/v1/open/agorasId', async () => {
    HttpResponse.json({
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
    });
  }),
  http.post('/api/v1/auth/agoras/:agoraId/participants', async () => {
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
  http.get('/api/v1/auth/agoras/:agoraId/users', async () => {
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
  http.patch('/api/v1/auth/agoras/:agoraId/start', async () => {
    delay(500);

    return HttpResponse.json({
      success: true,
      response: {
        agoraId: 1,
        startTime: '2024-05-31T12:46:26.251Z',
      },
      error: null,
    });
  }),
  http.patch('/api/v1/auth/agoras/:agoraId/end', async () => {
    delay(500);

    return HttpResponse.json({
      success: true,
      response: {
        agoraId: 1,
        endVoteCount: 2,
        isClosed: true,
      },
      error: null,
    });
  }),
  http.get('/api/v1/auth/agoraTitle', async () => {
    delay(500);

    return HttpResponse.json({
      success: true,
      response: {
        title: '소득 불평등 심화가 사회 양극화를 야기하는가?',
      },
      error: null,
    });
  }),
  http.get('/api/v1/auth/agoras/:agoraId/voteResult', async () => {
    delay(500);

    return HttpResponse.json({
      success: true,
      response: {
        pros: 8,
        cons: 2,
      },
      error: null,
    });
  }),
  http.patch('/api/v1/auth/agoras/vote', async () => {
    delay(500);

    return HttpResponse.json({
      success: true,
      response: {
        message: '투표가 완료되었습니다.',
      },
      error: null,
    });
  }),
];
