type Props = {
  agoraId: string;
};

// eslint-disable-next-line import/prefer-default-export
export const getAgoraUsers = async ({ agoraId }: Props) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/agoras/${agoraId}/end`, {
    next: {
      tags: [],
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
