import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import Athens from '@/assets/icons/Athens';
import NavLinks from '../molecules/NavLinks';

export default function SideNav() {
  return (
    <nav className="lg:h-dvh flex-1 max-w-12rem flex-grow">
      <div className="hidden lg:block fixed h-dvh xl:w-12rem lg:w-12rem pl-1rem border-r-1 border-r-gray-50 dark:bg-dark-light-200 dark:border-dark-light-300">
        <div className="w-lg flex flex-col">
          <div className="flex-col">
            <Link
              prefetch
              aria-label="로고로 홈 돌아가기"
              href="/"
              className="flex flex-row items-center text-2xl pt-1rem pb-1rem p-1rem"
            >
              <Image
                src="/logo.png"
                alt="Athens 로고"
                className="mr-14"
                width={32}
                height={32}
              />
              <Athens className="w-65" />
            </Link>
            <NavLinks />
          </div>
        </div>
      </div>
      <div className="block lg:hidden w-full min-w-300 fixed bottom-0rem bg-white z-10 dark:bg-dark-light-200">
        <div className="w-lg flex flex-row justify-center items-center">
          <NavLinks />
        </div>
      </div>
    </nav>
  );
}
