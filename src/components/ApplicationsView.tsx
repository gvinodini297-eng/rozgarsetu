import React from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  Info,
  Inbox,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_APPLICATIONS, ApplicationStatus } from '../lib/demoApplications';

type Mode = 'applied' | 'accepted' | 'reviewed';

interface ApplicationsViewProps {
  mode: Mode;
  onBrowse: () => void;
}

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: 'bg-slate-700/40 text-slate-300 border-slate-600/60',
  'Under review': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

const TITLES: Record<Mode, { title: string; subtitle: string }> = {
  applied: {
    title: 'Applied Jobs',
    subtitle: 'Roles you have applied for and their current status.',
  },
  accepted: {
    title: 'Accepted Jobs',
    subtitle: 'Roles where the employer has accepted your application.',
  },
  reviewed: {
    title: 'Reviewed Applications',
    subtitle: 'Applications you have reviewed as an employer.',
  },
};

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ mode, onBrowse }) => {
  const { profile } = useAuth();

  const items = DEMO_APPLICATIONS.filter((a) => {
    if (mode === 'accepted') return a.status === 'Accepted';
    if (mode === 'reviewed') return a.status !== 'Applied';
    return true;
  });

  const { title, subtitle } = TITLES[mode];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
          Demo data
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {subtitle}
          {profile ? ` Signed in as ${profile.fullName}.` : ''}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">Nothing here yet.</p>
          <button
            onClick={onBrowse}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2"
          >
            Explore industries
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((a) => (
            <div
              key={a.id}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {mode === 'reviewed' ? a.applicantName : a.role}
                  </h3>
                  <p className="text-xs text-indigo-300 font-medium mt-0.5">
                    {mode === 'reviewed' ? `Applied for: ${a.role}` : a.industry}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${STATUS_STYLES[a.status]}`}
                >
                  {a.status}
                </span>
              </div>

              {mode === 'reviewed' ? (
                <>
                  <div className="flex flex-wrap gap-1.5">
                    {a.applicantSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[11px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="text-slate-500">Owner note: </span>
                    {a.ownerNote}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {a.company}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {a.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {a.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="text-slate-500">Employer note: </span>
                    {a.ownerNote}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <span>
          This page shows sample data to demonstrate the workflow. Real
          applications will be available when authorized job sources are
          integrated.
        </span>
      </div>
    </div>
  );
};
