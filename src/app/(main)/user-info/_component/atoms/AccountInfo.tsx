import React from 'react';

type Props = {
  label: string;
  content: string;
  className?: string;
};

export default function AccountInfo({ label, content, className }: Props) {
  return (
    <dl
      className={`flex flex-wrap justify-between items-center p-2 space-y-6 ${className}`}
      /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
      tabIndex={0}
      aria-readonly
    >
      <dt className="text-sm dark:text-white">{label}</dt>
      <dd className="text-sm dark:text-white">{content}</dd>
    </dl>
  );
}
