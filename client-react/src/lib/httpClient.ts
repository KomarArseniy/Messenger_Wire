import { API_BASE_URL } from './config';

let accessTokenGetter: () => string | null = () => null;
let accessTokenSetter: (token: string) => void = () => {};
let onAuthFailure: () => void = () => {};

export function setAccessTokenGetter(getter: () => string | null) {
  accessTokenGetter = getter;
}

export function setAccessTokenSetter(setter: (token: string) => void) {
  accessTokenSetter = setter;
}

export function setOnAuthFailure(handler: () => void) {
  onAuthFailure = handler;
}

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

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) return null;
      const data = await res.json().catch(() => null);
      const token = data?.accessToken ?? null;
      if (token) accessTokenSetter(token);
      return token;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function doFetch(
  path: string,
  finalHeaders: Record<string, string>,
  rest: RequestInit,
) {
  return fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    credentials: 'include',
  });
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = false, headers, ...rest } = options;

  const buildHeaders = (): Record<string, string> => {
    const h: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };
    if (auth) {
      const token = accessTokenGetter();
      if (token) h.Authorization = `Bearer ${token}`;
    }
    return h;
  };

  let response = await doFetch(path, buildHeaders(), rest);

  if (response.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await doFetch(path, buildHeaders(), rest);
    } else {
      onAuthFailure();
      throw new HttpError(401, 'Сессия истекла');
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && auth) onAuthFailure();
    const message = data?.error ?? data?.message ?? 'Ошибка запроса';
    throw new HttpError(response.status, message);
  }

  return data as T;
}
