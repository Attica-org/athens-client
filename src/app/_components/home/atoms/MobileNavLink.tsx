import Link from "next/link";

type Props = {
  className: string;
  href: string;
  children: React.ReactNode;
};

export default function MobileNavLink({ className, href, children }: Props) {
  return (
    <li className="flex justify-center items-center p-10">
      <Link href={href} className={className}>
        {children}
      </Link>
    </li>
  );
}
