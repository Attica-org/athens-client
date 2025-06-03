import { getUserReactionQueryKey } from '@/constants/queryKey';
import { Message as IMessage, Message } from '@/app/model/Message';
import { QueryClient } from '@tanstack/query-core';
import React from 'react';
import isNull from '@/utils/validation/validateIsNull';
import { AgoraId } from '@/app/model/Agora';
import MyMessage from '../atoms/MyMessage';
import YourMessage from '../atoms/YourMessage';
import UserAccessNotification from '../atoms/UserAccessNotification';

type MessageItemProps = {
  message: IMessage;
  isMyType: (type: Message['user']['type']) => boolean;
  innerRef: React.RefObject<HTMLButtonElement> | undefined;
  isNavigationMode: boolean;
  getTimeString: (time: string) => string;
  nextMessage: IMessage | null;
  prevMessage: IMessage | null;
  queryClient: QueryClient;
  agoraId: AgoraId;
};

function MessageItem({
  message,
  isNavigationMode,
  innerRef,
  isMyType,
  getTimeString,
  nextMessage,
  prevMessage,
  queryClient,
  agoraId,
}: MessageItemProps) {
  if (isNull(message)) return null;
  if (!isNull(message.access)) {
    return (
      <UserAccessNotification
        className="flex p-0.5rem pl-1rem pr-1rem"
        nickname={message.user.nickname}
        access={message.access}
      />
    );
  }

  const isMyMessage = isMyType(message.user.type);
  const isSameMessage = nextMessage && nextMessage.chatId === message.chatId;

  if (isSameMessage) return null;

  const isPrevSameUser = prevMessage && prevMessage.user.id === message.user.id;
  const isNextSameUser = nextMessage && nextMessage.user.id === message.user.id;

  const currentMessageTime = getTimeString(message.createdAt);
  const nextMessageTime = nextMessage && getTimeString(nextMessage.createdAt);

  const isSameTime = nextMessage && currentMessageTime === nextMessageTime;
  const shouldShowTime = !isNextSameUser || !isSameTime;

  const beforeReactions = queryClient.getQueryData(
    getUserReactionQueryKey(agoraId, message.chatId),
  );

  if (isNull(beforeReactions)) {
    // 캐시에 저장된 값이 없을 때만, 초기 데이터를 set
    queryClient.setQueryData(
      getUserReactionQueryKey(agoraId, message.chatId),
      message.reactionCount,
    );
  }

  return isMyMessage ? (
    <MyMessage
      isNavigationMode={isNavigationMode}
      isSameUser={isPrevSameUser || false}
      shouldShowTime={shouldShowTime}
      message={message}
      innerRef={innerRef}
    />
  ) : (
    <YourMessage
      isNavigationMode={isNavigationMode}
      isSameUser={isPrevSameUser || false}
      shouldShowTime={shouldShowTime}
      message={message}
      innerRef={innerRef}
    />
  );
}

export default React.memo(MessageItem);
