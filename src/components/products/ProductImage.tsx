'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { ZoomIn, BrokenImage } from '@mui/icons-material';

interface ProductImageProps {
  imageUrl: string | null | undefined;
  alt?: string;
  width?: number | string;
  height?: number | string;
  showZoom?: boolean;
}

// Image URL transformation utilities
const ImageUrlHelper = {
  extractFileId: (url: string): string | null => {
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9-_]+)/, // Standard Drive URLs
      /id=([a-zA-Z0-9-_]+)/, // Direct download URLs
      /\/d\/([a-zA-Z0-9-_]+)/, // Alternative format
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    // If it's already just a file ID
    if (/^[a-zA-Z0-9-_]+$/.test(url)) return url;
    return null;
  },

  generateFallbackUrls: (originalUrl: string): string[] => {
    const fileId = ImageUrlHelper.extractFileId(originalUrl);
    if (!fileId) return [originalUrl];

    return [
      // Google's CDN - most reliable for public images
      `https://lh3.googleusercontent.com/d/${fileId}=w400-h400-c`,
      // Alternative Google CDN format
      `https://lh3.googleusercontent.com/d/${fileId}=s400`,
      // Drive thumbnail API
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`,
      // Direct download (may have CORS issues but worth trying)
      `https://drive.google.com/uc?id=${fileId}`,
      // Original URL as last resort
      originalUrl,
    ];
  },
};

const ProductImage: React.FC<ProductImageProps> = ({
  imageUrl,
  alt = 'Product image',
  width = 80,
  height = 80,
  showZoom = true,
}) => {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [imageState, setImageState] = useState<{
    loading: boolean;
    error: boolean;
    currentUrl: string | null;
    attemptIndex: number;
    urls: string[];
  }>({
    loading: false,
    error: false,
    currentUrl: null,
    attemptIndex: 0,
    urls: [],
  });

  // Initialize image URLs when imageUrl prop changes
  useEffect(() => {
    if (!imageUrl) {
      setImageState({
        loading: false,
        error: false,
        currentUrl: null,
        attemptIndex: 0,
        urls: [],
      });
      return;
    }

    const urls = ImageUrlHelper.generateFallbackUrls(imageUrl);
    setImageState({
      loading: true,
      error: false,
      currentUrl: urls[0],
      attemptIndex: 0,
      urls,
    });
  }, [imageUrl]);

  // Handle image loading errors with fallback URLs
  const handleImageError = useCallback(() => {
    setImageState((prev) => {
      const nextIndex = prev.attemptIndex + 1;

      if (nextIndex < prev.urls.length) {
        return {
          ...prev,
          currentUrl: prev.urls[nextIndex],
          attemptIndex: nextIndex,
          loading: true,
        };
      } else {
        return {
          ...prev,
          loading: false,
          error: true,
        };
      }
    });
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageState((prev) => ({
      ...prev,
      loading: false,
      error: false,
    }));
  }, []);

  // Render placeholder for invalid/missing images
  if (!imageUrl || !imageState.currentUrl || imageState.error) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <BrokenImage sx={{ color: 'grey.400', fontSize: '1.5rem' }} />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        {/* Loading overlay */}
        {imageState.loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              zIndex: 2,
            }}
          >
            <CircularProgress size={20} />
          </Box>
        )}

        {/* Main image */}
        <img
          key={`${imageState.currentUrl}-${imageState.attemptIndex}`} // Force re-render on URL change
          src={imageState.currentUrl}
          alt={alt}
          style={{
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
            objectFit: 'cover',
            borderRadius: '8px',
            border: '1px solid #ddd',
            display: 'block',
            backgroundColor: '#f5f5f5',
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Zoom button */}
        {showZoom && !imageState.loading && !imageState.error && (
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              bgcolor: 'rgba(0,0,0,0.6)',
              color: 'white',
              opacity: 0.8,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.8)',
                opacity: 1,
              },
            }}
            onClick={() => setZoomOpen(true)}
          >
            <ZoomIn fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Zoom Dialog */}
      <Dialog
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { bgcolor: 'rgba(0,0,0,0.9)' },
        }}
      >
        <DialogContent sx={{ p: 1, textAlign: 'center' }}>
          <img
            src={imageState.currentUrl}
            alt={alt}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: '4px',
            }}
            onError={() => {
              // If zoom image fails, close dialog
              setZoomOpen(false);
            }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'rgba(0,0,0,0.9)' }}>
          <Button onClick={() => setZoomOpen(false)} sx={{ color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductImage;
