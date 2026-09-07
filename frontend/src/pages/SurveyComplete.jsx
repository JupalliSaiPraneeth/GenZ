import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

export default function SurveyComplete() {
  const [participateChoice, setParticipateChoice] = useState('yes'); // 'yes' | 'no'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [certCode, setCertCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (participateChoice === 'yes') {
      const code = `GZ2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setCertCode(code);
    }
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 max-w-3xl mx-auto text-center space-y-8 bg-[#FFF8E8]">

      {/* Header Trophy Badge */}
      <div className="w-20 h-20 rounded-3xl bg-[#075D63] text-[#FDE7B5] flex items-center justify-center mx-auto shadow-lg shadow-teal-900/10 font-bold text-3xl">
        🏆
      </div>

      <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#10242C] tracking-tight">
        Thank You for Completing the Survey!
      </h1>
      <p className="text-[#53656A] text-base sm:text-lg max-w-xl mx-auto font-medium">
        Your answers have been securely recorded. Your perspective contributes directly to national research intelligence for Generation Z in India.
      </p>

      {/* OPTIONAL CERTIFICATE & LUCKY DRAW SECTION */}
      {!isSubmitted ? (
        <div className="bg-white rounded-3xl p-8 border border-[#109A9B]/20 shadow-xl text-left max-w-xl mx-auto space-y-6">

          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#109A9B] font-mono">OPTIONAL STEP</span>
            <h3 className="font-heading font-bold text-xl text-[#10242C] mt-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#075D63]" />
              Certificate of Appreciation & Lucky Draw
            </h3>
            <p className="text-xs text-[#53656A] mt-1 font-medium">
              Would you like to receive an official Certificate of Appreciation and participate in the monthly Lucky Draw?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Yes / No Choice */}
            <div className="space-y-3">
              <label
                onClick={() => setParticipateChoice('yes')}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${participateChoice === 'yes' ? 'border-[#075D63] bg-[#EAF6F6]' : 'border-slate-200 bg-white'
                  }`}
              >
                <input
                  type="radio"
                  name="participate"
                  checked={participateChoice === 'yes'}
                  onChange={() => setParticipateChoice('yes')}
                  className="mt-1 text-[#075D63] focus:ring-[#075D63]"
                />
                <div>
                  <span className="font-bold text-sm text-[#10242C] block">
                    Yes — I would like to receive the certificate and enter the Lucky Draw.
                  </span>
                  <span className="text-xs text-[#53656A] font-medium">Issued instantly upon providing your details below.</span>
                </div>
              </label>

              <label
                onClick={() => setParticipateChoice('no')}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${participateChoice === 'no' ? 'border-[#075D63] bg-[#EAF6F6]' : 'border-slate-200 bg-white'
                  }`}
              >
                <input
                  type="radio"
                  name="participate"
                  checked={participateChoice === 'no'}
                  onChange={() => setParticipateChoice('no')}
                  className="mt-1 text-[#075D63] focus:ring-[#075D63]"
                />
                <div>
                  <span className="font-bold text-sm text-[#10242C] block">
                    No — I do not wish to participate.
                  </span>
                  <span className="text-xs text-[#53656A] font-medium">Submit survey responses completely anonymously without certificate.</span>
                </div>
              </label>
            </div>

            {/* Email & Name input if Yes */}
            {participateChoice === 'yes' && (
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10242C] mb-1">Full Name (For Certificate)</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#075D63] text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10242C] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ananya@example.com"
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#075D63] text-sm font-semibold"
                  />
                </div>
              </div>
            )}

            <button type="submit" className="bg-[#075D63] hover:bg-[#063E46] text-[#FFF8E8] font-bold w-full py-4 rounded-2xl shadow-md transition-all">
              <span>{participateChoice === 'yes' ? 'Issue Certificate & Finish →' : 'Complete Anonymous Submission →'}</span>
            </button>
          </form>

        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-[#109A9B]/20 shadow-xl text-left max-w-xl mx-auto space-y-6">
          {participateChoice === 'yes' ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs text-[#53656A] font-mono">VERIFICATION CODE</span>
                  <h3 className="font-mono font-bold text-lg text-[#075D63]">{certCode}</h3>
                </div>
                <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                  Verified
                </span>
              </div>

              <div className="p-6 bg-[#FFF8E8] rounded-2xl border border-[#109A9B]/20 text-center space-y-2">
                <Award className="w-12 h-12 text-[#075D63] mx-auto" />
                <h4 className="font-heading font-bold text-lg text-[#10242C]">Certificate of Appreciation</h4>
                <p className="text-xs text-[#53656A]">Issued to <strong className="text-[#10242C]">{name}</strong> ({email}) for contribution to Gen Z Research 2026.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/verify-certificate?code=${certCode}`}
                  className="bg-white border border-[#075D63]/40 text-[#10242C] font-bold text-sm flex-1 py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#FFF8E8]"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verify Certificate</span>
                </Link>
                <button
                  onClick={() => alert(`Certificate ${certCode} downloaded for ${name}!`)}
                  className="bg-[#075D63] hover:bg-[#063E46] text-[#FFF8E8] font-bold text-sm flex-1 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="font-heading font-bold text-2xl text-[#10242C]">Anonymous Submission Confirmed</h3>
              <p className="text-xs text-[#53656A] max-w-md mx-auto font-medium">
                Your responses have been recorded without personal identifying information. Thank you for your contribution to Gen Z research.
              </p>
              <Link to="/" className="bg-[#075D63] hover:bg-[#063E46] text-[#FFF8E8] font-bold text-sm px-6 py-3 rounded-full inline-flex">
                <span>Return to Home</span>
              </Link>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
