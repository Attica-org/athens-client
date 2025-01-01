'use client';

import { Message as IMessage } from '@/app/model/Message';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  InfiniteData,
  QueryClient,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { useMessageStore } from '@/store/message';
import { useAgora } from '@/store/agora';
import { useEnter } from '@/store/enter';
import { useShallow } from 'zustand/react/shallow';
import * as StompJs from '@stomp/stompjs';
import {
  getChatMessagesQueryKey,
  getUserReactionQueryKey,
} from '@/constants/queryKey';
import getKey from '@/utils/getKey';
import { AGORA_POSITION, AGORA_STATUS } from '@/constants/agora';
import { useSession } from 'next-auth/react';
import isNull from '@/utils/validation/validateIsNull';
import { useVirtualizer } from '@tanstack/react-virtual';
import MyMessage from '../atoms/MyMessage';
import YourMessage from '../atoms/YourMessage';
import { getChatMessages } from '../../_lib/getChatMessages';
import ChatNotification from '../atoms/ChatNotification';
import NotificationNewMessage from '../atoms/NotificationNewMessage';
import ScrollToBottomBtn from '../atoms/ScrollToBottomBtn';
import UserAccessNotification from '../atoms/UserAccessNotification';

interface Meta {
  key: number | null;
  effectiveSize: number;
}

type MessageItemProps = {
  message: IMessage;
  isMyType: (type: string) => boolean;
  getTimeString: (time: string) => string;
  nextMessage: IMessage | null;
  prevMessage: IMessage | null;
  client: React.RefObject<StompJs.Client> | null;
  queryClient: QueryClient;
  agoraId: number;
};

function MessageItem({
  message,
  isMyType,
  getTimeString,
  nextMessage,
  prevMessage,
  client,
  queryClient,
  agoraId,
}: MessageItemProps) {
  if (isNull(message)) return null;
  if (!isNull(message.access)) {
    return (
      <UserAccessNotification
        className="flex p-0.5rem pl-1rem pr-1rem"
        nickname={message.user.nickname}
        access={message.access}
      />
    );
  }

  const isMyMessage = isMyType(message.user.type);
  const isSameMessage = nextMessage && nextMessage.chatId === message.chatId;

  if (isSameMessage) return null;

  const isPrevSameUser = prevMessage && prevMessage.user.id === message.user.id;
  const isNextSameUser = nextMessage && nextMessage.user.id === message.user.id;

  const currentMessageTime = getTimeString(message.createdAt);
  const nextMessageTime = nextMessage && getTimeString(nextMessage.createdAt);

  const isSameTime = nextMessage && currentMessageTime === nextMessageTime;
  const shouldShowTime = !isNextSameUser || !isSameTime;

  queryClient.setQueryData(
    getUserReactionQueryKey(agoraId, message.chatId),
    message.reactionCount,
  );

  return isMyMessage ? (
    <MyMessage
      isSameUser={isPrevSameUser || false}
      shouldShowTime={shouldShowTime}
      message={message}
      client={client}
    />
  ) : (
    <YourMessage
      isSameUser={isPrevSameUser || false}
      shouldShowTime={shouldShowTime}
      message={message}
      client={client}
    />
  );
}

export default function Message() {
  const [newMessageView, setNewMessageView] = useState(true);
  const adjustScrollRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const client = useRef<StompJs.Client | null>(null);
  const [URL, setURL] = useState({
    SOCKET_URL: '',
  });
  const { shouldGoDown, setGoDown } = useMessageStore();
  const myRole = useAgora((state) => state.enterAgora.role);
  const agoraId = useAgora((state) => state.enterAgora.id);
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { data: session } = useSession();
  const { nickname: userNickname, reset } = useEnter(
    useShallow((state) => ({
      nickname: state.nickname,
      reset: state.reset,
    })),
  );
  const { enterAgora } = useAgora(
    useShallow((state) => ({ enterAgora: state.enterAgora })),
  );

  const {
    data,
    status,
    hasPreviousPage,
    isFetchingPreviousPage,
    fetchPreviousPage,
  } = useSuspenseInfiniteQuery<
    { chats: IMessage[]; meta: Meta },
    Object,
    InfiniteData<{ chats: IMessage[]; meta: Meta }>,
    [_1: string, _2: string, _3: string],
    { meta: Meta }
  >({
    queryKey: getChatMessagesQueryKey(agoraId),
    queryFn: getChatMessages(session),
    staleTime: 60 * 1000,
    gcTime: 500 * 1000,
    initialPageParam: { meta: { key: null, effectiveSize: 20 } },
    getPreviousPageParam: (firstPage) => {
      return firstPage.meta.key !== -1 ? { meta: firstPage.meta } : undefined;
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.key !== -1 ? { meta: lastPage.meta } : undefined,
  });

  // 채팅 반응하기 구독
  const getUrl = async () => {
    const key = await getKey();
    setURL({
      SOCKET_URL: key.SOCKET_URL || '',
    });
  };

  const handleWebSocketReaction = (response: any) => {
    if (response.type === 'REACTION') {
      queryClient.setQueryData(
        getUserReactionQueryKey(agoraId, response.data.chatId),
        response.data.reactionCount,
      );
    }
  };

  useEffect(() => {
    const isPossibleConnect = () => {
      return (
        navigator.onLine &&
        URL.SOCKET_URL !== '' &&
        enterAgora.status !== AGORA_STATUS.CLOSED
      );
    };

    const disconnect = () => {
      client.current?.deactivate();
    };

    const subscribe = () => {
      if (client.current?.connected) {
        client.current?.subscribe(
          `/topic/agoras/${agoraId}/reactions`,
          async (received_reaction: StompJs.IFrame) => {
            const userReactionData = JSON.parse(received_reaction.body);
            handleWebSocketReaction(userReactionData);
          },
        );
      }
    };

    const connect = () => {
      client.current = new StompJs.Client({
        brokerURL: `${URL.SOCKET_URL}/ws`,
        connectHeaders: {
          Authorization: `Bearer ${session?.user.accessToken}`,
          AgoraId: `${agoraId}`,
        },
        reconnectDelay: 500,
        onConnect: () => {
          subscribe();
        },
        onWebSocketError: async () => {
          // showToast('네트워크가 불안정합니다.', 'error');
          // await getReissuanceToken();
          // connect();
        },
        onStompError: async () => {
          // await getReissuanceToken();
          // connect();
        },
      });

      client.current.activate();
    };

    if (isPossibleConnect()) {
      connect();
    }

    return () => {
      if (client.current && client.current.connected) {
        disconnect();
      }
    };
  }, [agoraId, enterAgora.status, URL]);

  const virtualizer = useVirtualizer({
    count: hasPreviousPage ? messages.length + 1 : messages.length,
    getScrollElement: () => listRef.current,
    overscan: 5,
    estimateSize: () => 30,
    scrollMargin: 10,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= messages.length - 1 &&
      hasPreviousPage &&
      !isFetchingPreviousPage &&
      !adjustScrollRef.current
    ) {
      adjustScrollRef.current = true;
      fetchPreviousPage().then(() => {
        setMessages((prev) => {
          const newMessages = data?.pages[0].chats || [];
          return [...prev, ...newMessages];
        });
        adjustScrollRef.current = false;
      });
    }
  }, [
    hasPreviousPage,
    fetchPreviousPage,
    messages.length,
    isFetchingPreviousPage,
    virtualItems,
  ]);

  useEffect(() => {
    // 반대로 스크롤 되도록 이벤트 핸들러 등록
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      const currentTarget = e.currentTarget as HTMLElement;

      if (currentTarget) {
        currentTarget.scrollTop -= e.deltaY;
      }
    };

    const currentListRef = listRef.current;
    if (currentListRef) {
      currentListRef.addEventListener('wheel', handleScroll, {
        passive: false,
      });
    }
    return () => {
      if (currentListRef) {
        currentListRef.removeEventListener('wheel', handleScroll);
      }
    };
  }, [status]);

  useEffect(() => {
    if (shouldGoDown) {
      const lastPage = data?.pages[data.pages.length - 1];
      const lastMessage = lastPage.chats[lastPage.chats.length - 1];
      setMessages((prev) => [lastMessage, ...prev]);

      // 새로 전달받은 메시지 업데이트 후에 스크롤 조정
      setTimeout(() => {
        if (listRef.current) {
          // 입퇴장 속성이 있다면, 스크롤을 조정하지 않음
          if (lastMessage.access !== undefined) {
            setGoDown(false);
            return;
          }

          const isAtBottom = listRef.current.scrollTop < 100;

          // 마지막 메시지가 내 메시지거나, 스크롤이 맨 아래에 있을 때만 스크롤 조정
          if (isAtBottom || lastMessage.user.nickname === userNickname) {
            listRef.current.scrollTo({ top: 0 });
          } else {
            setNewMessageView(true);
          }
        }
      }, 0);
      setGoDown(false);
    }
  }, [shouldGoDown, setGoDown, userNickname, data.pages]);

  useEffect(() => {
    getUrl();

    return () => {
      queryClient.removeQueries({
        queryKey: getChatMessagesQueryKey(agoraId),
      });
      reset();
    };
  }, []);

  const isMyType = useCallback(
    (type: string) =>
      type === myRole ||
      (myRole === AGORA_POSITION.OBSERVER && type === AGORA_POSITION.PROS),
    [myRole],
  );

  const getTimeString = useCallback((time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString().slice(0, -3);
  }, []);

  return (
    <>
      <div
        key={agoraId}
        ref={listRef}
        className="h-full w-full flex overflow-auto flex-col"
        style={{
          transform: 'scaleY(-1)',
        }}
      >
        <ChatNotification />
        <div
          className="relative w-full flex flex-col"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {virtualizer.getVirtualItems().map((item) => {
            return (
              <div
                ref={virtualizer.measureElement}
                key={item.key}
                data-index={item.index}
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: `translateY(${item.start}px) scaleY(-1)`,
                }}
              >
                <MessageItem
                  message={messages[item.index]}
                  isMyType={isMyType}
                  getTimeString={getTimeString}
                  nextMessage={messages[item.index - 1] || null}
                  prevMessage={messages[item.index + 1] || null}
                  client={client}
                  queryClient={queryClient}
                  agoraId={agoraId}
                />
              </div>
            );
          })}
        </div>
      </div>
      <ScrollToBottomBtn listRef={listRef} />
      {newMessageView && (
        <NotificationNewMessage
          message={messages[0]}
          listRef={listRef}
          setView={setNewMessageView}
          view={newMessageView}
        />
      )}
    </>
  );
}
