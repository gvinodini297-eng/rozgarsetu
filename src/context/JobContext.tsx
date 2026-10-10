import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Job, Category, JobSource, JobStatus } from '../types';
import { INITIAL_CATEGORIES, INITIAL_SOURCES, INITIAL_JOBS } from '../lib/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface JobContextType {
  jobs: Job[];
  categories: Category[];
  sources: JobSource[];
  savedJobIds: string[];
  savedJobs: Job[];
  isLoading: boolean;
  isJobSaved: (jobId: string) => boolean;
  toggleSaveJob: (jobId: string) => Promise<void>;
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => Promise<{ error?: string }>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<{ error?: string }>;
  deleteJob: (id: string) => Promise<{ error?: string }>;
  toggleJobStatus: (id: string, status: JobStatus) => Promise<{ error?: string }>;
  addCategory: (cat: Omit<Category, 'id'>) => Promise<{ error?: string }>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<{ error?: string }>;
  toggleCategoryActive: (id: string) => Promise<{ error?: string }>;
  addSource: (source: Omit<JobSource, 'id'>) => Promise<{ error?: string }>;
  updateSource: (id: string, updates: Partial<JobSource>) => Promise<{ error?: string }>;
  toggleSourceActive: (id: string) => Promise<{ error?: string }>;
  refreshData: () => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();

  // Categories State
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem('workconnect_categories');
      return stored ? JSON.parse(stored) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Sources State
  const [sources, setSources] = useState<JobSource[]>(() => {
    try {
      const stored = localStorage.getItem('workconnect_sources');
      return stored ? JSON.parse(stored) : INITIAL_SOURCES;
    } catch {
      return INITIAL_SOURCES;
    }
  });

  // Jobs State
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const stored = localStorage.getItem('workconnect_jobs');
      return stored ? JSON.parse(stored) : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  });

  // Saved Jobs State
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`workconnect_saved_${profile?.id || 'guest'}`);
      return stored ? JSON.parse(stored) : ['job-1', 'job-6'];
    } catch {
      return ['job-1', 'job-6'];
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync Saved Jobs when active profile changes
  useEffect(() => {
    const key = `workconnect_saved_${profile?.id || 'guest'}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setSavedJobIds(JSON.parse(stored));
      } else if (profile?.id) {
        setSavedJobIds(['job-1', 'job-6']);
      }
    } catch {
      setSavedJobIds([]);
    }
  }, [profile?.id]);

  // Persist demo changes to localStorage
  useEffect(() => {
    if (!isSupabaseConfigured) {
      try {
        localStorage.setItem('workconnect_categories', JSON.stringify(categories));
        localStorage.setItem('workconnect_sources', JSON.stringify(sources));
        localStorage.setItem('workconnect_jobs', JSON.stringify(jobs));
        const key = `workconnect_saved_${profile?.id || 'guest'}`;
        localStorage.setItem(key, JSON.stringify(savedJobIds));
      } catch (err) {
        console.error('Error persisting to localStorage:', err);
      }
    }
  }, [categories, sources, jobs, savedJobIds, profile?.id]);

  // Fetch from Supabase if configured
  const refreshData = async () => {
    if (!isSupabaseConfigured) return;
    setIsLoading(true);

    try {
      // 1. Fetch categories
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (catData && catData.length > 0) {
        setCategories(
          catData.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            icon: c.icon || 'Briefcase',
            description: c.description || '',
            isActive: c.is_active ?? true,
            displayOrder: c.display_order || 0,
          }))
        );
      }

      // 2. Fetch sources
      const { data: srcData } = await supabase.from('job_sources').select('*');
      if (srcData && srcData.length > 0) {
        setSources(
          srcData.map((s) => ({
            id: s.id,
            name: s.name,
            websiteUrl: s.website_url,
            description: s.description || '',
            isActive: s.is_active ?? true,
          }))
        );
      }

      // 3. Fetch jobs
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*, categories(name), job_sources(name)')
        .order('created_at', { ascending: false });

      if (jobData && jobData.length > 0) {
        setJobs(
          jobData.map((j) => ({
            id: j.id,
            title: j.title,
            employerName: j.employer_name,
            employerLogo: j.employer_logo,
            categoryId: j.category_id,
            categoryName: j.categories?.name,
            location: j.location,
            city: j.city || (j.location.toLowerCase().includes('warangal') ? 'Warangal' : 'Hyderabad'),
            jobType: j.job_type,
            experienceLevel: j.experience_level,
            workArrangement: j.work_arrangement,
            salaryMin: j.salary_min,
            salaryMax: j.salary_max,
            salaryDisplay: j.salary_display || (j.salary_min ? `₹${j.salary_min.toLocaleString()} - ₹${j.salary_max?.toLocaleString() || ''}` : 'Not provided'),
            salaryDisclosed: j.salary_is_disclosed ?? Boolean(j.salary_min),
            description: j.description,
            requirements: j.requirements || [],
            qualifications: j.qualifications || [],
            perks: j.perks || [],
            sourceId: j.source_id,
            sourceName: j.job_sources?.name,
            originalUrl: j.original_url,
            lastVerifiedAt: j.last_verified_at || j.created_at?.split('T')[0] || '2026-10-09',
            expiryDate: j.expiry_date,
            status: j.status || 'active',
            isFeatured: j.is_featured ?? false,
            createdAt: j.created_at,
          }))
        );
      }

      // 4. Fetch saved jobs for authenticated user
      if (profile?.id) {
        const { data: savedData } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', profile.id);

        if (savedData) {
          setSavedJobIds(savedData.map((s) => s.job_id));
        }
      }
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured) {
      refreshData();
    }
  }, [profile?.id]);

  // Compute live counts
  const categoriesWithCounts = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      jobCount: jobs.filter((j) => j.categoryId === cat.id && j.status === 'active').length,
    }));
  }, [categories, jobs]);

  const sourcesWithCounts = useMemo(() => {
    return sources.map((src) => ({
      ...src,
      jobCount: jobs.filter((j) => j.sourceId === src.id).length,
    }));
  }, [sources, jobs]);

  const savedJobs = useMemo(() => {
    return jobs.filter((j) => savedJobIds.includes(j.id));
  }, [jobs, savedJobIds]);

  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);

  // Toggle Save Job
  const toggleSaveJob = async (jobId: string) => {
    const isCurrentlySaved = savedJobIds.includes(jobId);
    const updatedIds = isCurrentlySaved
      ? savedJobIds.filter((id) => id !== jobId)
      : [...savedJobIds, jobId];

    setSavedJobIds(updatedIds);

    const key = `workconnect_saved_${profile?.id || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(updatedIds));

    if (isSupabaseConfigured && profile?.id) {
      try {
        if (isCurrentlySaved) {
          await supabase
            .from('saved_jobs')
            .delete()
            .match({ user_id: profile.id, job_id: jobId });
        } else {
          await supabase.from('saved_jobs').insert({
            user_id: profile.id,
            job_id: jobId,
          });
        }
      } catch (err) {
        console.error('Failed to sync saved job to Supabase:', err);
      }
    }
  };

  // Admin Job Operations
  const addJob = async (jobData: Omit<Job, 'id' | 'createdAt'>): Promise<{ error?: string }> => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
      categoryName: categories.find((c) => c.id === jobData.categoryId)?.name || 'General',
      sourceName: sources.find((s) => s.id === jobData.sourceId)?.name || 'Verified Source',
    };

    setJobs((prev) => [newJob, ...prev]);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('jobs').insert({
          title: jobData.title,
          employer_name: jobData.employerName,
          category_id: jobData.categoryId,
          location: jobData.location,
          city: jobData.city,
          job_type: jobData.jobType,
          experience_level: jobData.experienceLevel,
          work_arrangement: jobData.workArrangement,
          salary_min: jobData.salaryMin,
          salary_max: jobData.salaryMax,
          salary_display: jobData.salaryDisplay,
          salary_is_disclosed: jobData.salaryDisclosed,
          description: jobData.description,
          requirements: jobData.requirements,
          qualifications: jobData.qualifications,
          perks: jobData.perks,
          source_id: jobData.sourceId,
          original_url: jobData.originalUrl,
          last_verified_at: jobData.lastVerifiedAt,
          expiry_date: jobData.expiryDate,
          status: jobData.status,
          is_featured: jobData.isFeatured,
        });
        if (error) return { error: error.message };
      } catch (err: any) {
        return { error: err.message || 'Failed to save job in Supabase' };
      }
    }

    return {};
  };

  const updateJob = async (id: string, updates: Partial<Job>): Promise<{ error?: string }> => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, ...updates, updatedAt: new Date().toISOString() } : job))
    );

    if (isSupabaseConfigured) {
      try {
        const dbUpdates: Record<string, any> = {};
        if (updates.title) dbUpdates.title = updates.title;
        if (updates.employerName) dbUpdates.employer_name = updates.employerName;
        if (updates.categoryId) dbUpdates.category_id = updates.categoryId;
        if (updates.location) dbUpdates.location = updates.location;
        if (updates.city) dbUpdates.city = updates.city;
        if (updates.jobType) dbUpdates.job_type = updates.jobType;
        if (updates.experienceLevel) dbUpdates.experience_level = updates.experienceLevel;
        if (updates.workArrangement) dbUpdates.work_arrangement = updates.workArrangement;
        if (updates.salaryMin !== undefined) dbUpdates.salary_min = updates.salaryMin;
        if (updates.salaryMax !== undefined) dbUpdates.salary_max = updates.salaryMax;
        if (updates.salaryDisplay) dbUpdates.salary_display = updates.salaryDisplay;
        if (updates.salaryDisclosed !== undefined) dbUpdates.salary_is_disclosed = updates.salaryDisclosed;
        if (updates.description) dbUpdates.description = updates.description;
        if (updates.requirements) dbUpdates.requirements = updates.requirements;
        if (updates.qualifications) dbUpdates.qualifications = updates.qualifications;
        if (updates.originalUrl) dbUpdates.original_url = updates.originalUrl;
        if (updates.sourceId) dbUpdates.source_id = updates.sourceId;
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.lastVerifiedAt) dbUpdates.last_verified_at = updates.lastVerifiedAt;
        if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;

        const { error } = await supabase.from('jobs').update(dbUpdates).eq('id', id);
        if (error) return { error: error.message };
      } catch (err: any) {
        return { error: err.message };
      }
    }
    return {};
  };

  const deleteJob = async (id: string): Promise<{ error?: string }> => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
    setSavedJobIds((prev) => prev.filter((savedId) => savedId !== id));

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error) return { error: error.message };
      } catch (err: any) {
        return { error: err.message };
      }
    }
    return {};
  };

  const toggleJobStatus = async (id: string, status: JobStatus): Promise<{ error?: string }> => {
    return updateJob(id, { status });
  };

  // Category Operations
  const addCategory = async (catData: Omit<Category, 'id'>): Promise<{ error?: string }> => {
    const newCategory: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCategory]);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('categories').insert({
          name: catData.name,
          slug: catData.slug,
          icon: catData.icon,
          description: catData.description,
          is_active: catData.isActive,
          display_order: catData.displayOrder,
        });
        if (error) return { error: error.message };
      } catch (err: any) {
        return { error: err.message };
      }
    }
    return {};
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<{ error?: string }> => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('categories')
          .update({
            name: updates.name,
            icon: updates.icon,
            description: updates.description,
            is_active: updates.isActive,
            display_order: updates.displayOrder,
          })
          .eq('id', id);
        if (error) return { error: error.message };
      } catch (err: any) {
        return { error: err.message };
      }
    }
    return {};
  };

  const toggleCategoryActive = async (id: string): Promise<{ error?: string }> => {
    const target = categories.find((c) => c.id === id);
    if (!target) return { error: 'Category not found' };
    return updateCategory(id, { isActive: !target.isActive });
  };

  // Source Operations
  const addSource = async (sourceData: Omit<JobSource, 'id'>): Promise<{ error?: string }> => {
    const newSource: JobSource = {
      ...sourceData,
      id: `src-${Date.now()}`,
    };
    setSources((prev) => [...prev, newSource]);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('job_sources').insert({
          name: sourceData.name,
          website_url: sourceData.websiteUrl,
          description: sourceData.description,
          is_active: sourceData.isActive,
        });
        if (error) return { error: error.message };
      } catch (err: any) {
        return { error: err.message };
      }
    }
    return {};
  };

  const updateSource = async (id: string, updates: Partial<JobSource>): Promise<{ error?: string }> => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('job_sources')
          .update({
            name: updates.name,
            website_url: updates.websiteUrl,
            description: updates.description,
            is_active: updates.isActive,
          })
          .eq('id', id);
        if (error) return { error: error.message };
      } catch (err: any) {
        return { error: err.message };
      }
    }
    return {};
  };

  const toggleSourceActive = async (id: string): Promise<{ error?: string }> => {
    const target = sources.find((s) => s.id === id);
    if (!target) return { error: 'Source not found' };
    return updateSource(id, { isActive: !target.isActive });
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        categories: categoriesWithCounts,
        sources: sourcesWithCounts,
        savedJobIds,
        savedJobs,
        isLoading,
        isJobSaved,
        toggleSaveJob,
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
        refreshData,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
