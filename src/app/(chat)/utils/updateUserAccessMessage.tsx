import { getChatMessagesQueryKey } from '@/constants/queryKey';
import { InfiniteData, QueryClient } from '@tanstack/react-query';
import { AccessStatus, Message } from '@/app/model/Message';
import accessMessageConfig from '@/lib/accessMessageConfig';
import isNull from '@/utils/validation/validateIsNull';

export const updateUserAccessMessage = (
  queryClient: QueryClient,
  enterAgoraId: number,
  username: string,
  accessStatus: AccessStatus,
) => {
  const curMessages = queryClient.getQueryData(
    getChatMessagesQueryKey(enterAgoraId),
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
    access: accessStatus,
  };

  newLastPage.chats.push(newMessage);

  newMessages.pages[newMessages.pages.length - 1] = {
    chats: newLastPage.chats,
    meta: {
      key: newLastPage.meta.key || 0,
      effectiveSize: 20,
    },
  };

  queryClient.setQueryData(getChatMessagesQueryKey(enterAgoraId), newMessages);
};
