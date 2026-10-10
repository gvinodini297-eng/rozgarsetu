import React, { useState } from 'react';
import {
  PlusCircle,
  ClipboardList,
  MapPin,
  Info,
  CheckCircle2,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { industries } from './CategoryCards';
import { getRoleInfo } from '../lib/roleDemoData';
import {
  useEmployerPosts,
  createPost,
  setPostStatus,
  PostJobType,
} from '../lib/employerPosts';

const inputCls =
  'w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition';
const labelCls = 'block text-xs font-semibold text-slate-300 mb-1.5';

export const EmployerHome: React.FC = () => {
  const { profile, isDemoMode } = useAuth();
  const { posts, loading, reload } = useEmployerPosts();

  const [view, setView] = useState<'post' | 'mine'>('post');
  const [industryId, setIndustryId] = useState('');
  const [role, setRole] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [jobType, setJobType] = useState<PostJobType>('Part-time');
  const [salary, setSalary] = useState('');
  const [experience, setExperience] = useState('');
  const [qualification, setQualification] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [openings, setOpenings] = useState('1');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  if (!profile) return null;

  const industry = industries.find((i) => i.id === industryId) || null;
  const myPosts = posts.filter((p) => p.ownerId === profile.id);
  const activeCount = myPosts.filter((p) => p.status === 'active').length;

  const handleIndustryChange = (id: string) => {
    setIndustryId(id);
    setRole('');
  };

  const handleRoleChange = (r: string) => {
    setRole(r);
    if (r) {
      const info = getRoleInfo(r);
      setSkillsText(info.skills.join(', '));
      setQualification(info.qualification);
      setExperience(info.experience);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const skills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!industryId || !role) {
      setError('Please select an industry and a job role.');
      return;
    }
    if (!businessName.trim() || !area.trim()) {
      setError('Please enter your business / shop name and area.');
      return;
    }
    if (skills.length === 0) {
      setError('Please add at least one required skill.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSaving(true);
    const res = await createPost(
      {
        industryId,
        role,
        businessName: businessName.trim(),
        area: area.trim(),
        city: city.trim() || 'Hyderabad',
        jobType,
        salary: salary.trim(),
        experience: experience.trim(),
        qualification: qualification.trim(),
        skills,
        description: description.trim(),
        openings: Math.max(1, parseInt(openings, 10) || 1),
        phone: phone.trim(),
      },
      profile.id
    );
    setSaving(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setIndustryId('');
    setRole('');
    setBusinessName('');
    setArea('');
    setSalary('');
    setExperience('');
    setQualification('');
    setSkillsText('');
    setOpenings('1');
    setDescription('');
    setPhone('');
    await reload();
    setSuccess('Job posted. Job seekers can now see it under this role.');
    setView('mine');
  };

  const toggleStatus = async (id: string, status: 'active' | 'closed') => {
    await setPostStatus(id, status === 'active' ? 'closed' : 'active');
    await reload();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
          Employer
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
          Welcome, {profile.fullName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Post a job for your shop or business. Job seekers can find it by industry and role,
          and contact you after signing in.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setView('post')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition ${
            view === 'post'
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Post a Job
        </button>
        <button
          onClick={() => setView('mine')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition ${
            view === 'mine'
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          My Posts ({myPosts.length})
        </button>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {view === 'post' && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Industry</label>
              <select
                value={industryId}
                onChange={(e) => handleIndustryChange(e.target.value)}
                className={inputCls}
              >
                <option value="">Select industry</option>
                {industries.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Job role</label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                disabled={!industry}
                className={inputCls}
              >
                <option value="">{industry ? 'Select role' : 'Select industry first'}</option>
                {industry?.roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Business / Shop name</label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Sri Lakshmi Stores"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Job type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as PostJobType)}
                className={inputCls}
              >
                <option value="Part-time">Part-time</option>
                <option value="Full-time">Full-time</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Area / Locality</label>
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Kazipet"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Hyderabad"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Salary (optional)</label>
              <input
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. ₹8,000 - ₹12,000 / month"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Number of openings</label>
              <input
                type="number"
                min={1}
                value={openings}
                onChange={(e) => setOpenings(e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Experience</label>
              <input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. Fresher / 1-2 years"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Qualification</label>
              <input
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. 10th pass"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Required skills</label>
            <input
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="Separate with commas, e.g. Billing, Customer service"
              className={inputCls}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Filled automatically when you pick a role. You can edit it.
            </p>
          </div>

          <div>
            <label className={labelCls}>Job description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Shift timings, duties, any other details"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Contact mobile number</label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3" />
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                className={`${inputCls} pl-9`}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Shown only to signed-in job seekers, never to guests.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
          >
            {saving ? 'Posting...' : 'Post Job'}
          </button>

          <div className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              Posts are published by employers and are not verified by WorkConnect.
              {isDemoMode ? ' Demo mode: posts are saved on this device only.' : ''}
            </span>
          </div>
        </form>
      )}

      {view === 'mine' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            {activeCount} active · {myPosts.length - activeCount} closed
          </p>

          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : myPosts.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <p className="text-sm text-slate-400">You have not posted any jobs yet.</p>
              <button
                onClick={() => setView('post')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Post your first job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPosts.map((p) => {
                const ind = industries.find((i) => i.id === p.industryId);
                return (
                  <div
                    key={p.id}
                    className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-white">{p.role}</h3>
                        <p className="text-xs text-indigo-300 font-medium mt-0.5">
                          {ind?.name || p.industryId}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
                          p.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-700/40 text-slate-300 border-slate-600/60'
                        }`}
                      >
                        {p.status === 'active' ? 'Active' : 'Closed'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <span>{p.businessName}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        {p.area}, {p.city}
                      </span>
                      <span>{p.jobType}</span>
                    </div>

                    {p.salary && <p className="text-xs text-emerald-400 font-medium">{p.salary}</p>}

                    <div className="flex flex-wrap gap-1.5">
                      {p.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[11px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => toggleStatus(p.id, p.status)}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      {p.status === 'active' ? 'Close this post' : 'Reopen this post'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
