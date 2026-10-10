import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Bookmark,
  User,
  Shield,
  LogOut,
  LogIn,
  Menu,
  X,
  Layers,
  MapPin,
  Send,
  CheckCircle2,
  ClipboardCheck,
  Building2,
  Home,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';

type Tab =
  | 'home'
  | 'explore'
  | 'categories'
  | 'saved'
  | 'dashboard'
  | 'admin'
  | 'applied'
  | 'accepted'
  | 'reviewed';

interface NavbarProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
  onOpenAuth: (initialTab?: 'signin' | 'signup', role?: 'job_seeker' | 'employer') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { profile, signOut } = useAuth();
  const { savedJobIds } = useJobs();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = profile?.role ?? null;
  const isEmployer = role === 'employer';
  const isSeeker = role === 'job_seeker';
  const isAdminUser = role === 'admin';

  const handleNav = (tab: Tab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const roleLabel = isEmployer ? 'Employer' : isAdminUser ? 'Admin' : 'Job Seeker';
  const roleChipCls = isEmployer
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    : isAdminUser
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';

  type Item = { tab: Tab; label: string; icon: React.ElementType; badge?: number };

  const items: Item[] = [{ tab: 'home', label: isEmployer ? 'Dashboard' : 'Home', icon: Home }];
  if (!isEmployer) {
    items.push({ tab: 'explore', label: 'Explore Jobs', icon: Search });
    items.push({ tab: 'categories', label: 'Categories', icon: Layers });
    items.push({ tab: 'saved', label: 'Saved Jobs', icon: Bookmark, badge: savedJobIds.length });
  }
  if (isSeeker) {
    items.push({ tab: 'applied', label: 'Applied Jobs', icon: Send });
    items.push({ tab: 'accepted', label: 'Accepted Jobs', icon: CheckCircle2 });
    items.push({ tab: 'dashboard', label: 'My Profile', icon: User });
  }
  if (isEmployer) {
    items.push({ tab: 'reviewed', label: 'Reviewed Jobs', icon: ClipboardCheck });
  }
  if (isAdminUser) {
    items.push({ tab: 'admin', label: 'Admin Panel', icon: Shield });
  }

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div onClick={() => handleNav('home')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition">
                Work<span className="text-indigo-500">Connect</span>
              </span>
              <p className="text-[11px] text-slate-400 hidden sm:block">Local jobs, simply connected</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {items.map((it) => {
              const Icon = it.icon;
              const active = currentTab === it.tab;
              return (
                <button
                  key={it.tab}
                  onClick={() => handleNav(it.tab)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    active ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {it.label}
                  {it.badge ? (
                    <span className="ml-1 text-xs px-1.5 rounded-full bg-indigo-500 text-white font-semibold">
                      {it.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {profile ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1.5 pr-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-200 leading-tight truncate max-w-[120px]">
                    {profile.fullName}
                  </p>
                  <span className={`text-[10px] px-1.5 rounded border ${roleChipCls}`}>{roleLabel}</span>
                </div>
                <button
                  onClick={signOut}
                  title="Sign Out"
                  className="ml-2 text-slate-400 hover:text-rose-400 p-1 rounded-md transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('signin', 'employer')}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4" />
                  For Employers
                </button>
                <button
                  onClick={() => onOpenAuth('signin', 'job_seeker')}
                  className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('signup', 'job_seeker')}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          {items.map((it) => {
            const Icon = it.icon;
            const active = currentTab === it.tab;
            return (
              <button
                key={it.tab}
                onClick={() => handleNav(it.tab)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                  active ? 'bg-slate-800 text-white' : 'text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" /> {it.label}
                </span>
                {it.badge ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500 text-white font-semibold">
                    {it.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800/80">
            {profile ? (
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-white">{profile.fullName}</p>
                  <span className={`text-[10px] px-1.5 rounded border ${roleChipCls}`}>{roleLabel}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="px-3 py-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signin', 'employer');
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 rounded-lg flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" /> For Employers (Post a Job)
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('signin', 'job_seeker');
                    }}
                    className="w-full py-2.5 text-center text-sm font-medium bg-slate-800 text-slate-200 rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('signup', 'job_seeker');
                    }}
                    className="w-full py-2.5 text-center text-sm font-medium bg-indigo-600 text-white rounded-lg"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
