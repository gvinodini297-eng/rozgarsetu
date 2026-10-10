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
  ClipboardList,
  CheckCircle2,
  ClipboardCheck,
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
  onOpenAuth: (initialTab?: 'signin' | 'signup') => void;
}

interface NavItem {
  tab: Tab;
  label: string;
  icon?: React.ElementType;
  badge?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { profile, isAdmin, signOut } = useAuth();
  const { savedJobIds } = useJobs();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: Tab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: NavItem[] = [
    { tab: 'home', label: 'Home' },
    { tab: 'explore', label: 'Explore Jobs', icon: Search },
    { tab: 'categories', label: 'Categories', icon: Layers },
    { tab: 'saved', label: 'Saved Jobs', icon: Bookmark, badge: savedJobIds.length },
  ];

  if (profile && !isAdmin) {
    navItems.push({ tab: 'applied', label: 'Applied Jobs', icon: ClipboardList });
    navItems.push({ tab: 'accepted', label: 'Accepted Jobs', icon: CheckCircle2 });
  }
  if (profile && isAdmin) {
    navItems.push({ tab: 'reviewed', label: 'Reviewed Jobs', icon: ClipboardCheck });
  }
  if (profile) {
    navItems.push({ tab: 'dashboard', label: 'My Profile', icon: User });
  }

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition">
                  Work<span className="text-indigo-500">Connect</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Local
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Multi-Industry Job Discovery</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleNav(item.tab)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                    currentTab === item.tab
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                  {item.label}
                  {item.badge ? (
                    <span className="ml-1 text-xs px-1.5 rounded-full bg-indigo-500 text-white font-semibold">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                  currentTab === 'admin'
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                    : 'text-amber-400 hover:bg-amber-500/10 border border-transparent'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-400" />
                Employer Panel
              </button>
            )}
          </nav>

          {/* User Auth Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {profile ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1.5 pr-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-200 leading-tight truncate max-w-[120px]">
                    {profile.fullName}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {isAdmin ? 'Employer' : 'Job Seeker'}
                  </p>
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
                  onClick={() => onOpenAuth('signin')}
                  className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
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

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.tab}
                onClick={() => handleNav(item.tab)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                  currentTab === item.tab ? 'bg-slate-800 text-white' : 'text-slate-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </span>
                {item.badge ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500 text-white font-semibold">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 text-amber-400 bg-amber-500/10 border border-amber-500/30"
            >
              <Shield className="w-4 h-4" /> Employer Panel
            </button>
          )}

          <div className="pt-3 border-t border-slate-800/80">
            {profile ? (
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-white">{profile.fullName}</p>
                  <p className="text-xs text-slate-400">
                    {isAdmin ? 'Employer' : 'Job Seeker'} · {profile.email}
                  </p>
                </div>
                <button
                  onClick={signOut}
                  className="px-3 py-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signin');
                  }}
                  className="w-full py-2.5 text-center text-sm font-medium bg-slate-800 text-slate-200 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="w-full py-2.5 text-center text-sm font-medium bg-indigo-600 text-white rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
