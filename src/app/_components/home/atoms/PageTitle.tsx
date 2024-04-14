type Props = {
  title: string;
  desc: string;
  children?: React.ReactNode;
};

export default function PageTitle({ title, desc, children }: Props) {
  return (
    <>
      <h1 className="text-xl font-semibold w-full flex justify-start items-center">
        {title}
      </h1>
      <div className="flex justify-between items-center">
        <p className="mt-1rem text-sm text-gray-700 mb-1rem">{desc}</p>
        {children}
      </div>
    </>
  );
}
