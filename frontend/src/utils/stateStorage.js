/**
 * State persistence utilities for localStorage
 */

const STORAGE_KEY = 'ai-arch-generator-state';
const HISTORY_KEY = 'ai-arch-generator-history';
const MAX_HISTORY_ITEMS = 50;

/**
 * Save state to localStorage
 */
export const saveState = (state) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

/**
 * Load state from localStorage
 */
export const loadState = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return undefined;
    }
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Failed to load state:', error);
    return undefined;
  }
};

/**
 * Clear saved state
 */
export const clearState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear state:', error);
  }
};

/**
 * Save generation to history
 */
export const saveToHistory = (generation) => {
  try {
    const history = loadHistory();
    const newItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      idea: generation.idea,
      result: generation.result,
    };
    
    // Add to beginning and limit size
    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return newItem;
  } catch (error) {
    console.error('Failed to save to history:', error);
    return null;
  }
};

/**
 * Load generation history
 */
export const loadHistory = () => {
  try {
    const serialized = localStorage.getItem(HISTORY_KEY);
    if (serialized === null) {
      return [];
    }
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

/**
 * Delete history item
 */
export const deleteHistoryItem = (id) => {
  try {
    const history = loadHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete history item:', error);
    return false;
  }
};

/**
 * Clear all history
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

/**
 * Get storage usage info
 */
export const getStorageInfo = () => {
  try {
    const state = localStorage.getItem(STORAGE_KEY);
    const history = localStorage.getItem(HISTORY_KEY);
    
    return {
      stateSize: state ? new Blob([state]).size : 0,
      historySize: history ? new Blob([history]).size : 0,
      historyCount: loadHistory().length,
    };
  } catch (error) {
    console.error('Failed to get storage info:', error);
    return { stateSize: 0, historySize: 0, historyCount: 0 };
  }
};
