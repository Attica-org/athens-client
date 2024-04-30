"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
  innerText: string;
};

export default function DesktopNavLink({
  className,
  href,
  children,
  innerText,
}: Props) {
  let segment = usePathname();

  return (
    <li>
      <Link href={href} className={className}>
        <div className="hover:bg-gray-100 h-3rem p-1rem inline-flex flex-row justify-center items-center mb-1rem rounded-full">
          {children}
          <span
            className={`pl-1rem text-sm ${
              segment === `${href}` ? "font-bold" : ""
            }`}
          >
            {innerText}
          </span>
        </div>
      </Link>
    </li>
  );
}
