import React, { useState } from 'react';
import { X, Database, Key, Copy, Check, Terminal, Shield, ArrowRight } from 'lucide-react';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const envSample = `# Supabase Cloud Credentials for WorkConnect
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key...`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-750 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Supabase Integration Guide</h3>
            <p className="text-xs text-slate-400">
              Connect your live cloud PostgreSQL database and Supabase Auth
            </p>
          </div>
        </div>

        <div className="space-y-5 text-xs text-slate-300">
          {/* Step 1 */}
          <div className="bg-slate-800/60 border border-slate-750 rounded-xl p-4">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Create Free Supabase Project</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Visit <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline">supabase.com</a>, create a free organization and project. In project settings, navigate to <strong>API Settings</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800/60 border border-slate-750 rounded-xl p-4">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Configure Environment Variables</span>
            </div>
            <p className="text-slate-400 mb-2">
              Create a <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">.env</code> file in your project directory with your project URL and public anon key:
            </p>
            <div className="relative bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
              <pre>{envSample}</pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Copy .env template"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800/60 border border-slate-750 rounded-xl p-4">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                3
              </span>
              <span>Run Database Migration in SQL Editor</span>
            </div>
            <p className="text-slate-400 mb-2">
              In your Supabase Dashboard, open <strong>SQL Editor</strong>, open or paste the provided <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">supabase/schema.sql</code> file, and click <strong>Run</strong>. This creates all 6 tables, Row Level Security policies, and auto-profile triggers.
            </p>
          </div>

          {/* Step 4: Admin Promotion */}
          <div className="bg-slate-800/60 border border-slate-750 rounded-xl p-4">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">
                4
              </span>
              <span>Promote Administrator Account</span>
            </div>
            <p className="text-slate-400 mb-2">
              After signing up with your email on WorkConnect, execute this single query in Supabase SQL editor to grant admin privileges safely without hardcoded secrets:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400">
              UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
          >
            Got It, Back to App
          </button>
        </div>
      </div>
    </div>
  );
};
