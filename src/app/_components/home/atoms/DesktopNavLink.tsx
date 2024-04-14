import Link from "next/link";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export default function DesktopNavLink({ className, href, children }: Props) {
  return (
    <li>
      <Link href={href} className={className}>
        {children}
      </Link>
    </li>
  );
}
