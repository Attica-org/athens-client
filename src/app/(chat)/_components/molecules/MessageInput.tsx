'use client';

import SendIcon from '@/assets/icons/SendIcon';
import { useMessageStore } from '@/store/message';
import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as StompJs from '@stomp/stompjs';
import tokenManager from '@/utils/tokenManager';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { Message } from '@/app/model/Message';
import { useAgora } from '@/store/agora';
// import showToast from '@/utils/showToast';
// import { getReissuanceToken } from '@/lib/getReissuanceToken';
import getKey from '@/utils/getKey';

export default function MessageInput() {
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [URL, setURL] = useState({
    SOCKET_URL: '',
  });
  const { enterAgora } = useAgora();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { setGoDown } = useMessageStore();
  const client = useRef<StompJs.Client>();
  const queryClient = useQueryClient();
  const agoraId = useAgora((state) => state.enterAgora.id);

  const handleMessage: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessage(e.target.value);
  };

  const pushMessage = useCallback(
    (data: any, type: string) => {
      // 쿼리 데이터에 추가
      const exMessages = queryClient.getQueryData([
        'chat',
        `${agoraId}`,
        'messages',
      ]) as InfiniteData<{
        chats: Message[];
        meta: { key: number; size: number };
      }>;

      if (exMessages && typeof exMessages === 'object') {
        const newMessages = {
          ...exMessages,
          pages: [...exMessages.pages],
        };

        const lastPage = newMessages.pages[newMessages.pages.length - 1];
        const newLastPage = lastPage
          ? { ...lastPage, chats: [...lastPage.chats] }
          : { chats: [], meta: { key: 0, size: 20 } };
        const lastMessageId = lastPage?.chats.at(-1)?.chatId;

        if (type === 'received') {
          newLastPage.chats.push(JSON.parse(data).data);
        }

        newMessages.pages[newMessages.pages.length - 1] = {
          chats: newLastPage.chats,
          meta: {
            key: lastMessageId || 0,
            size: 20,
          },
        };
        queryClient.setQueryData(
          ['chat', `${agoraId}`, 'messages'],
          newMessages,
        );
        setGoDown(true);
      }
    },
    [agoraId, queryClient, setGoDown],
  );

  const sendMessage = () => {
    if (message.trim().length < 1) return;

    if (
      client.current &&
      client.current.connected &&
      enterAgora.role !== 'OBSERVER'
    ) {
      client.current?.publish({
        destination: `/app/agoras/${agoraId}/chats`,
        body: JSON.stringify({
          type: 'CHAT',
          message,
        }),
      });
      setMessage('');
      // console.log(`> Send message: ${message}`);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const getUrl = async () => {
      const key = await getKey();
      setURL({
        SOCKET_URL: key.SOCKET_URL || '',
      });
    };

    inputRef.current?.focus();
    const handleOutSideClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('click', handleOutSideClick);

    const cleanup = () => {
      window.removeEventListener('click', handleOutSideClick);
    };

    getUrl();

    return cleanup;
  }, []);

  // 최초 렌더링 시 실행
  useEffect(() => {
    const disconnect = () => {
      client.current?.deactivate();
      // console.log('Disconnected');
    };

    const subscribe = () => {
      // console.log('Subscribing...');
      client.current?.subscribe(
        `/topic/agoras/${agoraId}/chats`,
        (received_message: StompJs.IFrame) => {
          // console.log(`> Received message: ${received_message.body}`);

          pushMessage(received_message.body, 'received');
        },
      );
    };

    const subscribeError = () => {
      // console.log('Subscribing Error...');
      client.current?.subscribe('/user/queue/errors', () => {
        // header에서 오류 처리
        setIsError(true);
      });
    };

    const connect = () => {
      client.current = new StompJs.Client({
        brokerURL: `${URL.SOCKET_URL}/ws`,
        connectHeaders: {
          Authorization: `Bearer ${tokenManager.getToken()}`,
          AgoraId: `${agoraId}`,
        },
        reconnectDelay: 500,
        onConnect: () => {
          subscribeError();
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

    if (
      enterAgora.status !== 'CLOSED' &&
      navigator.onLine &&
      URL.SOCKET_URL !== ''
    ) {
      connect();
    }

    if (isError) {
      connect();
      setIsError(false);
    }

    return () => {
      if (client.current && client.current.connected) {
        disconnect();
      }
    };
  }, [
    agoraId,
    isError,
    enterAgora.status,
    pushMessage,
    enterAgora.role,
    URL.SOCKET_URL,
  ]);

  return (
    enterAgora.status !== 'CLOSED' &&
    enterAgora.role !== 'OBSERVER' && (
      <section className="flex border-t-1 dark:border-dark-light-300 sticky bottom-0 right-0 left-0 w-full bg-white dark:bg-dark-light-300">
        <form className="pl-1rem p-10 pb-0 flex flex-1 justify-start items-center">
          <textarea
            aria-label="보낼 메세지 입력창"
            ref={inputRef}
            value={message}
            onChange={handleMessage}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="메시지 보내기"
            className="placeholder:text-athens-gray-thick dark:placeholder:text-dark-light-400
          dark:placeholder:text-opacity-85 dark:text-opacity-85 dark:text-white w-full text-sm lg:text-base
          focus-visible:outline-none dark:bg-dark-light-300 resize-none overflow-hidden h-35"
          />
        </form>
        <button
          type="button"
          onClick={sendMessage}
          aria-label="메세지 보내기"
          className="bg-athens-main pl-10 pr-10 cursor-pointer h-full"
        >
          <SendIcon className="w-30" fill="white" />
        </button>
      </section>
    )
  );
}
