import React, { useState, useMemo } from 'react';
import {
  User,
  MapPin,
  Layers,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Clock,
  ArrowRight,
  Edit3,
  Check,
  Search,
  Building2,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { JobCard } from './JobCard';
import { CategoryIcon } from './CategoryIcon';
import { Job } from '../types';

interface UserDashboardProps {
  onViewJob: (job: Job) => void;
  onApplyExternal: (job: Job) => void;
  onNavigateTab: (tab: 'explore' | 'saved' | 'categories') => void;
  onFilterCategory: (categoryId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onViewJob,
  onApplyExternal,
  onNavigateTab,
  onFilterCategory,
}) => {
  const { profile, updateProfile, isDemoMode } = useAuth();
  const { jobs, categories, savedJobIds } = useJobs();

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [preferredLocation, setPreferredLocation] = useState(profile?.preferredLocation || 'Hyderabad');
  const [preferredCategories, setPreferredCategories] = useState<string[]>(
    profile?.preferredCategories || []
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Calculate Profile Completion
  const profileCompletion = useMemo(() => {
    let score = 0;
    if (profile?.fullName) score += 25;
    if (profile?.email) score += 25;
    if (profile?.preferredLocation) score += 25;
    if (profile?.preferredCategories && profile.preferredCategories.length > 0) score += 25;
    return score;
  }, [profile]);

  // Recommended Jobs Logic (Explicit & Deterministic)
  const recommendedJobs = useMemo(() => {
    if (!profile) return [];
    const userCity = (profile.preferredLocation || 'Hyderabad').toLowerCase();
    const userCats = new Set(profile.preferredCategories || []);

    return jobs.filter((job) => {
      if (job.status !== 'active') return false;
      const cityMatch = job.city.toLowerCase() === userCity;
      const categoryMatch = userCats.has(job.categoryId);
      // Recommend if matching user's preferred location AND/OR selected categories
      return (cityMatch && categoryMatch) || (userCats.size === 0 && cityMatch) || categoryMatch;
    }).slice(0, 6);
  }, [jobs, profile]);

  const handleCategoryToggle = (catId: string) => {
    setPreferredCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess(false);

    const res = await updateProfile({
      fullName: fullName.trim(),
      preferredLocation: preferredLocation.trim(),
      preferredCategories,
    });

    if (res.error) {
      setSaveError(res.error);
    } else {
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to view your dashboard</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Access personalized local vacancies, track saved jobs, and customize your locality preferences.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Greeting Banner */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-xl shadow-indigo-500/20 flex-shrink-0">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Job Seeker Workspace</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome back, {profile.fullName}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  {profile.email} • Locality:{' '}
                  <span className="text-indigo-400 font-semibold">{profile.preferredLocation || 'Not specified'}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div
                onClick={() => onNavigateTab('saved')}
                className="flex-1 lg:flex-none bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 text-center cursor-pointer transition min-w-[120px]"
              >
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Saved</span>
                </div>
                <div className="text-2xl font-black text-white">{savedJobIds.length}</div>
                <div className="text-[10px] text-slate-500">Bookmarked</div>
              </div>

              <div className="flex-1 lg:flex-none bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center min-w-[120px]">
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Industries</span>
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  {profile.preferredCategories?.length || 0}
                </div>
                <div className="text-[10px] text-slate-500">Selected</div>
              </div>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Profile Completeness</span>
                <span className="text-white font-bold">{profileCompletion}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-center"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isEditing ? 'Close Profile Editor' : 'Edit Preferences'}</span>
            </button>
          </div>
        </div>

        {/* Success / Error Messages */}
        {saveSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 rounded-xl p-3.5 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile and job discovery preferences updated successfully!</span>
          </div>
        )}

        {/* Profile Editor Modal / Inline Form */}
        {isEditing && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-400" />
              <span>Update Candidate Profile & Preferences</span>
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Locality / City</label>
                  <select
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Warangal">Warangal</option>
                    <option value="Remote">Remote</option>
                    <option value="Karimnagar">Karimnagar</option>
                    <option value="Nizamabad">Nizamabad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  Preferred Job Industries (Select all that interest you)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {categories.map((c) => {
                    const isSelected = preferredCategories.includes(c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => handleCategoryToggle(c.id)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <CategoryIcon name={c.icon} className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <span className="truncate text-xs">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {saveError && <p className="text-rose-400 text-xs">{saveError}</p>}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-md shadow-indigo-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Recommended Jobs Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalized Matching</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Recommended For You in {profile.preferredLocation || 'Your City'}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  Algorithmic matches based on your preferred location ({profile.preferredLocation || 'Hyderabad'}) and {profile.preferredCategories?.length || 0} selected categories.
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('explore')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition self-start sm:self-auto"
            >
              <span>Explore All Vacancies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recommendedJobs.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">No matches found for your exact preferences</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Try selecting additional categories in your profile or browse our full discovery feed.
              </p>
              <button
                onClick={() => onNavigateTab('explore')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Browse All Openings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedJobs.map((job) => (
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

        {/* Quick Industry Navigation Pills */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-3">Quick Industry Discovery</h3>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onFilterCategory(cat.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition"
              >
                <CategoryIcon name={cat.icon} className="w-3.5 h-3.5 text-indigo-400" />
                <span>{cat.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">({cat.jobCount ?? 0})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
