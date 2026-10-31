import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStar, FaShieldAlt, FaLightbulb, 
  FaSearch, FaFilter, FaPen, FaArrowLeft, FaCheck, FaCar, FaBus, FaWalking, FaTaxi
} from 'react-icons/fa';
import { getAllReviews } from '../services/routeReviewService';
import JourneyReviewModal from '../components/JourneyReviewModal';

const MODE_ICONS = {
  cab: <FaCar />,
  auto: <FaTaxi />,
  metro: <FaBus />,
  walking: <FaWalking />,
  bus: <FaBus />,
  'e-rickshaw': <FaTaxi />
};

function RouteIntelligencePage() {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [starFilter, setStarFilter] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRouteForReview, setSelectedRouteForReview] = useState({
    origin: 'Connaught Place, Central Delhi',
    destination: 'Select Citywalk Mall, Saket, New Delhi'
  });

  const refreshReviews = () => {
    setReviews(getAllReviews());
  };

  useEffect(() => {
    refreshReviews();
    const handleUpdate = () => refreshReviews();
    window.addEventListener('herhub_route_reviewed', handleUpdate);
    return () => window.removeEventListener('herhub_route_reviewed', handleUpdate);
  }, []);

  const filteredReviews = reviews.filter((r) => {
    const matchesQuery = 
      (r.origin || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.destination || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.routeKey || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.experience || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMode = modeFilter === 'all' || (r.travelMode || '').toLowerCase() === modeFilter;
    const matchesStar = starFilter === 0 || (r.stars || 5) >= starFilter;

    return matchesQuery && matchesMode && matchesStar;
  });

  // Calculate overall platform stats
  const totalReviews = reviews.length;
  const avgOverallStars = (reviews.reduce((acc, r) => acc + (r.stars || 5), 0) / (totalReviews || 1)).toFixed(1);
  const recommendedPct = Math.round((reviews.filter(r => r.nightRecommendation === 'yes').length / (totalReviews || 1)) * 100);

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '70px' }}>
      
      {/* ════════ HERO BANNER ════════ */}
      <section 
        style={{ 
          background: 'linear-gradient(135deg, #160D33 0%, #25124D 60%, #15092E 100%)', 
          color: '#FFFFFF', 
          padding: '45px 0 55px',
          borderBottom: '1px solid rgba(139, 92, 246, 0.25)'
        }}
      >
        <div className="container">
          
          <Link 
            to="/saferoute-ai" 
            className="d-inline-flex align-items-center gap-2 mb-3 text-decoration-none"
            style={{ color: '#A5B4FC', fontSize: '0.86rem', fontWeight: 600 }}
          >
            <FaArrowLeft /> Back to SafeRoute AI
          </Link>

          <div className="row align-items-center justify-content-between g-4">
            <div className="col-12 col-lg-8">
              
              <div className="d-flex align-items-center gap-2 mb-2">
                <span 
                  className="badge px-3 py-1 d-inline-flex align-items-center gap-2"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#6EE7B7', fontSize: '0.74rem', fontWeight: 800 }}
                >
                  <FaCheck /> REAL WOMEN ROUTE EXPERIENCE DATABASE
                </span>
                <span className="badge bg-light bg-opacity-10 text-light" style={{ fontSize: '0.74rem' }}>
                  ⭐ {avgOverallStars} / 5.0 Average Safety Rating
                </span>
              </div>

              <h1 style={{ fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 2.7rem)', letterSpacing: '-0.5px', marginBottom: 12 }}>
                Crowdsourced Route Safety Intelligence
              </h1>

              <p style={{ color: '#CBD5E1', fontSize: '1rem', lineHeight: 1.6, maxWidth: 680, margin: 0 }}>
                Every time a woman completes a journey, she rates the route’s comfort, lighting, and police presence. This collective experience continuously trains the system and guides the next solo woman traveler!
              </p>

            </div>

            {/* ACTION CTA BOX */}
            <div className="col-12 col-lg-4 text-lg-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedRouteForReview({
                    origin: 'Connaught Place, Central Delhi',
                    destination: 'Select Citywalk Mall, Saket, New Delhi'
                  });
                  setIsReviewModalOpen(true);
                }}
                className="btn py-3 px-4 d-inline-flex align-items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  borderRadius: 14,
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.45)',
                  border: 'none'
                }}
              >
                <FaPen />
                <span>+ Rate a Route You Traveled</span>
              </button>

              <div className="mt-2 text-start text-lg-end">
                <small style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                  🔒 100% Anonymous · Your feedback protects the sisterhood
                </small>
              </div>
            </div>

          </div>

          {/* 3 STATS PILLARS */}
          <div className="row g-3 mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center gap-2">
                <div style={{ color: '#F59E0B', fontSize: '1.4rem' }}><FaStar /></div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFFFFF' }}>{totalReviews} Verified Route Debriefs</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Real experiences logged by women commuters.</div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center gap-2">
                <div style={{ color: '#10B981', fontSize: '1.4rem' }}><FaShieldAlt /></div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFFFFF' }}>{recommendedPct}% Night Safety Endorsement</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Verified safe corridors for solo night travel.</div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center gap-2">
                <div style={{ color: '#C084FC', fontSize: '1.4rem' }}><FaLightbulb /></div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFFFFF' }}>Live Environmental Telemetry</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Real-time lighting, crowd, and police monitoring.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ════════ SEARCH & FILTERS ════════ */}
      <div className="container mt-4">
        <div className="bg-white p-3 rounded-4 shadow-sm border mb-4">
          <div className="row g-3 align-items-center justify-content-between">
            
            {/* Search Input */}
            <div className="col-12 col-lg-5">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0">
                  <FaSearch style={{ color: '#94A3B8' }} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search route (e.g. Saket, Noida, MG Road, Bauliya, BKC)..."
                  className="form-control border-start-0"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Travel Mode Filter */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="d-flex align-items-center gap-1">
                <span className="text-muted me-1" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                  <FaFilter /> Mode:
                </span>
                {['all', 'cab', 'auto', 'metro'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModeFilter(m)}
                    className="btn btn-sm py-1 px-2 text-capitalize"
                    style={{
                      borderRadius: 16,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: modeFilter === m ? '#6355E6' : '#F1F5F9',
                      color: modeFilter === m ? '#FFFFFF' : '#475569',
                      border: 'none'
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Star Filter */}
            <div className="col-12 col-sm-6 col-lg-3 text-sm-end">
              <select
                value={starFilter}
                onChange={(e) => setStarFilter(Number(e.target.value))}
                className="form-select form-select-sm d-inline-block w-auto"
                style={{ fontSize: '0.8rem', borderRadius: 8 }}
              >
                <option value={0}>All Star Ratings</option>
                <option value={5}>⭐⭐⭐⭐⭐ Only (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ & above (4+ Stars)</option>
                <option value={3}>⭐⭐⭐ & above (3+ Stars)</option>
              </select>
            </div>

          </div>
        </div>

        {/* ════════ ROUTE REVIEWS CARDS GRID ════════ */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-4 p-5 text-center shadow-sm border">
            <FaShieldAlt style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: 12 }} />
            <h5 style={{ fontWeight: 800, color: '#1E293B' }}>No route reviews found for this search</h5>
            <p style={{ color: '#64748B', fontSize: '0.88rem', maxWidth: 450, margin: '0 auto 20px' }}>
              Be the first woman traveler to rate this corridor and guide future commuters!
            </p>
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="btn btn-primary px-4 py-2"
              style={{ borderRadius: 10, fontWeight: 700, backgroundColor: '#6355E6' }}
            >
              + Rate This Corridor Now
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {filteredReviews.map((r) => (
              <div key={r.id} className="col-12 col-md-6 col-lg-4">
                <div 
                  className="card h-100 border-0 shadow-sm rounded-4 p-4 d-flex flex-column justify-content-between"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #EDE8FE',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(99, 85, 230, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    {/* ROUTE HEADER & STARS */}
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span 
                        className="badge px-2 py-1 d-inline-flex align-items-center gap-1"
                        style={{
                          backgroundColor: '#F3EEFF',
                          color: '#6355E6',
                          border: '1px solid #D5CEFD',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          borderRadius: 6
                        }}
                      >
                        {MODE_ICONS[r.travelMode] || <FaCar />} {r.travelMode ? r.travelMode.toUpperCase() : 'TRANSIT'}
                      </span>

                      {/* Stars */}
                      <div className="d-flex align-items-center gap-1 text-warning">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStar 
                            key={s} 
                            style={{ 
                              color: s <= r.stars ? '#F59E0B' : '#E2E8F0', 
                              fontSize: '0.8rem' 
                            }} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* CORRIDOR TITLE */}
                    <h6 style={{ fontWeight: 800, color: '#1E1238', marginBottom: 4 }}>
                      {r.origin.split(',')[0]} ➔ {r.destination.split(',')[0]}
                    </h6>
                    <small style={{ color: '#94A3B8', fontSize: '0.72rem', display: 'block', marginBottom: 12 }}>
                      {r.city} · {r.timeSlot}
                    </small>

                    {/* EXPERIENCE TEXT */}
                    <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5, marginBottom: 16 }}>
                      "{r.experience}"
                    </p>

                    {/* ROUTE METRICS BADGES */}
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      <span className="badge bg-light text-dark border" style={{ fontSize: '0.68rem' }}>
                        💡 {r.lighting}
                      </span>
                      <span className="badge bg-light text-dark border" style={{ fontSize: '0.68rem' }}>
                        👥 {r.crowd}
                      </span>
                      <span className="badge bg-light text-dark border" style={{ fontSize: '0.68rem' }}>
                        👮 {r.policePresence}
                      </span>
                    </div>
                  </div>

                  {/* CARD FOOTER */}
                  <div className="pt-3 border-top" style={{ borderColor: '#F1F5F9' }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-1">
                        <FaShieldAlt style={{ color: '#10B981', fontSize: '0.75rem' }} />
                        <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                          {r.alias}
                        </span>
                      </div>

                      {/* Night Verdict Badge */}
                      <span 
                        className={`badge ${r.nightRecommendation === 'yes' ? 'bg-success' : r.nightRecommendation === 'caution' ? 'bg-warning text-dark' : 'bg-danger'} bg-opacity-10`}
                        style={{
                          fontSize: '0.7rem',
                          color: r.nightRecommendation === 'yes' ? '#15803D' : r.nightRecommendation === 'caution' ? '#B45309' : '#B91C1C',
                          fontWeight: 700
                        }}
                      >
                        {r.nightRecommendation === 'yes' ? '✓ Night Safe' : r.nightRecommendation === 'caution' ? '⚠️ Precaution' : '✕ Avoid Late'}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* POST-JOURNEY REVIEW MODAL */}
      <JourneyReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        origin={selectedRouteForReview.origin}
        destination={selectedRouteForReview.destination}
        onReviewSubmitted={() => refreshReviews()}
      />

    </div>
  );
}

export default RouteIntelligencePage;
