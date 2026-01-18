import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { Card, Button } from "../components/ui";
import { BlogForm } from "../components/blog";
import { useBlogs } from "../hooks";
import toast from "react-hot-toast";

const AddBlog = () => {
  const navigate = useNavigate();
  const { createBlog, loading } = useBlogs();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const result = await createBlog(formData, (progress) => {
        setUploadProgress(progress);
      });

      if (result.success) {
        toast.success("Blog created successfully!");
        navigate("/blogs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
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
          <h1 className="text-2xl font-bold text-white">Add New Blog</h1>
          <p className="text-gray-400">Create a new blog post</p>
        </div>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <BlogForm
            onSubmit={handleSubmit}
            loading={loading}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default AddBlog;
