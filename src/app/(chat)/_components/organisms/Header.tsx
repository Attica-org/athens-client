'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSidebarStore } from '@/store/sidebar';
import { useShallow } from 'zustand/react/shallow';
// import { useVoteStore } from '@/store/vote';
import { usePathname, useRouter } from 'next/navigation';
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
  // const { voteEnd } = useVoteStore(useShallow((state) => ({
  //   voteEnd: state.voteEnd,
  // })));
  const { setDiscussionStart } = useChatInfo(
    useShallow((state) => ({
      setDiscussionStart: state.setDiscussionStart,
    })),
  );
  const [metaData, setMetaData] = useState<AgoraMeta>();
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const [agoraId, setAgoraId] = useState<string>(usePathname().split('/').pop() as string);
  const client = useRef<StompJs.Client>();

  const toggleMenu = () => {
    toggle();
  };

  // 최초 렌더링 시 실행
  useEffect(() => {
    const disconnect = () => {
      client.current?.deactivate();
      console.log('Disconnected');
    };

    const getMetadata = () => {
      if (client.current) {
        client.current?.publish({
          destination: `/app/agoras/${agoraId}`,
        });
      }
    };

    const subscribe = () => {
      console.log('Subscribing... metadata');
      getMetadata();
      client.current?.subscribe(`/topic/agoras/${agoraId}`, (received_message: StompJs.IFrame) => {
        const data = JSON.parse(received_message.body);
        if (data.type === 'META') {
          setAgoraId(data.data.agora.id);
          setMetaData(data.data);
        } else if (data.type === 'DISCUSSION_START') {
          setDiscussionStart(data.data.startTime);
        } else if (data.type === 'DISCUSSION_END') {
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
          console.log('connected');
          subscribeError();
          subscribe();
        },
        onWebSocketError: () => {
          showToast('웹소켓 연결에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
        },
        onStompError: () => {
          showToast('웹소켓 연결에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
        },
      });
      console.log('Activating... metadata');
      client.current.activate();
    }

    if (enterAgora.status !== 'CLOSED' && navigator.onLine) {
      connect();
    }

    if (isError) {
      connect();
      setIsError(false);
    }

    return () => disconnect();
  }, [agoraId, isError, router, setDiscussionStart, enterAgora.status]);

  useEffect(() => {
    if (enterAgora.status !== 'closed') {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          action: 'initialize',
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        });
      }
    }
  }, [enterAgora.status]);

  // useEffect(() => {
  //   if (voteEnd && enterAgora.status !== 'closed') {
  //     router.push(`/agoras/${agoraId}/flow/result-agora`);
  //   }
  // }, [voteEnd, agoraId, router, enterAgora.status]);

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
        <AgoraTitle title={metaData?.agora.title || ''} pros={metaData?.participants[0]?.count} cons={metaData?.participants[1]?.count} />
      </div>
    </div>
  );
}
