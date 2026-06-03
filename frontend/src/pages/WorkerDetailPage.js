import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const WorkerDetailPage = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ startDate: '', agreedRate: '', notes: '' });
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorker();
  }, [id]);

  const fetchWorker = async () => {
    try {
      const [wRes, rRes] = await Promise.all([
        axios.get(`/workers/${id}`),
        axios.get(`/reviews/worker/${id}`)
      ]);
      setWorker(wRes.data.worker);
      setReviews(rRes.data.reviews);
    } catch (e) {
      toast.error('Worker nahi mila');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!user) { toast.error('Pehle login karein'); navigate('/login'); return; }
    if (!bookingForm.startDate) { toast.error('Date chunein'); return; }
    try {
      await axios.post('/bookings', {
        worker: worker._id,
        job: null,
        startDate: bookingForm.startDate,
        agreedRate: bookingForm.agreedRate || worker.dailyRate,
        rateType: 'daily',
        notes: bookingForm.notes
      });
      toast.success('Booking ho gayi! 🎉');
      setShowBooking(false);
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Booking fail');
    }
  };

  if (loading) return <div className="loading" style={{ minHeight: '60vh' }}><div className="spinner"></div></div>;
  if (!worker) return null;

  const u = worker.user || {};
  const skillIcons = { plumber:'🔧', electrician:'⚡', housekeeping:'🧹', carpenter:'🪚', driver:'🚗', cook:'👨‍🍳', painter:'🎨', gardener:'🌿', security:'🛡️', other:'👷' };

  return (
    <div className="container" style={{ padding: '24px 16px', maxWidth: 800 }}>
      {/* Profile Header */}
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', color: 'white', fontWeight: 700, flexShrink: 0
          }}>
            {u.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 4 }}>{u.name}</h1>
                <div style={{ color: '#666', marginBottom: 8 }}>📍 {worker.city || u.city}</div>
              </div>
              <span className={`badge ${worker.isAvailableNow ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.95rem', padding: '6px 14px' }}>
                {worker.isAvailableNow ? '✅ ' + t.available : '❌ ' + t.unavailable}
              </span>
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {worker.skills?.map(s => (
                <span key={s} className="badge badge-orange" style={{ fontSize: '0.9rem' }}>
                  {skillIcons[s]} {t.skills[s]}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div><span style={{ fontWeight: 700, color: '#F39C12' }}>★ {worker.rating?.toFixed(1) || '0.0'}</span> <span style={{ color: '#666', fontSize: '0.85rem' }}>({worker.totalRatings} {lang === 'hi' ? 'रिव्यू' : 'reviews'})</span></div>
              <div><span style={{ fontWeight: 700 }}>{worker.experience}</span> <span style={{ color: '#666', fontSize: '0.85rem' }}>{t.years} {t.experience}</span></div>
              <div><span style={{ fontWeight: 700, color: '#27AE60' }}>{worker.completedJobs}</span> <span style={{ color: '#666', fontSize: '0.85rem' }}>{t.jobs_done}</span></div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {worker.bio && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: '#f8f9fa', borderRadius: 8, fontStyle: 'italic', color: '#555' }}>
            "{worker.bio}"
          </div>
        )}

        {/* Rate + Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            {worker.dailyRate && (
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FF6B35' }}>
                ₹{worker.dailyRate}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#666' }}>{t.perDay}</span>
              </div>
            )}
            {worker.hourlyRate && (
              <div style={{ color: '#666', fontSize: '0.9rem' }}>₹{worker.hourlyRate}{t.perHour}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href={`tel:${u.phone}`} className="btn btn-outline">📞 {lang === 'hi' ? 'कॉल करें' : 'Call'}</a>
            {worker.isAvailableNow && user?.role !== 'worker' && (
              <button onClick={() => setShowBooking(true)} className="btn btn-primary btn-lg">
                📅 {t.bookNow}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="card" style={{ width: '100%', maxWidth: 420, padding: 28 }}>
            <h2 style={{ fontWeight: 700, marginBottom: 20 }}>📅 {lang === 'hi' ? 'Booking करें' : 'Book Worker'}</h2>
            <div className="form-group">
              <label>{lang === 'hi' ? 'शुरुआत की तारीख' : 'Start Date'}</label>
              <input type="date" value={bookingForm.startDate} onChange={e => setBookingForm({ ...bookingForm, startDate: e.target.value })} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="form-group">
              <label>{lang === 'hi' ? 'तय रेट ₹ (रोज)' : 'Agreed Rate ₹ (daily)'}</label>
              <input type="number" placeholder={worker.dailyRate || '500'} value={bookingForm.agreedRate} onChange={e => setBookingForm({ ...bookingForm, agreedRate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{lang === 'hi' ? 'नोट (optional)' : 'Notes (optional)'}</label>
              <textarea rows={2} value={bookingForm.notes} onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowBooking(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>{t.cancel}</button>
              <button onClick={handleBook} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>✅ {t.confirm}</button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontWeight: 700, marginBottom: 16 }}>⭐ {t.reviews} ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: 20 }}>
            {lang === 'hi' ? 'अभी कोई रिव्यू नहीं है' : 'No reviews yet'}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.map(r => (
              <div key={r._id} style={{ padding: '14px 16px', background: '#f8f9fa', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{r.reviewer?.name}</span>
                  <span style={{ color: '#F39C12' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                {r.comment && <p style={{ color: '#555', fontSize: '0.9rem', margin: 0 }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDetailPage;
