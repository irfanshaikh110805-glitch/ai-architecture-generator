import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * @param {string} key - Key to listen for (e.g., 'Enter', 's', 'Escape')
 * @param {Function} callback - Function to call when key is pressed
 * @param {Object} options - Options object
 * @param {boolean} options.ctrl - Require Ctrl key
 * @param {boolean} options.shift - Require Shift key
 * @param {boolean} options.alt - Require Alt key
 * @param {boolean} options.meta - Require Meta/Cmd key
 * @param {boolean} options.preventDefault - Prevent default behavior
 */
const useKeyboardShortcut = (key, callback, options = {}) => {
  const {
    ctrl = false,
    shift = false,
    alt = false,
    meta = false,
    preventDefault = true,
  } = options;

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      const modifiersMatch =
        event.ctrlKey === ctrl &&
        event.shiftKey === shift &&
        event.altKey === alt &&
        event.metaKey === meta;

      if (keyMatches && modifiersMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, ctrl, shift, alt, meta, preventDefault]);
};

export default useKeyboardShortcut;
