import React from 'react';
import { ExternalLink, ShieldAlert, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { Job } from '../types';

interface ExternalRedirectModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExternalRedirectModal: React.FC<ExternalRedirectModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !job) return null;

  const handleProceed = () => {
    window.open(job.originalUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <ExternalLink className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">External Listing Notice</h3>
            <p className="text-xs text-slate-400">Leaving WorkConnect to view original vacancy</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
            <div>
              <span className="text-slate-400">Target Role:</span>{' '}
              <span className="font-semibold text-white">{job.title}</span>
            </div>
            <div>
              <span className="text-slate-400">Employer:</span>{' '}
              <span className="font-semibold text-white">{job.employerName}</span>
            </div>
            <div>
              <span className="text-slate-400">Source:</span>{' '}
              <span className="font-semibold text-indigo-400">{job.sourceName || 'Direct Portal'}</span>
            </div>
            <div>
              <span className="text-slate-400">Destination URL:</span>{' '}
              <span className="font-mono text-[11px] text-slate-300 break-all">{job.originalUrl}</span>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-2.5 text-amber-300">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
            <div className="space-y-1">
              <p className="font-bold">Applicant Safety Advisory</p>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                WorkConnect indexes public job openings. Never pay registration fees, security deposits, or uniform charges for any job application. Verify credentials before sharing confidential documents.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition"
          >
            Stay on WorkConnect
          </button>
          <button
            onClick={handleProceed}
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20"
          >
            <span>Proceed to Original</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
