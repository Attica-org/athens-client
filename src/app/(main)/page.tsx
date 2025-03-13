import React from 'react';
import { getSession } from '@/serverActions/auth';
import { redirect } from 'next/navigation';
import isNull from '@/utils/validation/validateIsNull';
import { homeSegmentKey } from '@/constants/segmentKey';
import SignIn from './_components/templates/SignIn';

export async function generateMetadata() {
  return {
    title: 'Athens',
    description: '실시간 익명 채팅으로 광장에서 자유롭게 이야기하세요.',
    openGraph: {
      title: 'Athens',
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

export default async function Page() {
  const session = await getSession();

  if (!isNull(session?.user)) {
    redirect(`${process.env.NEXT_CLIENT_URL}/${homeSegmentKey}`);
    return null;
  }

  return <SignIn />;
}
