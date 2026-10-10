import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Role } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

type DemoRole = 'guest' | 'job_seeker' | 'employer' | 'admin';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  preferredLocation: string;
  preferredCategories: string[];
  role?: 'job_seeker' | 'employer';
}

interface AuthContextType {
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  demoRole: DemoRole;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
  switchDemoRole: (role: DemoRole) => void;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

// ---------- Demo mode accounts (stored on this device only) ----------
interface DemoAccount {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: Role;
  preferredLocation: string;
  preferredCategories: string[];
  createdAt: string;
}

const ACCOUNTS_KEY = 'workconnect_demo_accounts';
const PROFILE_KEY = 'workconnect_demo_profile';

const SEED_ACCOUNTS: DemoAccount[] = [
  {
    id: 'usr-demo-seeker-1',
    email: 'vinodini@example.com',
    password: 'password123',
    fullName: 'Vinodini R.',
    role: 'job_seeker',
    preferredLocation: 'Hyderabad',
    preferredCategories: [],
    createdAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'usr-demo-employer-1',
    email: 'shop@workconnect.local',
    password: 'shop123',
    fullName: 'Demo Shop Owner',
    role: 'employer',
    preferredLocation: 'Hyderabad',
    preferredCategories: [],
    createdAt: '2026-10-02T08:00:00Z',
  },
  {
    id: 'usr-demo-admin-1',
    email: 'admin@workconnect.local',
    password: 'admin123',
    fullName: 'WorkConnect Administrator',
    role: 'admin',
    preferredLocation: 'Hyderabad',
    preferredCategories: [],
    createdAt: '2026-09-15T08:00:00Z',
  },
];

const readAccounts = (): DemoAccount[] => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) return JSON.parse(raw) as DemoAccount[];
  } catch {
    // ignore
  }
  return SEED_ACCOUNTS;
};

const writeAccounts = (list: DemoAccount[]) => {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
};

const toProfile = (a: DemoAccount): UserProfile => ({
  id: a.id,
  email: a.email,
  fullName: a.fullName,
  preferredLocation: a.preferredLocation,
  preferredCategories: a.preferredCategories,
  role: a.role,
  createdAt: a.createdAt,
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    // Demo mode: restore stored session, otherwise start as Guest
    if (!isSupabaseConfigured) {
      try {
        const stored = localStorage.getItem(PROFILE_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);
  const [demoRole, setDemoRole] = useState<DemoRole>(() => {
    if (profile?.role === 'admin') return 'admin';
    if (profile?.role === 'employer') return 'employer';
    if (profile) return 'job_seeker';
    return 'guest';
  });

  const saveSession = (p: UserProfile | null) => {
    setProfile(p);
    setDemoRole(
      !p ? 'guest' : p.role === 'admin' ? 'admin' : p.role === 'employer' ? 'employer' : 'job_seeker'
    );
    try {
      if (p) localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
      else localStorage.removeItem(PROFILE_KEY);
    } catch {
      // ignore
    }
  };

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
            fullName: data.full_name || 'User',
            preferredLocation: data.preferred_location || 'Hyderabad',
            preferredCategories: data.preferred_categories || [],
            role: (data.role as Role) || 'job_seeker',
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          });
        } else {
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

  // Kept for compatibility (not shown in the public UI)
  const switchDemoRole = (role: DemoRole) => {
    if (role === 'guest') {
      saveSession(null);
      return;
    }
    const acc = readAccounts().find((a) => a.role === role);
    if (acc) saveSession(toProfile(acc));
  };

  // Sign In
  const signIn = async (email: string, password = ''): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      const acc = readAccounts().find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
      if (!acc) return { error: 'No account found with this email. Please sign up first.' };
      if (acc.password !== password) return { error: 'Incorrect password.' };
      saveSession(toProfile(acc));
      return {};
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message || 'Failed to sign in' };
    }
  };

  // Sign Up (Job Seeker or Employer only. Admin can never be created here)
  const signUp = async (data: SignUpData): Promise<{ error?: string }> => {
    const role: Role = data.role === 'employer' ? 'employer' : 'job_seeker';

    if (!isSupabaseConfigured) {
      const list = readAccounts();
      if (list.some((a) => a.email.toLowerCase() === data.email.trim().toLowerCase())) {
        return { error: 'An account with this email already exists. Please sign in.' };
      }
      const acc: DemoAccount = {
        id: `usr-${Date.now()}`,
        email: data.email.trim(),
        password: data.password,
        fullName: data.fullName,
        role,
        preferredLocation: data.preferredLocation || 'Hyderabad',
        preferredCategories: data.preferredCategories || [],
        createdAt: new Date().toISOString(),
      };
      writeAccounts([...list, acc]);
      saveSession(toProfile(acc));
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
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          preferred_location: data.preferredLocation,
          preferred_categories: data.preferredCategories,
          role,
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
      saveSession(null);
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
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
        writeAccounts(
          readAccounts().map((a) =>
            a.id === updated.id
              ? {
                  ...a,
                  fullName: updated.fullName,
                  preferredLocation: updated.preferredLocation,
                  preferredCategories: updated.preferredCategories,
                }
              : a
          )
        );
      } catch {
        // ignore
      }
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

const ADMIN_EMAIL = 'gvinodini297@gmail.com';

const isAdmin =
  !!profile &&
  profile.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
  profile.role === 'admin';
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
