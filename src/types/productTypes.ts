export enum ProductTypeEnum {
  IC = 'IC',
  Microcontroller = 'Microcontroller',
  Sensor = 'Sensor',
  Module = 'Module',
  DevBoard = 'DevBoard',
  PCB = 'PCB',
  Connector = 'Connector',
  PowerSupply = 'PowerSupply',
  Display = 'Display',
}

export enum ProductCategoryEnum {
  Semiconductor = 'Semiconductor',
  IoT = 'IoT',
  Robotics = 'Robotics',
  Power = 'Power',
  Industrial = 'Industrial',
}

export enum ProductStatusEnum {
  Active = 'Active',
  Inactive = 'Inactive',
  OutOfStock = 'OutOfStock',
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  type?: ProductTypeEnum | null;
  category?: ProductCategoryEnum | null;
  base_price?: number | null;
  gst_rate?: number | null;
  min_order_qty?: number | null;
  stock_quantity?: number | null;
  image_urls?: string[] | null;
  status: ProductStatusEnum;
  created_at: string;
  average_rating?: number | null;
  total_ratings?: number | null;
}

export interface ProductInput {
  name: string;
  description?: string | null;
  type?: ProductTypeEnum;
  category?: ProductCategoryEnum;
  base_price?: number;
  gst_rate?: number;
  min_order_qty?: number;
  stock_quantity?: number;
  image_urls?: string[] | null;
  status?: ProductStatusEnum;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string[];
  category?: string[];
  status?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
