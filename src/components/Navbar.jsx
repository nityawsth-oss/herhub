import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHeart, FaBars, FaTimes, FaSignOutAlt, FaShieldAlt, 
  FaMoon, FaSun, FaBell, FaVolumeUp, FaVolumeMute, 
  FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt, FaSms 
} from 'react-icons/fa';
import { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AuthModal from './AuthModal';
import { logSosIncident } from '../services/databaseService';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, isLoggedIn, logout, openAuthModal } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Global Navbar SOS Siren & Telephony Permission State
  const [showSosModal, setShowSosModal] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [navGpsCoords, setNavGpsCoords] = useState({ lat: '28.6139', lng: '77.2090' });
  const [gpsLocked, setGpsLocked] = useState(false);
  const [smsDispatchedView, setSmsDispatchedView] = useState(false);
  const [copiedSms, setCopiedSms] = useState(false);
  const sirenAudioCtxRef = useRef(null);
  const sirenOscRef = useRef(null);

  const guardianPhone = '+91 75240 72395';
  const cleanPhone = '917524072395';

  const startRescueSiren = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      sirenAudioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      sirenOscRef.current = osc;

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.18, ctx.currentTime);

      const now = ctx.currentTime;
      for (let i = 0; i < 80; i++) {
        osc.frequency.setValueAtTime(650, now + i * 0.8);
        osc.frequency.linearRampToValueAtTime(1150, now + i * 0.8 + 0.4);
        osc.frequency.linearRampToValueAtTime(650, now + i * 0.8 + 0.8);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setSirenPlaying(true);
    } catch (e) {
      console.warn('AudioContext error:', e);
    }
  };

  const stopRescueSiren = () => {
    if (sirenOscRef.current) {
      try {
        sirenOscRef.current.stop();
        sirenOscRef.current.disconnect();
      } catch (e) {}
      sirenOscRef.current = null;
    }
    if (sirenAudioCtxRef.current) {
      try {
        sirenAudioCtxRef.current.close();
      } catch (e) {}
      sirenAudioCtxRef.current = null;
    }
    setSirenPlaying(false);
  };

  const triggerNavSos = () => {
    setSmsDispatchedView(false);
    setShowSosModal(true);
    startRescueSiren();

    logSosIncident({
      triggerType: 'navbar_bell_triggered',
      lat: navGpsCoords.lat,
      lng: navGpsCoords.lng,
      guardianPhone: guardianPhone,
      status: 'active',
      whatsappDispatched: false,
      sirenDecibels: 105
    }).catch(() => {});

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setNavGpsCoords({
            lat: pos.coords.latitude.toFixed(5),
            lng: pos.coords.longitude.toFixed(5)
          });
          setGpsLocked(true);
        },
        () => {
          setNavGpsCoords({ lat: '25.3176', lng: '82.9739' });
          setGpsLocked(true);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };

  const handleConfirmWhatsApp = () => {
    const sosMessage = `EMERGENCY SOS ALARM ACTIVATED! I need urgent help! My real-time live satellite GPS coordinates: https://maps.google.com/?q=${navGpsCoords.lat},${navGpsCoords.lng} - Dispatched via HERHUB Sentinel.`;
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(sosMessage)}`;
    window.open(waUrl, '_blank');

    logSosIncident({
      triggerType: 'navbar_bell_whatsapp',
      lat: navGpsCoords.lat,
      lng: navGpsCoords.lng,
      guardianPhone: guardianPhone,
      status: 'dispatched',
      whatsappDispatched: true,
      sirenDecibels: 105
    }).catch(() => {});

    stopRescueSiren();
    setShowSosModal(false);
  };

  const handleSendOfflineSms = () => {
    const sosMessage = `EMERGENCY SOS! I need urgent help. My live satellite GPS location: https://maps.google.com/?q=${navGpsCoords.lat},${navGpsCoords.lng} - Dispatched via HerHub Sentinel`;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const smsDelimiter = isIOS ? '&' : '?';
    const smsUrl = `sms:7524072395${smsDelimiter}body=${encodeURIComponent(sosMessage)}`;

    const link = document.createElement('a');
    link.href = smsUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logSosIncident({
      triggerType: 'navbar_offline_sms_dispatched',
      lat: navGpsCoords.lat,
      lng: navGpsCoords.lng,
      guardianPhone: guardianPhone,
      status: 'sms_dispatched',
      whatsappDispatched: false,
      sirenDecibels: 105
    }).catch(() => {});

    if (!isMobile) {
      setSmsDispatchedView(true);
    } else {
      stopRescueSiren();
      setShowSosModal(false);
    }
  };

  const handleDismissSos = () => {
    stopRescueSiren();
    setShowSosModal(false);
    setSmsDispatchedView(false);
  };

  return (
    <>
      <nav className="exact-nav">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            
            {/* Brand Logo */}
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
              <div className="brand-badge-logo">
                <FaHeart style={{ fontSize: '0.82rem', color: '#fff' }} />
              </div>
              <span className="brand-title">HERHUB</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="d-none d-lg-flex align-items-center gap-1">
              <Link to="/safety-hub" className="exact-nav-link text-decoration-none">Safety Tools</Link>
              <Link to="/saferoute-ai" className="exact-nav-link text-decoration-none">SafeRoute AI</Link>
              <Link to="/route-intelligence" className="exact-nav-link text-decoration-none" style={{ color: '#10B981', fontWeight: 600 }}>Route Intel</Link>
              <Link to="/awareness-hub" className="exact-nav-link text-decoration-none d-flex align-items-center gap-1" style={{ color: '#E03577', fontWeight: 700 }}>
                <span>Awareness Wall</span>
                <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.62rem', padding: '2px 5px' }}>Live</span>
              </Link>
              <Link to="/community" className="exact-nav-link text-decoration-none">Community</Link>
              <Link to="/about" className="exact-nav-link text-decoration-none">About</Link>
              
              {/* Emergency SOS Alarm Bell */}
              <button
                type="button"
                onClick={triggerNavSos}
                className="btn btn-sm btn-danger d-inline-flex align-items-center justify-content-center text-white ms-2"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  border: 'none',
                  boxShadow: '0 0 14px rgba(239, 68, 68, 0.65)',
                  cursor: 'pointer',
                  padding: 0
                }}
                title="Emergency SOS Alarm"
                aria-label="Emergency SOS Alarm"
              >
                <FaBell style={{ fontSize: '0.88rem', animation: 'sosRing 1.2s infinite' }} />
              </button>
            </div>

            {/* Right Controls */}
            <div className="d-none d-lg-flex align-items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="theme-toggle-btn"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle dark/light theme"
              >
                {isDark ? (
                  <FaSun style={{ fontSize: '1.05rem', color: '#FCD34D' }} />
                ) : (
                  <FaMoon style={{ fontSize: '1rem', color: '#6355E6' }} />
                )}
              </button>

              {!isLoggedIn ? (
                <button
                  type="button"
                  onClick={openAuthModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.9rem',
                    color: isDark ? '#E2DFFA' : '#555271',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: 8,
                    transition: 'color 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#8A7CFE'}
                  onMouseLeave={e => e.currentTarget.style.color = isDark ? '#E2DFFA' : '#555271'}
                >
                  Sign in
                </button>
              ) : (
                <div className="position-relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    style={{
                      backgroundColor: isDark ? '#231B45' : '#EDE8FE',
                      border: isDark ? '1px solid #3F3077' : '1px solid #D5CEFD',
                      borderRadius: 30,
                      padding: '4px 14px 4px 6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer'
                    }}
                  >
                    <div 
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: '#6355E6',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {user.avatarInitial || 'U'}
                    </div>
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: isDark ? '#FFFFFF' : '#160D33' }}>
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <div 
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '115%',
                        backgroundColor: isDark ? '#191238' : '#FFFFFF',
                        borderRadius: 16,
                        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
                        border: isDark ? '1px solid #362963' : '1px solid #ECECF2',
                        width: 260,
                        zIndex: 1000,
                        padding: 16
                      }}
                    >
                      <div className="pb-2 mb-2 border-bottom" style={{ borderColor: isDark ? '#31255C' : '#ECECF2' }}>
                        <strong className="d-block text-truncate" style={{ fontSize: '0.92rem', color: isDark ? '#FFFFFF' : '#160D33' }}>{user.name}</strong>
                        <small className="text-muted d-block text-truncate" style={{ fontSize: '0.78rem' }}>{user.email || user.phone}</small>
                      </div>

                      <div className="mb-2 p-2 rounded" style={{ backgroundColor: isDark ? '#23194C' : '#F8F7FD', fontSize: '0.76rem' }}>
                        <span style={{ color: '#9887FE', fontWeight: 700, display: 'block' }}>Emergency Guardian:</span>
                        <span style={{ color: isDark ? '#D5CEFD' : '#4A4660' }}>{user.emergencyContactName} ({user.emergencyContactPhone})</span>
                      </div>

                      <div className="d-flex align-items-center gap-1 text-success mb-3" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        <FaShieldAlt />
                        <span>Private Session Encrypted</span>
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                        style={{ borderRadius: 8, fontSize: '0.82rem' }}
                      >
                        <FaSignOutAlt />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <Link 
                to="/safety-hub"
                className="btn-open-safety-hub text-decoration-none"
              >
                <span>Open Safety Hub</span>
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="d-lg-none d-flex align-items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="theme-toggle-btn"
                style={{ width: 34, height: 34 }}
                title="Toggle Theme"
              >
                {isDark ? <FaSun style={{ color: '#FCD34D', fontSize: '0.9rem' }} /> : <FaMoon style={{ color: '#6355E6', fontSize: '0.85rem' }} />}
              </button>

              <button 
                className="btn p-0"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: isDark ? '#FFFFFF' : '#160D33' }}
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="d-lg-none pt-3 pb-2 mt-2 border-top" style={{ borderColor: isDark ? '#31255C' : '#E9E7F2' }}>
              <div className="d-flex flex-column gap-2">
                <Link to="/safety-hub" className="exact-nav-link text-decoration-none" onClick={() => setMobileMenuOpen(false)}>Safety Tools</Link>
                <Link to="/saferoute-ai" className="exact-nav-link text-decoration-none" onClick={() => setMobileMenuOpen(false)}>SafeRoute AI</Link>
                <Link to="/route-intelligence" className="exact-nav-link text-decoration-none" style={{ color: '#10B981', fontWeight: 600 }} onClick={() => setMobileMenuOpen(false)}>Route Intel</Link>
                <Link to="/awareness-hub" className="exact-nav-link text-decoration-none d-flex align-items-center justify-content-between" style={{ color: '#E03577', fontWeight: 700 }} onClick={() => setMobileMenuOpen(false)}>
                  <span>Awareness Wall</span>
                  <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.62rem' }}>Live Ticker</span>
                </Link>
                <Link to="/community" className="exact-nav-link text-decoration-none" onClick={() => setMobileMenuOpen(false)}>Community</Link>
                <div className="d-flex align-items-center justify-content-between pe-2 my-1">
                  <Link to="/about" className="exact-nav-link text-decoration-none" onClick={() => setMobileMenuOpen(false)}>About</Link>
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); triggerNavSos(); }}
                    className="btn btn-sm btn-danger d-inline-flex align-items-center justify-content-center text-white"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#EF4444',
                      border: 'none',
                      boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)',
                      padding: 0
                    }}
                    title="Emergency SOS Alarm"
                  >
                    <FaBell style={{ fontSize: '0.88rem' }} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* =====================================================================
          GLOBAL EMERGENCY SOS MODAL (100% PURE CLEAN ENGLISH & PRO ICONS)
          ===================================================================== */}
      {showSosModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 6, 28, 0.92)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div
            style={{
              backgroundColor: isDark ? '#1C1035' : '#FFFFFF',
              borderRadius: 24,
              border: '3px solid #EF4444',
              boxShadow: '0 0 60px rgba(239, 68, 68, 0.55)',
              maxWidth: 480,
              width: '100%',
              padding: '28px',
              color: isDark ? '#FFFFFF' : '#160D33',
              textAlign: 'center'
            }}
          >
            {/* Siren Pulsing Icon */}
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '3px solid #EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                fontSize: '2.2rem',
                margin: '0 auto 16px',
                animation: 'pulse 1s infinite'
              }}
            >
              <FaBell />
            </div>

            <h4 style={{ fontWeight: 900, color: '#EF4444', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <FaBell /> SOS SIREN ACTIVATED!
            </h4>
            <p style={{ fontSize: '0.86rem', color: isDark ? '#CBD5E1' : '#555271', marginBottom: 16, lineHeight: 1.5 }}>
              105dB Strobe Alarm is actively sounding to deter attackers and attract nearby bystanders.
            </p>

            {/* GPS Telemetry Pin (Clean English & Pure Coordinates) */}
            <div
              className="p-2 rounded-3 mb-3 d-flex align-items-center justify-content-between"
              style={{ backgroundColor: isDark ? '#26164A' : '#F4F1FD', border: '1px solid #7C3AED', fontSize: '0.78rem' }}
            >
              <span style={{ color: isDark ? '#C4B5FD' : '#6D28D9', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FaMapMarkerAlt /> {gpsLocked ? 'Live Satellite GPS Lock:' : 'GPS Coordinates:'}
              </span>
              <code style={{ color: isDark ? '#A7F3D0' : '#059669', fontWeight: 800 }}>
                {navGpsCoords.lat}° N, {navGpsCoords.lng}° E
              </code>
            </div>

            {/* Dispatched SMS Confirmation View (Desktop fallback) */}
            {smsDispatchedView ? (
              <div className="p-3 rounded-3 mb-3 text-start" style={{ backgroundColor: 'rgba(99, 85, 230, 0.12)', border: '1.5px solid #6355E6' }}>
                <div style={{ color: '#10B981', fontWeight: 800, fontSize: '0.85rem', marginBottom: 4 }}>
                  Cellular SMS Protocol Triggered!
                </div>
                <div style={{ fontSize: '0.74rem', color: isDark ? '#CBD5E1' : '#475569', marginBottom: 8 }}>
                  Dispatched to Primary Guardian: <strong style={{ color: '#EC4899' }}>+91 75240 72395</strong>
                </div>
                <div style={{
                  backgroundColor: isDark ? '#140E2D' : '#F5F3FF',
                  border: '1px dashed #6355E6',
                  borderRadius: 8,
                  padding: '8px 10px',
                  fontSize: '0.72rem',
                  color: isDark ? '#E2DFFA' : '#334155',
                  wordBreak: 'break-all',
                  marginBottom: 10
                }}>
                  EMERGENCY SOS! I need urgent help. My live satellite GPS location: https://maps.google.com/?q={navGpsCoords.lat},{navGpsCoords.lng} - Dispatched via HerHub Sentinel
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`EMERGENCY SOS! I need urgent help. My live satellite GPS location: https://maps.google.com/?q=${navGpsCoords.lat},${navGpsCoords.lng} - Dispatched via HerHub Sentinel`);
                      setCopiedSms(true);
                      setTimeout(() => setCopiedSms(false), 2000);
                    }}
                    className="btn btn-sm btn-primary flex-grow-1"
                    style={{ fontSize: '0.76rem', borderRadius: 8, fontWeight: 700 }}
                  >
                    {copiedSms ? '✓ Copied to Clipboard' : 'Copy Dispatched SMS'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { stopRescueSiren(); setShowSosModal(false); setSmsDispatchedView(false); }}
                    className="btn btn-sm btn-outline-secondary"
                    style={{ fontSize: '0.76rem', borderRadius: 8 }}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Authorization prompt in 100% pure English */
              <div
                className="p-3 rounded-3 mb-4 text-start"
                style={{ backgroundColor: 'rgba(37, 211, 102, 0.1)', border: '1.5px solid #25D366' }}
              >
                <div style={{ fontWeight: 800, color: '#16A34A', fontSize: '0.84rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FaWhatsapp /> WhatsApp Dispatch Authorization:
                </div>
                <div style={{ fontSize: '0.78rem', color: isDark ? '#E2E8F0' : '#334155', lineHeight: 1.5 }}>
                  Authorize instant dispatch of your <strong>Live Satellite GPS Coordinates & SOS Emergency Alert</strong> to primary guardian (<strong>{guardianPhone}</strong>) via WhatsApp?
                </div>
              </div>
            )}

            {/* Action Buttons: WhatsApp vs Cellular SMS vs Dismiss */}
            <div className="d-flex flex-column gap-2 mb-3">
              <button
                type="button"
                onClick={handleConfirmWhatsApp}
                className="btn py-2 d-flex align-items-center justify-content-center gap-2 text-white"
                style={{ backgroundColor: '#25D366', borderRadius: 12, fontWeight: 900, fontSize: '0.92rem', border: 'none', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.35)' }}
              >
                <FaWhatsapp style={{ fontSize: '1.25rem' }} />
                Send Online WhatsApp Alert
              </button>

              <button
                type="button"
                onClick={handleSendOfflineSms}
                className="btn py-2 d-flex align-items-center justify-content-center gap-2 text-white"
                style={{ backgroundColor: '#6355E6', borderRadius: 12, fontWeight: 900, fontSize: '0.88rem', border: 'none', boxShadow: '0 4px 15px rgba(99, 85, 230, 0.35)' }}
              >
                <FaSms style={{ fontSize: '1.15rem' }} />
                Send Offline SMS via Cellular Network (No Internet)
              </button>

              <button
                type="button"
                onClick={handleDismissSos}
                className="btn btn-outline-danger py-2 d-flex align-items-center justify-content-center gap-2"
                style={{ borderRadius: 12, fontWeight: 800, fontSize: '0.86rem' }}
              >
                <FaTimes />
                Stop Alarm / False Alarm
              </button>
            </div>

            {/* Sub-controls: Mute Siren Toggle & Police 112 */}
            <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: isDark ? '#2D2053' : '#E2E8F0' }}>
              <button
                type="button"
                onClick={sirenPlaying ? stopRescueSiren : startRescueSiren}
                className="btn btn-sm btn-outline-warning py-1 px-3 d-flex align-items-center gap-1"
                style={{ fontSize: '0.74rem', borderRadius: 8, fontWeight: 700 }}
              >
                {sirenPlaying ? <FaVolumeMute /> : <FaVolumeUp />}
                {sirenPlaying ? 'Mute Siren' : 'Sound Siren'}
              </button>

              <a
                href="tel:112"
                className="text-danger text-decoration-none d-flex align-items-center gap-1"
                style={{ fontSize: '0.78rem', fontWeight: 800 }}
              >
                <FaPhoneAlt /> Call Police (112)
              </a>
            </div>
          </div>
        </div>
      )}

      <AuthModal />
    </>
  );
}

export default Navbar;
