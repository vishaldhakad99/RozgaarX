import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const SKILLS = [
  { key: 'plumber', icon: '🔧', hi: 'प्लंबर', en: 'Plumber' },
  { key: 'electrician', icon: '⚡', hi: 'इलेक्ट्रीशियन', en: 'Electrician' },
  { key: 'housekeeping', icon: '🧹', hi: 'सफाई', en: 'Housekeeping' },
  { key: 'carpenter', icon: '🪚', hi: 'बढ़ई', en: 'Carpenter' },
  { key: 'driver', icon: '🚗', hi: 'ड्राइवर', en: 'Driver' },
  { key: 'cook', icon: '👨‍🍳', hi: 'रसोइया', en: 'Cook' },
];

const STATS = [
  { number: '10,000+', hi: 'कामगार रजिस्टर्ड', en: 'Workers Registered' },
  { number: '500+', hi: 'शहर', en: 'Cities' },
  { number: '50,000+', hi: 'काम पूरे हुए', en: 'Jobs Completed' },
  { number: '4.8★', hi: 'औसत रेटिंग', en: 'Average Rating' },
];

const HomePage = () => {
  const [searchSkill, setSearchSkill] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const handleSearch = (skill = searchSkill, city = searchCity) => {
    const params = new URLSearchParams();
    if (skill) params.set('skill', skill);
    if (city) params.set('city', city);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient" style={{ padding: '60px 0 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="fade-in-up">
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
              color: 'white', marginBottom: 8, lineHeight: 1.2
            }}>
              🔧 {t.appName}
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
              {t.tagline}
            </p>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', marginBottom: 36 }}>
              {lang === 'hi'
                ? 'प्लंबर, इलेक्ट्रीशियन, कुक, ड्राइवर - सब एक जगह'
                : 'Plumber, Electrician, Cook, Driver - All in one place'}
            </p>

            {/* Search Bar */}
            <div style={{
              background: 'white', borderRadius: 16, padding: 8,
              display: 'flex', gap: 8, maxWidth: 600, margin: '0 auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}>
              <select
                value={searchSkill}
                onChange={e => setSearchSkill(e.target.value)}
                style={{
                  flex: 1, border: 'none', outline: 'none', padding: '10px 14px',
                  fontSize: 15, borderRadius: 10, background: '#f8f9fa',
                  fontFamily: "'Baloo 2', sans-serif"
                }}
              >
                <option value="">{lang === 'hi' ? '-- काम चुनें --' : '-- Select Skill --'}</option>
                {SKILLS.map(s => (
                  <option key={s.key} value={s.key}>{s.icon} {lang === 'hi' ? s.hi : s.en}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder={t.cityPlaceholder}
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                style={{
                  flex: 1, border: 'none', outline: 'none', padding: '10px 14px',
                  fontSize: 15, borderRadius: 10, background: '#f8f9fa',
                  fontFamily: "'Baloo 2', sans-serif"
                }}
              />
              <button onClick={() => handleSearch()} className="btn btn-primary">
                🔍 {t.findWorkers}
              </button>
            </div>

            {/* Voice hint */}
            <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 16, fontSize: '0.9rem' }}>
              🎤 {t.voiceHint}
            </p>
          </div>
        </div>
      </section>

      {/* Skill Categories */}
      <section style={{ padding: '48px 0', background: 'white' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>
            {lang === 'hi' ? 'किस काम के लिए कामगार चाहिए?' : 'What kind of worker do you need?'}
          </h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: 32 }}>
            {lang === 'hi' ? 'एक क्लिक में सही कामगार खोजें' : 'Find the right worker in one click'}
          </p>
          <div className="grid-3" style={{ gap: 16 }}>
            {SKILLS.map((skill, i) => (
              <button
                key={skill.key}
                onClick={() => handleSearch(skill.key)}
                className="card fade-in-up"
                style={{
                  border: '2px solid transparent', cursor: 'pointer',
                  textAlign: 'center', padding: '24px 16px',
                  transition: 'all 0.2s', animationDelay: `${i * 0.08}s`,
                  background: 'none'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '3rem', marginBottom: 8 }}>{skill.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {lang === 'hi' ? skill.hi : skill.en}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Hire Banner */}
      <section style={{ padding: '40px 0', background: '#1A1A2E' }}>
        <div className="container">
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 24, flexWrap: 'wrap'
          }}>
            <div>
              <h2 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>
                🏢 {t.bulkHireTitle}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>{t.bulkHireDesc}</p>
            </div>
            <button onClick={() => navigate('/bulk-hire')} className="btn btn-lg" style={{
              background: '#FF6B35', color: 'white', whiteSpace: 'nowrap'
            }}>
              {lang === 'hi' ? 'अभी बुक करें →' : 'Book Now →'}
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '48px 0', background: '#f8f9fa' }}>
        <div className="container">
          <div className="grid-4">
            {STATS.map((stat, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FF6B35', marginBottom: 4 }}>
                  {stat.number}
                </div>
                <div style={{ color: '#666', fontWeight: 500 }}>
                  {lang === 'hi' ? stat.hi : stat.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '48px 0', background: 'white' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 700, marginBottom: 40 }}>
            {lang === 'hi' ? '⚡ कैसे काम करता है?' : '⚡ How does it work?'}
          </h2>
          <div className="grid-3">
            {[
              { step: '1', icon: '🔍', hi: 'कामगार खोजें', en: 'Search Worker', desc_hi: 'अपने शहर में कौशल के आधार पर खोजें', desc_en: 'Search by skill in your city' },
              { step: '2', icon: '📞', hi: 'संपर्क करें', en: 'Contact', desc_hi: 'सीधे कामगार से बात करें', desc_en: 'Talk directly to the worker' },
              { step: '3', icon: '✅', hi: 'काम करवाएं', en: 'Get Work Done', desc_hi: 'काम हो जाने पर रेटिंग दें', desc_en: 'Rate after work is done' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', background: '#FF6B3520',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', margin: '0 auto 16px'
                }}>
                  {item.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
                  {lang === 'hi' ? item.hi : item.en}
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  {lang === 'hi' ? item.desc_hi : item.desc_en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={{ padding: '48px 0', background: 'linear-gradient(135deg, #FF6B35, #C0392B)', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 700, marginBottom: 16 }}>
              {lang === 'hi' ? 'आज ही जुड़ें KaamWala से!' : 'Join KaamWala Today!'}
            </h2>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register?role=worker')} className="btn btn-lg" style={{ background: 'white', color: '#FF6B35' }}>
                👷 {lang === 'hi' ? 'कामगार के रूप में जुड़ें' : 'Join as Worker'}
              </button>
              <button onClick={() => navigate('/register?role=employer')} className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white' }}>
                🏠 {lang === 'hi' ? 'काम देने वाले के रूप में' : 'Join as Employer'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
