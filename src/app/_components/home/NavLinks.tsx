import Link from "next/link";

export default function NavLinks() {
  return (
    <ul>
      <li>
        <Link href={"/"}>홈</Link>
      </li>
      <li>
        <Link href={"/create-agora"}>아고라 생성</Link>
      </li>
    </ul>
  );
}
