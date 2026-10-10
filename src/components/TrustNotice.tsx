import React from 'react';
import { ShieldCheck, AlertCircle, FileCheck2, HelpCircle } from 'lucide-react';

export const TrustNotice: React.FC = () => {
  return (
    <section className="py-12 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-2xl">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Trust, Transparency & Candidate Safety
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  WorkConnect curates vacancies published by verified local employers, official career boards, and community portals. We never ask for interview fees, registration charges, or banking details.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-2">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <FileCheck2 className="w-3.5 h-3.5" /> Date-stamped verification
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5" /> Zero candidate charges
                  </span>
                  <span className="flex items-center gap-1 text-indigo-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> Direct external attribution
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-xs text-slate-300 max-w-xs">
                <span className="font-semibold text-white block mb-1">Found a suspicious listing?</span>
                <span className="text-[11px] text-slate-400">
                  Platform administrators promptly review and deactivate expired or fraudulent vacancy links.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
