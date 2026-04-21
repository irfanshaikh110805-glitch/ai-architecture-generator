import { useState } from 'react';
import { loadHistory, deleteHistoryItem, clearHistory } from '../utils/stateStorage';

export default function HistoryPanel({ onLoadHistory }) {
  const [history, setHistory] = useState(loadHistory());
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = (id) => {
    if (deleteHistoryItem(id)) {
      setHistory(loadHistory());
    }
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
    setShowConfirm(false);
  };

  const handleLoad = (item) => {
    if (onLoadHistory) {
      onLoadHistory(item);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Generation History
        </h2>
        {history.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
          >
            Clear All
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200 mb-2">
            Are you sure you want to clear all history?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleClearAll}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Yes, Clear All
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No generation history yet. Start by generating an architecture!
        </p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.timestamp)}
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium mt-1 line-clamp-2">
                    {item.idea}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleLoad(item)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm"
                    title="Load this generation"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm"
                    title="Delete this item"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
