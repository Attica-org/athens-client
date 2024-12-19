import React from 'react';
import { callFetchWrapper } from '@/lib/fetchWrapper';
import { getSelectedAgoraQueryKey as getSelectedAgoraTags } from '@/constants/queryKey';
import MessageContainer from '../../_components/organisms/MessageContainer';

type Props = {
  params: { agora: string };
};

export async function generateMetadata({ params }: Props) {
  const agoraId = params.agora;
  let agoraTitle = '';

  const res = await callFetchWrapper(`/api/v1/open/agoras/${agoraId}/title`, {
    next: {
      tags: getSelectedAgoraTags(agoraId as string),
    },
    credentials: 'include',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok && !res.success) {
    agoraTitle = '아고라 - Athens';
  } else if (res.success) {
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

export default function Page({ params }: Props) {
  const agoraId = Number(params.agora);
  return (
    <main aria-label="채팅" className="flex flex-col justify-between h-full">
      <MessageContainer agoraId={agoraId} />
    </main>
  );
}
