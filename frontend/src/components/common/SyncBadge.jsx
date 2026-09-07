import React from 'react';
import { useSurveyStore } from '../../stores/surveyStore';
import { CheckCircle2, RefreshCw, HardDrive, AlertCircle } from 'lucide-react';

export default function SyncBadge() {
  const syncStatus = useSurveyStore((state) => state.syncStatus);

  const configs = {
    synced: {
      label: 'All changes saved',
      bg: 'bg-[rgba(16,154,155,0.08)] text-[#063E46] border-[rgba(16,154,155,0.25)]',
      icon: CheckCircle2,
    },
    saving_local: {
      label: 'Saving locally...',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: HardDrive,
    },
    syncing: {
      label: 'Syncing cloud...',
      bg: 'bg-teal-50 text-[#075D63] border-[#109A9B]/30',
      icon: RefreshCw,
      animate: true,
    },
    offline: {
      label: 'Offline (Saved on device)',
      bg: 'bg-slate-50 text-[#10242C] border-slate-200',
      icon: AlertCircle,
    },
  };

  const current = configs[syncStatus] || configs.synced;
  const Icon = current.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${current.bg} transition-all duration-300 shadow-2xs`}
    >
      <Icon className={`w-3.5 h-3.5 ${current.animate ? 'animate-spin' : ''}`} />
      <span>{current.label}</span>
    </div>
  );
}

