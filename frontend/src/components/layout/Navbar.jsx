import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, ShieldCheck, Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { useSurveyStore } from '../../stores/surveyStore';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const participantName = useSurveyStore((state) => state.participantName);
  const logoutParticipant = useSurveyStore((state) => state.logoutParticipant);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Insights', path: '/analytics', icon: BarChart2 },
    { name: 'Verify', path: '/verify-certificate', icon: ShieldCheck },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/about';
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logoutParticipant();
    window.location.href = '/survey';
  };

  return (
    <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="bg-[#FFF8E8] border border-[#109A9B]/35 rounded-full shadow-[0_12px_40px_rgba(11,31,42,0.15)] px-3 sm:px-8 h-[60px] sm:h-[80px] flex items-center justify-between gap-1.5 sm:gap-2 relative z-50">

        {/* Brand Logo with Responsive Scaling */}
        <Link to="/" className="flex items-center group shrink-0">
          <img
            src="/logo.png"
            alt="Gen Z Voices Logo"
            className="h-10 sm:h-[64px] md:h-[70px] max-h-[48px] sm:max-h-[68px] md:max-h-[72px] w-auto max-w-[160px] xs:max-w-[200px] sm:max-w-[320px] md:max-w-[360px] object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-2 lg:gap-4 font-inter text-sm font-semibold text-[#0B1F2A]">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            const active = isActive(link.path);

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 lg:px-5 py-2 rounded-full transition-all duration-200 flex items-center gap-2 text-sm ${
                  active
                    ? 'text-[#0B1F2A] bg-[#109A9B]/15 font-bold shadow-xs'
                    : 'text-[#53656A] hover:text-[#0B1F2A] hover:bg-[#109A9B]/10'
                }`}
              >
                {IconComponent && (
                  <IconComponent className={`w-4 h-4 ${active ? 'text-[#109A9B]' : 'text-[#53656A]'}`} />
                )}
                <span className="tracking-tight">{link.name}</span>
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-[3px] bg-[#109A9B] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls: Admin Login, Logout (if logged in) & Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 shrink-0 font-inter">
          {/* Icon-Only Admin Login Button */}
          <Link
            to="/admin/login"
            className="w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] rounded-full bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-bold border border-[#063E46] shadow-sm transition-all cursor-pointer flex items-center justify-center shrink-0 hover:scale-105 active:scale-95"
            title="Admin Portal Login"
            aria-label="Admin Portal Login"
          >
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#FDE7B5] shrink-0" />
          </Link>

          {/* Icon-Only Logout Button */}
          {participantName && (
            <button
              onClick={handleLogout}
              className="w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/90 transition-all shadow-2xs flex items-center justify-center cursor-pointer shrink-0 hover:scale-105 active:scale-95"
              title={`Logout (${participantName})`}
              aria-label="Logout session"
            >
              <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-600 shrink-0" />
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-full text-[#0B1F2A] hover:bg-[#109A9B]/15 transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Dimmed Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-[#0B1F2A]/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative z-50 md:hidden mt-2 bg-[#FFF8E8] border border-[#109A9B]/35 rounded-3xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(11,31,42,0.3)] flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-2xl font-bold text-base flex items-center gap-3 transition-colors ${
                    active
                      ? 'bg-[#109A9B]/20 text-[#0B1F2A]'
                      : 'text-[#53656A] hover:bg-[#109A9B]/10 hover:text-[#0B1F2A]'
                  }`}
                >
                  {IconComponent && <IconComponent className="w-5 h-5 text-[#109A9B] shrink-0" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-2xl font-bold text-base bg-[#063E46] text-[#FFF8E8] flex items-center gap-3 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-5 h-5 text-[#FDE7B5] shrink-0" />
              <span>Admin Portal Login</span>
            </Link>

            {participantName && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="mt-1 w-full px-4 py-3 rounded-2xl font-bold text-sm bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Logout ({participantName})</span>
              </button>
            )}
          </div>
        </>
      )}
    </header>
  );
}
