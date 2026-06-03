import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const SKILLS = ['plumber','electrician','housekeeping','carpenter','driver','cook','painter','gardener','security','other'];

const WorkerProfileSetup = () => {
  const [form, setForm] = useState({
    skills: [], primarySkill: '', experience: 0,
    dailyRate: '', hourlyRate: '', availability: 'on-demand',
    city: '', pincode: '', bio: '', languages: ['hindi']
  });
  const [loading, setLoading] = useState(false);
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleSkill = (skill) => {
    const newSkills = form.skills.includes(skill)
      ? form.skills.filter(s => s !== skill)
      : [...form.skills, skill];
    set('skills', newSkills);
    if (!form.primarySkill && newSkills.length > 0) set('primarySkill', newSkills[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.skills.length === 0) { toast.error('Kam se kam 1 skill chunein'); return; }
    if (!form.city) { toast.error('Shehar batayein'); return; }
    setLoading(true);
    try {
      await axios.post('/workers/profile', form);
      toast.success('Worker profile ban gayi! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error aaya');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '24px auto', padding: '0 16px' }}>
      <div className="card" style={{ padding: 28 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8, color: '#FF6B35' }}>
          👷 {lang === 'hi' ? 'अपनी Worker Profile बनाएं' : 'Create Your Worker Profile'}
        </h1>
        <p style={{ color: '#666', marginBottom: 24 }}>
          {lang === 'hi' ? 'यह जानकारी नियोक्ताओं को दिखेगी' : 'This info will be shown to employers'}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Skills */}
          <div className="form-group">
            <label>{lang === 'hi' ? '🛠️ आपकी Skills (सभी चुनें)' : '🛠️ Your Skills (select all)'}</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {SKILLS.map(skill => (
                <button key={skill} type="button" onClick={() => toggleSkill(skill)} style={{
                  padding: '8px 14px', borderRadius: 20, border: `2px solid ${form.skills.includes(skill) ? '#FF6B35' : '#e5e7eb'}`,
                  background: form.skills.includes(skill) ? '#FF6B35' : 'white',
                  color: form.skills.includes(skill) ? 'white' : '#666',
                  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13
                }}>
                  {t.skills[skill]}
                </button>
              ))}
            </div>
          </div>

          {form.skills.length > 1 && (
            <div className="form-group">
              <label>{lang === 'hi' ? '⭐ मुख्य Skill' : '⭐ Primary Skill'}</label>
              <select value={form.primarySkill} onChange={e => set('primarySkill', e.target.value)}>
                {form.skills.map(s => <option key={s} value={s}>{t.skills[s]}</option>)}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>{lang === 'hi' ? '📅 अनुभव (साल में)' : '📅 Experience (years)'}</label>
              <input type="number" min="0" max="50" value={form.experience} onChange={e => set('experience', parseInt(e.target.value))} />
            </div>
            <div className="form-group">
              <label>{lang === 'hi' ? '💰 रोज का रेट (₹)' : '💰 Daily Rate (₹)'}</label>
              <input type="number" placeholder="500" value={form.dailyRate} onChange={e => set('dailyRate', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>{lang === 'hi' ? '⏰ उपलब्धता' : '⏰ Availability'}</label>
            <select value={form.availability} onChange={e => set('availability', e.target.value)}>
              <option value="on-demand">{lang === 'hi' ? 'जरूरत पर' : 'On Demand'}</option>
              <option value="full-time">{lang === 'hi' ? 'फुल टाइम' : 'Full Time'}</option>
              <option value="part-time">{lang === 'hi' ? 'पार्ट टाइम' : 'Part Time'}</option>
            </select>
          </div>

          <div className="form-group">
            <label>📍 {t.city}</label>
            <input type="text" placeholder={lang === 'hi' ? 'आपका शहर' : 'Your city'} value={form.city} onChange={e => set('city', e.target.value)} />
          </div>

          <div className="form-group">
            <label>{lang === 'hi' ? '📝 अपने बारे में लिखें' : '📝 About yourself'}</label>
            <textarea
              rows={3}
              placeholder={lang === 'hi' ? 'जैसे: मैं 5 साल का अनुभवी प्लंबर हूं...' : 'e.g. I am experienced plumber with 5 years...'}
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? '...' : `✅ ${lang === 'hi' ? 'Profile Save करें' : 'Save Profile'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkerProfileSetup;
