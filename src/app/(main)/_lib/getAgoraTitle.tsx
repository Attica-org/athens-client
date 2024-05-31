/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { QueryFunction } from '@tanstack/react-query';

// eslint-disable-next-line import/prefer-default-export
export const getAgoraTitle:QueryFunction<
string, [_1: string, _2: string]> = async ({ queryKey }) => {
  const [agoraId, _] = queryKey;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/agoraTitle`, {
    next: {
      tags: [`${agoraId}`, 'agoraTitle'],
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const result = res.json().then((data) => data.response.title);

  return result;
};
