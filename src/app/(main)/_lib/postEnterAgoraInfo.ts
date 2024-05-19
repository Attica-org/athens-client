type Props = {
  info: {
    name: string,
    id: number,
    file: string,
    role: string,
  },
  agoraId: number,
};

// eslint-disable-next-line import/prefer-default-export
export const postEnterAgoraInfo = async ({ info, agoraId }: Props) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/agoras/${agoraId}/participants`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({
      nickname: info.name,
      photo_num: info.id,
      role: info.role,
    }),
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const result = res.json().then((data) => data.response);

  return result;
};
