import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';

function ExplainableRiskPage() {
  const [demoStarted, setDemoStarted] = useState(false);
  const [factors, setFactors] = useState({
    lighting: false,
    deserted: false,
    vehicleDetour: false,
    following: false,
    uncomfortable: false
  });
  const [evaluated, setEvaluated] = useState(false);

  const toggleFactor = (key) => {
    setFactors(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedCount = Object.values(factors).filter(Boolean).length;

  return (
    <div style={{ backgroundColor: '#FDFDFE', minHeight: '100vh' }}>
      
      {/* ════════ DARK HERO BANNER ════════ */}
      <section style={{ backgroundColor: '#160D33', color: '#FFFFFF', padding: '50px 0 65px' }}>
        <div className="container">
          
          {/* Back link */}
          <Link 
            to="/" 
            className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none"
            style={{ color: '#B2AECB', fontSize: '0.88rem', fontWeight: 500 }}
          >
            <span>← Back to safety hub</span>
          </Link>

          <div className="row align-items-center">
            
            {/* Left Content */}
            <div className="col-12 col-md-9 col-lg-8">
              <div 
                style={{ 
                  color: '#9887FE', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  letterSpacing: '1.6px', 
                  textTransform: 'uppercase',
                  marginBottom: 14 
                }}
              >
                DETECT · DEMO
              </div>

              <h1 
                style={{ 
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', 
                  fontWeight: 800, 
                  letterSpacing: '-0.5px',
                  marginBottom: 16 
                }}
              >
                Explainable Risk Indicator
              </h1>

              <p 
                style={{ 
                  fontSize: '1.05rem', 
                  color: '#C7C3DF', 
                  lineHeight: 1.65, 
                  maxWidth: 620,
                  marginBottom: 26 
                }}
              >
                Reflect on a situation with a transparent, educational checklist. This is a guided, educational experience built to support informed choices—not to predict danger or replace professional support.
              </p>

              <span 
                style={{ 
                  display: 'inline-block',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 50,
                  padding: '6px 16px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  color: '#D5CEFD',
                  textTransform: 'uppercase'
                }}
              >
                DEMO · NO EXTERNAL SERVICE CONNECTED
              </span>
            </div>

            {/* Right Large Dotted Spinner / Circle Graphic */}
            <div className="col-12 col-md-3 col-lg-4 text-center text-md-end mt-4 mt-md-0">
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 140,
                  height: 140,
                  position: 'relative'
                }}
              >
                {/* Dotted Circle Outline */}
                <div 
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    border: '5px dotted #8A7CFE',
                    opacity: 0.9,
                    animation: 'spin 18s linear infinite'
                  }}
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ════════ GUIDED DEMO & GUIDELINES ════════ */}
      <section style={{ padding: '60px 0 100px' }}>
        <div className="container">
          <div className="row gy-5">

            {/* Left Column: Demo Card / Interactive Checklist */}
            <div className="col-12 col-lg-8">
              
              <span 
                style={{ 
                  color: '#6355E6', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  letterSpacing: '1.6px', 
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  display: 'block'
                }}
              >
                TRY IT SAFELY
              </span>

              <h2 
                style={{ 
                  fontSize: '2rem', 
                  fontWeight: 800, 
                  color: '#12102B', 
                  letterSpacing: '-0.5px',
                  marginBottom: 28 
                }}
              >
                Explore this guided demo
              </h2>

              {!demoStarted ? (
                /* The Initial Big Guided Demo Card */
                <div 
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E9E7F2',
                    borderRadius: 20,
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24,
                    boxShadow: '0 8px 24px rgba(18, 16, 43, 0.04)'
                  }}
                  className="flex-md-row align-items-center"
                >
                  
                  {/* Left Purple Box with Dotted Spinner */}
                  <div 
                    style={{
                      background: '#F0EDFE',
                      borderRadius: 18,
                      width: '100%',
                      maxWidth: 200,
                      height: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <div 
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: '50%',
                        border: '1.5px solid #D5CEFD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 14
                      }}
                    >
                      <div 
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          border: '3px dotted #6355E6'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#716E8C', fontWeight: 500 }}>
                      Ready when you are
                    </span>
                  </div>

                  {/* Right Description & Button */}
                  <div style={{ flex: 1, paddingLeft: 'clamp(0px, 2vw, 16px)' }}>
                    
                    <span 
                      style={{
                        display: 'inline-block',
                        background: '#F0EDFE',
                        color: '#6355E6',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        padding: '4px 10px',
                        borderRadius: 6,
                        textTransform: 'uppercase',
                        marginBottom: 12
                      }}
                    >
                      DEMO
                    </span>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#12102B', marginBottom: 12 }}>
                      A thoughtful, private starting point
                    </h3>

                    <p style={{ fontSize: '0.9rem', color: '#555271', lineHeight: 1.65, marginBottom: 24 }}>
                      Walk through sample inputs and explanations. This demo uses fictional data and does not access your microphone, camera, location, contacts, or files.
                    </p>

                    <button 
                      onClick={() => setDemoStarted(true)}
                      style={{
                        background: '#6355E6',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 12,
                        padding: '12px 24px',
                        fontWeight: 600,
                        fontSize: '0.92rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(99, 85, 230, 0.28)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5244D4'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6355E6'}
                    >
                      <span>Start demo</span>
                      <span>→</span>
                    </button>

                  </div>

                </div>
              ) : (
                /* Interactive Explainable Checklist */
                <div 
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #D5CEFD',
                    borderRadius: 20,
                    padding: '32px',
                    boxShadow: '0 12px 30px rgba(99, 85, 230, 0.08)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                    <div>
                      <h4 style={{ fontWeight: 800, color: '#12102B', margin: 0 }}>
                        Transparent Situational Checklist
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: '#716E8C' }}>Select factors present in your environment for a calm breakdown</span>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => { setDemoStarted(false); setEvaluated(false); }}
                      style={{ borderRadius: 8, fontSize: '0.78rem' }}
                    >
                      Reset Demo
                    </button>
                  </div>

                  <div className="d-flex flex-column gap-3 mb-4">
                    {[
                      { key: 'lighting', title: 'Dim or Broken Streetlighting', sub: 'The current road or platform lacks active visibility lamps.' },
                      { key: 'deserted', title: 'Low Footfall / Isolated Stretch', sub: 'Very few open shops, pedestrians, or vendors in direct sight.' },
                      { key: 'vehicleDetour', title: 'Unexplained Cab or Transit Detour', sub: 'Driver diverged from navigation map or main arterial corridor.' },
                      { key: 'following', title: 'Sensing Someone Following', sub: 'A person matching your walking pace behind you for two turns.' },
                      { key: 'uncomfortable', title: 'General Intuitive Discomfort', sub: 'Your instincts or surroundings feel uneasy or out of place.' }
                    ].map(f => (
                      <label 
                        key={f.key}
                        className="p-3 border rounded-3 d-flex align-items-start gap-3 cursor-pointer"
                        style={{
                          borderColor: factors[f.key] ? '#D5CEFD' : '#E9E7F2',
                          background: factors[f.key] ? '#FDFDFF' : '#FFFFFF',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input 
                          type="checkbox"
                          checked={factors[f.key]}
                          onChange={() => toggleFactor(f.key)}
                          style={{ accentColor: '#6355E6', width: 18, height: 18, marginTop: 3 }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#12102B' }}>{f.title}</div>
                          <div style={{ fontSize: '0.78rem', color: '#716E8C', marginTop: 2 }}>{f.sub}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button 
                    onClick={() => setEvaluated(true)}
                    style={{
                      background: '#6355E6',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 12,
                      padding: '12px 28px',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      marginBottom: 20
                    }}
                  >
                    View Explainable Recommendation →
                  </button>

                  {evaluated && (
                    <div 
                      style={{ 
                        background: selectedCount === 0 ? '#ECFDF5' : selectedCount <= 2 ? '#FFFBEB' : '#FEF2F2',
                        border: `1px solid ${selectedCount === 0 ? '#A7F3D0' : selectedCount <= 2 ? '#FDE68A' : '#FECACA'}`,
                        borderRadius: 16,
                        padding: 24
                      }}
                    >
                      <div className="d-flex align-items-center gap-2 mb-2" style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                        {selectedCount === 0 ? (
                          <span style={{ color: '#065F46' }}>✓ Calm Environment (0 Indicators Active)</span>
                        ) : selectedCount <= 2 ? (
                          <span style={{ color: '#92400E' }}>⚠ Moderate Awareness Recommended ({selectedCount} Indicators Active)</span>
                        ) : (
                          <span style={{ color: '#991B1B' }}>🚨 Heightened Readiness Advised ({selectedCount} Indicators Active)</span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.65 }}>
                        {selectedCount === 0 && "Your surroundings appear clear. Continue your commute normally while keeping standard situational vigilance."}
                        {selectedCount >= 1 && selectedCount <= 2 && (
                          <>
                            • <strong>Immediate action:</strong> Keep one ear free from headphones.<br />
                            • <strong>Check-in Sentinel:</strong> Start a 15-minute personal timer so trusted guardians know when to expect your safe arrival.<br />
                            • <strong>Presence:</strong> Transition towards the side of the road with more vehicle headlights or lit storefronts.
                          </>
                        )}
                        {selectedCount > 2 && (
                          <>
                            • <strong>Proactive step:</strong> Move immediately into an active pharmacy, cafe, or metro station lobby.<br />
                            • <strong>Simulated Guardian Call:</strong> Trigger an AI companion exit call to project active phone communication.<br />
                            • <strong>Emergency:</strong> Prepare single-tap dial for 112 (National Emergency) or 1090 (Women Power Line).
                          </>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Right Column: Information Pillars */}
            <div className="col-12 col-lg-4">
              <div style={{ paddingLeft: 'clamp(0px, 3vw, 30px)', borderLeft: '1px solid #ECEAF5' }}>
                
                {/* 01 What this can do */}
                <div style={{ marginBottom: 36 }}>
                  <div style={{ color: '#8E8BA7', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                    01
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#12102B', marginBottom: 8 }}>
                    What this can do
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#5E5B7A', lineHeight: 1.65, margin: 0 }}>
                    Offer clear prompts, educational context, and a place to reflect on your own next step.
                  </p>
                </div>

                {/* 02 What this cannot do */}
                <div style={{ marginBottom: 36 }}>
                  <div style={{ color: '#8E8BA7', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                    02
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#12102B', marginBottom: 8 }}>
                    What this cannot do
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#5E5B7A', lineHeight: 1.65, margin: 0 }}>
                    It cannot predict crime, contact emergency services, verify evidence, or guarantee your safety.
                  </p>
                </div>

                {/* 03 Keep control */}
                <div>
                  <div style={{ color: '#8E8BA7', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                    03
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#12102B', marginBottom: 8 }}>
                    Keep control
                  </h3>
                  <a 
                    href="#note" 
                    onClick={(e) => { e.preventDefault(); alert('Notes are kept on device storage only.'); }}
                    style={{ color: '#6355E6', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Save a local note →
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default ExplainableRiskPage;
