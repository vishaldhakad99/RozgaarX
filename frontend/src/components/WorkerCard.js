import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const StarRating = ({ rating }) => {
  return (
    <span className="stars">
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: '#666', fontSize: '0.85em', marginLeft: 4 }}>({rating.toFixed(1)})</span>
    </span>
  );
};

const WorkerCard = ({ worker, onHire }) => {
  const { t } = useLanguage();
  const user = worker.user || {};

  const skillIcons = {
    plumber: '🔧', electrician: '⚡', housekeeping: '🧹',
    carpenter: '🪚', driver: '🚗', cook: '👨‍🍳',
    painter: '🎨', gardener: '🌿', security: '🛡️', other: '👷'
  };

  return (
    <div className="card" style={{ transition: 'all 0.2s', cursor: 'pointer' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF6B35, #E55A24)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', color: 'white', fontWeight: 700,
          flexShrink: 0
        }}>
          {user.profilePhoto
            ? <img src={user.profilePhoto} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            : user.name?.charAt(0)?.toUpperCase()
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, truncate: true }}>{user.name}</h3>
            <span className={`badge ${worker.isAvailableNow ? 'badge-green' : 'badge-red'}`}>
              {worker.isAvailableNow ? t.available : t.unavailable}
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#666' }}>
            📍 {worker.city || user.city}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {worker.skills?.map(skill => (
          <span key={skill} className="badge badge-orange">
            {skillIcons[skill]} {t.skills[skill] || skill}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12, textAlign: 'center' }}>
        <div style={{ background: '#f8f9fa', borderRadius: 8, padding: '8px 4px' }}>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>{t.rating}</div>
          <div style={{ fontWeight: 700, color: '#F39C12' }}>
            ★ {worker.rating?.toFixed(1) || '0.0'}
          </div>
        </div>
        <div style={{ background: '#f8f9fa', borderRadius: 8, padding: '8px 4px' }}>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>{t.experience}</div>
          <div style={{ fontWeight: 700 }}>{worker.experience || 0} {t.years}</div>
        </div>
        <div style={{ background: '#f8f9fa', borderRadius: 8, padding: '8px 4px' }}>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>{t.jobs_done}</div>
          <div style={{ fontWeight: 700 }}>{worker.completedJobs || 0}</div>
        </div>
      </div>

      {/* Rate */}
      {worker.dailyRate && (
        <div style={{ marginBottom: 12, fontWeight: 700, color: '#FF6B35', fontSize: '1.1rem' }}>
          ₹{worker.dailyRate} <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 400 }}>{t.perDay}</span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to={`/worker/${worker._id}`} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
          {t.viewProfile}
        </Link>
        {worker.isAvailableNow && (
          <button
            onClick={() => onHire && onHire(worker)}
            className="btn btn-primary btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {t.hireNow}
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkerCard;
