import { useState, useRef, useEffect } from 'react';
import { FileDown, FileText, Clipboard, Check, ChevronDown, FileJson, FileCode, Download, Loader2, Image, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import mermaid from 'mermaid';

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
    toast.success('JSON exported!');
    setOpen(false);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([buildMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'architecture.md'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Markdown exported!');
    setOpen(false);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(buildMarkdown()).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
      toast.success('Copied to clipboard!');
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
    toast.success('YAML exported!');
    setOpen(false);
  };

  const handleDownloadDiagrams = async () => {
    const loadingToast = toast.loading('Exporting diagrams as images...');
    try {
      const zip = await import('jszip').then(m => m.default);
      const zipFile = new zip();

      // Initialize mermaid with proper configuration
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Arial, sans-serif'
      });

      // Render ER Diagram
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
          // Continue with architecture diagram even if ER fails
        }
      }

      // Render Architecture Diagram
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
          // Continue even if architecture diagram fails
        }
      }

      // Check if we have any diagrams to export
      const files = Object.keys(zipFile.files);
      if (files.length === 0) {
        toast.error('No diagrams could be rendered', { id: loadingToast });
        return;
      }

      // Generate ZIP
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
    const loadingToast = toast.loading('Generating comprehensive PDF...');
    
    try {
      setExportProgress(10);
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let currentPage = 1;

      // Helper: Add page number footer
      const addFooter = () => {
        doc.setFontSize(9);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${currentPage} | Generated by AI Architecture Generator`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        currentPage++;
      };

      // Helper: Add new page with footer
      const addNewPage = () => {
        addFooter();
        doc.addPage();
      };

      setExportProgress(20);

      // Cover Page
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      doc.setFontSize(32);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('System Architecture', pageWidth / 2, 80, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      const ideaLines = doc.splitTextToSize(idea, contentWidth - 40);
      doc.text(ideaLines, pageWidth / 2, 100, { align: 'center', maxWidth: contentWidth - 40 });
      
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 60, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(200, 200, 200);
      doc.text('Powered by AI Architecture Generator', pageWidth / 2, pageHeight - 40, { align: 'center' });

      setExportProgress(30);

      // Table of Contents
      addNewPage();
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('Table of Contents', margin, 30);
      
      const tocItems = [
        '1. Features',
        '2. Technology Stack',
        '3. Architecture Overview',
        '4. Database Schema',
        '5. REST API Endpoints',
        '6. Development Roadmap',
        '7. Project Estimation',
        '8. ER Diagram',
        '9. Architecture Diagram'
      ];
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      let tocY = 50;
      tocItems.forEach(item => {
        doc.text(item, margin + 5, tocY);
        tocY += 8;
      });

      setExportProgress(40);

      // 1. Features Section
      addNewPage();
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('1. Features', margin, 30);
      
      if (result.features?.length) {
        const featuresData = result.features.map(f => [
          f.priority || 'N/A',
          f.name || '',
          f.description || ''
        ]);
        
        doc.autoTable({
          startY: 40,
          head: [['Priority', 'Feature', 'Description']],
          body: featuresData,
          theme: 'striped',
          headStyles: { fillColor: [37, 99, 235], fontSize: 11, fontStyle: 'bold' },
          styles: { fontSize: 10, cellPadding: 4 },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 50 },
            2: { cellWidth: contentWidth - 75 }
          },
          margin: { left: margin, right: margin }
        });
      }

      // 2. Tech Stack Section
      addNewPage();
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('2. Technology Stack', margin, 30);
      
      const techStackData = [
        ['Frontend', result.architecture?.tech_stack?.frontend || 'N/A'],
        ['Backend', result.architecture?.tech_stack?.backend || 'N/A'],
        ['Database', result.architecture?.tech_stack?.database || 'N/A'],
        ['Deployment', result.architecture?.tech_stack?.deployment || 'N/A']
      ];
      
      doc.autoTable({
        startY: 40,
        head: [['Layer', 'Technology']],
        body: techStackData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], fontSize: 11, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
          1: { cellWidth: contentWidth - 50 }
        },
        margin: { left: margin, right: margin }
      });

      // 3. Architecture Overview
      addNewPage();
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('3. Architecture Overview', margin, 30);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Architecture Type:', margin, 50);
      doc.setFont('helvetica', 'normal');
      doc.text(result.architecture?.type || 'N/A', margin + 50, 50);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Components:', margin, 60);
      doc.setFont('helvetica', 'normal');
      const components = result.architecture?.components?.join(', ') || 'N/A';
      const componentLines = doc.splitTextToSize(components, contentWidth - 50);
      doc.text(componentLines, margin + 50, 60);

      setExportProgress(60);

      // 4. Database Schema
      addNewPage();
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('4. Database Schema', margin, 30);
      
      if (result.database?.length) {
        let tableY = 40;
        result.database.forEach((table) => {
          if (tableY > pageHeight - 60) {
            addNewPage();
            tableY = 30;
          }
          
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(37, 99, 235);
          doc.text(`${table.table}`, margin, tableY);
          tableY += 10;
          
          const tableData = [
            ['Fields', table.fields?.join(', ') || 'N/A'],
            ['Relationships', table.relationships?.join(', ') || 'None']
          ];
          
          doc.autoTable({
            startY: tableY,
            body: tableData,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
              0: { cellWidth: 40, fontStyle: 'bold', textColor: [60, 60, 60] },
              1: { cellWidth: contentWidth - 40 }
            },
            margin: { left: margin, right: margin }
          });
          
          tableY = doc.lastAutoTable.finalY + 15;
        });
      }

      // 5. REST API Endpoints
      addNewPage();
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('5. REST API Endpoints', margin, 30);
      
      if (result.apis?.length) {
        const apiData = result.apis.map(api => [
          api.method || 'GET',
          api.endpoint || '',
          api.description || ''
        ]);
        
        doc.autoTable({
          startY: 40,
          head: [['Method', 'Endpoint', 'Description']],
          body: apiData,
          theme: 'striped',
          headStyles: { fillColor: [37, 99, 235], fontSize: 11, fontStyle: 'bold' },
          styles: { fontSize: 9, cellPadding: 4 },
          columnStyles: {
            0: { cellWidth: 20, fontStyle: 'bold' },
            1: { cellWidth: 60 },
            2: { cellWidth: contentWidth - 80 }
          },
          margin: { left: margin, right: margin }
        });
      }

      // 6. Development Roadmap
      addNewPage();
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('6. Development Roadmap', margin, 30);
      
      if (result.roadmap?.length) {
        let roadmapY = 40;
        result.roadmap.forEach((phase, idx) => {
          if (roadmapY > pageHeight - 60) {
            addNewPage();
            roadmapY = 30;
          }
          
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(37, 99, 235);
          doc.text(`Phase ${idx + 1}: ${phase.phase}`, margin, roadmapY);
          roadmapY += 8;
          
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(60, 60, 60);
          
          phase.tasks?.forEach(task => {
            const taskLines = doc.splitTextToSize(`• ${task}`, contentWidth - 10);
            if (roadmapY + taskLines.length * 5 > pageHeight - 30) {
              addNewPage();
              roadmapY = 30;
            }
            doc.text(taskLines, margin + 5, roadmapY);
            roadmapY += taskLines.length * 5 + 2;
          });
          
          roadmapY += 8;
        });
      }

      setExportProgress(80);

      // 7. Project Estimation
      addNewPage();
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('7. Project Estimation', margin, 30);
      
      const estimationData = [
        ['Development Hours', result.estimation?.hours || 'N/A'],
        ['Team Size', result.estimation?.team_size || 'N/A'],
        ['Estimated Cost', result.estimation?.cost || 'N/A'],
        ['Timeline', result.estimation?.timeline || 'N/A']
      ];
      
      doc.autoTable({
        startY: 40,
        body: estimationData,
        theme: 'grid',
        styles: { fontSize: 11, cellPadding: 6 },
        columnStyles: {
          0: { cellWidth: 60, fontStyle: 'bold', fillColor: [240, 240, 240] },
          1: { cellWidth: contentWidth - 60, fontSize: 12 }
        },
        margin: { left: margin, right: margin }
      });

      // 8. ER Diagram
      if (result.erDiagram) {
        addNewPage();
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('8. ER Diagram', margin, 30);
        
        try {
          // Initialize mermaid with proper configuration
          mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'Arial, sans-serif'
          });

          const erContainer = document.createElement('div');
          erContainer.style.position = 'absolute';
          erContainer.style.left = '-9999px';
          erContainer.style.background = 'white';
          erContainer.style.padding = '20px';
          erContainer.style.width = '1200px';
          erContainer.innerHTML = `<div class="mermaid">${result.erDiagram}</div>`;
          document.body.appendChild(erContainer);
          
          await mermaid.run({ nodes: erContainer.querySelectorAll('.mermaid') });
          
          const canvas = await html2canvas(erContainer, { 
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
            useCORS: true
          });
          const imgData = canvas.toDataURL('image/png');
          
          const imgWidth = contentWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          doc.addImage(imgData, 'PNG', margin, 45, imgWidth, Math.min(imgHeight, pageHeight - 80));
          
          document.body.removeChild(erContainer);
        } catch (error) {
          console.error('Error rendering ER diagram:', error);
          doc.setFontSize(10);
          doc.setTextColor(128, 128, 128);
          doc.text('ER Diagram could not be rendered. Please check the diagram syntax.', margin, 50);
          
          // Add the raw mermaid code as fallback
          doc.setFontSize(8);
          doc.setFont('courier', 'normal');
          const diagramLines = doc.splitTextToSize(result.erDiagram, contentWidth);
          doc.text(diagramLines, margin, 60);
        }
      }

      // 9. Architecture Diagram
      if (result.architectureDiagram) {
        addNewPage();
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('9. Architecture Diagram', margin, 30);
        
        try {
          const archContainer = document.createElement('div');
          archContainer.style.position = 'absolute';
          archContainer.style.left = '-9999px';
          archContainer.style.background = 'white';
          archContainer.style.padding = '20px';
          archContainer.style.width = '1200px';
          archContainer.innerHTML = `<div class="mermaid">${result.architectureDiagram}</div>`;
          document.body.appendChild(archContainer);
          
          await mermaid.run({ nodes: archContainer.querySelectorAll('.mermaid') });
          
          const canvas = await html2canvas(archContainer, { 
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
            useCORS: true
          });
          const imgData = canvas.toDataURL('image/png');
          
          const imgWidth = contentWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          doc.addImage(imgData, 'PNG', margin, 45, imgWidth, Math.min(imgHeight, pageHeight - 80));
          
          document.body.removeChild(archContainer);
        } catch (error) {
          console.error('Error rendering architecture diagram:', error);
          doc.setFontSize(10);
          doc.setTextColor(128, 128, 128);
          doc.text('Architecture Diagram could not be rendered. Please check the diagram syntax.', margin, 50);
          
          // Add the raw mermaid code as fallback
          doc.setFontSize(8);
          doc.setFont('courier', 'normal');
          const diagramLines = doc.splitTextToSize(result.architectureDiagram, contentWidth);
          doc.text(diagramLines, margin, 60);
        }
      }

      // Add footer to last page
      addFooter();

      setExportProgress(95);

      // Save PDF
      const fileName = `architecture_${idea.substring(0, 30).replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`;
      doc.save(fileName);
      
      setExportProgress(100);
      toast.success('PDF exported successfully!', { id: loadingToast });
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
      label: 'Export as PDF',
      description: 'Complete document with diagrams',
      icon: FileDown,
      color: 'red',
      bgHover: 'hover:bg-red-50',
      textColor: 'text-red-600',
      handler: handleDownloadPDF,
      badge: 'Premium',
    },
    {
      id: 'markdown',
      label: 'Export as Markdown',
      description: 'Developer-friendly format',
      icon: FileText,
      color: 'green',
      bgHover: 'hover:bg-green-50',
      textColor: 'text-green-600',
      handler: handleDownloadMarkdown,
    },
    {
      id: 'json',
      label: 'Export as JSON',
      description: 'Raw structured data',
      icon: FileJson,
      color: 'blue',
      bgHover: 'hover:bg-blue-50',
      textColor: 'text-blue-600',
      handler: handleDownloadJSON,
    },
    {
      id: 'yaml',
      label: 'Export as YAML',
      description: 'Configuration format',
      icon: FileCode,
      color: 'purple',
      bgHover: 'hover:bg-purple-50',
      textColor: 'text-purple-600',
      handler: handleDownloadYAML,
    },
    {
      id: 'diagrams',
      label: 'Export Diagrams',
      description: 'PNG images in ZIP',
      icon: Image,
      color: 'orange',
      bgHover: 'hover:bg-orange-50',
      textColor: 'text-orange-600',
      handler: handleDownloadDiagrams,
      badge: 'New',
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        disabled={exportingPDF}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {exportingPDF ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm font-semibold">Exporting... {exportProgress}%</span>
          </>
        ) : (
          <>
            <Download size={16} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold">Export</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Progress Bar */}
      {exportingPDF && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 p-3 z-30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">Generating PDF...</span>
            <span className="text-xs font-bold text-blue-600">{exportProgress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 rounded-full"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      )}

      {open && !exportingPDF && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-blue-600" />
                <h3 className="text-sm font-bold text-gray-800">Export Options</h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Choose your preferred format</p>
            </div>

            {/* Export Options */}
            <div className="p-2">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={option.handler}
                    className={`flex items-start gap-3 w-full px-3 py-3 rounded-xl text-left transition-all duration-200 group ${option.bgHover} hover:shadow-sm`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${option.bgHover.replace('hover:', '')} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon size={18} className={option.textColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900">
                          {option.label}
                        </span>
                        {option.badge && (
                          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                            option.badge === 'Premium' 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                    </div>
                    <ChevronDown size={14} className="text-gray-400 -rotate-90 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mx-2" />

            {/* Quick Actions */}
            <div className="p-2">
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-left transition-all duration-200 hover:bg-gray-50 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {copiedAll ? (
                    <Check size={18} className="text-emerald-600" />
                  ) : (
                    <Clipboard size={18} className="text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900">
                    {copiedAll ? 'Copied to Clipboard!' : 'Copy All (Markdown)'}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">Quick clipboard access</p>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 text-center font-medium">
                💡 Tip: PDF includes diagrams and full formatting
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ExportMenu;
