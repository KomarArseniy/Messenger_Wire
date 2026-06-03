import { request } from '@/lib/httpClient';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth';

export function login(payload: LoginPayload) {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload) {
  return request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function refresh() {
  return request<{ accessToken: string }>('/api/auth/refresh', {
    method: 'POST',
  });
}
