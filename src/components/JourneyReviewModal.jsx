import React, { useState } from 'react';
import { 
  FaStar, FaShieldAlt, FaCheck, FaTimes, 
  FaLightbulb, FaUsers, FaCarAlt, FaThumbsUp, FaExclamationTriangle
} from 'react-icons/fa';
import { addRouteReview } from '../services/routeReviewService';

const LIGHTING_OPTIONS = [
  'Well-lit throughout',
  'Adequate lighting on main road',
  'Dark / Broken lamps on service road',
  'Completely unlit / Dark spots'
];

const CROWD_OPTIONS = [
  'Good crowd & active shops',
  'Moderate traffic & commuters',
  'Isolated / Mostly deserted'
];

const POLICE_OPTIONS = [
  'Visible PCR van / active patrol',
  'Security guards / Metro CISF',
  'Police barricade present',
  'Zero police presence seen'
];

const DRIVER_OPTIONS = [
  'Professional & respectful',
  'Strictly followed GPS / No detour',
  'Unsolicited questions / Extra fare',
  'N/A (Metro / Walking)'
];

function JourneyReviewModal({ 
  isOpen, 
  onClose, 
  origin = 'Connaught Place, Central Delhi', 
  destination = 'Select Citywalk Mall, Saket, New Delhi', 
  travelMode = 'cab', 
  city = 'Delhi NCR',
  onReviewSubmitted 
}) {
  const [stars, setStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [lighting, setLighting] = useState('Well-lit throughout');
  const [crowd, setCrowd] = useState('Good crowd & active shops');
  const [police, setPolice] = useState('Visible PCR van / active patrol');
  const [driver, setDriver] = useState('Professional & respectful');
  const [experience, setExperience] = useState('');
  const [nightRecommendation, setNightRecommendation] = useState('yes');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const starLabels = {
    1: '🔴 Very Unsafe / High Distress',
    2: '🟠 Uncomfortable / Poor Lighting & Desolate',
    3: '🟡 Moderate / Needs Caution',
    4: '🟢 Good & Mostly Safe',
    5: '🟣 Highly Safe & Comfortable (Reassuring)'
  };

  const currentStarVal = hoverStars || stars;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = addRouteReview({
      origin,
      destination,
      city,
      travelMode,
      stars,
      comfortLevel: starLabels[stars] || 'Good & Safe',
      timeSlot: 'Night Journey (Recently Completed)',
      lighting,
      crowd,
      policePresence: police,
      driverBehavior: driver,
      experience: experience.trim() || 'Smooth travel experience. Corridor felt safe and navigable.',
      nightRecommendation,
      alias: `Verified Solo Traveler #${Math.floor(100 + Math.random() * 900)}`
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      if (onReviewSubmitted) onReviewSubmitted(newReview);
      onClose();
    }, 1600);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 8, 30, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          maxWidth: 640,
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          border: '2px solid #8B5CF6',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #160D33 0%, #2A175B 100%)',
            color: '#FFFFFF',
            padding: '24px',
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            position: 'relative'
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success bg-opacity-25 text-success border border-success" style={{ fontSize: '0.72rem' }}>
                ✓ JOURNEY COMPLETED
              </span>
              <h5 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem', color: '#FFFFFF' }}>
                Post-Journey Route Experience & Comfort Review
              </h5>
            </div>

            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-sm text-light p-1"
              style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8 }}
            >
              <FaTimes />
            </button>
          </div>

          <p style={{ color: '#CBD5E1', fontSize: '0.84rem', margin: 0, lineHeight: 1.4 }}>
            Your real experience on this route feeds directly into the AI safety engine so the <strong>next woman traveler</strong> knows exactly what to expect!
          </p>

          {/* ROUTE CORRIDOR PILL */}
          <div 
            className="mt-3 p-2 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-2"
            style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)' }}
          >
            <div style={{ fontSize: '0.78rem', color: '#E9D5FF' }}>
              📍 <strong>{origin.split(',')[0]}</strong> ➔ <strong>{destination.split(',')[0]}</strong>
            </div>
            <span className="badge bg-light text-dark" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
              {travelMode} mode
            </span>
          </div>
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: '24px' }}>
          {submitted ? (
            <div className="text-center py-5">
              <div 
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.4rem',
                  margin: '0 auto 18px',
                  boxShadow: '0 0 25px rgba(21, 128, 61, 0.25)'
                }}
              >
                <FaCheck />
              </div>
              <h4 style={{ fontWeight: 800, color: '#15803D', marginBottom: 8 }}>
                Route Intelligence Updated!
              </h4>
              <p style={{ color: '#475569', fontSize: '0.92rem', maxWidth: 460, margin: '0 auto' }}>
                Thank you sister! Your <strong>{stars}-Star</strong> comfort rating and route observations are now active for all women traveling between <strong>{origin.split(',')[0]}</strong> and <strong>{destination.split(',')[0]}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              
              {/* 1. STAR RATING (1 to 5) */}
              <div className="text-center p-3 rounded-4 mb-4" style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
                <label className="form-label fw-bold d-block mb-1" style={{ fontSize: '0.9rem', color: '#1E1238' }}>
                  How comfortable & safe did you feel on this route?
                </label>
                
                {/* 5 Big Clickable Stars */}
                <div className="d-flex justify-content-center align-items-center gap-2 my-2">
                  {[1, 2, 3, 4, 5].map((starNum) => (
                    <button
                      key={starNum}
                      type="button"
                      onClick={() => setStars(starNum)}
                      onMouseEnter={() => setHoverStars(starNum)}
                      onMouseLeave={() => setHoverStars(0)}
                      className="btn p-0 border-0 bg-transparent"
                      style={{
                        fontSize: '2.4rem',
                        cursor: 'pointer',
                        color: starNum <= currentStarVal ? '#F59E0B' : '#E2E8F0',
                        transform: starNum <= currentStarVal ? 'scale(1.12)' : 'scale(1)',
                        transition: 'transform 0.15s, color 0.15s'
                      }}
                      title={`${starNum} Stars`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>

                {/* Emotional Feedback Label */}
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#6355E6' }}>
                  {starLabels[currentStarVal]}
                </div>
              </div>

              {/* 2. REAL ROUTE SAFETY METRICS */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FaShieldAlt style={{ color: '#6355E6' }} />
                  <span className="fw-bold" style={{ fontSize: '0.88rem', color: '#1E1238' }}>
                    Route Conditions & Environmental Reality:
                  </span>
                </div>

                <div className="row g-3">
                  
                  {/* Street Lighting */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label mb-1" style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                      <FaLightbulb style={{ color: '#F59E0B' }} /> Street Lighting Quality
                    </label>
                    <select
                      value={lighting}
                      onChange={(e) => setLighting(e.target.value)}
                      className="form-select form-select-sm"
                      style={{ fontSize: '0.8rem', borderRadius: 8 }}
                    >
                      {LIGHTING_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Crowd & Activity */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label mb-1" style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                      <FaUsers style={{ color: '#3B82F6' }} /> Pedestrian & Shop Crowd
                    </label>
                    <select
                      value={crowd}
                      onChange={(e) => setCrowd(e.target.value)}
                      className="form-select form-select-sm"
                      style={{ fontSize: '0.8rem', borderRadius: 8 }}
                    >
                      {CROWD_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Police & PCR Presence */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label mb-1" style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                      <FaShieldAlt style={{ color: '#10B981' }} /> Police & Security Presence
                    </label>
                    <select
                      value={police}
                      onChange={(e) => setPolice(e.target.value)}
                      className="form-select form-select-sm"
                      style={{ fontSize: '0.8rem', borderRadius: 8 }}
                    >
                      {POLICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Driver / Transit Behavior */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label mb-1" style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                      <FaCarAlt style={{ color: '#8B5CF6' }} /> Driver / Transit Behavior
                    </label>
                    <select
                      value={driver}
                      onChange={(e) => setDriver(e.target.value)}
                      className="form-select form-select-sm"
                      style={{ fontSize: '0.8rem', borderRadius: 8 }}
                    >
                      {DRIVER_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>

              {/* 3. DETAILED EXPERIENCE TEXT */}
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <label className="form-label fw-bold mb-0" style={{ fontSize: '0.86rem', color: '#1E1238' }}>
                    Explain your experience on this route for next travelers:
                  </label>
                  <small style={{ color: '#94A3B8', fontSize: '0.72rem' }}>Helpful for other women</small>
                </div>
                <textarea
                  rows={3}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g., Which turns were well-lit, any unlit underpasses, auto stand availability, police checking points, or specific guidance for solo women traveling after 9 PM..."
                  className="form-control"
                  style={{ fontSize: '0.85rem', borderRadius: 10, lineHeight: 1.5 }}
                />
              </div>

              {/* 4. NIGHT TRAVEL RECOMMENDATION */}
              <div className="mb-4">
                <label className="form-label fw-bold mb-2" style={{ fontSize: '0.84rem', color: '#1E1238' }}>
                  Would you recommend this route to other women at night?
                </label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNightRecommendation('yes')}
                    className="btn btn-sm flex-fill py-2 d-flex align-items-center justify-content-center gap-1 border"
                    style={{
                      borderRadius: 10,
                      backgroundColor: nightRecommendation === 'yes' ? '#DCFCE7' : '#F8FAFC',
                      borderColor: nightRecommendation === 'yes' ? '#16A34A' : '#E2E8F0',
                      color: nightRecommendation === 'yes' ? '#15803D' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    <FaThumbsUp /> Yes, Safe for Night
                  </button>

                  <button
                    type="button"
                    onClick={() => setNightRecommendation('caution')}
                    className="btn btn-sm flex-fill py-2 d-flex align-items-center justify-content-center gap-1 border"
                    style={{
                      borderRadius: 10,
                      backgroundColor: nightRecommendation === 'caution' ? '#FEF3C7' : '#F8FAFC',
                      borderColor: nightRecommendation === 'caution' ? '#D97706' : '#E2E8F0',
                      color: nightRecommendation === 'caution' ? '#B45309' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    <FaExclamationTriangle /> Safe with Precaution
                  </button>

                  <button
                    type="button"
                    onClick={() => setNightRecommendation('no')}
                    className="btn btn-sm flex-fill py-2 d-flex align-items-center justify-content-center gap-1 border"
                    style={{
                      borderRadius: 10,
                      backgroundColor: nightRecommendation === 'no' ? '#FEE2E2' : '#F8FAFC',
                      borderColor: nightRecommendation === 'no' ? '#DC2626' : '#E2E8F0',
                      color: nightRecommendation === 'no' ? '#B91C1C' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    <FaTimes /> Avoid Late Night
                  </button>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  🔒 Anonymous · 0 Personal Data Exposed
                </span>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-sm btn-light px-3"
                    style={{ borderRadius: 8, fontWeight: 600 }}
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm px-4 py-2"
                    style={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: '#FFFFFF',
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    Submit Route Review & Help Next Travelers 🚀
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default JourneyReviewModal;
