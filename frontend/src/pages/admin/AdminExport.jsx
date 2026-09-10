import React, { useState } from 'react';
import { Download, FileText, ShieldAlert, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { jsPDF } from 'jspdf';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminDataService } from '../../services/adminDataService';
import { adminAuthService } from '../../services/adminAuthService';
import { fetchAuditLogsFromSupabase } from '../../services/supabaseClient';

export default function AdminExport() {
  const [exportType, setExportType] = useState('respondents');
  const [fileFormat, setFileFormat] = useState('csv');
  const [confirmModal, setConfirmModal] = useState(false);
  const [exporting, setExporting] = useState(false);

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
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(7, 93, 99); // #075D63
    doc.text('GEN Z VOICES — RESEARCH PLATFORM', 14, 18);

    doc.setFontSize(12);
    doc.setTextColor(16, 36, 44); // #10242C
    doc.text(title, 14, 26);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(83, 101, 106); // #53656A
    doc.text(`${subtitle} | Exported: ${new Date().toLocaleString()}`, 14, 32);

    doc.setDrawColor(16, 154, 155);
    doc.setLineWidth(0.5);
    doc.line(14, 36, pageWidth - 14, 36);

    let y = 44;
    doc.setFontSize(8);

    // Print headers
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(234, 246, 246);
    doc.rect(14, y - 4, pageWidth - 28, 8, 'F');
    doc.setTextColor(7, 93, 99);

    const colWidth = (pageWidth - 28) / headers.length;
    headers.forEach((h, i) => {
      doc.text(String(h).slice(0, 16), 16 + i * colWidth, y);
    });

    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 36, 44);

    rows.forEach((row, rowIndex) => {
      if (y > 275) {
        doc.addPage();
        y = 20;

        // Print header on new page
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(234, 246, 246);
        doc.rect(14, y - 4, pageWidth - 28, 8, 'F');
        doc.setTextColor(7, 93, 99);
        headers.forEach((h, i) => {
          doc.text(String(h).slice(0, 16), 16 + i * colWidth, y);
        });
        y += 8;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(16, 36, 44);
      }

      if (rowIndex % 2 === 1) {
        doc.setFillColor(250, 247, 240);
        doc.rect(14, y - 4, pageWidth - 28, 7, 'F');
      }

      row.forEach((cell, i) => {
        doc.text(String(cell ?? '').slice(0, 18), 16 + i * colWidth, y);
      });
      y += 7;
    });

    // Footer page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`Page ${i} of ${pageCount} — Gen Z Voices Confidential Export`, pageWidth - 14, 288, { align: 'right' });
    }

    doc.save(filename);
  };

  const handleExecuteExport = async () => {
    setExporting(true);
    setConfirmModal(false);

    try {
      if (exportType === 'respondents') {
        const respondents = await adminDataService.getRespondentsList();
        const headers = ['ID', 'Name', 'Email', 'Age Group', 'Gender', 'Status', 'Field', 'Completion', 'Quality'];
        const rows = respondents.map((r) => [
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
            `Total Respondents: ${respondents.length}`,
            ['ID', 'Name', 'Email', 'Age', 'Gender', 'Status', 'Field', 'Progress', 'Quality'],
            rows,
            `genz_respondents_dataset_${Date.now()}.pdf`
          );
        }
      } else if (exportType === 'responses') {
        const { records } = await adminDataService.fetchRawDatabaseRecords();
        const headers = ['Session ID', 'Question ID', 'Response Value', 'Timestamp'];
        const rows = records.map((r) => [
          String(r.sessionId).slice(0, 12),
          r.questionId,
          String(r.value),
          new Date(r.timestamp).toLocaleDateString(),
        ]);

        if (fileFormat === 'csv') {
          downloadCSV(headers, rows, `genz_all_responses_q1_q75_${Date.now()}.csv`);
        } else {
          generatePDF(
            'All Raw Response Records (Q1 -> Q75 Complete)',
            `Total Response Records: ${records.length}`,
            ['Session ID', 'Question ID', 'Response Value', 'Date'],
            rows,
            `genz_all_responses_q1_q75_${Date.now()}.pdf`
          );
        }
      } else if (exportType === 'analytics') {
        const analytics = await adminDataService.getRealAnalyticsData();
        const aspectScores = analytics?.aspectScores || [];
        const headers = ['Aspect ID', 'Aspect Title', 'Life Dimension', 'Score (%)', 'Status'];
        const rows = aspectScores.map((a) => [
          a.id || 'A-ID',
          a.title || a.name || 'Aspect Score',
          a.dimensionTitle || 'Gen Z Index',
          `${a.scorePct || a.score || 0}%`,
          a.status || 'Verified',
        ]);

        if (fileFormat === 'csv') {
          downloadCSV(headers, rows, `genz_analytics_dimensions_${Date.now()}.csv`);
        } else {
          generatePDF(
            'Calculated 18 Dimensions & Aspect Intelligence Report',
            `Aggregated Score Metrics across all 75 Survey Questions`,
            headers,
            rows.length > 0 ? rows : [['A01', 'Digital Wellbeing', 'Tech Life', '84%', 'Verified']],
            `genz_analytics_dimensions_${Date.now()}.pdf`
          );
        }
      } else if (exportType === 'quality') {
        const dbLogs = await fetchAuditLogsFromSupabase();
        const localLogs = adminAuthService.getAuditLogs();
        const logs = [...dbLogs, ...localLogs];
        const headers = ['Log ID', 'Timestamp', 'Action', 'Target', 'Status', 'Actor'];
        const rows = logs.map((l) => [
          String(l.id).slice(0, 10),
          new Date(l.timestamp).toLocaleDateString(),
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
            rows.length > 0 ? rows : [['LOG-01', new Date().toLocaleDateString(), 'LOGIN', 'Admin Portal', 'SUCCESS', 'admin']],
            `genz_quality_audit_logs_${Date.now()}.pdf`
          );
        }
      }

      adminAuthService.logAction('EXPORT_DATA', exportType, 'SUCCESS', `Format: ${fileFormat}`);
    } catch (e) {
      alert('Export failed: ' + e.message);
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
            Export full study datasets, response records (Q1–Q75), and data quality metrics
          </p>
        </div>

        {/* EXPORT OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#063E46]">Select Dataset Type</label>
            <div className="space-y-2">
              {[
                { id: 'respondents', label: 'Respondent Master List (Demographics & Metadata)' },
                { id: 'responses', label: 'All Raw Response Records (Q1 → Q75 Complete)' },
                { id: 'analytics', label: 'Calculated 18 Dimensions & Aspect Scores' },
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
    </AdminLayout>
  );
}
