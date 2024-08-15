'use client';

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorFallback from '@/app/_components/templates/ErrorFallback';
import React from 'react';
import MessageContainer from './MessageContainer';

const errorFallbackProps = {
  headerLabel: '채팅 불러오기 오류',
  btnLabel: '다시 불러오기',
};

function FallbackComponent(props: FallbackProps) {
  return <ErrorFallback {...props} {...errorFallbackProps} />;
}

type Props = {
  agoraId: string;
};

export default function ErrorBoundaryMessage({ agoraId }: Props) {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <MessageContainer agoraId={agoraId} />
    </ErrorBoundary>
  );
}
