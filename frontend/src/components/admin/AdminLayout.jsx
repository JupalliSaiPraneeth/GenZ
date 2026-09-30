import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  HelpCircle,
  GitCompare,
  Database,
  Download,
  History,
  LogOut,
  Menu,
  X,
  Search,
  ChevronRight,
  ShieldCheck,
  Activity,
  Bell,
} from 'lucide-react';
import { adminAuthService } from '../../services/adminAuthService';

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/respondents', label: 'Respondents', icon: Users },
  { path: '/admin/responses', label: 'Responses', icon: MessageSquare },
  { path: '/admin/questions', label: 'Questions', icon: HelpCircle },
  { path: '/admin/comparative-analysis', label: 'Comparative Analysis', icon: GitCompare },
  { path: '/admin/database', label: 'Database Monitoring', icon: Database },
  { path: '/admin/export', label: 'Export Data', icon: Download },
  { path: '/admin/audit-logs', label: 'Audit Logs', icon: History },
  { path: '/admin/verify-certificate', label: 'Verify Certificate', icon: ShieldCheck },
];

export default function AdminLayout({ children, title = 'Admin Portal' }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/');
  };

  const activeNavItem = NAV_ITEMS.find((item) => location.pathname.startsWith(item.path)) || NAV_ITEMS[0];

  return (
    <div className="min-h-screen w-full bg-[#FAF7F0] flex font-inter text-[#10242C] overflow-x-hidden">
      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* BRAND HEADER */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#0E3B42] bg-[#072227] shrink-0 overflow-hidden">
          <Link to="/admin/dashboard" className="flex items-center h-full w-full py-2 min-w-0 pr-2">
            <img
              src="/brightlogo.png"
              onError={(e) => { e.currentTarget.src = "/logo.png"; }}
              alt="Gen Z Voices Logo"
              className="h-full w-full object-contain object-left"
            />
          </Link>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex-1 flex flex-col justify-between bg-[#0A2E33] border-r border-[#0E3B42] min-h-0">
          <nav className="p-3 space-y-1.5 overflow-y-auto flex-1 scrollbar-thin">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-150 group ${
                    isActive
                      ? 'bg-[#075D63] text-white shadow-sm border border-white/15'
                      : 'text-slate-300 hover:text-white hover:bg-white/8'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#109A9B] rounded-r-full" />
                  )}
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#FDE7B5]' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#FDE7B5]" />}
                </Link>
              );
            })}
          </nav>

          {/* BOTTOM PROFILE & LOGOUT */}
          <div className="p-3 border-t border-[#0E3B42] bg-[#072227]/90 shrink-0">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#075D63] text-white font-extrabold flex items-center justify-center text-xs shrink-0 border border-white/20">
                  AD
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate leading-tight">Admin System</span>
                  <span className="text-[9.5px] text-[#109A9B] font-extrabold uppercase font-mono block leading-tight mt-0.5">
                    ROLE: ADMIN
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-300 hover:text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
                title="Logout Admin Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN RIGHT AREA */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* LEFT TITLE & BREADCRUMB */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#063E46] hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                <span
                  className="hover:text-[#075D63] transition-colors cursor-pointer"
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Admin
                </span>
                <span>/</span>
                <span className="text-[#075D63] font-extrabold">{activeNavItem.label}</span>
              </div>
              <h1 className="font-heading font-extrabold text-sm sm:text-base text-[#10242C] tracking-tight truncate max-w-[160px] sm:max-w-xs md:max-w-md lg:max-w-none">
                {title || activeNavItem.label}
              </h1>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <div className="hidden md:flex items-center relative w-56 lg:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Global search..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:border-[#109A9B] outline-none font-medium bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            {/* DB STATUS */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DB Connected</span>
            </div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#063E46] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1536px] w-full mx-auto space-y-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
