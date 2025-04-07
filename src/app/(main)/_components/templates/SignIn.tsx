import React from 'react';
import SNSLogin from '@/app/_components/molecules/SNSLogin';
import Athens from '@/assets/icons/Athens';
import Image from 'next/image';
import BackIcon from '@/assets/icons/BackIcon';
import Link from 'next/link';

type Props = {
  callbackUrl: string;
};

export default function SignIn({ callbackUrl }: Props) {
  return (
    <main
      aria-label="로그인 페이지"
      className="mx-auto tablet:w-[768px] min-h-screen w-full p-50 px-30 flex flex-col justify-around items-center"
    >
      <div className="flex w-full h-full px-10 justify-center items-center relative">
        <div className="justify-center items-center w-full h-full flex">
          <h1
            aria-label="Athens"
            className="pt-20 flex justify-center items-center gap-x-12"
          >
            <Image
              aria-hidden
              src="/athens.png"
              alt="Athens 로고"
              width={50}
              height={50}
            />
          </h1>
          <div className="relative w-full flex-1 flex flex-col ml-12 justify-start">
            <Athens className="w-85 h-85" />
            <p
              aria-label="Athens 추가설명"
              className="absolute w-full top-60 text-xs tablet:text-sm break-keep dark:text-white"
            >
              익명으로 연결된 순간, 다양한 의견을 자유롭게 나누세요.
            </p>
          </div>
        </div>
      </div>
      <section className="w-full flex flex-col justify-center items-center text-sm dark:text-dark-line text-dark-light-500">
        <div className="flex flex-col gap-y-12 w-full justify-center items-center p-10 pb-20">
          <h2 className="mb-12">SNS 계정으로 로그인</h2>
          <SNSLogin callbackUrl={callbackUrl} />
        </div>
        <Link
          href="/home"
          className="text-sm dark:text-white text-black flex mt-24"
        >
          비회원으로 둘러보기
          <BackIcon className="w-12 transform rotate-180" />
        </Link>
      </section>
    </main>
  );
}
