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
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminDataService } from '../../services/adminDataService';

export default function AdminRespondents() {
  const [respondents, setRespondents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

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
          <table className="w-full text-left text-xs font-medium">
            <thead className="bg-[#EAF6F6] text-[#063E46] font-bold uppercase text-[10px] tracking-wider border-b border-[#109A9B]/20">
              <tr>
                <th className="p-4">Respondent ID</th>
                <th className="p-4">Participant Name</th>
                <th className="p-4">Age / Gender</th>
                <th className="p-4">Status & Field</th>
                <th className="p-4">Residence</th>
                <th className="p-4">Progress %</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Quality Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-bold">
                    Querying live database records...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500 font-bold">
                    No respondents found matching the current search filters.
                  </td>
                </tr>
              ) : (
                currentItems.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#075D63]">{r.id}</td>
                    <td className="p-4 font-bold text-[#10242C]">{r.name}</td>
                    <td className="p-4">
                      <span className="font-bold text-[#10242C]">{r.ageGroup}</span>
                      <span className="text-[11px] text-[#53656A] block">{r.gender}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#10242C] block">{r.currentStatus}</span>
                      <span className="text-[11px] text-[#075D63] font-semibold">{r.fieldOfStudy}</span>
                    </td>
                    <td className="p-4 text-[#53656A] font-semibold">{r.childhoodResidence}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#075D63]">{r.completionPct}%</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            r.completionStatus === 'Completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}
                        >
                          {r.completionStatus}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-[#53656A] font-mono">{r.durationMinutes}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          r.qualityStatus === 'Verified'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {r.qualityStatus === 'Verified' ? (
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                        )}
                        <span>{r.qualityStatus}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/admin/respondents/${r.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EAF6F6] hover:bg-[#109A9B] hover:text-white text-[#075D63] font-bold text-xs border border-[#109A9B]/25 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </Link>
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
    </AdminLayout>
  );
}
