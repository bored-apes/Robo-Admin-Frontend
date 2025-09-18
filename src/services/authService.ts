import { LoginRequest, ProfileResponse } from '@/types/authTypes';
import { apiFetch } from './api';

export function login(data: LoginRequest) {
  return apiFetch<ProfileResponse>(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function fetchProfile(token: string) {
  return apiFetch<ProfileResponse>(`/auth/validate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
