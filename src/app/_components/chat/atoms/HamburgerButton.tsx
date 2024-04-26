import HamburgerIcon from "@/assets/icons/HamburgerIcon";

type Props = {
  toggleMenu: () => void;
};

export default function HamburgerButton({ toggleMenu }: Props) {
  return (
    <div onClick={toggleMenu}>
      <HamburgerIcon className="w-22 cursor-pointer" />
    </div>
  );
}
