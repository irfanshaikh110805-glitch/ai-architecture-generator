import { useState } from 'react';
import { Info } from 'lucide-react';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  delay = 100,
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
            size={14} 
            className="text-black hover:text-[#FF00FF] transition-colors stroke-[2.5]" 
          />
        )}
      </div>

      {isVisible && (
        <div
          role="tooltip"
          className={`absolute ${positions[position]} z-50 px-2.5 py-1.5 font-mono text-[11px] font-bold text-black bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_0px_#000000] whitespace-nowrap`}
          style={{ maxWidth: '240px', whiteSpace: 'normal' }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
