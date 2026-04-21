import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { GitMerge, Copy, Check, AlertTriangle, ZoomIn } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#0f2040',
    primaryBorderColor: '#60a5fa',
    lineColor: '#64748b',
    background: '#ffffff',
    mainBkg: '#f8fafc',
    nodeBorder: '#bfdbfe',
    clusterBkg: '#eff6ff',
    titleColor: '#0f2040',
    edgeLabelBackground: '#f8fafc',
    fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
  },
});

let diagramCounter = 0;

async function renderMermaid(code) {
  const id = `mermaid-diagram-${++diagramCounter}`;
  try {
    const { svg } = await mermaid.render(id, code);
    return { svg, error: null };
  } catch (err) {
    return { svg: null, error: String(err?.message || 'Render failed') };
  }
}

function DiagramPanel({ title, code }) {
  const Icon = GitMerge;
  const containerRef = useRef(null);
  const [renderError, setRenderError] = useState(null);
  const [copied, setCopied]   = useState(false);
  const [zoomed, setZoomed]   = useState(false);

  useEffect(() => {
    if (!code || !containerRef.current) return;
    let cancelled = false;

    renderMermaid(code).then(({ svg, error }) => {
      if (cancelled) return;
      if (svg) {
        containerRef.current.innerHTML = svg;
        // Style the SVG
        const svgEl = containerRef.current.querySelector('svg');
        if (svgEl) {
          svgEl.style.maxWidth = '100%';
          svgEl.style.height   = 'auto';
          svgEl.style.borderRadius = '0.75rem';
        }
        setRenderError(null);
      } else {
        setRenderError(error);
      }
    });

    return () => { cancelled = true; };
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="card-premium overflow-hidden fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <div className="section-icon">
            <Icon size={16} />
          </div>
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomed(z => !z)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all border border-transparent hover:border-brand-200"
          >
            <ZoomIn size={13} />
            {zoomed ? 'Fit' : 'Zoom'}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all border border-transparent hover:border-brand-200"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy Mermaid'}
          </button>
        </div>
      </div>

      {/* Diagram area */}
      <div className="p-6">
        {renderError ? (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm mb-2">Unable to render diagram — showing raw Mermaid code:</p>
              <pre className="text-xs text-amber-700 bg-amber-100/70 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">{code}</pre>
            </div>
          </div>
        ) : (
          <div
            className={`overflow-auto rounded-xl bg-gradient-to-br from-surface-50 to-white border border-surface-200 flex items-center justify-center transition-all duration-300 ${zoomed ? 'p-2' : 'p-6'}`}
            style={{ minHeight: '160px' }}
          >
            <div
              ref={containerRef}
              className={`w-full transition-transform duration-300 ${zoomed ? 'scale-125 origin-center' : ''}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DiagramSection({ erDiagram, architectureDiagram }) {
  return (
    <div className="space-y-5">
      {erDiagram && <DiagramPanel title="Entity Relationship Diagram" code={erDiagram} />}
      {architectureDiagram && <DiagramPanel title="Architecture Diagram" code={architectureDiagram} />}
    </div>
  );
}

export default DiagramSection;
