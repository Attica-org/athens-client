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
import toast from 'react-hot-toast';
import showToast from '@/utils/showToast';
import { getReissuanceToken } from '@/lib/getReissuanceToken';
import BackButton from '../../../_components/atoms/BackButton';
import ShareButton from '../atoms/ShareButton';
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
  const { setDiscussionStart, setDiscurreionEnd, reset } = useChatInfo(
    useShallow((state) => ({
      setDiscussionStart: state.setDiscussionStart,
      setDiscurreionEnd: state.setDiscussionEnd,
      reset: state.reset,
    })),
  );
  const [metaData, setMetaData] = useState<AgoraMeta>();
  const [participants, setParticipants] = useState<{ pros: number; cons: number }>({
    pros: 0, cons: 0,
  });
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const [agoraId, setAgoraId] = useState(enterAgora.id);
  const client = useRef<StompJs.Client>();

  const toggleMenu = () => {
    toggle();
  };

  // 최초 렌더링 시 실행
  useEffect(() => {
    const disconnect = () => {
      client.current?.deactivate();
      // console.log('Disconnected');
    };

    const getMetadata = () => {
      if (client.current) {
        client.current?.publish({
          destination: `/app/agoras/${agoraId}`,
        });
      }
    };

    const subscribe = () => {
      // console.log('Subscribing... metadata');
      getMetadata();
      client.current?.subscribe(`/topic/agoras/${agoraId}`, (received_message: StompJs.IFrame) => {
        const data = JSON.parse(received_message.body);
        if (data.type === 'META') {
          setAgoraId(data.data.agora.id);
          setMetaData(data.data);
          if (data.data.agora.startAt) {
            setDiscussionStart(data.data.agora.startAt);
          }

          data.data.participants.forEach((participant: { type: string; count: number }) => {
            if (participant.type === 'PROS') {
              setParticipants((prev) => ({ ...prev, pros: participant.count }));
            } else if (participant.type === 'CONS') {
              setParticipants((prev) => ({ ...prev, cons: participant.count }));
            }
          });
        } else if (data.type === 'DISCUSSION_START') {
          // console.log(data.data);
          setDiscussionStart(data.data.startTime);
        } else if (data.type === 'DISCUSSION_END') {
          setDiscurreionEnd(data.data.endTime);
          toast('토론이 종료되었습니다.');
          router.push(`/agoras/${data.data.agoraId}/flow/end-agora`);
        }
        console.log(`> Received message: ${received_message.body}`);
      });
    };

    function subscribeError() {
      console.log('Subscribing Error...');
      client.current?.subscribe('/user/queue/errors', async (received_message: StompJs.IFrame) => {
        const data = JSON.parse(received_message.body);
        if (data.code === 1201 || data.code === 1003) {
          await getReissuanceToken();
        } else if (data.code === 2000) {
          console.log(data.message);
          showToast('오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
        } else if (data.code === 2001) {
          showToast('연결이 불안정합니다. 잠시 후 다시 시도해주세요.', 'error');
        }
        setIsError(true);
      });
    }

    function connect() {
      client.current = new StompJs.Client({
        brokerURL: `${process.env.NEXT_PUBLIC_SOCKET_URL}/ws`,
        connectHeaders: {
          Authorization: `Bearer ${tokenManager.getToken()}`,
        },
        reconnectDelay: 200,
        onConnect: () => {
          // console.log('connected');
          subscribeError();
          subscribe();
        },
        onWebSocketError: () => {
          showToast('네트워크가 불안정합니다.', 'error');
          router.replace('/home');
        },
        onStompError: async () => {
          await getReissuanceToken();
          connect();
        },
      });
      // console.log('Activating... metadata');
      client.current.activate();
    }

    if (navigator.onLine) {
      connect();
    }

    if (isError) {
      connect();
      setIsError(false);
    }

    return () => {
      disconnect();
      reset();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agoraId, isError, router, setDiscussionStart, enterAgora.status]);

  useEffect(() => {
    if (enterAgora.status !== 'CLOSED') {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          action: 'initialize',
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        });
      }
    }
  }, [enterAgora.status]);

  return (
    <div className="flex flex-col w-full justify-center dark:text-white dark:text-opacity-85">
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
      <div className="flex justify-center items-center pt-0.5rem">
        <AgoraTitle title={metaData?.agora.title || ''} pros={participants.pros} cons={participants.cons} />
      </div>
    </div>
  );
}
