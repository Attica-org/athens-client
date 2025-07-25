'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useRouter } from 'next/navigation';
import { useAgora } from '@/store/agora';
import * as StompJs from '@stomp/stompjs';
import {
  AgoraMemberInfo,
  AgoraMeta,
  Participants,
} from '@/app/model/AgoraMeta';
import { useChatInfo } from '@/store/chatInfo';
import showToast from '@/utils/showToast';
import { useVoteStore } from '@/store/vote';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import getKey from '@/utils/getKey';
import { getAgoraUserListQueryKey } from '@/constants/queryKey';
import {
  STORAGE_PREVIOUSE_URL_KEY,
  homeSegmentKey,
} from '@/constants/segmentKey';
import { AGORA_POSITION, AGORA_STATUS } from '@/constants/agora';
import { swalBackButtonAlert } from '@/utils/swalAlert';
import useApiError from '@/hooks/useApiError';
import { signOut, useSession } from 'next-auth/react';
import { DISCUSSION_TOAST_MESSAGE } from '@/constants/chats';
import { useUnloadDisconnectSocket } from '@/hooks/useUnloadDisconnectSocket';

import { useMessageStore } from '@/store/message';
import isNull from '@/utils/validation/validateIsNull';

import { useWebSocketClient } from '@/store/webSocket';
import { useEnter } from '@/store/enter';
import { kickedUsers } from '@/store/kickedUser';
import { AccessStatus } from '@/app/model/AccessStatus';
import { AgoraId } from '@/app/model/Agora';
import {
  ChatExitResponse,
  WebSocketErrorResponse,
  WebSocketResponse,
} from '@/app/model/Chat';
import BackButton from '../../../_components/atoms/BackButton';
import AgoraInfo from '../molecules/AgoraInfo';
import DiscussionStatus from '../molecules/DiscussionStatus';
import patchChatExit from '../../_lib/patchChatExit';
import SocketErrorHandler from '../../utils/SocketErrorHandler';
import { resetStateOnChatExit } from '../../utils/resetStateOnChatExit';
import MenuItems from '../molecules/MenuItems';
import { updateUserAccessMessage } from '../../utils/updateUserAccessMessage';

export default function Header() {
  const { enterAgora } = useAgora(
    useShallow((state) => ({
      enterAgora: state.enterAgora,
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
  const [participants, setParticipants] = useState({
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
  const { data: session } = useSession();
  const { chatSocketErrorHandler } = SocketErrorHandler();
  const [agoraId, setAgoraId] = useState<AgoraId>(enterAgora.id);

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
    return false;
  };

  const onSuccessChatExit = (response: ChatExitResponse | boolean) => {
    // 채팅방 정보 및 유저 채팅 프로필 정보 초기화
    const isSuccess =
      (typeof response !== 'boolean' && !isNull(response)) ||
      (typeof response === 'boolean' && response);

    if (isSuccess) {
      resetStateOnChatExit();

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
        !isNull(URL.SOCKET_URL) &&
        enterAgora.status === AGORA_STATUS.QUEUED) ||
      enterAgora.status === AGORA_STATUS.RUNNING
    );
  };
  const updateParticipantList = ({
    socketDisconnectTime,
    memberId,
    username,
  }: Omit<AgoraMemberInfo, 'agoraId'>) => {
    if (isNull(username)) return;

    if (isNull(socketDisconnectTime)) {
      addParticipant(memberId, username);
      return;
    }
    removeParticipant(memberId);
  };

  const handleWebSocketResponse = (response: WebSocketResponse) => {
    switch (response.type) {
      case 'META': {
        const {
          agora,
          participants: chatParticipants,
          agoraMemberInfo,
        } = response.data;

        setTitle(agora.title);
        setAgoraId(agora.id);
        setMetaData(response.data);

        if (agora.startAt) {
          setDiscussionStart(agora.startAt);
        }

        const partcipantsCnt = {
          pros: 0,
          cons: 0,
        };

        chatParticipants.forEach((participant: Participants) => {
          if (participant.type === AGORA_POSITION.PROS) {
            partcipantsCnt.pros = participant.count;
          } else if (participant.type === AGORA_POSITION.CONS) {
            partcipantsCnt.cons = participant.count;
          }
        });

        setParticipants(partcipantsCnt);

        const { socketDisconnectTime, username, memberId } = agoraMemberInfo;
        let accessStatus: AccessStatus;

        if (isNull(socketDisconnectTime)) {
          accessStatus = AccessStatus.ENTER;
        } else if (kickedUsers.hasUserName(username)) {
          accessStatus = AccessStatus.KICKED;
        } else accessStatus = AccessStatus.EXIT;

        updateUserAccessMessage(queryClient, agora.id, username, accessStatus);
        setGoDown(true);
        updateParticipantList({ socketDisconnectTime, memberId, username });
        kickedUsers.removeUserName(memberId.toString());

        break;
      }
      case 'DISCUSSION_START':
        showToast('토론이 시작되었습니다.', 'success');
        setDiscussionStart(response.data.startTime);

        break;

      case 'DISCUSSION_END':
        setDiscurreionEnd(response.data.endTime);
        showToast(DISCUSSION_TOAST_MESSAGE.VOTE_THRESHOLD_REACHED, 'success');
        router.push(`/agoras/${response.data.agoraId}/flow/end-agora`);

        break;

      default:
        break;
    }
  };

  const subscribeErrorControl = useCallback(
    async (err: WebSocketErrorResponse) => {
      await chatSocketErrorHandler(err, session);

      setSocketError({
        ...socketError,
        isError: true,
      });
    },
    [setSocketError, socketError],
  );

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
      if (isNull(webSocketClient) || !webSocketClientConnected) return;

      webSocketClient.subscribe(
        `/topic/agoras/${agoraId}`,
        async (received_message: StompJs.IFrame) => {
          const data = await JSON.parse(received_message.body);
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
    const isChatModalPath = (previousPath: string, pathname: string) => {
      if (
        previousPath === `${pathname}/flow/social-share` ||
        previousPath === `${pathname}/flow/end-agora` ||
        previousPath === `${pathname}/flow/result-agora` ||
        previousPath === `${pathname}/upload-image`
      ) {
        return true;
      }
      return false;
    };

    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      const { pathname } = window.location;
      window.history.pushState(null, '', pathname); // 뒤로가기 무효화

      const previousPath =
        sessionStorage.getItem(STORAGE_PREVIOUSE_URL_KEY) ?? '';

      if (isChatModalPath(previousPath, pathname)) {
        sessionStorage.setItem(STORAGE_PREVIOUSE_URL_KEY, pathname);

        return;
      }

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
      enterAgora.agoraTitle ||
      '다양한 사람들과 토론에 함께하세요!'
    );
  }, [metaData?.agora.title, enterAgora.agoraTitle]);

  return (
    <div className="flex flex-col w-full h-full justify-center dark:text-white dark:text-opacity-85">
      <div className="flex justify-between items-center pb-10 border-b-1 border-gray-200 dark:border-dark-bg-light">
        <BackButton onClick={handleBack} />
        <div className="flex justify-center items-center text-xs">
          <DiscussionStatus meta={metaData} />
        </div>
        <MenuItems
          memoizedTitle={memoizedTitle}
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
