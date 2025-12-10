import { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal, Button } from '../ui';
import {
  HiArrowPath,
  HiCheck,
  HiLockClosed,
  HiLockOpen,
} from 'react-icons/hi2';

// Aspect ratio presets
const ASPECT_RATIOS = [
  { label: 'Free', value: null, icon: '⬚' },
  { label: '4:3', value: 4 / 3, icon: '▭' },
  { label: '16:9', value: 16 / 9, icon: '▬' },
  { label: '1:1', value: 1, icon: '□' },
  { label: '3:4', value: 3 / 4, icon: '▯' },
  { label: '9:16', value: 9 / 16, icon: '▮' },
];

const ImageCropper = ({ isOpen, onClose, image, onCropComplete, aspectRatio: defaultAspectRatio }) => {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState(defaultAspectRatio || 4 / 3);
  const [isLocked, setIsLocked] = useState(true);
  const imgRef = useRef(null);

  // Generate cropped image
  const generateCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return null;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], image?.name || 'cropped-image.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            const preview = canvas.toDataURL('image/jpeg', 0.9);
            resolve({ file, preview });
          } else {
            resolve(null);
          }
        },
        'image/jpeg',
        0.9
      );
    });
  }, [completedCrop]);

  // Handle crop completion
  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      const result = await generateCroppedImage();
      if (result && onCropComplete) {
        onCropComplete(result);
      }
      onClose();
    } catch (error) {
      console.error('Crop error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset crop
  const handleReset = () => {
    setCrop({
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5,
    });
  };

  // Aspect ratio o'zgartirish
  const handleRatioChange = (ratio) => {
    setSelectedRatio(ratio);
    // Ratio o'zgarganda cropni reset qilish
    handleReset();
  };

  // Lock/Unlock toggle
  const toggleLock = () => {
    setIsLocked(!isLocked);
    if (!isLocked) {
      // Lock qilganda default ratio ga qaytish
      setSelectedRatio(4 / 3);
    } else {
      // Unlock qilganda erkin crop
      setSelectedRatio(null);
    }
    handleReset();
  };

  // Hozirgi aspect ratio qiymatini olish
  const currentAspect = isLocked ? selectedRatio : null;

  if (!image) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crop Image"
      size="lg"
    >
      <div className="p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 p-3 bg-white/5 rounded-xl">
          {/* Lock toggle */}
          <button
            onClick={toggleLock}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isLocked
                ? 'bg-violet-500/20 text-violet-400'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {isLocked ? (
              <HiLockClosed className="w-4 h-4" />
            ) : (
              <HiLockOpen className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isLocked ? 'Locked' : 'Free'}
            </span>
          </button>

          {/* Aspect ratio buttons */}
          <div className="flex items-center gap-1 flex-wrap">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.label}
                onClick={() => {
                  if (ratio.value === null) {
                    setIsLocked(false);
                    setSelectedRatio(null);
                  } else {
                    setIsLocked(true);
                    handleRatioChange(ratio.value);
                  }
                }}
                disabled={!isLocked && ratio.value !== null}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  (isLocked && selectedRatio === ratio.value) ||
                  (!isLocked && ratio.value === null)
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <span className="mr-1">{ratio.icon}</span>
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        {/* Crop area */}
        <div className="flex justify-center bg-black/50 rounded-xl p-4 overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={currentAspect}
            className="max-h-[60vh]"
          >
            <img
              ref={imgRef}
              src={image.preview}
              alt="Crop preview"
              className="max-h-[60vh] object-contain"
            />
          </ReactCrop>
        </div>

        {/* Info */}
        <div className="text-sm text-gray-400 text-center">
          {isLocked ? (
            <>
              Aspect ratio: <span className="text-violet-400 font-medium">
                {ASPECT_RATIOS.find((r) => r.value === selectedRatio)?.label || '4:3'}
              </span>
              {' '}— Unlock to crop freely
            </>
          ) : (
            <>
              <span className="text-emerald-400 font-medium">Free crop</span>
              {' '}— Crop freely along X and Y axes
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={handleReset} icon={HiArrowPath}>
            Reset
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleComplete}
            loading={isProcessing}
            icon={HiCheck}
          >
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageCropper;
