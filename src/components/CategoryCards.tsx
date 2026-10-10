import React from 'react';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  HeartPulse,
  Hotel,
  Landmark,
  ShoppingBag,
  Truck,
  Utensils,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';

interface CategoryCardsProps {
  categories?: unknown[];
  onSelectCategory: (categoryId: string) => void;
}

export industries = [
  {
    id: 'software',
    name: 'Software & IT',
    description: 'Explore technology and software career roles.',
    icon: BriefcaseBusiness,
    roles: [
      'AI Engineer',
      'Prompt Engineer',
      'Java Developer',
      'Python Developer',
      'Frontend Developer',
      'Backend Developer',
      'Data Analyst',
      'Cybersecurity Engineer',
      'Cloud Engineer',
      'UI/UX Designer',
    ],
  },
  {
    id: 'restaurant',
    name: 'Restaurants & Cafes',
    description: 'Discover roles across restaurants and food services.',
    icon: Utensils,
    roles: [
      'Chef',
      'Sous Chef',
      'Waiter',
      'Receptionist',
      'Cashier',
      'Kitchen Helper',
      'Barista',
      'Restaurant Manager',
    ],
  },
  {
    id: 'hospitality',
    name: 'Hotels & Hospitality',
    description: 'Explore hotel, guest service and hospitality roles.',
    icon: Hotel,
    roles: [
      'Front Office Executive',
      'Receptionist',
      'Housekeeping Staff',
      'Hotel Manager',
      'Guest Relations Executive',
      'Chef',
      'Event Coordinator',
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Explore careers in hospitals, clinics and healthcare.',
    icon: HeartPulse,
    roles: [
      'Nurse',
      'Pharmacist',
      'Lab Technician',
      'Receptionist',
      'Medical Assistant',
      'Caregiver',
      'Hospital Administrator',
    ],
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Teaching, tutoring and academic support roles.',
    icon: GraduationCap,
    roles: [
      'School Teacher',
      'Maths Teacher',
      'Science Teacher',
      'English Teacher',
      'Tutor',
      'Academic Counselor',
      'Lab Assistant',
    ],
  },
  {
    id: 'finance',
    name: 'Banking & Finance',
    description: 'Explore banking, accounting and financial roles.',
    icon: Landmark,
    roles: [
      'Accountant',
      'Banking Associate',
      'Financial Analyst',
      'Loan Officer',
      'Cashier',
      'Relationship Manager',
      'Insurance Advisor',
    ],
  },
  {
    id: 'retail',
    name: 'Retail & Shopping',
    description: 'Explore jobs in stores, sales and customer service.',
    icon: ShoppingBag,
    roles: [
      'Sales Executive',
      'Store Manager',
      'Cashier',
      'Customer Support Executive',
      'Inventory Assistant',
      'Retail Associate',
      'Store Supervisor',
    ],
  },
  {
    id: 'logistics',
    name: 'Logistics & Delivery',
    description: 'Find opportunities in transport and delivery services.',
    icon: Truck,
    roles: [
      'Delivery Executive',
      'Warehouse Assistant',
      'Logistics Coordinator',
      'Driver',
      'Inventory Executive',
      'Fleet Supervisor',
    ],
  },
  {
    id: 'security',
    name: 'Security Services',
    description: 'Security and safety-related career opportunities.',
    icon: ShieldCheck,
    roles: [
      'Security Guard',
      'Security Supervisor',
      'CCTV Operator',
      'Security Officer',
      'Event Security Staff',
    ],
  },
  {
    id: 'construction',
    name: 'Construction & Skilled Trades',
    description: 'Explore construction and technical trade roles.',
    icon: Wrench,
    roles: [
      'Electrician',
      'Plumber',
      'Site Supervisor',
      'Civil Engineer',
      'Welder',
      'Carpenter',
      'Construction Helper',
    ],
  },
  {
    id: 'office',
    name: 'Office & Administration',
    description: 'Administrative and office support opportunities.',
    icon: Building2,
    roles: [
      'Office Assistant',
      'Receptionist',
      'Data Entry Operator',
      'HR Executive',
      'Administrative Assistant',
      'Customer Support Executive',
    ],
  },
];

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  onSelectCategory,
}) => {
  return (
    <section className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore by Industry</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Find Jobs by Industry
          </h2>

          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Choose an industry to explore different job roles and career
            opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((industry) => {
            const Icon = industry.icon;

            return (
              <div
                key={industry.id}
                onClick={() => onSelectCategory(industry.id)}
                className="group relative bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition" />
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                  {industry.name}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {industry.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <p className="text-[11px] text-indigo-400 font-semibold">
                    {industry.roles.length} job roles
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
