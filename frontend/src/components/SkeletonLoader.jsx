/**
 * Skeleton Loader Component
 * Provides loading placeholders for better perceived performance
 */
const SkeletonLoader = ({ 
  type = 'text',
  count = 1,
  className = '' 
}) => {
  // Generate stable widths based on index instead of random
  const getWidth = (index) => {
    const widths = [85, 92, 78, 88, 95, 80, 90, 75, 87, 93];
    return widths[index % widths.length];
  };

  const skeletons = {
    text: (
      <div className={`animate-pulse space-y-3 ${className}`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${getWidth(i)}%` }} />
        ))}
      </div>
    ),
    card: (
      <div className={`animate-pulse ${className}`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
        ))}
      </div>
    ),
    table: (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
          {/* Rows */}
          {[...Array(count)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    avatar: (
      <div className={`animate-pulse flex items-center gap-3 ${className}`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-2 bg-gray-200 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    ),
    image: (
      <div className={`animate-pulse ${className}`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
        ))}
      </div>
    ),
  };

  return skeletons[type] || skeletons.text;
};

export default SkeletonLoader;
