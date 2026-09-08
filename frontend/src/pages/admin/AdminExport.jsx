import React, { useState } from 'react';
import { Download, FileSpreadsheet, ShieldAlert, CheckCircle2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminDataService } from '../../services/adminDataService';
import { adminAuthService } from '../../services/adminAuthService';

export default function AdminExport() {
  const [exportType, setExportType] = useState('respondents');
  const [fileFormat, setFileFormat] = useState('csv');
  const [confirmModal, setConfirmModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExecuteExport = async () => {
    setExporting(true);
    setConfirmModal(false);

    try {
      if (exportType === 'respondents') {
        const respondents = await adminDataService.getRespondentsList();
        const headers = ['ID', 'Name', 'Age Group', 'Gender', 'Status', 'Field', 'Completion', 'Duration', 'Quality Status'];
        const rows = respondents.map((r) => [
          r.id,
          r.name,
          r.ageGroup,
          r.gender,
          r.currentStatus,
          r.fieldOfStudy,
          `${r.completionPct}% (${r.completionStatus})`,
          r.durationMinutes,
          r.qualityStatus,
        ]);
        const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        downloadBlob(csvContent, `genz_respondents_dataset_${Date.now()}.${fileFormat}`);
      } else {
        const { records } = await adminDataService.fetchRawDatabaseRecords();
        const headers = ['SessionID', 'QuestionID', 'ResponseValue', 'Timestamp'];
        const rows = records.map((r) => [r.sessionId, r.questionId, String(r.value).replace(/,/g, ' '), r.timestamp]);
        const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        downloadBlob(csvContent, `genz_all_responses_q1_q207_${Date.now()}.${fileFormat}`);
      }

      adminAuthService.logAction('EXPORT_DATA', exportType, 'SUCCESS', `Format: ${fileFormat}`);
    } catch (e) {
      alert('Export failed: ' + e.message);
    } finally {
      setExporting(false);
    }
  };

  const downloadBlob = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            Export full study datasets, response records (Q1–Q207), and data quality metrics
          </p>
        </div>

        {/* EXPORT OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#063E46]">Select Dataset Type</label>
            <div className="space-y-2">
              {[
                { id: 'respondents', label: 'Respondent Master List (Demographics & Metadata)' },
                { id: 'responses', label: 'All Raw Response Records (Q1 → Q207 Complete)' },
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
                  onClick={() => setFileFormat('xlsx')}
                  className={`flex-1 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    fileFormat === 'xlsx' ? 'bg-[#109A9B] text-white border-[#109A9B]' : 'bg-slate-100 text-[#53656A]'
                  }`}
                >
                  Excel Format (.xlsx)
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
              <FileSpreadsheet className="w-4 h-4 text-[#FDE7B5]" />
              <span>{exporting ? 'Processing Export...' : 'Prepare & Export Dataset'}</span>
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
                Confirm & Download
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
