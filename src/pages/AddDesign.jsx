import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { Card, Button } from '../components/ui';
import { DesignForm } from '../components/design';
import { useDesigns } from '../hooks';
import toast from 'react-hot-toast';

const AddDesign = () => {
  const navigate = useNavigate();
  const { createDesign, loading } = useDesigns();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const result = await createDesign(formData, (progress) => {
        setUploadProgress(progress);
      });

      if (result.success) {
        toast.success('Design created successfully!');
        navigate('/designs');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create design');
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
          <h1 className="text-2xl font-bold text-white">Add New Design</h1>
          <p className="text-gray-400">Create a new design entry</p>
        </div>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <DesignForm
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

export default AddDesign;
