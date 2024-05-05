import { HttpResponse, http } from 'msw';

const User = [
  { id: 'elonmusk', nickname: 'Elon Musk', image: '/yRsRRjGO.jpg' },
  { id: 'zeroch0', nickname: '제로초', image: '/5Udwvqim.jpg' },
];

// eslint-disable-next-line import/prefer-default-export
export const handlers = [
  http.post('/api/login', () => HttpResponse.json(User[0], {
    headers: {
      'Set-Cookie': 'connect.sid=msw-cookie;HttpOnly;Path=/',
    },
  })),
];
