import api from "./api.service";
import { API_BASE_URL } from "../config/api.config";

// Blog endpoints
const BLOG_ENDPOINTS = {
  blogs: "/blogs",
  recent: "/blogs/recent",
};

/**
 * Blog Service - All blog-related API calls
 */
const blogService = {
  /**
   * Get all blogs with filtering and pagination
   * @param {Object} params - Query parameters
   */
  getBlogs: async (params = {}) => {
    const response = await api.get(BLOG_ENDPOINTS.blogs, { params });
    return response.data;
  },

  /**
   * Get recent blogs
   * @param {Object} params - Query parameters
   */
  getRecent: async (params = {}) => {
    const response = await api.get(BLOG_ENDPOINTS.recent, { params });
    return response.data;
  },

  /**
   * Get a single blog by ID
   * @param {string} id - Blog ID
   */
  getById: async (id) => {
    const response = await api.get(`${BLOG_ENDPOINTS.blogs}/${id}`);
    return response.data;
  },

  /**
   * Create a new blog with progress tracking
   * @param {FormData} formData - Form data with blog info and thumbnail
   * @param {Function} onProgress - Progress callback
   */
  create: async (formData, onProgress) => {
    const response = await api.post(BLOG_ENDPOINTS.blogs, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
    return response.data;
  },

  /**
   * Update an existing blog
   * @param {string} id - Blog ID
   * @param {Object} data - Updated blog data
   */
  update: async (id, data) => {
    const response = await api.put(`${BLOG_ENDPOINTS.blogs}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a blog
   * @param {string} id - Blog ID
   */
  delete: async (id) => {
    const response = await api.delete(`${BLOG_ENDPOINTS.blogs}/${id}`);
    return response.data;
  },

  /**
   * Bulk delete blogs
   * @param {string[]} ids - Array of blog IDs
   */
  bulkDelete: async (ids) => {
    const results = await Promise.allSettled(
      ids.map((id) => api.delete(`${BLOG_ENDPOINTS.blogs}/${id}`))
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return { successful, failed, total: ids.length };
  },

  /**
   * Get image URL
   * @param {string} path - Image path
   */
  getImageUrl: (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  },
};

export default blogService;
