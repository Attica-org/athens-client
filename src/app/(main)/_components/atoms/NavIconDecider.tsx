'use client';

import AddIcon from '@/assets/icons/addIcon';
import HomeIcon from '@/assets/icons/homeIcon';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import {
  homeSegmentKey,
  enterAgoraSegmentKey,
  createAgoraSegmentKey,
  SegmentKeyType,
  userInfoSegmentKey,
} from '@/constants/segmentKey';
import UserIcon from '@/assets/icons/UserIcon';

type Props = {
  segment: SegmentKeyType;
  className: string;
};

export default function NavIconDecider({ segment, className }: Props) {
  const currentPath = usePathname();
  const previousPathRef = useRef<string | null>(currentPath);
  const [shouldRenderIcon, setShouldRenderIcon] = useState(false);

  useEffect(() => {
    if (currentPath === previousPathRef.current) {
      const wasSegment = previousPathRef.current === segment;
      const isSegment = currentPath === segment;
      const isEnterAgora = currentPath === enterAgoraSegmentKey;

      setShouldRenderIcon(isSegment || (wasSegment && isEnterAgora));

      previousPathRef.current = currentPath;
    }
  }, [currentPath]);

  if (segment === createAgoraSegmentKey) {
    return (
      <AddIcon
        shouldRender={currentPath === createAgoraSegmentKey || shouldRenderIcon}
        className={className}
      />
    );
  }
  if (segment === homeSegmentKey) {
    return (
      <HomeIcon
        shouldRender={currentPath === homeSegmentKey || shouldRenderIcon}
        className={className}
      />
    );
  }

  if (segment === userInfoSegmentKey) {
    return (
      <UserIcon
        shouldRender={currentPath === userInfoSegmentKey || shouldRenderIcon}
        className={className}
      />
    );
  }
}
