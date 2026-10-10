import React from 'react';
import { Briefcase, ShieldCheck, Heart, ExternalLink, MapPin, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: 'home' | 'explore' | 'categories' | 'saved' | 'admin') => void;
  onOpenSetupGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenSetupGuide }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-850 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-2 space-y-3">
            <div
              onClick={() => onNavigateTab('home')}
              className="flex items-center gap-2 cursor-pointer max-w-fit"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">
                Work<span className="text-indigo-500">Connect</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              An all-in-one local job discovery platform connecting job seekers with frontline, hospitality, salon, retail, logistics, and technical opportunities across Hyderabad, Warangal, and regional hubs.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Date-verified vacancies
              </span>
              <span>•</span>
              <span className="text-indigo-400">External attribution</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateTab('home')}
                  className="hover:text-white transition"
                >
                  Home Landing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('explore')}
                  className="hover:text-white transition"
                >
                  Explore Vacancies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('categories')}
                  className="hover:text-white transition"
                >
                  Multi-Industry Sectors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('saved')}
                  className="hover:text-white transition"
                >
                  Bookmarked Jobs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Developer & Architecture */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Developer & Setup</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={onOpenSetupGuide}
                  className="hover:text-indigo-400 transition flex items-center gap-1"
                >
                  <span>Supabase Cloud Integration</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('admin')}
                  className="hover:text-amber-400 transition"
                >
                  Admin Control Panel
                </button>
              </li>
              <li className="text-[11px] text-slate-500">
                Stack: React 18 • TypeScript • Tailwind CSS • Supabase PostgreSQL • Lucide
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} WorkConnect. Built for transparent local job discovery. No candidate fees or commissions.
          </p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            <span>for Hackathons & Community Impact</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
