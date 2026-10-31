import React, { useState, useEffect } from 'react';
import { 
  FaStar, FaShieldAlt, FaLightbulb, FaUsers, 
  FaPen, FaQuoteLeft
} from 'react-icons/fa';
import { getRouteSafetyIntelligence } from '../services/routeReviewService';
import JourneyReviewModal from './JourneyReviewModal';

function RouteSafetyIntelligenceCard({ origin, destination, travelMode = 'cab', city = 'Delhi NCR' }) {
  const [intel, setIntel] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchIntel = () => {
    const data = getRouteSafetyIntelligence(origin, destination);
    setIntel(data);
  };

  useEffect(() => {
    fetchIntel();
    const handleUpdate = () => fetchIntel();
    window.addEventListener('herhub_route_reviewed', handleUpdate);
    return () => window.removeEventListener('herhub_route_reviewed', handleUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, destination]);

  if (!intel) return null;

  const originShort = (origin || 'Origin').split(',')[0];
  const destShort = (destination || 'Destination').split(',')[0];

  return (
    <>
      <div 
        className="card border-0 rounded-4 shadow-sm p-4 mb-4"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F3FF 100%)',
          border: '1.5px solid #DDD6FE',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* TOP ACCENT BADGE */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div className="d-flex align-items-center gap-2">
            <span 
              className="badge px-3 py-1 d-inline-flex align-items-center gap-1"
              style={{
                backgroundColor: '#EDE9FE',
                color: '#6355E6',
                border: '1px solid #C4B5FD',
                fontSize: '0.74rem',
                fontWeight: 800,
                borderRadius: 8
              }}
            >
              <FaShieldAlt /> CROWDSOURCED ROUTE SAFETY INTELLIGENCE
            </span>
            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style={{ fontSize: '0.7rem' }}>
              ✓ Live Feedback Loop Active
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsReviewModalOpen(true)}
            className="btn btn-sm d-inline-flex align-items-center gap-1 py-1 px-3"
            style={{
              backgroundColor: '#6355E6',
              color: '#FFFFFF',
              borderRadius: 8,
              fontSize: '0.74rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(99, 85, 230, 0.3)'
            }}
          >
            <FaPen style={{ fontSize: '0.65rem' }} />
            <span>+ Review This Route</span>
          </button>
        </div>

        {/* STAR RATING & COMFORT SUMMARY BANNER */}
        <div className="row g-3 align-items-center mb-3">
          
          {/* Left: Star Score */}
          <div className="col-12 col-md-5">
            <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-white border" style={{ borderColor: '#E9E5FD' }}>
              <div 
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 14,
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 900
                }}
              >
                {intel.avgStars}
              </div>

              <div>
                <div className="d-flex align-items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FaStar 
                      key={s} 
                      style={{ 
                        color: s <= Math.round(intel.avgStars) ? '#F59E0B' : '#CBD5E1',
                        fontSize: '0.9rem' 
                      }} 
                    />
                  ))}
                  <span style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 700, marginLeft: 4 }}>
                    ({intel.totalReviews} past reviews)
                  </span>
                </div>
                
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: intel.avgStars >= 4.0 ? '#15803D' : '#D97706' }}>
                  {intel.verdict}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Key Safety Metrics */}
          <div className="col-12 col-md-7">
            <div className="row g-2 text-center">
              
              <div className="col-4">
                <div className="p-2 rounded-3 bg-white border" style={{ borderColor: '#E9E5FD' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                    <FaLightbulb style={{ color: '#F59E0B' }} /> Lighting
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B' }}>
                    {intel.lightingPct}%
                  </div>
                  <small style={{ fontSize: '0.65rem', color: '#10B981' }}>Well-lit roads</small>
                </div>
              </div>

              <div className="col-4">
                <div className="p-2 rounded-3 bg-white border" style={{ borderColor: '#E9E5FD' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                    <FaShieldAlt style={{ color: '#10B981' }} /> Patrol
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B' }}>
                    {intel.policePct}%
                  </div>
                  <small style={{ fontSize: '0.65rem', color: '#10B981' }}>PCR Presence</small>
                </div>
              </div>

              <div className="col-4">
                <div className="p-2 rounded-3 bg-white border" style={{ borderColor: '#E9E5FD' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                    <FaUsers style={{ color: '#8B5CF6' }} /> Comfort
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#6355E6' }}>
                    {intel.comfortPct}%
                  </div>
                  <small style={{ fontSize: '0.65rem', color: '#6355E6' }}>Night Confirmed</small>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RECENT TRAVELER OBSERVATIONS & ADVICE */}
        <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1px solid #EDE9FE' }}>
          <div className="d-flex align-items-center gap-1 mb-2">
            <FaQuoteLeft style={{ color: '#8B5CF6', fontSize: '0.75rem' }} />
            <strong style={{ fontSize: '0.78rem', color: '#4C1D95' }}>
              Real Advice from Women Who Traveled {originShort} ➔ {destShort}:
            </strong>
          </div>

          <div className="d-flex flex-column gap-2">
            {intel.recentReviews.slice(0, 2).map((rev) => (
              <div 
                key={rev.id} 
                className="p-2 rounded-2"
                style={{ backgroundColor: '#FAF5FF', borderLeft: '3px solid #8B5CF6' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="d-flex align-items-center gap-1">
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1E1238' }}>
                      {rev.alias}
                    </span>
                    <span className="badge bg-light text-muted" style={{ fontSize: '0.62rem' }}>
                      {rev.travelMode} · {rev.timeSlot}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-1 text-warning" style={{ fontSize: '0.68rem' }}>
                    <span>{'★'.repeat(rev.stars)}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.4 }}>
                  "{rev.experience}"
                </div>

                <div className="mt-1 d-flex gap-2" style={{ fontSize: '0.68rem', color: '#64748B' }}>
                  <span>💡 {rev.lighting}</span>
                  <span>·</span>
                  <span>👮 {rev.policePresence}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 text-end">
            <small style={{ color: '#7C3AED', fontSize: '0.72rem', fontWeight: 600 }}>
              💡 How it works: When your journey ends, your rating is added here to guide the next traveler!
            </small>
          </div>
        </div>

      </div>

      {/* POST-JOURNEY REVIEW MODAL */}
      <JourneyReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        origin={origin}
        destination={destination}
        travelMode={travelMode}
        city={city}
        onReviewSubmitted={() => fetchIntel()}
      />
    </>
  );
}

export default RouteSafetyIntelligenceCard;
