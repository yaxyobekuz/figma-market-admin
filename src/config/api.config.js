// API Configuration
export const API_BASE_URL = 'http://localhost:8080';
export const API_URL = `${API_BASE_URL}/api`;

// Endpoints
export const ENDPOINTS = {
  designs: '/designs',
  popular: '/designs/popular',
  categoryStats: '/designs/stats/categories',
  tags: '/designs/tags',
};

// Upload limits
export const UPLOAD_LIMITS = {
  maxThumbnailSize: 5 * 1024 * 1024, // 5MB
  maxPreviewSize: 10 * 1024 * 1024, // 10MB
  maxPreviewImages: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
};
