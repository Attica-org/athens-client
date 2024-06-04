// eslint-disable-next-line import/prefer-default-export
export const getAgoraList = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/agoras/agoraIdList`, {
    method: 'get',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const result = await res.json();

  return result.response.id;
};
