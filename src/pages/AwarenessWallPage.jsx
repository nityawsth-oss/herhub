import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBullhorn, FaShieldAlt, FaHeart, FaShareAlt, FaSearch, 
  FaFilter, FaLock, FaCheck, FaPen, FaArrowLeft
} from 'react-icons/fa';
import { getThoughts, likeThought, isThoughtLiked } from '../services/communityThoughtsService';
import ShareThoughtModal from '../components/ShareThoughtModal';

const CATEGORIES = [
  'All',
  'Legal Right',
  'Night Safety',
  'Safety Alert',
  'Cyber Defense',
  'Solidarity & Courage',
  'Public Transit'
];

function AwarenessWallPage() {
  const [thoughts, setThoughts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const refreshList = () => {
    setThoughts(getThoughts());
  };

  useEffect(() => {
    refreshList();
    const handleUpdate = () => refreshList();
    window.addEventListener('herhub_thoughts_updated', handleUpdate);
    return () => window.removeEventListener('herhub_thoughts_updated', handleUpdate);
  }, []);

  const handleLike = (id) => {
    likeThought(id);
    refreshList();
  };

  const handleShare = (thought) => {
    const textToCopy = `📢 [HERHUB AWARENESS TIP - ${thought.category}]\n"${thought.content}"\n— Shared Anonymously via HERHUB (Women's Safety Platform)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(thought.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredThoughts = thoughts.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesQuery = 
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.region && t.region.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '70px' }}>
      
      {/* ════════ HERO BANNER ════════ */}
      <section 
        style={{ 
          background: 'linear-gradient(135deg, #120926 0%, #200E44 60%, #150B2E 100%)', 
          color: '#FFFFFF', 
          padding: '45px 0 55px',
          borderBottom: '1px solid rgba(139, 92, 246, 0.25)'
        }}
      >
        <div className="container">
          
          <Link 
            to="/" 
            className="d-inline-flex align-items-center gap-2 mb-3 text-decoration-none"
            style={{ color: '#A5B4FC', fontSize: '0.86rem', fontWeight: 600 }}
          >
            <FaArrowLeft /> Back to Home
          </Link>

          <div className="row align-items-center justify-content-between g-4">
            <div className="col-12 col-lg-8">
              
              <div className="d-flex align-items-center gap-2 mb-2">
                <span 
                  className="badge px-3 py-1 d-inline-flex align-items-center gap-2"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '0.74rem', fontWeight: 800 }}
                >
                  <span className="spinner-grow spinner-grow-sm text-danger" style={{ width: 8, height: 8 }} />
                  LIVE COMMUNITY HEADLINE NETWORK
                </span>
                <span className="badge bg-light bg-opacity-10 text-light" style={{ fontSize: '0.74rem' }}>
                  🔒 100% Identity Protected
                </span>
              </div>

              <h1 style={{ fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 2.8rem)', letterSpacing: '-0.5px', marginBottom: 12 }}>
                Anonymous Awareness & Safety Voices
              </h1>

              <p style={{ color: '#CBD5E1', fontSize: '1rem', lineHeight: 1.6, maxWidth: 680, margin: 0 }}>
                A crowdsourced digital shield where women across India post safety alerts, legal rights, night navigation tips, and words of solidarity. Every thought slides live across the <strong>top of HERHUB</strong> without disclosing any personal identity.
              </p>

            </div>

            {/* ACTION CTA BOX */}
            <div className="col-12 col-lg-4 text-lg-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn py-3 px-4 d-inline-flex align-items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #6355E6 0%, #8A7CFE 100%)',
                  color: '#FFFFFF',
                  borderRadius: 14,
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  boxShadow: '0 8px 25px rgba(99, 85, 230, 0.45)',
                  border: 'none'
                }}
              >
                <FaPen />
                <span>+ Share Your Awareness Thought</span>
              </button>

              <div className="mt-2 text-start text-lg-end">
                <small style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                  <FaShieldAlt style={{ color: '#10B981' }} /> Automatic PII Scrubber Active · Zero Names Logged
                </small>
              </div>
            </div>

          </div>

          {/* 3 PILLARS OF ZERO DISCLOSURE */}
          <div className="row g-3 mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center gap-2">
                <div style={{ color: '#6EE7B7', fontSize: '1.2rem' }}><FaLock /></div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>Zero Personal Data Storage</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>No real names, phone numbers, or IP tracking.</div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center gap-2">
                <div style={{ color: '#FCD34D', fontSize: '1.2rem' }}><FaBullhorn /></div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>Sliding Top Website Marquee</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Instantly broadcasted across the header ticker.</div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center gap-2">
                <div style={{ color: '#F472B6', fontSize: '1.2rem' }}><FaHeart /></div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>Solidarity & Support Counter</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Stand with sisters to amplify vital safety alerts.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ════════ SEARCH & CATEGORY FILTER ════════ */}
      <div className="container mt-4">
        <div className="bg-white p-3 rounded-4 shadow-sm border mb-4">
          <div className="row g-3 align-items-center justify-content-between">
            
            {/* Category tabs */}
            <div className="col-12 col-lg-8">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="text-muted d-none d-md-inline me-1" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  <FaFilter /> Filter:
                </span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className="btn btn-sm py-1 px-3"
                    style={{
                      borderRadius: 20,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      backgroundColor: selectedCategory === cat ? '#6355E6' : '#F1F5F9',
                      color: selectedCategory === cat ? '#FFFFFF' : '#475569',
                      border: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="col-12 col-lg-4">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0">
                  <FaSearch style={{ color: '#94A3B8' }} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tips, metro, legal rules..."
                  className="form-control border-start-0"
                  style={{ fontSize: '0.82rem' }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* ════════ THOUGHTS CARDS GRID ════════ */}
        {filteredThoughts.length === 0 ? (
          <div className="bg-white rounded-4 p-5 text-center shadow-sm border">
            <FaBullhorn style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: 12 }} />
            <h5 style={{ fontWeight: 800, color: '#1E293B' }}>No awareness thoughts found in this category</h5>
            <p style={{ color: '#64748B', fontSize: '0.88rem', maxWidth: 450, margin: '0 auto 20px' }}>
              Be the first to spread crucial safety tips or legal knowledge to protect women nationwide!
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary px-4 py-2"
              style={{ borderRadius: 10, fontWeight: 700, backgroundColor: '#6355E6' }}
            >
              + Post First Awareness Thought
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {filteredThoughts.map((t) => {
              const isLiked = isThoughtLiked(t.id);
              return (
                <div key={t.id} className="col-12 col-md-6 col-lg-4">
                  <div 
                    className="card h-100 border-0 shadow-sm rounded-4 p-4 d-flex flex-column justify-content-between"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 12px 25px rgba(99, 85, 230, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* TOP BADGE */}
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span 
                          className="badge px-2 py-1 d-inline-flex align-items-center gap-1"
                          style={{
                            backgroundColor: `${t.categoryColor || '#8B5CF6'}18`,
                            color: t.categoryColor || '#8B5CF6',
                            border: `1px solid ${t.categoryColor || '#8B5CF6'}40`,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            borderRadius: 6
                          }}
                        >
                          {t.icon || '💡'} {t.category}
                        </span>

                        <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                          {t.timestamp || 'Recent'}
                        </span>
                      </div>

                      {/* THOUGHT TEXT */}
                      <p 
                        style={{
                          fontSize: '0.92rem',
                          color: '#1E293B',
                          lineHeight: 1.6,
                          fontWeight: 500,
                          marginBottom: 20
                        }}
                      >
                        "{t.content}"
                      </p>
                    </div>

                    {/* FOOTER & ANONYMITY */}
                    <div className="pt-3 border-top" style={{ borderColor: '#F1F5F9' }}>
                      <div className="d-flex align-items-center justify-content-between">
                        
                        {/* Safe Alias */}
                        <div className="d-flex align-items-center gap-1">
                          <FaShieldAlt style={{ color: '#10B981', fontSize: '0.75rem' }} />
                          <div>
                            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>
                              {t.alias}
                            </span>
                            {t.region && (
                              <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                                {t.region}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ACTION BUTTONS: LIKE & COPY */}
                        <div className="d-flex align-items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleLike(t.id)}
                            className="btn btn-sm d-inline-flex align-items-center gap-1 py-1 px-2 border"
                            style={{
                              borderRadius: 8,
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              backgroundColor: isLiked ? '#FDF2F8' : '#F8FAFC',
                              borderColor: isLiked ? '#F472B6' : '#E2E8F0',
                              color: isLiked ? '#DB2777' : '#64748B'
                            }}
                            title="Stand with this sister"
                          >
                            <FaHeart style={{ transform: isLiked ? 'scale(1.1)' : 'none' }} />
                            <span>{t.likes || 0}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShare(t)}
                            className="btn btn-sm d-inline-flex align-items-center gap-1 py-1 px-2 border"
                            style={{
                              borderRadius: 8,
                              fontSize: '0.74rem',
                              backgroundColor: copiedId === t.id ? '#DCFCE7' : '#F8FAFC',
                              borderColor: copiedId === t.id ? '#86EFAC' : '#E2E8F0',
                              color: copiedId === t.id ? '#15803D' : '#64748B'
                            }}
                            title="Copy tip to share"
                          >
                            {copiedId === t.id ? <FaCheck /> : <FaShareAlt />}
                            <span>{copiedId === t.id ? 'Copied' : 'Share'}</span>
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* SHARE THOUGHT MODAL */}
      <ShareThoughtModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onThoughtAdded={() => refreshList()}
      />

    </div>
  );
}

export default AwarenessWallPage;
