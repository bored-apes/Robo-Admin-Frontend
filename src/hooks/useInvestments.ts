// useInvestments.ts
import { useEffect, useState, useCallback } from 'react';
import {
  fetchInvestments,
  updateInvestment as updateInvestmentApi,
  deleteInvestment as deleteInvestmentApi,
} from '../services/investmentService';
import { Investment } from '@/types/investmentTypes';

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInvestments();
      setInvestments(data as Investment[]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update investment

  const updateInvestment = useCallback(
    async (id: number, data: Partial<Investment>) => {
      // Only send fields expected by backend
      const mappedData: Partial<Investment> = {};
      if (data.paymentDate) {
        mappedData.paymentDate = new Date(data.paymentDate);
      }
      if (data.amount !== undefined) mappedData.amount = data.amount;
      if (data.modeOfPayment !== undefined) mappedData.modeOfPayment = data.modeOfPayment;
      if (data.category !== undefined) mappedData.category = data.category;
      if (data.payer !== undefined) mappedData.payer = data.payer;
      if (data.description !== undefined) mappedData.description = data.description;
      await updateInvestmentApi(id, mappedData);
      await fetchData();
    },
    [fetchData],
  );

  // Delete investment
  const deleteInvestment = useCallback(
    async (id: number) => {
      await deleteInvestmentApi(id);
      await fetchData();
    },
    [fetchData],
  );

  return { investments, loading, error, refetch, updateInvestment, deleteInvestment };
}
