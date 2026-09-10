import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  HelpCircle,
  BarChart3,
  GitCompare,
  Database,
  Download,
  History,
  LogOut,
  Menu,
  X,
  Search,
  ChevronRight,
  Shield,
  Activity,
  Bell,
} from 'lucide-react';
import { adminAuthService } from '../../services/adminAuthService';

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/respondents', label: 'Respondents', icon: Users },
  { path: '/admin/responses', label: 'Responses', icon: MessageSquare },
  { path: '/admin/questions', label: 'Questions', icon: HelpCircle },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/comparative-analysis', label: 'Comparative Analysis', icon: GitCompare },
  { path: '/admin/database', label: 'Database Monitoring', icon: Database },
  { path: '/admin/export', label: 'Export Data', icon: Download },
  { path: '/admin/audit-logs', label: 'Audit Logs', icon: History },
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
      {/* MOBILE BACKDROP DRAWER OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 text-[#FFF8E8] flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* TOP BRAND HEADER WITH WHITE BACKGROUND */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 bg-white shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group min-w-0">
            <img
              src="/logo.png"
              onError={(e) => { e.currentTarget.src = "/GenZ.png"; }}
              alt="Gen Z Voices Logo"
              className="h-13 max-h-13 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SIDEBAR NAVIGATION BODY WITH BORDER-R BELOW HEADER */}
        <div className="flex-1 flex flex-col justify-between bg-[#063E46] border-r border-[#075D63]/80 min-h-0">
          {/* 13 NAV ITEMS LINK LIST */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1 scrollbar-thin">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 group ${isActive
                      ? 'bg-gradient-to-r from-[#109A9B] to-[#075D63] text-white shadow-md shadow-teal-950/40 border border-white/10'
                      : 'text-white hover:text-[#FDE7B5] hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#FDE7B5]' : 'text-white group-hover:text-[#FDE7B5]'}`} />
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#FDE7B5]" />}
                </Link>
              );
            })}
          </nav>

          {/* BOTTOM USER PROFILE & LOGOUT */}
          <div className="p-3 border-t border-[#075D63]/70 bg-[#053239]/90 shrink-0">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#109A9B] to-[#075D63] text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs border border-white/20">
                  AD
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate leading-tight">Admin Portal</span>
                  <span className="text-[9.5px] text-[#109A9B] font-extrabold uppercase font-mono block leading-tight mt-0.5">
                    ROLE: ADMIN
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-300 hover:text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
                title="Logout Admin Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN RIGHT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* TOP NAVBAR HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#063E46] hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#53656A]">
                <span>Admin</span>
                <span>/</span>
                <span className="text-[#075D63] font-extrabold">{activeNavItem.label}</span>
              </div>
              <h1 className="font-heading font-extrabold text-xs sm:text-sm md:text-base text-[#10242C] truncate max-w-[130px] min-[380px]:max-w-[170px] min-[450px]:max-w-[220px] sm:max-w-xs md:max-w-md lg:max-w-none">
                {title || activeNavItem.label}
              </h1>
            </div>
          </div>

          {/* GLOBAL SEARCH & STATUS BAR */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center relative w-56 lg:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Global admin search..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:border-[#109A9B] outline-none font-medium bg-slate-50"
              />
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>DB Connected</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#063E46] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
