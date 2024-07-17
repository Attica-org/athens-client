'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSidebarStore } from '@/store/sidebar';
import { useShallow } from 'zustand/react/shallow';
import { useRouter } from 'next/navigation';
import { useAgora } from '@/store/agora';
import tokenManager from '@/utils/tokenManager';
import * as StompJs from '@stomp/stompjs';
import { AgoraMeta } from '@/app/model/AgoraMeta';
import { useChatInfo } from '@/store/chatInfo';
import showToast from '@/utils/showToast';
import { getReissuanceToken } from '@/lib/getReissuanceToken';
import { useVoteStore } from '@/store/vote';
import getToken from '@/lib/getToken';
import { useQueryClient } from '@tanstack/react-query';
import getKey from '@/utils/getKey';
import SWManager from '@/utils/SWManager';
import { saveTabId, deleteTabId } from '@/app/_components/utils/indexedDB';
import BackButton from '../../../_components/atoms/BackButton';
import ShareButton from '../molecules/ShareButton';
import AgoraTitle from '../molecules/AgoraTitle';
import HamburgerButton from '../atoms/HamburgerButton';
import DiscussionStatus from '../molecules/DiscussionStatus';

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
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const [agoraId, setAgoraId] = useState(enterAgora.id);
  const client = useRef<StompJs.Client>();
  const queryClient = useQueryClient();
  const [URL, setURL] = useState({
    BASE_URL: '',
    SOCKET_URL: '',
  });
  const tabId = useRef(new Date().getTime().toString());

  const getUrl = async () => {
    const key = await getKey();
    setURL({
      BASE_URL: key.BASE_URL || '',
      SOCKET_URL: key.SOCKET_URL || '',
    });
  };

  useEffect(() => {
    getUrl();

    return () => {
      reset();

      if (tabId.current) {
        SWManager.clearTabId();
        deleteTabId(tabId.current);
      }
    };
  }, [reset]);

  const refetchAgoraUserList = async () => {
    // 유저 리스트 캐시 무효화 및 재요청
    await queryClient.invalidateQueries({
      queryKey: ['chat', 'users', `${agoraId}`],
    });
    await queryClient.refetchQueries({
      queryKey: ['chat', 'users', `${agoraId}`],
      exact: true,
    });
  };

  const toggleMenu = () => {
    toggle();
  };

  // 최초 렌더링 시 실행
  useEffect(() => {
    const disconnect = () => {
      client.current?.deactivate();
      // console.log('Disconnected');
    };

    const subscribe = () => {
      // getMetadata();
      // console.log('Subscribing...');
      client.current?.subscribe(
        `/topic/agoras/${agoraId}`,
        async (received_message: StompJs.IFrame) => {
          const data = await JSON.parse(received_message.body);
          // console.log('received_message', received_message);
          if (data.type === 'META') {
            setTitle(data.data.agora.title);
            setAgoraId(data.data.agora.id);
            setMetaData(data.data);
            refetchAgoraUserList();

            if (data.data.agora.startAt) {
              setDiscussionStart(data.data.agora.startAt);
            }

            const partcipantsCnt = {
              pros: 0,
              cons: 0,
            };
            data.data.participants.forEach(
              (participant: { type: string; count: number }) => {
                if (participant.type === 'PROS') {
                  partcipantsCnt.pros = participant.count;
                } else if (participant.type === 'CONS') {
                  partcipantsCnt.cons = participant.count;
                }
              },
            );

            setParticipants(partcipantsCnt);
          } else if (data.type === 'DISCUSSION_START') {
            // console.log(data.data);
            showToast('토론이 시작되었습니다.', 'success');
            setDiscussionStart(data.data.startTime);
          } else if (data.type === 'DISCUSSION_END') {
            setDiscurreionEnd(data.data.endTime);
            showToast(
              '유저의 2/3 이상이 토론 종료를 선택하여 종료되었습니다.',
              'success',
            );
            router.push(`/agoras/${data.data.agoraId}/flow/end-agora`);
          }
          // console.log(`> Received message: ${received_message.body}`);
        },
      );
    };

    function subscribeError() {
      // console.log('Subscribing Error...');
      client.current?.subscribe(
        '/user/queue/errors',
        async (received_message: StompJs.IFrame) => {
          const data = JSON.parse(received_message.body);
          if (data.code === 1201) {
            await getToken();
          } else if (data.code === 1003) {
            await getReissuanceToken();
          } else if (data.code === 2000) {
            showToast(
              '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
              'error',
            );
          } else if (data.code === 2001) {
            showToast(
              '연결이 불안정합니다. 잠시 후 다시 시도해주세요.',
              'error',
            );
          } else if (data.code === 1102) {
            showToast('관찰자는 메시지를 보낼 수 없습니다.', 'error');
          } else if (data.code === 1301) {
            if (data.message === 'Session not found') {
              showToast('현재 아고라에 존재하지 않는 유저입니다.', 'error');
            } else {
              showToast('존재하지 않는 아고라입니다.', 'error');
            }
          }
          setIsError(true);
        },
      );
    }

    function connect() {
      client.current = new StompJs.Client({
        brokerURL: `${URL.SOCKET_URL}/ws`,
        connectHeaders: {
          Authorization: `Bearer ${tokenManager.getToken()}`,
          AgoraId: `${agoraId}`,
        },
        reconnectDelay: 500,
        onConnect: () => {
          // console.log('connected');
          subscribeError();
          subscribe();
        },
        onWebSocketError: async () => {
          // showToast('네트워크가 불안정합니다.', 'error');
          // await getReissuanceToken();
          // router.replace('/home');
        },
        onStompError: async () => {
          // showToast('서버 연결이 불안정합니다.', 'error');
          // await getReissuanceToken();
        },
      });
      // console.log('Activating... metadata');
      client.current.activate();
    }

    if (
      navigator.onLine &&
      URL.SOCKET_URL !== '' &&
      enterAgora.status !== 'CLOSED'
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
      voteResultReset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    agoraId,
    isError,
    router,
    setDiscussionStart,
    enterAgora.status,
    URL.SOCKET_URL,
  ]);

  useEffect(() => {
    if (!URL.BASE_URL) return;

    if (enterAgora.status !== 'CLOSED') {
      saveTabId(tabId.current);
      SWManager.setTabId(tabId.current);

      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          action: 'initialize',
          tabId: tabId.current,
          baseUrl: URL.BASE_URL,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterAgora.status, URL.BASE_URL]);

  return (
    <div className="flex flex-col w-full h-full justify-center dark:text-white dark:text-opacity-85">
      <div className="flex justify-between items-center pb-10 border-b-1 border-gray-200 dark:border-dark-bg-light">
        <BackButton />
        <div className="flex justify-center items-center text-sm under-mobile:text-xs">
          <DiscussionStatus meta={metaData} />
        </div>
        <div className="flex justify-end items-center mr-0.5rem">
          <ShareButton title={metaData?.agora.title || ''} />
          <HamburgerButton toggleMenu={toggleMenu} />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <AgoraTitle
          title={metaData?.agora.title || enterAgora.title || ''}
          isClosed={enterAgora.status === 'CLOSED'}
          pros={participants.pros}
          cons={participants.cons}
        />
      </div>
    </div>
  );
}
