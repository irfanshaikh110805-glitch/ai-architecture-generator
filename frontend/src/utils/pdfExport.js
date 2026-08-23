import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import mermaid from 'mermaid';

/**
 * Normalization helpers to handle any data shape from local storage,
 * live LLM generation, or Supabase cloud backend.
 */
function extractTables(res) {
  if (!res) return [];
  if (Array.isArray(res.database)) return res.database;
  if (Array.isArray(res.database?.tables)) return res.database.tables;
  if (Array.isArray(res.database_tables)) return res.database_tables;
  if (Array.isArray(res.tables)) return res.tables;
  return [];
}

function extractFeatures(res) {
  if (!res) return [];
  if (Array.isArray(res.features)) return res.features;
  if (Array.isArray(res.requirements)) return res.requirements;
  return [];
}

function extractAPIs(res) {
  if (!res) return [];
  if (Array.isArray(res.apis)) return res.apis;
  if (Array.isArray(res.endpoints)) return res.endpoints;
  return [];
}

function extractRoadmap(res) {
  if (!res) return [];
  if (Array.isArray(res.roadmap)) return res.roadmap;
  if (Array.isArray(res.roadmap?.phases)) return res.roadmap.phases;
  if (Array.isArray(res.roadmap_phases)) return res.roadmap_phases;
  if (Array.isArray(res.phases)) return res.phases;
  return [];
}

function sanitizeIdea(rawIdea = '') {
  if (!rawIdea) return 'SYSTEM ARCHITECTURE SPECIFICATION';
  return String(rawIdea)
    .replace(/\n\nUser's follow-up request:[\s\S]*$/i, '')
    .replace(/User's follow-up request:[\s\S]*$/i, '')
    .replace(/Please generate an updated architecture[\s\S]*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Executive Whitepaper-Grade Monochrome PDF Specification Generator
 * Pure white background, clean hairline rules, balanced typography,
 * zero black block backgrounds, and natural page structure.
 */
export async function exportToPDF(result, idea, onProgress = () => {}) {
  if (!result) throw new Error('Architecture data is required');

  onProgress(10);
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  // Extract normalized data structures
  const tables = extractTables(result);
  const features = extractFeatures(result);
  const apis = extractAPIs(result);
  const roadmap = extractRoadmap(result);
  const cleanTitle = sanitizeIdea(idea);

  // Initialize Mermaid for diagram rendering
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'loose',
    fontFamily: 'Helvetica, Arial, sans-serif',
  });

  // Helper: check space and break page safely
  const ensureSpace = (neededHeight) => {
    if (y + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      y = margin + 14;
      return true;
    }
    return false;
  };

  // Helper: Section Title Header with clean, refined typography
  const addSectionHeader = (title, subtitle, minRequiredSpace = 55) => {
    ensureSpace(minRequiredSpace);

    doc.setDrawColor(30, 41, 59); // Dark slate rule
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin + contentWidth, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin, y);
    y += 4.5;

    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(subtitle, margin, y);
      y += 4.5;
    }

    y += 2;
  };

  // Table styling tokens (clean executive grayscale)
  const tableHeadStyles = {
    fillColor: [241, 245, 249], // Soft refined slate/gray
    textColor: [15, 23, 42],     // Dark text
    fontSize: 8.5,
    fontStyle: 'bold',
    halign: 'left',
    cellPadding: 3,
    lineColor: [203, 213, 225],
    lineWidth: 0.2,
  };

  const tableBaseStyles = {
    fontSize: 8,
    cellPadding: 2.8,
    textColor: [30, 41, 59],
    lineColor: [226, 232, 240],
    lineWidth: 0.2,
  };

  // ============================================================================
  // 1. EXECUTIVE COVER / HEADER (PAGE 1)
  // ============================================================================
  onProgress(20);

  // Top Clean Double Hairline Brand Header (No black background)
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + contentWidth, y);
  y += 1.5;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  // Header Brand & Document Metadata Line
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('ARCHITECH.AI', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(' |  SYSTEM DESIGN & ARCHITECTURE SPECIFICATION', margin + 26, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`DATE: ${new Date().toLocaleDateString()}`, pageWidth - margin, y, { align: 'right' });
  y += 10;

  // Project Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(cleanTitle.toUpperCase(), contentWidth);
  doc.text(titleLines, margin, y);
  y += (titleLines.length * 6) + 5;

  // Executive Metadata Summary Grid (4 Columns)
  const metaBoxY = y;
  const colWidth = contentWidth / 4;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, metaBoxY, contentWidth, 14, 'FD');

  const metaItems = [
    { label: 'TOPOLOGY', value: result.architecture?.type || 'Modular System' },
    { label: 'REQUIREMENTS', value: `${features.length} Features` },
    { label: 'API ENDPOINTS', value: `${apis.length} Endpoints` },
    { label: 'DATA ENTITIES', value: `${tables.length} Tables` },
  ];

  metaItems.forEach((item, index) => {
    const colX = margin + (index * colWidth);
    if (index > 0) {
      doc.setDrawColor(226, 232, 240);
      doc.line(colX, metaBoxY, colX, metaBoxY + 14);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, colX + 3.5, metaBoxY + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(String(item.value), colX + 3.5, metaBoxY + 10.5);
  });
  y += 19;

  // ============================================================================
  // 2. EXECUTIVE OVERVIEW & TECHNOLOGY STACK (PAGE 1)
  // ============================================================================
  addSectionHeader('1. Executive Overview & Technology Stack', 'Core architectural pattern and selected infrastructure components', 40);

  const techRows = [
    ['Frontend Layer', result.architecture?.tech_stack?.frontend || 'React / Next.js', 'Client application, state management, and user interaction'],
    ['Backend Layer', result.architecture?.tech_stack?.backend || 'Node.js / Express', 'Core microservices, business logic execution, and API routing'],
    ['Database Layer', result.architecture?.tech_stack?.database || 'PostgreSQL', 'Transactional persistence, relational schemas, and indexing'],
    ['System Pattern', result.architecture?.type || 'Modular Architecture', 'Top-level architecture pattern and scaling topology'],
  ];

  doc.autoTable({
    startY: y,
    head: [['System Layer', 'Technology / Framework', 'Architectural Role & Scope']],
    body: techRows,
    theme: 'grid',
    headStyles: tableHeadStyles,
    styles: tableBaseStyles,
    columnStyles: {
      0: { cellWidth: 36, fontStyle: 'bold' },
      1: { cellWidth: 54 },
      2: { cellWidth: contentWidth - 90 },
    },
    alternateRowStyles: { fillColor: [255, 255, 255] },
    margin: { top: margin + 12, bottom: margin + 10, left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 6;

  // Project Estimation Summary Box (Bottom of Page 1)
  if (result.estimation) {
    const estRows = [
      ['Estimated Dev Effort', result.estimation?.hours || result.estimation?.dev_hours || '120-180 Hours'],
      ['Recommended Squad', result.estimation?.team_size || result.estimation?.estimation_team_size || '3-5 Engineers'],
      ['Project Budget Range', result.estimation?.cost || result.estimation?.estimated_cost || '$15,000 - $30,000'],
    ];

    doc.autoTable({
      startY: y,
      body: estRows,
      theme: 'grid',
      styles: tableBaseStyles,
      columnStyles: {
        0: { cellWidth: 48, fontStyle: 'bold', fillColor: [248, 250, 252] },
        1: { cellWidth: contentWidth - 48 },
      },
      margin: { top: margin + 12, bottom: margin + 10, left: margin, right: margin },
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  // ============================================================================
  // 3. FUNCTIONAL REQUIREMENTS (MoSCoW) -> STARTS ON PAGE 2
  // ============================================================================
  onProgress(40);
  if (features.length > 0) {
    doc.addPage();
    y = margin + 14;
    addSectionHeader('2. Functional Specifications & Prioritization (MoSCoW)', 'Categorized requirements matrix with business priority allocation', 40);

    const featureRows = features.map(f => {
      const priority = String(f.priority || 'Must').toUpperCase();
      const name = f.name || f.feature_name || 'System Feature';
      let desc = f.description || f.desc || f.details || f.specification || '';
      if (!desc.trim()) {
        desc = `Implements ${name} with operational workflows and validations.`;
      }

      return [priority, name, desc];
    });

    doc.autoTable({
      startY: y,
      head: [['Priority', 'Feature Name', 'Functional Specification & Scope']],
      body: featureRows,
      theme: 'grid',
      headStyles: tableHeadStyles,
      styles: tableBaseStyles,
      columnStyles: {
        0: { cellWidth: 22, fontStyle: 'bold', halign: 'center' },
        1: { cellWidth: 50, fontStyle: 'bold' },
        2: { cellWidth: contentWidth - 72 },
      },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      margin: { top: margin + 12, bottom: margin + 10, left: margin, right: margin },
    });

    y = doc.lastAutoTable.finalY + 8;
  }

  // ============================================================================
  // 4. DATABASE SCHEMA & ENTITY MODELS
  // ============================================================================
  onProgress(60);
  if (tables.length > 0) {
    addSectionHeader('3. Database Schema & Data Models', 'Relational entity structures, fields definition, and relational constraints', 55);

    const dbRows = tables.map((t, idx) => {
      const tableName = t.table || t.table_name || t.name || `table_${idx + 1}`;
      const fields = Array.isArray(t.fields) 
        ? t.fields.join(', ') 
        : (typeof t.fields === 'string' ? t.fields : 'id, created_at, updated_at');
      const rels = Array.isArray(t.relationships) && t.relationships.length > 0 
        ? t.relationships.join('; ') 
        : (t.relationships || 'None (Standalone Entity)');

      return [tableName, fields, rels];
    });

    doc.autoTable({
      startY: y,
      head: [['Entity / Table', 'Schema Fields & Attributes', 'Foreign Key Relationships']],
      body: dbRows,
      theme: 'grid',
      headStyles: tableHeadStyles,
      styles: {
        ...tableBaseStyles,
        fontSize: 7.5,
      },
      columnStyles: {
        0: { cellWidth: 36, fontStyle: 'bold' },
        1: { cellWidth: 84 },
        2: { cellWidth: contentWidth - 120 },
      },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      margin: { top: margin + 12, bottom: margin + 10, left: margin, right: margin },
    });

    y = doc.lastAutoTable.finalY + 8;
  }

  // ============================================================================
  // 5. REST API ENDPOINTS
  // ============================================================================
  onProgress(75);
  if (apis.length > 0) {
    addSectionHeader('4. RESTful API Contracts & Endpoints', 'Interface routes, supported HTTP verbs, and endpoint specifications', 55);

    const apiRows = apis.map(api => [
      String(api.method || 'GET').toUpperCase(),
      api.endpoint || api.path || '/api/v1/resource',
      api.description || api.desc || 'API contract endpoint'
    ]);

    doc.autoTable({
      startY: y,
      head: [['Method', 'Endpoint URI Path', 'Contract Description & Handler']],
      body: apiRows,
      theme: 'grid',
      headStyles: tableHeadStyles,
      styles: {
        ...tableBaseStyles,
        fontSize: 7.5,
      },
      columnStyles: {
        0: { cellWidth: 20, fontStyle: 'bold', halign: 'center' },
        1: { cellWidth: 62, fontStyle: 'bold' },
        2: { cellWidth: contentWidth - 82 },
      },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      margin: { top: margin + 12, bottom: margin + 10, left: margin, right: margin },
    });

    y = doc.lastAutoTable.finalY + 8;
  }

  // ============================================================================
  // 6. DEVELOPMENT ROADMAP & MILESTONES
  // ============================================================================
  onProgress(85);
  if (roadmap.length > 0) {
    addSectionHeader('5. Development Roadmap & Milestones', 'Phased delivery schedule, sprint breakdown, and critical path deliverables', 55);

    roadmap.forEach((phase, idx) => {
      let rawPhaseName = phase.phase || phase.phase_name || `Phase ${idx + 1}`;
      rawPhaseName = rawPhaseName.replace(/^Phase\s*\d+\s*:\s*Phase\s*\d+\s*:\s*/i, `Phase ${idx + 1}: `);
      rawPhaseName = rawPhaseName.replace(/^Phase\s*\d+\s*:\s*/i, `Phase ${idx + 1}: `);
      if (!rawPhaseName.toLowerCase().startsWith('phase')) {
        rawPhaseName = `Phase ${idx + 1}: ${rawPhaseName}`;
      }

      const taskItems = Array.isArray(phase.tasks) ? phase.tasks : [];
      const phaseNeededSpace = 10 + (taskItems.length * 5.5);
      ensureSpace(Math.min(phaseNeededSpace, 35));

      // Phase Header Banner (Soft, refined border and fill)
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.rect(margin, y, contentWidth, 6.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(rawPhaseName.toUpperCase(), margin + 3, y + 4.5);
      y += 9.5;

      // Tasks Checklist
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);

      taskItems.forEach((task) => {
        ensureSpace(7);
        const cleanTask = String(task).replace(/^\[[ x]\]\s*/i, '');
        const taskLines = doc.splitTextToSize(`[  ]  ${cleanTask}`, contentWidth - 8);
        doc.text(taskLines, margin + 4, y);
        y += (taskLines.length * 4) + 1.2;
      });

      y += 3;
    });

    y += 6;
  }

  // ============================================================================
  // 7. DIAGRAMS (ER & ARCHITECTURE)
  // ============================================================================
  onProgress(90);

  const renderDiagramToImage = async (mermaidCode) => {
    if (!mermaidCode || !mermaidCode.trim()) return null;
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.background = '#ffffff';
    container.style.padding = '30px';
    container.style.width = '1000px';
    container.innerHTML = `<div class="mermaid">${mermaidCode}</div>`;
    document.body.appendChild(container);

    try {
      await mermaid.run({ nodes: container.querySelectorAll('.mermaid') });
      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });
      return canvas.toDataURL('image/png');
    } catch (err) {
      console.warn('Diagram rendering failed in PDF:', err);
      return null;
    } finally {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  };

  // ER Diagram Section
  if (result.erDiagram) {
    const erImage = await renderDiagramToImage(result.erDiagram);
    if (erImage) {
      doc.addPage();
      y = margin + 12;
      addSectionHeader('6. Entity-Relationship Data Model Diagram', 'Entity schema visualization and cardinality mapping', 30);

      const imgWidth = contentWidth;
      const imgHeight = 140;
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.rect(margin, y, imgWidth, imgHeight);
      doc.addImage(erImage, 'PNG', margin + 2, y + 2, imgWidth - 4, imgHeight - 4, undefined, 'FAST');
      y += imgHeight + 8;
    }
  }

  // System Architecture Diagram Section
  if (result.architectureDiagram) {
    const archImage = await renderDiagramToImage(result.architectureDiagram);
    if (archImage) {
      doc.addPage();
      y = margin + 12;
      addSectionHeader('7. System Architecture Flow Diagram', 'Component topology, network gateways, and inter-service communications', 30);

      const imgWidth = contentWidth;
      const imgHeight = 140;
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.rect(margin, y, imgWidth, imgHeight);
      doc.addImage(archImage, 'PNG', margin + 2, y + 2, imgWidth - 4, imgHeight - 4, undefined, 'FAST');
      y += imgHeight + 8;
    }
  }

  // ============================================================================
  // 8. TWO-PASS RUNNING HEADER & FOOTER
  // ============================================================================
  onProgress(95);
  const totalPages = doc.internal.getNumberOfPages();
  const headerTitle = cleanTitle.length > 50 ? cleanTitle.substring(0, 47) + '...' : cleanTitle;

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Running Header (Pages 2+)
    if (i > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('SYSTEM SPECIFICATION', margin, margin + 4);
      doc.text(headerTitle.toUpperCase(), pageWidth - margin, margin + 4, { align: 'right' });

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, margin + 6, margin + contentWidth, margin + 6);
    }

    // Running Footer (All Pages)
    const footerY = pageHeight - margin + 5;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, margin + contentWidth, footerY - 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`ARCHITECH.AI COMPILED SPECIFICATION — CONFIDENTIAL`, margin, footerY);
    doc.text(`PAGE ${i} OF ${totalPages}`, pageWidth - margin, footerY, { align: 'right' });
  }

  onProgress(100);
  const sanitizedTitle = cleanTitle.substring(0, 30).replace(/[^a-z0-9]/gi, '_');
  const filename = `${sanitizedTitle}_Specification.pdf`;
  doc.save(filename);
  return filename;
}
