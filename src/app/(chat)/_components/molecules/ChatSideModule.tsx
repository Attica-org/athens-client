import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function ChatSideModule({ title, children }: Props) {
  return (
    <div className="flex flex-col pb-2rem w-full">
      <h2 className="pb-1rem foldable:text-base text-sm font-semibold dark:text-white">
        {title}
      </h2>
      {children}
    </div>
  );
}
