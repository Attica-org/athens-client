type Position = "con" | "pro" | "watcher";

type Props = {
  selectedPosition: string;
  position: Position;
  onClick: (position: Position) => void;
  color: string;
  children: React.ReactNode;
};

export default function ModalPosSelectBtn({
  selectedPosition,
  onClick,
  position,
  color,
  children,
}: Props) {
  return (
    <button
      onClick={() => onClick(position)}
      className={`p-5 mobile:pr-1rem mobile:pl-1rem pr-10 pl-10 ${
        selectedPosition === position
          ? `text-white bg-${color}-400`
          : `text-${color}-400 bg-white`
      } rounded-xl mr-7 text-xs tablet:text-sm`}
    >
      {children}
    </button>
  );
}
