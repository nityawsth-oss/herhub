import React, { useState } from 'react';
import { FaShieldAlt, FaTimes, FaCheck, FaBullhorn, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { addThought, checkPII } from '../services/communityThoughtsService';

const CATEGORIES = [
  { label: 'Legal Right', icon: '⚖️', desc: 'BNSS, FIR rules, Section 354, POSH act' },
  { label: 'Night Safety', icon: '💡', desc: 'Cab tactics, unlit streets, safe navigation' },
  { label: 'Safety Alert', icon: '⚠️', desc: 'Hazard notice, broken streetlights, suspicious spots' },
  { label: 'Cyber Defense', icon: '🛡️', desc: 'Deepfakes, extortion, phishing links, 1930' },
  { label: 'Solidarity & Courage', icon: '💜', desc: 'Sisterhood support, mental strength, inspiring voice' },
  { label: 'Public Transit', icon: '🚌', desc: 'Metro coaches, pink buses, auto meter tips' }
];

const ALIAS_PRESETS = [
  'Anonymous Sister',
  'Guardian Voice',
  'Night Commuter',
  'Campus Student',
  'Legal Advocate',
  'Delhi NCR Commuter',
  'Bengaluru Techie'
];

function ShareThoughtModal({ isOpen, onClose, onThoughtAdded }) {
  const [category, setCategory] = useState('Night Safety');
  const [selectedAliasPreset, setSelectedAliasPreset] = useState('Anonymous Sister');
  const [customAlias, setCustomAlias] = useState('');
  const [region, setRegion] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Real-time PII detection
  const piiCheck = checkPII(content);

  const effectiveAlias = customAlias.trim() 
    ? customAlias.trim() 
    : `${selectedAliasPreset} #${Math.floor(100 + Math.random() * 900)}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 10) {
      setErrorMsg('Please write at least 10 characters to share a meaningful awareness thought.');
      return;
    }

    const newThought = addThought({
      category,
      content,
      alias: effectiveAlias,
      region: region.trim() || 'Community Verified'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContent('');
      setCustomAlias('');
      setRegion('');
      setErrorMsg('');
      if (onThoughtAdded) onThoughtAdded(newThought);
      onClose();
    }, 1400);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 9, 28, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
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
          borderRadius: 22,
          maxWidth: 620,
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          border: '1.5px solid #E5E1F9',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #180F33 0%, #2A175B 100%)',
            color: '#FFFFFF',
            padding: '22px 24px',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'relative'
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <div 
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: 'rgba(139, 92, 246, 0.25)',
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C4B5FD',
                  fontSize: '1rem'
                }}
              >
                <FaBullhorn />
              </div>
              <h5 style={{ margin: 0, fontWeight: 800, fontSize: '1.15rem' }}>
                Share Awareness & Safety Thoughts
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

          {/* ZERO DATA / ANONYMOUS PROMISE BADGE */}
          <div 
            className="p-2 rounded-3 d-flex align-items-center gap-2"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)' }}
          >
            <FaLock style={{ color: '#6EE7B7', fontSize: '0.82rem' }} />
            <span style={{ fontSize: '0.74rem', color: '#D1FAE5', lineHeight: 1.35 }}>
              <strong>100% Zero-Identity Privacy:</strong> Your name, phone, IP, and email are <strong>never stored</strong> or exposed. Auto PII filter is live.
            </span>
          </div>
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: '24px' }}>
          {submitted ? (
            <div className="text-center py-4">
              <div 
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  margin: '0 auto 16px'
                }}
              >
                <FaCheck />
              </div>
              <h4 style={{ fontWeight: 800, color: '#15803D', marginBottom: 8 }}>
                Broadcasted to Website Headline!
              </h4>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                Your thought is now sliding live across the top of HERHUB to protect and empower women nationwide.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              
              {/* 1. SELECT CATEGORY */}
              <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: '#1E1238' }}>
                  1. Select Awareness Category
                </label>
                <div className="row g-2">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.label} className="col-6 col-sm-4">
                      <button
                        type="button"
                        onClick={() => setCategory(cat.label)}
                        className="w-100 text-start p-2 rounded-3 border transition-all"
                        style={{
                          backgroundColor: category === cat.label ? '#F3EEFF' : '#F8FAFC',
                          borderColor: category === cat.label ? '#6355E6' : '#E2E8F0',
                          borderWidth: category === cat.label ? 2 : 1,
                          cursor: 'pointer'
                        }}
                      >
                        <div className="d-flex align-items-center gap-1 mb-1">
                          <span>{cat.icon}</span>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: category === cat.label ? '#6355E6' : '#1E293B' }}>
                            {cat.label}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.2 }}>
                          {cat.desc}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. CHOOSE ANONYMOUS PSEUDONYM */}
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <label className="form-label fw-bold mb-0" style={{ fontSize: '0.85rem', color: '#1E1238' }}>
                    2. Anonymous Identity Alias
                  </label>
                  <span className="badge bg-light text-muted" style={{ fontSize: '0.7rem' }}>
                    <FaShieldAlt style={{ color: '#10B981' }} /> Identity Protected
                  </span>
                </div>
                
                {/* Presets */}
                <div className="d-flex flex-wrap gap-1 mb-2">
                  {ALIAS_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setSelectedAliasPreset(preset);
                        setCustomAlias('');
                      }}
                      className="btn btn-sm py-1 px-2"
                      style={{
                        fontSize: '0.73rem',
                        fontWeight: 600,
                        borderRadius: 20,
                        backgroundColor: selectedAliasPreset === preset && !customAlias ? '#6355E6' : '#F1F5F9',
                        color: selectedAliasPreset === preset && !customAlias ? '#FFFFFF' : '#475569',
                        border: 'none'
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="row g-2">
                  <div className="col-12 col-sm-6">
                    <input
                      type="text"
                      placeholder="Or custom safe alias (e.g. Metro commuter)"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      className="form-control form-control-sm"
                      style={{ fontSize: '0.8rem', borderRadius: 8 }}
                      maxLength={30}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <input
                      type="text"
                      placeholder="City/Region (e.g. Delhi NCR, Mumbai, Bengaluru)"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="form-control form-control-sm"
                      style={{ fontSize: '0.8rem', borderRadius: 8 }}
                      maxLength={40}
                    />
                  </div>
                </div>
              </div>

              {/* 3. YOUR THOUGHT / AWARENESS MESSAGE */}
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <label className="form-label fw-bold mb-0" style={{ fontSize: '0.85rem', color: '#1E1238' }}>
                    3. Your Thought / Safety Awareness Message
                  </label>
                  <span style={{ fontSize: '0.72rem', color: content.length > 250 ? '#EF4444' : '#64748B' }}>
                    {content.length}/280 characters
                  </span>
                </div>

                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Share a real safety tip, a legal right women should know, a cautious route notice, or an inspiring solidarity thought..."
                  className="form-control"
                  style={{
                    fontSize: '0.88rem',
                    borderRadius: 12,
                    borderColor: piiCheck.hasPII ? '#F59E0B' : '#CBD5E1',
                    lineHeight: 1.5
                  }}
                  maxLength={280}
                  required
                />

                {/* Real-Time PII Scrubbing Alert */}
                {piiCheck.hasPII && (
                  <div 
                    className="p-2 rounded-2 mt-2 d-flex align-items-center gap-2"
                    style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }}
                  >
                    <FaExclamationTriangle style={{ color: '#D97706', fontSize: '0.9rem', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.75rem', color: '#92400E' }}>
                      <strong>Auto-Redaction Active:</strong> Detected {piiCheck.types.join(', ')}. To protect your privacy, this will be safely masked as <code>[PROTECTED]</code> on the public headline.
                    </span>
                  </div>
                )}
              </div>

              {/* 4. LIVE TICKER PREVIEW */}
              {content.trim().length > 0 && (
                <div 
                  className="p-3 rounded-3 mb-3"
                  style={{
                    background: 'linear-gradient(90deg, #110926 0%, #1F113D 100%)',
                    border: '1.5px solid #6355E6',
                    color: '#FFFFFF'
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-danger text-light" style={{ fontSize: '0.65rem' }}>
                      🔴 Top Headline Preview
                    </span>
                    <span className="badge bg-light text-dark" style={{ fontSize: '0.65rem' }}>
                      {category}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#A5B4FC' }}>
                      by {effectiveAlias}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#F1F5F9', fontStyle: 'italic' }}>
                    "{piiCheck.cleanText}"
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.8rem' }}>
                  {errorMsg}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  🔒 0 Personal Data Exposed
                </span>
                
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-sm btn-light px-3"
                    style={{ borderRadius: 8, fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm px-4 py-2"
                    style={{
                      background: 'linear-gradient(135deg, #6355E6 0%, #8A7CFE 100%)',
                      color: '#FFFFFF',
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      boxShadow: '0 4px 15px rgba(99, 85, 230, 0.35)',
                      border: 'none'
                    }}
                  >
                    🚀 Broadcast to Website Top
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

export default ShareThoughtModal;
