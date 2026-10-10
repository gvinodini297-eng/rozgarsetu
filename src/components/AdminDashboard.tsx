import React, { useState, useMemo } from 'react';
import {
  Shield,
  Briefcase,
  Layers,
  Globe,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Search,
  ExternalLink,
  Calendar,
  IndianRupee,
  MapPin,
  Building2,
  X,
  RefreshCw,
  Clock,
  Check,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { Job, Category, JobSource, JobType, ExperienceLevel, WorkArrangement, JobStatus } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface AdminDashboardProps {
  onOpenSetupGuide: () => void;
  onViewJob: (job: Job) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenSetupGuide, onViewJob }) => {
  const { profile, isAdmin, isDemoMode, switchDemoRole } = useAuth();
  const {
    jobs,
    categories,
    sources,
    addJob,
    updateJob,
    deleteJob,
    toggleJobStatus,
    addCategory,
    updateCategory,
    toggleCategoryActive,
    addSource,
    updateSource,
    toggleSourceActive,
  } = useJobs();

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'jobs' | 'categories' | 'sources'>('jobs');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<JobSource | null>(null);

  const [deleteConfirmJobId, setDeleteConfirmJobId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 3500);
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === 'active').length;
    const expiredJobs = jobs.filter((j) => j.status === 'expired').length;
    const activeCategoriesCount = categories.filter((c) => c.isActive).length;
    const activeSourcesCount = sources.filter((s) => s.isActive).length;
    return { totalJobs, activeJobs, expiredJobs, activeCategoriesCount, activeSourcesCount };
  }, [jobs, categories, sources]);

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    const q = searchQuery.toLowerCase();
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.employerName.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.city.toLowerCase().includes(q)
    );
  }, [jobs, searchQuery]);

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  // Filtered Sources
  const filteredSources = useMemo(() => {
    if (!searchQuery.trim()) return sources;
    const q = searchQuery.toLowerCase();
    return sources.filter(
      (s) => s.name.toLowerCase().includes(q) || s.websiteUrl.toLowerCase().includes(q)
    );
  }, [sources, searchQuery]);

  // If user is not admin, show clear access restricted screen
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Administrator Access Required</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          The Admin Control Panel is strictly restricted to platform administrators to prevent unauthorized modifications to public job listings.
        </p>

        {isDemoMode && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md mx-auto text-left mb-6">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              Hackathon Demonstration Tip
            </span>
            <p className="text-xs text-slate-300 mb-3">
              Since Demo Mode is active, you can switch your current role to <strong>Admin</strong> using the banner or the button below to test the full vacancy and category management features.
            </p>
            <button
              onClick={() => switchDemoRole('admin')}
              className="w-full py-2 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md transition"
            >
              Switch to Admin Role for Demo
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- JOB FORM STATE ---
  const [jobForm, setJobForm] = useState({
    title: '',
    employerName: '',
    categoryId: categories[0]?.id || 'cat-restaurants',
    location: 'Banjara Hills, Hyderabad',
    city: 'Hyderabad',
    jobType: 'Full-time' as JobType,
    experienceLevel: 'Entry-level' as ExperienceLevel,
    workArrangement: 'On-site' as WorkArrangement,
    salaryMin: 18000,
    salaryMax: 24000,
    salaryDisplay: '₹18,000 - ₹24,000 / month',
    salaryDisclosed: true,
    description: '',
    requirementsStr: '',
    qualificationsStr: '',
    perksStr: '',
    sourceId: sources[0]?.id || 'src-company-direct',
    originalUrl: '',
    lastVerifiedAt: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: 'active' as JobStatus,
    isFeatured: false,
  });

  const openAddJobModal = () => {
    setEditingJob(null);
    setJobForm({
      title: '',
      employerName: '',
      categoryId: categories[0]?.id || 'cat-restaurants',
      location: 'Hyderabad',
      city: 'Hyderabad',
      jobType: 'Full-time',
      experienceLevel: 'Entry-level',
      workArrangement: 'On-site',
      salaryMin: 20000,
      salaryMax: 25000,
      salaryDisplay: '₹20,000 - ₹25,000 / month',
      salaryDisclosed: true,
      description: '',
      requirementsStr: 'Good communication skills\nPunctuality\nTeam player attitude',
      qualificationsStr: 'High school or equivalent\nBasic computer familiarity',
      perksStr: 'Flexible shifts\nWeekly day off\nDuty meals',
      sourceId: sources[0]?.id || 'src-company-direct',
      originalUrl: 'https://',
      lastVerifiedAt: new Date().toISOString().split('T')[0],
      expiryDate: '',
      status: 'active',
      isFeatured: false,
    });
    setIsJobModalOpen(true);
  };

  const openEditJobModal = (job: Job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      employerName: job.employerName,
      categoryId: job.categoryId,
      location: job.location,
      city: job.city,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      workArrangement: job.workArrangement,
      salaryMin: job.salaryMin || 0,
      salaryMax: job.salaryMax || 0,
      salaryDisplay: job.salaryDisplay,
      salaryDisclosed: job.salaryDisclosed,
      description: job.description,
      requirementsStr: job.requirements.join('\n'),
      qualificationsStr: job.qualifications.join('\n'),
      perksStr: (job.perks || []).join('\n'),
      sourceId: job.sourceId,
      originalUrl: job.originalUrl,
      lastVerifiedAt: job.lastVerifiedAt,
      expiryDate: job.expiryDate || '',
      status: job.status,
      isFeatured: job.isFeatured,
    });
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title.trim() || !jobForm.employerName.trim()) {
      showNotification('Title and Employer Name are required', 'error');
      return;
    }

    const categoryObj = categories.find((c) => c.id === jobForm.categoryId);
    const sourceObj = sources.find((s) => s.id === jobForm.sourceId);

    const jobPayload = {
      title: jobForm.title.trim(),
      employerName: jobForm.employerName.trim(),
      categoryId: jobForm.categoryId,
      categoryName: categoryObj?.name || 'Local Trade',
      location: jobForm.location.trim(),
      city: jobForm.city.trim(),
      jobType: jobForm.jobType,
      experienceLevel: jobForm.experienceLevel,
      workArrangement: jobForm.workArrangement,
      salaryMin: jobForm.salaryDisclosed ? Number(jobForm.salaryMin) : null,
      salaryMax: jobForm.salaryDisclosed ? Number(jobForm.salaryMax) : null,
      salaryDisplay: jobForm.salaryDisclosed ? jobForm.salaryDisplay.trim() : 'Not provided',
      salaryDisclosed: jobForm.salaryDisclosed,
      description: jobForm.description.trim(),
      requirements: jobForm.requirementsStr.split('\n').map((s) => s.trim()).filter(Boolean),
      qualifications: jobForm.qualificationsStr.split('\n').map((s) => s.trim()).filter(Boolean),
      perks: jobForm.perksStr.split('\n').map((s) => s.trim()).filter(Boolean),
      sourceId: jobForm.sourceId,
      sourceName: sourceObj?.name || 'Direct Employer',
      originalUrl: jobForm.originalUrl.trim() || 'https://workconnect.local',
      lastVerifiedAt: jobForm.lastVerifiedAt || new Date().toISOString().split('T')[0],
      expiryDate: jobForm.expiryDate ? jobForm.expiryDate : null,
      status: jobForm.status,
      isFeatured: jobForm.isFeatured,
    };

    if (editingJob) {
      const res = await updateJob(editingJob.id, jobPayload);
      if (res.error) {
        showNotification(res.error, 'error');
      } else {
        showNotification('Job listing successfully updated');
        setIsJobModalOpen(false);
      }
    } else {
      const res = await addJob(jobPayload);
      if (res.error) {
        showNotification(res.error, 'error');
      } else {
        showNotification('New job listing added successfully');
        setIsJobModalOpen(false);
      }
    }
  };

  const handleDeleteJob = async (id: string) => {
    const res = await deleteJob(id);
    if (res.error) {
      showNotification(res.error, 'error');
    } else {
      showNotification('Job listing permanently removed');
      setDeleteConfirmJobId(null);
    }
  };

  // --- CATEGORY FORM STATE ---
  const [catForm, setCatForm] = useState({
    name: '',
    slug: '',
    icon: 'Briefcase',
    description: '',
    isActive: true,
  });

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCatForm({
      name: '',
      slug: '',
      icon: 'Briefcase',
      description: '',
      isActive: true,
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatForm({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      description: cat.description,
      isActive: cat.isActive,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) {
      showNotification('Category name is required', 'error');
      return;
    }

    const slug = catForm.slug.trim() || catForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      const res = await updateCategory(editingCategory.id, {
        name: catForm.name.trim(),
        slug,
        icon: catForm.icon.trim(),
        description: catForm.description.trim(),
        isActive: catForm.isActive,
      });
      if (res.error) {
        showNotification(res.error, 'error');
      } else {
        showNotification('Category updated successfully');
        setIsCategoryModalOpen(false);
      }
    } else {
      const res = await addCategory({
        name: catForm.name.trim(),
        slug,
        icon: catForm.icon.trim(),
        description: catForm.description.trim(),
        isActive: catForm.isActive,
        displayOrder: categories.length + 1,
      });
      if (res.error) {
        showNotification(res.error, 'error');
      } else {
        showNotification('New category added successfully');
        setIsCategoryModalOpen(false);
      }
    }
  };

  // --- SOURCE FORM STATE ---
  const [sourceForm, setSourceForm] = useState({
    name: '',
    websiteUrl: 'https://',
    description: '',
    isActive: true,
  });

  const openAddSourceModal = () => {
    setEditingSource(null);
    setSourceForm({
      name: '',
      websiteUrl: 'https://',
      description: '',
      isActive: true,
    });
    setIsSourceModalOpen(true);
  };

  const openEditSourceModal = (source: JobSource) => {
    setEditingSource(source);
    setSourceForm({
      name: source.name,
      websiteUrl: source.websiteUrl,
      description: source.description,
      isActive: source.isActive,
    });
    setIsSourceModalOpen(true);
  };

  const handleSaveSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceForm.name.trim()) {
      showNotification('Source name is required', 'error');
      return;
    }

    if (editingSource) {
      const res = await updateSource(editingSource.id, {
        name: sourceForm.name.trim(),
        websiteUrl: sourceForm.websiteUrl.trim(),
        description: sourceForm.description.trim(),
        isActive: sourceForm.isActive,
      });
      if (res.error) {
        showNotification(res.error, 'error');
      } else {
        showNotification('Job source updated');
        setIsSourceModalOpen(false);
      }
    } else {
      const res = await addSource({
        name: sourceForm.name.trim(),
        websiteUrl: sourceForm.websiteUrl.trim(),
        description: sourceForm.description.trim(),
        isActive: sourceForm.isActive,
      });
      if (res.error) {
        showNotification(res.error, 'error');
      } else {
        showNotification('New job source registered');
        setIsSourceModalOpen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Toast Action Notification */}
        {actionMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200 border ${
              actionMessage.type === 'success'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-950 text-rose-300 border-rose-500/40'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Restricted Access Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Administrator Control Panel
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Curate verified vacancies, manage multi-industry categories, and register authentic external platforms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSetupGuide}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Supabase Guide</span>
            </button>
            {isDemoMode && (
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                Demo Persistence Active
              </span>
            )}
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>Total Jobs</span>
              <Briefcase className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.totalJobs}</div>
            <div className="text-[10px] text-slate-500 mt-1">Across all categories</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>Active Listings</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{stats.activeJobs}</div>
            <div className="text-[10px] text-slate-500 mt-1">Currently discoverable</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>Expired / Inactive</span>
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400">{stats.expiredJobs}</div>
            <div className="text-[10px] text-slate-500 mt-1">Hidden or flagged</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>Categories</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.activeCategoriesCount}</div>
            <div className="text-[10px] text-slate-500 mt-1">Active sectors</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 col-span-2 sm:col-span-1">
            <div className="text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
              <span>External Sources</span>
              <Globe className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.activeSourcesCount}</div>
            <div className="text-[10px] text-slate-500 mt-1">Direct feeds & boards</div>
          </div>
        </div>

        {/* Tab Controls & Search/Actions Toolbar */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 max-w-fit">
            <button
              onClick={() => {
                setActiveTab('jobs');
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'jobs'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Vacancies ({jobs.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('categories');
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'categories'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categories ({categories.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('sources');
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'sources'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Job Sources ({sources.length})</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {activeTab === 'jobs' && (
              <button
                onClick={openAddJobModal}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vacancy</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <button
                onClick={openAddCategoryModal}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>New Category</span>
              </button>
            )}

            {activeTab === 'sources' && (
              <button
                onClick={openAddSourceModal}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>New Source</span>
              </button>
            )}
          </div>
        </div>

        {/* --- TAB CONTENT 1: JOBS MANAGEMENT --- */}
        {activeTab === 'jobs' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                    <th className="py-3.5 px-4">Title & Business</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Source & URL</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Verified</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No vacancy records found matching "{searchQuery}".
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => {
                      const isExpired = job.status === 'expired';
                      return (
                        <tr
                          key={job.id}
                          className="hover:bg-slate-850/50 transition group"
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm group-hover:text-indigo-300 transition">
                              {job.title}
                            </div>
                            <div className="text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="font-medium text-slate-300">{job.employerName}</span>
                              <span>•</span>
                              <span className="text-[11px] text-indigo-400 font-semibold">{job.jobType}</span>
                              {job.isFeatured && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  Featured
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                              {job.categoryName}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-300">
                            <div className="font-medium">{job.city}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                              {job.location}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-300">
                            <div className="font-medium text-indigo-400">{job.sourceName}</div>
                            <a
                              href={job.originalUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 truncate max-w-[120px]"
                            >
                              <span>{job.originalUrl}</span>
                              <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                            </a>
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() =>
                                toggleJobStatus(job.id, isExpired ? 'active' : 'expired')
                              }
                              title="Click to toggle active/expired"
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition flex items-center gap-1 ${
                                isExpired
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                              }`}
                            >
                              {isExpired ? <AlertCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                              <span>{isExpired ? 'Expired' : 'Active'}</span>
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                            {job.lastVerifiedAt}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onViewJob(job)}
                                title="Quick View"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openEditJobModal(job)}
                                title="Edit Listing"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmJobId(job.id)}
                                title="Delete Listing"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 2: CATEGORIES MANAGEMENT --- */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <CategoryIcon name={cat.icon} className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleCategoryActive(cat.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${
                          cat.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => openEditCategoryModal(cat)}
                        className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 transition"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-base mb-1">{cat.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>Slug: <code className="text-slate-400">{cat.slug}</code></span>
                  <span className="font-semibold text-indigo-400">
                    {cat.jobCount ?? 0} vacancies
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- TAB CONTENT 3: SOURCES MANAGEMENT --- */}
        {activeTab === 'sources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSources.map((source) => (
              <div
                key={source.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleSourceActive(source.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${
                          source.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {source.isActive ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => openEditSourceModal(source)}
                        className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 transition"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-base mb-1">{source.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {source.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <a
                    href={source.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline flex items-center gap-1 truncate max-w-[150px]"
                  >
                    <span>{source.websiteUrl}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                  <span className="font-semibold text-slate-400">
                    {source.jobCount ?? 0} listings
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- MODAL 1: ADD / EDIT JOB MODAL --- */}
        {isJobModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-white mb-1">
                {editingJob ? 'Edit Vacancy Listing' : 'Publish New Vacancy Listing'}
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                All fields are formatted for transparent job discovery across local businesses.
              </p>

              <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
                {/* Title & Employer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      placeholder="e.g. Restaurant Service Staff"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Business / Employer *</label>
                    <input
                      type="text"
                      required
                      value={jobForm.employerName}
                      onChange={(e) => setJobForm({ ...jobForm, employerName: e.target.value })}
                      placeholder="e.g. Royal Cafe & Bakers"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Category & Source */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Category *</label>
                    <select
                      value={jobForm.categoryId}
                      onChange={(e) => setJobForm({ ...jobForm, categoryId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Listing Source *</label>
                    <select
                      value={jobForm.sourceId}
                      onChange={(e) => setJobForm({ ...jobForm, sourceId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    >
                      {sources.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">City / Region *</label>
                    <select
                      value={jobForm.city}
                      onChange={(e) => setJobForm({ ...jobForm, city: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Warangal">Warangal</option>
                      <option value="Remote">Remote</option>
                      <option value="Karimnagar">Karimnagar</option>
                      <option value="Nizamabad">Nizamabad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Locality / Address Details</label>
                    <input
                      type="text"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      placeholder="e.g. Hanamkonda or Banjara Hills"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Job Type, Experience, Work Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Job Type</label>
                    <select
                      value={jobForm.jobType}
                      onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value as JobType })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Temporary">Temporary</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Experience Level</label>
                    <select
                      value={jobForm.experienceLevel}
                      onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value as ExperienceLevel })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none"
                    >
                      <option value="Entry-level">Entry-level</option>
                      <option value="Experienced">Experienced</option>
                      <option value="Any">Any Experience</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Work Arrangement</label>
                    <select
                      value={jobForm.workArrangement}
                      onChange={(e) => setJobForm({ ...jobForm, workArrangement: e.target.value as WorkArrangement })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none"
                    >
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                {/* Salary Info */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Salary / Compensation</span>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                      <input
                        type="checkbox"
                        checked={jobForm.salaryDisclosed}
                        onChange={(e) => setJobForm({ ...jobForm, salaryDisclosed: e.target.checked })}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                      />
                      <span>Salary is Disclosed</span>
                    </label>
                  </div>
                  {jobForm.salaryDisclosed && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Min (₹/mo)</label>
                        <input
                          type="number"
                          value={jobForm.salaryMin}
                          onChange={(e) => setJobForm({ ...jobForm, salaryMin: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Max (₹/mo)</label>
                        <input
                          type="number"
                          value={jobForm.salaryMax}
                          onChange={(e) => setJobForm({ ...jobForm, salaryMax: Number(e.target.value) })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Display Label</label>
                        <input
                          type="text"
                          value={jobForm.salaryDisplay}
                          onChange={(e) => setJobForm({ ...jobForm, salaryDisplay: e.target.value })}
                          placeholder="₹18,000 - ₹24,000 / month"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Role Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    placeholder="Clear summary of daily responsibilities and workplace environment..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Requirements, Qualifications, Perks */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Requirements (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={jobForm.requirementsStr}
                      onChange={(e) => setJobForm({ ...jobForm, requirementsStr: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Qualifications (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={jobForm.qualificationsStr}
                      onChange={(e) => setJobForm({ ...jobForm, qualificationsStr: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Perks & Benefits (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={jobForm.perksStr}
                      onChange={(e) => setJobForm({ ...jobForm, perksStr: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-[11px]"
                    />
                  </div>
                </div>

                {/* Original URL & Expiry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Original Application / Source URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={jobForm.originalUrl}
                      onChange={(e) => setJobForm({ ...jobForm, originalUrl: e.target.value })}
                      placeholder="https://company.com/apply"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Expiry Date (optional)
                    </label>
                    <input
                      type="date"
                      value={jobForm.expiryDate}
                      onChange={(e) => setJobForm({ ...jobForm, expiryDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                {/* Status & Featured */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={jobForm.status === 'active'}
                        onChange={(e) =>
                          setJobForm({ ...jobForm, status: e.target.checked ? 'active' : 'expired' })
                        }
                        className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                      />
                      <span>Listing is Active</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={jobForm.isFeatured}
                        onChange={(e) => setJobForm({ ...jobForm, isFeatured: e.target.checked })}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                      />
                      <span>Mark as Featured</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsJobModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-md shadow-indigo-600/20"
                    >
                      {editingJob ? 'Update Listing' : 'Publish Listing'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL 2: ADD / EDIT CATEGORY MODAL --- */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold text-white mb-1">
                {editingCategory ? 'Edit Industry Category' : 'Add New Industry Category'}
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                Automatically integrates with the discovery cards and filters.
              </p>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={catForm.name}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                    placeholder="e.g. Healthcare & Clinics"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Visual Icon Identifier (Lucide Icon)
                  </label>
                  <select
                    value={catForm.icon}
                    onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Utensils">Utensils (Food / Dining)</option>
                    <option value="Hotel">Hotel (Hospitality)</option>
                    <option value="Scissors">Scissors (Beauty / Salons)</option>
                    <option value="ShoppingBag">ShoppingBag (Retail)</option>
                    <option value="Bike">Bike (Logistics / Delivery)</option>
                    <option value="Headphones">Headphones (Customer Support)</option>
                    <option value="GraduationCap">GraduationCap (Education)</option>
                    <option value="Briefcase">Briefcase (Office)</option>
                    <option value="Code">Code (Software / IT)</option>
                    <option value="Wrench">Wrench (Maintenance)</option>
                    <option value="ShieldCheck">ShieldCheck (Security)</option>
                    <option value="Store">Store (Local Shops)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={catForm.description}
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                    placeholder="Short description of typical roles in this sector..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={catForm.isActive}
                      onChange={(e) => setCatForm({ ...catForm, isActive: e.target.checked })}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <span>Active in Discovery</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                    >
                      Save Category
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL 3: ADD / EDIT SOURCE MODAL --- */}
        {isSourceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setIsSourceModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold text-white mb-1">
                {editingSource ? 'Edit Platform Source' : 'Register External Job Source'}
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                Authenticates external websites, public boards, and employer portals.
              </p>

              <form onSubmit={handleSaveSource} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Source Name *</label>
                  <input
                    type="text"
                    required
                    value={sourceForm.name}
                    onChange={(e) => setSourceForm({ ...sourceForm, name: e.target.value })}
                    placeholder="e.g. Telangana Employment Board"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Official Website URL *</label>
                  <input
                    type="url"
                    required
                    value={sourceForm.websiteUrl}
                    onChange={(e) => setSourceForm({ ...sourceForm, websiteUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={sourceForm.description}
                    onChange={(e) => setSourceForm({ ...sourceForm, description: e.target.value })}
                    placeholder="Platform verification background..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={sourceForm.isActive}
                      onChange={(e) => setSourceForm({ ...sourceForm, isActive: e.target.checked })}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <span>Active Feed</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSourceModalOpen(false)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                    >
                      Save Source
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- DELETION CONFIRMATION DIALOG --- */}
        {deleteConfirmJobId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Confirm Deletion</h3>
              <p className="text-xs text-slate-400 mb-6">
                Are you sure you want to permanently remove this job listing? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmJobId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteJob(deleteConfirmJobId)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
