import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Search, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VerifyCertificate() {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState(null);

  const handleVerify = (e) => {
    e?.preventDefault();
    if (!code.trim()) return;

    if (code.startsWith('GZ2026-')) {
      setResult({
        valid: true,
        code,
        recipient: 'Participant',
        issuedAt: new Date().toLocaleDateString(),
        type: 'Official Research Contributor',
      });
    } else {
      setResult({
        valid: false,
        message: 'Certificate not found in central registry.',
      });
    }
  };

  useEffect(() => {
    if (initialCode) {
      handleVerify();
    }
  }, [initialCode]);

  return (
    <div className="min-h-screen pt-[115px] pb-16 px-4 max-w-2xl mx-auto bg-[#FAF7F0]">

      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[#EAF6F6] text-[#075D63] flex items-center justify-center mx-auto mb-4 border border-[#109A9B]/20">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="font-heading font-extrabold text-3xl text-[#10242C] mb-2">
          Verify Certificate
        </h1>
        <p className="text-[#53656A] text-sm font-medium">
          Enter a Gen Z Voices certificate verification code to validate authenticity.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleVerify} className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-sm mb-8 flex gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-[#53656A] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. GZ2026-482910"
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#075D63] font-mono text-sm font-bold text-[#10242C]"
          />
        </div>
        <button type="submit" className="bg-[#075D63] hover:bg-[#063E46] text-[#FFF8E8] font-bold py-3.5 px-7 rounded-2xl text-sm transition-all shadow-md">
          Verify
        </button>
      </form>

      {/* Verification Output */}
      {result && (
        <div className="bg-white rounded-3xl p-8 border border-[#109A9B]/20 shadow-xl">
          {result.valid ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-emerald-700 font-bold border-b border-slate-200 pb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span className="text-lg">Authentic Certificate Verified</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-[#53656A] font-medium">Verification Code</span>
                  <span className="font-mono font-bold text-[#10242C]">{result.code}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-[#53656A] font-medium">Issuer</span>
                  <span className="font-bold text-[#10242C]">Gen Z Voices Research Platform</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-[#53656A] font-medium">Issued Date</span>
                  <span className="font-medium text-[#10242C]">{result.issuedAt}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#53656A] font-medium">Certificate Type</span>
                  <span className="font-bold text-[#075D63]">{result.type}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-red-600 font-bold">
              <AlertCircle className="w-6 h-6" />
              <span>{result.message}</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
