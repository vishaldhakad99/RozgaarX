import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    role: searchParams.get('role') || 'employer',
    city: '',
    companyName: '',
    language: 'hi'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.password) { toast.error('Sab field bharen'); return; }
    if (form.phone.length !== 10) { toast.error('10 digit ka phone number'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success(t.registerSuccess);
      if (form.role === 'worker') navigate('/worker-setup');
      else navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration fail hua');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 480, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔧</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FF6B35' }}>{t.appName}</h1>
          <p style={{ color: '#666' }}>{lang === 'hi' ? 'नया अकाउंट बनाएं' : 'Create new account'}</p>
        </div>

        {/* Role selection */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
          {[
            { value: 'worker', label: lang === 'hi' ? '👷 कामगार' : '👷 Worker' },
            { value: 'employer', label: lang === 'hi' ? '🏠 नियोक्ता' : '🏠 Employer' },
            { value: 'company', label: lang === 'hi' ? '🏢 कंपनी' : '🏢 Company' },
          ].map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => set('role', r.value)}
              style={{
                padding: '10px 8px', borderRadius: 8, border: `2px solid ${form.role === r.value ? '#FF6B35' : '#e5e7eb'}`,
                background: form.role === r.value ? '#FF6B3510' : 'white',
                color: form.role === r.value ? '#FF6B35' : '#666',
                cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13
              }}
            >{r.label}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>👤 {t.name}</label>
            <input type="text" placeholder={lang === 'hi' ? 'पूरा नाम' : 'Full name'} value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div className="form-group">
            <label>📱 {t.phone}</label>
            <input type="tel" placeholder="10 digit phone" value={form.phone} onChange={e => set('phone', e.target.value)} maxLength={10} />
          </div>

          <div className="form-group">
            <label>🔒 {t.password}</label>
            <input type="password" placeholder={lang === 'hi' ? 'कम से कम 6 अक्षर' : 'Min 6 characters'} value={form.password} onChange={e => set('password', e.target.value)} minLength={6} />
          </div>

          <div className="form-group">
            <label>📍 {t.city}</label>
            <input type="text" placeholder={lang === 'hi' ? 'जैसे: दिल्ली, मुंबई' : 'e.g. Delhi, Mumbai'} value={form.city} onChange={e => set('city', e.target.value)} />
          </div>

          {form.role === 'company' && (
            <div className="form-group">
              <label>🏢 {lang === 'hi' ? 'कंपनी का नाम' : 'Company Name'}</label>
              <input type="text" value={form.companyName} onChange={e => set('companyName', e.target.value)} />
            </div>
          )}

          <div className="form-group">
            <label>{lang === 'hi' ? '🌐 भाषा' : '🌐 Language'}</label>
            <select value={form.language} onChange={e => set('language', e.target.value)}>
              <option value="hi">हिंदी</option>
              <option value="en">English</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? '...' : `🎉 ${t.register}`}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
          {lang === 'hi' ? 'पहले से अकाउंट है? ' : 'Already have account? '}
          <Link to="/login" style={{ color: '#FF6B35', fontWeight: 700 }}>{t.login}</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
