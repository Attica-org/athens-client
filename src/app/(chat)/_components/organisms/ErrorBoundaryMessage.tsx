'use client';

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorFallback from '@/app/_components/templates/ErrorFallback';
import React from 'react';
import Message from '../molecules/Message';

const errorFallbackProps = {
  headerLabel: '채팅 불러오기 오류',
  btnLabel: '다시 불러오기',
};

function FallbackComponent(props: FallbackProps) {
  return <ErrorFallback {...props} {...errorFallbackProps} />;
}

export default function ErrorBoundaryMessage() {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <Message />
    </ErrorBoundary>
  );
}
