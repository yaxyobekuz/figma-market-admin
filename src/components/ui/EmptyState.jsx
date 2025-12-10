const EmptyState = ({
  icon: Icon,
  title = 'No data found',
  description = '',
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Icon className="w-10 h-10 text-gray-500" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 text-center max-w-md mb-6">{description}</p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;
