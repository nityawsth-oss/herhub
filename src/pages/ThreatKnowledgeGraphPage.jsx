import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShieldAlt, FaExternalLinkAlt, FaBookOpen, FaExclamationTriangle, FaLock, FaRedo } from 'react-icons/fa';

function ThreatKnowledgeGraphPage() {
  const [demoStarted, setDemoStarted] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState('impersonation'); // 'impersonation' | 'deepfake' | 'stalking' | 'sextortion'
  const [localNoteSaved, setLocalNoteSaved] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Clusters definition for the Knowledge Graph
  const clusters = {
    impersonation: {
      id: 'impersonation',
      title: 'Impersonation & Fake Profiles',
      color: '#6355E6',
      badge: 'IDENTITY THREAT',
      definition: 'Unauthorized replication of your name, photos, or bio across Instagram, WhatsApp, or dating applications to mislead your social circle.',
      redFlags: [
        'Friend requests from accounts using your secondary pictures',
        'Direct messages sent to your friends requesting urgent UPI transfers',
        'Unfamiliar usernames tagged with your location check-ins'
      ],
      preventionSteps: [
        'Perform Google Reverse Image search on suspicious profile pictures',
        'Keep primary Instagram / Facebook accounts on Private with restricted story viewers',
        'Report account under "Impersonating someone I know" with your government ID verification'
      ],
      legalRights: 'Section 66D of Information Technology Act (Cheating by personation using computer resource) · Imprisonment up to 3 years and fine up to ₹1 Lakh.',
      relatedNodes: ['Deepfake Media', 'Stalking Patterns', 'Financial Phishing']
    },
    deepfake: {
      id: 'deepfake',
      title: 'Synthetic Media & Voice Cloning',
      color: '#EC4899',
      badge: 'AI MANIPULATION',
      definition: 'AI-generated audio or video that superimposes your face or clones your voice to create synthetic compromising or coercive material.',
      redFlags: [
        'Urgent distress call from an unknown number mimicking a family member voice',
        'Unnatural blinking, blurry facial boundaries around the jawline or ears',
        'Demands for money with artificial panic audio'
      ],
      preventionSteps: [
        'Establish a secret "Family Safe Word" to verify authenticity during emergency calls',
        'Never transmit biometric face-scans or high-res voice samples to unverified apps',
        'File an emergency take-down notice with platform grievance officers under Rule 3(2)(b)'
      ],
      legalRights: 'Section 66E (Privacy violation) & Section 67A (Transmitting sexually explicit material) · Indian Penal Code Section 354C (Voyeurism).',
      relatedNodes: ['Identity Theft', 'Cyber Extortion', 'Forensic Verification']
    },
    stalking: {
      id: 'stalking',
      title: 'Digital & Physical Location Stalking',
      color: '#F59E0B',
      badge: 'SURVEILLANCE RISK',
      definition: 'Covert tracking of your movements using unwanted Bluetooth beacons (AirTags), smartphone stalkerware, or persistent cross-platform surveillance.',
      redFlags: [
        '"Unknown Tracker Detected" notifications on your iOS or Android device',
        'Unusually fast battery drain and excessive background location permissions',
        'A contact repeatedly appearing at your private, unannounced destinations'
      ],
      preventionSteps: [
        'Run native "AirGuard" / "Tracker Detect" scan for nearby unwanted Bluetooth tags',
        'Audit "Always Allow" location permissions in your smartphone settings',
        'Avoid public real-time check-ins; post stories only after leaving venues'
      ],
      legalRights: 'Section 354D IPC / Section 78 BNS (Stalking - both physical and electronic monitoring) · Cognizable non-bailable offense on repeat conviction.',
      relatedNodes: ['Impersonation', 'Harassment Dossier', 'SafeRoute Planning']
    },
    sextortion: {
      id: 'sextortion',
      title: 'Cyber Financial Fraud & Sextortion',
      color: '#EF4444',
      badge: 'URGENT ESCALATION',
      definition: 'Blackmail schemes that lure victims into brief video interactions, take compromising screenshots, and threaten social distribution unless ransom is paid.',
      redFlags: [
        'Unknown caller initiating video call on WhatsApp or Telegram and flashing inappropriate media',
        'Instant receipt of manipulated screenshot collage with your contacts list',
        'Escalating monetary demands with 15-minute countdown threats'
      ],
      preventionSteps: [
        'DO NOT PAY. Payments trigger infinite extortion demands without media deletion',
        'Preserve all message headers, UPI IDs, and chat screenshots before blocking',
        'Call 1930 Cyber Fraud Helpline or report on cybercrime.gov.in within the first golden hours'
      ],
      legalRights: 'Section 384 IPC (Extortion), Section 506 IPC (Criminal Intimidation), and Section 67 Information Technology Act.',
      relatedNodes: ['AI Forensics', 'Police Cyber FIR', 'Mental Health Helplines']
    }
  };

  const active = clusters[selectedCluster];

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
                UNDERSTAND · EDUCATIONAL
              </div>

              <h1 
                style={{ 
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', 
                  fontWeight: 800, 
                  letterSpacing: '-0.5px',
                  marginBottom: 16 
                }}
              >
                Threat Knowledge Graph
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
                Browse connected digital safety concepts and prevention steps. This is a guided, educational experience built to support informed choices—not to predict danger or replace professional support.
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
                EDUCATIONAL · NO EXTERNAL SERVICE CONNECTED
              </span>
            </div>

            {/* Right Large Stylized 4-Way Connected Node Graph Graphic */}
            <div className="col-12 col-md-3 col-lg-4 text-center text-md-end mt-4 mt-md-0">
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 140,
                  height: 140,
                  color: '#8A7CFE',
                  opacity: 0.95
                }}
              >
                {/* 4-way Network Graph Icon SVG */}
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                  {/* Arms */}
                  <line x1="50" y1="20" x2="50" y2="80" stroke="#8A7CFE" strokeWidth="8" strokeLinecap="round" />
                  <line x1="20" y1="50" x2="80" y2="50" stroke="#8A7CFE" strokeWidth="8" strokeLinecap="round" />
                  
                  {/* Center Node */}
                  <circle cx="50" cy="50" r="11" fill="#8A7CFE" />
                  
                  {/* 4 Outer Nodes */}
                  <circle cx="50" cy="18" r="9" fill="#8A7CFE" />
                  <circle cx="50" cy="82" r="9" fill="#8A7CFE" />
                  <circle cx="18" cy="50" r="9" fill="#8A7CFE" />
                  <circle cx="82" cy="50" r="9" fill="#8A7CFE" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════ MAIN CONTENT / GUIDED DEMO ════════ */}
      <section style={{ padding: '60px 0 90px' }}>
        <div className="container">
          <div className="row g-5">
            
            {/* Left 8 Cols: Guided Demo */}
            <div className="col-12 col-lg-8">
              
              <div 
                style={{ 
                  color: '#6355E6', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  letterSpacing: '1.6px', 
                  textTransform: 'uppercase',
                  marginBottom: 8 
                }}
              >
                TRY IT SAFELY
              </div>

              <h2 
                style={{ 
                  fontSize: '2.1rem', 
                  fontWeight: 800, 
                  color: '#160D33',
                  marginBottom: 28 
                }}
              >
                Explore this guided demo
              </h2>

              {!demoStarted ? (
                /* ── INITIAL DEMO CARD (Matching user screenshot) ── */
                <div 
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    border: '1px solid #ECECF2',
                    padding: '36px',
                    boxShadow: '0 8px 30px rgba(18, 16, 43, 0.04)'
                  }}
                >
                  <div className="row align-items-center g-4">
                    
                    {/* Left preview square */}
                    <div className="col-12 col-md-5 col-lg-5">
                      <div 
                        style={{
                          backgroundColor: '#F5F3FF',
                          borderRadius: 20,
                          height: 240,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          padding: 20
                        }}
                      >
                        <div 
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            border: '1.5px solid #D5CEFD',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#7967FD',
                            marginBottom: 16,
                            boxShadow: '0 4px 14px rgba(121, 103, 253, 0.1)'
                          }}
                        >
                          <svg width="52" height="52" viewBox="0 0 100 100" fill="none">
                            <line x1="50" y1="22" x2="50" y2="78" stroke="#7967FD" strokeWidth="7" strokeLinecap="round" />
                            <line x1="22" y1="50" x2="78" y2="50" stroke="#7967FD" strokeWidth="7" strokeLinecap="round" />
                            <circle cx="50" cy="50" r="10" fill="#7967FD" />
                            <circle cx="50" cy="20" r="7.5" fill="#7967FD" />
                            <circle cx="50" cy="80" r="7.5" fill="#7967FD" />
                            <circle cx="20" cy="50" r="7.5" fill="#7967FD" />
                            <circle cx="80" cy="50" r="7.5" fill="#7967FD" />
                          </svg>
                        </div>

                        <span 
                          style={{ 
                            color: '#9892B0', 
                            fontSize: '0.86rem', 
                            fontWeight: 500 
                          }}
                        >
                          Ready when you are
                        </span>
                      </div>
                    </div>

                    {/* Right details */}
                    <div className="col-12 col-md-7 col-lg-7">
                      <span 
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#EDE8FE',
                          color: '#6355E6',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.8px',
                          padding: '4px 12px',
                          borderRadius: 20,
                          textTransform: 'uppercase',
                          marginBottom: 14
                        }}
                      >
                        EDUCATIONAL
                      </span>

                      <h3 
                        style={{ 
                          fontSize: '1.45rem', 
                          fontWeight: 800, 
                          color: '#160D33',
                          marginBottom: 12 
                        }}
                      >
                        A thoughtful, private starting point
                      </h3>

                      <p 
                        style={{ 
                          fontSize: '0.94rem', 
                          color: '#65607E', 
                          lineHeight: 1.6,
                          marginBottom: 24 
                        }}
                      >
                        Walk through sample inputs and explanations. This demo uses fictional data and does not access your microphone, camera, location, contacts, or files.
                      </p>

                      <button
                        onClick={() => setDemoStarted(true)}
                        style={{
                          backgroundColor: '#6355E6',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 12,
                          padding: '12px 24px',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(99, 85, 230, 0.3)',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#5041DE'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6355E6'}
                      >
                        <span>Start demo</span>
                        <FaArrowRight style={{ fontSize: '0.82rem' }} />
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                /* ── ACTIVE INTERACTIVE KNOWLEDGE GRAPH WORKSPACE ── */
                <div 
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    border: '1px solid #ECECF2',
                    padding: '32px',
                    boxShadow: '0 8px 30px rgba(18, 16, 43, 0.05)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6355E6', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        Interactive Exploration
                      </span>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#160D33', margin: '4px 0 0' }}>
                        Connected Digital Safety Ontology
                      </h4>
                    </div>

                    <button
                      onClick={() => setDemoStarted(false)}
                      className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2"
                      style={{ borderRadius: 10, fontSize: '0.82rem', padding: '6px 14px' }}
                    >
                      <FaRedo style={{ fontSize: '0.75rem' }} />
                      <span>Reset view</span>
                    </button>
                  </div>

                  {/* 4 Interactive Threat Clusters Bar */}
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => setSelectedCluster('impersonation')}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 12,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: selectedCluster === 'impersonation' ? '#6355E6' : '#E5E3EE',
                        backgroundColor: selectedCluster === 'impersonation' ? '#EDE8FE' : '#F9F8FD',
                        color: selectedCluster === 'impersonation' ? '#6355E6' : '#555'
                      }}
                    >
                      🎭 Impersonation & Clones
                    </button>

                    <button
                      onClick={() => setSelectedCluster('deepfake')}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 12,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: selectedCluster === 'deepfake' ? '#EC4899' : '#E5E3EE',
                        backgroundColor: selectedCluster === 'deepfake' ? '#FDF2F8' : '#F9F8FD',
                        color: selectedCluster === 'deepfake' ? '#BE185D' : '#555'
                      }}
                    >
                      ✦ Synthetic Media & AI
                    </button>

                    <button
                      onClick={() => setSelectedCluster('stalking')}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 12,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: selectedCluster === 'stalking' ? '#F59E0B' : '#E5E3EE',
                        backgroundColor: selectedCluster === 'stalking' ? '#FEF3C7' : '#F9F8FD',
                        color: selectedCluster === 'stalking' ? '#B45309' : '#555'
                      }}
                    >
                      📍 Location & Tracker Stalking
                    </button>

                    <button
                      onClick={() => setSelectedCluster('sextortion')}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 12,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: selectedCluster === 'sextortion' ? '#EF4444' : '#E5E3EE',
                        backgroundColor: selectedCluster === 'sextortion' ? '#FEE2E2' : '#F9F8FD',
                        color: selectedCluster === 'sextortion' ? '#B91C1C' : '#555'
                      }}
                    >
                      🚨 Sextortion & Blackmail
                    </button>
                  </div>

                  {/* Visual Node Diagram Representation */}
                  <div 
                    className="p-4 mb-4 text-center rounded-3"
                    style={{
                      background: 'linear-gradient(180deg, #160D33 0%, #201344 100%)',
                      color: '#FFFFFF'
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                      <span style={{ fontSize: '0.78rem', color: '#9887FE', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                        Active Node Inspection:
                      </span>
                      <span className="badge" style={{ backgroundColor: active.color, fontSize: '0.75rem' }}>
                        {active.badge}
                      </span>
                    </div>

                    <h4 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#FFFFFF', marginBottom: 12 }}>
                      {active.title}
                    </h4>

                    <p style={{ color: '#D5CEFD', fontSize: '0.94rem', maxWidth: 640, margin: '0 auto 20px', lineHeight: 1.6 }}>
                      {active.definition}
                    </p>

                    {/* Connected Nodes Badges */}
                    <div className="d-flex flex-wrap align-items-center justify-content-center gap-2">
                      <span style={{ fontSize: '0.78rem', color: '#B2AECB' }}>Connected safety concepts:</span>
                      {active.relatedNodes.map((n, i) => (
                        <span 
                          key={i} 
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 20,
                            padding: '3px 12px',
                            color: '#FFFFFF'
                          }}
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Red Flags & Prevention 2-col Breakdown */}
                  <div className="row g-4 mb-4">
                    
                    {/* Left: Red Flags */}
                    <div className="col-12 col-md-6">
                      <div className="p-3 rounded-3 h-100" style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7' }}>
                        <div className="d-flex align-items-center gap-2 mb-3 text-danger">
                          <FaExclamationTriangle />
                          <strong style={{ fontSize: '0.9rem' }}>Recognizable Red Flags</strong>
                        </div>
                        <ul className="list-unstyled mb-0" style={{ fontSize: '0.86rem', lineHeight: 1.6 }}>
                          {active.redFlags.map((flag, idx) => (
                            <li key={idx} className="mb-2 d-flex align-items-start gap-2">
                              <span className="text-danger">⚠</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right: Concrete Prevention */}
                    <div className="col-12 col-md-6">
                      <div className="p-3 rounded-3 h-100" style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7' }}>
                        <div className="d-flex align-items-center gap-2 mb-3 text-success">
                          <FaShieldAlt />
                          <strong style={{ fontSize: '0.9rem' }}>Recommended Prevention & Responses</strong>
                        </div>
                        <ul className="list-unstyled mb-0" style={{ fontSize: '0.86rem', lineHeight: 1.6 }}>
                          {active.preventionSteps.map((step, idx) => (
                            <li key={idx} className="mb-2 d-flex align-items-start gap-2">
                              <span className="text-success">✓</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>

                  {/* Legal Rights Reference Box */}
                  <div className="p-3 rounded-3" style={{ backgroundColor: '#F7F5FE', border: '1px solid #E2DCFA' }}>
                    <div className="d-flex align-items-center gap-2 mb-1" style={{ color: '#6355E6' }}>
                      <FaBookOpen />
                      <strong style={{ fontSize: '0.88rem' }}>Applicable Legal Rights & Legal Framework</strong>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: '#4F4A6E', margin: 0, lineHeight: 1.55 }}>
                      {active.legalRights}
                    </p>
                  </div>

                </div>
              )}

            </div>

            {/* Right 4 Cols: 01, 02, 03 Guidelines (Exact from user screenshot) */}
            <div className="col-12 col-lg-4">
              <div style={{ position: 'sticky', top: 90 }}>
                
                {/* 01 What this can do */}
                <div style={{ marginBottom: 36 }}>
                  <div 
                    style={{ 
                      color: '#9887FE', 
                      fontSize: '0.82rem', 
                      fontWeight: 700, 
                      marginBottom: 8 
                    }}
                  >
                    01
                  </div>
                  <h4 
                    style={{ 
                      fontSize: '1.18rem', 
                      fontWeight: 800, 
                      color: '#160D33',
                      marginBottom: 10 
                    }}
                  >
                    What this can do
                  </h4>
                  <p 
                    style={{ 
                      fontSize: '0.92rem', 
                      color: '#65607E', 
                      lineHeight: 1.6,
                      margin: 0 
                    }}
                  >
                    Offer clear prompts, educational context, and a place to reflect on your own next step.
                  </p>
                </div>

                {/* 02 What this cannot do */}
                <div style={{ marginBottom: 36 }}>
                  <div 
                    style={{ 
                      color: '#9887FE', 
                      fontSize: '0.82rem', 
                      fontWeight: 700, 
                      marginBottom: 8 
                    }}
                  >
                    02
                  </div>
                  <h4 
                    style={{ 
                      fontSize: '1.18rem', 
                      fontWeight: 800, 
                      color: '#160D33',
                      marginBottom: 10 
                    }}
                  >
                    What this cannot do
                  </h4>
                  <p 
                    style={{ 
                      fontSize: '0.92rem', 
                      color: '#65607E', 
                      lineHeight: 1.6,
                      margin: 0 
                    }}
                  >
                    It cannot predict crime, contact emergency services, verify evidence, or guarantee your safety.
                  </p>
                </div>

                {/* 03 Keep control */}
                <div>
                  <div 
                    style={{ 
                      color: '#9887FE', 
                      fontSize: '0.82rem', 
                      fontWeight: 700, 
                      marginBottom: 8 
                    }}
                  >
                    03
                  </div>
                  <h4 
                    style={{ 
                      fontSize: '1.18rem', 
                      fontWeight: 800, 
                      color: '#160D33',
                      marginBottom: 10 
                    }}
                  >
                    Keep control
                  </h4>
                  
                  <button
                    onClick={() => setShowNoteModal(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#6355E6',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer'
                    }}
                  >
                    <span>Save a local note</span>
                    <span>→</span>
                  </button>

                  {localNoteSaved && (
                    <div 
                      className="mt-2 text-success" 
                      style={{ fontSize: '0.82rem', fontWeight: 600 }}
                    >
                      ✓ Local note stored privately in this browser session.
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MODAL: SAVE A LOCAL NOTE ── */}
      {showNoteModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 14, 45, 0.65)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
          onClick={() => setShowNoteModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              maxWidth: 500,
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h5 style={{ fontWeight: 800, color: '#160D33', marginBottom: 12 }}>
              Save a Private Local Note
            </h5>
            <p style={{ fontSize: '0.86rem', color: '#65607E', marginBottom: 16 }}>
              Notes are stored only in memory for this session and are never sent to external servers.
            </p>
            <textarea
              rows={4}
              className="form-control mb-3"
              placeholder="e.g. For suspicious Instagram DM requests, check reverse image search first before replying..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              style={{ fontSize: '0.9rem', borderRadius: 12 }}
            />
            <div className="d-flex justify-content-end gap-2">
              <button 
                className="btn btn-light" 
                style={{ borderRadius: 10 }}
                onClick={() => setShowNoteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: '#6355E6', borderColor: '#6355E6', borderRadius: 10 }}
                onClick={() => {
                  setLocalNoteSaved(true);
                  setShowNoteModal(false);
                }}
              >
                Save locally
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ThreatKnowledgeGraphPage;
