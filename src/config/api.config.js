// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_URL = `${API_BASE_URL}/api`;

// Endpoints
export const ENDPOINTS = {
  designs: "/designs",
  popular: "/designs/popular",
  categoryStats: "/designs/stats/categories",
  tags: "/designs/tags",
};

// Upload limits
export const UPLOAD_LIMITS = {
  maxThumbnailSize: 15 * 1024 * 1024, // 15MB
  maxPreviewSize: 15 * 1024 * 1024, // 15MB
  maxPreviewImages: 5,
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
};
