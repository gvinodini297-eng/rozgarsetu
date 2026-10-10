import React from 'react';
import { UserCheck, Search, ExternalLink, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Create Your Profile',
      desc: 'Set your preferred locality (e.g. Hyderabad or Warangal) and choose industries you are interested in.',
      icon: UserCheck,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      num: '02',
      title: 'Discover Local Jobs',
      desc: 'Filter verified openings by category, work arrangement, job type, and salary disclosure.',
      icon: Search,
      color: 'from-indigo-500 to-purple-600',
    },
    {
      num: '03',
      title: 'View Listing & Apply',
      desc: 'Review verified requirements and jump directly to the legitimate employer portal or business listing.',
      icon: ExternalLink,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Simple 3-Step Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            How WorkConnect Works
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Eliminating scattered job hunting by bringing local opportunities to your fingertips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-800 font-mono">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/60 text-[11px] font-semibold text-indigo-400">
                  Step {idx + 1} of 3
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
