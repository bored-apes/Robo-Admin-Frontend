import { Product, ProductStatusEnum } from '../types/productTypes';

export const formatPrice = (price: number | null | undefined): string => {
  if (price == null) return '₹0';
  return `₹${price.toLocaleString('en-IN')}`;
};

export const getStatusColor = (status: ProductStatusEnum): 'success' | 'warning' | 'error' => {
  switch (status) {
    case ProductStatusEnum.Active:
      return 'success';
    case ProductStatusEnum.OutOfStock:
      return 'warning';
    case ProductStatusEnum.Inactive:
      return 'error';
    default:
      return 'error';
  }
};

export const validateProduct = (product: Partial<Product>): string[] => {
  const errors: string[] = [];

  if (!product.name?.trim()) {
    errors.push('Product name is required');
  }

  if (product.base_price !== undefined && product.base_price !== null && product.base_price < 0) {
    errors.push('Base price must be non-negative');
  }

  if (
    product.gst_rate !== undefined &&
    product.gst_rate !== null &&
    (product.gst_rate < 0 || product.gst_rate > 100)
  ) {
    errors.push('GST rate must be between 0 and 100');
  }

  if (
    product.min_order_qty !== undefined &&
    product.min_order_qty !== null &&
    product.min_order_qty < 1
  ) {
    errors.push('Minimum order quantity must be at least 1');
  }

  if (
    product.stock_quantity !== undefined &&
    product.stock_quantity !== null &&
    product.stock_quantity < 0
  ) {
    errors.push('Stock quantity cannot be negative');
  }

  return errors;
};
