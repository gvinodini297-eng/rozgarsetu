import React, { useState } from 'react';
import { ArrowLeft, X, ChevronRight, Info } from 'lucide-react';
import { getRoleInfo } from '../lib/roleDemoData';

interface IndustryLike {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  roles: string[];
}

interface IndustryRolesViewProps {
  industry: IndustryLike;
  onBack: () => void;
}

export const IndustryRolesView: React.FC<IndustryRolesViewProps> = ({
  industry,
  onBack,
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const Icon = industry.icon;
  const info = selectedRole ? getRoleInfo(selectedRole) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all industries
      </button>

      <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {industry.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {industry.roles.length} job roles · Select a role to see job information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {industry.roles.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className="group flex items-center justify-between text-left bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 text-sm font-semibold text-white transition"
          >
            <span>{role}</span>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition" />
          </button>
        ))}
      </div>

      <p className="text-[11px] text-slate-500">
        Prototype: role discovery demo. Real vacancies can be integrated later through authorized APIs and permitted sources.
      </p>

      {selectedRole && info && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 sm:p-4"
          onClick={() => setSelectedRole(null)}
        >
          <div
            className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Demo information
                </span>
                <h2 className="text-xl font-extrabold text-white mt-2">
                  {selectedRole}
                </h2>
                <p className="text-xs text-indigo-400 font-semibold mt-0.5">
                  {industry.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedRole(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{info.summary}</p>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {info.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-500 mb-0.5">Qualification</p>
                <p className="text-white font-medium">{info.qualification}</p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-500 mb-0.5">Experience</p>
                <p className="text-white font-medium">{info.experience}</p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-500 mb-0.5">Salary (approx.)</p>
                <p className="text-white font-medium">{info.salary}</p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-500 mb-0.5">Job Type</p>
                <p className="text-white font-medium">{info.jobType}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                This is sample role information for the prototype, not a live
                vacancy. Real openings and application links can be added later
                through authorized APIs and permitted sources.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
