import { InvestmentCreateRequest } from '@/types/investmentTypes';
import { apiFetch } from './api';

export async function fetchInvestments() {
  const token = localStorage.getItem('token') || '';
  return apiFetch('/investment', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createInvestment(data: InvestmentCreateRequest) {
  const token = localStorage.getItem('token') || '';
  console.log('DATA', JSON.stringify(data));
  return apiFetch<string>(`/investment`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
