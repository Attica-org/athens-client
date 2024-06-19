'use client';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/app/_components/templates/ErrorFallback';
import Message from "../molecules/Message";

const errorFallbackProps = {
    headerLabel: '채팅 불러오기 오류',
    btnLabel: '다시 불러오기',
  }

export default function ErrorBoundaryMessage() {
    return (
    <ErrorBoundary FallbackComponent={(props) => <ErrorFallback {...props} {...errorFallbackProps}/>}>
        <Message />
    </ErrorBoundary>
    )
}