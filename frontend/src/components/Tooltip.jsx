import { useState } from 'react';
import { Info } from 'lucide-react';

/**
 * Accessible Tooltip Component
 * Provides contextual help with keyboard and screen reader support
 */
const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  delay = 200,
  icon = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 rotate-180',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 rotate-90',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 -rotate-90',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="inline-flex items-center gap-1 cursor-help"
        tabIndex={0}
        role="button"
        aria-label="More information"
      >
        {children}
        {icon && (
          <Info 
            size={16} 
            className="text-gray-400 hover:text-blue-500 transition-colors" 
          />
        )}
      </div>

      {isVisible && (
        <div
          role="tooltip"
          className={`absolute ${positions[position]} z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap animate-fade-in`}
          style={{ maxWidth: '240px', whiteSpace: 'normal' }}
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute ${arrows[position]} w-2 h-2 bg-gray-900 transform`}
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
