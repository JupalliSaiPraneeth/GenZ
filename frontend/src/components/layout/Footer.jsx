import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Shield, Heart, Award, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const location = useLocation();

  // Hide footer on homepage as requested
  if (['/', '/about', '/categories'].includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="bg-[#075D63] text-[#FFF8E8] pt-16 pb-12 border-t border-[#063E46] relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#109A9B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FDE7B5]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img
                src="/logo.png"
                alt="Gen Z Voices Logo"
                className="h-13 sm:h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-[#FFF8E8]/90 text-sm leading-relaxed mb-4 font-medium">
              “Your Perspective. A Brighter Tomorrow.”
            </p>
            <p className="text-xs text-[#FFF8E8]/70">
              Transforming large-scale Gen Z research into an engaging digital experience.
            </p>
          </div>

          {/* Col 2: Research Navigation */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#FDE7B5] mb-4 uppercase tracking-wider text-xs">
              Research Dimensions
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FFF8E8]/90 font-medium">
              <li><Link to="/categories" className="hover:text-[#FDE7B5] transition-colors">Career & Skills</Link></li>
              <li><Link to="/categories" className="hover:text-[#FDE7B5] transition-colors">Technology & AI</Link></li>
              <li><Link to="/categories" className="hover:text-[#FDE7B5] transition-colors">Lifestyle & Health</Link></li>
              <li><Link to="/categories" className="hover:text-[#FDE7B5] transition-colors">Values & Society</Link></li>
              <li><Link to="/categories" className="hover:text-[#FDE7B5] transition-colors">Future Aspirations</Link></li>
            </ul>
          </div>

          {/* Col 3: Trust & Verification */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#FDE7B5] mb-4 uppercase tracking-wider text-xs">
              Platform & Trust
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FFF8E8]/90 font-medium">
              <li><Link to="/privacy" className="hover:text-[#FDE7B5] transition-colors flex items-center gap-1.5"><Shield className="w-4 h-4 text-[#FDE7B5]" /> Privacy Architecture</Link></li>
              <li><Link to="/verify-certificate" className="hover:text-[#FDE7B5] transition-colors flex items-center gap-1.5"><Award className="w-4 h-4 text-[#FDE7B5]" /> Verify Certificate</Link></li>
              <li><Link to="/admin" className="hover:text-[#FDE7B5] transition-colors flex items-center gap-1.5"><ArrowUpRight className="w-4 h-4 text-[#FFF8E8]/60" /> Researcher Portal</Link></li>
              <li><Link to="/analytics" className="hover:text-[#FDE7B5] transition-colors">Live Research Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform Guarantee */}
          <div className="bg-[#063E46]/60 p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-[#FDE7B5] mb-2 font-semibold text-sm">
              <Shield className="w-4 h-4" />
              <span>Research Integrity Guarantee</span>
            </div>
            <p className="text-xs text-[#FFF8E8]/80 leading-relaxed mb-3 font-medium">
              Participant identity records are decoupled from response datasets using cryptographic anonymization.
            </p>
            <div className="text-[11px] text-[#FFF8E8]/70 flex items-center gap-1">
              <span>Built with care for Gen Z in India</span>
              <Heart className="w-3 h-3 text-emerald-400 fill-emerald-400 inline" />
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 text-center text-xs text-[#FFF8E8]/70 flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
          <p>© {new Date().getFullYear()} Gen Z Voices Platform. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[#FFF8E8]/70">
            <span>Privacy First</span>
            <span>•</span>
            <span>207 Questions</span>
            <span>•</span>
            <span>Offline Resilient</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
