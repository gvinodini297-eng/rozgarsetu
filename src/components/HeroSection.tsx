import React, { useState } from 'react';
import { Search, MapPin, Layers, ArrowRight, ShieldCheck, CheckCircle2, Building, Sparkles } from 'lucide-react';
import { Category } from '../types';

interface HeroSectionProps {
  categories: Category[];
  onSearch: (keywords: string, location: string, categoryId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ categories, onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, location, selectedCategory);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Aggregator Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Local Discovery • Hyderabad & Warangal Openings</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5">
          Find the Right Job.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-teal-300">
            Closer to You.
          </span>
        </h1>

        {/* Supporting Subheading */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
          Discover job opportunities from local businesses and multiple industries, all in one centralized platform.
          No more searching through dozens of disconnected websites.
        </p>

        {/* Search Bar Container */}
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-700/80 p-2.5 sm:p-3 rounded-2xl shadow-2xl shadow-indigo-950/30 backdrop-blur-md grid grid-cols-1 sm:grid-cols-12 gap-2 text-left"
        >
          {/* Keywords input */}
          <div className="sm:col-span-5 relative flex items-center bg-slate-800/80 rounded-xl px-3 py-2.5 border border-slate-700/50 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition">
            <Search className="w-5 h-5 text-slate-400 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title, keywords, or employer..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Location input */}
          <div className="sm:col-span-3 relative flex items-center bg-slate-800/80 rounded-xl px-3 py-2.5 border border-slate-700/50 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition">
            <MapPin className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City (e.g. Hyderabad, Warangal)"
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-2 relative flex items-center bg-slate-800/80 rounded-xl px-2.5 py-2.5 border border-slate-700/50 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition">
            <Layers className="w-4 h-4 text-slate-400 mr-1.5 flex-shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent text-xs text-white focus:outline-none cursor-pointer truncate"
            >
              <option value="all" className="bg-slate-900 text-white">All Categories</option>
              {categories
                .filter((c) => c.isActive)
                .map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Submit Search Button */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full h-full min-h-[44px] bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Aggregation Explanation & Trust Tags */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aggregates official career portals & local business direct notices</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>100% Free for job seekers • No candidate fees</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>Original source URLs provided for transparent application</span>
          </div>
        </div>
      </div>
    </section>
  );
};
