import Image from "next/image";

type Props = {
  className: string;
  name?: string;
  w?: number;
  h?: number;
};

// min-w-5rem h-5rem bg-yellow-400
export default function UserImage({ className, name, w, h }: Props) {
  return (
    <div
      className={`${className} rounded-lg border-1 border-athens-gray flex justify-center items-center`}
    >
      {name && (
        <Image
          className="object-cover rounded-xl"
          src={`/img/${name}.png`}
          alt={`${name}`}
          width={w}
          height={h}
          aria-hidden
        />
      )}
    </div>
  );
}
