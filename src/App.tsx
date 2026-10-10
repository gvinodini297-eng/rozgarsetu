import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JobProvider, useJobs } from './context/JobContext';
import { Navbar } from './components/Navbar';
import { DemoBanner } from './components/DemoBanner';
import { HeroSection } from './components/HeroSection';
import { CategoryCards, industries } from './components/CategoryCards';
import { IndustryRolesView } from './components/IndustryRolesView';
import { ApplicationsView } from './components/ApplicationsView';
import { EmployerHome } from './components/EmployerHome';
import { JobCard } from './components/JobCard';
import { JobFilters } from './components/JobFilters';
import { HowItWorks } from './components/HowItWorks';
import { TrustNotice } from './components/TrustNotice';
import { JobDetailModal } from './components/JobDetailModal';
import { ExternalRedirectModal } from './components/ExternalRedirectModal';
import { AuthModal } from './components/AuthModal';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { SavedJobsView } from './components/SavedJobsView';
import { CategoriesView } from './components/CategoriesView';
import { Footer } from './components/Footer';
import { Job, FilterState } from './types';
import {
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

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

const WorkConnectApp: React.FC = () => {
  const { profile } = useAuth();
  const { jobs, categories, sources } = useJobs();

  // Active Main Navigation Tab
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const selectedIndustryData =
    industries.find((i) => i.id === selectedIndustry) || null;

  // Browser Back button support (history)
  const historyReady = useRef(false);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = e.state as { tab?: Tab; industry?: string | null } | null;
      if (s && s.tab) {
        setCurrentTab(s.tab);
        setSelectedIndustry(s.industry ?? null);
      } else {
        setCurrentTab('home');
        setSelectedIndustry(null);
      }
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const state = { tab: currentTab, industry: selectedIndustry };
    if (!historyReady.current) {
      window.history.replaceState(state, '');
      historyReady.current = true;
      return;
    }
    const cur = window.history.state as { tab?: string; industry?: string | null } | null;
    if (cur && cur.tab === currentTab && (cur.industry ?? null) === selectedIndustry) return;
    window.history.pushState(state, '');
  }, [currentTab, selectedIndustry]);

  // Keep each role on its own pages (runs when login / logout happens)
  const userRole = profile?.role ?? null;
  useEffect(() => {
    if (userRole === 'employer' && currentTab !== 'home' && currentTab !== 'reviewed') {
      setSelectedIndustry(null);
      setCurrentTab('home');
    } else if (userRole !== 'employer' && currentTab === 'reviewed') {
      setCurrentTab('home');
    } else if (
      !userRole &&
      (currentTab === 'applied' ||
        currentTab === 'accepted' ||
        currentTab === 'dashboard' ||
        currentTab === 'admin')
    ) {
      setCurrentTab('home');
    } else if (userRole === 'job_seeker' && currentTab === 'admin') {
      setCurrentTab('home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  // Modals State
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup'>('signin');
  const [authInitialRole, setAuthInitialRole] = useState<'job_seeker' | 'employer'>('job_seeker');
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);

  // Filters State for Job Discovery
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    city: 'all',
    categoryId: 'all',
    jobType: 'all',
    experienceLevel: 'all',
    workArrangement: 'all',
    sourceId: 'all',
    minSalary: 0,
    salaryDisclosedOnly: false,
    sortBy: 'recent',
  });

  // Display View Options
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim()) count++;
    if (filters.city !== 'all') count++;
    if (filters.categoryId !== 'all') count++;
    if (filters.jobType !== 'all') count++;
    if (filters.experienceLevel !== 'all') count++;
    if (filters.workArrangement !== 'all') count++;
    if (filters.sourceId !== 'all') count++;
    if (filters.minSalary > 0) count++;
    if (filters.salaryDisclosedOnly) count++;
    return count;
  }, [filters]);

  // Reset Filters Handler
  const handleClearAllFilters = () => {
    setFilters({
      searchQuery: '',
      city: 'all',
      categoryId: 'all',
      jobType: 'all',
      experienceLevel: 'all',
      workArrangement: 'all',
      sourceId: 'all',
      minSalary: 0,
      salaryDisclosedOnly: false,
      sortBy: 'recent',
    });
  };

  // Hero Search trigger -> Transition to explore
  const handleHeroSearch = (keywords: string, location: string, categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: keywords,
      city: location ? location.toLowerCase() : 'all',
      categoryId: categoryId || 'all',
    }));
    setSelectedIndustry(null);
    setCurrentTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Category select trigger -> Industry -> Job Roles
  const handleCategorySelect = (categoryId: string) => {
    setSelectedIndustry(categoryId);
    setCurrentTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Auth Modal helper
  const handleOpenAuth = (
    initialTab: 'signin' | 'signup' = 'signin',
    role: 'job_seeker' | 'employer' = 'job_seeker'
  ) => {
    setAuthInitialTab(initialTab);
    setAuthInitialRole(role);
    setIsAuthModalOpen(true);
  };

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        if (job.status !== 'active') return false;

        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchEmployer = job.employerName.toLowerCase().includes(q);
          const matchDesc = job.description.toLowerCase().includes(q);
          const matchLoc = job.location.toLowerCase().includes(q);
          if (!matchTitle && !matchEmployer && !matchDesc && !matchLoc) {
            return false;
          }
        }

        if (filters.city !== 'all' && filters.city !== 'all locations') {
          if (job.city.toLowerCase() !== filters.city.toLowerCase()) {
            return false;
          }
        }

        if (filters.categoryId !== 'all') {
          if (job.categoryId !== filters.categoryId) {
            return false;
          }
        }

        if (filters.jobType !== 'all') {
          if (job.jobType !== filters.jobType) {
            return false;
          }
        }

        if (filters.experienceLevel !== 'all') {
          if (job.experienceLevel !== filters.experienceLevel) {
            return false;
          }
        }

        if (filters.workArrangement !== 'all') {
          if (job.workArrangement !== filters.workArrangement) {
            return false;
          }
        }

        if (filters.sourceId !== 'all') {
          if (job.sourceId !== filters.sourceId) {
            return false;
          }
        }

        if (filters.minSalary > 0) {
          if (!job.salaryMin || job.salaryMin < filters.minSalary) {
            return false;
          }
        }

        if (filters.salaryDisclosedOnly && !job.salaryDisclosed) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'recent') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === 'salary-high') {
          const salA = a.salaryMax || a.salaryMin || 0;
          const salB = b.salaryMax || b.salaryMin || 0;
          return salB - salA;
        }
        if (filters.sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [jobs, filters]);

  // Featured Jobs for Homepage
  const featuredJobs = useMemo(() => {
    return jobs.filter((j) => j.isFeatured && j.status === 'active').slice(0, 6);
  }, [jobs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Demo Mode Top Banner */}
      <DemoBanner onOpenSetupGuide={() => setIsSetupGuideOpen(true)} />

      {/* 2. Sticky Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={handleOpenAuth}
      />

      {/* 3. Main View Switcher */}
      <main className="flex-1">
        {/* VIEW A2: EMPLOYER HOME (only after employer login) */}
        {currentTab === 'home' && profile?.role === 'employer' && <EmployerHome />}

        {/* VIEW A: HOME / LANDING PAGE */}
        {currentTab === 'home' && profile?.role !== 'employer' && (
          <div className="space-y-4">
            <HeroSection
              categories={categories}
              onSearch={handleHeroSearch}
            />

            {/* Popular Categories Grid */}
            <CategoryCards
              categories={categories}
              onSelectCategory={handleCategorySelect}
            />

            {/* Featured Section */}
            <section className="py-16 bg-slate-950 border-t border-slate-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sample Listings</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      Featured Opportunities
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Sample demo listings for the prototype. These are not live vacancies.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentTab('explore');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 text-xs font-bold transition self-start sm:self-auto"
                  >
                    View All {jobs.filter((j) => j.status === 'active').length} Demo Listings →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onViewDetails={(j) => setSelectedJobForDetail(j)}
                      onApplyExternal={(j) => setSelectedJobForApply(j)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* How WorkConnect Works */}
            <HowItWorks />

            {/* Trust, Transparency & Safety Notice */}
            <TrustNotice />
          </div>
        )}

        {/* VIEW B1: INDUSTRY → JOB ROLES → JOB INFORMATION */}
        {currentTab === 'explore' && selectedIndustryData && (
          <IndustryRolesView
            key={selectedIndustryData.id}
            industry={selectedIndustryData}
            onOpenAuth={handleOpenAuth}
            onBack={() => {
              setSelectedIndustry(null);
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW B: EXPLORE JOBS (SEARCH & DISCOVERY) */}
        {currentTab === 'explore' && !selectedIndustryData && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Discover Opportunities
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Showing{' '}
                  <span className="font-bold text-indigo-400">{filteredJobs.length}</span> demo listings
                  for the prototype (sample data).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-500">Sort:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value as any })
                    }
                    className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="title">Alphabetical (Title)</option>
                  </select>
                </div>

                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === 'grid'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    title="List View"
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === 'list'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <JobFilters
                    filters={filters}
                    setFilters={setFilters}
                    categories={categories}
                    sources={sources}
                    activeFilterCount={activeFilterCount}
                    onClearAll={handleClearAllFilters}
                  />
                </div>
              </div>

              <div className="lg:col-span-3 space-y-6">
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
                    <span className="text-slate-400 font-medium">Applied Filters:</span>
                    {filters.searchQuery && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                        Keyword: "{filters.searchQuery}"
                        <button
                          onClick={() => setFilters({ ...filters, searchQuery: '' })}
                          className="hover:text-rose-400"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.city !== 'all' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                        City: {filters.city}
                        <button
                          onClick={() => setFilters({ ...filters, city: 'all' })}
                          className="hover:text-rose-400"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.categoryId !== 'all' && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                        {categories.find((c) => c.id === filters.categoryId)?.name || 'Category'}
                        <button
                          onClick={() => setFilters({ ...filters, categoryId: 'all' })}
                          className="hover:text-rose-400"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    <button
                      onClick={handleClearAllFilters}
                      className="ml-auto text-indigo-400 hover:text-indigo-300 font-semibold text-[11px]"
                    >
                      Clear All
                    </button>
                  </div>
                )}

                {filteredJobs.length === 0 ? (
                  <div className="py-20 px-4 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500 shadow-inner">
                      <Search className="w-8 h-8 text-slate-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">No job openings found</h3>
                      <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                        No listings match your active filter criteria. Try expanding your search terms, resetting filters, or selecting a different location.
                      </p>
                    </div>
                    <button
                      onClick={handleClearAllFilters}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset All Filters</span>
                    </button>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 gap-5'
                        : 'flex flex-col gap-4'
                    }
                  >
                    {filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onViewDetails={(j) => setSelectedJobForDetail(j)}
                        onApplyExternal={(j) => setSelectedJobForApply(j)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW C: ALL CATEGORIES */}
        {currentTab === 'categories' && (
          <CategoriesView onSelectCategory={handleCategorySelect} />
        )}

        {/* VIEW D: SAVED JOBS */}
        {currentTab === 'saved' && (
          <SavedJobsView
            onViewJob={(j) => setSelectedJobForDetail(j)}
            onApplyExternal={(j) => setSelectedJobForApply(j)}
            onExplore={() => {
              setCurrentTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW E: JOB SEEKER PROFILE */}
        {currentTab === 'dashboard' && (
          <UserDashboard
            onViewJob={(j) => setSelectedJobForDetail(j)}
            onApplyExternal={(j) => setSelectedJobForApply(j)}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onFilterCategory={handleCategorySelect}
          />
        )}

        {/* VIEW G: APPLICATION PAGES (DEMO DATA) */}
        {(currentTab === 'applied' ||
          currentTab === 'accepted' ||
          currentTab === 'reviewed') && (
          <ApplicationsView
            mode={currentTab}
            onBrowse={() => {
              setSelectedIndustry(null);
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW F: ADMIN PANEL (admin login only) */}
        {currentTab === 'admin' && profile?.role === 'admin' && (
          <AdminDashboard
            onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
            onViewJob={(j) => setSelectedJobForDetail(j)}
          />
        )}
      </main>

      {/* 4. Global Footer */}
      <Footer
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
      />

      {/* 5. Modals & Overlays */}
      <JobDetailModal
        job={selectedJobForDetail}
        isOpen={Boolean(selectedJobForDetail)}
        onClose={() => setSelectedJobForDetail(null)}
        onApplyExternal={(job) => {
          setSelectedJobForDetail(null);
          setSelectedJobForApply(job);
        }}
      />

      <ExternalRedirectModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authInitialTab}
        initialRole={authInitialRole}
      />

      <SupabaseSetupModal
        isOpen={isSetupGuideOpen}
        onClose={() => setIsSetupGuideOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <JobProvider>
        <WorkConnectApp />
      </JobProvider>
    </AuthProvider>
  );
};

export default App;
