import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    height: '64px', display: 'flex', alignItems: 'center'
  };

  return (
    <nav style={navStyle}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.5rem' }}>🔧</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FF6B35', fontFamily: "'Baloo 2', sans-serif" }}>
            {t.appName}
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="hide-mobile">
          <Link to="/search" className="btn btn-sm btn-outline">{t.search}</Link>
          <Link to="/jobs" className="btn btn-sm" style={{ color: '#666', textDecoration: 'none', fontWeight: 600 }}>{t.jobs}</Link>
          {user && <Link to="/bulk-hire" className="btn btn-sm" style={{ color: '#666', textDecoration: 'none', fontWeight: 600 }}>{t.bulkHire}</Link>}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Language Toggle */}
          <button onClick={toggleLang} className="btn btn-sm" style={{
            background: '#f0f0f0', color: '#333', padding: '6px 12px', fontWeight: 700
          }}>
            {lang === 'hi' ? 'EN' : 'हि'}
          </button>

          {user ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#FF6B35', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button onClick={logout} className="btn btn-sm" style={{ background: '#fee', color: '#e74c3c' }}>
                {t.logout}
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-outline">{t.login}</Link>
              <Link to="/register" className="btn btn-sm btn-primary">{t.register}</Link>
            </>
          )}

          {/* Mobile menu */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer',
            display: 'none'
          }} className="mobile-menu-btn">☰</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
