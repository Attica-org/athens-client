type Props = {
  innerText: string;
  isActive: boolean;
};

export default function CategoryButton({ innerText, isActive }: Props) {
  return (
    <button
      aria-label="카테고리 선택"
      className={`${
        isActive ? "bg-athens-sub" : "bg-athens-gray"
      } flex justify-center p-8 pl-1.5rem pr-1.5rem rounded-full text-xs`}
    >
      {innerText}
    </button>
  );
}
