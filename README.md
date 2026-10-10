# WorkConnect — All-in-One Local Job Discovery Platform

> **Find the Right Job. Closer to You.**  
> A modern, centralized web application connecting job seekers with local businesses, frontline trades, and multiple industries across Hyderabad, Warangal, and regional hubs.

---

## 🚀 Quick Hackathon Demo Mode (Zero Setup Needed)

WorkConnect includes a built-in **Hackathon Demonstration Mode**:
- If Supabase environment variables are not yet configured, the platform **automatically launches in Demo Mode**.
- Preloaded with realistic, date-stamped vacancies across restaurants, hotels, salons, retail, logistics, education, and software.
- Full local persistence for bookmarks, user profile preferences, and admin actions using browser storage.
- A **Demo Role Switcher** in the top banner lets you seamlessly demonstrate:
  - **Guest View**: Public landing, search, and category exploration.
  - **Job Seeker View**: Personalized dashboard, bookmarks, and algorithmic matching.
  - **Admin View**: Restricted control panel to create/edit listings, categories, and sources.

---

## 🎯 Problem Statement & Core Concept

### The Problem
Job seekers struggle to find suitable local vacancies because opportunities are scattered across hundreds of disconnected websites, physical notices, social media groups, and portals. This disproportionately affects frontline workers, hospitality staff, salon beauticians, retail workers, and entry-level professionals.

### The Solution: WorkConnect
1. **Centralized Discovery**: Curates listings from direct employer career pages, local shop listings, verified public boards, and recruitment feeds into one clean interface.
2. **Job Seeker-First**: Dedicated candidate registration with **zero recruiter registration friction**. Employers do not need to create accounts; administrators curate and verify vacancies.
3. **External Attribution & Safety**: Transparent notices whenever a user navigates to an external application site, reinforcing zero-fee and verification warnings.
4. **Data-Driven Multi-Industry Categories**: Categories (Restaurants & Cafes, Hotels & Hospitality, Salons & Beauty, Retail & Shops, Delivery & Logistics, Customer Service, Education & Tutoring, Office Administration, Software & IT, Housekeeping & Maintenance, Security Services) are dynamically stored in the database.
5. **Algorithmic Recommendations**: Matches vacancies based on candidate's preferred location (e.g. Hyderabad or Warangal) and selected industries.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite | Blazing fast HMR, type safety, beginner-friendly modular code |
| **Styling** | Tailwind CSS | Modern responsive design, mobile-first, consistent design system |
| **Icons** | Lucide React | High quality, accessible vector icons for all industry categories |
| **Backend & Database** | Supabase (PostgreSQL) | Managed relational database with Row Level Security (RLS) |
| **Authentication** | Supabase Auth | Secure email/password authentication, persistent sessions |
| **Deployment** | Vercel / Netlify / Cloudflare Pages | Single-command deployment with environment variable management |

---

## 📂 Project Directory Structure

```
workconnect/
├── index.html                   # HTML entry point with Plus Jakarta Sans typography
├── package.json                 # Project dependencies & scripts
├── vite.config.ts               # Vite configuration with preserveSymlinks
├── tailwind.config.js           # Tailwind design tokens
├── tsconfig.json                # TypeScript compiler configuration
├── .env.example                 # Template for Supabase environment variables
├── .gitignore                   # Standard gitignore (secrets & dist protected)
├── supabase/
│   └── schema.sql               # Complete PostgreSQL relational schema, RLS & triggers
└── src/
    ├── types/
    │   └── index.ts             # Domain models (Job, Category, JobSource, UserProfile)
    ├── lib/
    │   ├── supabase.ts          # Safe Supabase client initialization & demo detection
    │   └── mockData.ts          # Realistic Telangana sample vacancies & seed categories
    ├── context/
    │   ├── AuthContext.tsx      # Authentication state (Supabase Auth + Demo Role Switcher)
    │   └── JobContext.tsx       # Vacancy feed, categories, sources & bookmark persistence
    └── components/
        ├── Navbar.tsx           # Responsive navigation bar with mobile drawer
        ├── DemoBanner.tsx       # Hackathon demo indicator with instant role switching
        ├── HeroSection.tsx      # Hero banner with keyword, city, & category search
        ├── CategoryCards.tsx    # Popular industry category cards with live counts
        ├── CategoryIcon.tsx     # Dynamic Lucide icon mapper for industry sectors
        ├── JobCard.tsx          # Responsive vacancy card with verified badges & save CTA
        ├── JobFilters.tsx       # Multi-dimensional filter panel (salary, type, arrangement)
        ├── JobDetailModal.tsx   # Comprehensive job details drawer & perks breakdown
        ├── ExternalRedirectModal.tsx # Candidate safety warning before external application
        ├── HowItWorks.tsx       # 3-step candidate onboarding walkthrough
        ├── TrustNotice.tsx      # Candidate safety & zero fee transparency statement
        ├── UserDashboard.tsx    # Seeker workspace with profile editor & recommendations
        ├── SavedJobsView.tsx    # Dedicated bookmarked jobs management page
        ├── CategoriesView.tsx   # Dedicated all-categories exploration page
        ├── AdminDashboard.tsx   # Restricted administrator control panel
        ├── AuthModal.tsx        # Sign-in & Sign-up modal with field validation
        ├── SupabaseSetupModal.tsx # Interactive guide explaining Supabase credentials
        └── Footer.tsx           # Platform footer with navigation & disclaimer
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
Open your terminal in the `workconnect` folder:

```bash
# Install dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser. WorkConnect will immediately run in **Demo Mode**.

### 4. Build for Production
```bash
npm run build
```

---

## 🗄️ Supabase Cloud Database Integration

When you are ready to connect WorkConnect to a live cloud database:

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**, choose a project name (e.g., `workconnect`), and set a strong database password.

### Step 2: Run Database Migration
1. In your Supabase Dashboard, open the **SQL Editor** from the left navigation.
2. Open [`supabase/schema.sql`](./supabase/schema.sql) in this repository.
3. Copy the entire file content, paste it into the Supabase SQL Editor, and click **Run**.
4. This will create:
   - `profiles` (job-seeker candidate profiles linked to auth users)
   - `categories` (industry sectors)
   - `job_sources` (external application portals)
   - `jobs` (curated vacancy listings)
   - `saved_jobs` (candidate bookmarks)
   - `user_preferences` (candidate discovery preferences)
   - Row Level Security (RLS) policies protecting each table
   - An automatic trigger `handle_new_user` on auth signups

### Step 3: Configure Environment Variables
1. In Supabase Dashboard, go to **Project Settings** → **API**.
2. Copy your **Project URL** and **anon public key**.
3. Create a `.env` file in the root `workconnect/` directory:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
   ```
4. Restart your Vite development server (`npm run dev`). WorkConnect will automatically detect the credentials and switch to live cloud database mode!

### Step 4: Configure Your First Administrator
To grant admin privileges to your account:
1. Sign up on WorkConnect with your email (e.g. `yourname@example.com`).
2. In Supabase Dashboard → **SQL Editor**, run:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'yourname@example.com';
   ```
3. Refresh the app. The **Admin Panel** tab will now be unlocked in the navigation bar!

---

## 🚢 Deployment to Vercel

1. Push your code to a GitHub repository.
2. Go to [https://vercel.com](https://vercel.com) and import the repository.
3. In **Build and Output Settings**:
   - Framework Preset: **Vite**
   - Root Directory: `workconnect` (or `./`)
4. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.
6. **Supabase Auth Redirect URL**:
   - In your Supabase Dashboard → **Authentication** → **URL Configuration**.
   - Add your Vercel deployment URL (e.g., `https://your-workconnect.vercel.app`) to the **Redirect URLs** list.

---

## 🔮 Future Roadmap (Designed for Extension)

WorkConnect's modular architecture makes it easy to add:
- [ ] **Interactive Map Discovery**: Visual leaflet/Mapbox pins for hyper-local vacancies.
- [ ] **Pincode / Ward Level Filtering**: Search by postal code within cities.
- [ ] **Multilingual Support**: Language toggle for Telugu (తెలుగు), Hindi (हिंदी), and English.
- [ ] **WhatsApp Job Sharing**: One-click sharing of verified job details to WhatsApp groups.
- [ ] **Resume Upload**: Lightweight candidate CV attachments for direct local applications.
- [ ] **Authorized Feed Ingestion**: RSS or REST API feeds from state employment exchanges.

---

## 🛡️ License & Acknowledgements

Created for hackathon demonstration and open community employment discovery.  
No recruiting fees, no data monetization, 100% transparent.
