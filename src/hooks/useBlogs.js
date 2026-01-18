import { useState, useCallback } from "react";
import blogService from "../services/blog.service";

/**
 * Custom hook for blog operations
 */
const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false,
  });

  /**
   * Fetch blogs with parameters
   */
  const fetchBlogs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getBlogs(params);
      setBlogs(data.blogs || []);
      setPagination(data.pagination || pagination);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch blogs");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get single blog by ID
   */
  const getBlogById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getById(id);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch blog");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new blog
   */
  const createBlog = useCallback(async (formData, onProgress) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.create(formData, onProgress);
      return data;
    } catch (err) {
      setError(err.message || "Failed to create blog");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a blog
   */
  const updateBlog = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.update(id, updateData);
      // Update local state
      setBlogs((prev) =>
        prev.map((blog) => (blog._id === id ? data.blog : blog))
      );
      return data;
    } catch (err) {
      setError(err.message || "Failed to update blog");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a blog
   */
  const deleteBlog = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await blogService.delete(id);
      // Remove from local state
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to delete blog");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Bulk delete blogs
   */
  const bulkDelete = useCallback(async (ids) => {
    setLoading(true);
    setError(null);
    try {
      const result = await blogService.bulkDelete(ids);
      // Remove deleted from local state
      setBlogs((prev) => prev.filter((blog) => !ids.includes(blog._id)));
      return result;
    } catch (err) {
      setError(err.message || "Failed to delete blogs");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    blogs,
    loading,
    error,
    pagination,
    fetchBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    bulkDelete,
  };
};

export default useBlogs;
