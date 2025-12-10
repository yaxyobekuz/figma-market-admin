import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineLink,
  HiOutlineTag,
  HiOutlineDocumentText,
} from 'react-icons/hi2';
import { Input, Textarea, Select, Button, ProgressBar } from '../ui';
import ImageUploader from './ImageUploader';
import ImageCropper from './ImageCropper';
import categories from '../../data/data/categories.data';

const DesignForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  uploadProgress = 0,
  isUploading = false,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || categories[1]?.slug || '',
    description: initialData?.description || '',
    url: initialData?.url || '',
    tags: initialData?.tags?.join(', ') || '',
  });

  const [thumbnail, setThumbnail] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [cropImage, setCropImage] = useState(null);
  const [cropTarget, setCropTarget] = useState(null); // 'thumbnail' or 'preview'
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.url && !isValidUrl(formData.url)) {
      newErrors.url = 'Invalid URL format';
    }

    if (!initialData) {
      if (thumbnail.length === 0) {
        newErrors.thumbnail = 'Thumbnail is required';
      }
      if (previewImages.length === 0) {
        newErrors.previewImages = 'At least one preview image is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // URL validation helper
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Prepare form data
    const submitData = new FormData();
    submitData.append('title', formData.title.trim());
    submitData.append('category', formData.category);
    submitData.append('description', formData.description.trim());
    
    if (formData.url.trim()) {
      submitData.append('url', formData.url.trim());
    }

    // Process tags
    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
    tags.forEach((tag) => submitData.append('tags[]', tag));

    // Add images (only for new designs)
    if (!initialData) {
      if (thumbnail[0]?.file) {
        submitData.append('thumbnail', thumbnail[0].file);
      }
      previewImages.forEach((img) => {
        if (img.file) {
          submitData.append('previewImages', img.file);
        }
      });
    }

    onSubmit(submitData, formData);
  };

  // Handle crop request
  const handleCropRequest = (image, target) => {
    setCropImage(image);
    setCropTarget(target);
  };

  // Handle crop complete
  const handleCropComplete = useCallback(
    (result) => {
      if (!result || !cropTarget) return;

      const newImage = {
        id: cropImage.id,
        file: result.file,
        preview: result.preview,
        name: result.file.name,
        size: result.file.size,
      };

      if (cropTarget === 'thumbnail') {
        setThumbnail([newImage]);
      } else {
        setPreviewImages((prev) =>
          prev.map((img) => (img.id === cropImage.id ? newImage : img))
        );
      }

      setCropImage(null);
      setCropTarget(null);
    },
    [cropImage, cropTarget]
  );

  // Category options
  const categoryOptions = categories
    .filter((_, index) => index !== 0)
    .map((cat) => ({
      value: cat.slug,
      label: cat.name,
    }));

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload progress */}
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ProgressBar progress={uploadProgress} variant="primary" size="lg" />
          </motion.div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter design title"
            error={errors.title}
            disabled={loading}
          />

          <Select
            label="Category *"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            error={errors.category}
            disabled={loading}
          />
        </div>

        {/* Description */}
        <Textarea
          label="Description *"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter design description"
          rows={4}
          error={errors.description}
          disabled={loading}
        />

        {/* URL and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Figma URL"
            name="url"
            type="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://figma.com/..."
            icon={HiOutlineLink}
            error={errors.url}
            disabled={loading}
          />

          <Input
            label="Tags (comma separated)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="ui, dashboard, minimal"
            icon={HiOutlineTag}
            disabled={loading}
          />
        </div>

        {/* Images - only show for new designs */}
        {!initialData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thumbnail */}
            <div>
              <ImageUploader
                value={thumbnail}
                onChange={setThumbnail}
                maxFiles={1}
                multiple={false}
                label="Thumbnail *"
                onCropRequest={(img) => handleCropRequest(img, 'thumbnail')}
              />
              {errors.thumbnail && (
                <p className="text-sm text-red-400 mt-1">{errors.thumbnail}</p>
              )}
            </div>

            {/* Preview Images */}
            <div>
              <ImageUploader
                value={previewImages}
                onChange={setPreviewImages}
                maxFiles={5}
                multiple={true}
                label="Preview Images *"
                onCropRequest={(img) => handleCropRequest(img, 'preview')}
              />
              {errors.previewImages && (
                <p className="text-sm text-red-400 mt-1">{errors.previewImages}</p>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={isUploading}
          >
            {initialData ? 'Update Design' : 'Create Design'}
          </Button>
        </div>
      </form>

      {/* Crop Modal */}
      <ImageCropper
        isOpen={!!cropImage}
        onClose={() => {
          setCropImage(null);
          setCropTarget(null);
        }}
        image={cropImage}
        onCropComplete={handleCropComplete}
        aspectRatio={cropTarget === 'thumbnail' ? 16 / 9 : undefined}
      />
    </>
  );
};

export default DesignForm;
