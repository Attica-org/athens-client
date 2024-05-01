import Link from "next/link";

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
    <li className="flex justify-center items-center p-10">
      <Link aria-label={label} href={href} className={className}>
        {children}
      </Link>
    </li>
  );
}
