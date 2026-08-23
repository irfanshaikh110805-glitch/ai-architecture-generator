import { Palette } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const THEMES = [
  { id: 'neo-magenta', label: 'Magenta / Lime', bg: '#FF00FF' },
  { id: 'neo-yellow',  label: 'Yellow / Cyan',   bg: '#FFE600' },
  { id: 'neo-green',   label: 'High-Vis Green',  bg: '#00FF00' },
  { id: 'neo-cyan',    label: 'Cyber Cyan',      bg: '#00FFFF' },
];

function ThemeToggle() {
  const { colorTheme, setColorTheme } = useAppStore();

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
      <Palette size={14} className="text-black stroke-[2.5] flex-shrink-0" />
      <div className="flex items-center gap-1.5">
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => setColorTheme(t.id)}
            title={t.label}
            aria-label={`Switch theme to ${t.label}`}
            className={`w-4 h-4 border border-black transition-all ${
              colorTheme === t.id
                ? 'scale-125 shadow-[1px_1px_0px_0px_#000000]'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundColor: t.bg }}
          />
        ))}
      </div>
    </div>
  );
}

export default ThemeToggle;
