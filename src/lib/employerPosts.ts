import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

export type PostJobType = 'Part-time' | 'Full-time' | 'Temporary';

export interface EmployerPost {
  id: string;
  ownerId: string;
  industryId: string;
  role: string;
  businessName: string;
  area: string;
  city: string;
  jobType: PostJobType;
  salary: string;
  experience: string;
  qualification: string;
  skills: string[];
  description: string;
  openings: number;
  status: 'active' | 'closed';
  createdAt: string;
  isSample?: boolean;
}

export interface NewPostInput {
  industryId: string;
  role: string;
  businessName: string;
  area: string;
  city: string;
  jobType: PostJobType;
  salary: string;
  experience: string;
  qualification: string;
  skills: string[];
  description: string;
  openings: number;
  phone: string;
}

const POSTS_KEY = 'workconnect_employer_posts';
const CONTACTS_KEY = 'workconnect_employer_contacts';

// Sample posts shown in demo mode only (clearly labelled "Sample")
const SAMPLE_POSTS: EmployerPost[] = [
  {
    id: 'sample-1',
    ownerId: 'sample',
    industryId: 'restaurant',
    role: 'Barista',
    businessName: 'Sample Cafe',
    area: 'Banjara Hills',
    city: 'Hyderabad',
    jobType: 'Part-time',
    salary: '₹8,000 - ₹12,000 / month',
    experience: 'Fresher',
    qualification: '10th / Intermediate',
    skills: ['Customer service', 'POS billing', 'Cleanliness'],
    description: 'Evening shifts, 4 hours per day. Training provided.',
    openings: 2,
    status: 'active',
    createdAt: '2026-10-08T10:00:00Z',
    isSample: true,
  },
  {
    id: 'sample-2',
    ownerId: 'sample',
    industryId: 'retail',
    role: 'Retail Associate',
    businessName: 'Sample General Store',
    area: 'Kazipet',
    city: 'Warangal',
    jobType: 'Part-time',
    salary: '₹6,000 - ₹9,000 / month',
    experience: 'Fresher',
    qualification: '10th pass',
    skills: ['Customer service', 'Billing', 'Basic maths'],
    description: 'Morning or evening shift at a neighbourhood store.',
    openings: 1,
    status: 'active',
    createdAt: '2026-10-07T10:00:00Z',
    isSample: true,
  },
  {
    id: 'sample-3',
    ownerId: 'sample',
    industryId: 'education',
    role: 'Tutor',
    businessName: 'Sample Tuition Centre',
    area: 'Hanamkonda',
    city: 'Warangal',
    jobType: 'Part-time',
    salary: '₹8,000 - ₹15,000 / month',
    experience: 'Any',
    qualification: 'Graduate / final-year student',
    skills: ['Subject knowledge', 'Clear explanation', 'Patience'],
    description: 'Evening classes for Class 8-10 students, 2 hours per day.',
    openings: 2,
    status: 'active',
    createdAt: '2026-10-06T10:00:00Z',
    isSample: true,
  },
  {
    id: 'sample-4',
    ownerId: 'sample',
    industryId: 'logistics',
    role: 'Delivery Executive',
    businessName: 'Sample Kirana Delivery',
    area: 'Madhapur',
    city: 'Hyderabad',
    jobType: 'Part-time',
    salary: '₹10,000 - ₹16,000 / month',
    experience: 'Fresher',
    qualification: '10th pass; valid driving licence',
    skills: ['Two-wheeler riding', 'Route knowledge', 'Time management'],
    description: 'Local grocery deliveries in the evening, own bike needed.',
    openings: 3,
    status: 'active',
    createdAt: '2026-10-05T10:00:00Z',
    isSample: true,
  },
];

const SAMPLE_CONTACTS: Record<string, string> = {
  'sample-1': '9000000001',
  'sample-2': '9000000002',
  'sample-3': '9000000003',
  'sample-4': '9000000004',
};

// ---------- local (demo mode) storage ----------
const readLocalPosts = (): EmployerPost[] => {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(SAMPLE_POSTS));
  } catch {
    // ignore
  }
  return SAMPLE_POSTS;
};

const writeLocalPosts = (posts: EmployerPost[]) => {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch {
    // ignore
  }
};

const readLocalContacts = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(CONTACTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { ...SAMPLE_CONTACTS };
};

const writeLocalContacts = (contacts: Record<string, string>) => {
  try {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  } catch {
    // ignore
  }
};

// ---------- Supabase row mapping ----------
const fromRow = (r: any): EmployerPost => ({
  id: r.id,
  ownerId: r.owner_id,
  industryId: r.industry_id,
  role: r.role,
  businessName: r.business_name,
  area: r.area || '',
  city: r.city || '',
  jobType: r.job_type,
  salary: r.salary || '',
  experience: r.experience || '',
  qualification: r.qualification || '',
  skills: r.skills || [],
  description: r.description || '',
  openings: r.openings || 1,
  status: r.status || 'active',
  createdAt: r.created_at,
});

// ---------- public API ----------
export const loadPosts = async (): Promise<EmployerPost[]> => {
  if (!isSupabaseConfigured) return readLocalPosts();
  try {
    const { data, error } = await supabase
      .from('employer_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(fromRow);
  } catch {
    return [];
  }
};

export const createPost = async (
  input: NewPostInput,
  ownerId: string
): Promise<{ error?: string }> => {
  const { phone, ...rest } = input;

  if (!isSupabaseConfigured) {
    const post: EmployerPost = {
      ...rest,
      id: `post-${Date.now()}`,
      ownerId,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    writeLocalPosts([post, ...readLocalPosts()]);
    const contacts = readLocalContacts();
    contacts[post.id] = phone;
    writeLocalContacts(contacts);
    return {};
  }

  try {
    const { data, error } = await supabase
      .from('employer_posts')
      .insert({
        owner_id: ownerId,
        industry_id: rest.industryId,
        role: rest.role,
        business_name: rest.businessName,
        area: rest.area,
        city: rest.city,
        job_type: rest.jobType,
        salary: rest.salary,
        experience: rest.experience,
        qualification: rest.qualification,
        skills: rest.skills,
        description: rest.description,
        openings: rest.openings,
      })
      .select('id')
      .single();

    if (error || !data) return { error: error?.message || 'Failed to save post' };

    const { error: contactError } = await supabase
      .from('employer_contacts')
      .insert({ post_id: data.id, phone });
    if (contactError) return { error: contactError.message };

    return {};
  } catch (err: any) {
    return { error: err.message || 'Failed to save post' };
  }
};

export const setPostStatus = async (
  id: string,
  status: 'active' | 'closed'
): Promise<{ error?: string }> => {
  if (!isSupabaseConfigured) {
    writeLocalPosts(readLocalPosts().map((p) => (p.id === id ? { ...p, status } : p)));
    return {};
  }
  try {
    const { error } = await supabase.from('employer_posts').update({ status }).eq('id', id);
    if (error) return { error: error.message };
    return {};
  } catch (err: any) {
    return { error: err.message };
  }
};

export const getContact = async (postId: string): Promise<string | null> => {
  if (!isSupabaseConfigured) {
    return readLocalContacts()[postId] || null;
  }
  try {
    const { data } = await supabase
      .from('employer_contacts')
      .select('phone')
      .eq('post_id', postId)
      .maybeSingle();
    return data?.phone || null;
  } catch {
    return null;
  }
};

export const useEmployerPosts = () => {
  const [posts, setPosts] = useState<EmployerPost[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setPosts(await loadPosts());
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { posts, loading, reload };
};
