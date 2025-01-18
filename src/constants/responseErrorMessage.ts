export const AGORA_CATEGORY_SEARCH = {
  FAILED_TO_GET_AGORA_LIST: '아고라 목록을 불러오는데 실패했습니다.',
  NOT_ALLOWED_STATUS: '허용되지 않는 status 입니다.',
  NOT_ALLOWED_CATEGORY: '허용되지 않는 카테고리입니다.',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
} as const;

export const AGORA_KEYWORD_SEARCH = {
  FAILED_TO_GET_AGORA_LIST: '아고라 목록을 불러오는데 실패했습니다.',
  NOT_ALLOWED_STATUS: '허용되지 않는 status 입니다.',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
} as const;

export const AGORA_INFO = {
  FAILED_TO_GET_AGORA_INFO: '아고라 정보를 불러오는데 실패했습니다.',
  NOT_EXIST_AGORA: '존재하지 않는 아고라입니다.',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
} as const;

export const AGORA_ACTIVE = {
  BAD_REQUEST: '잘못된 요청입니다.',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
} as const;

export const AGORA_CREATE = {
  NOT_ALLOWED_CATEGORY: '허용되지 않는 카테고리입니다.',
  COLOR_NULL: '아고라 색상을 선택해주세요.',
  CAPACITY_NULL: '카테고리를 선택해주세요.',
  TITLE_NULL: '아고라 제목을 입력해주세요.',
  DURATION_UNDER: '토론 시간을 입력해주세요.',
  DURATION_OVER: '토론 시간을 180분 이하로 입력해주세요.',
  FAIED_TO_CREATE_AGORA: '아고라 생성에 실패했습니다.',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
} as const;

export const AGORA_ENTER = {
  FAILED_TO_ENTER_AGORA: '입장 실패했습니다.\n 다시 시도해주세요.',
  CLOSED_AGORA: '종료된 아고라입니다.',
  ACTIVATE_AGORA: '종료되지 않은 아고라입니다.',
  ALREADY_PARTICIPATED: '이미 참여한 아고라입니다.',
  NICKNAME_DUPLICATED: '닉네임이 중복됩니다.',
  NOT_ALLOWED_POSITION: '허용되지 않는 입장 타입 입니다.',
  FULL_CAPACITY: '선택한 타입의 인원이 꽉 찼습니다.',
  PROFILE_NULL: '프로필을 선택해주세요.',
  NICKNAME_NULL: '닉네임을 입력해주세요.',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
  SERVER_RESPONSE_ALREADY_PARTICIPATED: 'User has already participated',
  SERVER_RESPONSE_NICKNAME_DUPLICATED: 'The nickname is already in use',
} as const;

export const AGORA_USER = {
  FAILED_TO_GET_AGORA_USER: '참여 사용자를 불러오는데 실패했습니다.',
  NOT_FOUND_AGORA: '아고라를 찾을 수 없습니다.',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
} as const;

export const CHAT_MESSAGE = {
  FAILED_TO_GET_CHAT: '채팅 내역을 불러올 수 없습니다.\n다시 시도해주세요.',
  NOT_FOUND_AGORA: '아고라를 찾을 수 없습니다.',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
} as const;

export const VOTE_RESULT = {
  NOT_FOUND_AGORA: '아고라를 찾을 수 없습니다.',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
} as const;

export const AGORA_END = {
  NOT_FOUND_AGORA_OR_USER: '존재하지 않는 아고라 혹은 사용자입니다.',
  ALREADY_ENDED: '이미 종료된 아고라입니다.',
  ALREADY_VOTED: '이미 투표하였습니다.',
  OBSERVER_CANNOT_END: '관찰자는 토론을 종료할 수 없습니다.',
  FAILED_TO_END_AGORA: '토론 종료에 실패했습니다.\n 다시 시도해주세요.',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
  SERVER_RESPONSE_AGORA_STATUS_ERROR: 'Agora status must be RUNNING',
  SERVER_RESPONSE_ALREADY_VOTED: 'User has already voted for ending the agora',
} as const;

export const AGORA_IMAGE_UPDATE = {
  ONLY_HOST_CAN_UPDATE: '방장만 이미지를 변경할 수 있습니다.',
  NOT_FOUND_AGORA_OR_USER: '존재하지 않는 아고라이거나 사용자입니다.',
  FAILED_TO_UPDATE_IMAGE: '이미지 변경에 실패했습니다.\n다시 시도해주세요.',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
} as const;

export const AGORA_START = {
  ALREADY_RUNNING_OR_ENDED: '이미 진행중이거나 종료된 아고라입니다.',
  NOT_FOUND_AGORA_OR_USER: '존재하지 않는 아고라이거나 사용자입니다.',
  OBSERVER_CANNOT_START: '관찰자는 토론을 시작할 수 없습니다.',
  FAILED_TO_START_AGORA: '토론 시작에 실패했습니다.\n 다시 시도해주세요.',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
} as const;

export const AGORA_TIME_OUT = {
  NOT_FOUND_AGORA: '존재하지 않는 아고라입니다.',
  FAILED_TO_TIME_OUT: '토론 종료에 실패했습니다.\n 다시 시도해주세요.',
  ALREADY_TIME_OUT: '이미 종료된 아고라입니다.',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
} as const;

export const AGORA_EXIT = {
  NOT_FOUND_AGORA: '존재하지 않는 아고라입니다',
  NOT_FOUND_USER: '존재하지 않는 사용자입니다',
  FAILED_TO_EXIT: '채팅방 나가기에 실패했습니다',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
  SERVER_RESPONSE_NOT_FOUND_AGORA: 'Not found agora.',
  SERVER_RESPONSE_NOT_FOUND_USER: 'Agora user not found',
} as const;

export const FILTER_BAD_WORDS = {
  FAILED_TO_FILTER: '메시지 필터링에 실패했습니다',
  USER_NOT_PARTICIPATING:
    '채팅을 작성중인 유저가 현재 아고라에 존재하지 않습니다',
  UNKNOWN_ERROR: '알 수 없는 에러가 발생했습니다.',
  SERVER_RESPONSE_USER_NOT_PARTICIPATING:
    'User is not participating in the agora',
} as const;

export const CHAT_SOCKET_ERROR_MESSAGE = {
  OBSERVER_MESSAGE_SEND_ERROR: 'Observer cannot send this request',
  SESSION_NOT_FOUND: 'Session not found',
  USER_NOT_FOUND: 'User is not participating in the agora',
  REACTION_TYPE_IS_NULL: 'Reaction type cannot be null',
  CHAT_TYPE_INVALID: `Invalid value for field ${'type'}`,
  CHAT_TYPE_IS_NULL: 'Chat type cannot be null',
  AGORA_IS_CLOSED: 'Agora is closed',
  CHAT_MESSAGE_IS_NULL: 'Chat message cannot be empty',
  CHAT_OVER_LIMIT: 'content length exceeds maximum limit of 10000 characters',
  RECONNECTION_FAILURE: 'Reconnection attempt failed',
  SOCKET_EXCEPTION: 'Socket Exception',
  RUNTIME_EXCEPTION: 'Runtime Exception',
  NOT_FOUND_AGORA: 'Not found agora',
};

export const REACTION_SOCKET_ERROR_MESSAGE = {
  REACTION_TYPE_INVALID: `Invalid value for field ${'reactiontype'}`,
  REACTION_TYPE_IS_NULL: 'Reaction type cannot be null',
  NOT_FOUND_CHAT: 'Not found chat.',
  CHAT_WRITER_CANNOT_REACT_TEMSELVES:
    'Chat writers cannot respond to themselves.',
};

export const CHAT_VOTE_ERROR_MESSAGE = {
  DUPLICATE_VOTE: 'User has already voted for Opinion in this agora',
};

export const NETWORK_ERROR_MESSAGE = {
  OFFLINE: '인터넷 연결이 필요합니다. 다시 시도해주세요.',
};

export const LOGOUT_ERROR_MESSAGE = {
  UNKNOWN_ERROR: '로그아웃 중 알 수 없는 에러가 발생했습니다.',
  EXPIRED_TOKEN: '이미 로그아웃 한 유저입니다.',
  FAILED_TO_LOGOUT: '로그아웃에 실패했습니다.\n다시 시도해주세요.',
};

export const DELETE_USER_ERROR_MESSAGE = {
  UNKNOWN_ERROR: '회원 탈퇴 중 알 수 없는 에러가 발생했습니다.',
  NOT_FOUND_USER: '존재하지 않는 사용자입니다.',
  FAILED_TO_DELETE_USER: '회원 탈퇴에 실패했습니다.\n 다시 시도해주세요.',
};

export const PATCH_USER_KICK_VOTE_ERROR_MESSAGE = {
  UNKNOWN_ERROR: '회원 탈퇴 중 알 수 없는 에러가 발생했습니다.',
  NOT_FOUND_USER: '아고라 멤버 ID와 일치하는 유저를 찾을 수 없습니다.',
  NOT_FOUND_AGORA: '아고라 ID와 일치하는 아고라를 찾을 수 없습니다.',
  ALREADY_VOTE: '이미 퇴장 투표한 대상입니다.',
  FAILED_TO_KICK_VOTE: '퇴장 투표에 실패했습니다.\n다시 시도해 주세요.',
};
