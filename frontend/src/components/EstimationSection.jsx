import { useState } from 'react';

function EstimationSection({ estimation }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `Hours: ${estimation.hours}\nTeam Size: ${estimation.team_size}\nCost: ${estimation.cost}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Project Estimation</h2>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center">
          <p className="text-sm font-semibold text-blue-800 mb-2">Development Hours</p>
          <p className="text-2xl font-bold text-blue-900">{estimation.hours}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center">
          <p className="text-sm font-semibold text-green-800 mb-2">Team Size</p>
          <p className="text-2xl font-bold text-green-900">{estimation.team_size}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg text-center">
          <p className="text-sm font-semibold text-purple-800 mb-2">Estimated Cost</p>
          <p className="text-2xl font-bold text-purple-900">{estimation.cost}</p>
        </div>
      </div>
    </div>
  );
}

export default EstimationSection;
