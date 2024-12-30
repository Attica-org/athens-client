import Link from 'next/link';
import React from 'react';

type Props = {
  className: string;
  href: string;
  children: React.ReactNode;
  label?: string;
};

function MobileNavLink({
  className,
  href,
  children,
  label = '경로 이동',
}: Props) {
  return (
    <li className="flex flex-1 justify-center items-center p-10 dark:text-dark-line-semilight">
      <Link prefetch aria-label={label} href={href} className={className}>
        {children}
      </Link>
    </li>
  );
}

export default React.memo(MobileNavLink);
