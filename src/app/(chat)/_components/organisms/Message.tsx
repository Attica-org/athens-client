'use client';

import { Message as IMessage, MessageMetaResponse } from '@/app/model/Message';
import React, {
  FocusEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  InfiniteData,
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
import { AGORA_POSITION } from '@/constants/agora';
import isNull from '@/utils/validation/validateIsNull';
import { useWebSocketClient } from '@/store/webSocket';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useSession } from 'next-auth/react';
import { useAccessibleMessageNotifier } from '@/hooks/useAccessibleMessageNotifier';
import { WebSocketResponse } from '@/app/model/Chat';
import { getChatMessages } from '../../_lib/getChatMessages';
import ChatNotification from '../atoms/ChatNotification';
import NotificationNewMessage from '../atoms/NotificationNewMessage';
import ScrollToBottomBtn from '../atoms/ScrollToBottomBtn';
import MessageItem from '../molecules/MessageItem';

export default function Message() {
  const [newMessageView, setNewMessageView] = useState<boolean>(false);
  const [isNavigationMode, setIsNavigationMode] = useState<boolean>(false);
  const [accessibleQueue, setAccessibleQueue] = useState<IMessage[]>([]);
  const adjustScrollRef = useRef<boolean>(false);
  const lastMessageRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { shouldGoDown, setGoDown } = useMessageStore();
  const {
    role: myRole,
    id: agoraId,
    status: agoraStatus,
  } = useAgora(
    useShallow((state) => ({
      role: state.enterAgora.role,
      id: state.enterAgora.id,
      status: state.enterAgora.status,
    })),
  );

  const { webSocketClient, webSocketClientConnected } = useWebSocketClient(
    useShallow((state) => ({
      webSocketClient: state.webSocketClient,
      webSocketClientConnected: state.webSocketClientConnected,
    })),
  );
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const ariaMessage = useAccessibleMessageNotifier(
    accessibleQueue,
    agoraStatus,
  );
  const { data: session } = useSession();
  const { nickname: userNickname, reset } = useEnter(
    useShallow((state) => ({
      nickname: state.nickname,
      reset: state.reset,
    })),
  );

  const lastMessageIdx = useRef<number>(0);

  const {
    data,
    status,
    hasPreviousPage,
    isFetchingPreviousPage,
    fetchPreviousPage,
  } = useSuspenseInfiniteQuery<
    { chats: IMessage[]; meta: MessageMetaResponse },
    Object,
    InfiniteData<{ chats: IMessage[]; meta: MessageMetaResponse }>,
    [_1: string, _2: string, _3: string],
    { meta: MessageMetaResponse }
  >({
    queryKey: getChatMessagesQueryKey(agoraId),
    queryFn: isNull(session)
      ? async () => {
          return {
            chats: [],
            meta: { key: null, effectiveSize: 20 },
          };
        }
      : getChatMessages(session),
    staleTime: 60 * 1000,
    gcTime: 500 * 1000,
    initialPageParam: { meta: { key: null, effectiveSize: 20 } },
    getPreviousPageParam: (firstPage) => {
      return firstPage.meta.key !== -1 ? { meta: firstPage.meta } : undefined;
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.key !== -1 ? { meta: lastPage.meta } : undefined,
  });

  const handleWebSocketReaction = useCallback(
    (response: WebSocketResponse) => {
      if (response.type === 'REACTION') {
        queryClient.setQueryData(
          getUserReactionQueryKey(agoraId, response.data.chatId),
          response.data.reactionCount,
        );
      }
    },
    [agoraId, queryClient],
  );

  useEffect(() => {
    const subscribeReactions = () => {
      if (isNull(webSocketClient) || !webSocketClientConnected) return;

      webSocketClient.subscribe(
        `/topic/agoras/${agoraId}/reactions`,
        async (received_reaction: StompJs.IFrame) => {
          const userReactionData = JSON.parse(received_reaction.body);
          handleWebSocketReaction(userReactionData);
        },
      );
    };
    subscribeReactions();
  }, [webSocketClientConnected, agoraId, handleWebSocketReaction]);

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

    if (isNull(lastItem)) {
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

      if (!isNull(currentTarget)) {
        currentTarget.scrollTop -= e.deltaY;
      }
    };

    const currentListRef = listRef.current;
    if (!isNull(currentListRef)) {
      currentListRef.addEventListener('wheel', handleScroll, {
        passive: false,
      });
    }
    return () => {
      if (!isNull(currentListRef)) {
        currentListRef.removeEventListener('wheel', handleScroll);
      }
    };
  }, [status]);

  useEffect(() => {
    if (shouldGoDown) {
      const lastPage = data?.pages[data.pages.length - 1];
      const lastMessage = lastPage.chats[lastPage.chats.length - 1];

      if (isNull(lastMessage)) return;

      setMessages((prev) => [lastMessage, ...prev]);

      // 새로 전달받은 메시지 업데이트 후에 스크롤 조정
      setTimeout(() => {
        if (!isNull(listRef.current)) {
          // 입퇴장 속성이 있다면, 스크롤을 조정하지 않음
          if (lastMessage.access !== undefined) {
            setGoDown(false);
            return;
          }

          lastMessageIdx.current = lastMessage.chatId;

          const isAtBottom = listRef.current.scrollTop < 100;

          // 접근성 알림 처리
          if (isAtBottom) {
            setAccessibleQueue((prev) => [...prev, lastMessage]);
          }

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

  // 메시지를 훅에 넘긴 후에는 큐 초기화
  useEffect(() => {
    if (accessibleQueue.length > 0) {
      setAccessibleQueue([]);
    }
  }, [accessibleQueue]);

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    const element = listRef.current;
    const isFocusedOnParent = document.activeElement === element;
    if (isFocusedOnParent && e.key === 'Enter') {
      // 첫 번째 메시지에 포커스
      e.preventDefault();
      setIsNavigationMode(true);
      // 첫 번째 메시지에 포커스
      lastMessageRef.current?.focus();
    } else if (e.key === 'Escape') {
      // 다시 메시지 리스트 컨테이너로 포커스
      e.preventDefault();
      setIsNavigationMode(false);
      listRef.current?.focus();
    }
  };

  const handleBlur: FocusEventHandler<HTMLDivElement> = (e) => {
    if (!listRef.current?.contains(e.relatedTarget as Node)) {
      setIsNavigationMode(false);
    }
  };

  const handleFocusIn: FocusEventHandler<HTMLDivElement> = (e) => {
    if (e.target === listRef.current) {
      setIsNavigationMode(false);
    }
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: getChatMessagesQueryKey(agoraId),
      });
      reset();
    };
  }, []);

  const isMyType = useCallback(
    (type: IMessage['user']['type']) =>
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
        role="button"
        tabIndex={0}
        key={agoraId}
        ref={listRef}
        onFocusCapture={handleFocusIn}
        onBlurCapture={handleBlur}
        onKeyDown={handleKeyDown}
        aria-label="메시지 리스트입니다. Enter 키를 누르면 메시지를 탐색할 수 있습니다"
        className="cursor-default h-full w-full flex overflow-auto flex-col transform-scale-y-inverted"
      >
        <ChatNotification />
        <ul
          className="relative w-full flex flex-col"
          aria-hidden
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {virtualizer.getVirtualItems().map((item) => {
            const message = messages[item.index];
            const isLast =
              !isNull(message) &&
              messages[item.index].chatId === lastMessageIdx.current;

            return (
              <li
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
                  isNavigationMode={isNavigationMode}
                  innerRef={isLast ? lastMessageRef : undefined}
                  isMyType={isMyType}
                  getTimeString={getTimeString}
                  nextMessage={messages[item.index - 1] || null}
                  prevMessage={messages[item.index + 1] || null}
                  queryClient={queryClient}
                  agoraId={agoraId}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <ScrollToBottomBtn lastMessageRef={lastMessageRef} listRef={listRef} />
      {newMessageView && (
        <NotificationNewMessage
          message={messages[0]}
          listRef={listRef}
          lastMessageRef={lastMessageRef}
          setView={setNewMessageView}
          view={newMessageView}
        />
      )}

      {/* 접근성 알림 */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {ariaMessage || '\u00A0'}
      </div>
    </>
  );
}
