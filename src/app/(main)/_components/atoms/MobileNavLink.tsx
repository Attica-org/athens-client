import Link from 'next/link';
import React from 'react';

type Props = {
  className: string;
  href: string;
  children: React.ReactNode;
  label?: string;
};

export default function MobileNavLink({
  className,
  href,
  children,
  label = '경로 이동',
}: Props) {
  return (
    <li className="flex justify-center items-center p-10 dark:text-dark-line-semilight">
      <Link prefetch aria-label={label} href={href} className={className}>
        {children}
      </Link>
    </li>
  );
}
