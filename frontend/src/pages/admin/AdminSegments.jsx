import React from 'react';
import { UserCheck, Sparkles, TrendingUp, Shield, Wallet, Globe, Users, Laptop, Heart } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const PERSONAS = [
  {
    id: 'growth-explorer',
    title: 'Growth Explorer',
    share: '28% of Population',
    icon: TrendingUp,
    color: '#075D63',
    traits: ['High career ambition', 'Entrepreneurial orientation', 'Calculated risk tolerance', 'AI adaptability'],
    description: 'Highly ambitious respondents who prioritize career acceleration, skill mastery, startup ventures, and calculated risk-taking.',
  },
  {
    id: 'financial-builder',
    title: 'Financial Builder',
    share: '24% of Population',
    icon: Wallet,
    color: '#059669',
    traits: ['Early saving discipline', 'Multiple income streams', 'Financial literacy', 'Investments focus'],
    description: 'Respondents driven by early financial independence, passive income avenues, smart budgeting, and long-term wealth creation.',
  },
  {
    id: 'security-seeker',
    title: 'Security Seeker',
    share: '18% of Population',
    icon: Shield,
    color: '#64748B',
    traits: ['Job stability preference', 'Government sector interest', 'Predictable growth', 'Work-life balance'],
    description: 'Individuals valuing long-term job security, pension benefits, work-life equilibrium, and structured corporate/govt career paths.',
  },
  {
    id: 'digital-native',
    title: 'Digital Native',
    share: '15% of Population',
    icon: Laptop,
    color: '#3B82F6',
    traits: ['AI workflow integration', 'Digital privacy awareness', 'Screen immersion', 'Tech adaptability'],
    description: 'Power users of artificial intelligence, social media platforms, and digital tools with high awareness of data privacy.',
  },
  {
    id: 'global-explorer',
    title: 'Global Explorer',
    share: '9% of Population',
    icon: Globe,
    color: '#F59E0B',
    traits: ['Migration intention', 'Travel openness', 'International work goals', 'Cross-cultural interest'],
    description: 'Respondents actively exploring international education, global settlement, and abroad work opportunities.',
  },
  {
    id: 'conscious-citizen',
    title: 'Conscious Citizen',
    share: '6% of Population',
    icon: Heart,
    color: '#EC4899',
    traits: ['Sustainability orientation', 'Social responsibility', 'Community volunteering', 'Ethical consumption'],
    description: 'Socially engaged individuals who emphasize climate sustainability, community volunteering, and identity-driven ethics.',
  },
];

export default function AdminSegments() {
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
        {PERSONAS.map((p) => {
          const Icon = p.icon;
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
