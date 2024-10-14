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
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Message } from '@/app/model/Message';
import { useAgora } from '@/store/agora';
// import showToast from '@/utils/showToast';
// import { getReissuanceToken } from '@/lib/getReissuanceToken';
import getKey from '@/utils/getKey';
import { getChatMessagesQueryKey } from '@/constants/queryKey';
import showToast from '@/utils/showToast';
import { AGORA_STATUS } from '@/constants/Agora';
import postFilterBadWords from '../../_lib/postFilterBadWords';
// import { unloadDisconnectSocket } from '@/utils/unloadDisconnectSocket';

export default function MessageInput() {
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState(false);
  // const [isError, setIsError] = useState({
  //   isError: false,
  //   count: 0,
  // });
  const [isComposing, setIsComposing] = useState(false);
  const [URL, setURL] = useState({
    SOCKET_URL: '',
  });
  const { enterAgora } = useAgora();
  const inputRef = useRef<HTMLDivElement>(null);
  const { setGoDown } = useMessageStore();
  const client = useRef<StompJs.Client>();
  const queryClient = useQueryClient();
  const [highlightedMessage, setHighlightedMessage] = useState<string>('');

  const pushMessage = useCallback(
    (data: any, type: string) => {
      // 쿼리 데이터에 추가
      const exMessages = queryClient.getQueryData(
        getChatMessagesQueryKey(enterAgora.id),
      ) as InfiniteData<{
        chats: Message[];
        meta: { key: number; effectiveSize: number };
      }>;

      if (exMessages && typeof exMessages === 'object') {
        const newMessages = {
          pageParams: [...exMessages.pageParams],
          pages: [...exMessages.pages],
        };

        const lastPage = newMessages.pages.at(-1);
        const newLastPage = lastPage
          ? { ...lastPage, chats: [...lastPage.chats] }
          : { chats: [], meta: { key: 0, effectiveSize: 20 } };
        // const lastMessageId = lastPage?.chats.at(-1)?.chatId;

        if (type === 'received') {
          newLastPage.chats.push(JSON.parse(data).data);
        }

        newMessages.pages[newMessages.pages.length - 1] = {
          chats: newLastPage.chats,
          meta: {
            key: newLastPage.meta.key || 0,
            effectiveSize: 20,
          },
        };

        queryClient.setQueryData(
          getChatMessagesQueryKey(enterAgora.id),
          newMessages,
        );
        setGoDown(true);
      }
    },
    [enterAgora.id, queryClient, setGoDown],
  );

  const sendMessage = () => {
    if (message.trim().length < 1) return;

    if (
      client.current &&
      client.current.connected &&
      enterAgora.role !== 'OBSERVER'
    ) {
      client.current?.publish({
        destination: `/app/agoras/${enterAgora.id}/chats`,
        body: JSON.stringify({
          type: 'CHAT',
          message,
        }),
      });
      setMessage('');
      if (inputRef.current) {
        inputRef.current.innerText = '';
      }
      // console.log(`> Send message: ${message}`);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const moveCursorToEnd = (el: HTMLDivElement) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const handleMessage: ChangeEventHandler<HTMLDivElement> = (e) => {
    const currentHTML = e.target.innerHTML;

    if (highlightedMessage && highlightedMessage !== currentHTML) {
      setHighlightedMessage('');
      e.target.innerHTML = e.target.innerText;
      moveCursorToEnd(e.target);
    }

    setMessage(e.target.innerText);
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
        moveCursorToEnd(inputRef.current);
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
        `/topic/agoras/${enterAgora.id}/chats`,
        (received_message: StompJs.IFrame) => {
          // console.log(`> Received message: ${received_message.body}`);

          pushMessage(received_message.body, 'received');
        },
      );

      if (client && client.current) {
        // unloadDisconnectSocket(client.current);
      }
    };

    const subscribeError = () => {
      // console.log('Subscribing Error...');
      client.current?.subscribe('/user/queue/errors', () => {
        // header에서 오류 처리
        setIsError(true);
        // setIsError({
        //   isError: true,
        //   count: isError.count + 1,
        // });
      });

      if (client && client.current) {
        // unloadDisconnectSocket(client.current);
      }
    };

    const connect = () => {
      client.current = new StompJs.Client({
        brokerURL: `${URL.SOCKET_URL}/ws`,
        connectHeaders: {
          Authorization: `Bearer ${tokenManager.getToken()}`,
          AgoraId: `${enterAgora.id}`,
        },
        reconnectDelay: 500,
        onConnect: () => {
          // setIsError({
          //   isError: false,
          //   count: 0,
          // });
          subscribeError();
          subscribe();
        },
        onWebSocketError: async () => {
          // setIsError({
          //   isError: false,
          //   count: isError.count + 1,
          // });
          // showToast('네트워크가 불안정합니다.', 'error');
          // await getReissuanceToken();
          // connect();
        },
        onStompError: async () => {
          // setIsError({
          //   isError: false,
          //   count: isError.count + 1,
          // });
          // await getReissuanceToken();
          // connect();
        },
      });
      client.current.activate();
    };

    if (
      enterAgora.status !== AGORA_STATUS.CLOSED &&
      navigator.onLine &&
      URL.SOCKET_URL !== ''
    ) {
      connect();
    }

    if (isError) {
      connect();
      setIsError(false);
    }

    // if (isError.isError && isError.count < 5) {
    //   connect();
    //   setIsError({
    //     isError: false,
    //     count: isError.count + 1,
    //   });
    // }
    // else if(isError.count >= 5) {
    //   // showToast('네트워크가 불안정합니다.', 'error');
    //   disconnect();
    // }

    return () => {
      if (client.current && client.current.connected) {
        disconnect();
      }
    };
  }, [
    enterAgora.id,
    isError,
    enterAgora.status,
    pushMessage,
    enterAgora.role,
    URL.SOCKET_URL,
  ]);

  const callFilterBadWordsAPI = async () => {
    return postFilterBadWords({ message, agoraId: enterAgora.id });
  };

  type BadWord = {
    start: number;
    end: number;
    keyword: string;
  }[];

  const highlightBadWords = (badWords: BadWord) => {
    let newHighlightedMessage = '';
    let lastIndex = 0;

    badWords.forEach(({ start, end }) => {
      newHighlightedMessage += message.slice(lastIndex, start);
      newHighlightedMessage += `<span class="text-red-500">${message.slice(start, end + 1)}</span>`;
      lastIndex = end + 1;
    });

    newHighlightedMessage += message.slice(lastIndex);

    setHighlightedMessage(newHighlightedMessage);

    if (inputRef.current) {
      inputRef.current.innerHTML = newHighlightedMessage;
      moveCursorToEnd(inputRef.current);
    }
  };

  const filterBadWordsMutation = useMutation({
    mutationFn: callFilterBadWordsAPI,
    onSuccess: async (response) => {
      if (response.hasBadWord) {
        highlightBadWords(response.badword);
        showToast('부적절한 단어가 포함되어 있습니다.', 'error');
      } else {
        sendMessage();
      }
    },
  });

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      filterBadWordsMutation.mutate();
    }
  };

  return (
    enterAgora.status !== AGORA_STATUS.CLOSED &&
    enterAgora.role !== 'OBSERVER' && (
      <section className="flex border-t-1 dark:border-dark-light-300 sticky bottom-0 right-0 left-0 w-full bg-white dark:bg-dark-light-300">
        <form className="pl-1rem p-10 pb-0 flex flex-1 justify-start items-center">
          <div
            role="textbox"
            tabIndex={0}
            aria-label="보낼 메세지 입력창"
            contentEditable
            ref={inputRef}
            onInput={handleMessage}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            data-placeholder="메시지 보내기"
            className="placeholder:text-athens-gray-thick dark:placeholder:text-dark-light-400
          dark:placeholder:text-opacity-85 dark:text-opacity-85 dark:text-white w-full text-sm lg:text-base
          focus-visible:outline-none dark:bg-dark-light-300 resize-none overflow-hidden h-35"
          />
        </form>
        <button
          type="button"
          onClick={() => filterBadWordsMutation.mutate()}
          aria-label="메세지 보내기"
          className="bg-athens-main pl-10 pr-10 cursor-pointer h-full"
        >
          <SendIcon className="w-30" fill="white" />
        </button>
      </section>
    )
  );
}
