export type ApiResponse<T = unknown> = Promise<{
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}>;

export type ApiError = {
  success: boolean;
  message: string;
};
