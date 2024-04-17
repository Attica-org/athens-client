type Props = {
  children: React.ReactNode;
  createAgora: React.ReactNode;
};

export default function Layout({ children, createAgora }: Props) {
  return (
    <div>
      {children}
      {createAgora}
    </div>
  );
}
