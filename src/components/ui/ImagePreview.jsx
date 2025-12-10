import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiArrowsPointingOut } from "react-icons/hi2";

const ImagePreview = ({
  src,
  alt = "Preview",
  onRemove,
  className = "",
  showFullscreen = true,
  size = "md",
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const sizes = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
    full: "w-full aspect-video",
  };

  if (error) {
    return (
      <div
        className={`${sizes[size]} rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500`}
      >
        Failed to load
      </div>
    );
  }

  return (
    <>
      <div className={`relative group ${sizes[size]} ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/5 rounded-xl animate-pulse" />
        )}
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
          className={`w-full h-full object-cover rounded-xl transition-all duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center gap-2">
          {showFullscreen && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
            >
              <HiArrowsPointingOut className="w-4 h-4" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Modal - Portal orqali root elementga render qilinadi */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isFullscreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md"
                onClick={() => setIsFullscreen(false)}
              >
                {/* Close button */}
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <HiXMark className="w-6 h-6" />
                </button>

                {/* Image container - Ekran markazida */}
                <div className="w-full h-full flex items-center justify-center p-6">
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    src={src}
                    alt={alt}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default ImagePreview;
