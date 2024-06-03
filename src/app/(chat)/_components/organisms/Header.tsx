'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSidebarStore } from '@/store/sidebar';
import { useShallow } from 'zustand/react/shallow';
import { useVoteStore } from '@/store/vote';
import { usePathname, useRouter } from 'next/navigation';
import { useAgora } from '@/store/agora';
import tokenManager from '@/utils/tokenManager';
import * as StompJs from '@stomp/stompjs';
import { AgoraMeta } from '@/app/model/AgoraMeta';
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
  const { voteEnd } = useVoteStore(useShallow((state) => ({
    voteEnd: state.voteEnd,
  })));
  const [metaData, setMetaData] = useState<AgoraMeta>();
  const router = useRouter();
  const agoraId = usePathname().split('/').pop() as string;
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
        setMetaData(JSON.parse(received_message.body).data);
        console.log(`> Received message: ${received_message.body}`);
      });
    };

    const connect = () => {
      console.log('Connecting... metadata');
      client.current = new StompJs.Client({
        brokerURL: 'ws://localhost:8080/ws',
        connectHeaders: {
          Authorization: `Bearer ${tokenManager.getToken()}`,
        },
        reconnectDelay: 200,
        onConnect: () => {
          console.log('connected');
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
      console.log('Activating... metadata');
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

  useEffect(() => {
    if (voteEnd && enterAgora.status !== 'closed') {
      console.log('최종 투표 종료');
      // router.push(`/agoras/${agoraId}/flow/result-agora`);
    }
  }, [voteEnd, agoraId, router, enterAgora.status]);

  // TODO: 메타데이터 웹 소켓 연결

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
        <AgoraTitle title={metaData?.agora.title || ''} pros={metaData?.participants[0].count} cons={metaData?.participants[1].count} />
      </div>
    </div>
  );
}
