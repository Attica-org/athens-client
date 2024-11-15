'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSidebarStore } from '@/store/sidebar';
import { useShallow } from 'zustand/react/shallow';
import { useRouter } from 'next/navigation';
import { useAgora } from '@/store/agora';
import * as StompJs from '@stomp/stompjs';
import { AgoraMeta } from '@/app/model/AgoraMeta';
import { useChatInfo } from '@/store/chatInfo';
import showToast from '@/utils/showToast';
import { useVoteStore } from '@/store/vote';
import getToken from '@/lib/getToken';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import getKey from '@/utils/getKey';
import { getAgoraUserListQueryKey } from '@/constants/queryKey';
import { homeSegmentKey } from '@/constants/segmentKey';
import { AGORA_POSITION, AGORA_STATUS } from '@/constants/agora';
import { swalConfirmCancelAlert } from '@/utils/swalAlert';
import { AUTHORIZATION_FAIL } from '@/constants/authErrorMessage';
import { signOutWithCredentials } from '@/serverActions/auth';
import useApiError from '@/hooks/useApiError';
import { signOut, useSession } from 'next-auth/react';
import { CHAT_SOCKET_ERROR_MESSAGE } from '@/constants/responseErrorMessage';
import {
  DISCUSSION_END,
  DISCUSSION_START,
  DISCUSSION_TOAST_MESSAGE,
} from '@/constants/chats';
import { useUnloadDisconnectSocket } from '@/hooks/useUnloadDisconnectSocket';
import useUpdateSession from '@/hooks/useUpdateSession';
import BackButton from '../../../_components/atoms/BackButton';
import ShareButton from '../molecules/ShareButton';
import AgoraInfo from '../molecules/AgoraInfo';
import HamburgerButton from '../atoms/HamburgerButton';
import DiscussionStatus from '../molecules/DiscussionStatus';
import patchChatExit from '../../_lib/patchChatExit';

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
  const router = useRouter();
  const { handleError } = useApiError();
  const { callReissueFn } = useUpdateSession();
  const session = useSession();
  const [agoraId, setAgoraId] = useState(enterAgora.id);
  const client = useRef<StompJs.Client>();
  const queryClient = useQueryClient();
  const [URL, setURL] = useState({
    BASE_URL: '',
    SOCKET_URL: '',
  });

  const getUrl = async () => {
    const key = await getKey();
    setURL({
      BASE_URL: key.BASE_URL || '',
      SOCKET_URL: key.SOCKET_URL || '',
    });
  };

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
    onError: (error) => {
      handleError(error);
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
    const result = await swalConfirmCancelAlert.fire({
      icon: 'warning',
      title: '아고라를 나가시겠습니까?',
      text: '설정한 프로필은 초기화됩니다.',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });

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

  const handleWebSocketResponse = (response: any) => {
    if (response.type === 'META') {
      setTitle(response.data.agora.title);
      setAgoraId(response.data.agora.id);
      setMetaData(response.data);
      // console.log('META', response.data);
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
    if (err.code === 1201) {
      await getToken();
    } else if (err.code === 1003) {
      const reissuResult = await callReissueFn();
      if (reissuResult === AUTHORIZATION_FAIL) {
        showToast('세션이 만료되었습니다.', 'info');
        signOutWithCredentials();
        router.replace('/');
      }
    } else if (err.code === 2000) {
      showToast(
        '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        'error',
      );
    } else if (err.code === 2001) {
      showToast('연결이 불안정합니다. 잠시 후 다시 시도해주세요.', 'error');
    } else if (err.code === 1102) {
      if (
        err.message === CHAT_SOCKET_ERROR_MESSAGE.OBSERVER_MESSAGE_SEND_ERROR
      ) {
        showToast('관찰자는 메시지를 보낼 수 없습니다.', 'error');
      } else if (err.message === CHAT_SOCKET_ERROR_MESSAGE.USER_NOT_FOUND) {
        showToast('유저를 찾을 수 없습니다.', 'error');
      }
    } else if (err.code === 1301) {
      if (err.message === CHAT_SOCKET_ERROR_MESSAGE.SESSION_NOT_FOUND) {
        showToast('현재 아고라에 존재하지 않는 유저입니다.', 'error');
      } else {
        showToast('존재하지 않는 아고라입니다.', 'error');
      }
    } else if (err.code === 1303) {
      showToast('존재하지 않는 채팅에 반응을 보낼 수 없습니다.', 'error');
    } else if (err.code === 1001) {
      if (err.message === CHAT_SOCKET_ERROR_MESSAGE.REACTION_TYPE_INVALID) {
        showToast('리액션 타입이 잘못되었습니다.', 'error');
      } else if (
        err.message === CHAT_SOCKET_ERROR_MESSAGE.REACTION_TYPE_IS_NULL
      ) {
        showToast('리액션 타입이 비어있습니다.', 'error');
      } else if (err.message === CHAT_SOCKET_ERROR_MESSAGE.CHAT_TYPE_INVALID) {
        showToast('채팅 타입이 잘못되었습니다.', 'error');
      } else if (err.message === CHAT_SOCKET_ERROR_MESSAGE.CHAT_TYPE_IS_NULL) {
        showToast('채팅 타입이 비어있습니다.', 'error');
      } else;
    }
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

    function connect() {
      if (!session.data?.user.accessToken) {
        showToast('로그인이 필요합니다.', 'error');
        signOut();
      }
      client.current = new StompJs.Client({
        brokerURL: `${URL.SOCKET_URL}/ws`,
        connectHeaders: {
          Authorization: `Bearer ${session.data?.user.accessToken}`,
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
  }, [reset]);

  useUnloadDisconnectSocket({
    client: client.current,
    mutation: mutation.mutate,
  });

  return (
    <div className="flex flex-col w-full h-full justify-center dark:text-white dark:text-opacity-85">
      <div className="flex justify-between items-center pb-10 border-b-1 border-gray-200 dark:border-dark-bg-light">
        <BackButton onClick={handleBack} />
        <div className="flex justify-center items-center text-sm under-mobile:text-xs">
          <DiscussionStatus meta={metaData} />
        </div>
        <div className="flex justify-end items-center mr-0.5rem">
          <ShareButton title={metaData?.agora.title || ''} />
          <HamburgerButton
            toggleMenu={toggle}
            refetchUserList={refetchAgoraUserList}
          />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <AgoraInfo
          title={metaData?.agora.title || enterAgora.title || ''}
          isClosed={enterAgora.status === AGORA_STATUS.CLOSED}
          pros={participants.pros}
          cons={participants.cons}
        />
      </div>
    </div>
  );
}
