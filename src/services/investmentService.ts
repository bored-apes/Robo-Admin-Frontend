import { InvestmentCreateRequest } from '@/types/investmentTypes';
import { apiFetch } from './api';

export async function fetchInvestments() {
  return apiFetch('/investment', {
    method: 'GET',
  });
}

export function createInvestment(data: InvestmentCreateRequest) {
  return apiFetch<string>(`/investment`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
