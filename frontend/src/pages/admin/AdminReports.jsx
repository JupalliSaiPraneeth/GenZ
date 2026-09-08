import React, { useState } from 'react';
import { FileText, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const REPORT_TEMPLATES = [
  { id: 'executive-summary', title: 'Executive Summary Brief', description: 'High-level population trends, KPI summary, and top dimension insights across 207 questions.', format: 'PDF / Markdown' },
  { id: '360-dimensions', title: '360° Life Orientation Detailed Report', description: 'Comprehensive statistical breakdown of all 18 core analytical dimensions and aspect scores.', format: 'PDF / Excel' },
  { id: 'demographic-benchmarks', title: 'Demographic & Socio-Economic Benchmarks', description: 'Cross-tabulation matrix breaking down scores by age, gender, residence, and financial background.', format: 'Excel / CSV' },
  { id: 'quality-audit', title: 'Data Quality & Integrity Audit', description: 'Methodological checks, completion speed distributions, attention check statistics, and anomaly flags.', format: 'PDF' },
];

export default function AdminReports() {
  const [downloading, setDownloading] = useState(null);

  const handleGenerate = (id) => {
    setDownloading(id);
    setTimeout(() => {
      alert(`Report generated successfully! Pre-formatted analytical summary ready for download.`);
      setDownloading(null);
    }, 1200);
  };

  return (
    <AdminLayout title="Automated Research Reports & Briefs">
      <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-2">
        <h2 className="font-heading font-extrabold text-lg text-[#10242C] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#109A9B]" />
          Executive Research Report Builder
        </h2>
        <p className="text-xs text-[#53656A] font-medium">
          Generate structured research reports, executive briefs, and section breakdowns from the live database
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {REPORT_TEMPLATES.map((tmpl) => (
          <div key={tmpl.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#075D63] bg-[#EAF6F6] px-2.5 py-0.5 rounded-full border border-[#109A9B]/20">
                  Format: {tmpl.format}
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-base text-[#10242C]">{tmpl.title}</h3>
              <p className="text-xs text-[#53656A] leading-relaxed font-medium">{tmpl.description}</p>
            </div>

            <button
              onClick={() => handleGenerate(tmpl.id)}
              disabled={downloading === tmpl.id}
              className="py-3 px-4 bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-bold text-xs rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#FDE7B5]" />
              <span>{downloading === tmpl.id ? 'Generating Report...' : 'Generate & Download Report'}</span>
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
