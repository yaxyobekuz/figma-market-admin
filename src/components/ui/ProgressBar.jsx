import { motion } from 'framer-motion';

const ProgressBar = ({
  progress = 0,
  showLabel = true,
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-violet-500 to-indigo-500',
    success: 'bg-gradient-to-r from-emerald-500 to-green-500',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500',
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Uploading...</span>
          <span className="text-white font-medium">{progress}%</span>
        </div>
      )}
      <div
        className={`w-full ${sizes[size]} bg-white/10 rounded-full overflow-hidden`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`h-full ${variants[variant]} rounded-full`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
