import { Palette } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const THEMES = [
  { id: 'blue',    label: 'Ocean Blue', from: '#2563eb', to: '#06b6d4' },
  { id: 'sky',     label: 'Sky',        from: '#0ea5e9', to: '#38bdf8' },
  { id: 'emerald', label: 'Forest',     from: '#10b981', to: '#0ea5e9' },
  { id: 'amber',   label: 'Sunset',     from: '#f59e0b', to: '#f97316' },
];

function ThemeToggle() {
  const { colorTheme, setColorTheme } = useAppStore();

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-surface-50 rounded-xl border border-surface-200">
      <Palette size={13} className="text-gray-400 flex-shrink-0" />
      <div className="flex items-center gap-1.5">
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => setColorTheme(t.id)}
            title={t.label}
            aria-label={`Switch theme to ${t.label}`}
            className={`w-5 h-5 rounded-full transition-all duration-200 ${
              colorTheme === t.id
                ? 'ring-2 ring-offset-1 ring-blue-400 scale-110 shadow-md'
                : 'opacity-60 hover:opacity-100 hover:scale-105'
            }`}
            style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
          />
        ))}
      </div>
    </div>
  );
}

export default ThemeToggle;
