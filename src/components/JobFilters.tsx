import React from 'react';
import {
  RotateCcw,
  SlidersHorizontal,
  MapPin,
  Layers,
  Briefcase,
  IndianRupee,
  Building,
  Check,
} from 'lucide-react';
import { FilterState, Category, JobSource } from '../types';

interface JobFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: Category[];
  sources: JobSource[];
  activeFilterCount: number;
  onClearAll: () => void;
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Temporary', 'Internship', 'Contract'];
const EXPERIENCE_LEVELS = ['Entry-level', 'Experienced', 'Any'];
const WORK_ARRANGEMENTS = ['On-site', 'Remote', 'Hybrid'];
const POPULAR_LOCATIONS = ['All Locations', 'Hyderabad', 'Warangal', 'Remote'];

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  setFilters,
  categories,
  sources,
  activeFilterCount,
  onClearAll,
}) => {
  const activeCategories = categories.filter((c) => c.isActive);
  const activeSources = sources.filter((s) => s.isActive);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-6">
      {/* Filter Header & Clear All */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Filter Vacancies</h3>
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Location / City Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          <span>City / Location</span>
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {POPULAR_LOCATIONS.map((loc) => {
            const isSelected =
              (loc === 'All Locations' && filters.city === '') ||
              filters.city.toLowerCase() === loc.toLowerCase();
            return (
              <button
                key={loc}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    city: loc === 'All Locations' ? '' : loc,
                  }))
                }
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
          placeholder="Filter by locality (e.g. Hanamkonda, Madhapur)"
          className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* 2. Category Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Category / Industry</span>
        </label>
        <select
          value={filters.categoryId}
          onChange={(e) => setFilters((prev) => ({ ...prev, categoryId: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="all">All Categories ({categories.length})</option>
          {activeCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.jobCount ? `(${c.jobCount})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Job Type Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
          <span>Job Type</span>
        </label>
        <div className="space-y-1.5">
          <label className="flex items-center text-xs text-slate-300 cursor-pointer">
            <input
              type="radio"
              name="jobType"
              checked={filters.jobType === 'all'}
              onChange={() => setFilters((prev) => ({ ...prev, jobType: 'all' }))}
              className="mr-2 text-indigo-600 rounded bg-slate-800 border-slate-700 focus:ring-0"
            />
            All Job Types
          </label>
          {JOB_TYPES.map((type) => (
            <label key={type} className="flex items-center text-xs text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="jobType"
                checked={filters.jobType === type}
                onChange={() => setFilters((prev) => ({ ...prev, jobType: type }))}
                className="mr-2 text-indigo-600 rounded bg-slate-800 border-slate-700 focus:ring-0"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* 4. Work Arrangement */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">
          Work Arrangement
        </label>
        <div className="grid grid-cols-3 gap-1">
          {['all', ...WORK_ARRANGEMENTS].map((mode) => {
            const isSelected = filters.workArrangement === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, workArrangement: mode }))}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition text-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {mode === 'all' ? 'Any' : mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Experience Level */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">
          Experience Level
        </label>
        <div className="grid grid-cols-3 gap-1">
          {['all', ...EXPERIENCE_LEVELS].map((exp) => {
            const isSelected = filters.experienceLevel === exp;
            return (
              <button
                key={exp}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, experienceLevel: exp }))}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition text-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {exp === 'all' ? 'Any' : exp}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Listing Source */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-amber-400" />
          <span>Listing Source</span>
        </label>
        <select
          value={filters.sourceId}
          onChange={(e) => setFilters((prev) => ({ ...prev, sourceId: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="all">All Sources ({sources.length})</option>
          {activeSources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* 7. Salary Disclosed Only Toggle */}
      <div className="pt-2 border-t border-slate-800">
        <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
          <span className="flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            <span>Salary Disclosed Only</span>
          </span>
          <input
            type="checkbox"
            checked={filters.salaryDisclosedOnly}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, salaryDisclosedOnly: e.target.checked }))
            }
            className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
