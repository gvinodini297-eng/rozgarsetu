import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Store,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';

type AuthRole = 'job_seeker' | 'employer';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup';
  initialRole?: AuthRole;
}

const inputCls =
  'w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signin',
  initialRole = 'job_seeker',
}) => {
  const { signIn, signUp, resetPassword, isDemoMode } = useAuth();
  const { categories } = useJobs();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialTab);
  const [role, setRole] = useState<AuthRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('Hyderabad');
  const [preferredCategories, setPreferredCategories] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset every time the modal is opened
  useEffect(() => {
    if (isOpen) {
      setMode(initialTab);
      setRole(initialRole);
      setErrorMsg('');
      setSuccessMsg('');
      setPassword('');
      setConfirmPassword('');
    }
  }, [isOpen, initialTab, initialRole]);

  if (!isOpen) return null;

  const isEmployer = role === 'employer';

  const handleCategoryToggle = (id: string) => {
    setPreferredCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      setLoading(false);
      return;
    }

    const res = await signIn(email, password);
    setLoading(false);

    if (res.error) setErrorMsg(res.error);
    else onClose();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const fail = (msg: string) => {
      setErrorMsg(msg);
      setLoading(false);
    };

    if (!fullName.trim()) return fail('Please enter your name.');
    if (!email.trim() || !email.includes('@')) return fail('Please enter a valid email address.');
    if (password.length < 6) return fail('Password must be at least 6 characters long.');
    if (password !== confirmPassword) return fail('Passwords do not match.');
    if (!agreeTerms) return fail('Please accept the terms to continue.');

    const res = await signUp({
      fullName,
      email,
      password,
      preferredLocation,
      preferredCategories: isEmployer ? [] : preferredCategories,
      role,
    });
    setLoading(false);

    if (res.error) setErrorMsg(res.error);
    else onClose();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!email) {
      setErrorMsg('Please enter your account email.');
      setLoading(false);
      return;
    }

    const res = await resetPassword(email);
    setLoading(false);

    if (res.error) setErrorMsg(res.error);
    else setSuccessMsg('Password reset link sent! Check your inbox.');
  };

  const fillQuickDemo = (r: AuthRole) => {
    if (r === 'job_seeker') {
      setEmail('vinodini@example.com');
      setPassword('password123');
    } else {
      setEmail('shop@workconnect.local');
      setPassword('shop123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {mode === 'signin' && (isEmployer ? 'Employer Sign In' : 'Job Seeker Sign In')}
            {mode === 'signup' && (isEmployer ? 'Create Employer Account' : 'Create Job Seeker Account')}
            {mode === 'forgot' && 'Reset Password'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'signin' &&
              (isEmployer
                ? 'Sign in to post jobs for your shop or business'
                : 'Sign in to contact employers and track your jobs')}
            {mode === 'signup' &&
              (isEmployer
                ? 'Shop owners and local businesses can post jobs for free'
                : 'Join for free to find jobs and contact employers')}
            {mode === 'forgot' && 'Enter your registered email to receive a recovery link'}
          </p>
        </div>

        {/* Role selector */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 gap-1 p-1 mb-5 bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('job_seeker')}
              className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                !isEmployer ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                isEmployer ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Employer
            </button>
          </div>
        )}

        {/* Demo quick fill */}
        {isDemoMode && mode === 'signin' && (
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Demo account:
            </span>
            <button
              type="button"
              onClick={() => fillQuickDemo(role)}
              className="text-[11px] px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition"
            >
              Fill {isEmployer ? 'Employer' : 'Job Seeker'}
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIGN IN */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={inputCls + ' pr-9'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 text-white font-semibold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-1.5 ${
                isEmployer
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Don't have an account? </span>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Sign Up for free
              </button>
            </div>
          </form>
        )}

        {/* SIGN UP */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isEmployer ? 'Your Name / Shop Owner Name' : 'Full Name'}
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-500 absolute left-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isEmployer ? 'e.g. Ramesh (Sri Sai Stores)' : 'e.g. Vinodini'}
                  required
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  required
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat"
                  required
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isEmployer ? 'Shop / Business City' : 'Preferred Locality / City'}
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3" />
                <input
                  type="text"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  placeholder="e.g. Hyderabad, Warangal"
                  className={inputCls}
                />
              </div>
            </div>

            {!isEmployer && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Preferred Industries (Optional)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 rounded-xl border border-slate-800">
                  {categories
                    .filter((c) => c.isActive)
                    .map((cat) => {
                      const selected = preferredCategories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategoryToggle(cat.id)}
                          className={`text-[11px] px-2 py-0.5 rounded-lg transition ${
                            selected
                              ? 'bg-indigo-600 text-white font-medium'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            <label className="flex items-start gap-2 text-[11px] text-slate-400 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded text-indigo-600 bg-slate-800 border-slate-700"
              />
              <span>
                {isEmployer
                  ? 'I confirm the jobs I post will be genuine, and the contact details I share are my own.'
                  : 'I agree to the Terms of Service and Privacy Policy.'}
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 text-white font-semibold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-1.5 ${
                isEmployer
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            </button>

            <div className="text-center pt-1">
              <span className="text-xs text-slate-400">Already registered? </span>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT */}
        {mode === 'forgot' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className={inputCls}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition"
            >
              {loading ? 'Sending Link...' : 'Send Recovery Link'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
