export interface ApiError {
  code: number;
  message: string | Record<string, string>;
}

export type ApiErrorResponse = {
  success: false;
  response: null;
  error: ApiError;
};

export type ApiSuccessResponse<T> = {
  success: true;
  response: T;
  error: null;
};

export type ApiResult<T> = {
  ok: boolean;
} & ApiResponse<T>;

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
