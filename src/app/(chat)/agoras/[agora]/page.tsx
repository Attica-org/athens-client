import fetchWrapper from '@/lib/fetchWrapper';
import { headers } from 'next/headers';
import React from 'react';
import ErrorBoundaryMessage from '../../_components/organisms/ErrorBoundaryMessage';

export async function generateMetadata() {
  const agoraId = headers().get('x-pathname')?.split('/').pop();
  let agoraTitle = '';
  const res = await fetchWrapper.call(`/api/v1/open/agoras/${agoraId}/title`, {
    next: {
      tags: [`${agoraId}`, 'agoraTitle'],
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (res.success === false) {
    agoraTitle = '아고라 - Athens';
  } else {
    const result = res.response;
    agoraTitle = `${result.title} - Athens`;
  }

  return {
    title: agoraTitle,
    description: '익명으로 토론에 참여하세요.',
    openGraph: {
      title: agoraTitle,
      description: '익명으로 토론에 참여하세요.',
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

type Props = {
  params: {
    agora: string;
  };
};

export default function Page({ params }: Props) {
  return (
    <main aria-label="채팅" className="flex flex-col justify-between h-full">
      <ErrorBoundaryMessage agoraId={params.agora} />
    </main>
  );
}
