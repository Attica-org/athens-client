'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSidebarStore } from '@/store/sidebar';
import { useShallow } from 'zustand/react/shallow';
import { useRouter } from 'next/navigation';
import { useAgora } from '@/store/agora';
import * as StompJs from '@stomp/stompjs';
import { AgoraMeta } from '@/app/model/AgoraMeta';
import { useChatInfo } from '@/store/chatInfo';
import showToast from '@/utils/showToast';
import { useVoteStore } from '@/store/vote';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import getKey from '@/utils/getKey';
import {
  getAgoraUserListQueryKey,
  getChatMessagesQueryKey,
} from '@/constants/queryKey';
import { homeSegmentKey } from '@/constants/segmentKey';
import { AGORA_POSITION, AGORA_STATUS } from '@/constants/agora';
import { swalBackButtonAlert } from '@/utils/swalAlert';
import useApiError from '@/hooks/useApiError';
import { signOut, useSession } from 'next-auth/react';
import {
  DISCUSSION_END,
  DISCUSSION_START,
  DISCUSSION_TOAST_MESSAGE,
} from '@/constants/chats';
import { useUnloadDisconnectSocket } from '@/hooks/useUnloadDisconnectSocket';
import { Message } from '@/app/model/Message';
import { useMessageStore } from '@/store/message';
import isNull from '@/utils/validation/validateIsNull';
import accessMessageConfig from '@/lib/accessMessageConfig';
import { useWebSocketClient } from '@/store/webSocket';
import { useEnter } from '@/store/enter';
import BackButton from '../../../_components/atoms/BackButton';
import AgoraInfo from '../molecules/AgoraInfo';
import DiscussionStatus from '../molecules/DiscussionStatus';
import patchChatExit from '../../_lib/patchChatExit';
import SocketErrorHandler from '../../utils/SocketErrorHandler';
import MenuItems from '../molecules/MenuItems';

export default function Header() {
  const { toggle } = useSidebarStore(
    useShallow((state) => ({ toggle: state.toggle })),
  );
  const {
    enterAgora,
    reset: selectedAgoraReset,
    enterAgoraReset,
  } = useAgora(
    useShallow((state) => ({
      enterAgora: state.enterAgora,
      enterAgoraReset: state.enterAgoraReset,
      reset: state.reset,
    })),
  );
  const {
    setTitle,
    setDiscussionStart,
    setDiscurreionEnd,
    reset,
    addParticipant,
    removeParticipant,
  } = useChatInfo(
    useShallow((state) => ({
      setTitle: state.setTitle,
      setDiscussionStart: state.setDiscussionStart,
      setDiscurreionEnd: state.setDiscussionEnd,
      reset: state.reset,
      addParticipant: state.addParticipant,
      removeParticipant: state.removeParticipant,
    })),
  );
  const { webSocketClient, setWebSocketClient, webSocketClientConnected } =
    useWebSocketClient(
      useShallow((state) => ({
        webSocketClient: state.webSocketClient,
        setWebSocketClient: state.setWebSocketClient,
        webSocketClientConnected: state.webSocketClientConnected,
      })),
    );

  const voteResultReset = useVoteStore(useShallow((state) => state.reset));
  const [metaData, setMetaData] = useState<AgoraMeta>();
  const [participants, setParticipants] = useState<{
    pros: number;
    cons: number;
  }>({
    pros: 0,
    cons: 0,
  });
  const [socketError, setSocketError] = useState({
    isError: false,
    count: 0,
  });
  const { setGoDown } = useMessageStore();
  const router = useRouter();
  const { handleError } = useApiError();
  const { chatSocketErrorHandler } = SocketErrorHandler();
  const { data: session } = useSession();
  const [agoraId, setAgoraId] = useState(enterAgora.id);

  const queryClient = useQueryClient();
  const [URL, setURL] = useState({
    BASE_URL: '',
    SOCKET_URL: '',
  });

  const getUrl = useCallback(async () => {
    const key = await getKey();
    setURL({
      BASE_URL: key.BASE_URL || '',
      SOCKET_URL: key.SOCKET_URL || '',
    });
  }, []);

  const refetchAgoraUserList = async () => {
    // 유저 리스트 캐시 무효화 및 재요청
    await queryClient.invalidateQueries({
      queryKey: getAgoraUserListQueryKey(agoraId),
    });

    await queryClient.refetchQueries({
      queryKey: getAgoraUserListQueryKey(agoraId),
    });
  };

  const callChatExitAPI = async () => {
    if (enterAgora.status !== AGORA_STATUS.CLOSED) {
      return patchChatExit({ agoraId });
    }
    return () => {};
  };

  const onSuccessChatExit = (response: any) => {
    if (response) {
      // 채팅방 정보 및 유저 채팅 프로필 정보 초기화
      useEnter.getState().reset();
      useAgora.getState().reset();
      useAgora.getState().enterAgoraReset();

      useEnter.persist.rehydrate();
      useAgora.persist.rehydrate();

      router.replace(`${homeSegmentKey}?status=active`);
    }
  };

  const mutation = useMutation({
    mutationFn: callChatExitAPI,
    onSuccess: (response) => onSuccessChatExit(response),
    onError: async (error) => {
      await handleError(error, mutation.mutate);
    },
  });

  const handleAgoraExit = () => {
    if (enterAgora.status === AGORA_STATUS.CLOSED) {
      selectedAgoraReset();
      enterAgoraReset();

      onSuccessChatExit(true);
    } else if (
      enterAgora.status === AGORA_STATUS.RUNNING ||
      enterAgora.status === AGORA_STATUS.QUEUED
    ) {
      mutation.mutate();
    }
  };

  const handleBack = async () => {
    const text =
      enterAgora.status === AGORA_STATUS.CLOSED
        ? ''
        : '설정한 프로필은 초기화됩니다.';
    const result = await swalBackButtonAlert(text);

    if (result && result.isConfirmed) {
      handleAgoraExit();
    }
  };

  const isPossibleConnect = () => {
    return (
      (navigator.onLine &&
        URL.SOCKET_URL !== '' &&
        enterAgora.status === AGORA_STATUS.QUEUED) ||
      enterAgora.status === AGORA_STATUS.RUNNING
    );
  };

  const updateUserAccessMessage = (
    userDisconnectTime: string,
    enterAgoraId: number,
    username: string,
  ) => {
    const curMessages = queryClient.getQueryData(
      getChatMessagesQueryKey(enterAgora.id),
    ) as InfiniteData<{
      chats: Message[];
      meta: { key: number; effectiveSize: number };
    }>;

    if (isNull(username) || isNull(curMessages)) return;

    const newMessages = {
      pageParams: [...curMessages.pageParams],
      pages: [...curMessages.pages],
    };

    const lastPage = newMessages.pages.at(-1);

    const newLastPage =
      lastPage?.meta.key === -1
        ? { chats: [...lastPage.chats], meta: { ...lastPage.meta } }
        : { chats: [], meta: { key: 0, effectiveSize: 20 } };

    // const lastMessageId = lastPage?.chats.at(-1)?.chatId;

    const newMessage = {
      chatId: accessMessageConfig.getAccessMessageChatId(),
      user: {
        id: -1,
        nickname: username,
        photoNumber: 0,
        type: '',
      },
      content: '',
      createdAt: '',
      reactionCount: {
        LIKE: 0,
        DISLIKE: 0,
        LOVE: 0,
        HAPPY: 0,
        SAD: 0,
      },
      access: userDisconnectTime === null ? 'enter' : 'exit',
    };

    newLastPage.chats.push(newMessage);

    newMessages.pages[newMessages.pages.length - 1] = {
      chats: newLastPage.chats,
      meta: {
        key: newLastPage.meta.key || 0,
        effectiveSize: 20,
      },
    };

    queryClient.setQueryData(
      getChatMessagesQueryKey(enterAgoraId),
      newMessages,
    );
    setGoDown(true);
    // console.log('newMessages', newMessages);

    // let accessStatus = null;

    // if (userDisconnectTime === null) {
    //   accessStatus = 'enter';
    // } else if (userDisconnectTime.length > 0) {
    //   accessStatus = 'exit';
    // }

    // queryClient.setQueryData(getChatMessagesQueryKey(enterAgoraId), {
    //   status: accessStatus,
    //   username,
    // });
  };

  const updateParticipantList = (
    userDisconnectTime: string,
    memberId: number,
    username: string,
  ) => {
    if (isNull(username)) return;

    if (isNull(userDisconnectTime)) {
      addParticipant(memberId, username);
      return;
    }
    removeParticipant(memberId);
  };

  const handleWebSocketResponse = (response: any) => {
    if (response.type === 'META') {
      // console.log('META', response.data);
      setTitle(response.data.agora.title);
      setAgoraId(response.data.agora.id);
      setMetaData(response.data);
      // refetchAgoraUserList();

      if (response.data.agora.startAt) {
        setDiscussionStart(response.data.agora.startAt);
      }

      const partcipantsCnt = {
        pros: 0,
        cons: 0,
      };
      response.data.participants.forEach(
        (participant: { type: string; count: number }) => {
          if (participant.type === AGORA_POSITION.PROS) {
            partcipantsCnt.pros = participant.count;
          } else if (participant.type === AGORA_POSITION.CONS) {
            partcipantsCnt.cons = participant.count;
          }
        },
      );

      setParticipants(partcipantsCnt);

      const { socketDisconnectTime, username, memberId } =
        response.data.agoraMemberInfo;

      updateUserAccessMessage(
        socketDisconnectTime,
        response.data.agora.id,
        username,
      );
      updateParticipantList(socketDisconnectTime, memberId, username);
    } else if (response.type === DISCUSSION_START) {
      // console.log(data.data);
      showToast('토론이 시작되었습니다.', 'success');
      setDiscussionStart(response.data.startTime);
    } else if (response.type === DISCUSSION_END) {
      setDiscurreionEnd(response.data.endTime);
      showToast(DISCUSSION_TOAST_MESSAGE.VOTE_THRESHOLD_REACHED, 'success');
      router.push(`/agoras/${response.data.agoraId}/flow/end-agora`);
    }
  };

  const subscribeErrorControl = useCallback(
    async (err: any) => {
      await chatSocketErrorHandler(err);

      setSocketError({
        ...socketError,
        isError: true,
      });
    },
    [setSocketError, socketError],
  );

  // 최초 렌더링 시 실행

  const disconnect = useCallback(async () => {
    if (!isNull(webSocketClient) && webSocketClientConnected) {
      await webSocketClient.deactivate();
    }
  }, [webSocketClient, webSocketClientConnected]);

  useEffect(() => {
    async function connect() {
      if (isNull(session?.user.accessToken)) {
        showToast('로그인이 필요합니다.', 'error');
        await signOut({ redirect: true });
      }

      const newClient = new StompJs.Client({
        brokerURL: `${URL.SOCKET_URL}/ws`,
        connectHeaders: {
          Authorization: `Bearer ${session?.user.accessToken}`,
          AgoraId: `${agoraId}`,
        },
        reconnectDelay: 500,
        onConnect: () => {
          setWebSocketClient(newClient);
        },
        onDisconnect: () => {
          setWebSocketClient(null);
        },
        onWebSocketError: async () => {
          setSocketError((prev) => ({
            isError: false,
            count: prev.count + 1,
          }));
        },
        onStompError: async () => {
          setSocketError((prev) => ({
            isError: false,
            count: prev.count + 1,
          }));
        },
      });

      newClient.activate();
    }

    if (socketError.isError && socketError.count < 5) {
      connect();
      setSocketError((prev) => ({
        isError: false,
        count: prev.count + 1,
      }));
    }
    if (socketError.count >= 5) {
      showToast(
        '서버 연결이 불안정합니다. 잠시 후 다시 시도해주세요.',
        'error',
      );
      disconnect();
      mutation.mutate();
    }
    if (isPossibleConnect()) {
      connect();
    }

    return () => {
      voteResultReset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    agoraId,
    socketError.isError,
    router,
    setDiscussionStart,
    enterAgora.status,
    URL.SOCKET_URL,
  ]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  useEffect(() => {
    const subscribeMeta = () => {
      // getMetadata();
      if (isNull(webSocketClient) || !webSocketClientConnected) return;

      webSocketClient.subscribe(
        `/topic/agoras/${agoraId}`,
        async (received_message: StompJs.IFrame) => {
          const data = await JSON.parse(received_message.body);
          // console.log('received_message', received_message);
          handleWebSocketResponse(data);
        },
      );

      if (socketError.isError) {
        setSocketError({
          ...socketError,
          isError: false,
        });
      }
    };

    function subscribeError() {
      // console.log('Subscribing Error...');
      if (isNull(webSocketClient) || !webSocketClientConnected) return;
      webSocketClient.subscribe(
        '/user/queue/errors',
        async (received_message: StompJs.IFrame) => {
          const data = JSON.parse(received_message.body);
          subscribeErrorControl(data);
        },
      );
    }
    subscribeMeta();
    subscribeError();
  }, [webSocketClientConnected, socketError, subscribeErrorControl]);

  useEffect(() => {
    getUrl();

    return () => {
      reset();
    };
  }, [reset, getUrl]);

  // 브라우저 뒤로가기 버튼 클릭 시 페이지 이탈 방지 모달 띄우기
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      window.history.pushState(null, '', window.location.pathname); // 뒤로가기 무효화
      handleBack();
    };

    window.history.pushState(null, '', window.location.pathname); // 현재 상태 추가
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useUnloadDisconnectSocket({
    mutation: mutation.mutate,
    agoraStatus: enterAgora.status,
  });

  const memoizedTitle = useMemo(() => {
    return (
      metaData?.agora.title ||
      enterAgora.title ||
      '다양한 사람들과 토론에 함께하세요!'
    );
  }, [metaData?.agora.title, enterAgora.title]);

  return (
    <div className="flex flex-col w-full h-full justify-center dark:text-white dark:text-opacity-85">
      <div className="flex justify-between items-center pb-10 border-b-1 border-gray-200 dark:border-dark-bg-light">
        <BackButton onClick={handleBack} />
        <div className="flex justify-center items-center text-xs">
          <DiscussionStatus meta={metaData} />
        </div>
        <MenuItems
          memoizedTitle={memoizedTitle}
          toggle={toggle}
          refetchAgoraUserList={refetchAgoraUserList}
          isClosed={enterAgora.status === AGORA_STATUS.CLOSED}
        />
      </div>
      <div className="flex justify-center items-center">
        <AgoraInfo
          title={memoizedTitle}
          isClosed={enterAgora.status === AGORA_STATUS.CLOSED}
          pros={participants.pros}
          cons={participants.cons}
        />
      </div>
    </div>
  );
}
