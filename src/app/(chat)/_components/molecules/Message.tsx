'use client';

import { Message as IMessage } from '@/app/model/Message';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InfiniteData, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useMessageStore } from '@/store/message';
import { useAgora } from '@/store/agora';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import MyMessage from '../atoms/MyMessage';
import YourMessage from '../atoms/YourMessage';
import { getChatMessages } from '../../_lib/getChatMessages';
import ChatNotification from '../atoms/ChatNotification';

interface Meta {
  key: number | null;
  effectiveSize: number;
}

type MessageItemProps = {
  message: IMessage;
  isMyType: (type: string) => boolean;
  getTimeString: (time: string) => string;
  prevMessage: IMessage | null;
};

const observer = 'OBSERVER';

const MessageItem = React.memo(
  ({ message, isMyType, getTimeString, prevMessage }: MessageItemProps) => {
    const isMyMessage = isMyType(message.user.type);
    const isSameMessage = prevMessage && prevMessage.chatId === message.chatId;

    if (isSameMessage) return null;

    const isSameUser = prevMessage && prevMessage.user.id === message.user.id;
    const isSameTime =
      isSameUser &&
      getTimeString(prevMessage.createdAt) === getTimeString(message.createdAt);
    const shouldShowTime = !isSameTime;

    return isMyMessage ? (
      <MyMessage
        isSameUser={isSameUser || false}
        shouldShowTime={shouldShowTime}
        message={message}
      />
    ) : (
      <YourMessage
        isSameUser={isSameUser || false}
        shouldShowTime={shouldShowTime}
        message={message}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.message.chatId === nextProps.message.chatId &&
      prevProps.prevMessage?.chatId === nextProps.prevMessage?.chatId
    );
  },
);

export default function Message() {
  const { shouldGoDown, setGoDown } = useMessageStore();
  const { role: myRole, id: agoraId } = useAgora().enterAgora;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const lastMessageRef = useRef<IMessage | null>(null);
  const [startIndex, setStartIndex] = useState(-1);
  const [firstItemIndex, setFirstItemIndex] = useState(0);
  const [isRendered, setIsRendered] = useState(false);

  const { data, hasPreviousPage, isFetching, fetchPreviousPage } =
    useSuspenseInfiniteQuery<
      { chats: IMessage[]; meta: Meta },
      Object,
      InfiniteData<{ chats: IMessage[]; meta: Meta }>,
      [_1: string, _2: string, _3: string],
      { meta: Meta }
    >({
      queryKey: ['chat', `${agoraId}`, 'messages'],
      queryFn: getChatMessages,
      staleTime: 60 * 1000,
      gcTime: 500 * 1000,
      initialPageParam: { meta: { key: null, effectiveSize: 20 } },
      getPreviousPageParam: (firstPage) =>
        firstPage.meta.key !== -1 ? { meta: firstPage.meta } : undefined,
      getNextPageParam: (lastPage) =>
        lastPage.meta.key !== -1 ? { meta: lastPage.meta } : undefined,
    });

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const allMessages = useMemo(
    () => data.pages.flatMap((page) => page.chats),
    [data],
  );

  useEffect(() => {
    if (allMessages.length > 0) {
      if (virtuosoRef.current) {
        if (firstItemIndex === 0 && allMessages.length > 0) {
          const itemIndex = data.pages[0].chats.length - 1 || 0;
          const isValidate = itemIndex >= 0;

          setStartIndex(isValidate ? data.pages[0].chats[itemIndex].chatId : 0);
          setFirstItemIndex(isValidate ? itemIndex : 0);
          // console.log('첫 메시지 인덱스-firstItemIndex', itemIndex, isValidate ? itemIndex : 0, isValidate ? data.pages[0].chats[itemIndex].chatId : 0);

          virtuosoRef.current.scrollToIndex({
            index: isValidate ? itemIndex : 0,
            behavior: 'auto',
          });
        } else if (allMessages.length > 0 && startIndex !== -1) {
          // const allMessages = data.pages.flatMap(page => page.chats);
          const nextFirstItemIndex = startIndex - allMessages.length;
          setFirstItemIndex(nextFirstItemIndex);
        }

        lastMessageRef.current = allMessages[allMessages.length - 1] || null;
        setMessages(allMessages);
        setIsRendered(true);
      }
    }
  }, [allMessages, startIndex]);

  useEffect(() => {
    if (shouldGoDown && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: messages.length - 1,
        behavior: 'smooth',
      });
      setGoDown(false);
    }
  }, [shouldGoDown]);

  const startReached = useCallback(async () => {
    if (hasPreviousPage && !isFetching && isRendered) {
      setIsRendered(false);
      await fetchPreviousPage();
    }
  }, [hasPreviousPage, isFetching, fetchPreviousPage, isRendered]);

  const isMyType = useCallback(
    (type: string) => type === myRole || type === observer,
    [myRole],
  );

  const getTimeString = useCallback((time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString().slice(0, -3);
  }, []);

  const itemContent = useCallback(
    (index: number, message: IMessage) => {
      const idx = index - firstItemIndex;
      const prevMessage = idx > 0 ? messages[idx - 1] : null;
      // console.log(prevMessage, message, index, messages.length, firstItemIndex);
      return (
        <MessageItem
          key={message.chatId}
          message={message}
          isMyType={isMyType}
          getTimeString={getTimeString}
          prevMessage={prevMessage}
        />
      );
    },
    [firstItemIndex, isMyType, getTimeString],
  );

  return (
    <div className="flex flex-col h-full w-full">
      <Virtuoso
        ref={virtuosoRef}
        data={messages}
        computeItemKey={(index) => {
          const idx = index - firstItemIndex;
          return messages[idx].chatId;
        }}
        itemContent={itemContent}
        startReached={startReached}
        firstItemIndex={firstItemIndex}
        initialTopMostItemIndex={messages.length - 1}
        followOutput="auto"
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          overscrollBehavior: 'contain',
        }}
      />
      <ChatNotification />
    </div>
  );
}
