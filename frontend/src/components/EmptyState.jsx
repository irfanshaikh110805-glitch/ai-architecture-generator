import { FileQuestion, Plus, Search, Inbox } from 'lucide-react';

/**
 * Empty State Component
 * Provides helpful guidance when no content is available
 */
const EmptyState = ({ 
  type = 'default',
  title,
  description,
  actionLabel,
  onAction,
  icon: CustomIcon,
  className = ''
}) => {
  const presets = {
    default: {
      icon: Inbox,
      title: 'No items found',
      description: 'Get started by creating your first item',
      actionLabel: 'Create New',
    },
    search: {
      icon: Search,
      title: 'No results found',
      description: 'Try adjusting your search terms or filters',
    },
    error: {
      icon: FileQuestion,
      title: 'Something went wrong',
      description: 'We couldn\'t load this content. Please try again.',
      actionLabel: 'Retry',
    },
    history: {
      icon: Inbox,
      title: 'No history yet',
      description: 'Your generated architectures will appear here',
      actionLabel: 'Generate Architecture',
    },
  };

  const preset = presets[type] || presets.default;
  const Icon = CustomIcon || preset.icon;
  const finalTitle = title || preset.title;
  const finalDescription = description || preset.description;
  const finalActionLabel = actionLabel || preset.actionLabel;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
        {finalTitle}
      </h3>

      <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
        {finalDescription}
      </p>

      {finalActionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus size={16} />
          {finalActionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
