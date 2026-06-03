import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import WorkerCard from '../components/WorkerCard';
import { useLanguage } from '../context/LanguageContext';

const SKILLS = ['plumber','electrician','housekeeping','carpenter','driver','cook','painter','gardener','security','other'];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    skill: searchParams.get('skill') || '',
    city: searchParams.get('city') || '',
    availability: '',
    maxRate: '',
    minRating: '',
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { t, lang } = useLanguage();

  useEffect(() => {
    fetchWorkers();
  }, [searchParams, page]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.skill) params.set('skill', filters.skill);
      if (filters.city) params.set('city', filters.city);
      if (filters.availability) params.set('availability', filters.availability);
      if (filters.maxRate) params.set('maxRate', filters.maxRate);
      if (filters.minRating) params.set('rating', filters.minRating);
      params.set('page', page);
      params.set('limit', 12);

      const { data } = await axios.get(`/workers?${params.toString()}`);
      setWorkers(data.workers);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      toast.error('Workers load nahi hue');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchWorkers();
  };

  const handleHire = (worker) => {
    toast.success(`${worker.user?.name} ko hire karne ke liye unse contact karein: ${worker.user?.phone}`);
  };

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 4 }}>
        🔍 {lang === 'hi' ? 'कामगार खोजें' : 'Search Workers'}
      </h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        {total > 0 ? `${total} ${lang === 'hi' ? 'कामगार मिले' : 'workers found'}` : ''}
      </p>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 24, padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          <select
            value={filters.skill}
            onChange={e => setFilters({ ...filters, skill: e.target.value })}
            style={{ padding: '10px 12px', borderRadius: 8, border: '2px solid #e5e7eb', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}
          >
            <option value="">{lang === 'hi' ? 'सभी काम' : 'All Skills'}</option>
            {SKILLS.map(s => (
              <option key={s} value={s}>{t.skills[s] || s}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder={lang === 'hi' ? '📍 शहर' : '📍 City'}
            value={filters.city}
            onChange={e => setFilters({ ...filters, city: e.target.value })}
            onKeyPress={e => e.key === 'Enter' && handleSearch()}
            style={{ padding: '10px 12px', borderRadius: 8, border: '2px solid #e5e7eb', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}
          />

          <select
            value={filters.availability}
            onChange={e => setFilters({ ...filters, availability: e.target.value })}
            style={{ padding: '10px 12px', borderRadius: 8, border: '2px solid #e5e7eb', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}
          >
            <option value="">{lang === 'hi' ? 'उपलब्धता' : 'Availability'}</option>
            <option value="on-demand">{lang === 'hi' ? 'जरूरत पर' : 'On Demand'}</option>
            <option value="full-time">{lang === 'hi' ? 'फुल टाइम' : 'Full Time'}</option>
            <option value="part-time">{lang === 'hi' ? 'पार्ट टाइम' : 'Part Time'}</option>
          </select>

          <input
            type="number"
            placeholder={lang === 'hi' ? 'अधिकतम रेट ₹' : 'Max Rate ₹'}
            value={filters.maxRate}
            onChange={e => setFilters({ ...filters, maxRate: e.target.value })}
            style={{ padding: '10px 12px', borderRadius: 8, border: '2px solid #e5e7eb', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}
          />

          <select
            value={filters.minRating}
            onChange={e => setFilters({ ...filters, minRating: e.target.value })}
            style={{ padding: '10px 12px', borderRadius: 8, border: '2px solid #e5e7eb', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}
          >
            <option value="">{lang === 'hi' ? 'रेटिंग' : 'Rating'}</option>
            <option value="4">4+ ★</option>
            <option value="3">3+ ★</option>
          </select>

          <button onClick={handleSearch} className="btn btn-primary">
            🔍 {lang === 'hi' ? 'खोजें' : 'Search'}
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : workers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>😔</div>
          <h3>{t.noWorkers}</h3>
          <p>{lang === 'hi' ? 'दूसरे शहर या काम में खोजें' : 'Try searching in another city or skill'}</p>
        </div>
      ) : (
        <>
          <div className="grid-3">
            {workers.map(worker => (
              <WorkerCard key={worker._id} worker={worker} onHire={handleHire} />
            ))}
          </div>

          {/* Pagination */}
          {total > 12 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-outline"
              >← {lang === 'hi' ? 'पिछला' : 'Prev'}</button>
              <span style={{ padding: '10px 20px', fontWeight: 600 }}>{page} / {Math.ceil(total / 12)}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / 12)}
                className="btn btn-outline"
              >{lang === 'hi' ? 'अगला' : 'Next'} →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
