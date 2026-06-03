import { API_BASE_URL } from './config';

let accessTokenGetter: () => string | null = () => null;

export function setAccessTokenGetter(getter: () => string | null) {
  accessTokenGetter = getter;
}

let fallbackToken: string | null = null;

export function setFallbackToken(token: string | null) {
  fallbackToken = token;
}

accessTokenGetter = () => fallbackToken;

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = false, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = accessTokenGetter();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    credentials: 'include',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error ?? data?.message ?? 'Ошибка запроса';
    throw new HttpError(response.status, message);
  }

  return data as T;
}
