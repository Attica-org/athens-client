/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { AgoraUser } from '@/app/model/AgoraUser';
import { QueryFunction } from '@tanstack/react-query';

// eslint-disable-next-line import/prefer-default-export
export const getAgoraUsers: QueryFunction<
AgoraUser[], [string, string, string]
> = async ({ queryKey }) => {
  const [_1, _2, agoraId] = queryKey;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/agoras/${agoraId}/users`, {
    next: {
      tags: ['chat', 'users', `${agoraId}`],
    },
    credentials: 'include',
    cache: 'no-cache',
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const result = res.json().then((data) => data.response.participants);

  return result;
};
