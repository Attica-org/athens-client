import React from 'react';
import AGORACATEGORY from '@/constants/agoraCategory';
import Main from '../_components/templates/Main';

type Props = {
  searchParams: { status?: string, category?: string, q?: string }
};

export async function generateMetadata({ searchParams }: Props) {
  const value = AGORACATEGORY.find((category) => category.value === searchParams.category);
  const title = searchParams.q ? `${searchParams.q} - Athens` : '';
  const category = searchParams.category ? `${value?.innerText} - Athens` : 'Athens';

  return {
    title: title || category,
    description: '실시간 익명 채팅으로 광장에서 자유롭게 이야기하세요.',
    openGraph: {
      title,
      description: '실시간 익명 채팅으로 광장에서 자유롭게 이야기하세요.',
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 300,
          height: 300,
          alt: 'Athens 로고',
        },
      ],
    },
  };
}

export default function Page({ searchParams }: Props) {
  return (
    <Main searchParams={searchParams} />
  );
}
