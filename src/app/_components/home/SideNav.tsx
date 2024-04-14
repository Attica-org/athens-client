import Image from "next/image";
import Link from "next/link";
import NavLinks from "./NavLinks";

export default function SideNav() {
  return (
    <nav className="flex flex-col flex-1 bg-red-600 h-dvh w-10pxr items-end max-w-18rem flex-grow">
      <Link href={"/"} className="flex flex-row size-">
        <Image
          src={"/favicon.ico"}
          alt={"Athens 로고"}
          width={40}
          height={40}
        />
        Athens
      </Link>
      <div>
        <NavLinks />
      </div>
    </nav>
  );
}
