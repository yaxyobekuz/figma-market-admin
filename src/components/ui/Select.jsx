import { forwardRef } from 'react';
import { HiChevronDown } from 'react-icons/hi2';

const Select = forwardRef(
  ({ label, error, options = [], className = '', containerClassName = '', ...props }, ref) => {
    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-2.5 rounded-xl appearance-none
              bg-white/5 backdrop-blur-sm
              border border-white/10
              text-white
              focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50
              transition-all duration-200
              cursor-pointer
              ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-gray-900 text-white"
              >
                {option.label}
              </option>
            ))}
          </select>
          <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
