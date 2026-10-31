import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShieldAlt, FaLock, FaUsers } from 'react-icons/fa';

function AboutPage() {
  return (
    <div style={{ backgroundColor: '#FDFDFE', minHeight: '100vh' }}>
      
      {/* ════════ DARK HERO BANNER ════════ */}
      <section style={{ backgroundColor: '#160D33', color: '#FFFFFF', padding: '56px 0 70px' }}>
        <div className="container">
          
          {/* Back link */}
          <Link 
            to="/" 
            className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none"
            style={{ color: '#B2AECB', fontSize: '0.88rem', fontWeight: 500 }}
          >
            <span>← Back to home</span>
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
                ABOUT · OUR MISSION
              </div>

              <h1 
                style={{ 
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', 
                  fontWeight: 800, 
                  letterSpacing: '-0.5px',
                  marginBottom: 16 
                }}
              >
                About SafeHer Hub
              </h1>

              <p 
                style={{ 
                  fontSize: '1.1rem', 
                  color: '#C7C3DF', 
                  lineHeight: 1.65, 
                  maxWidth: 640,
                  marginBottom: 26 
                }}
              >
                Safety feels stronger when we stand together. HERHUB was built to provide women with private, calm, and intelligent safety tools—free from fear-mongering, surveillance, or intrusive tracking.
              </p>

              <div className="d-flex flex-wrap gap-2">
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
                  PRIVACY BY DESIGN
                </span>
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
                  COMMUNITY SOLIDARITY
                </span>
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
                  EXPLAINABLE AI
                </span>
              </div>
            </div>

            {/* Right Large Heart Badge Icon */}
            <div className="col-12 col-md-3 col-lg-4 text-center text-md-end mt-4 mt-md-0">
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 140,
                  height: 140,
                  borderRadius: 36,
                  backgroundColor: 'rgba(152, 135, 254, 0.14)',
                  color: '#8A7CFE',
                  fontSize: '4.8rem',
                  border: '2px solid rgba(152, 135, 254, 0.25)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                }}
              >
                <FaHeart />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════ CORE PILLARS SECTION ════════ */}
      <section style={{ padding: '70px 0 60px' }}>
        <div className="container">
          
          <div className="text-center max-w-700 mx-auto mb-5">
            <span style={{ color: '#6355E6', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase' }}>
              WHAT WE BELIEVE
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#160D33', margin: '8px 0 14px' }}>
              A New Standard in Personal Safety
            </h2>
            <p style={{ color: '#65607E', fontSize: '1rem', lineHeight: 1.6, maxWidth: 620, margin: '0 auto' }}>
              Most safety solutions rely on panic buttons that increase stress. HERHUB changes the paradigm: we combine proactive preparation, clear transparency, and supportive sisterhood.
            </p>
          </div>

          <div className="row g-4">
            
            {/* Pillar 1 */}
            <div className="col-12 col-md-4">
              <div 
                className="h-100 p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 24,
                  border: '1px solid #ECECF2',
                  boxShadow: '0 8px 30px rgba(18, 16, 43, 0.04)'
                }}
              >
                <div 
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: '#EDE8FE',
                    color: '#6355E6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    marginBottom: 20
                  }}
                >
                  <FaLock />
                </div>
                <div style={{ color: '#9887FE', fontSize: '0.78rem', fontWeight: 700, marginBottom: 6 }}>01 · AUTONOMY</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#160D33', marginBottom: 12 }}>
                  Private by Design
                </h4>
                <p style={{ color: '#65607E', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                  We believe safety should never cost your privacy. HERHUB does not continuously track you, does not sell telemetry to advertisers, and stores personal notes locally on your device.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="col-12 col-md-4">
              <div 
                className="h-100 p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 24,
                  border: '1px solid #ECECF2',
                  boxShadow: '0 8px 30px rgba(18, 16, 43, 0.04)'
                }}
              >
                <div 
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: '#EDE8FE',
                    color: '#6355E6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    marginBottom: 20
                  }}
                >
                  <FaShieldAlt />
                </div>
                <div style={{ color: '#9887FE', fontSize: '0.78rem', fontWeight: 700, marginBottom: 6 }}>02 · TRANSPARENCY</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#160D33', marginBottom: 12 }}>
                  Explainable Intelligence
                </h4>
                <p style={{ color: '#65607E', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                  Every AI tool in HERHUB explains why it makes a suggestion. Whether calculating route streetlamp visibility or examining deepfake indicators, you always stay in informed control.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="col-12 col-md-4">
              <div 
                className="h-100 p-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 24,
                  border: '1px solid #ECECF2',
                  boxShadow: '0 8px 30px rgba(18, 16, 43, 0.04)'
                }}
              >
                <div 
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: '#EDE8FE',
                    color: '#6355E6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    marginBottom: 20
                  }}
                >
                  <FaUsers />
                </div>
                <div style={{ color: '#9887FE', fontSize: '0.78rem', fontWeight: 700, marginBottom: 6 }}>03 · SOLIDARITY</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#160D33', marginBottom: 12 }}>
                  Community Guardianship
                </h4>
                <p style={{ color: '#65607E', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                  From trusted guardian call simulations to community-verified safety pulses, you are supported by real networks. We stand together so no woman ever walks in isolation.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ════════ VERIFIED EMERGENCY HELPLINES ════════ */}
      <section style={{ backgroundColor: '#F8F7FD', padding: '60px 0 70px', borderTop: '1px solid #ECEAF5', borderBottom: '1px solid #ECEAF5' }}>
        <div className="container">
          
          <div className="row align-items-center mb-4">
            <div className="col-12 col-md-8">
              <span style={{ color: '#6355E6', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase' }}>
                DIRECT ACTION
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#160D33', margin: '4px 0 0' }}>
                Verified 24/7 Emergency Helplines (India)
              </h3>
            </div>
            <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0">
              <span className="badge" style={{ backgroundColor: '#E2FBE8', color: '#059669', fontSize: '0.78rem', padding: '6px 14px', borderRadius: 20 }}>
                ● Toll-Free & Active
              </span>
            </div>
          </div>

          <div className="row g-3">
            
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3 bg-white rounded-3 border h-100">
                <strong className="d-block text-danger" style={{ fontSize: '1.3rem', fontWeight: 800 }}>112</strong>
                <span className="fw-bold d-block" style={{ fontSize: '0.9rem', color: '#160D33' }}>National Emergency Helpline</span>
                <small className="text-muted d-block mt-1">Police, Fire & Medical distress response across all states.</small>
                <a href="tel:112" className="btn btn-sm btn-outline-danger mt-3 w-100" style={{ borderRadius: 8 }}>Call 112</a>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3 bg-white rounded-3 border h-100">
                <strong className="d-block" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#6355E6' }}>1090 / 181</strong>
                <span className="fw-bold d-block" style={{ fontSize: '0.9rem', color: '#160D33' }}>Women In Distress Line</span>
                <small className="text-muted d-block mt-1">24x7 confidential counseling, rescue, and harassment support.</small>
                <a href="tel:1090" className="btn btn-sm btn-outline-primary mt-3 w-100" style={{ borderRadius: 8, borderColor: '#6355E6', color: '#6355E6' }}>Call 1090</a>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3 bg-white rounded-3 border h-100">
                <strong className="d-block text-warning" style={{ fontSize: '1.3rem', fontWeight: 800 }}>1930</strong>
                <span className="fw-bold d-block" style={{ fontSize: '0.9rem', color: '#160D33' }}>Cyber Crime & Financial Fraud</span>
                <small className="text-muted d-block mt-1">Golden-hour reporting for online blackmail, sextortion, and fraud.</small>
                <a href="tel:1930" className="btn btn-sm btn-outline-warning mt-3 w-100" style={{ borderRadius: 8 }}>Call 1930</a>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3 bg-white rounded-3 border h-100">
                <strong className="d-block text-success" style={{ fontSize: '1.1rem', fontWeight: 800 }}>7217735372</strong>
                <span className="fw-bold d-block" style={{ fontSize: '0.9rem', color: '#160D33' }}>NCW WhatsApp Helpline</span>
                <small className="text-muted d-block mt-1">National Commission for Women text-based emergency alert line.</small>
                <a href="https://wa.me/917217735372" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success mt-3 w-100" style={{ borderRadius: 8 }}>WhatsApp Alert</a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ════════ CALL TO ACTION ════════ */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div 
            className="p-5 text-center text-white rounded-4"
            style={{
              background: 'linear-gradient(135deg, #160D33 0%, #291854 100%)',
              boxShadow: '0 20px 50px rgba(22, 13, 51, 0.25)'
            }}
          >
            <h3 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: 12 }}>
              Ready to explore your personal safety toolkit?
            </h3>
            <p style={{ color: '#D5CEFD', fontSize: '1.05rem', maxWidth: 580, margin: '0 auto 28px', lineHeight: 1.6 }}>
              Experience all 10+ Detect, Protect, Understand, and Follow-Up tools in our interactive sandbox without registration.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link 
                to="/safety-hub"
                className="btn btn-primary"
                style={{
                  backgroundColor: '#6355E6',
                  borderColor: '#6355E6',
                  borderRadius: 14,
                  padding: '14px 32px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 6px 20px rgba(99, 85, 230, 0.4)'
                }}
              >
                <span>Open Safety Hub</span>
                <span style={{ marginLeft: 8 }}>↗</span>
              </Link>

              <Link 
                to="/check-in"
                className="btn btn-outline-light"
                style={{
                  borderRadius: 14,
                  padding: '14px 28px',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                <span>Try Sentinel Check-In</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default AboutPage;
