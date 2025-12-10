import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCloudArrowUp,
  HiOutlinePhoto,
  HiXMark,
  HiOutlineScissors,
  HiOutlineClipboard,
} from "react-icons/hi2";
import {
  formatFileSize,
  validateImage,
  readFileAsDataURL,
  generateId,
} from "../../utils/helpers";
import { UPLOAD_LIMITS } from "../../config/api.config";

const ImageUploader = ({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = UPLOAD_LIMITS.maxPreviewSize,
  accept = "image/jpeg,image/png,image/webp",
  label = "Upload Images",
  multiple = true,
  onCropRequest,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState([]);
  const [pasteMessage, setPasteMessage] = useState("");
  const fileInputRef = useRef(null);

  // Handle paste from clipboard button
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      const imageItems = [];

      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            const file = new File([blob], `clipboard-${Date.now()}.png`, {
              type: blob.type,
            });
            imageItems.push(file);
          }
        }
      }

      if (imageItems.length > 0) {
        setPasteMessage("Image loaded from clipboard!");
        setTimeout(() => setPasteMessage(""), 2000);
        await handleFiles(imageItems);
      } else {
        setPasteMessage("No image found in clipboard");
        setTimeout(() => setPasteMessage(""), 2000);
      }
    } catch (error) {
      console.error("Clipboard error:", error);
      setErrors(["Failed to read from clipboard"]);
    }
  };

  // Handle file selection
  const handleFiles = useCallback(
    async (files) => {
      const fileList = Array.from(files);
      const newErrors = [];
      const validFiles = [];

      for (const file of fileList) {
        // Check max files limit
        if (value.length + validFiles.length >= maxFiles) {
          newErrors.push(`Maximum ${maxFiles} files allowed`);
          break;
        }

        // Validate file
        const validation = validateImage(file, {
          maxSize,
          allowedTypes: accept.split(","),
        });

        if (!validation.valid) {
          newErrors.push(...validation.errors.map((e) => `${file.name}: ${e}`));
          continue;
        }

        // Read file as data URL for preview
        try {
          const dataUrl = await readFileAsDataURL(file);
          validFiles.push({
            id: generateId(),
            file,
            preview: dataUrl,
            name: file.name,
            size: file.size,
          });
        } catch (error) {
          newErrors.push(`${file.name}: Failed to read file`);
        }
      }

      setErrors(newErrors);

      if (validFiles.length > 0) {
        if (multiple) {
          onChange([...value, ...validFiles]);
        } else {
          onChange(validFiles.slice(0, 1));
        }
      }
    },
    [value, onChange, maxFiles, maxSize, accept, multiple]
  );

  // Handle drag events
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      handleFiles(files);
    },
    [handleFiles]
  );

  // Handle click to upload
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
    // Reset input value to allow selecting same file again
    e.target.value = "";
  };

  // Remove file
  const handleRemove = (id) => {
    onChange(value.filter((item) => item.id !== id));
  };

  // Request crop for a file
  const handleCrop = (item) => {
    if (onCropRequest) {
      onCropRequest(item);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          <span className="text-gray-500 ml-2">
            ({value.length}/{maxFiles})
          </span>
        </label>
      )}

      {/* Paste notification */}
      <AnimatePresence>
        {pasteMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-violet-500/20 border border-violet-500/30 rounded-lg"
          >
            <HiOutlineClipboard className="w-4 h-4 text-violet-400" />
            <p className="text-sm text-violet-300">{pasteMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        animate={{
          borderColor: isDragging
            ? "rgb(139, 92, 246)"
            : "rgba(255, 255, 255, 0.1)",
          backgroundColor: isDragging
            ? "rgba(139, 92, 246, 0.1)"
            : "rgba(255, 255, 255, 0.02)",
        }}
        className={`
          relative border-2 border-dashed rounded-2xl p-8
          cursor-pointer transition-all duration-200
          ${value.length >= maxFiles ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{ scale: isDragging ? 1.1 : 1 }}
            className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-4"
          >
            <HiOutlineCloudArrowUp className="w-8 h-8 text-violet-400" />
          </motion.div>
          <p className="text-white font-medium mb-1">
            {isDragging ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-sm text-gray-500 mb-3">or click to browse</p>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <HiOutlinePhoto className="w-4 h-4" />
            <span>JPG, PNG, WebP • Max {formatFileSize(maxSize)}</span>
          </div>
        </div>
      </motion.div>

      {/* Paste from clipboard button */}
      {value.length < maxFiles && (
        <button
          type="button"
          onClick={handlePasteFromClipboard}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 rounded-xl text-violet-300 transition-all duration-200"
        >
          <HiOutlineClipboard className="w-5 h-5" />
          <span className="text-sm">Paste from Clipboard</span>
        </button>
      )}

      {/* Errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-1"
          >
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-red-400">
                {error}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview grid */}
      <AnimatePresence>
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {value.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="relative group aspect-square"
              >
                <img
                  src={item.preview}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-xl border border-white/10"
                />

                {/* Overlay */}
                <div className="absolute inset-0 z-10 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center gap-2">
                  {onCropRequest && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCrop(item);
                      }}
                      className="p-2 bg-violet-500/80 hover:bg-violet-500 rounded-lg text-white transition-colors"
                      title="Crop image"
                    >
                      <HiOutlineScissors className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.id);
                    }}
                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors"
                    title="Remove image"
                  >
                    <HiXMark className="w-4 h-4" />
                  </button>
                </div>

                {/* File info */}
                <div className="absolute bottom-0 left-0 right-0 z-0 p-2 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                  <p className="text-xs text-white truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(item.size)}
                  </p>
                </div>

                {/* Index badge */}
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-medium">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUploader;
