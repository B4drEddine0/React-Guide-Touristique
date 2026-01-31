import axios from 'axios';

export function toErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;
    return message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
