import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { GitMerge, Copy, Check, AlertTriangle, ZoomIn, Maximize2, X } from 'lucide-react';

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
  const modalContainerRef = useRef(null);
  const [renderError, setRenderError] = useState(null);
  const [copied, setCopied]   = useState(false);
  const [zoomed, setZoomed]   = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [svgHtml, setSvgHtml] = useState(null);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;

    renderMermaid(code).then(({ svg, error }) => {
      if (cancelled) return;
      if (svg) {
        setSvgHtml(svg);
        setRenderError(null);
      } else {
        setRenderError(error);
      }
    });

    return () => { cancelled = true; };
  }, [code]);

  useEffect(() => {
    if (svgHtml && containerRef.current) {
      containerRef.current.innerHTML = svgHtml;
      const svgEl = containerRef.current.querySelector('svg');
      if (svgEl) {
        svgEl.style.maxWidth = '100%';
        svgEl.style.height = 'auto';
        svgEl.style.borderRadius = '0.75rem';
      }
    }
    if (svgHtml && fullscreen && modalContainerRef.current) {
      modalContainerRef.current.innerHTML = svgHtml;
      const svgEl = modalContainerRef.current.querySelector('svg');
      if (svgEl) {
        svgEl.style.width = '100%';
        svgEl.style.height = 'auto';
      }
    }
  }, [svgHtml, fullscreen, zoomed]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <div className="card-premium overflow-hidden fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-surface-100 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="section-icon flex-shrink-0">
              <Icon size={16} />
            </div>
            <h2 className="section-title text-sm sm:text-base truncate">{title}</h2>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => setFullscreen(true)}
              aria-label="Fullscreen view"
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-all border border-surface-200"
            >
              <Maximize2 size={13} />
              <span className="hidden sm:inline">Fullscreen</span>
            </button>
            <button
              onClick={() => setZoomed(z => !z)}
              aria-label="Toggle Zoom"
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-all border border-surface-200"
            >
              <ZoomIn size={13} />
              <span>{zoomed ? 'Fit' : 'Zoom'}</span>
            </button>
            <button
              onClick={handleCopy}
              aria-label="Copy Mermaid Code"
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-all border border-surface-200"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Diagram area */}
        <div className="p-3 sm:p-6">
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
              className={`overflow-x-auto overflow-y-auto rounded-xl bg-gradient-to-br from-surface-50 to-white border border-surface-200 flex items-center justify-center transition-all duration-300 touch-pan-x ${
                zoomed ? 'p-2 min-h-[300px]' : 'p-3 sm:p-6 min-h-[160px]'
              }`}
            >
              <div
                ref={containerRef}
                className={`w-full overflow-x-auto transition-transform duration-300 ${zoomed ? 'scale-125 sm:scale-150 origin-top-left p-4' : ''}`}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Fullscreen Modal for mobile & desktop ── */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-3 sm:p-6">
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <h3 className="font-bold text-sm sm:text-base">{title}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>Copy</span>
              </button>
              <button
                onClick={() => setFullscreen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
            <div
              ref={modalContainerRef}
              className="bg-white p-4 sm:p-8 rounded-2xl shadow-2xl max-w-5xl w-full overflow-auto max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </>
  );
}

function DiagramSection({ erDiagram, architectureDiagram }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {erDiagram && <DiagramPanel title="Entity Relationship Diagram" code={erDiagram} />}
      {architectureDiagram && <DiagramPanel title="Architecture Diagram" code={architectureDiagram} />}
    </div>
  );
}

export default DiagramSection;
