import Athens from '@/assets/icons/Athens';
import Image from 'next/image';
import React from 'react';
import SNSLogin from '../_components/molecules/SNSLogin';

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
  return (
    <main className="mx-auto tablet:w-[768px] min-h-screen w-full p-50 flex flex-col justify-around items-center">
      <div className="flex w-full h-full justify-center items-center relative">
        <div className="justify-center items-center w-full h-full flex">
          <h1
            aria-label="Athens"
            className="pt-20 flex justify-center items-center gap-x-12"
          >
            <Image src="/athens.png" alt="Athens 로고" width={50} height={50} />
          </h1>
          <div className="relative w-full flex-1 flex flex-col ml-12 justify-start">
            <Athens className="w-85 h-85" />
            <p className="absolute w-full top-60 text-xs tablet:text-sm break-keep dark:text-white">
              익명으로 연결된 순간, 다양한 의견을 자유롭게 나누세요.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-y-12 justify-center items-center">
        <div className="text-sm dark:text-dark-line text-dark-light-500 p-10 pb-20">
          SNS 계정으로 로그인
        </div>
        <SNSLogin />
      </div>
    </main>
  );
}
