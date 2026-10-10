import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, ChevronRight, Info, MapPin, Phone, MessageCircle, Lock } from 'lucide-react';
import { getRoleInfo } from '../lib/roleDemoData';
import { useAuth } from '../context/AuthContext';
import { useEmployerPosts, getContact } from '../lib/employerPosts';

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
  onOpenAuth?: (initialTab?: 'signin' | 'signup', role?: 'job_seeker' | 'employer') => void;
}

export const IndustryRolesView: React.FC<IndustryRolesViewProps> = ({
  industry,
  onBack,
  onOpenAuth,
}) => {
  const { profile } = useAuth();
  const { posts } = useEmployerPosts();

  const [selectedRole, setSelectedRole] = useState<string | null>(() => {
    try {
      return (window.history.state && window.history.state.popup) || null;
    } catch {
      return null;
    }
  });
  const [phones, setPhones] = useState<Record<string, string | null>>({});

  const Icon = industry.icon;
  const info = selectedRole ? getRoleInfo(selectedRole) : null;

  // Back button closes the popup instead of leaving the page
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      setSelectedRole((e.state && e.state.popup) || null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openRole = (role: string) => {
    setSelectedRole(role);
    try {
      window.history.pushState({ ...(window.history.state || {}), popup: role }, '');
    } catch {
      // ignore
    }
  };

  const closeRole = () => {
    if (window.history.state && window.history.state.popup) {
      window.history.back();
    } else {
      setSelectedRole(null);
    }
  };

  const postsFor = (role: string) =>
    posts.filter((p) => p.industryId === industry.id && p.role === role && p.status === 'active');

  const rolePosts = selectedRole ? postsFor(selectedRole) : [];
  const isSeeker = profile?.role === 'job_seeker';

  const showContact = async (postId: string) => {
    const phone = await getContact(postId);
    setPhones((prev) => ({ ...prev, [postId]: phone || '' }));
  };

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
        {industry.roles.map((role) => {
          const count = postsFor(role).length;
          return (
            <button
              key={role}
              onClick={() => openRole(role)}
              className="group flex items-center justify-between text-left bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 text-sm font-semibold text-white transition"
            >
              <span>
                {role}
                {count > 0 && (
                  <span className="block mt-1 text-[11px] font-medium text-emerald-400">
                    {count} employer {count === 1 ? 'post' : 'posts'}
                  </span>
                )}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition" />
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500">
        Prototype: role information is sample data. Employer posts are added by employers directly.
      </p>

      {selectedRole && info && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 sm:p-4"
          onClick={closeRole}
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
                <h2 className="text-xl font-extrabold text-white mt-2">{selectedRole}</h2>
                <p className="text-xs text-indigo-400 font-semibold mt-0.5">{industry.name}</p>
              </div>
              <button
                onClick={closeRole}
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

            {/* Employer posts for this role */}
            <div className="pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                Posted by employers ({rolePosts.length})
              </h3>

              {rolePosts.length === 0 ? (
                <p className="text-xs text-slate-500 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                  No employer has posted this role yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {rolePosts.map((p) => {
                    const phone = phones[p.id];
                    return (
                      <div
                        key={p.id}
                        className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-white">{p.businessName}</p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {p.area}, {p.city}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                              {p.jobType}
                            </span>
                            {p.isSample && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                                Sample
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <p className="text-slate-500">Salary</p>
                            <p className="text-white font-medium">{p.salary || 'Not mentioned'}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Openings</p>
                            <p className="text-white font-medium">{p.openings}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {p.skills.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        {p.description && (
                          <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>
                        )}

                        {/* Contact */}
                        {phone ? (
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={`tel:+91${phone}`}
                              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5" /> Call {phone}
                            </a>
                            <a
                              href={`https://wa.me/91${phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
                            >
                              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                            </a>
                          </div>
                        ) : phone === '' ? (
                          <p className="text-xs text-rose-400">Contact not available.</p>
                        ) : isSeeker ? (
                          <button
                            onClick={() => showContact(p.id)}
                            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5" /> Show contact
                          </button>
                        ) : profile ? (
                          <p className="text-[11px] text-slate-500">
                            Contact is available to Job Seeker accounts.
                          </p>
                        ) : (
                          <button
                            onClick={() => onOpenAuth && onOpenAuth('signin', 'job_seeker')}
                            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
                          >
                            <Lock className="w-3.5 h-3.5" /> Sign in to contact
                          </button>
                        )}

                        <p className="text-[10px] text-slate-500">
                          Posted by the employer. Not verified by WorkConnect. Never pay money to get a job.
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                Role information above is sample data for the prototype. Real openings from
                other sources can be added later through authorized APIs.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
