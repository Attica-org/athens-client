import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from '@tanstack/react-query';

import React from 'react';
import { getChatMessagesQueryKey } from '@/constants/queryKey';
import { getChatMessages } from '../../_lib/getChatMessages';
import Message from '../molecules/Message';

type Props = {
  agoraId: number;
};

// 서버 컴포넌트
export default async function MessageContainer({ agoraId }: Props) {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: getChatMessagesQueryKey(agoraId),
    queryFn: getChatMessages,
    initialPageParam: { meta: { key: null, effectiveSize: 20 } },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Message />
    </HydrationBoundary>
  );
}
