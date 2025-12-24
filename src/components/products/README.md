# Products Feature Documentation

## Overview

The Products feature provides a comprehensive interface for managing product inventory in the Robo Admin Frontend. It includes functionality for viewing, creating, editing, and deleting products, as well as image upload capabilities and data export/import.

## Features

### 1. Product Table View

- **DataGrid Display**: Uses MUI DataGrid for efficient display of large product datasets
- **Pagination**: Server-side pagination with configurable page sizes (10, 25, 50, 100)
- **Sorting**: Column-based sorting with server-side implementation
- **Filtering**: Multiple filter options including:
  - Search by name, description, type, category
  - Filter by status (Active, Inactive, Out of Stock)
  - Filter by product type
  - Filter by category
- **Actions**: Each row has Edit and Delete action buttons

### 2. Product Form Modal

- **Dual Mode**: Supports both Create and Edit operations
- **Form Validation**: Client-side validation for required fields and data types
- **Image Upload**: Integration with Google Drive for product image storage
- **Field Types**:
  - Text fields: Name, Description
  - Select dropdowns: Type, Category, Status
  - Number fields: Price, GST Rate, Min Order Qty, Stock Quantity
  - File upload: Product image

### 3. Data Management

- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Export**: Download products as Excel file
- **Import**: Bulk upload products via Excel file
- **Image Handling**: Upload images to Google Drive with organized folder structure

## Technical Implementation

### Components

- `ProductsTable.tsx`: Main table component with filters and actions
- `ProductFormModal.tsx`: Modal form for creating/editing products
- `index.ts`: Component exports

### Services

- `productService.ts`: API service for product operations
- `googleDriveService.ts`: Google Drive integration for image uploads

### Types

- `productTypes.ts`: TypeScript interfaces and enums for products

### Hooks

- `useProducts.ts`: Custom hook for product data management

### Utilities

- `productUtils.ts`: Helper functions for formatting, validation, and data manipulation

## API Integration

### Endpoints Used

- `GET /product` - Get all products with pagination and filters
- `GET /product/:id` - Get specific product by ID
- `POST /product/create-product` - Create new product
- `PUT /product/update-product/:id` - Update existing product
- `PUT /product/delete-product/:id` - Delete product (soft delete)
- `GET /product/export-product` - Export products to Excel
- `POST /product/import-product` - Import products from Excel

### Request/Response Format

All requests use JSON format with Bearer token authentication. The API follows RESTful conventions with proper HTTP status codes.

## Product Schema

Based on the Prisma schema, products have the following fields:

- `id`: Unique identifier
- `name`: Product name (required)
- `description`: Product description
- `type`: Product type enum (IC, Microcontroller, Sensor, etc.)
- `category`: Product category enum (Semiconductor, IoT, Robotics, etc.)
- `base_price`: Base price in currency
- `gst_rate`: GST percentage
- `min_order_qty`: Minimum order quantity
- `stock_quantity`: Available stock
- `image_urls`: Array of product image URLs
- `status`: Product status (Active, Inactive, OutOfStock)
- `created_at`: Creation timestamp
- `average_rating`: Average customer rating
- `total_ratings`: Total number of ratings

## Google Drive Integration

### Image Upload Process

1. User selects image file in the form
2. File is validated (image types only)
3. On form submission, image is uploaded to Google Drive
4. Drive API creates folder structure: `product/{productId}/`
5. Image URL is stored in product record

### Configuration

Set up the following environment variables:

```
NEXT_PUBLIC_GOOGLE_DRIVE_ACCESS_TOKEN=your_access_token
```

**Note**: In production, image upload should be handled server-side for security.

## Usage Examples

### Basic Usage

```tsx
import { ProductsTable } from '../../components/products';

function ProductsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <ProductsTable />
    </Box>
  );
}
```

### Using the Products Hook

```tsx
import { useProducts } from '../hooks/useProducts';

function CustomProductComponent() {
  const { products, loading, createProduct } = useProducts({
    pageSize: 20,
    status: ['Active'],
  });

  // Use products data...
}
```

## Error Handling

- Network errors are caught and displayed via Snackbar notifications
- Form validation errors are shown inline
- Loading states are indicated with progress indicators
- Graceful fallbacks for missing data

## Performance Considerations

- Server-side pagination reduces client memory usage
- Debounced search to reduce API calls
- Lazy loading of images
- Optimistic updates for better UX

## Future Enhancements

- Advanced filtering with date ranges
- Bulk edit operations
- Product variants support
- Enhanced image gallery
- Barcode/QR code generation
- Stock level alerts
- Product analytics dashboard

## Security Notes

- All API calls require authentication
- Admin role required for create/update/delete operations
- File upload validation on both client and server
- SQL injection protection via parameterized queries
- XSS protection through proper data sanitization
