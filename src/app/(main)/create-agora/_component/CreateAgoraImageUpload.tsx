'use client';

import AgoraImageUpload from '@/app/_components/organisms/AgoraImageUpload';
import { useAgoraImageSync } from '@/hooks/useAgoraImageSync';
import React from 'react';

export default function CreateAgoraImageUpload() {
  useAgoraImageSync();
  return <AgoraImageUpload />;
}
