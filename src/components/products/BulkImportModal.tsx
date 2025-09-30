'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CloudUpload,
  FileDownload,
  Info,
  CheckCircle,
  Error as ErrorIcon,
  UploadFile,
} from '@mui/icons-material';
import { productService } from '../../services/productService';

interface BulkImportModalProps {
  open: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({ open, onClose, onImportComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [importResults, setImportResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv', // .csv
      ];

      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setError('');
        setImportResults(null);
      } else {
        setError('Please select a valid Excel (.xlsx, .xls) or CSV file');
        setSelectedFile(null);
      }
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      // You might want to create a template download endpoint
      // For now, we'll trigger the export which can serve as a template
      const blob = await productService.exportProducts();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'products_template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download template');
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError('Please select a file to import');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const result = await productService.importProducts(selectedFile);

      setImportResults(result);
      setSuccess(`Import completed! ${result.products?.length || 0} products processed.`);
      onImportComplete();
    } catch (err: any) {
      if (err.status === 400 && err.details) {
        setError(`Import failed: ${err.message || 'Validation errors occurred'}`);
        setImportResults(err);
      } else {
        setError(err.message || 'Failed to import products');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError('');
    setSuccess('');
    setImportResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <UploadFile color="primary" />
          <Typography variant="h6">Bulk Import Products</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {error && !importResults && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Instructions */}
          <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Info color="primary" />
              <Typography variant="subtitle2">Import Instructions</Typography>
            </Stack>
            <List dense>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText
                  primary="1. Download the template file to see the required format"
                  sx={{ ml: 0 }}
                />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText
                  primary="2. Fill in your product data following the template structure"
                  sx={{ ml: 0 }}
                />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText
                  primary="3. Upload your completed file (Excel or CSV format)"
                  sx={{ ml: 0 }}
                />
              </ListItem>
            </List>
          </Paper>

          {/* Template Download */}
          <Box>
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={handleDownloadTemplate}
              sx={{ mb: 2 }}
            >
              Download Template
            </Button>
          </Box>

          <Divider />

          {/* File Upload */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Select File to Import
            </Typography>

            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: selectedFile ? 'success.main' : 'grey.300',
                bgcolor: selectedFile ? 'success.50' : 'grey.50',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
              />

              <CloudUpload
                sx={{
                  fontSize: 48,
                  color: selectedFile ? 'success.main' : 'grey.400',
                  mb: 1,
                }}
              />

              {selectedFile ? (
                <Stack spacing={1}>
                  <Typography variant="body1" color="success.main">
                    Selected: {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Stack>
              ) : (
                <Stack spacing={1}>
                  <Typography variant="body1">Click to select a file or drag and drop</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported formats: .xlsx, .xls, .csv
                  </Typography>
                </Stack>
              )}
            </Paper>
          </Box>

          {/* Import Results */}
          {importResults && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Import Results
              </Typography>

              {importResults.results?.successful?.length > 0 && (
                <Alert severity="success" sx={{ mb: 1 }}>
                  <Stack>
                    <Typography variant="body2">
                      ✅ {importResults.results.successful.length} products imported successfully
                    </Typography>
                  </Stack>
                </Alert>
              )}

              {importResults.results?.failed?.length > 0 && (
                <Alert severity="error">
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      ❌ {importResults.results.failed.length} products failed to import
                    </Typography>
                    <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
                      {importResults.results.failed
                        .slice(0, 5)
                        .map((failure: any, index: number) => (
                          <Typography key={index} variant="body2" sx={{ fontSize: '0.75rem' }}>
                            Row {failure.row}: {failure.error}
                          </Typography>
                        ))}
                      {importResults.results.failed.length > 5 && (
                        <Typography
                          variant="body2"
                          sx={{ fontSize: '0.75rem', fontStyle: 'italic' }}
                        >
                          ... and {importResults.results.failed.length - 5} more errors
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Alert>
              )}
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleClose} disabled={uploading}>
          {importResults ? 'Close' : 'Cancel'}
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!selectedFile || uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
        >
          {uploading ? 'Importing...' : 'Import Products'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkImportModal;
