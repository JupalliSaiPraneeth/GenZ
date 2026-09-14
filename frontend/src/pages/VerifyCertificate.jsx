import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, Search, CheckCircle2, AlertCircle, Award, ArrowLeft } from 'lucide-react';
import { fetchParticipantStatus } from '../services/supabaseClient';
import { adminDataService } from '../services/adminDataService';

export default function VerifyCertificate() {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) return;

    setIsSearching(true);

    try {
      const participant = await adminDataService.verifyCertificateCode(cleanCode);

      if (participant) {
        setResult({
          valid: true,
          code: participant.certificateId || cleanCode,
          recipient: participant.name || 'Gen Z Participant',
          issuedAt: participant.completedAtFormatted || participant.submittedAt || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          type: 'Official Certificate of Participation',
          issuer: 'Gen Z Voices National Survey Committee',
          supportedBy: 'NRI University & Gen Z Research Initiative',
        });
      } else {
        setResult({
          valid: false,
          message: `No authentic certificate record found for ID "${cleanCode}". Please check the certificate code.`,
        });
      }
    } catch (err) {
      console.warn('Certificate lookup notice:', err);
      setResult({
        valid: false,
        message: 'Unable to connect to registry. Please try again.',
      });
    }

    setIsSearching(false);
  };

  useEffect(() => {
    if (initialCode) {
      handleVerify();
    }
  }, [initialCode]);

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F0] overflow-x-hidden font-inter">

      {/* TOP TEAL 50% / BOTTOM CREAM 50% DUAL COLOR SPLIT BACKGROUND */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[#109A9B] to-[#075D63] z-0 overflow-hidden" />
      <div className="absolute top-[50vh] left-0 right-0 h-[2px] bg-[#FAF7F0]/40 z-0 pointer-events-none" />

      <div className="relative z-10 pt-[85px] sm:pt-[110px] pb-16 px-3.5 sm:px-6 max-w-2xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white/15 text-[#FFF8E8] flex items-center justify-center mx-auto border border-white/25 shadow-md backdrop-blur-xs">
            <ShieldCheck className="w-8 h-8 text-[#FFF8E8]" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#FFF8E8] tracking-tight drop-shadow-xs">
            Verify Certificate Authenticity
          </h1>
          <p className="text-[#FFF8E8]/90 text-xs sm:text-sm font-medium max-w-md mx-auto leading-relaxed">
            Enter a Gen Z Voices certificate verification code to validate official research records.
          </p>
        </div>

        {/* SEARCH FORM */}
        <form onSubmit={handleVerify} className="bg-white p-4 sm:p-5 rounded-3xl border border-[#109A9B]/20 shadow-xl flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#53656A] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. CERT-GZ2026-40244"
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-[#075D63] font-mono text-sm font-bold text-[#10242C] bg-slate-50 focus:bg-white transition-all uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="bg-[#075D63] hover:bg-[#063E46] text-[#FFF8E8] font-bold py-3 px-7 rounded-2xl text-sm transition-all shadow-md active:scale-98 cursor-pointer w-full sm:w-auto"
          >
            {isSearching ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        {/* VERIFICATION RESULT CARD */}
        {result && (
          <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#109A9B]/20 shadow-xl font-inter animate-in fade-in zoom-in-95">
            {result.valid ? (
              <div className="space-y-5">
                {/* VALID BADGE */}
                <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-extrabold">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <span className="text-base sm:text-lg font-heading">Authentic Certificate Verified</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-mono font-bold border border-emerald-300">
                    VERIFIED
                  </span>
                </div>

                {/* DETAILS GRID */}
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-[#53656A] font-semibold">Verification Code</span>
                    <span className="font-mono font-bold text-[#075D63] bg-[#EAF6F6] px-2.5 py-0.5 rounded-lg border border-[#109A9B]/20">{result.code}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-[#53656A] font-semibold">Certificate Recipient</span>
                    <span className="font-extrabold text-[#10242C] text-sm">{result.recipient}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-[#53656A] font-semibold">Issuer</span>
                    <span className="font-bold text-[#10242C]">{result.issuer}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-[#53656A] font-semibold">Issued Date</span>
                    <span className="font-medium text-[#10242C]">{result.issuedAt}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-[#53656A] font-semibold">Academic Support</span>
                    <span className="font-semibold text-[#075D63]">{result.supportedBy}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#53656A] font-semibold">Certificate Type</span>
                    <span className="font-extrabold text-emerald-800">{result.type}</span>
                  </div>
                </div>

                <div className="pt-2 text-center border-t border-slate-100">
                  <Link to="/survey-complete" className="text-xs font-bold text-[#075D63] hover:underline inline-flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#109A9B]" />
                    <span>View Your Certificate</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-900 font-semibold flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{result.message}</span>
              </div>
            )}
          </div>
        )}

        <div className="text-center pt-2">
          <Link to="/" className="text-xs font-bold text-[#075D63] hover:underline inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home Page</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
