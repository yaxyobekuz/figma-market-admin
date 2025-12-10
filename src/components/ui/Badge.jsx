const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-gray-500/20 text-gray-300',
    primary: 'bg-violet-500/20 text-violet-300',
    success: 'bg-emerald-500/20 text-emerald-300',
    danger: 'bg-red-500/20 text-red-300',
    warning: 'bg-amber-500/20 text-amber-300',
    info: 'bg-blue-500/20 text-blue-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
