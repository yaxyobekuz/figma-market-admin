import { motion } from 'framer-motion';
import { HiCheckCircle, HiMinusCircle } from 'react-icons/hi2';

const Checkbox = ({ checked, onChange, indeterminate, label, className = '' }) => {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <motion.div
          whileTap={{ scale: 0.9 }}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
            ${checked || indeterminate
              ? 'bg-violet-500 border-violet-500'
              : 'bg-transparent border-gray-500 hover:border-gray-400'
            }
          `}
        >
          {indeterminate ? (
            <HiMinusCircle className="w-4 h-4 text-white" />
          ) : checked ? (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          ) : null}
        </motion.div>
      </div>
      {label && <span className="text-sm text-gray-300">{label}</span>}
    </label>
  );
};

export default Checkbox;
