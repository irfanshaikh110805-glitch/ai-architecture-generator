import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { GitMerge, Copy, Check, AlertTriangle, ZoomIn, Maximize2, X } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Space Mono, Fira Code, monospace',
  themeVariables: {
    primaryColor: '#FFE600',
    primaryTextColor: '#000000',
    primaryBorderColor: '#000000',
    lineColor: '#000000',
    background: '#FFFFFF',
    mainBkg: '#FDF6E3',
    nodeBorder: '#000000',
    clusterBkg: '#FFFFFF',
    titleColor: '#000000',
    edgeLabelBackground: '#FFFFFF',
    fontFamily: 'Space Mono, Fira Code, monospace',
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
      <div className="card-premium overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-black gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="section-icon bg-[#FF00FF] text-white flex-shrink-0">
              <GitMerge size={18} className="stroke-[2.5]" />
            </div>
            <h2 className="section-title text-sm sm:text-lg truncate uppercase">{title}</h2>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 font-mono text-xs font-bold">
            <button
              onClick={() => setFullscreen(true)}
              aria-label="Fullscreen view"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] uppercase transition-all"
            >
              <Maximize2 size={13} className="stroke-[2.5]" />
              <span className="hidden sm:inline">FULLSCREEN</span>
            </button>
            <button
              onClick={() => setZoomed(z => !z)}
              aria-label="Toggle Zoom"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#00FFFF] active:translate-x-[1px] active:translate-y-[1px] uppercase transition-all"
            >
              <ZoomIn size={13} className="stroke-[2.5]" />
              <span>{zoomed ? 'FIT' : 'ZOOM'}</span>
            </button>
            <button
              onClick={handleCopy}
              aria-label="Copy Mermaid Code"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#00FF00] active:translate-x-[1px] active:translate-y-[1px] uppercase transition-all"
            >
              {copied ? <Check size={13} className="text-black stroke-[3]" /> : <Copy size={13} className="stroke-[2.5]" />}
              <span className="hidden sm:inline">{copied ? 'COPIED!' : 'COPY CODE'}</span>
            </button>
          </div>
        </div>

        {/* Diagram area */}
        <div className="p-4 sm:p-6 bg-[#FDF6E3]">
          {renderError ? (
            <div className="p-4 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_0px_#000000]">
              <div className="flex items-center gap-2 mb-2 font-mono font-black text-xs uppercase text-black">
                <AlertTriangle size={16} className="stroke-[3]" />
                UNABLE TO RENDER DIAGRAM — RAW MERMAID CODE:
              </div>
              <pre className="text-xs text-black bg-white p-3 border-2 border-black overflow-x-auto whitespace-pre-wrap font-mono">{code}</pre>
            </div>
          ) : (
            <div
              className={`overflow-x-auto overflow-y-auto bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] flex items-center justify-center transition-all ${
                zoomed ? 'p-2 min-h-[300px]' : 'p-4 sm:p-6 min-h-[160px]'
              }`}
            >
              <div
                ref={containerRef}
                className={`w-full overflow-x-auto transition-transform ${zoomed ? 'scale-125 sm:scale-150 origin-top-left p-4' : ''}`}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Fullscreen Modal ── */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col p-4 sm:p-8">
          <div className="flex items-center justify-between bg-[#FDF6E3] border-3 border-black p-3 shadow-[4px_4px_0px_0px_#000000] mb-4">
            <h3 className="font-display font-black text-base uppercase text-black">{title}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 font-mono text-xs font-bold bg-[#00FF00] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] uppercase"
              >
                {copied ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} className="stroke-[2.5]" />}
                <span>COPY</span>
              </button>
              <button
                onClick={() => setFullscreen(false)}
                className="p-1 font-mono font-bold bg-[#FF5500] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000000]"
              >
                <X size={18} className="stroke-[3]" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-2">
            <div
              ref={modalContainerRef}
              className="bg-white p-4 sm:p-8 border-3 border-black shadow-[8px_8px_0px_0px_#000000] max-w-6xl w-full overflow-auto max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </>
  );
}

function DiagramSection({ erDiagram, architectureDiagram }) {
  return (
    <div className="space-y-6">
      {erDiagram && <DiagramPanel title="Entity Relationship Diagram" code={erDiagram} />}
      {architectureDiagram && <DiagramPanel title="Architecture Diagram" code={architectureDiagram} />}
    </div>
  );
}

export default DiagramSection;
