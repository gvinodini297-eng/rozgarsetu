import React from 'react';
import { Bookmark, Search, ArrowRight, Trash2, ExternalLink } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { JobCard } from './JobCard';
import { Job } from '../types';

interface SavedJobsViewProps {
  onViewJob: (job: Job) => void;
  onApplyExternal: (job: Job) => void;
  onExplore: () => void;
}

export const SavedJobsView: React.FC<SavedJobsViewProps> = ({
  onViewJob,
  onApplyExternal,
  onExplore,
}) => {
  const { savedJobs, savedJobIds } = useJobs();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Personal Bookmarks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Saved Jobs
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Keep track of verified vacancies you intend to explore or apply for.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
              {savedJobIds.length} {savedJobIds.length === 1 ? 'Job Saved' : 'Jobs Saved'}
            </span>
            <button
              onClick={onExplore}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore More Jobs</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {savedJobs.length === 0 ? (
          <div className="py-20 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Bookmark className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">No saved jobs yet</h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                As you browse verified local opportunities, click the bookmark icon on any job card to save it here for later review.
              </p>
            </div>
            <button
              onClick={onExplore}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition inline-flex items-center gap-2"
            >
              <span>Discover Local Openings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Grid of saved job cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewDetails={onViewJob}
                onApplyExternal={onApplyExternal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
