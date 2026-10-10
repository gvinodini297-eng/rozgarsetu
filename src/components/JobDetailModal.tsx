import React from 'react';
import {
  X,
  MapPin,
  Building2,
  Calendar,
  ExternalLink,
  Bookmark,
  CheckCircle,
  Briefcase,
  IndianRupee,
  Layers,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Job } from '../types';
import { useJobs } from '../context/JobContext';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyExternal: (job: Job) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onApplyExternal,
}) => {
  const { isJobSaved, toggleSaveJob } = useJobs();

  if (!isOpen || !job) return null;

  const saved = isJobSaved(job.id);
  const isExpired = job.status === 'expired';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Source: {job.sourceName || 'Verified Platform'}
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified on {job.lastVerifiedAt}
            </span>
            {job.expiryDate && (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                Expires: {job.expiryDate}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            {job.title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-300 font-medium mt-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span className="text-base font-semibold text-white">{job.employerName}</span>
          </div>
        </div>

        {/* Quick Meta Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-xs">
          <div className="bg-slate-800/70 border border-slate-750 rounded-xl p-3">
            <span className="text-slate-400 block mb-1">Location</span>
            <span className="font-semibold text-slate-200 flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              {job.location}
            </span>
          </div>

          <div className="bg-slate-800/70 border border-slate-750 rounded-xl p-3">
            <span className="text-slate-400 block mb-1">Job Type</span>
            <span className="font-semibold text-slate-200 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              {job.jobType}
            </span>
          </div>

          <div className="bg-slate-800/70 border border-slate-750 rounded-xl p-3">
            <span className="text-slate-400 block mb-1">Arrangement</span>
            <span className="font-semibold text-slate-200">
              {job.workArrangement}
            </span>
          </div>

          <div className="bg-slate-800/70 border border-slate-750 rounded-xl p-3">
            <span className="text-slate-400 block mb-1">Compensation</span>
            <span className="font-semibold text-emerald-400 truncate block">
              {job.salaryDisclosed ? job.salaryDisplay : 'Not provided'}
            </span>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-6 text-sm text-slate-300">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Job Overview
            </h4>
            <p className="leading-relaxed text-slate-200 whitespace-pre-line bg-slate-850/50 p-4 rounded-xl border border-slate-800">
              {job.description}
            </p>
          </div>

          {/* Key Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Key Requirements & Skills
              </h4>
              <ul className="space-y-2">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {job.qualifications && job.qualifications.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Qualifications & Eligibility
              </h4>
              <ul className="space-y-2">
                {job.qualifications.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits / Perks */}
          {job.perks && job.perks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Perks & Benefits Provided
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.perks.map((p, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Source Attribution Box */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-semibold text-white">Aggregated Source Information</p>
              <p className="text-slate-400 mt-0.5">
                Published via {job.sourceName || 'Direct Portal'}. Last checked on {job.lastVerifiedAt}.
              </p>
            </div>
            <a
              href={job.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>View Source Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={() => toggleSaveJob(job.id)}
            className={`py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              saved
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            <span>{saved ? 'Saved in Bookmarks' : 'Save Job'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onApplyExternal(job);
            }}
            disabled={isExpired}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${
              isExpired
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
            }`}
          >
            <span>Apply / View Original Listing</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
