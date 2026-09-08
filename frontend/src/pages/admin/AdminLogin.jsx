import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, User, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { adminAuthService } from '../../services/adminAuthService';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await adminAuthService.login(username, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.error || 'Authentication failed.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F0] flex flex-col justify-center items-center p-4 font-inter text-[#10242C]">
      {/* BACKGROUND ATMOSPHERE GRADIENTS */}
      <div className="absolute top-0 left-0 right-0 h-[45vh] bg-gradient-to-b from-[#109A9B] via-[#075D63] to-[#063E46] z-0 overflow-hidden" />
      <div className="absolute top-10 -left-20 w-96 h-96 rounded-full bg-[#109A9B]/20 blur-3xl pointer-events-none z-0" />

      {/* LOGIN CARD */}
      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#109A9B]/25 shadow-2xl space-y-6">
        {/* BRAND HEADER */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#063E46] text-[#FFF8E8] border-2 border-[#109A9B] mx-auto flex items-center justify-center shadow-lg transform rotate-[-3deg]">
            <Shield className="w-7 h-7 text-[#FDE7B5]" />
          </div>

          <h2 className="font-heading font-extrabold text-2xl text-[#10242C] tracking-tight">
            Gen Z Voices Admin Portal
          </h2>
          <p className="text-xs text-[#53656A] font-semibold">
            Secure Administrator Authentication & Analytics Intelligence
          </p>
        </div>

        {/* ERROR ALERT */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#063E46]">
              Admin Username
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#109A9B] focus:ring-4 focus:ring-[#109A9B]/15 outline-none font-bold text-sm text-[#10242C] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#063E46]">
              Admin Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full pl-10 pr-11 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#109A9B] focus:ring-4 focus:ring-[#109A9B]/15 outline-none font-bold text-sm text-[#10242C] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 absolute right-2 text-slate-400 hover:text-[#075D63] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* CREDENTIAL HINT PILL */}
          <div className="bg-[#EAF6F6] p-3 rounded-2xl border border-[#109A9B]/20 text-[11px] text-[#075D63] flex items-center justify-between font-semibold">
            <span>Dev Credentials: <strong className="font-mono text-[#063E46]">admin / admin123</strong></span>
            <CheckCircle2 className="w-4 h-4 text-[#109A9B] shrink-0" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-bold text-sm rounded-2xl shadow-lg shadow-teal-950/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating Admin...</span>
            ) : (
              <>
                <span>Login to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#FDE7B5]" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-[#53656A] font-medium">
          Protected Administrative Portal • Single Admin Role
        </div>
      </div>
    </div>
  );
}
