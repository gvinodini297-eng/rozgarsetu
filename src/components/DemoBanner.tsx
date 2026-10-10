import React from 'react';
import { Database, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DemoBannerProps {
  onOpenSetupGuide: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onOpenSetupGuide }) => {
  const { isDemoMode } = useAuth();

  if (!isDemoMode) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="font-semibold text-indigo-300">Prototype Demo:</span>
          <span className="hidden sm:inline text-slate-300">
            Sample job roles and listings. Accounts and posts are saved on this device only.
          </span>
          <span className="sm:hidden text-slate-300">Sample data only</span>
        </div>

        <button
          onClick={onOpenSetupGuide}
          className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Connect Supabase</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
