// useInvestments.ts
import { useEffect, useState } from 'react';
import { fetchInvestments } from '../services/investmentService';
import { Investment } from '@/types/investmentTypes';

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
