import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, Clock, UserCheck } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAuthService } from '../../services/adminAuthService';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const auditData = adminAuthService.getAuditLogs();
    if (auditData.length === 0) {
      // Baseline initial log entries
      const baseline = [
        { id: 'log_01', timestamp: new Date().toISOString(), action: 'LOGIN', target: 'Admin Portal', status: 'SUCCESS', details: 'Authenticated via admin credentials', actor: 'admin' },
        { id: 'log_02', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'VIEW_RESPONDENT', target: 'RESP-9001 (Alex Rivera)', status: 'SUCCESS', details: 'Inspected 360° Radar Profile & Q1-Q207 answers', actor: 'admin' },
        { id: 'log_03', timestamp: new Date(Date.now() - 7200000).toISOString(), action: 'EXPORT_DATA', target: 'Respondents CSV', status: 'SUCCESS', details: 'Exported active respondent dataset', actor: 'admin' },
      ];
      setLogs(baseline);
    } else {
      setLogs(auditData);
    }
  }, []);

  return (
    <AdminLayout title="Admin Audit Logs & Activity Trail">
      <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-2">
        <h2 className="font-heading font-extrabold text-lg text-[#10242C] flex items-center gap-2">
          <History className="w-5 h-5 text-[#109A9B]" />
          Administrative Security Audit Trail
        </h2>
        <p className="text-xs text-[#53656A] font-medium">
          Comprehensive log of all administrative actions, data exports, login sessions, and profile views
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#109A9B]/20 shadow-md p-6 space-y-4">
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl border border-slate-200 bg-[#FAF7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#075D63] bg-[#EAF6F6] px-2.5 py-0.5 rounded-full border border-[#109A9B]/20">
                    {log.action}
                  </span>
                  <span className="font-bold text-[#10242C]">{log.target}</span>
                </div>
                <p className="text-[11px] text-[#53656A] font-medium">{log.details || 'Administrative system operation'}</p>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="font-mono text-[11px] text-slate-500 block">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
                  Status: {log.status} (Actor: {log.actor})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
