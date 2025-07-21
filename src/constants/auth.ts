const ANYNYMOUS = 'anynymous';

export enum AuthProvider {
  GOOGLE = 'GOOGLE',
  KAKAO = 'KAKAO',
  DEFAULT = ANYNYMOUS,
}

export const AuthProviderLabels: Record<AuthProvider, string> = {
  [AuthProvider.GOOGLE]: '구글',
  [AuthProvider.KAKAO]: '카카오',
  [AuthProvider.DEFAULT]: '익명',
};

export const AUTHENTICATED = 'authenticated';
export const UNAUTHENTICATED = 'unauthenticated';

export enum Provider {
  KAKAO = 'kakao',
  GOOGLE = 'google',
}
