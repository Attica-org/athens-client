'use client';

import { useDarkMode } from '@/store/darkMode';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  className: string;
};

function HomeIcon({ className }: Props) {
  const currentPath = usePathname().split('/');
  const { darkMode } = useDarkMode();
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const previousPathRef = useRef<string | null>(
    currentPath[currentPath.length - 1],
  );
  const [shouldRenderIcon, setShouldRenderIcon] = useState(false);

  useEffect(() => {
    setIsDarkMode(darkMode);
  }, [darkMode]);

  useEffect(() => {
    const path = currentPath[currentPath.length - 1];
    if (path === previousPathRef.current) {
      const wasCreateAgora = previousPathRef.current === 'home';
      const isCreateAgora = path === 'home';
      const isEnterAgora = path === '/enter-agora';

      setShouldRenderIcon(isCreateAgora || (wasCreateAgora && isEnterAgora));

      previousPathRef.current = path;
    }
  }, [currentPath]);

  if (currentPath[currentPath.length - 1] === 'home' || shouldRenderIcon) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <g>
          <path
            fill={isDarkMode ? '#E9E9E9' : '#282828'}
            d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"
          />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <g>
        <path
          fill={isDarkMode ? '#A6A6A6' : '#282828'}
          d="M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z"
        />
      </g>
    </svg>
  );
}

export default HomeIcon;
