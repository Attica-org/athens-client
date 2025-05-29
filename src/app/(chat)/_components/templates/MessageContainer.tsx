import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import React from 'react';
import { getChatMessagesQueryKey } from '@/constants/queryKey';
import { AgoraId } from '@/app/model/Agora';
import { getChatMessagesServer } from '../../_lib/getChatMessagesServer';
import ErrorBoundaryMessage from '../organisms/ErrorBoundaryMessage';

type MessageContainerProps = {
  agoraId: AgoraId;
};

// 서버 컴포넌트
export default async function MessageContainer({
  agoraId,
}: MessageContainerProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: getChatMessagesQueryKey(agoraId),
    queryFn: getChatMessagesServer,
    initialPageParam: { meta: { key: null, effectiveSize: 20 } },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ErrorBoundaryMessage />
    </HydrationBoundary>
  );
}
