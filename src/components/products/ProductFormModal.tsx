'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
  Stack,
  TextField,
} from '@mui/material';
import { CloudUpload, Image as ImageIcon, Info, AttachMoney, Inventory } from '@mui/icons-material';
import {
  Product,
  ProductInput,
  ProductTypeEnum,
  ProductCategoryEnum,
  ProductStatusEnum,
} from '../../types/productTypes';
import { uploadService } from '../../services/uploadService';
import { validateProduct } from '../../utils/productUtils';
import { FormCard } from '../common';
import ProductImage from './ProductImage';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (productData: ProductInput) => Promise<void>;
  product?: Product | null;
  mode: 'create' | 'edit';
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  product,
  mode,
}) => {
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    description: '',
    type: ProductTypeEnum.IC,
    category: ProductCategoryEnum.Semiconductor,
    base_price: 0,
    gst_rate: 18,
    min_order_qty: 1,
    stock_quantity: 0,
    image_url: '',
    status: ProductStatusEnum.Active,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        type: product.type || ProductTypeEnum.IC,
        category: product.category || ProductCategoryEnum.Semiconductor,
        base_price: product.base_price || 0,
        gst_rate: product.gst_rate || 18,
        min_order_qty: product.min_order_qty || 1,
        stock_quantity: product.stock_quantity || 0,
        image_url: product.image_url || '',
        status: product.status || ProductStatusEnum.Active,
      });
      setImagePreview(product.image_url || '');
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        type: ProductTypeEnum.IC,
        category: ProductCategoryEnum.Semiconductor,
        base_price: 0,
        gst_rate: 18,
        min_order_qty: 1,
        stock_quantity: 0,
        image_url: '',
        status: ProductStatusEnum.Active,
      });
      setImagePreview('');
    }
    setSelectedFile(null);
    setError('');
  }, [product, mode, open]);

  const handleInputChange = (field: keyof ProductInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select a valid image file');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate form data
      const validationErrors = validateProduct(formData);
      if (validationErrors.length > 0) {
        setError(validationErrors[0]);
        return;
      }

      let imageUrl = formData.image_url;

      // Upload image if a new file is selected
      if (selectedFile) {
        setUploadingImage(true);
        try {
          // Generate a temporary product ID for new products or use existing product ID
          const entityId = product?.id || `temp_${Date.now()}`;
          const uploadResult = await uploadService.uploadImage(selectedFile, 'products', entityId);

          if (uploadResult.success && uploadResult.data) {
            imageUrl = uploadResult.data.imageUrl;
            console.log('Image uploaded successfully:', imageUrl);
            // Update the preview immediately
            setImagePreview(imageUrl);
          } else {
            throw new Error(uploadResult.message || 'Upload failed');
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          setError('Failed to upload image. Product will be saved without image.');
          // Continue with form submission even if image upload fails
        } finally {
          setUploadingImage(false);
        }
      }

      const submitData: ProductInput = {
        ...formData,
        image_url: imageUrl,
        base_price: Number(formData.base_price),
        gst_rate: Number(formData.gst_rate),
        min_order_qty: Number(formData.min_order_qty),
        stock_quantity: Number(formData.stock_quantity),
      };

      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          m: { xs: 0, sm: 2 },
          maxHeight: { xs: '100vh', sm: '95vh' },
          borderRadius: { xs: 0, sm: 2 },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, px: { xs: 2, sm: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Info color="primary" />
          <Typography variant="h6">
            {mode === 'create' ? 'Add New Product' : 'Edit Product'}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: 0 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={{ xs: 2, sm: 3 }} sx={{ mt: 0.5 }}>
          {/* Mobile-first layout with Stack */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {/* Basic Information Card - Left side on desktop */}
            <Box sx={{ flex: 2 }}>
              <FormCard title="Basic Information" icon={Info}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    sx={{
                      '& .MuiInputLabel-outlined': {
                        top: '50%',
                        transform: 'translate(14px, -50%) scale(1)',
                      },
                      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                        top: 0,
                        transform: 'translate(14px, -9px) scale(0.75)',
                      },
                    }}
                  />

                  <TextField
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    fullWidth
                    multiline
                    sx={{
                      '& .MuiInputLabel-outlined': {
                        top: '50%',
                        transform: 'translate(14px, -50%) scale(1)',
                      },
                      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                        top: 0,
                        transform: 'translate(14px, -9px) scale(0.75)',
                      },
                      mt: 2,
                    }}
                  />

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel
                        sx={{
                          top: '50%',
                          transform: 'translate(14px, -50%) scale(1)',
                          '&.MuiInputLabel-shrink': {
                            top: 0,
                            transform: 'translate(14px, -9px) scale(0.75)',
                          },
                        }}
                      >
                        Type
                      </InputLabel>
                      <Select
                        value={formData.type}
                        label="Type"
                        onChange={(e) =>
                          handleInputChange('type', e.target.value as ProductTypeEnum)
                        }
                      >
                        {Object.values(ProductTypeEnum).map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel
                        sx={{
                          top: '50%',
                          transform: 'translate(14px, -50%) scale(1)',
                          '&.MuiInputLabel-shrink': {
                            top: 0,
                            transform: 'translate(14px, -9px) scale(0.75)',
                          },
                        }}
                      >
                        Category
                      </InputLabel>
                      <Select
                        value={formData.category}
                        label="Category"
                        onChange={(e) =>
                          handleInputChange('category', e.target.value as ProductCategoryEnum)
                        }
                      >
                        {Object.values(ProductCategoryEnum).map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel
                      sx={{
                        top: '50%',
                        transform: 'translate(14px, -50%) scale(1)',
                        '&.MuiInputLabel-shrink': {
                          top: 0,
                          transform: 'translate(14px, -9px) scale(0.75)',
                        },
                      }}
                    >
                      Status
                    </InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) =>
                        handleInputChange('status', e.target.value as ProductStatusEnum)
                      }
                    >
                      {Object.values(ProductStatusEnum).map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </FormCard>
            </Box>

            {/* Product Image Card - Right side on desktop */}
            <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' } }}>
              <FormCard title="Product Image" icon={ImageIcon}>
                <Stack spacing={2} alignItems="center">
                  {imagePreview ? (
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 280,
                        aspectRatio: '1/1',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={() => setImagePreview('')}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 280,
                        aspectRatio: '1/1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.50',
                        borderRadius: 2,
                        border: '2px dashed',
                        borderColor: 'grey.300',
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                    </Box>
                  )}

                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    disabled={uploadingImage}
                    size="small"
                    fullWidth
                  >
                    {uploadingImage ? 'Uploading...' : 'Select Image'}
                    <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                  </Button>

                  {selectedFile && (
                    <Typography variant="body2" color="primary" align="center">
                      New image selected: {selectedFile.name}
                    </Typography>
                  )}
                </Stack>
              </FormCard>
            </Box>
          </Box>

          {/* Pricing and Inventory Cards */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {/* Pricing Card */}
            <Box sx={{ flex: 1 }}>
              <FormCard title="Pricing" icon={AttachMoney}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Base Price"
                    type="number"
                    value={formData.base_price}
                    onChange={(e) =>
                      handleInputChange('base_price', parseFloat(e.target.value) || 0)
                    }
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiInputLabel-outlined': {
                        top: '50%',
                        transform: 'translate(14px, -50%) scale(1)',
                      },
                      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                        top: 0,
                        transform: 'translate(14px, -9px) scale(0.75)',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="GST Rate"
                    type="number"
                    value={formData.gst_rate}
                    onChange={(e) => handleInputChange('gst_rate', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiInputLabel-outlined': {
                        top: '50%',
                        transform: 'translate(14px, -50%) scale(1)',
                      },
                      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                        top: 0,
                        transform: 'translate(14px, -9px) scale(0.75)',
                      },
                    }}
                  />
                </Stack>
              </FormCard>
            </Box>

            {/* Inventory Card */}
            <Box sx={{ flex: 1 }}>
              <FormCard title="Inventory" icon={Inventory}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      handleInputChange('stock_quantity', parseInt(e.target.value) || 0)
                    }
                    sx={{
                      '& .MuiInputLabel-outlined': {
                        top: '50%',
                        transform: 'translate(14px, -50%) scale(1)',
                      },
                      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                        top: 0,
                        transform: 'translate(14px, -9px) scale(0.75)',
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Minimum Order Quantity"
                    type="number"
                    value={formData.min_order_qty}
                    onChange={(e) =>
                      handleInputChange('min_order_qty', parseInt(e.target.value) || 1)
                    }
                    sx={{
                      '& .MuiInputLabel-outlined': {
                        top: '50%',
                        transform: 'translate(14px, -50%) scale(1)',
                      },
                      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                        top: 0,
                        transform: 'translate(14px, -9px) scale(0.75)',
                      },
                    }}
                  />
                </Stack>
              </FormCard>
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />
      <DialogActions
        sx={{ p: { xs: 2, sm: 3 }, gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || uploadingImage}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormModal;
