import { FileQuestion, Plus, Search, Inbox } from 'lucide-react';

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
      title: 'NO ITEMS FOUND',
      description: 'Get started by creating your first architecture blueprint.',
      actionLabel: 'CREATE SPEC',
    },
    search: {
      icon: Search,
      title: 'NO MATCHING RESULTS',
      description: 'Try adjusting your search criteria or keywords.',
    },
    error: {
      icon: FileQuestion,
      title: 'SYSTEM ERROR DETECTED',
      description: 'Could not resolve data stream. Please re-try.',
      actionLabel: 'RETRY',
    },
    history: {
      icon: Inbox,
      title: 'NO REVISION LOGS YET',
      description: 'Compiled architecture specifications appear here automatically.',
      actionLabel: 'GENERATE NOW',
    },
  };

  const preset = presets[type] || presets.default;
  const Icon = CustomIcon || preset.icon;
  const finalTitle = title || preset.title;
  const finalDescription = description || preset.description;
  const finalActionLabel = actionLabel || preset.actionLabel;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000000] text-center ${className}`}>
      <div className="w-14 h-14 bg-[#FFE600] border-2 border-black flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_#000000]">
        <Icon size={26} className="text-black stroke-[2.5]" />
      </div>

      <h3 className="font-display font-black text-base sm:text-lg uppercase text-black mb-1">
        {finalTitle}
      </h3>

      <p className="font-mono text-xs text-gray-700 mb-6 max-w-md font-medium">
        {finalDescription}
      </p>

      {finalActionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00FF00] text-black font-display font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
        >
          <Plus size={16} className="stroke-[3]" />
          {finalActionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
