type Props = {
  title: string,
  category: string,
  color: string,
  capacity: number,
  duration: number | null,
};

// eslint-disable-next-line import/prefer-default-export
export const postCreateAgora = async (info: Props) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/agoras`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify({
      title: info.title,
      categoryId: info.category,
      color: info.color,
      capacity: info.capacity,
      duration: info.duration,
    }),
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const result = res.json().then((data) => data.response);

  return result;
};
