import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="lg:flex overflow-x-hidden xl:w-[1580px] w-full">
      {children}
    </div>
  );
}
