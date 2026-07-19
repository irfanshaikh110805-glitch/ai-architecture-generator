import { useEffect, useState } from 'react';

/**
 * Smooth Progress Bar Component
 * Shows upload/generation progress with animation
 */
const ProgressBar = ({ 
  progress = 0, 
  showPercentage = true, 
  label = '', 
  color = 'blue',
  height = 'h-2',
  animated = true 
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Smooth animation to target progress
    const timeout = setTimeout(() => {
      setDisplayProgress(progress);
    }, 50);

    return () => clearTimeout(timeout);
  }, [progress]);

  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600',
  };

  const bgColors = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(displayProgress)}%
            </span>
          )}
        </div>
      )}

      <div className={`w-full ${bgColors[color]} rounded-full ${height} overflow-hidden`}>
        <div
          className={`${colors[color]} ${height} rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${displayProgress}%` }}
          role="progressbar"
          aria-valuenow={displayProgress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
