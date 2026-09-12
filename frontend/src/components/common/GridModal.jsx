import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X, ShieldAlert } from 'lucide-react';

export default function GridModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Notification',
  message = '',
  type = 'info', // 'info' | 'success' | 'warning' | 'error' | 'confirm'
  confirmText = 'OK',
  cancelText = 'Cancel',
}) {
  if (!isOpen) return null;

  const isConfirmType = type === 'confirm' || Boolean(onConfirm);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'warning':
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'confirm':
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      default:
        return <Info className="w-5 h-5 text-[#109A9B]" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200';
      case 'warning':
      case 'error':
        return 'bg-rose-50 border-rose-200';
      case 'confirm':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-[#EAF6F6] border-[#109A9B]/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl max-w-sm sm:max-w-md w-full animate-in fade-in zoom-in-95 duration-150 space-y-4 text-left">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${getBgColor()}`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-extrabold text-base text-[#10242C]">
              {title}
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1 whitespace-pre-line">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className={`grid ${isConfirmType ? 'grid-cols-2' : 'grid-cols-1'} gap-3 pt-2`}>
          {isConfirmType && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className={`w-full py-2.5 px-4 font-bold text-xs rounded-xl cursor-pointer shadow-sm transition-all text-white ${
              type === 'error' || type === 'confirm'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#063E46] hover:bg-[#075D63]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
