import React from 'react';
import { Category } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface CategoryCardsProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ categories, onSelectCategory }) => {
  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <section className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore by Industry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Popular Local Categories
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Discover opportunities across frontline, hospitality, retail, office, and technical trades.
            </p>
          </div>
        </div>

        {/* Dynamic Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group relative bg-slate-900/60 hover:bg-slate-850/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20 flex flex-col justify-between"
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

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition mb-1.5 flex items-center justify-between">
                  <span>{category.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-indigo-400 transition" />
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-[11px] font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>View listings in {category.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
