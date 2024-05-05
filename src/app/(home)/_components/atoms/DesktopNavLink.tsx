'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
  innerText: string;
  label?: string;
};

export default function DesktopNavLink({
  className = '',
  href,
  children,
  innerText,
  label = '경로 이동',
}: Props) {
  const segment = usePathname();

  return (
    <li>
      <Link aria-label={label} href={href} className={className}>
        <div className="hover:bg-gray-100 dark:hover:bg-dark-light-300 h-3rem p-1rem inline-flex flex-row justify-center items-center mb-1rem rounded-full">
          {children}
          <span
            className={`pl-1rem text-sm dark:text-dark-line-semilight ${
              segment === `${href}` ? 'font-bold' : ''
            }`}
          >
            {innerText}
          </span>
        </div>
      </Link>
    </li>
  );
}
