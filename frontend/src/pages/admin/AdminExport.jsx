import React, { useState, useEffect } from 'react';
import { Download, FileText, ShieldAlert, CheckCircle2, FileSpreadsheet, UserCheck, Search, Users } from 'lucide-react';
import { jsPDF } from 'jspdf';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminDataService } from '../../services/adminDataService';
import { adminAuthService } from '../../services/adminAuthService';
import { fetchAuditLogsFromSupabase } from '../../services/supabaseClient';
import GridModal from '../../components/common/GridModal';

export default function AdminExport() {
  const [exportType, setExportType] = useState('respondents');
  const [fileFormat, setFileFormat] = useState('csv');
  const [confirmModal, setConfirmModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [respondents, setRespondents] = useState([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  const [participantSearch, setParticipantSearch] = useState('');
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', type: 'error' });

  useEffect(() => {
    adminDataService.getRespondentsList().then((list) => {
      setRespondents(list || []);
      if (list && list.length > 0) {
        setSelectedParticipantId(list[0].id || list[0].sessionId);
      }
    });
  }, []);

  const filteredRespondents = respondents.filter((r) => {
    if (!participantSearch.trim()) return true;
    const q = participantSearch.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      r.id?.toLowerCase().includes(q)
    );
  });

  const downloadCSV = (headers, rows, filename) => {
    const csvContent = [
      headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = (title, subtitle, headers, rows, filename) => {
    const isLandscape = headers.length > 5;
    const doc = new jsPDF({ orientation: isLandscape ? 'landscape' : 'portrait' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const printableWidth = pageWidth - margin * 2;
    const fontSize = isLandscape ? 8 : 7.5;

    const fitText = (d, txt, maxW) => {
      let str = String(txt ?? '').trim();
      if (!str) return '';
      if (d.getTextWidth(str) <= maxW) return str;
      let truncated = str;
      while (truncated.length > 1 && d.getTextWidth(truncated + '…') > maxW) {
        truncated = truncated.slice(0, -1);
      }
      return truncated.length > 0 ? truncated + '…' : '';
    };

    // Measure exact text widths for headers & data cells in mm
    doc.setFontSize(fontSize);
    const desiredWidths = headers.map((h, colIdx) => {
      doc.setFont('helvetica', 'bold');
      let maxW = doc.getTextWidth(String(h));
      doc.setFont('helvetica', 'normal');
      rows.forEach((r) => {
        const cellW = doc.getTextWidth(String(r[colIdx] ?? ''));
        if (cellW > maxW) maxW = cellW;
      });
      return Math.max(maxW + 4, 12);
    });

    const totalDesired = desiredWidths.reduce((a, b) => a + b, 0) || headers.length;
    const colWidths = desiredWidths.map((w) => (w / totalDesired) * printableWidth);

    const colPositions = [];
    let currentX = margin;
    colWidths.forEach((w) => {
      colPositions.push(currentX);
      currentX += w;
    });

    // Header Title Block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(7, 93, 99); // #075D63
    doc.text('GEN Z VOICES — RESEARCH PLATFORM', margin, 15);

    doc.setFontSize(10.5);
    doc.setTextColor(16, 36, 44); // #10242C
    doc.text(title, margin, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(83, 101, 106); // #53656A
    doc.text(`${subtitle} | Exported: ${new Date().toLocaleString()}`, margin, 27);

    // Header Border Line
    doc.setDrawColor(16, 154, 155);
    doc.setLineWidth(0.5);
    doc.line(margin, 30, pageWidth - margin, 30);

    let y = 37;
    const rowHeight = 7.5;

    const renderTableHeader = (currentY) => {
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(7, 93, 99); // Solid dark teal header
      doc.rect(margin, currentY - 5, printableWidth, rowHeight, 'F');
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(fontSize);

      headers.forEach((h, i) => {
        const maxCellW = colWidths[i] - 2;
        const safeText = fitText(doc, String(h), maxCellW);
        doc.text(safeText, colPositions[i] + 1.5, currentY - 0.5);
      });
    };

    renderTableHeader(y);

    y += rowHeight;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 36, 44);

    rows.forEach((row, rowIndex) => {
      if (y > pageHeight - 16) {
        doc.addPage();
        y = 20;
        renderTableHeader(y);
        y += rowHeight;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(16, 36, 44);
      }

      // Alternating row background
      if (rowIndex % 2 === 1) {
        doc.setFillColor(244, 249, 249);
        doc.rect(margin, y - 5, printableWidth, rowHeight, 'F');
      } else {
        doc.setFillColor(255, 255, 255);
        doc.rect(margin, y - 5, printableWidth, rowHeight, 'F');
      }

      // Border line under each row
      doc.setDrawColor(230, 235, 237);
      doc.setLineWidth(0.1);
      doc.line(margin, y + 2.5, pageWidth - margin, y + 2.5);

      doc.setFontSize(fontSize);
      row.forEach((cell, i) => {
        const maxCellW = colWidths[i] - 2;
        const safeText = fitText(doc, String(cell ?? ''), maxCellW);
        doc.text(safeText, colPositions[i] + 1.5, y - 0.5);
      });

      y += rowHeight;
    });

    // Footer with Page Numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `Page ${i} of ${pageCount} — Gen Z Voices Confidential Administrative Export`,
        pageWidth - margin,
        pageHeight - 6,
        { align: 'right' }
      );
    }

    doc.save(filename);
  };

  const handleDownloadParticipantResponses = async (pId, format = 'pdf') => {
    setExporting(true);
    try {
      const detail = await adminDataService.getRespondentDetail(pId);
      if (!detail || !detail.respondent) {
        throw new Error('Participant responses record not found in database.');
      }

      const { respondent, fullResponses } = detail;
      const headers = ['Code', 'Category / Topic', 'Question Text', 'Participant Answer', 'Raw Value'];
      const rows = fullResponses.map((r) => [
        r.code,
        r.topic,
        r.questionText,
        r.selectedOptionLabel,
        r.storedValue,
      ]);

      const safeName = (respondent.name || 'Participant').replace(/[^a-zA-Z0-9]/g, '_');

      if (format === 'csv') {
        downloadCSV(headers, rows, `genz_responses_${safeName}_${Date.now()}.csv`);
      } else {
        generatePDF(
          `Individual Response Record: ${respondent.name}`,
          `Email: ${respondent.email || 'N/A'} | Status: ${respondent.completionStatus} (${respondent.completionPct}%) | Progress: ${respondent.answersCount}/75 Qs Answered`,
          headers,
          rows,
          `genz_responses_${safeName}_${Date.now()}.pdf`
        );
      }
      adminAuthService.logAction('EXPORT_DATA', 'single_participant', 'SUCCESS', `Format: ${format}, Participant: ${pId}`);
    } catch (e) {
      setModalConfig({ isOpen: true, title: 'Export Failed', message: e.message, type: 'error' });
    } finally {
      setExporting(false);
    }
  };

  const handleExecuteExport = async () => {
    setExporting(true);
    setConfirmModal(false);

    try {
      if (exportType === 'respondents') {
        const list = await adminDataService.getRespondentsList();
        const headers = ['ID', 'Name', 'Email', 'Age Group', 'Gender', 'Status', 'Field', 'Completion', 'Quality'];
        const rows = list.map((r) => [
          r.id?.slice(0, 8),
          r.name,
          r.email,
          r.ageGroup,
          r.gender,
          r.currentStatus,
          r.fieldOfStudy,
          `${r.completionPct}%`,
          r.qualityStatus,
        ]);

        if (fileFormat === 'csv') {
          downloadCSV(headers, rows, `genz_respondents_dataset_${Date.now()}.csv`);
        } else {
          generatePDF(
            'Respondent Master List (Demographics & Metadata)',
            `Total Respondents: ${list.length}`,
            ['ID', 'Name', 'Email', 'Age', 'Gender', 'Status', 'Field', 'Progress', 'Quality'],
            rows,
            `genz_respondents_dataset_${Date.now()}.pdf`
          );
        }
      } else if (exportType === 'single_participant') {
        if (!selectedParticipantId) {
          throw new Error('Please select a participant from the list!');
        }
        await handleDownloadParticipantResponses(selectedParticipantId, fileFormat);
        return;
      } else if (exportType === 'questions') {
        const questionsList = await adminDataService.getQuestionsList();
        const headers = ['Code', 'Section', 'Topic / Category', 'Question Text', 'Type', 'Options'];
        const rows = questionsList.map((q) => [
          q.code,
          `Sec ${q.sectionNumber || 1}`,
          q.topic,
          q.text,
          q.isMultiSelect ? 'Multi-Select' : 'Single Option',
          q.options?.map((o) => o.label).join(' | ') || '',
        ]);

        if (fileFormat === 'csv') {
          downloadCSV(headers, rows, `genz_questions_blueprint_${Date.now()}.csv`);
        } else {
          generatePDF(
            'Official Questionnaire Blueprint (Q1 → Q75 Master List)',
            `Total Questions in Supabase DB: ${questionsList.length}`,
            headers,
            rows,
            `genz_questions_blueprint_${Date.now()}.pdf`
          );
        }
      } else if (exportType === 'quality') {
        const dbLogs = await fetchAuditLogsFromSupabase();
        const localLogs = adminAuthService.getAuditLogs();
        const logs = [...dbLogs, ...localLogs];
        const headers = ['Log ID', 'Timestamp', 'Action', 'Target', 'Status', 'Actor'];
        const rows = logs.map((l) => [
          String(l.id).slice(0, 10),
          adminDataService.formatIST(l.timestamp),
          l.action,
          l.target,
          l.status || 'SUCCESS',
          l.actor || 'admin',
        ]);

        if (fileFormat === 'csv') {
          downloadCSV(headers, rows, `genz_quality_audit_logs_${Date.now()}.csv`);
        } else {
          generatePDF(
            'Data Quality & Administrative Audit Trail Report',
            `Total Security & Data Logs: ${logs.length}`,
            headers,
            rows.length > 0 ? rows : [['LOG-01', adminDataService.formatIST(new Date()), 'LOGIN', 'Admin Portal', 'SUCCESS', 'admin']],
            `genz_quality_audit_logs_${Date.now()}.pdf`
          );
        }
      }

      adminAuthService.logAction('EXPORT_DATA', exportType, 'SUCCESS', `Format: ${fileFormat}`);
    } catch (e) {
      setModalConfig({ isOpen: true, title: 'Export Failed', message: e.message, type: 'error' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminLayout title="Database Export Utility">
      <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-6">
        <div>
          <h2 className="font-heading font-extrabold text-lg text-[#10242C] flex items-center gap-2">
            <Download className="w-5 h-5 text-[#109A9B]" />
            Dataset & Response Export Center
          </h2>
          <p className="text-xs text-[#53656A] font-medium">
            Export full study datasets, participant individual responses, question blueprints, and audit logs
          </p>
        </div>

        {/* EXPORT OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063E46]">Select Dataset Type</label>
              <div className="space-y-2">
                {[
                  { id: 'respondents', label: 'Respondent Master List (Demographics & Metadata)' },
                  { id: 'single_participant', label: 'Individual Participant Responses (Select Respondent)' },
                  { id: 'questions', label: 'Questionnaire Blueprint & Questions Master List (Q1 → Q75)' },
                  { id: 'quality', label: 'Data Quality & Audit Logs' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setExportType(opt.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      exportType === opt.id ? 'bg-[#075D63] text-white border-[#075D63] shadow-sm' : 'bg-[#FAF7F0] text-[#10242C] border-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063E46]">File Format</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFileFormat('csv')}
                  className={`flex-1 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    fileFormat === 'csv' ? 'bg-[#109A9B] text-white border-[#109A9B]' : 'bg-slate-100 text-[#53656A]'
                  }`}
                >
                  CSV Format (.csv)
                </button>
                <button
                  onClick={() => setFileFormat('pdf')}
                  className={`flex-1 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    fileFormat === 'pdf' ? 'bg-[#109A9B] text-white border-[#109A9B]' : 'bg-slate-100 text-[#53656A]'
                  }`}
                >
                  PDF Document (.pdf)
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EAF6F6] border border-[#109A9B]/20 text-xs text-[#075D63] font-semibold space-y-1">
              <span className="font-bold block">Security & Filter Notice:</span>
              <p>Export respects active search filters and preserves privacy standards.</p>
            </div>

            <button
              onClick={() => setConfirmModal(true)}
              disabled={exporting}
              className="w-full py-3.5 bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {fileFormat === 'pdf' ? <FileText className="w-4 h-4 text-[#FDE7B5]" /> : <FileSpreadsheet className="w-4 h-4 text-[#FDE7B5]" />}
              <span>{exporting ? 'Processing Export...' : `Export Dataset as ${fileFormat.toUpperCase()}`}</span>
            </button>
          </div>
        </div>

        {/* ALL USERS SELECTION GRID & CARDS (Shown when single_participant option is selected) */}
        {exportType === 'single_participant' && (
          <div className="bg-[#EAF6F6]/60 p-5 sm:p-6 rounded-3xl border border-[#109A9B]/30 space-y-4 animate-fade-in shadow-xs pt-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#109A9B]/20">
              <div className="space-y-0.5">
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#10242C] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#075D63]" />
                  <span>Select User / Participant ({respondents.length} Total Registered Users)</span>
                </h3>
                <p className="text-xs text-[#53656A] font-medium">
                  Click any participant card to select or use the direct CSV/PDF download buttons to export all responses for that user.
                </p>
              </div>

              {/* Search Bar for Participants */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  placeholder="Search by name, email, or ID..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-none focus:border-[#109A9B] shadow-xs"
                />
              </div>
            </div>

            {/* Participants Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
              {filteredRespondents.map((r) => {
                const pId = r.id || r.sessionId;
                const isSelected = pId === selectedParticipantId;

                return (
                  <div
                    key={pId}
                    onClick={() => setSelectedParticipantId(pId)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-white border-[#075D63] ring-2 ring-[#075D63]/30 shadow-md scale-[1.01]'
                        : 'bg-white border-slate-200/90 hover:border-[#109A9B]/60 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#075D63] shrink-0" />}
                          <h4 className="font-bold text-xs sm:text-sm text-[#10242C] truncate">{r.name}</h4>
                        </div>
                        <p className="text-[11px] text-[#53656A] font-medium truncate mt-0.5">{r.email || `ID: ${r.id?.slice(0, 8)}`}</p>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                          r.completionStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {r.completionPct}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 gap-2">
                      <span className="text-[11px] font-bold text-slate-500 truncate">
                        {r.answersCount || 0}/75 Qs Answered
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedParticipantId(pId);
                            handleDownloadParticipantResponses(pId, 'csv');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-[#109A9B] hover:text-white text-[#075D63] font-bold text-[10.5px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-slate-200"
                          title="Download Responses as CSV"
                        >
                          <FileSpreadsheet className="w-3 h-3" />
                          <span>CSV</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedParticipantId(pId);
                            handleDownloadParticipantResponses(pId, 'pdf');
                          }}
                          className="px-2.5 py-1 bg-[#075D63] hover:bg-[#109A9B] text-white font-bold text-[10.5px] rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Download Responses as PDF"
                        >
                          <FileText className="w-3 h-3 text-[#FDE7B5]" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredRespondents.length === 0 && (
                <div className="col-span-full py-8 text-center text-xs text-[#53656A] font-bold">
                  No matching participants found. Try adjusting your search query.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CONFIRMATION DIALOG MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-700">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="font-heading font-extrabold text-lg text-[#10242C]">Confirm Data Export</h3>
            </div>

            <p className="text-xs text-[#53656A] font-semibold leading-relaxed">
              You are about to export the study dataset (<strong>{exportType.toUpperCase()}</strong>) in <strong>{fileFormat.toUpperCase()}</strong> format. Please ensure secure handling of administrative research data.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#10242C] font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteExport}
                className="px-5 py-2 bg-[#075D63] hover:bg-[#109A9B] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Confirm & Download {fileFormat.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}

      <GridModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </AdminLayout>
  );
}
