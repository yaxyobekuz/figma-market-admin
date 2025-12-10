import api from './api.service';
import { ENDPOINTS, API_BASE_URL } from '../config/api.config';

/**
 * Design Service - All design-related API calls
 */
const designService = {
  /**
   * Get all designs with filtering and pagination
   * @param {Object} params - Query parameters
   */
  getDesigns: async (params = {}) => {
    const response = await api.get(ENDPOINTS.designs, { params });
    return response.data;
  },

  /**
   * Get popular designs
   * @param {Object} params - Query parameters
   */
  getPopular: async (params = {}) => {
    const response = await api.get(ENDPOINTS.popular, { params });
    return response.data;
  },

  /**
   * Get a single design by ID
   * @param {string} id - Design ID
   */
  getById: async (id) => {
    const response = await api.get(`${ENDPOINTS.designs}/${id}`);
    return response.data;
  },

  /**
   * Create a new design with progress tracking
   * @param {FormData} formData - Form data with design info and images
   * @param {Function} onProgress - Progress callback
   */
  create: async (formData, onProgress) => {
    const response = await api.post(ENDPOINTS.designs, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  },

  /**
   * Update an existing design
   * @param {string} id - Design ID
   * @param {Object} data - Updated design data
   */
  update: async (id, data) => {
    const response = await api.put(`${ENDPOINTS.designs}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a design
   * @param {string} id - Design ID
   */
  delete: async (id) => {
    const response = await api.delete(`${ENDPOINTS.designs}/${id}`);
    return response.data;
  },

  /**
   * Bulk delete designs
   * @param {string[]} ids - Array of design IDs
   */
  bulkDelete: async (ids) => {
    const results = await Promise.allSettled(
      ids.map((id) => api.delete(`${ENDPOINTS.designs}/${id}`))
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return { successful, failed, total: ids.length };
  },

  /**
   * Get category statistics
   */
  getCategoryStats: async () => {
    const response = await api.get(ENDPOINTS.categoryStats);
    return response.data;
  },

  /**
   * Get all tags
   */
  getTags: async () => {
    const response = await api.get(ENDPOINTS.tags);
    return response.data;
  },

  /**
   * Get image URL
   * @param {string} path - Image path
   */
  getImageUrl: (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  },
};

export default designService;
