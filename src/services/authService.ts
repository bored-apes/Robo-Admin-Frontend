import { apiFetch } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
}

export interface ProfileResponse {
  data: LoginResponse;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export function login(data: LoginRequest) {
  return apiFetch<ProfileResponse>(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function fetchProfile(token: string) {
  return apiFetch<ProfileResponse>(`${API_BASE_URL}/auth/validate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
