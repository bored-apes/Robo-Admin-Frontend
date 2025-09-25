import { apiFetch, apiFetchBlob } from './api';
import { Product, ProductInput, ProductsResponse, ProductFilters } from '../types/productTypes';

export const productService = {
  // Get all products with filters and pagination
  getAllProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();

    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.type) filters.type.forEach((t) => queryParams.append('type', t));
    if (filters.category) filters.category.forEach((c) => queryParams.append('category', c));
    if (filters.status) filters.status.forEach((s) => queryParams.append('status', s));
    if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters.inStock !== undefined) queryParams.append('inStock', filters.inStock.toString());
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    const url = `/product${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiFetch<any>(url);

    // Handle the API response format: {data: [...], pagination: {...}}
    return {
      data: response.data || response.products || [],
      pagination: response.pagination || {
        page: 1,
        pageSize: 25,
        total: response.data?.length || 0,
        totalPages: 1,
      },
    };
  },

  // Get product by ID
  getProductById: async (id: number): Promise<Product> => {
    return apiFetch<Product>(`/product/${id}`);
  },

  // Create new product
  createProduct: async (
    productData: ProductInput,
  ): Promise<{ message: string; createdProduct: Product }> => {
    return apiFetch<{ message: string; createdProduct: Product }>('/product/create-product', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update existing product
  updateProduct: async (
    id: number,
    productData: Partial<ProductInput>,
  ): Promise<{ message: string; updatedProduct: Product }> => {
    return apiFetch<{ message: string; updatedProduct: Product }>(`/product/update-product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete product
  deleteProduct: async (id: number): Promise<{ message: string }> => {
    return apiFetch<{ message: string }>(`/product/delete-product/${id}`, {
      method: 'PUT',
    });
  },

  // Export products
  exportProducts: async (): Promise<Blob> => {
    return apiFetchBlob('/product/export-product');
  },

  // Import products
  importProducts: async (
    file: File,
  ): Promise<{ message: string; products: Product[]; results: any }> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiFetch<{ message: string; products: Product[]; results: any }>(
      '/product/import-product',
      {
        method: 'POST',
        body: formData,
      },
    );
  },
};
