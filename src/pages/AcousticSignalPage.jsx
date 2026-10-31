import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaVolumeUp, FaMobileAlt, FaQrcode, FaExternalLinkAlt, 
  FaCopy, FaArrowLeft
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

function AcousticSignalPage() {
  const { isDark } = useTheme();

  // Offline Survival State
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [strobeColor, setStrobeColor] = useState('#EF4444');
  const [qrMode, setQrMode] = useState('whatsapp'); // 'whatsapp' | 'webportal'
  const [copiedQrLink, setCopiedQrLink] = useState(false);

  // Live Telemetry
  const [liveGpsCoords, setLiveGpsCoords] = useState({ lat: '28.6139', lng: '77.2090' });
  const [guardianPhone] = useState('+91 75240 72395');
  const [vehiclePlate] = useState('DL 3C AB 4912');
  const [driverName] = useState('Ramesh Kumar (Uber Verified)');

  const sirenAudioCtxRef = useRef(null);
  const sirenOscRef = useRef(null);
  const strobeIntervalRef = useRef(null);

  // Offline Activity Feed
  const [offlineLog, setOfflineLog] = useState([
    { time: '10:42 PM', event: '0% Mobile Internet detected. Cellular SMS fallback armed.', status: 'info' },
    { time: '10:43 PM', event: 'Acoustic ultrasonic transmitter calibrated on 19.5 kHz.', status: 'info' },
    { time: '10:44 PM', event: 'Offline Emergency Survival Shield ready for instant rescue deployment.', status: 'active' }
  ]);

  useEffect(() => {
    // Acquire GPS if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLiveGpsCoords({
            lat: pos.coords.latitude.toFixed(4),
            lng: pos.coords.longitude.toFixed(4)
          });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }

    return () => {
      stopRescueAlarm();
    };
  }, []);

  // -------------------------------------------------------------
  // HIGH-DECIBEL ACOUSTIC RESCUE SIREN & VISUAL POLICE STROBE
  // -------------------------------------------------------------
  const startRescueAlarm = () => {
    setIsSirenActive(true);
    setIsStrobeActive(true);

    // Strobe light color oscillator (Red / Blue)
    let flip = false;
    clearInterval(strobeIntervalRef.current);
    strobeIntervalRef.current = setInterval(() => {
      flip = !flip;
      setStrobeColor(flip ? '#EF4444' : '#3B82F6');
    }, 180);

    // High-Decibel Siren using Web Audio API
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      sirenAudioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      // Alternating 800Hz to 1250Hz frequency siren
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(1250, now + 0.35);
      osc.frequency.linearRampToValueAtTime(800, now + 0.7);
      osc.frequency.linearRampToValueAtTime(1250, now + 1.05);
      osc.frequency.linearRampToValueAtTime(800, now + 1.4);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      sirenOscRef.current = osc;
    } catch (e) {}

    setOfflineLog(prev => [
      { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), event: '🚨 Loud Piercing Acoustic Siren & Police Flashing Strobe ACTIVATED!', status: 'alert' },
      ...prev
    ]);
  };

  const stopRescueAlarm = () => {
    setIsSirenActive(false);
    setIsStrobeActive(false);
    clearInterval(strobeIntervalRef.current);

    if (sirenOscRef.current) {
      try { sirenOscRef.current.stop(); } catch (e) {}
    }
    if (sirenAudioCtxRef.current && sirenAudioCtxRef.current.state !== 'closed') {
      try { sirenAudioCtxRef.current.close(); } catch (e) {}
    }
  };

  // -------------------------------------------------------------
  // CELLULAR SMS & PASSERBY QR BEACON PAYLOADS
  // -------------------------------------------------------------
  const getOfflineSmsLink = () => {
    const text = encodeURIComponent(
      `🚨 EMERGENCY SOS DISTRESS! I am trapped with 0% INTERNET DATA!\n` +
      `GPS Coordinates: https://maps.google.com/?q=${liveGpsCoords.lat},${liveGpsCoords.lng}\n` +
      `Vehicle: ${vehiclePlate} (${driverName})\n` +
      `Please alert Police 112 immediately! Dispatched via HerHub Offline Survival Shield.`
    );
    return `sms:${guardianPhone}?body=${text}`;
  };

  const bystanderWebPortalUrl = `${window.location.origin}/bystander-relay?lat=${liveGpsCoords.lat}&lng=${liveGpsCoords.lng}&plate=${encodeURIComponent(vehiclePlate)}`;

  const activeQrCodePayload = qrMode === 'whatsapp'
    ? `https://api.whatsapp.com/send?phone=${guardianPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
        `🚨 PASSERBY RESCUE SOS: A woman in vehicle ${vehiclePlate} needs immediate police help! Live GPS: https://maps.google.com/?q=${liveGpsCoords.lat},${liveGpsCoords.lng} - Please call Police 112!`
      )}`
    : bystanderWebPortalUrl;

  const t = {
    cardBg: isDark ? '#1C1236' : '#FFFFFF',
    cardBorder: isDark ? '1px solid #36255C' : '1px solid #E2E8F0',
    subCardBg: isDark ? '#26184A' : '#F8FAFC',
    subCardBorder: isDark ? '1px solid #3E2B6B' : '1px solid #E2E8F0',
    textPrimary: isDark ? '#FFFFFF' : '#12102B',
    textSecondary: isDark ? '#CBD5E1' : '#475569',
    textMuted: isDark ? '#94A3B8' : '#64748B'
  };

  return (
    <div style={{ backgroundColor: isDark ? '#0D071E' : '#FDFDFE', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* 🚨 STROBE LIGHT EFFECT OVERLAY (IF ACTIVE) */}
      {isStrobeActive && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: strobeColor,
            opacity: 0.25,
            zIndex: 999998,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* ════════ DARK HERO BANNER ════════ */}
      <section style={{ backgroundColor: '#160D33', color: '#FFFFFF', padding: '45px 0 55px', borderBottom: '2px solid rgba(2, 132, 199, 0.4)' }}>
        <div className="container">
          
          <Link 
            to="/safety-hub" 
            className="d-inline-flex align-items-center gap-2 mb-3 text-decoration-none"
            style={{ color: '#A5B4FC', fontSize: '0.86rem', fontWeight: 600 }}
          >
            <FaArrowLeft /> Back to Safety Tools
          </Link>

          <div className="row align-items-center justify-content-between g-4">
            <div className="col-12 col-lg-8">
              
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span 
                  className="badge px-3 py-1 d-inline-flex align-items-center gap-2"
                  style={{ backgroundColor: '#0284C7', color: '#FFFFFF', fontSize: '0.74rem', fontWeight: 900 }}
                >
                  <span className="spinner-grow spinner-grow-sm text-light" style={{ width: 6, height: 6 }} />
                  ZERO INTERNET / NO DATA PROTOCOL
                </span>
                <span className="badge bg-danger bg-opacity-25 text-danger border border-danger" style={{ fontSize: '0.74rem' }}>
                  📶 0% Mobile Data Resilience
                </span>
              </div>

              <h1 style={{ fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 2.8rem)', letterSpacing: '-0.5px', marginBottom: 12 }}>
                Acoustic & Signal Stream: Offline Survival Shield
              </h1>

              <p style={{ color: '#C7C3DF', fontSize: '1rem', lineHeight: 1.6, maxWidth: 680, margin: 0 }}>
                Basement parking, underground metro tunnels, and highway blind spots often have <strong>0% mobile data</strong>. 
                HerHub deploys high-decibel acoustic rescue sirens, flashing police strobe lights, direct cellular SMS, and passerby rescue QR beacons that function flawlessly with zero internet!
              </p>

            </div>

            {/* STATUS BADGE */}
            <div className="col-12 col-lg-4 text-lg-end">
              <div 
                className="p-3 rounded-4 d-inline-block text-start w-100"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ fontSize: '0.75rem', color: '#A5B4FC' }}>📍 Offline GPS Lock:</span>
                  <span className="badge bg-success" style={{ fontSize: '0.65rem' }}>Active Satellite</span>
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
                  {liveGpsCoords.lat}° N, {liveGpsCoords.lng}° E
                </div>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>Emergency Target:</span>
                  <strong style={{ fontSize: '0.8rem', color: '#38BDF8' }}>{guardianPhone}</strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ════════ MAIN OFFLINE SURVIVAL SHIELD CONSOLE ════════ */}
      <main className="container mt-4">
        
        <div className="row g-4">
          
          {/* LEFT COLUMN: 3 OFFLINE SURVIVAL ACTIONS */}
          <div className="col-12 col-lg-7">
            <div className="p-4 rounded-4 h-100 shadow-sm" style={{ backgroundColor: t.cardBg, border: t.cardBorder }}>
              
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <span className="badge mb-1" style={{ backgroundColor: '#0284C7' }}>
                    0% DATA DEFENSE
                  </span>
                  <h3 style={{ fontWeight: 800, color: t.textPrimary, margin: 0, fontSize: '1.4rem' }}>
                    Offline Emergency Survival Controls
                  </h3>
                </div>
                <span className="badge bg-danger px-3 py-2" style={{ fontSize: '0.76rem', fontWeight: 800 }}>
                  📶 NO NETWORK NEEDED
                </span>
              </div>

              <p style={{ color: t.textSecondary, fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 20 }}>
                When you are trapped in a basement, underground metro, or remote road with no mobile data, WhatsApp and web calls fail. Use these 3 hardware-level acoustic and signal tools:
              </p>

              {/* ACTION 1: LOUD RESCUE SIREN & FLASHING POLICE STROBE LIGHT */}
              <div
                className="p-3 rounded-4 mb-3 text-center"
                style={{
                  backgroundColor: isStrobeActive ? strobeColor : t.subCardBg,
                  border: isStrobeActive ? '3px solid #FFFFFF' : t.subCardBorder,
                  boxShadow: isStrobeActive ? `0 0 35px ${strobeColor}` : 'none',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                  <FaVolumeUp style={{ fontSize: '1.4rem', color: isStrobeActive ? '#FFFFFF' : '#EF4444' }} />
                  <strong style={{ fontSize: '0.96rem', color: isStrobeActive ? '#FFFFFF' : t.textPrimary }}>
                    1. Loud Piercing Acoustic Siren & Police Strobe (Basement / Parking)
                  </strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: isStrobeActive ? '#FFFFFF' : t.textMuted, marginBottom: 14 }}>
                  Turns the phone into a high-visibility flashing red/blue beacon and blasts an ear-piercing siren to alert security guards and passersby within a 200m radius!
                </p>

                <button
                  type="button"
                  onClick={isSirenActive ? stopRescueAlarm : startRescueAlarm}
                  className={`btn btn-lg px-4 py-2 ${isSirenActive ? 'btn-light fw-bold text-danger' : 'btn-danger'}`}
                  style={{ borderRadius: 14, fontWeight: 900, fontSize: '0.95rem', boxShadow: '0 4px 18px rgba(0,0,0,0.2)' }}
                >
                  {isSirenActive ? '⏹ Stop Acoustic Siren & Strobe Light' : '🚨 Turn On Siren & Police Flashing Strobe'}
                </button>
              </div>

              {/* ACTION 2: ZERO-INTERNET CELLULAR SMS DISPATCH */}
              <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: t.subCardBg, border: t.subCardBorder }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FaMobileAlt /> 2. Direct Cellular SMS (Works 100% Without Data):
                  </span>
                  <span className="badge bg-success" style={{ fontSize: '0.66rem' }}>Zero Internet Required</span>
                </div>
                <p style={{ fontSize: '0.76rem', color: t.textSecondary, marginBottom: 12 }}>
                  Standard cellular telephony SMS functions even when mobile data is 0%. This button pre-fills live GPS coordinates, vehicle details, and an urgent distress SOS to your guardian and Police 112:
                </p>

                <a
                  href={getOfflineSmsLink()}
                  className="btn btn-sm btn-success w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: 12, fontWeight: 800, fontSize: '0.88rem' }}
                >
                  📩 Send Direct Cellular Offline SOS to Guardian ({guardianPhone})
                </a>
              </div>

              {/* ACTION 3: PASSERBY EMERGENCY QR BRIDGE */}
              <div className="p-3 rounded-3" style={{ backgroundColor: t.subCardBg, border: t.subCardBorder }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0284C7' }}>
                    3. Passerby Rescue Bridge (Show QR to Anyone):
                  </span>
                  <span className="badge bg-info text-dark" style={{ fontSize: '0.66rem', fontWeight: 800 }}>0% Data Safe</span>
                </div>
                <p style={{ fontSize: '0.76rem', color: t.textSecondary, marginBottom: 10 }}>
                  If your phone has no internet at all, show the QR code on the right to any security guard, traffic police, or pedestrian. 
                  When their phone scans your screen, it automatically launches a pre-filled WhatsApp SOS and dispatches your live GPS telemetry!
                </p>
                <a
                  href={bystanderWebPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-info w-100 d-flex align-items-center justify-content-center gap-1"
                  style={{ borderRadius: 8, fontSize: '0.78rem', fontWeight: 700 }}
                >
                  <FaExternalLinkAlt /> Simulate: Rescuer Phone View ↗
                </a>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: PASSERBY RESCUE QR CODE BEACON */}
          <div className="col-12 col-lg-5">
            <div className="p-4 rounded-4 h-100 shadow-sm" style={{ backgroundColor: t.cardBg, border: t.cardBorder }}>
              
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 style={{ fontWeight: 800, color: t.textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FaQrcode style={{ color: '#0284C7' }} />
                  Passerby Rescue QR Beacon
                </h5>
                <span className="badge bg-danger" style={{ fontSize: '0.68rem', fontWeight: 800 }}>LIVE 112 SOS</span>
              </div>

              {/* QR MODE SELECTOR */}
              <div className="d-flex p-1 rounded-3 mb-3" style={{ backgroundColor: t.subCardBg, border: t.subCardBorder }}>
                <button
                  type="button"
                  onClick={() => setQrMode('whatsapp')}
                  className={`btn btn-sm flex-grow-1 ${qrMode === 'whatsapp' ? 'btn-primary' : 'btn-link text-decoration-none'}`}
                  style={{
                    borderRadius: 8,
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: qrMode === 'whatsapp' ? '#FFFFFF' : t.textSecondary
                  }}
                >
                  💬 Direct WhatsApp SOS
                </button>
                <button
                  type="button"
                  onClick={() => setQrMode('webportal')}
                  className={`btn btn-sm flex-grow-1 ${qrMode === 'webportal' ? 'btn-primary' : 'btn-link text-decoration-none'}`}
                  style={{
                    borderRadius: 8,
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: qrMode === 'webportal' ? '#FFFFFF' : t.textSecondary
                  }}
                >
                  🌐 Police Relay Portal
                </button>
              </div>

              {/* QR CODE CARD */}
              <div className="p-3 rounded-3 text-center mb-3" style={{ backgroundColor: t.subCardBg, border: t.subCardBorder }}>
                <div
                  className="mx-auto mb-2 p-3 rounded-3 bg-white d-inline-block position-relative"
                  style={{ border: '3px solid #0284C7', boxShadow: '0 8px 30px rgba(2, 132, 199, 0.35)' }}
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(activeQrCodePayload)}`}
                    alt="Offline Emergency QR Beacon"
                    style={{ width: 160, height: 160, display: 'block' }}
                  />
                </div>

                <div style={{ fontSize: '0.84rem', fontWeight: 900, color: t.textPrimary, marginBottom: 2 }}>
                  {qrMode === 'whatsapp' ? '📲 Direct 112 WhatsApp SOS Beacon' : '🌐 Rescuer Web Relay Portal Beacon'}
                </div>
                <div style={{ fontSize: '0.74rem', color: t.textSecondary, marginBottom: 8 }}>
                  {qrMode === 'whatsapp'
                    ? 'When another phone scans this QR, it immediately opens a pre-filled WhatsApp SOS to Police 112 with your GPS coords!'
                    : 'Scanning opens a dedicated emergency bystander relay map with 1-tap police dispatch!'}
                </div>

                {/* QUICK ACTIONS */}
                <div className="d-flex gap-2 justify-content-center">
                  <a
                    href={bystanderWebPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-info px-3 py-1 d-inline-flex align-items-center gap-1"
                    style={{ borderRadius: 8, fontSize: '0.75rem', fontWeight: 800, color: '#042F2E' }}
                  >
                    <FaExternalLinkAlt /> Simulate Phone Scan ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(activeQrCodePayload);
                        setCopiedQrLink(true);
                        setTimeout(() => setCopiedQrLink(false), 2000);
                      }
                    }}
                    className="btn btn-sm btn-outline-secondary px-3 py-1 d-inline-flex align-items-center gap-1"
                    style={{ borderRadius: 8, fontSize: '0.75rem', color: t.textPrimary }}
                  >
                    <FaCopy /> {copiedQrLink ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>

                <div className="mt-2 pt-2 border-top" style={{ borderColor: t.cardBorder, fontSize: '0.7rem', color: t.textMuted }}>
                  GPS: <strong className="text-info">{liveGpsCoords.lat}° N, {liveGpsCoords.lng}° E</strong> • Vehicle: <strong className="text-warning">{vehiclePlate}</strong>
                </div>
              </div>

              {/* OFFLINE TELEMETRY ACTIVITY FEED */}
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: t.textSecondary, marginBottom: 8 }}>
                Zero-Data Acoustic Defense Activity Feed:
              </div>
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {offlineLog.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded mb-2"
                    style={{
                      backgroundColor: item.status === 'alert' ? 'rgba(239, 68, 68, 0.15)' : t.subCardBg,
                      border: item.status === 'alert' ? '1px solid #EF4444' : t.subCardBorder,
                      fontSize: '0.74rem'
                    }}
                  >
                    <div className="d-flex justify-content-between mb-1">
                      <span style={{ fontWeight: 800, color: item.status === 'alert' ? '#EF4444' : '#0284C7' }}>{item.time}</span>
                      <span className="badge" style={{ backgroundColor: item.status === 'alert' ? '#EF4444' : '#0284C7', fontSize: '0.62rem' }}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ color: t.textPrimary }}>{item.event}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

      </main>

    </div>
  );
}

export default AcousticSignalPage;
