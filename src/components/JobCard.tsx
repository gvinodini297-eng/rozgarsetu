import React from 'react';
import {
  MapPin,
  Building2,
  Bookmark,
  Briefcase,
  AlertCircle,
  Eye,
  IndianRupee,
} from 'lucide-react';
import { Job } from '../types';
import { useJobs } from '../context/JobContext';

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  onApplyExternal: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  const { isJobSaved, toggleSaveJob } = useJobs();
  const saved = isJobSaved(job.id);

  const isExpired = job.status === 'expired';

  return (
    <div
      className={`group relative bg-slate-900/80 rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
        isExpired
          ? 'border-slate-800 opacity-75'
          : 'border-slate-800 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/20'
      }`}
    >
      <div>
        {/* Card Header: Demo badge and Save button */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Demo listing
            </span>

            {isExpired && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Expired
              </span>
            )}

            {job.isFeatured && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Featured
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveJob(job.id);
            }}
            title={saved ? 'Remove from saved' : 'Save job'}
            className={`p-2 rounded-xl transition-all ${
              saved
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title & Employer */}
        <div className="mb-3">
          <h3
            onClick={() => onViewDetails(job)}
            className="text-lg font-bold text-white group-hover:text-indigo-300 transition cursor-pointer line-clamp-1"
          >
            {job.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mt-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{job.employerName}</span>
          </div>
        </div>

        {/* Location & Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5 text-xs">
          <span className="inline-flex items-center gap-1 text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-750">
            <MapPin className="w-3 h-3 text-indigo-400" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-750">
            <Briefcase className="w-3 h-3 text-emerald-400" />
            {job.jobType}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-750">
            {job.workArrangement}
          </span>
          {job.experienceLevel && job.experienceLevel !== 'Any' && (
            <span className="text-slate-400 bg-slate-850 px-2 py-1 rounded-lg text-[11px]">
              {job.experienceLevel}
            </span>
          )}
        </div>

        {/* Salary Indicator */}
        <div className="mb-3 flex items-center text-xs">
          {job.salaryDisclosed ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>{job.salaryDisplay}</span>
            </div>
          ) : (
            <div className="text-slate-500 italic bg-slate-850 px-2 py-0.5 rounded text-[11px]">
              Salary not provided
            </div>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80">
        <button
          onClick={() => onViewDetails(job)}
          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};
