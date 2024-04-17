type Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function Layout({ children, modal }: Props) {
  return (
    <div>
      {children}
      {modal}
    </div>
  );
}
