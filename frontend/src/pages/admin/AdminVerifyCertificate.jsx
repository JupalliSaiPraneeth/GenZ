import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Search, CheckCircle2, AlertCircle, Award, FileCheck2, User, Calendar, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchParticipantStatus } from '../../services/supabaseClient';
import { adminDataService } from '../../services/adminDataService';

export default function AdminVerifyCertificate() {
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
      const participantData = await adminDataService.verifyCertificateCode(cleanCode);

      if (participantData) {
        setResult({
          valid: true,
          code: participantData.certificateId || cleanCode,
          recipient: participantData.name || 'Gen Z Participant',
          email: participantData.email || 'Registered Participant',
          status: participantData.certificateStatus === 'issued' ? 'Issued & Authentic' : (participantData.certificateStatus || 'Issued & Authentic'),
          issuedAt: participantData.completedAtFormatted || participantData.submittedAt || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          type: 'Official Certificate of Participation',
          issuer: 'Gen Z Voices National Survey Committee',
          supportedBy: 'NRI University & Gen Z Research Initiative',
          participantDetails: participantData,
        });
      } else {
        setResult({
          valid: false,
          message: `No authentic certificate record found for ID "${cleanCode}".`,
        });
      }
    } catch (err) {
      console.warn('Admin certificate lookup notice:', err);
      setResult({
        valid: false,
        message: 'Error verifying certificate against central registry database.',
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
    <AdminLayout title="Certificate Verification">
      <div className="space-y-6 max-w-4xl mx-auto font-inter">

        {/* PAGE HEADER */}
        <div className="bg-[#FFFDF9] p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#075D63]" />
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#10242C]">
                Admin Certificate Registry Lookup
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#53656A] font-medium leading-relaxed">
              Verify official Gen Z survey completion certificates by entering the participant certificate ID.
            </p>
          </div>

          <span className="px-3.5 py-1.5 bg-[#EAF6F6] text-[#075D63] text-xs font-mono font-extrabold rounded-full border border-[#109A9B]/20 shrink-0">
            ADMIN VERIFIER
          </span>
        </div>

        {/* SEARCH FORM CARD */}
        <div className="bg-[#FFFDF9] p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-3">
          <label className="text-xs font-extrabold text-[#063E46] uppercase tracking-wider font-mono block">
            Enter Certificate Verification Code / ID
          </label>
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
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
              className="bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-bold py-3 px-8 rounded-2xl text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FDE7B5]" />
                  <span>Checking Registry...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#FDE7B5]" />
                  <span>Verify Authenticity</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* VERIFICATION RESULT DISPLAY */}
        {result && (
          <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#109A9B]/25 shadow-xl font-inter animate-in fade-in zoom-in-95 space-y-6">
            {result.valid ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
                  <div className="flex items-center gap-3 text-emerald-800 font-extrabold">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                    <div>
                      <h3 className="text-lg font-heading">Official Authentic Record Confirmed</h3>
                      <p className="text-xs text-emerald-700 font-normal">Validated against Gen Z Voices Central Database</p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-900 rounded-full text-xs font-mono font-extrabold border border-emerald-300">
                    ✓ VALID RECORD
                  </span>
                </div>

                {/* DETAILS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#53656A] font-extrabold block">
                      Certificate Code
                    </span>
                    <span className="font-mono font-bold text-[#075D63] text-sm block">
                      {result.code}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#53656A] font-extrabold block">
                      Recipient Name
                    </span>
                    <span className="font-extrabold text-[#10242C] text-sm block">
                      {result.recipient}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#53656A] font-extrabold block">
                      Registered Email
                    </span>
                    <span className="font-bold text-[#10242C] text-sm block truncate">
                      {result.email}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#53656A] font-extrabold block">
                      Issue Date
                    </span>
                    <span className="font-semibold text-[#10242C] text-sm block">
                      {result.issuedAt}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#53656A] font-extrabold block">
                      Issuer Authority
                    </span>
                    <span className="font-bold text-[#063E46] text-sm block">
                      {result.issuer}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#53656A] font-extrabold block">
                      Academic Institution Partner
                    </span>
                    <span className="font-bold text-[#075D63] text-sm block">
                      {result.supportedBy}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-900 font-semibold flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <span className="font-bold text-sm block">Verification Failed</span>
                  <p className="font-medium text-red-800">{result.message}</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
