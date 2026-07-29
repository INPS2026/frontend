export type ApiResponse<T = unknown> = Promise<{
  success: boolean;
  message: string;
  data: T;
}>;

export type ApiError = {
  success: boolean;
  message: string;
};
