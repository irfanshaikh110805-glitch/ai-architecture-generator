/**
 * Skeleton Loader Component (Neo-Brutalist)
 */
const SkeletonLoader = ({ 
  type = 'text',
  count = 1,
  className = '' 
}) => {
  const getWidth = (index) => {
    const widths = [85, 92, 78, 88, 95, 80, 90, 75, 87, 93];
    return widths[index % widths.length];
  };

  const skeletons = {
    text: (
      <div className={`space-y-2 font-mono ${className}`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="h-4 bg-[#F4ECC8] border border-black animate-pulse" style={{ width: `${getWidth(i)}%` }} />
        ))}
      </div>
    ),
    card: (
      <div className={`${className}`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] p-5 mb-4 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#FFE600] border-2 border-black" />
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-black w-1/3" />
                <div className="h-3 bg-[#F4ECC8] border border-black w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-[#F4ECC8] border border-black w-full" />
              <div className="h-3 bg-[#F4ECC8] border border-black w-5/6" />
              <div className="h-3 bg-[#F4ECC8] border border-black w-3/4" />
            </div>
          </div>
        ))}
      </div>
    ),
    table: (
      <div className={`border-3 border-black shadow-[4px_4px_0px_0px_#000000] bg-white ${className}`}>
        <div className="grid grid-cols-4 gap-2 p-3 bg-[#FFE600] border-b-2 border-black">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-black" />
          ))}
        </div>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 p-3 border-b border-black bg-[#FDF6E3]">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-3 bg-white border border-black" />
            ))}
          </div>
        ))}
      </div>
    ),
    avatar: (
      <div className={`flex items-center gap-3 ${className}`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 font-mono">
            <div className="w-10 h-10 bg-[#00FF00] border-2 border-black" />
            <div className="space-y-1.5">
              <div className="h-3 bg-black w-24" />
              <div className="h-2 bg-[#F4ECC8] border border-black w-16" />
            </div>
          </div>
        ))}
      </div>
    ),
    image: (
      <div className={`${className}`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="w-full h-44 bg-[#FDF6E3] border-3 border-black shadow-[3px_3px_0px_0px_#000000] mb-4 flex items-center justify-center font-mono text-xs font-bold text-black uppercase">
            [ COMPILING ASSET PREVIEW ]
          </div>
        ))}
      </div>
    ),
  };

  return skeletons[type] || skeletons.text;
};

export default SkeletonLoader;
