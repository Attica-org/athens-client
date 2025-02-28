'use client';

import { useEffect } from 'react';

type Props = {
  theme: string;
};

export default function SetTheme({ theme }: Props) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return null;
}
