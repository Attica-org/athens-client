'use client';

import { Message as IMessage } from '@/app/model/Message';
import React, { useEffect, useRef, useState } from 'react';
import {
  InfiniteData, useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { useMessageStore } from '@/store/message';
import MyMessage from '../atoms/MyMessage';
import YourMessage from '../atoms/YourMessage';
import { getChatMessages } from '../../_lib/getChatMessages';
import ChatNotification from '../atoms/ChatNotification';

interface Meta {
  key: number | null;
  effectiveSize: number;
}

export default function Message() {
  const [pageRendered, setPageRendered] = useState(false);
  const [adjustScroll, setAdjustScroll] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const { shouldGoDown, setGoDown } = useMessageStore();
  const myRole = 'CONS';
  const agoraId = usePathname().split('/').pop();

  const {
    data, hasPreviousPage, isFetching, fetchPreviousPage,
  } = useSuspenseInfiniteQuery<
  { chats: IMessage[], meta: Meta },
  Object,
  InfiniteData<{ chats: IMessage[], meta: Meta }
  >, [_1: string, _2: string, _3: string], { meta: Meta }>({
    queryKey: ['chat', `${agoraId}`, 'messages'],
    queryFn: getChatMessages,
    staleTime: 60 * 1000,
    gcTime: 500 * 1000,
    initialPageParam: { meta: { key: null, effectiveSize: 20 } },
    getPreviousPageParam: (firstPage) => (
      firstPage.meta.key !== -1 ? { meta: firstPage.meta } : undefined
    ),
    getNextPageParam: (lastPage) => (
      lastPage.meta.key !== -1 ? { meta: lastPage.meta } : undefined
    ),
  });

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasPreviousPage && !isFetching && !adjustScroll) {
      const prevHeight = listRef.current?.scrollHeight || 0;
      setAdjustScroll(() => true);

      fetchPreviousPage()
        .then(() => {
          setTimeout(() => {
            if (listRef.current) {
              const moveScroll = listRef.current.scrollHeight - prevHeight;
              listRef.current.scrollTop = moveScroll;
            }
            setAdjustScroll(false);
          }, 0);
        });
    }
  }, [inView, fetchPreviousPage, isFetching, hasPreviousPage, adjustScroll]);

  const hasMessage = data?.pages[0].chats.length > 0;
  useEffect(() => {
    if (hasMessage && !pageRendered) {
      listRef.current?.scrollTo(0, listRef.current.scrollHeight);
      setPageRendered(true);
    }
  }, [hasMessage, pageRendered]);

  useEffect(() => {
    if (shouldGoDown) {
      // listRef.current?.scrollIntoView({ block: 'end' });
      listRef.current?.scrollTo(0, listRef.current.scrollHeight);
      setGoDown(false);
    }
  }, [shouldGoDown, setGoDown]);

  // const isSameDate = (prevCreatedAt: string, currentCreatedAt: string):boolean => {
  //   const prev = new Date(prevCreatedAt).toLocaleTimeString().slice(0, -3);
  //   const current = new Date(currentCreatedAt).toLocaleTimeString().slice(0, -3);

  //   return prev === current;
  // };

  return (
    <div ref={listRef} className="overflow-y-scroll flex-1">
      {!adjustScroll && pageRendered && <div ref={ref} className="h-1" />}
      {data?.pages.map((page) => (
        <React.Fragment key={page.chats[0]?.chatId}>
          {page.chats.map((message, idx) => (
            <div key={message.chatId}>
              {message.user.type === myRole ? (
                <MyMessage
                  message={message}
                  isSameUser={idx > 0 && page.chats[idx - 1].user.id === message.user.id}
                />
              ) : (
                <YourMessage
                  message={message}
                  isSameUser={idx > 0 && page.chats[idx - 1].user.id === message.user.id}
                />
              )}
            </div>
          ))}
        </React.Fragment>
      ))}
      <ChatNotification />
    </div>
  );
}
