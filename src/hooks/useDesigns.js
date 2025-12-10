import { useState, useCallback } from 'react';
import designService from '../services/design.service';
import { getErrorMessage } from '../utils/helpers';

/**
 * Custom hook for managing designs
 */
export const useDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
  });

  // Fetch designs
  const fetchDesigns = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await designService.getDesigns(params);
      setDesigns(result.designs || []);
      if (result.pagination) {
        setPagination(result.pagination);
      }
      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create design
  const createDesign = useCallback(async (formData, onProgress) => {
    setLoading(true);
    setError(null);
    try {
      const result = await designService.create(formData, onProgress);
      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update design
  const updateDesign = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await designService.update(id, data);
      setDesigns((prev) =>
        prev.map((d) => (d._id === id ? result.design : d))
      );
      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete design
  const deleteDesign = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await designService.delete(id);
      setDesigns((prev) => prev.filter((d) => d._id !== id));
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Bulk delete
  const bulkDelete = useCallback(async (ids) => {
    setLoading(true);
    setError(null);
    try {
      const result = await designService.bulkDelete(ids);
      setDesigns((prev) => prev.filter((d) => !ids.includes(d._id)));
      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    designs,
    loading,
    error,
    pagination,
    fetchDesigns,
    createDesign,
    updateDesign,
    deleteDesign,
    bulkDelete,
    setDesigns,
  };
};

export default useDesigns;
