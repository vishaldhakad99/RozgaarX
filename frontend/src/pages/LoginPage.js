import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) { toast.error('Sab field bharen'); return; }
    setLoading(true);
    try {
      await login(phone, password);
      toast.success(t.loginSuccess);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login fail hua');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔧</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FF6B35' }}>{t.appName}</h1>
          <p style={{ color: '#666' }}>{lang === 'hi' ? 'अपने अकाउंट में लॉगिन करें' : 'Login to your account'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📱 {t.phone}</label>
            <input
              type="tel"
              placeholder={lang === 'hi' ? '10 अंकों का नंबर' : '10-digit phone number'}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              maxLength={10}
            />
          </div>
          <div className="form-group">
            <label>🔒 {t.password}</label>
            <input
              type="password"
              placeholder={lang === 'hi' ? 'पासवर्ड डालें' : 'Enter password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? '...' : `🚀 ${t.login}`}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
          {lang === 'hi' ? 'नए हैं? ' : "New here? "}
          <Link to="/register" style={{ color: '#FF6B35', fontWeight: 700 }}>{t.register}</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
