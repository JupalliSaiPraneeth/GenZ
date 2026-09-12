import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Users,
  Eye,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminDataService } from '../../services/adminDataService';

export default function AdminRespondents() {
  const [respondents, setRespondents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    async function loadRespondents() {
      setLoading(true);
      const list = await adminDataService.getRespondentsList(searchQuery, filterStatus);
      setRespondents(list);
      setLoading(false);
    }
    loadRespondents();
  }, [searchQuery, filterStatus]);

  const handleDeleteParticipant = (respondentObj) => {
    setDeleteError('');
    setDeleteTarget(respondentObj);
  };

  const confirmDeleteParticipant = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError('');

    const res = await adminDataService.deleteRespondent(deleteTarget.id);
    setIsDeleting(false);

    if (res?.success) {
      setRespondents((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } else {
      setDeleteError(res?.error || 'Failed to delete participant from database.');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(respondents.length / itemsPerPage) || 1;
  const currentItems = respondents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportCSV = () => {
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
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `genz_respondents_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout title="Respondents Data Explorer">
      {/* SEARCH, FILTER & EXPORT HEADER TOOLBAR */}
      <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-[#10242C] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#109A9B]" />
              Survey Respondents Registry ({respondents.length} Records)
            </h2>
            <p className="text-xs text-[#53656A] font-medium">
              Inspect participant profiles, completion percentages, and data quality indicators
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-bold text-xs rounded-2xl shadow-sm transition-all cursor-pointer flex items-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4 text-[#FDE7B5]" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* SEARCH & STATUS FILTER CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, status, or field..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:border-[#109A9B] outline-none text-xs font-semibold"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#109A9B] shrink-0" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-[#063E46] outline-none cursor-pointer w-full sm:w-auto"
            >
              <option value="all">All Submissions</option>
              <option value="completed">Completed Only</option>
              <option value="in progress">In Progress Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* RESPONDENTS TABLE CONTAINER */}
      <div className="bg-white rounded-3xl border border-[#109A9B]/20 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium border-collapse">
            <thead className="bg-[#EAF6F6] text-[#063E46] font-bold uppercase text-[10px] tracking-wider border-b border-[#109A9B]/20">
              <tr className="whitespace-nowrap">
                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">Participant</th>
                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">Email</th>
                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">Progress %</th>
                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">Evaluation Status</th>
                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">Certificate ID</th>
                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">Lucky Draw</th>
                <th className="py-3.5 px-4 sm:px-5 text-right sticky right-0 z-10 bg-[#EAF6F6] shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.06)] whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-[#109A9B] border-t-transparent animate-spin" />
                      <span>Querying live database records...</span>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">
                    No respondents found matching the current search filters.
                  </td>
                </tr>
              ) : (
                currentItems.map((r) => (
                  <tr key={r.id} className="group hover:bg-[#F4FBFB]/80 transition-colors">
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#063E46] to-[#109A9B] text-[#FFF8E8] flex items-center justify-center font-black text-xs shadow-sm shrink-0 uppercase">
                          {r.name ? r.name.charAt(0) : 'P'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[#10242C] text-xs sm:text-sm truncate group-hover:text-[#109A9B] transition-colors">
                            {r.name || 'Anonymous Participant'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5">
                      <span
                        className="text-[#53656A] font-semibold text-xs truncate max-w-[180px] sm:max-w-[220px] block"
                        title={r.email || 'N/A'}
                      >
                        {r.email || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full min-w-[50px] max-w-[70px] overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              r.completionPct === 100
                                ? 'bg-emerald-500'
                                : r.completionPct > 50
                                ? 'bg-[#109A9B]'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, r.completionPct || 0))}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-extrabold text-[#075D63] text-xs">{r.completionPct || 0}%</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                              r.completionStatus === 'Completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-900 border-amber-200'
                            }`}
                          >
                            {r.completionStatus}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="whitespace-nowrap">
                        {r.evaluationStatus === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200 shadow-2xs">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Approved</span>
                          </span>
                        )}
                        {r.evaluationStatus === 'pending_evaluation' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 text-[11px] font-bold rounded-full border border-amber-200 shadow-2xs">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {r.evaluationStatus === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-800 text-[11px] font-bold rounded-full border border-rose-200 shadow-2xs">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5 font-mono font-semibold text-xs text-[#075D63]">
                      <div className="whitespace-nowrap">
                        {r.certificateId ? (
                          <span className="px-2 py-0.5 bg-slate-100 text-[#075D63] rounded border border-slate-200">
                            {r.certificateId}
                          </span>
                        ) : r.certificateStatus === 'issued' ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                            Issued
                          </span>
                        ) : (
                          <span className="text-slate-400 font-sans italic text-[11px]">Pending</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="whitespace-nowrap">
                        {r.luckyDrawStatus === 'winner' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-950 text-[11px] font-extrabold rounded-full border border-amber-300 shadow-2xs animate-pulse">
                            🏆 Winner ({r.luckyDrawPrize || 'Prize Assigned'})
                          </span>
                        ) : (
                          <span className="text-slate-500 font-medium text-xs capitalize">
                            {r.luckyDrawStatus || 'Pending'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right sticky right-0 z-10 bg-white group-hover:bg-[#F4FBFB] transition-colors shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.06)]">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <Link
                          to={`/admin/respondents/${r.id}`}
                          className="w-8 h-8 rounded-xl bg-[#063E46] hover:bg-[#075D63] text-white flex items-center justify-center shadow-2xs hover:scale-105 transition-all cursor-pointer"
                          title="Evaluate Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteParticipant(r)}
                          className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center shadow-2xs hover:scale-105 transition-all cursor-pointer"
                          title="Delete Participant from Database"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION BAR */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold bg-slate-50">
          <span className="text-[#53656A]">
            Showing page <strong className="text-[#10242C]">{currentPage}</strong> of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-slate-200 text-[#063E46] font-bold disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-slate-200 text-[#063E46] font-bold disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CENTERED CONFIRMATION GRID MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 relative overflow-hidden">
            {/* AMBIENT GLOW ACCENT */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* HEADER WITH ICON */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#10242C]">
                  Delete Participant?
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Confirm permanent removal from Supabase DB
                </p>
              </div>
            </div>

            {/* CONFIRMATION GRID */}
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-slate-200 text-xs font-semibold space-y-2">
              <div className="flex justify-between items-center text-[#10242C]">
                <span className="text-[#53656A]">Participant Name:</span>
                <span className="font-bold">{deleteTarget.name || 'Anonymous User'}</span>
              </div>
              {deleteTarget.email && (
                <div className="flex justify-between items-center text-[#10242C]">
                  <span className="text-[#53656A]">Email Address:</span>
                  <span className="font-mono text-slate-700">{deleteTarget.email}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-[#10242C]">
                <span className="text-[#53656A]">Progress:</span>
                <span className="font-bold text-[#075D63]">{deleteTarget.completionPct}% ({deleteTarget.completionStatus})</span>
              </div>
              <p className="text-[11px] text-rose-700 font-medium pt-2 border-t border-slate-200/80 leading-snug">
                ⚠️ Deleting this user will permanently erase their profile record and all associated survey responses from the database.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
                {deleteError}
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#10242C] font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteParticipant}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Deleting...' : 'Confirm & Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
