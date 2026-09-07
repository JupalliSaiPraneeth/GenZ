import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, ShieldCheck, Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { useSurveyStore } from '../../stores/surveyStore';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const participantName = useSurveyStore((state) => state.participantName);
  const logoutParticipant = useSurveyStore((state) => state.logoutParticipant);

  const navLinks = [
    { name: 'Home', path: '/' },
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
    <header className="fixed top-4 left-0 right-0 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="bg-[#FFF8E8] border border-[#109A9B]/35 rounded-full shadow-[0_12px_40px_rgba(11,31,42,0.15)] px-6 sm:px-8 h-[80px] flex items-center justify-between">

        {/* Brand Logo with Increased Height & Width Dimensions */}
        <Link to="/" className="flex items-center group shrink-0">
          <img
            src="/logo.png"
            alt="Gen Z Voices Logo"
            className="h-12 sm:h-[54px] max-h-[58px] w-[210px] sm:w-[260px] md:w-[300px] object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Center Desktop Navigation Links (Clean Alignment & Spacing in Inter font) */}
        <nav className="hidden md:flex items-center justify-center gap-2 lg:gap-4 font-inter text-sm font-semibold text-[#0B1F2A]">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            const active = isActive(link.path);

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-5 py-2 rounded-full transition-all duration-200 flex items-center gap-2 text-sm ${
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

        {/* Right Action Controls: Primary CTA & Logout */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-inter">
          {participantName && (
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors shadow-2xs cursor-pointer"
              title="Logout session"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Logout ({participantName.split(' ')[0]})</span>
            </button>
          )}

          <Link
            to="/survey"
            className="bg-gradient-to-r from-[#0D5960] to-[#063E46] hover:from-[#08484E] hover:to-[#042B31] text-[#FFF8E8] font-sora font-extrabold text-sm h-[44px] px-6 rounded-full shadow-md shadow-teal-950/20 hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
          >
            <span>Take Survey</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#0B1F2A] hover:bg-[#109A9B]/15 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-down Glass Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-[#FFF8E8]/95 backdrop-blur-2xl border border-[#109A9B]/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
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
                {IconComponent && <IconComponent className="w-5 h-5 text-[#109A9B]" />}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
