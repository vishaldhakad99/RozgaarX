import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import WorkerCard from '../components/WorkerCard';

const SKILLS = ['plumber','electrician','housekeeping','carpenter','driver','cook','painter','gardener','security','other'];

const BulkHirePage = () => {
  const [form, setForm] = useState({ skill: '', city: '', workersCount: 5, startDate: '', endDate: '', dailyBudget: '', jobDescription: '' });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState([]);
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.skill || !form.city) { toast.error('Skill aur city zaroori hai'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('/bulk/hire', form);
      setResults(data);
      setSelected([]);
      toast.success(data.message);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error aaya');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (workerId) => {
    setSelected(s => s.includes(workerId) ? s.filter(id => id !== workerId) : [...s, workerId]);
  };

  const confirmBooking = async () => {
    if (selected.length === 0) { toast.error('Koi worker select karein'); return; }
    try {
      const { data } = await axios.post('/bulk/confirm', {
        jobId: results.job._id,
        workerIds: selected,
        agreedRate: form.dailyBudget,
        startDate: form.startDate,
        endDate: form.endDate
      });
      toast.success(data.message);
      navigate('/dashboard');
    } catch (e) {
      toast.error('Booking confirm nahi hui');
    }
  };

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#FF6B35', marginBottom: 4 }}>
          🏢 {lang === 'hi' ? 'Bulk में कामगार बुक करें' : 'Bulk Hire Workers'}
        </h1>
        <p style={{ color: '#666' }}>
          {lang === 'hi' ? 'कंपनियों के लिए - एक साथ कई कामगार बुक करें' : 'For companies - Book multiple workers at once'}
        </p>
      </div>

      {/* Search Form */}
      <div className="card" style={{ marginBottom: 28, padding: 24 }}>
        <h2 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1.1rem' }}>
          {lang === 'hi' ? '🔍 कामगार खोजें' : '🔍 Search Workers'}
        </h2>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>{lang === 'hi' ? 'किस काम के लिए' : 'Skill Required'}</label>
              <select value={form.skill} onChange={e => set('skill', e.target.value)} required>
                <option value="">-- {lang === 'hi' ? 'चुनें' : 'Select'} --</option>
                {SKILLS.map(s => <option key={s} value={s}>{t.skills[s]}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>📍 {t.city}</label>
              <input type="text" placeholder={lang === 'hi' ? 'शहर' : 'City'} value={form.city} onChange={e => set('city', e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>{lang === 'hi' ? '🔢 कितने कामगार' : '🔢 Workers Count'}</label>
              <input type="number" min="2" max="500" value={form.workersCount} onChange={e => set('workersCount', parseInt(e.target.value))} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>{lang === 'hi' ? '💰 रोज का बजट ₹' : '💰 Daily Budget ₹'}</label>
              <input type="number" placeholder="500" value={form.dailyBudget} onChange={e => set('dailyBudget', e.target.value)} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>{lang === 'hi' ? '📅 शुरुआत' : '📅 Start Date'}</label>
              <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>{lang === 'hi' ? '📅 अंत' : '📅 End Date'}</label>
              <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 14 }}>
            <label>{lang === 'hi' ? '📝 काम का विवरण' : '📝 Job Description'}</label>
            <textarea rows={2} style={{ resize: 'vertical' }} value={form.jobDescription} onChange={e => set('jobDescription', e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? '...' : `🔍 ${lang === 'hi' ? 'कामगार खोजें' : 'Find Workers'}`}
          </button>
        </form>
      </div>

      {/* Results */}
      {results && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                {lang === 'hi' ? `${results.totalFound} कामगार मिले` : `${results.totalFound} Workers Found`}
              </h2>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                {lang === 'hi' ? `${selected.length} selected` : `${selected.length} selected`}
                {' / '}{form.workersCount} {lang === 'hi' ? 'चाहिए' : 'needed'}
              </p>
            </div>
            {selected.length > 0 && (
              <button onClick={confirmBooking} className="btn btn-success btn-lg">
                ✅ {lang === 'hi' ? `${selected.length} को Confirm करें` : `Confirm ${selected.length} Workers`}
              </button>
            )}
          </div>

          <div className="grid-3">
            {results.availableWorkers.map(worker => (
              <div key={worker._id} style={{ position: 'relative' }}>
                <div
                  onClick={() => toggleSelect(worker._id)}
                  style={{
                    position: 'absolute', top: 12, right: 12, zIndex: 10,
                    width: 28, height: 28, borderRadius: '50%',
                    background: selected.includes(worker._id) ? '#27AE60' : '#e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'white', fontWeight: 700, fontSize: '1rem',
                    border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  {selected.includes(worker._id) ? '✓' : ''}
                </div>
                <div
                  onClick={() => toggleSelect(worker._id)}
                  style={{
                    outline: selected.includes(worker._id) ? '3px solid #27AE60' : 'none',
                    borderRadius: 12, cursor: 'pointer'
                  }}
                >
                  <WorkerCard worker={worker} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkHirePage;
