/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { QueryFunction } from '@tanstack/react-query';

type VoteResult = {
  id: number,
  prosCount: number;
  consCount: number;
};

// eslint-disable-next-line import/prefer-default-export
export const getVoteResult: QueryFunction<
VoteResult, [string, string, string]
> = async ({ queryKey }) => {
  const [_1, agoraId] = queryKey;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/agoras/${agoraId}/voteResult`, {
    next: {
      tags: ['agora', agoraId, 'closed'],
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

  const result = res.json().then((data) => data.response);

  return result;
};
