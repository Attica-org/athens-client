import { redirect } from 'next/navigation';

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
          url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/logo.png`,
          width: 630,
          height: 630,
          alt: 'Athens 로고',
        },
      ],
    },
  };
}

export default async function Page() {
  redirect('/home');
  return null;
}
