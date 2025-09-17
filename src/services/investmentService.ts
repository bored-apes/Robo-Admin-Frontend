// investmentService.ts
import { apiFetch } from './api';

export async function fetchInvestments() {
  return apiFetch('/investment');
}
