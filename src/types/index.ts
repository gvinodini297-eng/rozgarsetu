// WorkConnect Type Definitions

export type Role = 'job_seeker' | 'employer' | 'admin';

export type JobType = 'Full-time' | 'Part-time' | 'Temporary' | 'Internship' | 'Contract';

export type ExperienceLevel = 'Entry-level' | 'Experienced' | 'Any';

export type WorkArrangement = 'On-site' | 'Remote' | 'Hybrid';

export type JobStatus = 'active' | 'expired' | 'inactive';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  preferredLocation: string;
  preferredCategories: string[]; // category IDs or slugs
  role: Role;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Lucide icon name, e.g. "Utensils", "Hotel", "Scissors"
  description: string;
  isActive: boolean;
  displayOrder: number;
  jobCount?: number;
}

export interface JobSource {
  id: string;
  name: string;
  websiteUrl: string;
  description: string;
  isActive: boolean;
  badgeBg?: string;
  badgeText?: string;
  badgeBorder?: string;
  jobCount?: number;
  createdAt?: string;
}

export interface Job {
  id: string;
  title: string;
  employerName: string;
  employerLogo?: string;
  categoryId: string;
  categoryName?: string;
  location: string; // e.g. "Banjara Hills, Hyderabad"
  city: string; // e.g. "Hyderabad", "Warangal", "Remote"
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  workArrangement: WorkArrangement;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryDisplay: string; // e.g. "₹18,000 - ₹25,000 / mo" or "Not provided"
  salaryDisclosed: boolean;
  description: string;
  requirements: string[];
  qualifications: string[];
  perks?: string[];
  sourceId: string;
  sourceName?: string;
  originalUrl: string;
  lastVerifiedAt: string;
  expiryDate?: string | null;
  status: JobStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  categoryId: string;
  jobType: string;
  experienceLevel: string;
  workArrangement: string;
  sourceId: string;
  minSalary: number;
  salaryDisclosedOnly: boolean;
  sortBy: 'recent' | 'salary-high' | 'title';
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  createdAt: string;
  job?: Job;
}

export interface UserPreferences {
  userId: string;
  preferredCategories: string[];
  preferredJobTypes: string[];
  preferredLocation: string;
  emailNotifications: boolean;
}
