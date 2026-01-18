import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineDocumentText,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { Input, Textarea, Button, ProgressBar, RichTextEditor } from "../ui";
import ImageUploader from "../design/ImageUploader";
import ImageCropper from "../design/ImageCropper";

const BlogForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  uploadProgress = 0,
  isUploading = false,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
  });

  const [thumbnail, setThumbnail] = useState([]);
  const [cropImage, setCropImage] = useState(null);
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

  // Handle content change (Rich Text Editor)
  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: null }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.content.trim() || formData.content === "<p></p>") {
      newErrors.content = "Content is required";
    }

    if (!initialData && thumbnail.length === 0) {
      newErrors.thumbnail = "Thumbnail is required";
    }

    // SEO validations
    if (formData.metaTitle && formData.metaTitle.length > 60) {
      newErrors.metaTitle = "Meta title should be less than 60 characters";
    }

    if (formData.metaDescription && formData.metaDescription.length > 160) {
      newErrors.metaDescription =
        "Meta description should be less than 160 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Prepare form data
    const submitData = new FormData();
    submitData.append("title", formData.title.trim());
    submitData.append("description", formData.description.trim());
    submitData.append("content", formData.content);

    if (formData.metaTitle.trim()) {
      submitData.append("metaTitle", formData.metaTitle.trim());
    }
    if (formData.metaDescription.trim()) {
      submitData.append("metaDescription", formData.metaDescription.trim());
    }

    // Add thumbnail (only for new blogs)
    if (!initialData && thumbnail[0]?.file) {
      submitData.append("thumbnail", thumbnail[0].file);
    }

    onSubmit(submitData, formData);
  };

  // Handle crop request
  const handleCropRequest = (image) => {
    setCropImage(image);
  };

  // Handle crop complete
  const handleCropComplete = useCallback(
    (result) => {
      if (!result) return;

      const newImage = {
        id: cropImage.id,
        file: result.file,
        preview: result.preview,
        name: result.file.name,
        size: result.file.size,
      };

      setThumbnail([newImage]);
      setCropImage(null);
    },
    [cropImage]
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload progress */}
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ProgressBar
              progress={uploadProgress}
              variant="primary"
              size="lg"
            />
          </motion.div>
        )}

        {/* Title */}
        <Input
          label="Title *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter blog title"
          error={errors.title}
          disabled={loading}
        />

        {/* Description */}
        <Textarea
          label="Short Description *"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of the blog post (max 500 characters)"
          rows={3}
          maxLength={500}
          error={errors.description}
          disabled={loading}
          icon={HiOutlineDocumentText}
        />

        {/* Content (Rich Text Editor) */}
        <RichTextEditor
          label="Content *"
          content={formData.content}
          onChange={handleContentChange}
          placeholder="Write your blog content here..."
          error={errors.content}
          disabled={loading}
        />

        {/* SEO Section */}
        <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-gray-300 mb-4">
            <HiOutlineMagnifyingGlass className="w-5 h-5" />
            <span className="font-medium">SEO Settings (Optional)</span>
          </div>

          <Input
            label="Meta Title"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            placeholder="SEO title (max 60 characters)"
            maxLength={60}
            error={errors.metaTitle}
            disabled={loading}
            hint={`${formData.metaTitle.length}/60 characters`}
          />

          <Textarea
            label="Meta Description"
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            placeholder="SEO description (max 160 characters)"
            rows={2}
            maxLength={160}
            error={errors.metaDescription}
            disabled={loading}
          />
          <p className="text-xs text-gray-500">
            {formData.metaDescription.length}/160 characters
          </p>
        </div>

        {/* Thumbnail */}
        {!initialData && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Thumbnail Image * (4:3 ratio)
            </label>
            <ImageUploader
              images={thumbnail}
              onChange={setThumbnail}
              onCropRequest={handleCropRequest}
              maxImages={1}
              error={errors.thumbnail}
              disabled={loading}
              aspectRatio="4:3"
            />
            {errors.thumbnail && (
              <p className="text-sm text-red-400">{errors.thumbnail}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading || isUploading}
            disabled={loading || isUploading}
          >
            {initialData ? "Update Blog" : "Create Blog"}
          </Button>
        </div>
      </form>

      {/* Image Cropper Modal */}
      {cropImage && (
        <ImageCropper
          image={cropImage.preview}
          onComplete={handleCropComplete}
          onCancel={() => setCropImage(null)}
          aspectRatio={4 / 3}
        />
      )}
    </>
  );
};

export default BlogForm;
