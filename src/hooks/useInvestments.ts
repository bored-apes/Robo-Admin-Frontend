// useInvestments.ts
import { useEffect, useState } from 'react';
import { fetchInvestments } from '../services/investmentService';

export interface Investment {
  id: number;
  paymentDate: string;
  amount: number;
  modeOfPayment: string;
  category: string;
  payer: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchInvestments();
        setInvestments(data as Investment[]);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  return { investments, loading, error };
}
