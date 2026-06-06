/**
 * PDF Export utility with diagrams
 * Exports architecture as professional PDF with all sections and diagrams
 */
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

/**
 * Export architecture to PDF
 * @param {Object} result - Architecture result object
 * @param {string} idea - Project idea
 */
export async function exportToPDF(result, idea) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper to add new page if needed
  const checkPageBreak = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper to add text with word wrap (reserved for future use)
  const _addText = (text, fontSize = 10, isBold = false, color = [0, 0, 0]) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach(line => {
      checkPageBreak();
      pdf.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
    yPosition += 5;
  };

  // ============================================================================
  // COVER PAGE
  // ============================================================================
  
  // Logo/Title
  pdf.setFillColor(37, 99, 235); // Brand blue
  pdf.rect(0, 0, pageWidth, 80, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ArchitechAI', pageWidth / 2, 35, { align: 'center' });
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('System Architecture Document', pageWidth / 2, 50, { align: 'center' });
  
  // Project idea
  yPosition = 100;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Project Overview', margin, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const ideaLines = pdf.splitTextToSize(idea, contentWidth);
  ideaLines.forEach(line => {
    pdf.text(line, margin, yPosition);
    yPosition += 6;
  });
  
  // Metadata
  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 5;
  pdf.text(`Architecture Type: ${result.architecture?.type || 'N/A'}`, margin, yPosition);
  yPosition += 5;
  pdf.text(`Features: ${result.features?.length || 0} | APIs: ${result.apis?.length || 0} | Tables: ${result.database?.length || 0}`, margin, yPosition);
  
  // Table of Contents
  yPosition += 20;
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Table of Contents', margin, yPosition);
  yPosition += 10;
  
  const toc = [
    '1. Features & Prioritization',
    '2. Database Schema',
    '3. API Endpoints',
    '4. System Architecture',
    '5. ER Diagram',
    '6. Architecture Diagram',
    '7. Development Roadmap',
    '8. Cost Estimation',
  ];
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  toc.forEach((item, index) => {
    pdf.text(item, margin + 5, yPosition);
    pdf.text(`${index + 2}`, pageWidth - margin - 10, yPosition, { align: 'right' });
    yPosition += 7;
  });
  
  // ============================================================================
  // SECTION 1: FEATURES
  // ============================================================================
  
  pdf.addPage();
  yPosition = margin;
  
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235);
  pdf.text('1. Features & Prioritization', margin, yPosition);
  yPosition += 15;
  
  if (result.features && result.features.length > 0) {
    const featuresByPriority = {
      'Must': result.features.filter(f => f.priority === 'Must'),
      'Should': result.features.filter(f => f.priority === 'Should'),
      'Could': result.features.filter(f => f.priority === 'Could'),
      "Won't": result.features.filter(f => f.priority === "Won't"),
    };
    
    Object.entries(featuresByPriority).forEach(([priority, features]) => {
      if (features.length > 0) {
        checkPageBreak(30);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${priority}-Have (${features.length})`, margin, yPosition);
        yPosition += 8;
        
        features.forEach((feature, index) => {
          checkPageBreak(15);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${index + 1}. ${feature.name}`, margin + 5, yPosition);
          yPosition += 6;
          
          if (feature.description) {
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(80, 80, 80);
            const descLines = pdf.splitTextToSize(feature.description, contentWidth - 10);
            descLines.forEach(line => {
              checkPageBreak();
              pdf.text(line, margin + 10, yPosition);
              yPosition += 5;
            });
          }
          yPosition += 3;
        });
        yPosition += 5;
      }
    });
  }
  
  // ============================================================================
  // SECTION 2: DATABASE SCHEMA
  // ============================================================================
  
  pdf.addPage();
  yPosition = margin;
  
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235);
  pdf.text('2. Database Schema', margin, yPosition);
  yPosition += 15;
  
  if (result.database && result.database.length > 0) {
    result.database.forEach((table, index) => {
      checkPageBreak(40);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${index + 1}. ${table.table}`, margin, yPosition);
      yPosition += 8;
      
      // Fields table
      const tableData = table.fields.map(field => [field]);
      
      pdf.autoTable({
        startY: yPosition,
        head: [['Fields']],
        body: tableData,
        margin: { left: margin + 5 },
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], fontSize: 10 },
        bodyStyles: { fontSize: 9 },
        columnStyles: { 0: { cellWidth: contentWidth - 10 } },
      });
      
      yPosition = pdf.lastAutoTable.finalY + 5;
      
      // Relationships
      if (table.relationships && table.relationships.length > 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Relationships:', margin + 5, yPosition);
        yPosition += 6;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        table.relationships.forEach(rel => {
          checkPageBreak();
          pdf.text(`• ${rel}`, margin + 10, yPosition);
          yPosition += 5;
        });
      }
      yPosition += 8;
    });
  }
  
  // ============================================================================
  // SECTION 3: API ENDPOINTS
  // ============================================================================
  
  pdf.addPage();
  yPosition = margin;
  
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235);
  pdf.text('3. API Endpoints', margin, yPosition);
  yPosition += 15;
  
  if (result.apis && result.apis.length > 0) {
    const apiData = result.apis.map(api => [
      api.method,
      api.endpoint,
      api.description || 'N/A'
    ]);
    
    pdf.autoTable({
      startY: yPosition,
      head: [['Method', 'Endpoint', 'Description']],
      body: apiData,
      margin: { left: margin },
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 60 },
        2: { cellWidth: contentWidth - 80 }
      },
    });
    
    yPosition = pdf.lastAutoTable.finalY + 10;
  }
  
  // ============================================================================
  // SECTION 4: SYSTEM ARCHITECTURE
  // ============================================================================
  
  pdf.addPage();
  yPosition = margin;
  
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235);
  pdf.text('4. System Architecture', margin, yPosition);
  yPosition += 15;
  
  if (result.architecture) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Architecture Type', margin, yPosition);
    yPosition += 7;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(result.architecture.type || 'N/A', margin + 5, yPosition);
    yPosition += 12;
    
    // Tech Stack
    if (result.architecture.tech_stack) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Technology Stack', margin, yPosition);
      yPosition += 7;
      
      const techStack = [
        ['Frontend', result.architecture.tech_stack.frontend || 'N/A'],
        ['Backend', result.architecture.tech_stack.backend || 'N/A'],
        ['Database', result.architecture.tech_stack.database || 'N/A'],
      ];
      
      pdf.autoTable({
        startY: yPosition,
        body: techStack,
        margin: { left: margin + 5 },
        theme: 'plain',
        bodyStyles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: 'bold' },
          1: { cellWidth: contentWidth - 45 }
        },
      });
      
      yPosition = pdf.lastAutoTable.finalY + 10;
    }
    
    // Components
    if (result.architecture.components && result.architecture.components.length > 0) {
      checkPageBreak(30);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('System Components', margin, yPosition);
      yPosition += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      result.architecture.components.forEach((component, index) => {
        checkPageBreak();
        pdf.text(`${index + 1}. ${component}`, margin + 5, yPosition);
        yPosition += 6;
      });
    }
  }
  
  // ============================================================================
  // SECTION 5 & 6: DIAGRAMS
  // ============================================================================
  
  // Try to capture diagrams if they exist in DOM
  const erDiagramElement = document.getElementById('er-diagram-svg');
  const archDiagramElement = document.getElementById('arch-diagram-svg');
  
  if (erDiagramElement) {
    pdf.addPage();
    yPosition = margin;
    
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(37, 99, 235);
    pdf.text('5. ER Diagram', margin, yPosition);
    yPosition += 15;
    
    try {
      const canvas = await html2canvas(erDiagramElement, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (yPosition + imgHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
    } catch (error) {
      console.error('Failed to capture ER diagram:', error);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Diagram could not be captured', margin, yPosition);
    }
  }
  
  if (archDiagramElement) {
    pdf.addPage();
    yPosition = margin;
    
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(37, 99, 235);
    pdf.text('6. Architecture Diagram', margin, yPosition);
    yPosition += 15;
    
    try {
      const canvas = await html2canvas(archDiagramElement, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (yPosition + imgHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
    } catch (error) {
      console.error('Failed to capture architecture diagram:', error);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Diagram could not be captured', margin, yPosition);
    }
  }
  
  // ============================================================================
  // SECTION 7: ROADMAP
  // ============================================================================
  
  pdf.addPage();
  yPosition = margin;
  
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235);
  pdf.text('7. Development Roadmap', margin, yPosition);
  yPosition += 15;
  
  if (result.roadmap && result.roadmap.length > 0) {
    result.roadmap.forEach((phase, index) => {
      checkPageBreak(30);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${index + 1}. ${phase.phase}`, margin, yPosition);
      yPosition += 8;
      
      if (phase.tasks && phase.tasks.length > 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        phase.tasks.forEach(task => {
          checkPageBreak();
          pdf.text(`• ${task}`, margin + 5, yPosition);
          yPosition += 6;
        });
      }
      yPosition += 8;
    });
  }
  
  // ============================================================================
  // SECTION 8: COST ESTIMATION
  // ============================================================================
  
  pdf.addPage();
  yPosition = margin;
  
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(37, 99, 235);
  pdf.text('8. Cost Estimation', margin, yPosition);
  yPosition += 15;
  
  if (result.estimation) {
    const estimationData = [
      ['Development Hours', result.estimation.hours || 'N/A'],
      ['Team Size', result.estimation.team_size || 'N/A'],
      ['Estimated Cost', result.estimation.cost || 'N/A'],
    ];
    
    pdf.autoTable({
      startY: yPosition,
      body: estimationData,
      margin: { left: margin },
      theme: 'grid',
      bodyStyles: { fontSize: 11 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold', fillColor: [240, 240, 240] },
        1: { cellWidth: contentWidth - 60 }
      },
    });
    
    yPosition = pdf.lastAutoTable.finalY + 10;
  }
  
  // ============================================================================
  // FOOTER ON LAST PAGE
  // ============================================================================
  
  yPosition += 20;
  checkPageBreak(30);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(150, 150, 150);
  pdf.text('Generated by ArchitechAI - AI-Powered Architecture Generator', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  pdf.text('https://architech.ai', pageWidth / 2, yPosition, { align: 'center' });
  
  // Save PDF
  const filename = `architecture-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
  
  return filename;
}
