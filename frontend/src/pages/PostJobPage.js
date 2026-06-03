import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const SKILLS = ['plumber','electrician','housekeeping','carpenter','driver','cook','painter','gardener','security','other'];

const PostJobPage = () => {
  const [form, setForm] = useState({
    title: '', titleHindi: '', description: '', skillRequired: '',
    city: '', address: '', jobType: 'one-time',
    budget: { min: '', max: '', type: 'daily' },
    workersNeeded: 1, startDate: '', urgency: 'normal', isBulkHiring: false
  });
  const [loading, setLoading] = useState(false);
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setBudget = (k, v) => setForm(f => ({ ...f, budget: { ...f.budget, [k]: v } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.skillRequired || !form.city) { toast.error('Title, skill aur city zaroori hai'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('/jobs', form);
      toast.success(data.message);
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Job post nahi hui');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '24px auto', padding: '0 16px' }}>
      <div className="card" style={{ padding: 28 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 20, color: '#FF6B35' }}>
          📝 {lang === 'hi' ? 'काम पोस्ट करें' : 'Post a Job'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{lang === 'hi' ? '📋 काम का नाम' : '📋 Job Title'}</label>
            <input type="text" placeholder={lang === 'hi' ? 'जैसे: Bathroom leak repair' : 'e.g. Bathroom leak repair'} value={form.title} onChange={e => set('title', e.target.value)} />
          </div>

          {lang === 'en' && (
            <div className="form-group">
              <label>📋 Hindi Title (optional)</label>
              <input type="text" placeholder="हिंदी में काम का नाम" value={form.titleHindi} onChange={e => set('titleHindi', e.target.value)} />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>{lang === 'hi' ? '🛠️ किस काम के लिए' : '🛠️ Skill Required'}</label>
              <select value={form.skillRequired} onChange={e => set('skillRequired', e.target.value)} required>
                <option value="">{lang === 'hi' ? '-- चुनें --' : '-- Select --'}</option>
                {SKILLS.map(s => <option key={s} value={s}>{t.skills[s]}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{lang === 'hi' ? '📅 काम का प्रकार' : '📅 Job Type'}</label>
              <select value={form.jobType} onChange={e => set('jobType', e.target.value)}>
                <option value="one-time">{lang === 'hi' ? 'एक बार' : 'One Time'}</option>
                <option value="daily">{lang === 'hi' ? 'रोज' : 'Daily'}</option>
                <option value="weekly">{lang === 'hi' ? 'साप्ताहिक' : 'Weekly'}</option>
                <option value="monthly">{lang === 'hi' ? 'मासिक' : 'Monthly'}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>📍 {t.city}</label>
            <input type="text" placeholder={lang === 'hi' ? 'शहर' : 'City'} value={form.city} onChange={e => set('city', e.target.value)} />
          </div>

          <div className="form-group">
            <label>{lang === 'hi' ? '🏠 पूरा पता (optional)' : '🏠 Full Address (optional)'}</label>
            <input type="text" value={form.address} onChange={e => set('address', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>{lang === 'hi' ? '💰 न्यूनतम ₹' : '💰 Min ₹'}</label>
              <input type="number" value={form.budget.min} onChange={e => setBudget('min', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{lang === 'hi' ? '💰 अधिकतम ₹' : '💰 Max ₹'}</label>
              <input type="number" value={form.budget.max} onChange={e => setBudget('max', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{lang === 'hi' ? '💰 रेट टाइप' : '💰 Rate Type'}</label>
              <select value={form.budget.type} onChange={e => setBudget('type', e.target.value)}>
                <option value="daily">{lang === 'hi' ? 'रोज' : 'Daily'}</option>
                <option value="hourly">{lang === 'hi' ? 'घंटा' : 'Hourly'}</option>
                <option value="fixed">{lang === 'hi' ? 'फिक्स' : 'Fixed'}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>{lang === 'hi' ? '🔢 कितने कामगार चाहिए' : '🔢 Workers Needed'}</label>
              <input type="number" min="1" value={form.workersNeeded} onChange={e => set('workersNeeded', parseInt(e.target.value))} />
            </div>
            <div className="form-group">
              <label>{lang === 'hi' ? '⚡ कितनी जल्दी' : '⚡ Urgency'}</label>
              <select value={form.urgency} onChange={e => set('urgency', e.target.value)}>
                <option value="normal">{lang === 'hi' ? 'सामान्य' : 'Normal'}</option>
                <option value="urgent">{lang === 'hi' ? 'जल्दी' : 'Urgent'}</option>
                <option value="very-urgent">{lang === 'hi' ? 'बहुत जल्दी' : 'Very Urgent'}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>{lang === 'hi' ? '📅 शुरुआत की तारीख' : '📅 Start Date'}</label>
            <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} min={new Date().toISOString().split('T')[0]} />
          </div>

          <div className="form-group">
            <label>{lang === 'hi' ? '📝 विवरण (optional)' : '📝 Description (optional)'}</label>
            <textarea rows={3} style={{ resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? '...' : `🚀 ${lang === 'hi' ? 'काम पोस्ट करें' : 'Post Job'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
