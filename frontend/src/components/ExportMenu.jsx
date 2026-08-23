import { useState, useRef, useEffect } from 'react';
import { FileDown, FileText, Clipboard, Check, ChevronDown, FileJson, FileCode, Download, Loader2, Image, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import mermaid from 'mermaid';
import { exportToPDF } from '../utils/pdfExport';

function ExportMenu({ result, idea }) {
  const [open, setOpen] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const buildMarkdown = () => {
    let md = `# System Architecture: ${idea}\n\n`;
    md += `> Generated on ${new Date().toLocaleDateString()}\n\n`;
    md += `## Features\n`;
    result.features?.forEach(f => { md += `- **[${f.priority}]** ${f.name}\n`; });
    md += `\n## Database Schema\n`;
    result.database?.forEach(table => {
      md += `### ${table.table}\n`;
      md += `**Fields:** ${table.fields.join(', ')}\n`;
      if (table.relationships?.length) md += `**Relationships:** ${table.relationships.join(', ')}\n`;
      md += '\n';
    });
    md += `## REST APIs\n`;
    result.apis?.forEach(api => {
      md += `- \`${api.method}\` **${api.endpoint}** — ${api.description}\n`;
    });
    md += `\n## Architecture\n`;
    md += `**Type:** ${result.architecture?.type}\n`;
    md += `**Components:** ${result.architecture?.components?.join(', ')}\n\n`;
    md += `### Tech Stack\n`;
    md += `| Layer | Technology |\n|---|---|\n`;
    md += `| Frontend | ${result.architecture?.tech_stack?.frontend} |\n`;
    md += `| Backend | ${result.architecture?.tech_stack?.backend} |\n`;
    md += `| Database | ${result.architecture?.tech_stack?.database} |\n\n`;
    md += `## Roadmap\n`;
    result.roadmap?.forEach(phase => {
      md += `### ${phase.phase}\n`;
      phase.tasks?.forEach(t => { md += `- ${t}\n`; });
      md += '\n';
    });
    md += `## Estimation\n`;
    md += `- **Hours:** ${result.estimation?.hours}\n`;
    md += `- **Team Size:** ${result.estimation?.team_size}\n`;
    md += `- **Cost:** ${result.estimation?.cost}\n\n`;
    md += `## ER Diagram\n\`\`\`mermaid\n${result.erDiagram}\n\`\`\`\n\n`;
    md += `## Architecture Diagram\n\`\`\`mermaid\n${result.architectureDiagram}\n\`\`\`\n`;
    return md;
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'architecture.json'; a.click();
    URL.revokeObjectURL(url);
    toast.success('JSON exported!', { icon: '⚡' });
    setOpen(false);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([buildMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'architecture.md'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Markdown exported!', { icon: '⚡' });
    setOpen(false);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(buildMarkdown()).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
      toast.success('Copied to clipboard!', { icon: '⚡' });
    });
    setOpen(false);
  };

  const buildYAML = () => {
    let yaml = `# System Architecture\n`;
    yaml += `title: "${idea}"\n`;
    yaml += `generated: ${new Date().toISOString()}\n\n`;
    yaml += `architecture:\n`;
    yaml += `  type: ${result.architecture?.type}\n`;
    yaml += `  components:\n`;
    result.architecture?.components?.forEach(c => { yaml += `    - ${c}\n`; });
    yaml += `  tech_stack:\n`;
    yaml += `    frontend: ${result.architecture?.tech_stack?.frontend}\n`;
    yaml += `    backend: ${result.architecture?.tech_stack?.backend}\n`;
    yaml += `    database: ${result.architecture?.tech_stack?.database}\n\n`;
    yaml += `features:\n`;
    result.features?.forEach(f => {
      yaml += `  - name: ${f.name}\n`;
      yaml += `    priority: ${f.priority}\n`;
    });
    yaml += `\napis:\n`;
    result.apis?.forEach(api => {
      yaml += `  - method: ${api.method}\n`;
      yaml += `    endpoint: ${api.endpoint}\n`;
      yaml += `    description: ${api.description}\n`;
    });
    yaml += `\ndatabase:\n`;
    result.database?.forEach(table => {
      yaml += `  - table: ${table.table}\n`;
      yaml += `    fields: [${table.fields.join(', ')}]\n`;
      if (table.relationships?.length) {
        yaml += `    relationships: [${table.relationships.join(', ')}]\n`;
      }
    });
    return yaml;
  };

  const handleDownloadYAML = () => {
    const blob = new Blob([buildYAML()], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'architecture.yaml'; a.click();
    URL.revokeObjectURL(url);
    toast.success('YAML exported!', { icon: '⚡' });
    setOpen(false);
  };

  const handleDownloadDiagrams = async () => {
    const loadingToast = toast.loading('Exporting diagrams as images...');
    try {
      const zip = await import('jszip').then(m => m.default);
      const zipFile = new zip();

      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'Space Mono, monospace'
      });

      if (result.erDiagram) {
        try {
          const erContainer = document.createElement('div');
          erContainer.style.position = 'absolute';
          erContainer.style.left = '-9999px';
          erContainer.style.background = 'white';
          erContainer.style.padding = '40px';
          erContainer.style.width = '1200px';
          erContainer.innerHTML = `<div class="mermaid">${result.erDiagram}</div>`;
          document.body.appendChild(erContainer);
          
          await mermaid.run({ nodes: erContainer.querySelectorAll('.mermaid') });
          const erCanvas = await html2canvas(erContainer, { backgroundColor: '#ffffff', scale: 2 });
          const erImage = erCanvas.toDataURL('image/png');
          zipFile.file('er-diagram.png', erImage.split(',')[1], { base64: true });
          
          document.body.removeChild(erContainer);
        } catch (erError) {
          console.error('ER Diagram rendering error:', erError);
        }
      }

      if (result.architectureDiagram) {
        try {
          const archContainer = document.createElement('div');
          archContainer.style.position = 'absolute';
          archContainer.style.left = '-9999px';
          archContainer.style.background = 'white';
          archContainer.style.padding = '40px';
          archContainer.style.width = '1200px';
          archContainer.innerHTML = `<div class="mermaid">${result.architectureDiagram}</div>`;
          document.body.appendChild(archContainer);
          
          await mermaid.run({ nodes: archContainer.querySelectorAll('.mermaid') });
          const archCanvas = await html2canvas(archContainer, { backgroundColor: '#ffffff', scale: 2 });
          const archImage = archCanvas.toDataURL('image/png');
          zipFile.file('architecture-diagram.png', archImage.split(',')[1], { base64: true });
          
          document.body.removeChild(archContainer);
        } catch (archError) {
          console.error('Architecture Diagram rendering error:', archError);
        }
      }

      const files = Object.keys(zipFile.files);
      if (files.length === 0) {
        toast.error('No diagrams could be rendered', { id: loadingToast });
        return;
      }

      const content = await zipFile.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'architecture-diagrams.zip';
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Exported ${files.length} diagram(s)!`, { id: loadingToast });
      setOpen(false);
    } catch (error) {
      console.error('Diagram export error:', error);
      toast.error('Failed to export diagrams. Please try again.', { id: loadingToast });
    }
  };

  const handleDownloadPDF = async () => {
    setExportingPDF(true);
    setExportProgress(0);
    const loadingToast = toast.loading('Compiling professional monochrome PDF...');
    
    try {
      await exportToPDF(result, idea, (prog) => {
        setExportProgress(prog);
      });
      toast.success('Monochrome PDF specification exported!', { id: loadingToast });
      setOpen(false);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.', { id: loadingToast });
    } finally {
      setExportingPDF(false);
      setExportProgress(0);
    }
  };

  const exportOptions = [
    {
      id: 'pdf',
      label: 'PDF SPECIFICATION',
      description: 'Formal document with diagram tables',
      icon: FileDown,
      color: 'bg-[#FF5500] text-white',
      handler: handleDownloadPDF,
      badge: 'COMPLETE',
    },
    {
      id: 'markdown',
      label: 'MARKDOWN FILE (.MD)',
      description: 'GitHub README & doc ready',
      icon: FileText,
      color: 'bg-[#00FF00] text-black',
      handler: handleDownloadMarkdown,
    },
    {
      id: 'json',
      label: 'RAW JSON DATA',
      description: 'Programmatic structured payload',
      icon: FileJson,
      color: 'bg-[#00FFFF] text-black',
      handler: handleDownloadJSON,
    },
    {
      id: 'yaml',
      label: 'YAML MANIFEST',
      description: 'Clean Kubernetes-ready format',
      icon: FileCode,
      color: 'bg-[#FFE600] text-black',
      handler: handleDownloadYAML,
    },
    {
      id: 'diagrams',
      label: 'DIAGRAMS ZIP (PNG)',
      description: 'High-res image assets',
      icon: Image,
      color: 'bg-[#FF00FF] text-white',
      handler: handleDownloadDiagrams,
      badge: 'PNG',
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        disabled={exportingPDF}
        className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-[#00FF00] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all font-mono text-xs font-bold uppercase disabled:opacity-50 flex-shrink-0"
      >
        {exportingPDF ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>{exportProgress}%</span>
          </>
        ) : (
          <>
            <Download size={14} className="stroke-[2.5]" />
            <span>EXPORT</span>
            <ChevronDown size={13} className={`stroke-[3] transition-transform ${open ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Progress Box */}
      {exportingPDF && (
        <div className="fixed sm:absolute top-auto bottom-4 sm:bottom-auto sm:top-full inset-x-4 sm:inset-x-0 mt-2 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] p-3 z-50">
          <div className="flex items-center justify-between mb-2 font-mono text-xs font-black uppercase">
            <span>COMPILING PDF...</span>
            <span>{exportProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#FDF6E3] border border-black">
            <div
              className="h-full bg-[#00FF00] border-r border-black transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      )}

      {open && !exportingPDF && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={() => setOpen(false)} />
          <div className="fixed inset-x-3 bottom-4 sm:bottom-auto sm:inset-auto sm:right-0 sm:absolute sm:mt-2 max-w-sm sm:w-80 bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000000] z-50 overflow-hidden max-h-[85vh] overflow-y-auto">
            
            {/* Header */}
            <div className="px-4 py-2.5 bg-[#FFE600] border-b-2 border-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={16} className="stroke-[2.5] text-black" />
                <h3 className="font-mono text-xs font-black uppercase text-black">EXPORT FORMATS</h3>
              </div>
              <span className="font-mono text-[10px] bg-black text-[#00FF00] px-1.5 py-0.2 font-bold">V2.0</span>
            </div>

            {/* Export Options */}
            <div className="p-2 space-y-1 bg-[#FDF6E3]">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={option.handler}
                    className="flex items-start gap-2.5 w-full p-2 text-left bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#00FFFF] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                  >
                    <div className={`w-8 h-8 border border-black ${option.color} flex items-center justify-center flex-shrink-0 font-bold`}>
                      <Icon size={16} className="stroke-[2.5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-black truncate">
                          {option.label}
                        </span>
                        {option.badge && (
                          <span className="text-[9px] font-mono font-black uppercase bg-black text-white px-1.5 py-0.2">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-gray-700 mt-0.5 leading-tight">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Copy Action */}
            <div className="p-2 border-t-2 border-black bg-white">
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-2.5 w-full p-2 text-left bg-[#FDF6E3] border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] transition-all font-mono"
              >
                <div className="w-8 h-8 bg-black text-[#00FF00] border border-black flex items-center justify-center flex-shrink-0">
                  {copiedAll ? <Check size={16} className="stroke-[3]" /> : <Clipboard size={16} className="stroke-[2.5]" />}
                </div>
                <div>
                  <span className="text-xs font-black text-black uppercase block">
                    {copiedAll ? 'COPIED TO CLIPBOARD!' : 'COPY RAW MARKDOWN'}
                  </span>
                  <p className="text-[10px] text-gray-600">Quick clipboard buffer</p>
                </div>
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default ExportMenu;
