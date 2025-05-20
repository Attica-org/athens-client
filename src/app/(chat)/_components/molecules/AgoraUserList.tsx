'use client';

import React, { useCallback, useEffect } from 'react';
import { KickVoteResponse, ParticipantPosition } from '@/app/model/Agora';
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
import { kickedUsers } from '@/store/kickedUser';
import { useEnter } from '@/store/enter';
import UserImage from '../../../_components/atoms/UserImage';
import { postKickVote } from '../../_lib/postKickVote';
import patchChatExit from '../../_lib/patchChatExit';
import { resetStateOnChatExit } from '../../utils/resetStateOnChatExit';

type UserList = {
  id: number;
  nickname: string;
  photoNumber: number;
  type: ParticipantPosition;
};

type Props = {
  position: ParticipantPosition;
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
  const router = useRouter();
  const { handleError } = useApiError();

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

  const { participants, removeParticipant } = useChatInfo(
    useShallow((state) => ({
      participants: state.participants,
      removeParticipant: state.removeParticipant,
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
    onError: async (error, variables) => {
      await handleError(error, () => kickVoteMutation.mutate(variables));
    },
  });

  const { setKicked } = useKickedStore(
    useShallow((state) => ({
      setKicked: state.setKicked,
    })),
  );

  const handleKick = (
    targetMemberId: number,
    agoraId: number,
    nickname: string,
  ) => {
    if (useEnter.getState().nickname === nickname) {
      showToast('자신에게 투표할 수 없습니다.', 'error');
      return;
    }

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
    response.type === 'KICK';

  const amIKicked = (response: KickVoteResponse) =>
    enterAgora.userId === response.kickVoteInfo.targetMemberId;

  const handleKickVoteResponse = useCallback(
    (response: KickVoteResponse) => {
      const { kickVoteInfo } = response;

      if (isNull(kickVoteInfo)) return;
      if (isKickVoteApproved(response)) {
        if (amIKicked(response)) {
          handleApprovedKickVoteMutation.mutate();
          return;
        }
        // 내가 강퇴된 것이 아니라면, 강퇴된 유저를 id에 추가
        removeParticipant(kickVoteInfo.targetMemberId);
        kickedUsers.addUserName(kickVoteInfo.nickname);
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

  const handleKickByKeyboard =
    (userId: number, agoraId: number, nickname: string) =>
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter') {
        handleKick(userId, agoraId, nickname);
      }
    };

  return (
    <div className="pb-0.5rem" aria-labelledby={position}>
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
      <ul className="flex flex-col justify-center items-start">
        {userList.map(
          (user) =>
            user.type !== AGORA_POSITION.OBSERVER &&
            user.type === position && (
              <li
                className="w-full flex justify-between items-center pb-1rem"
                key={user.id}
              >
                <span className="flex items-center">
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
                  <span className="ml-0.5rem text-sm dark:text-white dark:text-opacity-85">
                    {user.nickname}
                  </span>
                </span>
                <button
                  type="button"
                  aria-label={`${position === AGORA_POSITION.PROS ? '찬성측' : '반대측'} 참여자 ${user.nickname} 추방하기`}
                  onClick={() =>
                    handleKick(user.id, enterAgora.id, user.nickname)
                  }
                  onKeyDown={handleKickByKeyboard(
                    user.id,
                    enterAgora.id,
                    user.nickname,
                  )}
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
