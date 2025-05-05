import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Athens from '@/assets/icons/Athens';
import NavLinks from '../molecules/NavLinks';

function DesktopNav() {
  return (
    <div className="hidden lg:block fixed h-dvh xl:w-12rem lg:w-12rem pl-1rem border-r-1 border-r-gray-50 bg-white dark:bg-dark-light-300 dark:border-dark-light-300">
      <div className="w-lg flex flex-col">
        <div className="flex-col">
          <Link
            prefetch
            href="/"
            className="flex flex-row items-center text-2xl pt-1rem pb-1rem p-1rem"
          >
            <Image
              src="/logo.png"
              alt="Athens 로고"
              aria-label="홈으로 돌아가기"
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
  );
}

export default DesktopNav;
