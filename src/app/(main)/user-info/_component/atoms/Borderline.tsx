import React from 'react';

type Props = {
  className?: string;
};
export default function Borderline({ className = '' }: Props) {
  return <div className={`w-full h-6 bg-gray-400 opacity-15 ${className}`} />;
}
