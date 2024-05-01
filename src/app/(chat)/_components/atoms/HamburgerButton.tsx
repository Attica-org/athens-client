import HamburgerIcon from "@/assets/icons/HamburgerIcon";

type Props = {
  toggleMenu: () => void;
};

export default function HamburgerButton({ toggleMenu }: Props) {
  return (
    <button aria-label="메뉴 열기" onClick={toggleMenu}>
      <HamburgerIcon className="w-22 cursor-pointer" />
    </button>
  );
}
