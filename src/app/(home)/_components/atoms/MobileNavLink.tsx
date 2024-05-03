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
  label,
}: Props) {
  return (
    <li className="flex justify-center items-center p-10 dark:text-dark-line-semilight">
      <Link aria-label={label} href={href} className={className}>
        {children}
      </Link>
    </li>
  );
}
