export type ApplicationStatus = 'Applied' | 'Under review' | 'Accepted' | 'Rejected';

export interface DemoApplication {
  id: string;
  role: string;
  company: string;
  industry: string;
  location: string;
  date: string;
  status: ApplicationStatus;
  applicantName: string;
  applicantSkills: string[];
  ownerNote: string;
}

export const DEMO_APPLICATIONS: DemoApplication[] = [
  {
    id: 'app-1',
    role: 'Barista',
    company: 'Sample Cafe',
    industry: 'Restaurants & Cafes',
    location: 'Hyderabad',
    date: '2026-10-05',
    status: 'Applied',
    applicantName: 'Ravi Kumar',
    applicantSkills: ['Espresso preparation', 'Customer service'],
    ownerNote: 'Awaiting owner review.',
  },
  {
    id: 'app-2',
    role: 'Frontend Developer',
    company: 'Demo Tech Solutions',
    industry: 'Software & IT',
    location: 'Hyderabad',
    date: '2026-10-04',
    status: 'Under review',
    applicantName: 'Anitha Reddy',
    applicantSkills: ['HTML & CSS', 'JavaScript', 'React'],
    ownerNote: 'Portfolio looks good. Shortlisted for interview.',
  },
  {
    id: 'app-3',
    role: 'Front Office Executive',
    company: 'Demo Hotel Group',
    industry: 'Hotels & Hospitality',
    location: 'Warangal',
    date: '2026-10-02',
    status: 'Accepted',
    applicantName: 'Suresh Babu',
    applicantSkills: ['Communication', 'Hotel software', 'Guest handling'],
    ownerNote: 'Selected. Joining date will be shared.',
  },
  {
    id: 'app-4',
    role: 'Sales Executive',
    company: 'Sample Retail Store',
    industry: 'Retail & Shopping',
    location: 'Warangal',
    date: '2026-10-01',
    status: 'Accepted',
    applicantName: 'Lakshmi Devi',
    applicantSkills: ['Communication', 'Negotiation', 'Product knowledge'],
    ownerNote: 'Selected after interview.',
  },
  {
    id: 'app-5',
    role: 'Delivery Executive',
    company: 'Demo Logistics',
    industry: 'Logistics & Delivery',
    location: 'Hyderabad',
    date: '2026-09-30',
    status: 'Rejected',
    applicantName: 'Mahesh Goud',
    applicantSkills: ['Two-wheeler riding', 'Route knowledge'],
    ownerNote: 'Driving licence document missing.',
  },
  {
    id: 'app-6',
    role: 'Nurse',
    company: 'Sample Clinic',
    industry: 'Healthcare',
    location: 'Hyderabad',
    date: '2026-09-28',
    status: 'Under review',
    applicantName: 'Priya Sharma',
    applicantSkills: ['Patient care', 'Medication administration'],
    ownerNote: 'Documents under verification.',
  },
  {
    id: 'app-7',
    role: 'Data Analyst',
    company: 'Demo Tech Solutions',
    industry: 'Software & IT',
    location: 'Hyderabad',
    date: '2026-09-27',
    status: 'Applied',
    applicantName: 'Karthik Rao',
    applicantSkills: ['Excel', 'SQL', 'Power BI'],
    ownerNote: 'Awaiting owner review.',
  },
];
