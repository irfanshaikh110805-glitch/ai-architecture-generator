import { useEffect, useState } from 'react';

/**
 * Smooth Progress Bar Component (Neo-Brutalist)
 */
const ProgressBar = ({ 
  progress = 0, 
  showPercentage = true, 
  label = '', 
  height = 'h-3.5',
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayProgress(progress);
    }, 50);

    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <div className="w-full font-mono">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5 text-xs font-bold uppercase text-black">
          {label && (
            <span>{label}</span>
          )}
          {showPercentage && (
            <span className="bg-[#FFE600] px-1.5 py-0.2 border border-black text-[10px]">
              {Math.round(displayProgress)}%
            </span>
          )}
        </div>
      )}

      <div className={`w-full bg-[#FDF6E3] border-2 border-black ${height} overflow-hidden`}>
        <div
          className={`bg-[#00FF00] ${height} border-r-2 border-black transition-all duration-300 ease-out`}
          style={{ width: `${displayProgress}%` }}
          role="progressbar"
          aria-valuenow={displayProgress}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
