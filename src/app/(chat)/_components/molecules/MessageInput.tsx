'use client';

import SendIcon from '@/assets/icons/SendIcon';
import { useMessageStore } from '@/store/message';
import React, {
  ChangeEventHandler, KeyboardEventHandler, useEffect, useRef, useState,
} from 'react';
import * as StompJs from '@stomp/stompjs';
import { usePathname } from 'next/navigation';
import tokenManager from '@/utils/tokenManager';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { Message } from '@/app/model/Message';

export default function MessageInput() {
  const [message, setMessage] = useState<string>('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { setGoDown } = useMessageStore();
  const agoraId = usePathname().split('/').pop() as string;
  const client = useRef<StompJs.Client>();
  const queryClient = useQueryClient();

  const handleMessage: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessage(e.target.value);
  };

  const pushMessage = (type: string, data?: any) => {
    const newDate = new Date();
    // 쿼리 데이터에 추가
    const exMessages = queryClient.getQueryData(['chat', `${agoraId}`, 'messages']) as InfiniteData<{
      chats: Message[], meta: { key: number, size: number }
    }>;
    if (exMessages && typeof exMessages === 'object') {
      const newMessages = {
        ...exMessages,
        pages: [
          ...exMessages.pages,
        ],
      };

      const lastPage = newMessages.pages[newMessages.pages.length - 1];
      const newLastPage = lastPage
        ? { ...lastPage, chats: [...lastPage.chats] }
        : { chats: [], meta: { key: 0, size: 20 } };
      const lastMessageId = lastPage?.chats.at(-1)?.chatId;

      if (type === 'received') {
        newLastPage.chats.push(data.data);
      } else {
        newLastPage.chats.push({
          chatId: lastMessageId ? lastMessageId - 1 : 0,
          user: {
            id: 0,
            nickname: '나',
            photoNumber: 2,
            type: 'CONS',
          },
          content: message,
          createdAt: `${newDate}`,
        });
      }

      newMessages.pages[newMessages.pages.length - 1] = {
        chats: newLastPage.chats,
        meta: {
          key: lastMessageId || 0,
          size: 20,
        },
      };
      queryClient.setQueryData(['chat', `${agoraId}`, 'messages'], newMessages);
      setGoDown(true);
    }
  };

  const sendMessage = () => {
    if (message.trim().length < 1) return;

    if (client.current) {
      client.current?.publish({
        destination: `/app/agoras/${agoraId}/chats`,
        body: JSON.stringify({
          type: 'CHAT',
          message,
        }),
      });

      pushMessage('send');
      console.log(`> Send message: ${message}`);
    }
    setMessage('');
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleKeyDown:KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
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

    return cleanup;
  }, []);

  // 최초 렌더링 시 실행
  useEffect(() => {
    const disconnect = () => {
      client.current?.deactivate();
      console.log('Disconnected');
    };

    const subscribe = () => {
      console.log('Subscribing...');
      client.current?.subscribe(`/topic/agoras/${agoraId}/chats`, (received_message: StompJs.IFrame) => {
        console.log(`> Received message: ${received_message.body}`);

        pushMessage(received_message.body, 'received');
      });
    };

    const subscribeError = () => {
      console.log('Subscribing Error...');
      client.current?.subscribe('/user/queue/errors', (received_message: StompJs.IFrame) => {
        console.log(`> Received message: ${received_message.body}`);
      });
    };

    const connect = () => {
      console.log('Connecting...');
      client.current = new StompJs.Client({
        brokerURL: 'ws://54.180.242.54:8080/ws',
        connectHeaders: {
          Authorization: `Bearer ${tokenManager.getToken()}`,
        },
        reconnectDelay: 200,
        onConnect: () => {
          console.log('connected');
          subscribeError();
          subscribe();
        },
        onWebSocketError: (error) => {
          console.log('Error with websocket', error);
        },
        onStompError: (frame) => {
          console.dir(`Broker reported error: ${frame.headers.message}`);
          console.dir(`Additional details: ${frame}`);
        },
      });
      console.log('Activating...');
      client.current.activate();
    };

    if (tokenManager.getToken() !== undefined) {
      connect();
    } else {
      console.error('Token is not found');
      // 토큰 발급
      // POST /api/v1/temp-user
    }

    return () => disconnect();
  }, [agoraId]);

  return (
    <section className="flex border-t-1 dark:border-dark-light-300 sticky bottom-0 right-0 left-0 w-full bg-white dark:bg-dark-light-300">
      <form className="pl-1.5rem p-12 pb-0 flex flex-1 justify-start items-center">
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
          dark:placeholder:text-opacity-85 dark:text-opacity-85 dark:text-white w-full text-base
          focus-visible:outline-none dark:bg-dark-light-300 resize-none overflow-hidden h-40"
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
  );
}
