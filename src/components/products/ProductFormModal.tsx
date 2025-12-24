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
import { normalizeImageUrls } from '../../utils/imageUtils';
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
    image_urls: [],
    status: ProductStatusEnum.Active,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // Normalized URLs for display
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]); // Original URLs for form data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (product && mode === 'edit') {
      // Get existing images from product and normalize URLs for display
      const rawImages = Array.isArray(product.image_urls)
        ? product.image_urls
        : product.image_urls
          ? [product.image_urls]
          : [];
      const normalizedImages = normalizeImageUrls(rawImages);

      setFormData({
        name: product.name || '',
        description: product.description || '',
        type: product.type || ProductTypeEnum.IC,
        category: product.category || ProductCategoryEnum.Semiconductor,
        base_price: product.base_price || 0,
        gst_rate: product.gst_rate || 18,
        min_order_qty: product.min_order_qty || 1,
        stock_quantity: product.stock_quantity || 0,
        image_urls: rawImages, // Store original URLs
        status: product.status || ProductStatusEnum.Active,
      });
      setExistingImages(normalizedImages); // Use normalized URLs for display
      setOriginalImageUrls(rawImages); // Store original URLs for removal logic
      setImagePreviews([]);
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
        image_urls: [],
        status: ProductStatusEnum.Active,
      });
      setExistingImages([]);
      setOriginalImageUrls([]);
      setImagePreviews([]);
    }
    setSelectedFiles([]);
    setError('');
  }, [product, mode, open]);

  const handleInputChange = (field: keyof ProductInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate all files are images
    const invalidFiles = files.filter((file) => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Please select only image files');
      return;
    }

    // Limit to 10 files
    if (files.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    setSelectedFiles(files);
    setError('');

    // Create previews for all selected files
    const previewPromises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then((previews) => {
      setImagePreviews(previews);
    });
  };

  const handleRemoveImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      const updatedDisplay = existingImages.filter((_, i) => i !== index);
      const updatedOriginal = originalImageUrls.filter((_, i) => i !== index);
      setExistingImages(updatedDisplay);
      setOriginalImageUrls(updatedOriginal);
      setFormData((prev) => ({
        ...prev,
        image_urls: updatedOriginal,
      }));
    } else {
      const updatedFiles = selectedFiles.filter((_, i) => i !== index);
      const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
      setSelectedFiles(updatedFiles);
      setImagePreviews(updatedPreviews);
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

      let imageUrls = originalImageUrls;

      // Upload new images if files are selected
      if (selectedFiles.length > 0) {
        setUploadingImage(true);
        try {
          const entityId = product?.id || `temp_${Date.now()}`;
          const uploadResult = await uploadService.uploadMultipleImages(
            selectedFiles,
            'products',
            entityId,
          );

          if (uploadResult.success && uploadResult.data) {
            const newImageUrls = uploadResult.data.imageUrls || [];
            // Combine existing and new images
            imageUrls = [...originalImageUrls, ...newImageUrls];
            console.log(`${newImageUrls.length} image(s) uploaded successfully`);
          } else {
            throw new Error(uploadResult.message || 'Upload failed');
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          setError('Failed to upload images. Product will be saved with existing images only.');
          // Continue with form submission with existing images
        } finally {
          setUploadingImage(false);
        }
      }

      const submitData: ProductInput = {
        ...formData,
        image_urls: imageUrls.length > 0 ? imageUrls : null,
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

            {/* Product Images Card - Right side on desktop */}
            <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' } }}>
              <FormCard title="Product Images" icon={ImageIcon}>
                <Stack spacing={2}>
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Existing Images ({existingImages.length})
                      </Typography>
                      <Grid container spacing={1}>
                        {existingImages.map((url, index) => (
                          <Grid item xs={6} sm={4} key={`existing-${index}`}>
                            <Box
                              sx={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '1/1',
                                borderRadius: 1,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <img
                                src={url}
                                alt={`Product ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                sx={{
                                  position: 'absolute',
                                  top: 4,
                                  right: 4,
                                  minWidth: 'auto',
                                  width: 24,
                                  height: 24,
                                  p: 0,
                                }}
                                onClick={() => handleRemoveImage(index, true)}
                              >
                                ×
                              </Button>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* New Image Previews */}
                  {imagePreviews.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        New Images ({imagePreviews.length})
                      </Typography>
                      <Grid container spacing={1}>
                        {imagePreviews.map((preview, index) => (
                          <Grid item xs={6} sm={4} key={`preview-${index}`}>
                            <Box
                              sx={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '1/1',
                                borderRadius: 1,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                sx={{
                                  position: 'absolute',
                                  top: 4,
                                  right: 4,
                                  minWidth: 'auto',
                                  width: 24,
                                  height: 24,
                                  p: 0,
                                }}
                                onClick={() => handleRemoveImage(index, false)}
                              >
                                ×
                              </Button>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Upload Button */}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    disabled={uploadingImage || existingImages.length + imagePreviews.length >= 10}
                    size="small"
                    fullWidth
                  >
                    {uploadingImage
                      ? 'Uploading...'
                      : `Select Images (${existingImages.length + imagePreviews.length}/10)`}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      disabled={
                        uploadingImage || existingImages.length + imagePreviews.length >= 10
                      }
                    />
                  </Button>

                  {selectedFiles.length > 0 && (
                    <Typography variant="body2" color="primary" align="center">
                      {selectedFiles.length} new image(s) selected
                    </Typography>
                  )}

                  {existingImages.length === 0 && imagePreviews.length === 0 && (
                    <Box
                      sx={{
                        width: '100%',
                        aspectRatio: '1/1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                    </Box>
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
