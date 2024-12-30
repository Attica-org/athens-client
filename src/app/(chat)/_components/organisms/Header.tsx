'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import BackButton from '../../../_components/atoms/BackButton';
import ShareButton from '../molecules/ShareButton';
import AgoraInfo from '../molecules/AgoraInfo';
import HamburgerButton from '../atoms/HamburgerButton';
import DiscussionStatus from '../molecules/DiscussionStatus';
import patchChatExit from '../../_lib/patchChatExit';
import SocketErrorHandler from '../../utils/SocketErrorHandler';

type Props = {
  memoizedTitle: string;
  toggle: () => void;
  refetchAgoraUserList: () => void;
};

const MenuItems = React.memo(function MenuItems({
  memoizedTitle,
  toggle,
  refetchAgoraUserList,
}: Props) {
  return (
    <div className="flex justify-end items-center mr-0.5rem">
      <ShareButton title={memoizedTitle} />
      <HamburgerButton
        toggleMenu={toggle}
        refetchUserList={refetchAgoraUserList}
      />
    </div>
  );
});

export default function Header() {
  const { toggle } = useSidebarStore(
    useShallow((state) => ({ toggle: state.toggle })),
  );
  const { enterAgora } = useAgora(
    useShallow((state) => ({ enterAgora: state.enterAgora })),
  );
  const { setTitle, setDiscussionStart, setDiscurreionEnd, reset } =
    useChatInfo(
      useShallow((state) => ({
        setTitle: state.setTitle,
        setDiscussionStart: state.setDiscussionStart,
        setDiscurreionEnd: state.setDiscussionEnd,
        reset: state.reset,
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
  const session = useSession();
  const [agoraId, setAgoraId] = useState(enterAgora.id);
  const client = useRef<StompJs.Client>();
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
  };

  const callChatExitAPI = async () => {
    return patchChatExit({ agoraId });
  };

  const onSuccessChatExit = (response: any) => {
    if (response) {
      // 나가기 성공 로직 구현
      router.push(homeSegmentKey);
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
      router.push(homeSegmentKey);
    } else if (
      enterAgora.status === AGORA_STATUS.RUNNING ||
      enterAgora.status === AGORA_STATUS.QUEUED
    ) {
      mutation.mutate();
    }
  };

  const handleBack = async () => {
    const result = await swalBackButtonAlert();

    if (result && result.isConfirmed) {
      handleAgoraExit();
    }
  };

  const isPossibleConnect = () => {
    return (
      navigator.onLine &&
      URL.SOCKET_URL !== '' &&
      enterAgora.status !== AGORA_STATUS.CLOSED
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

  const handleWebSocketResponse = (response: any) => {
    if (response.type === 'META') {
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

      const { socketDisconnectTime, username } = response.data.agoraMemberInfo;
      updateUserAccessMessage(
        socketDisconnectTime,
        response.data.agora.id,
        username,
      );
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

  const subscribeErrorControl = async (err: any) => {
    chatSocketErrorHandler(err);

    setSocketError({
      ...socketError,
      isError: true,
    });
  };
  // 최초 렌더링 시 실행
  useEffect(() => {
    const disconnect = () => {
      client.current?.deactivate();
      // console.log('Disconnected');
    };

    const subscribe = () => {
      // getMetadata();
      client.current?.subscribe(
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
      client.current?.subscribe(
        '/user/queue/errors',
        async (received_message: StompJs.IFrame) => {
          const data = JSON.parse(received_message.body);
          subscribeErrorControl(data);
        },
      );
    }

    async function connect() {
      if (!session.data?.user?.accessToken) {
        showToast('로그인이 필요합니다.', 'error');
        await signOut({ redirect: true });
      }
      client.current = new StompJs.Client({
        brokerURL: `${URL.SOCKET_URL}/ws`,
        connectHeaders: {
          Authorization: `Bearer ${session.data?.user?.accessToken}`,
          AgoraId: `${agoraId}`,
        },
        reconnectDelay: 500,
        onConnect: () => {
          subscribeError();
          subscribe();
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
      client.current.activate();
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
      if (client.current && client.current.connected) {
        disconnect();
      }
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
    getUrl();

    return () => {
      reset();
    };
  }, [reset, getUrl]);

  useUnloadDisconnectSocket({
    client: client.current,
    mutation: mutation.mutate,
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
