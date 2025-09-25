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

export function updateInvestment(id: number, data: Partial<InvestmentCreateRequest>) {
  return apiFetch<string>(`/investment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteInvestment(id: number) {
  return apiFetch<string>(`/investment/${id}`, {
    method: 'DELETE',
  });
}
