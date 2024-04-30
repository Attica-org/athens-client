type Props = {
  innerText: string;
  isActive: boolean;
};

export default function CategoryButton({ innerText, isActive }: Props) {
  return (
    <button
      className={`${
        isActive ? "bg-athens-sub" : "bg-athens-gray"
      } flex justify-center p-10 pl-1.5rem pr-1.5rem rounded-full text-xs`}
    >
      {innerText}
    </button>
  );
}
