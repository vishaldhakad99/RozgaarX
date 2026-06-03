import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const SKILLS = ['plumber','electrician','housekeeping','carpenter','driver','cook','painter','gardener','security','other'];

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ skill: '', city: '', jobType: '', urgency: '' });
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
      const { data } = await axios.get(`/jobs?${params.toString()}`);
      setJobs(data.jobs);
    } catch (e) {
      toast.error('Jobs load nahi hue');
    } finally {
      setLoading(false);
    }
  };

  const applyJob = async (job) => {
    if (!user) { toast.error('Pehle login karein'); return; }
    if (!user.workerProfile) { toast.error('Pehle worker profile banayein'); return; }
    try {
      await axios.post(`/jobs/${job._id}/apply`, { workerId: user.workerProfile._id });
      toast.success('Apply ho gaya! Employer reply karega 👍');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Apply nahi hua');
    }
  };

  const urgencyColor = { normal: '#27AE60', urgent: '#F39C12', 'very-urgent': '#E74C3C' };
  const urgencyLabel = { normal: lang === 'hi' ? 'सामान्य' : 'Normal', urgent: lang === 'hi' ? 'जल्दी' : 'Urgent', 'very-urgent': lang === 'hi' ? 'बहुत जल्दी' : 'Very Urgent' };

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 20 }}>
        💼 {lang === 'hi' ? 'उपलब्ध काम' : 'Available Jobs'}
      </h1>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          <select value={filters.skill} onChange={e => setFilters({ ...filters, skill: e.target.value })}
            style={{ padding: '9px 12px', borderRadius: 8, border: '2px solid #e5e7eb', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}>
            <option value="">{lang === 'hi' ? 'सभी काम' : 'All Skills'}</option>
            {SKILLS.map(s => <option key={s} value={s}>{t.skills[s]}</option>)}
          </select>
          <input type="text" placeholder={lang === 'hi' ? '📍 शहर' : '📍 City'}
            value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })}
            style={{ padding: '9px 12px', borderRadius: 8, border: '2px solid #e5e7eb', fontFamily: 'inherit', fontSize: 14, outline: 'none' }} />
          <select value={filters.jobType} onChange={e => setFilters({ ...filters, jobType: e.target.value })}
            style={{ padding: '9px 12px', borderRadius: 8, border: '2px solid #e5e7eb', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}>
            <option value="">{lang === 'hi' ? 'सभी प्रकार' : 'All Types'}</option>
            <option value="one-time">{lang === 'hi' ? 'एक बार' : 'One Time'}</option>
            <option value="daily">{lang === 'hi' ? 'रोज' : 'Daily'}</option>
            <option value="monthly">{lang === 'hi' ? 'मासिक' : 'Monthly'}</option>
          </select>
          <select value={filters.urgency} onChange={e => setFilters({ ...filters, urgency: e.target.value })}
            style={{ padding: '9px 12px', borderRadius: 8, border: '2px solid #e5e7eb', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}>
            <option value="">{lang === 'hi' ? 'सभी' : 'All Urgency'}</option>
            <option value="urgent">{lang === 'hi' ? 'जल्दी' : 'Urgent'}</option>
            <option value="very-urgent">{lang === 'hi' ? 'बहुत जल्दी' : 'Very Urgent'}</option>
          </select>
          <button onClick={fetchJobs} className="btn btn-primary">🔍 {lang === 'hi' ? 'खोजें' : 'Search'}</button>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>😔</div>
          <h3>{lang === 'hi' ? 'कोई काम नहीं मिला' : 'No jobs found'}</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {jobs.map(job => (
            <div key={job._id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 6 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>{job.title}</h3>
                    <span className="badge badge-orange">{t.skills[job.skillRequired]}</span>
                    {job.urgency !== 'normal' && (
                      <span className="badge" style={{ background: `${urgencyColor[job.urgency]}20`, color: urgencyColor[job.urgency] }}>
                        ⚡ {urgencyLabel[job.urgency]}
                      </span>
                    )}
                    {job.isBulkHiring && <span className="badge badge-blue">🏢 Bulk</span>}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span>📍 {job.city}</span>
                    {job.employer?.companyName && <span>🏢 {job.employer.companyName}</span>}
                    {job.workersNeeded > 1 && <span>👥 {job.workersNeeded} {lang === 'hi' ? 'कामगार चाहिए' : 'workers needed'}</span>}
                    <span>📅 {new Date(job.createdAt).toLocaleDateString('hi-IN')}</span>
                  </div>
                  {job.description && (
                    <p style={{ marginTop: 8, color: '#444', fontSize: '0.9rem' }}>{job.description}</p>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  {job.budget?.min && (
                    <div style={{ fontWeight: 700, color: '#FF6B35', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                      ₹{job.budget.min}{job.budget.max ? `-${job.budget.max}` : '+'}/{job.budget.type === 'daily' ? (lang === 'hi' ? 'दिन' : 'day') : job.budget.type === 'hourly' ? (lang === 'hi' ? 'घंटा' : 'hr') : 'fixed'}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`tel:${job.employer?.phone}`} className="btn btn-outline btn-sm">📞</a>
                    {user?.role === 'worker' && (
                      <button onClick={() => applyJob(job)} className="btn btn-primary btn-sm">
                        {lang === 'hi' ? 'Apply करें' : 'Apply Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsPage;
