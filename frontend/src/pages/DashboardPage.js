import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workerAvailable, setWorkerAvailable] = useState(user?.workerProfile?.isAvailableNow ?? true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookRes, jobRes] = await Promise.all([
        axios.get('/bookings/my'),
        user.role !== 'worker' ? axios.get('/jobs/my') : Promise.resolve({ data: { jobs: [] } })
      ]);
      setBookings(bookRes.data.bookings || []);
      setJobs(jobRes.data.jobs || []);
    } catch (e) {
      toast.error('Data load nahi hua');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const { data } = await axios.put('/workers/toggle-availability');
      setWorkerAvailable(data.isAvailableNow);
      toast.success(data.message);
    } catch (e) { toast.error('Error aaya'); }
  };

  const statusColor = { pending: '#F39C12', confirmed: '#27AE60', completed: '#1A73E8', cancelled: '#E74C3C', ongoing: '#9B59B6' };
  const statusLabel_hi = { pending: 'प्रतीक्षा', confirmed: 'पक्का', completed: 'पूरा', cancelled: 'रद्द', ongoing: 'चल रहा' };

  if (loading) return <div className="loading" style={{ minHeight: '60vh' }}><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>
            👋 {lang === 'hi' ? 'नमस्ते' : 'Hello'}, {user?.name}!
          </h1>
          <span className={`badge ${user?.role === 'worker' ? 'badge-orange' : 'badge-blue'}`}>
            {user?.role === 'worker' ? '👷 Worker' : user?.role === 'company' ? '🏢 Company' : '🏠 Employer'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {user?.role === 'worker' ? (
            <button onClick={toggleAvailability} className={`btn ${workerAvailable ? 'btn-success' : 'btn-outline'}`}>
              {workerAvailable ? '✅ Available' : '❌ Unavailable'}
            </button>
          ) : (
            <>
              <Link to="/post-job" className="btn btn-primary">+ {t.postJob}</Link>
              <Link to="/bulk-hire" className="btn btn-secondary">🏢 {t.bulkHire}</Link>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { icon: '📋', label: lang === 'hi' ? 'कुल बुकिंग' : 'Total Bookings', value: bookings.length },
          { icon: '✅', label: lang === 'hi' ? 'पूरे हुए' : 'Completed', value: bookings.filter(b => b.status === 'completed').length },
          { icon: '🔄', label: lang === 'hi' ? 'चल रहे' : 'Ongoing', value: bookings.filter(b => b.status === 'ongoing' || b.status === 'confirmed').length },
          { icon: user?.role === 'worker' ? '⭐' : '📝', label: user?.role === 'worker' ? 'Rating' : lang === 'hi' ? 'पोस्ट किए काम' : 'Posted Jobs', value: user?.role === 'worker' ? (user?.workerProfile?.rating?.toFixed(1) || '0.0') : jobs.length },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '20px 12px' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>{stat.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FF6B35' }}>{stat.value}</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Jobs Posted (employers) */}
      {user?.role !== 'worker' && jobs.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, marginBottom: 16 }}>📝 {lang === 'hi' ? 'मेरे पोस्ट किए काम' : 'My Posted Jobs'}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {jobs.slice(0, 5).map(job => (
              <div key={job._id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', background: '#f8f9fa', borderRadius: 8, gap: 8, flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{job.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>📍 {job.city} • {t.skills[job.skillRequired]}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{job.applicants?.length || 0} {lang === 'hi' ? 'आवेदन' : 'applicants'}</span>
                  <span className="badge badge-orange">{job.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings */}
      <div className="card">
        <h2 style={{ fontWeight: 700, marginBottom: 16 }}>📋 {lang === 'hi' ? 'मेरी बुकिंग' : 'My Bookings'}</h2>
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
            <p>{lang === 'hi' ? 'अभी कोई बुकिंग नहीं है' : 'No bookings yet'}</p>
            {user?.role !== 'worker' && (
              <Link to="/search" className="btn btn-primary" style={{ marginTop: 12 }}>
                {lang === 'hi' ? 'कामगार खोजें' : 'Find Workers'}
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bookings.map(booking => (
              <div key={booking._id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', background: '#f8f9fa', borderRadius: 8, flexWrap: 'wrap', gap: 8
              }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{booking.job?.title || 'Kaam'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    📍 {booking.job?.city} • {new Date(booking.createdAt).toLocaleDateString('hi-IN')}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {booking.agreedRate && <span style={{ fontWeight: 700, color: '#FF6B35' }}>₹{booking.agreedRate}</span>}
                  <span className="badge" style={{ background: `${statusColor[booking.status]}20`, color: statusColor[booking.status] }}>
                    {lang === 'hi' ? statusLabel_hi[booking.status] : booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
