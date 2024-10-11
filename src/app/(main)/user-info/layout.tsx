import React from 'react';
import Header from './_component/molecules/Header';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="h-dvh w-full inset-y-full justify-center items-center">
      <Header />
      <section>{children}</section>
    </div>
  );
}
