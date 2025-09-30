import { useState, useEffect, useCallback } from 'react';
import { Product, ProductInput, ProductFilters } from '../types/productTypes';
import { productService } from '../services/productService';

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalRows: number;
  loadProducts: () => Promise<void>;
  createProduct: (productData: ProductInput) => Promise<void>;
  updateProduct: (id: number, productData: Partial<ProductInput>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  exportProducts: () => Promise<void>;
}

export const useProducts = (filters: ProductFilters = {}): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRows, setTotalRows] = useState(0);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAllProducts(filters);
      setProducts(response.data);
      setTotalRows(response.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createProduct = async (productData: ProductInput): Promise<void> => {
    try {
      await productService.createProduct(productData);
      await loadProducts(); // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  const updateProduct = async (id: number, productData: Partial<ProductInput>): Promise<void> => {
    try {
      await productService.updateProduct(id, productData);
      await loadProducts(); // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const deleteProduct = async (id: number): Promise<void> => {
    try {
      await productService.deleteProduct(id);
      await loadProducts(); // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const exportProducts = async (): Promise<void> => {
    try {
      const blob = await productService.exportProducts();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'products.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to export products');
    }
  };

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    totalRows,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    exportProducts,
  };
};
