import React, { useState, useEffect } from 'react';
import { UserCheck, Sparkles, TrendingUp, Shield, Wallet, Globe, Users, Laptop, Heart } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminDataService } from '../../services/adminDataService';

const ICON_MAP = {
  'growth-explorer': TrendingUp,
  'financial-builder': Wallet,
  'security-seeker': Shield,
  'digital-native': Laptop,
  'global-explorer': Globe,
  'conscious-citizen': Heart,
};

export default function AdminSegments() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await adminDataService.getSegmentPersonas();
      setPersonas(res);
      setLoading(false);
    }
    loadData();
  }, []);
  return (
    <AdminLayout title="Analytical User Personas & Respondent Segments">
      <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-2">
        <div className="flex items-center gap-2 font-heading font-extrabold text-[#10242C] text-lg">
          <UserCheck className="w-5 h-5 text-[#109A9B]" />
          <span>Descriptive Analytical Personas Framework</span>
        </div>
        <p className="text-xs text-[#53656A] font-medium">
          Data-driven respondent clusters derived from 75-question response profiles. These represent descriptive analytical segments, not psychological diagnoses.
        </p>
      </div>

      {/* PERSONAS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {personas.map((p) => {
          const Icon = ICON_MAP[p.id] || TrendingUp;
          return (
            <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#EAF6F6] text-[#075D63] flex items-center justify-center border border-[#109A9B]/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-xs text-[#075D63] bg-[#EAF6F6] px-3 py-1 rounded-full border border-[#109A9B]/20">
                    {p.share}
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-lg text-[#10242C]">{p.title}</h3>
                <p className="text-xs text-[#53656A] leading-relaxed font-medium">{p.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#53656A] block">Key Segment Traits</span>
                <div className="flex flex-wrap gap-1.5">
                  {p.traits.map((t, idx) => (
                    <span key={idx} className="text-[11px] font-bold text-[#063E46] bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
