'use client';

import React from 'react';
import ModalBase from '@/app/_components/molecules/ModalBase';
import SocialShareLogos from '../atoms/SocialShareLogos';

export default function SocialShare() {
  return (
    <ModalBase title="공유하기" removeIcon animation>
      <SocialShareLogos />
    </ModalBase>
  );
}
