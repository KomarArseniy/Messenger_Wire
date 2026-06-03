import type { User } from './user';

export interface LoginPayload {
  login: string;
  password: string;
}

export interface RegisterPayload {
  login: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  user: User;
}
