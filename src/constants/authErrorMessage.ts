const REFRESH_TOKEN_NOT_EXIST = 'Refresh Token Not Exist.';
const INVALID_JWT_SIGNATURE = 'Invalid JWT signature.';
const INVALID_JWT_TOKEN = 'Invalid JWT token.';
const UNSUPPORTED_JWT = 'Unsupported JWT token.';
const INVALID_AUTHORIZATION_HEADER =
  'Authorization header is missing or does not start with Bearer';
const TOKEN_EXPIRED = 'The token has expired.';
const ACCESS_DENIED = 'Access denied';
const SESSION_NOT_FOUND = 'Session not found';

// refresh token 에러
const AUTHORIZATION_FAIL = 'AUTH FAIL';
const AUTHORIZATION_SUCCESS = 'AUTH_SUCCESS';

// 로그인 필요
const SIGNIN_REQUIRED = 'signin required';

const AUTH_MESSAGE = [
  SESSION_NOT_FOUND,
  ACCESS_DENIED,
  INVALID_JWT_TOKEN,
  TOKEN_EXPIRED,
  INVALID_JWT_SIGNATURE,
  INVALID_AUTHORIZATION_HEADER,
  UNSUPPORTED_JWT,
];

export {
  SIGNIN_REQUIRED,
  AUTH_MESSAGE,
  REFRESH_TOKEN_NOT_EXIST,
  INVALID_JWT_SIGNATURE,
  UNSUPPORTED_JWT,
  INVALID_AUTHORIZATION_HEADER,
  TOKEN_EXPIRED,
  INVALID_JWT_TOKEN,
  AUTHORIZATION_FAIL,
  AUTHORIZATION_SUCCESS,
};