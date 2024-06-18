'use server';

export default async function getKey() {
  const kakaoKey = process.env.NEXT_KAKAO_API_KEY;
  const BASE_URL = process.env.NEXT_BASE_URL;
  const SOCKET_URL = process.env.NEXT_SOCKET_URL;

  return {
    kakaoKey,
    BASE_URL,
    SOCKET_URL,
  };
}
