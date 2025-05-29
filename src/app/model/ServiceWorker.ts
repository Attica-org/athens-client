import { ErrorResponse, Vote, VoteResults } from './Agora';

type VoteSentMessage = {
  action: 'voteSent';
  newAccessToken: string;
  data: Vote;
};

type VoteResultMessage = {
  action: 'voteResult';
  newAccessToken: string;
  result: VoteResults;
};

type FetchErrorMessage = {
  action: 'fetchError';
  message: ErrorResponse | string;
};

export type ServiceWorkerMessage =
  | VoteSentMessage
  | VoteResultMessage
  | FetchErrorMessage;
