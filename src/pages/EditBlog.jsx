import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineArrowLeft,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineClock,
} from 'react-icons/hi2';
import {
  Card,
  Button,
  Spinner,
  Badge,
  ConfirmDialog,
  ImagePreview,
} from '../components/ui';
import { BlogForm } from '../components/blog';
import { useBlogs } from '../hooks';
import blogService from '../services/blog.service';
import { formatDate, formatNumber } from '../utils/helpers';
import toast from 'react-hot-toast';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBlog, deleteBlog, loading } = useBlogs();
  const [blog, setBlog] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setFetchLoading(true);
      const result = await blogService.getById(id);
      if (result.success) {
        setBlog(result.blog);
      }
    } catch (error) {
      toast.error('Failed to fetch blog');
      navigate('/blogs');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (formData, rawData) => {
    try {
      // For update, we send JSON data, not FormData
      const result = await updateBlog(id, rawData);

      if (result.success) {
        toast.success('Blog updated successfully!');
        setBlog(result.blog);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update blog');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBlog(id);
      toast.success('Blog deleted successfully');
      navigate('/blogs');
    } catch (error) {
      toast.error('Failed to delete blog');
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

  if (!blog) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Blog not found</p>
        <Button variant="ghost" onClick={() => navigate('/blogs')} className="mt-4">
          Back to Blogs
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
            onClick={() => navigate('/blogs')}
            className="!p-2"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Blog</h1>
            <p className="text-gray-400">Update blog post details</p>
          </div>
        </div>

        <Button
          variant="danger"
          onClick={() => setDeleteConfirm(true)}
        >
          <HiOutlineTrash className="w-5 h-5 mr-2" />
          Delete Blog
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <BlogForm
                initialData={blog}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Thumbnail preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                Current Thumbnail
              </h3>
              {blog.thumbnail?.path && (
                <ImagePreview
                  src={blogService.getImageUrl(blog.thumbnail.path)}
                  alt={blog.title}
                  className="rounded-xl overflow-hidden aspect-[4/3]"
                />
              )}
            </Card>
          </motion.div>

          {/* Blog stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                Blog Stats
              </h3>
              <div className="space-y-4">
                {/* Reading time */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Reading Time</span>
                  <Badge variant="secondary">
                    <HiOutlineClock className="w-4 h-4 mr-1" />
                    {blog.readingTime} min
                  </Badge>
                </div>

                {/* Views */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Views</span>
                  <span className="flex items-center gap-2 text-white">
                    <HiOutlineEye className="w-5 h-5 text-violet-400" />
                    {formatNumber(blog.viewsCount || 0)}
                  </span>
                </div>

                {/* Created date */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white">
                    {formatDate(blog.createdAt)}
                  </span>
                </div>

                {/* Updated date */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-white">
                    {formatDate(blog.updatedAt)}
                  </span>
                </div>

                {/* Slug */}
                <div className="pt-4 border-t border-white/10">
                  <span className="text-gray-400 text-sm">URL Slug</span>
                  <p className="text-white font-mono text-sm mt-1 break-all">
                    {blog.slug}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Blog"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default EditBlog;
