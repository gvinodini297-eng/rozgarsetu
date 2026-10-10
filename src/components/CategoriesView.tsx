import React, { useState } from 'react';
import { Layers, Search, ArrowUpRight, Sparkles } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { CategoryIcon } from './CategoryIcon';

interface CategoriesViewProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ onSelectCategory }) => {
  const { categories } = useJobs();
  const [search, setSearch] = useState('');

  const activeCategories = categories.filter((c) => c.isActive);
  const filtered = activeCategories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Industry Sectors</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              All Job Categories
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore opportunities segmented by specific local trades, frontline roles, and services.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search industries..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group bg-slate-900/60 hover:bg-slate-850/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <CategoryIcon name={category.icon} className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 group-hover:border-indigo-500/30">
                    {category.jobCount ?? 0} {category.jobCount === 1 ? 'opening' : 'openings'}
                  </span>
                </div>

                <h2 className="text-base font-bold text-white group-hover:text-indigo-300 transition mb-1.5 flex items-center justify-between">
                  <span>{category.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-indigo-400 transition" />
                </h2>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>View {category.name} Openings</span>
                <span className="text-slate-500 group-hover:text-indigo-400 font-mono">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
