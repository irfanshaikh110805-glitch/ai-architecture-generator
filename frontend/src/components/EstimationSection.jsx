import { useState } from 'react';
import { Copy, Check, Calculator } from 'lucide-react';

function EstimationSection({ estimation }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `Hours: ${estimation.hours}\nTeam Size: ${estimation.team_size}\nCost: ${estimation.cost}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-premium p-5 sm:p-7">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <div className="section-icon bg-[#FFE600] text-black">
            <Calculator size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="section-title text-base sm:text-xl">PROJECT ESTIMATION</h2>
            <p className="font-mono text-xs font-bold text-gray-600 mt-0.5">DEV EFFORT & RESOURCE SIZING</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="font-mono text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-3 py-1.5 hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1 flex-shrink-0 uppercase"
        >
          {copied ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} className="stroke-[2.5]" />}
          <span>{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#FDF6E3] border-2 border-black shadow-[3px_3px_0px_0px_#000000] p-5 text-center">
          <p className="font-mono text-xs font-black text-gray-700 uppercase mb-2">[ DEV HOURS ]</p>
          <p className="font-display font-black text-2xl sm:text-3xl text-black uppercase">{estimation.hours}</p>
        </div>
        <div className="bg-[#00FF00] border-2 border-black shadow-[3px_3px_0px_0px_#000000] p-5 text-center">
          <p className="font-mono text-xs font-black text-black uppercase mb-2">[ TEAM SIZING ]</p>
          <p className="font-display font-black text-xl sm:text-2xl text-black uppercase">{estimation.team_size}</p>
        </div>
        <div className="bg-[#FF00FF] text-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] p-5 text-center">
          <p className="font-mono text-xs font-black text-white uppercase mb-2">[ ESTIMATED BUDGET ]</p>
          <p className="font-display font-black text-xl sm:text-2xl text-white uppercase">{estimation.cost}</p>
        </div>
      </div>
    </div>
  );
}

export default EstimationSection;
