import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineArrowLeft,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineLink,
} from 'react-icons/hi2';
import {
  Card,
  Button,
  Spinner,
  Badge,
  ConfirmDialog,
  ImagePreview,
} from '../components/ui';
import { DesignForm } from '../components/design';
import { useDesigns } from '../hooks';
import designService from '../services/design.service';
import { formatDate, formatNumber } from '../utils/helpers';
import toast from 'react-hot-toast';

const EditDesign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateDesign, deleteDesign, loading } = useDesigns();
  const [design, setDesign] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchDesign();
  }, [id]);

  const fetchDesign = async () => {
    try {
      setFetchLoading(true);
      const result = await designService.getById(id);
      if (result.success) {
        setDesign(result.design);
      }
    } catch (error) {
      toast.error('Failed to fetch design');
      navigate('/designs');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (formData, rawData) => {
    try {
      // For update, we send JSON data, not FormData
      const result = await updateDesign(id, rawData);

      if (result.success) {
        toast.success('Design updated successfully!');
        setDesign(result.design);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update design');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDesign(id);
      toast.success('Design deleted successfully');
      navigate('/designs');
    } catch (error) {
      toast.error('Failed to delete design');
    } finally {
      setDeleteConfirm(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!design) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Design not found</p>
        <Button variant="ghost" onClick={() => navigate('/designs')} className="mt-4">
          Back to Designs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="!p-2"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Design</h1>
            <p className="text-gray-400">Update design information</p>
          </div>
        </div>
        <Button
          variant="danger"
          icon={HiOutlineTrash}
          onClick={() => setDeleteConfirm(true)}
        >
          Delete Design
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            <DesignForm
              initialData={design}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Preview */}
          <Card padding="none">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold text-white">Thumbnail</h3>
            </div>
            <div className="p-4">
              {design.thumbnail?.path && (
                <ImagePreview
                  src={designService.getImageUrl(design.thumbnail.path)}
                  alt={design.title}
                  size="full"
                  className="rounded-xl overflow-hidden"
                />
              )}
            </div>
          </Card>

          {/* Preview Images */}
          {design.previewImages?.length > 0 && (
            <Card padding="none">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold text-white">
                  Preview Images ({design.previewImages.length})
                </h3>
              </div>
              <div className="p-4 grid grid-cols-3 gap-2">
                {design.previewImages.map((img, index) => (
                  <ImagePreview
                    key={img._id || index}
                    src={designService.getImageUrl(img.path)}
                    alt={`Preview ${index + 1}`}
                    size="sm"
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Stats */}
          <Card>
            <h3 className="font-semibold text-white mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <HiOutlineEye className="w-4 h-4" />
                  Views
                </span>
                <span className="text-white font-medium">
                  {formatNumber(design.viewsCount || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <HiOutlineLink className="w-4 h-4" />
                  Clicks
                </span>
                <span className="text-white font-medium">
                  {formatNumber(design.urlClicksCount || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Popularity Score</span>
                <Badge variant="primary">
                  {design.popularityScore?.toFixed(2) || 0}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Info */}
          <Card>
            <h3 className="font-semibold text-white mb-4">Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Created</span>
                <span className="text-white">
                  {formatDate(design.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Updated</span>
                <span className="text-white">
                  {formatDate(design.updatedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">ID</span>
                <code className="text-xs text-violet-400 bg-violet-500/10 px-2 py-1 rounded">
                  {design._id}
                </code>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Design"
        message="Are you sure you want to delete this design? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={loading}
      />
    </div>
  );
};

export default EditDesign;
