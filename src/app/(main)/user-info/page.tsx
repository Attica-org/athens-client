import React from 'react';
import UserInfoMain from './_component/organisms/UserInfoMain';

export async function generateMetadata() {
  return {
    title: '사용자 정보',
    description:
      '사용자 정보를 확인하거나 로그아웃 및 회원 탈퇴를 이용할 수 있어요.',
    openGraph: {
      title: '사용자 정보',
      description:
        '사용자 정보를 확인하거나 로그아웃 및 회원 탈퇴를 이용할 수 있어요.',
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

export default function Page() {
  return <UserInfoMain />;
}
