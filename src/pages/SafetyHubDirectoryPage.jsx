import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch, FaCheck, FaPhoneAlt, 
  FaShieldAlt, FaVolumeUp,
  FaUserShield, FaMapMarkedAlt,
  FaGavel, FaCalendarAlt, FaTrain
} from 'react-icons/fa';

function SafetyHubDirectoryPage() {
  const [activeSidebarTab, setActiveSidebarTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // ═════════════════════════════════════════════════════════════════════════
  // MASTER PRIORITY LIST (SERIAL-WISE ORDER):
  // 1. SafeRoute AI
  // 2. Street Harassment Shield
  // 3. Smart Defense Suite
  // 4. SoloSafe Voyage (Trip Planner)
  // 5. Acoustic & Signal Stream
  // 6. Bystander Emergency Relay
  // 7. AI Guardian Call
  // 8. Deepfake Forensics Lab
  // 9. Incident Timeline & Forensics
  // 10. AI Cyber FIR & Legal Dossier
  // 11. Official Incident Reporting Desk
  // 12. Anonymous Awareness Wall
  // 13. Route Intelligence & Reviews
  // 14. HerHub Women Community Circle
    // ═════════════════════════════════════════════════════════════════════════
  const allTools = [
    // 1. SafeRoute AI
    {
      id: 'saferoute',
      category: 'NAVIGATION',
      badge: 'SAFE NAVIGATION',
      badgeClass: 'badge-simulated',
      icon: <FaMapMarkedAlt />,
      title: 'SafeRoute AI',
      desc: 'Plan a journey with calm path guidance and travel preferences.',
      link: '/saferoute-ai'
    },
    // 2. Street Harassment Shield
    {
      id: 'harassment_shield',
      category: 'POLICE DETERRENT',
      badge: 'URGENT ALERT',
      badgeClass: 'badge-urgent',
      icon: <FaShieldAlt />,
      title: 'Street Harassment Shield',
      desc: '1-Tap Hindi police wireless dispatch alarm to scare away street harassers under BNS 79.',
      link: '/anti-harassment'
    },
    // 3. Smart Defense Suite
    {
      id: 'route_dev',
      category: 'DEFENSE',
      badge: 'LIVE AI',
      badgeClass: 'badge-live',
      icon: <FaShieldAlt />,
      title: 'Smart Defense Suite',
      desc: 'Hands-free AI voice distress sentinel & HerScan 360° AI vehicle inspection camera.',
      link: '/route-deviation'
    },
    // 4. SoloSafe Voyage (Trip Planner)
    {
      id: 'solo_voyage',
      category: 'TRAVEL SAFE',
      badge: 'LIVE GUARDIAN',
      badgeClass: 'badge-demo',
      icon: <FaTrain />,
      title: 'SoloSafe Voyage (Trip Planner)',
      desc: 'Pre-plan unfamiliar trips with Meri Saheli RPF escort, live GPS corridor & parent monitoring.',
      link: '/solo-trip-planner'
    },
    // 5. Acoustic & Signal Stream
    {
      id: 'acoustic',
      category: 'OFFLINE SHIELD',
      badge: 'OFFLINE SHIELD',
      badgeClass: 'badge-simulated',
      icon: <FaVolumeUp />,
      title: 'Acoustic & Signal Stream',
      desc: 'Offline Emergency Survival Shield: loud rescue siren, police strobe, zero-data SMS, and passerby rescue QR bridge.',
      link: '/acoustic-signal'
    },
    // 6. Bystander Emergency Relay
    {
      id: 'relay',
      category: 'PEER RESCUE',
      badge: 'OFFLINE BRIDGE',
      badgeClass: 'badge-simulated',
      icon: <FaShieldAlt />,
      title: 'Bystander Emergency Relay',
      desc: 'Zero-internet offline peer rescue relay and passerby distress beacon.',
      link: '/bystander-relay'
    },
    // 7. AI Guardian Call
    {
      id: 'guardian_call',
      category: 'COMPANION',
      badge: 'DEMO',
      badgeClass: 'badge-demo',
      icon: <FaPhoneAlt />,
      title: 'AI Guardian Call',
      desc: 'Try a companion–call flow; simulates a supportive voice check-in.',
      link: '/guardian-call'
    },
    // 8. Deepfake Forensics Lab
    {
      id: 'deepfake',
      category: 'DIGITAL FORENSICS',
      badge: 'DEMO',
      badgeClass: 'badge-demo',
      icon: <FaUserShield />,
      title: 'Deepfake Forensics Lab',
      desc: 'Learn how manipulated media and fake profiles can be assessed safely.',
      link: '/deepfake-forensics'
    },
    // 9. Incident Timeline & Forensics
    {
      id: 'timeline',
      category: 'LEGAL EVIDENCE',
      badge: 'AI FORENSICS',
      badgeClass: 'badge-verified',
      icon: <FaCalendarAlt />,
      title: 'Incident Timeline & Forensics',
      desc: 'AI Chat Auto-Parser, Threat Escalation Radar & Section 63 BSA Evidence Certificate.',
      link: '/incident-timeline'
    },
    // 10. AI Cyber FIR & Legal Dossier
    {
      id: 'fir',
      category: 'LEGAL COUNSELOR',
      badge: 'AI COUNSELOR',
      badgeClass: 'badge-simulated',
      icon: <FaGavel />,
      title: 'AI Cyber FIR & Legal Dossier',
      desc: '24/7 AI Legal, Emotional & Cyber Counselor for women (BNS/IPC, Zero FIR & FIR Dossier).',
      link: '/cyber-fir-dossier'
    },
    // 11. Official Incident Reporting Desk
    {
      id: 'report_desk',
      category: 'REPORTING',
      badge: 'OFFICIAL DESK',
      badgeClass: 'badge-demo',
      icon: <FaShieldAlt />,
      title: 'Official Incident Reporting Desk',
      desc: 'Anonymous safety logs and confidential incident reporting directly to local authorities.',
      link: '/report'
    },
    // 12. Anonymous Awareness Wall
    {
      id: 'awareness_hub',
      category: 'COMMUNITY VOICE',
      badge: 'LIVE WALL',
      badgeClass: 'badge-demo',
      icon: <FaCheck />,
      title: 'Anonymous Awareness Wall',
      desc: 'Share thoughts, safety awareness & community tips without exposing personal identity.',
      link: '/awareness-hub'
    },
    // 13. Route Intelligence & Reviews
    {
      id: 'route_reviews',
      category: 'CROWD INTEL',
      badge: 'RATINGS',
      badgeClass: 'badge-demo',
      icon: <FaMapMarkedAlt />,
      title: 'Route Intelligence & Reviews',
      desc: 'Community comfort ratings, safety audits, and route condition intelligence.',
      link: '/route-intelligence'
    },
    // 14. HerHub Women Community Circle
    {
      id: 'community_feed',
      category: 'COMMUNITY',
      badge: 'PEER SUPPORT',
      badgeClass: 'badge-demo',
      icon: <FaShieldAlt />,
      title: 'HerHub Women Community Circle',
      desc: 'Join verified community conversations, route updates and peer support.',
      link: '/community'
    }
  ];

  const filteredTools = allTools.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#FDFDFE', minHeight: '100vh' }}>
      
      {/* ════════ DARK HERO BANNER ════════ */}
      <section style={{ backgroundColor: '#160D33', color: '#FFFFFF', padding: '56px 0 68px' }}>
        <div className="container">
          
          <div className="row align-items-center justify-content-between">
            
            <div className="col-12 col-lg-8">
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
                YOUR SAFETY HUB
              </div>

              <h1 
                style={{ 
                  fontSize: 'clamp(2.4rem, 4.4vw, 3.8rem)', 
                  fontWeight: 800, 
                  letterSpacing: '-0.5px',
                  marginBottom: 16 
                }}
              >
                A calmer place to <span style={{ color: '#8A7CFE' }}>find your next step.</span>
              </h1>

              <p 
                style={{ 
                  fontSize: '1.05rem', 
                  color: '#C7C3DF', 
                  lineHeight: 1.65, 
                  maxWidth: 620,
                  margin: 0 
                }}
              >
                Explore the toolkit at your own pace. Every demo explains what it can and cannot do.
              </p>
            </div>

            {/* Pill Badge Right */}
            <div className="col-12 col-lg-4 text-lg-end mt-4 mt-lg-0">
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 14,
                  padding: '10px 18px',
                  fontSize: '0.78rem',
                  color: '#D5CEFD',
                  fontWeight: 600
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                <span>Demo workspace · Nothing is shared</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ════════ MAIN WORKSPACE & DIRECTORY ════════ */}
      <section style={{ padding: '50px 0 100px' }}>
        <div className="container">
          <div className="row gy-5">

            {/* Left Sidebar (Workspace navigation) */}
            <div className="col-12 col-lg-3">
              <div style={{ position: 'sticky', top: 90 }}>
                
                <div style={{ color: '#8E8BA7', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 14 }}>
                  WORKSPACE
                </div>

                <div className="d-flex flex-column gap-1 mb-5">
                  <button
                    onClick={() => setActiveSidebarTab('overview')}
                    style={{
                      background: activeSidebarTab === 'overview' ? '#F0EDFE' : 'transparent',
                      color: activeSidebarTab === 'overview' ? '#6355E6' : '#555271',
                      border: 'none',
                      borderRadius: 10,
                      padding: '10px 14px',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.9rem' }}>⌂</span>
                    <span>Overview</span>
                  </button>

                  <Link
                    to="/check-in"
                    style={{
                      color: '#555271',
                      padding: '10px 14px',
                      fontWeight: 500,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      textDecoration: 'none'
                    }}
                  >
                    <span style={{ color: '#10B981' }}>✓</span>
                    <span>My check-ins</span>
                  </Link>

                  <Link
                    to="/community-pulse"
                    style={{
                      color: '#555271',
                      padding: '10px 14px',
                      fontWeight: 500,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      textDecoration: 'none'
                    }}
                  >
                    <span>≡</span>
                    <span>My records</span>
                  </Link>
                </div>

                {/* Need Help Now Box */}
                <div style={{ color: '#8E8BA7', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>
                  NEED HELP NOW
                </div>

                <div 
                  style={{
                    background: '#FFF8F8',
                    border: '1px solid #FCD5D5',
                    borderRadius: 16,
                    padding: '20px 18px',
                    marginBottom: 16
                  }}
                >
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#EF4444', lineHeight: 1 }}>
                    112
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#555271', margin: '4px 0 12px' }}>
                    Emergency support
                  </div>
                  <a 
                    href="tel:112"
                    style={{
                      color: '#EF4444',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>Tap to call</span>
                    <span>↗</span>
                  </a>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#8E8BA7', lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 600, color: '#555271' }}>Demo workspace</div>
                  Your private data is not connected to a live account yet.
                </div>

              </div>
            </div>

            {/* Right Column: Feature Directory Grid */}
            <div className="col-12 col-lg-9">
              
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 pb-2 border-bottom">
                <div>
                  <div style={{ color: '#6355E6', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>
                    FEATURE DIRECTORY
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#12102B', margin: 0 }}>
                    Choose a tool
                  </h2>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', minWidth: 260 }}>
                  <FaSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8E8BA7', fontSize: '0.82rem' }} />
                  <input
                    type="text"
                    placeholder="Search safety tools"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E9E7F2',
                      borderRadius: 12,
                      padding: '10px 16px 10px 38px',
                      fontSize: '0.85rem',
                      width: '100%',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* 2-Column Tools Grid */}
              <div className="row g-4">
                {filteredTools.map((tool) => (
                  <div key={tool.id} className="col-12 col-md-6">
                    <div 
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E9E7F2',
                        borderRadius: 20,
                        padding: '28px 24px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 14px rgba(18, 16, 43, 0.02)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#D5CEFD';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(99, 85, 230, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E9E7F2';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(18, 16, 43, 0.02)';
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div style={{ color: '#6355E6', fontSize: '1.2rem' }}>
                          {tool.icon}
                        </div>
                        <span 
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            letterSpacing: '1px',
                            padding: '3px 8px',
                            borderRadius: 6,
                            textTransform: 'uppercase',
                            background: tool.badge === 'DEMO' ? '#F0EDFE' : '#F1F5F9',
                            color: tool.badge === 'DEMO' ? '#6355E6' : '#64748B'
                          }}
                        >
                          {tool.badge}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8E8BA7', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
                        {tool.category}
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#12102B', marginBottom: 8 }}>
                        {tool.title}
                      </h3>

                      <p style={{ fontSize: '0.88rem', color: '#555271', lineHeight: 1.6, flexGrow: 1, marginBottom: 20 }}>
                        {tool.desc}
                      </p>

                      <Link 
                        to={tool.link}
                        style={{
                          color: '#6355E6',
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          textDecoration: 'none'
                        }}
                      >
                        <span>Open feature</span>
                        <span>↗</span>
                      </Link>

                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default SafetyHubDirectoryPage;