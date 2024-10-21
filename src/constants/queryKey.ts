import { SearchParams } from '@/app/model/Agora';

const getVoteResultQueryKey = (agoraId: number): [string, string, string] => [
  'agora',
  `${agoraId}`,
  'closed',
];

const getChatMessagesQueryKey = (agoraId: number): [string, string, string] => [
  'chat',
  `${agoraId}`,
  'messages',
];

const getAgoraUserListQueryKey = (
  agoraId: number,
): [string, string, string] => ['chat', 'users', `${agoraId}`];

const getCategoryAgoraListQueryKey = (
  searchParams: SearchParams,
  selectedCategory?: string,
): [string, string, string, SearchParams] => [
  'agoras',
  'search',
  'category',
  { ...searchParams, category: selectedCategory },
];

const getKeywordAgoraListQueryKey = (
  searchParams: SearchParams,
  search?: string,
): [string, string, string, SearchParams] => [
  'agoras',
  'search',
  'keyword',
  { ...searchParams, q: search },
];

const getSelectedAgoraQueryKey = (agoraId: string): [string, string] => [
  'agoraTitle',
  agoraId,
];

const getUserReactionQueryKey = (
  agoraId: number,
  chatId: number,
): [string, number, number] => ['reaction', agoraId, chatId];

export {
  getVoteResultQueryKey,
  getChatMessagesQueryKey,
  getAgoraUserListQueryKey,
  getCategoryAgoraListQueryKey,
  getKeywordAgoraListQueryKey,
  getSelectedAgoraQueryKey,
  getUserReactionQueryKey,
};
