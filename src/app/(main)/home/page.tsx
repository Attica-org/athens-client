import React from 'react';
import { SearchParams } from '@/app/model/Agora';
import { AGORACATEGORY } from '@/constants/consts';
import { isValidCategoryKey } from '@/utils/validation/validateCategoryKey';
import Main from '../_components/templates/Main';

type Props = {
  searchParams: SearchParams;
};

export async function generateMetadata({ searchParams }: Props) {
  const categoryKey = searchParams.category || '1';
  let value = Object.assign(AGORACATEGORY['1']);

  if (isValidCategoryKey(categoryKey)) {
    value = AGORACATEGORY[categoryKey];
  }

  const title = searchParams.q ? `${searchParams.q} - Athens` : '';
  const category = searchParams.category
    ? `${value?.innerText} - Athens`
    : 'Athens';

  return {
    title: title || category,
    description: '실시간 익명 채팅으로 광장에서 자유롭게 이야기하세요.',
    openGraph: {
      title,
      description: '실시간 익명 채팅으로 광장에서 자유롭게 이야기하세요.',
      type: 'website',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/opengraph.png`,
          width: 1200,
          height: 630,
          alt: 'Athens 로고',
        },
      ],
    },
  };
}

export default function Page({ searchParams }: Props) {
  return <Main searchParams={searchParams} />;
}
