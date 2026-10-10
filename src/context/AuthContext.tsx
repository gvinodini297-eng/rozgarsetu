import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Role } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  preferredLocation: string;
  preferredCategories: string[];
}

interface AuthContextType {
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  demoRole: 'guest' | 'job_seeker' | 'admin';
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
  switchDemoRole: (role: 'guest' | 'job_seeker' | 'admin') => void;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const DEMO_JOB_SEEKER: UserProfile = {
  id: 'usr-demo-seeker-1',
  email: 'vinodini@example.com',
  fullName: 'Vinodini R.',
  preferredLocation: 'Hyderabad',
  preferredCategories: ['cat-restaurants', 'cat-software', 'cat-retail'],
  role: 'job_seeker',
  createdAt: '2026-10-01T08:00:00Z',
};

const DEMO_ADMIN: UserProfile = {
  id: 'usr-demo-admin-1',
  email: 'admin@workconnect.local',
  fullName: 'WorkConnect Administrator',
  preferredLocation: 'Hyderabad',
  preferredCategories: [],
  role: 'admin',
  createdAt: '2026-09-15T08:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    // If running in demo mode, restore stored demo session or default to demo job seeker
    if (!isSupabaseConfigured) {
      try {
        const stored = localStorage.getItem('workconnect_demo_profile');
        return stored ? JSON.parse(stored) : DEMO_JOB_SEEKER;
      } catch {
        return DEMO_JOB_SEEKER;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);
  const [demoRole, setDemoRole] = useState<'guest' | 'job_seeker' | 'admin'>(() => {
    if (profile?.role === 'admin') return 'admin';
    if (profile) return 'job_seeker';
    return 'guest';
  });

  // Sync Supabase Auth if credentials are configured
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async (userId: string, email: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (data && !error) {
          setProfile({
            id: data.id,
            email: data.email || email,
            fullName: data.full_name || 'Job Seeker',
            preferredLocation: data.preferred_location || 'Hyderabad',
            preferredCategories: data.preferred_categories || [],
            role: (data.role as Role) || 'job_seeker',
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          });
        } else {
          // Fallback if profile row is not yet created
          setProfile({
            id: userId,
            email: email,
            fullName: email.split('@')[0],
            preferredLocation: 'Hyderabad',
            preferredCategories: [],
            role: 'job_seeker',
            createdAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Error fetching Supabase profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Quick Demo Role Switcher
  const switchDemoRole = (role: 'guest' | 'job_seeker' | 'admin') => {
    setDemoRole(role);
    if (role === 'guest') {
      setProfile(null);
      localStorage.removeItem('workconnect_demo_profile');
    } else if (role === 'job_seeker') {
      setProfile(DEMO_JOB_SEEKER);
      localStorage.setItem('workconnect_demo_profile', JSON.stringify(DEMO_JOB_SEEKER));
    } else if (role === 'admin') {
      setProfile(DEMO_ADMIN);
      localStorage.setItem('workconnect_demo_profile', JSON.stringify(DEMO_ADMIN));
    }
  };

  // Sign In
  const signIn = async (email: string, password = ''): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      // Demo Mode authentication logic
      if (email.toLowerCase().includes('admin')) {
        setProfile(DEMO_ADMIN);
        setDemoRole('admin');
        localStorage.setItem('workconnect_demo_profile', JSON.stringify(DEMO_ADMIN));
      } else {
        const seeker: UserProfile = {
          ...DEMO_JOB_SEEKER,
          email,
          fullName: email.split('@')[0] || 'Job Seeker',
        };
        setProfile(seeker);
        setDemoRole('job_seeker');
        localStorage.setItem('workconnect_demo_profile', JSON.stringify(seeker));
      }
      return {};
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message || 'Failed to sign in' };
    }
  };

  // Sign Up
  const signUp = async (data: SignUpData): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      // Demo Mode registration logic
      const newSeeker: UserProfile = {
        id: `usr-${Date.now()}`,
        email: data.email,
        fullName: data.fullName,
        preferredLocation: data.preferredLocation || 'Hyderabad',
        preferredCategories: data.preferredCategories || [],
        role: 'job_seeker',
        createdAt: new Date().toISOString(),
      };
      setProfile(newSeeker);
      setDemoRole('job_seeker');
      localStorage.setItem('workconnect_demo_profile', JSON.stringify(newSeeker));
      return {};
    }

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            preferred_location: data.preferredLocation,
            preferred_categories: data.preferredCategories,
          },
        },
      });

      if (error) return { error: error.message };

      if (authData.user) {
        // Attempt immediate profile insertion or let Supabase trigger handle it
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          preferred_location: data.preferredLocation,
          preferred_categories: data.preferredCategories,
          role: 'job_seeker',
        });
      }

      return {};
    } catch (err: any) {
      return { error: err.message || 'Failed to register account' };
    }
  };

  // Sign Out
  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setProfile(null);
      setDemoRole('guest');
      localStorage.removeItem('workconnect_demo_profile');
      return;
    }

    await supabase.auth.signOut();
    setProfile(null);
  };

  // Update Profile
  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error?: string }> => {
    if (!profile) return { error: 'No user signed in' };

    const updated = { ...profile, ...updates, updatedAt: new Date().toISOString() };
    setProfile(updated);

    if (!isSupabaseConfigured) {
      localStorage.setItem('workconnect_demo_profile', JSON.stringify(updated));
      return {};
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updated.fullName,
          preferred_location: updated.preferredLocation,
          preferred_categories: updated.preferredCategories,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message || 'Failed to update profile' };
    }
  };

  // Reset Password
  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      return {};
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message || 'Password reset failed' };
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        profile,
        isAdmin,
        isLoading,
        isDemoMode: !isSupabaseConfigured,
        demoRole,
        signIn,
        signUp,
        signOut,
        updateProfile,
        switchDemoRole,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
