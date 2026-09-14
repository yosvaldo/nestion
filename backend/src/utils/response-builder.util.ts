export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
  meta?: {
    currentPage?: number;
    limit?: number;
    totalPages?: number;
    totalItems?: number;
  };
}

export const responseBuilder = <T>(
  status: number,
  message: string,
  data?: T,
  meta?: {
    currentPage?: number;
    limit?: number;
    totalPages?: number;
    totalItems?: number;
  }
): ApiResponse<T> => {
  return {
    status,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  };
};