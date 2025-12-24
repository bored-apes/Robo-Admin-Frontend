'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Product, ProductInput, ProductStatusEnum } from '../../types/productTypes';
import { productService } from '../../services/productService';
import { formatPrice, getStatusColor } from '../../utils/productUtils';
import ProductFormModal from './ProductFormModal';
import ProductImage from './ProductImage';
import ProductActionsDropdown from './ProductActionsDropdown';
import BulkImportModal from './BulkImportModal';
import DataTable from '../investment/DataTable';

interface ProductsTableProps {}

const ProductsTable: React.FC<ProductsTableProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Edit loading state
  const [editLoading, setEditLoading] = useState<number | null>(null);

  // Bulk import modal
  const [bulkImportOpen, setBulkImportOpen] = useState(false);

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts({
        sortBy: 'created_at',
        sortOrder: 'asc' as const,
      });
      setProducts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handlers
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditProduct = async (product: Product) => {
    try {
      setEditLoading(product.id);
      // Fetch the latest product data instead of using cached data
      const latestProduct = await productService.getProductById(product.id);
      setSelectedProduct(latestProduct);
      setModalMode('edit');
      setModalOpen(true);
    } catch (error) {
      setError('Failed to load product details');
    } finally {
      setEditLoading(null);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(productToDelete.id);
      await productService.deleteProduct(productToDelete.id);
      setSuccess('Product deleted successfully');
      loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setDeleting(null);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleModalSubmit = async (productData: ProductInput) => {
    try {
      if (modalMode === 'create') {
        await productService.createProduct(productData);
        setSuccess('Product created successfully');
      } else if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, productData);
        setSuccess('Product updated successfully');
      }
      loadProducts();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  const handleExport = async () => {
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
      setSuccess('Products exported successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export products');
    }
  };

  const handleBulkImport = () => {
    setBulkImportOpen(true);
  };

  const handleBulkImportComplete = () => {
    loadProducts(); // Refresh the table
  };

  // Define columns
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'image_urls',
      headerName: 'Image',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const imageUrls = params.value;
        const firstImage = Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : null;
        return <ProductImage imageUrl={firstImage} showZoom={false} width={60} height={60} />;
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      flex: 1,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
    },
    {
      field: 'base_price',
      headerName: 'Price (₹)',
      width: 100,
      type: 'number',
      valueFormatter: (params) => formatPrice(params as number),
    },
    {
      field: 'stock_quantity',
      headerName: 'Stock',
      width: 80,
      type: 'number',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const status = params.value as ProductStatusEnum;
        const color = getStatusColor(status);

        return <Chip label={status} color={color} size="small" variant="outlined" />;
      },
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 120,
      valueFormatter: (params) => (params ? new Date(params).toLocaleDateString() : ''),
    },
  ];

  // Handle edit from DataTable
  const handleEdit = (row: Product) => {
    handleEditProduct(row);
  };

  // Handle delete from DataTable
  const handleDelete = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      handleDeleteClick(product);
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        width="100vw"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="40vh"
        width="100vw"
      >
        <Box>
          <Typography variant="h6" color="error" align="center">
            Error: {error}
          </Typography>
        </Box>
      </Box>
    );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <ProductActionsDropdown
          onAddProduct={handleAddProduct}
          onBulkImport={handleBulkImport}
          onExport={handleExport}
        />
      </Box>

      {/* Data Grid */}
      {loading ? (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          rows={products}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleting={deleting}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        product={selectedProduct}
        mode={modalMode}
      />

      {/* Bulk Import Modal */}
      <BulkImportModal
        open={bulkImportOpen}
        onClose={() => setBulkImportOpen(false)}
        onImportComplete={handleBulkImportComplete}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product "{productToDelete?.name}"? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleting === productToDelete?.id}
            startIcon={deleting === productToDelete?.id ? <CircularProgress size={20} /> : null}
          >
            {deleting === productToDelete?.id ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductsTable;
