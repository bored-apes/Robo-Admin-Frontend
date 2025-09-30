import { apiFetch } from './api';

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    fileId: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    urls: {
      viewUrl: string;
      downloadUrl: string;
      directUrl: string;
    };
    imageUrl: string; // Primary URL for display
  };
  error?: string;
}

export interface FileInfo {
  fileId: string;
  name: string;
  mimeType: string;
  size: string;
  createdTime: string;
  modifiedTime: string;
  urls: {
    viewUrl: string;
    downloadUrl: string;
    directUrl: string;
  };
}

class UploadService {
  // Upload image file
  async uploadImage(
    file: File,
    folder: string = 'uploads',
    entityId?: string | number,
  ): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      if (entityId) {
        formData.append('entityId', entityId.toString());
      }

      // Use fetch directly for FormData uploads (apiFetch might not handle FormData properly)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Upload error:', error);
      return {
        success: false,
        message: error.message || 'Upload failed',
        error: error.message,
      };
    }
  }

  // Get file information
  async getFileInfo(
    fileId: string,
  ): Promise<{ success: boolean; data?: FileInfo; error?: string }> {
    try {
      const response = await apiFetch<{ success: boolean; data: FileInfo }>(
        `/common/file/${fileId}`,
      );
      return response;
    } catch (error: any) {
      console.error('Get file info error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get file info',
      };
    }
  }

  // Delete file
  async deleteFile(
    fileId: string,
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await apiFetch<{ success: boolean; message: string }>(
        `/common/file/${fileId}`,
        {
          method: 'DELETE',
        },
      );
      return response;
    } catch (error: any) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete file',
      };
    }
  }

  // Get download URL for a file
  getDownloadUrl(fileId: string): string {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/common/download/${fileId}`;
  }

  // Extract file ID from various Google Drive URL formats
  extractFileId(url: string): string | null {
    // Handle different Google Drive URL formats
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9-_]+)/, // Standard Drive URLs
      /id=([a-zA-Z0-9-_]+)/, // Direct download URLs
      /\/d\/([a-zA-Z0-9-_]+)/, // Alternative format
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    // If it's already just a file ID
    if (/^[a-zA-Z0-9-_]+$/.test(url)) {
      return url;
    }

    return null;
  }

  // Helper method to validate file type
  isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  }

  // Helper method to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const uploadService = new UploadService();
