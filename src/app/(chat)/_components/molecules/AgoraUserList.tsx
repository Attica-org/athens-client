'use client';

import React, { useCallback, useEffect } from 'react';
import { KickVoteResponse, ParticipationPosition } from '@/app/model/Agora';
import { AGORA_POSITION } from '@/constants/agora';
import { PROFLELIST } from '@/constants/consts';
import { useMutation } from '@tanstack/react-query';
import { useChatInfo } from '@/store/chatInfo';
import { useShallow } from 'zustand/react/shallow';
import { useAgora } from '@/store/agora';
import { useWebSocketClient } from '@/store/webSocket';
import * as StompJs from '@stomp/stompjs';
import isNull from '@/utils/validation/validateIsNull';
import { useRouter } from 'next/navigation';
import { homeSegmentKey } from '@/constants/segmentKey';
import useApiError from '@/hooks/useApiError';
import { useKickedStore } from '@/store/kick';
import showToast from '@/utils/showToast';
import UserImage from '../../../_components/atoms/UserImage';
import { postKickVote } from '../../_lib/postKickVote';
import patchChatExit from '../../_lib/patchChatExit';
import { resetStateOnChatExit } from '../../utils/resetStateOnChatExit';

type UserList = {
  id: number;
  nickname: string;
  photoNumber: number;
  type: ParticipationPosition;
};

type Props = {
  position: ParticipationPosition;
  userList: UserList[];
  subscribeCount: React.MutableRefObject<number>;
  decrementSubscribeCount: () => void;
};

type KickMutationProps = {
  targetMemberId: number;
  currentMemberCount: number;
  agoraId: number;
};

export default function AgoraUserList({
  position,
  userList,
  subscribeCount,
  decrementSubscribeCount,
}: Props) {
  const { participants } = useChatInfo(
    useShallow((state) => ({
      participants: state.participants,
    })),
  );

  const { enterAgora } = useAgora(
    useShallow((state) => ({
      enterAgora: state.enterAgora,
    })),
  );

  const { webSocketClient, webSocketClientConnected } = useWebSocketClient(
    useShallow((state) => ({
      webSocketClient: state.webSocketClient,
      webSocketClientConnected: state.webSocketClientConnected,
    })),
  );

  const kickVoteMutation = useMutation({
    mutationFn: async ({
      targetMemberId,
      currentMemberCount,
      agoraId,
    }: KickMutationProps) =>
      postKickVote(targetMemberId, currentMemberCount, agoraId),
    onSuccess: (response) => {
      if (response.success) {
        showToast('강퇴 투표에 성공하였습니다.', 'success');
        return;
      }

      showToast('강퇴 투표에 실패하였습니다', 'error');
    },
  });

  const { setKicked } = useKickedStore(
    useShallow((state) => ({
      setKicked: state.setKicked,
    })),
  );

  const router = useRouter();
  const { handleError } = useApiError();

  const handleKick = (targetMemberId: number, agoraId: number) => {
    const currentMemberCount = participants.size;

    kickVoteMutation.mutate({ targetMemberId, currentMemberCount, agoraId });
  };

  const callChatExitAPI = async () => patchChatExit({ agoraId: enterAgora.id });

  const handleApprovedKickVote = (response: any) => {
    if (!isNull(response)) {
      setKicked(true);
      resetStateOnChatExit();
      router.replace(`${homeSegmentKey}?status=active`);
    }
  };

  const handleApprovedKickVoteMutation = useMutation({
    mutationFn: callChatExitAPI,
    onSuccess: (response) => handleApprovedKickVote(response),
    onError: async (error) => {
      await handleError(error, handleApprovedKickVoteMutation.mutate);
    },
  });

  const isKickVoteApproved = (response: KickVoteResponse) =>
    response.type === 'KICK' &&
    enterAgora.userId === response.kickVoteInfo.targetMemberId;

  const handleKickVoteResponse = useCallback(
    (response: KickVoteResponse) => {
      if (isKickVoteApproved(response)) {
        handleApprovedKickVoteMutation.mutate();
      }
    },
    [enterAgora.userId],
  );

  useEffect(() => {
    function subscribeKickVote() {
      if (
        isNull(webSocketClient) ||
        !webSocketClientConnected ||
        subscribeCount.current <= 0
      )
        return;

      decrementSubscribeCount();
      webSocketClient.subscribe(
        `/topic/agoras/${enterAgora.id}/kick`,
        async (receivedMessage: StompJs.IFrame) => {
          const response = await JSON.parse(receivedMessage.body);
          handleKickVoteResponse(response);
        },
      );
    }
    subscribeKickVote();
  }, [webSocketClientConnected]);

  return (
    <div className="pb-0.5rem">
      <h3
        aria-label={
          position === AGORA_POSITION.PROS
            ? '찬성측 참여자 목록'
            : '반대측 참여자 목록'
        }
        id={position}
        className="foldable:text-sm text-xs pb-10 lg:pb-1rem dark:text-white dark:text-opacity-85"
      >
        {position === AGORA_POSITION.PROS ? '찬성측' : '반대측'}
      </h3>
      <ul
        aria-labelledby={position}
        className="flex flex-col justify-center items-start"
      >
        {userList.map(
          (user) =>
            user.type !== AGORA_POSITION.OBSERVER &&
            user.type === position && (
              <li
                className="w-full flex justify-between items-center pb-1rem"
                key={user.id}
              >
                <div className="flex items-center">
                  <UserImage
                    aria-hidden
                    className="w-40 h-40 bg-white"
                    file={
                      user.photoNumber
                        ? PROFLELIST[user.photoNumber - 1].file
                        : PROFLELIST[0].file
                    }
                    name={user.nickname}
                    w={40}
                    h={40}
                  />
                  <div className="ml-0.5rem text-sm dark:text-white dark:text-opacity-85">
                    {user.nickname}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleKick(user.id, enterAgora.id)}
                  onKeyDown={() => handleKick(user.id, enterAgora.id)}
                  className="w-70 h-24 text-xs bg-red-500 text-white rounded-md"
                >
                  추방하기
                </button>
              </li>
            ),
        )}
      </ul>
    </div>
  );
}
