import React from 'react';

type Props = {
  label: string;
  content: string;
  className?: string;
};
export default function AccountInfo({ label, content, className }: Props) {
  return (
    <div
      className={`flex flex-wrap justify-between p-2 space-y-6 ${className}`}
    >
      <span className="text-sm dark:text-white">{label}</span>
      <span className="text-sm dark:text-white">{content}</span>
    </div>
  );
}
