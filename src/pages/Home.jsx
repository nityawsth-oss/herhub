import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCheck, FaArrowRight, FaExclamationTriangle,
  FaPhoneAlt, FaShieldAlt, FaMapMarkedAlt,
  FaTimes, FaVolumeUp,
  FaUserShield, FaTrain,
  FaWhatsapp, FaBell, FaVolumeMute,
  FaGavel, FaCalendarAlt
} from 'react-icons/fa';

function Home() {
  // Tabs for Toolkit */
  const [activeTab, setActiveTab] = useState('All');

  // Modals for features */
  const [activeModal, setActiveModal] = useState(null); // 'checkin', 'emergency', 'saferoute', 'report', 'risk', 'route_dev', 'acoustic', 'deepfake', 'guardian_call', 'learning_pulse'

  // Check-in Timer State */




  // AI Guardian Call State */
  const [callActive, setCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState(0);









  // -------------------------------------------------------------------------
  // ⚡ TRIPLE-TAP & TRIPLE-SHAKE ZERO-CLICK GESTURE SENTINEL
  // -------------------------------------------------------------------------
  const [gestureAlertActive, setGestureAlertActive] = useState(false);
  const [triggerSource, setTriggerSource] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [sirenActive, setSirenActive] = useState(false);
  const [gpsCoords, setGpsCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Fetching live GPS...');
  const [emergencyPhone] = useState('+91 75240 72395'); /*

  //
    } catch {
  // default phone
    }

  */ const [autoWhatsAppTriggered, setAutoWhatsAppTriggered] = useState(false);

  const tapHistoryRef = useRef([]);
  const shakeHistoryRef = useRef([]);
  const sirenAudioCtxRef = useRef(null);
  const sirenOscRef = useRef(null);
  const countdownTimerRef = useRef(null);

  // Global Triple-Tap Detector (Anywhere on screen)
  useEffect(() => {
    const handleGlobalTap = (e) => {
      if (gestureAlertActive) return;
      if (e.target.closest('button, a, input, select, textarea, .no-gesture')) {
        return;
      }

      const now = Date.now();
      tapHistoryRef.current = tapHistoryRef.current.filter((t) => now - t < 1500);
      tapHistoryRef.current.push(now);

      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      if (tapHistoryRef.current.length >= 3) {
        tapHistoryRef.current = [];
        triggerGestureRescue('Triple-Screen Tap (Zero-Click)');
      }
    };

    window.addEventListener('pointerdown', handleGlobalTap);
    return () => window.removeEventListener('pointerdown', handleGlobalTap);
  }, [gestureAlertActive]);

  // Hardware Accelerometer Triple-Shake Detector
  useEffect(() => {
    let lastShakeTime = 0;

    const handleDeviceMotion = (event) => {
      if (gestureAlertActive) return;
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      if (magnitude > 19) {
        const now = Date.now();
        if (now - lastShakeTime > 300) {
          lastShakeTime = now;
          shakeHistoryRef.current = shakeHistoryRef.current.filter((t) => now - t < 2000);
          shakeHistoryRef.current.push(now);

          if (navigator.vibrate) {
            navigator.vibrate(80);
          }

          if (shakeHistoryRef.current.length >= 3) {
            shakeHistoryRef.current = [];
            triggerGestureRescue('Triple Phone Shake (Motion)');
          }
        }
      }
    };

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    return () => {
      if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
        window.removeEventListener('devicemotion', handleDeviceMotion);
      }
    };
  }, [gestureAlertActive]);

  const triggerGestureRescue = (source) => {
    setTriggerSource(source);
    setGestureAlertActive(true);
    setCountdown(3);
    setSirenActive(false);
    setAutoWhatsAppTriggered(false);
    
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: pos.coords.latitude.toFixed(5),
            lng: pos.coords.longitude.toFixed(5)
          });
        
          setLocationStatus('GPS Satellite Lock Acquired');
        },
        () => {
          setGpsCoords({ lat: '28.6139', lng: '77.2090' });
          setLocationStatus('GPS Network Approximation (Delhi NCR)');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setGpsCoords({ lat: '28.6139', lng: '77.2090' });
      setLocationStatus('Cellular Telephony Coordinates');
    }
  };

  // 3-Second Abort Countdown & Automatic Hands-Free WhatsApp Dispatch
  useEffect(() => {
    if (gestureAlertActive && countdown > 0) {
      countdownTimerRef.current = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (gestureAlertActive && countdown === 0 && !autoWhatsAppTriggered) {
      startRescueSiren();
      setAutoWhatsAppTriggered(true);

      // AUTOMATICALLY LAUNCH WHATSAPP DIRECTLY TO GUARDIAN PHONE (7524072395)
      let cleanNumber = emergencyPhone.replace(/[^0-9]/g, '');
      if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;

      const lat = gpsCoords?.lat || '28.6139';
      const lng = gpsCoords?.lng || '77.2090';
      const sosMessage = `🚨 EMERGENCY SOS DISTRESS! I need immediate help! My real-time live GPS coordinates: https://maps.google.com/?q=${lat},${lng} - Sent via HERHUB Zero-Click Gesture Sentinel.`;
      
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(sosMessage)}`;

      try {
        const win = window.open(whatsappUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          window.location.href = whatsappUrl;
        }
      } catch (err) {
        window.location.href = whatsappUrl;
      }
    }
    return () => clearTimeout(countdownTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gestureAlertActive, countdown, autoWhatsAppTriggered, emergencyPhone, gpsCoords]);

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
      gain.gain.setValueAtTime(0.12, ctx.currentTime);

      const now = ctx.currentTime;
      for (let i = 0; i < 40; i++) {
        osc.frequency.setValueAtTime(650, now + i * 0.8);
        osc.frequency.linearRampToValueAtTime(1100, now + i * 0.8 + 0.4);
        osc.frequency.linearRampToValueAtTime(650, now + i * 0.8 + 0.8);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setSirenActive(true);
    } catch (e) {
      console.log('AudioContext error:', e);
    }
  };

  const stopRescueSiren = () => {
    if (sirenOscRef.current) {
      try {
  
        sirenOscRef.current.stop();
      } catch (e) {}
      sirenOscRef.current = null;
    }
    if (sirenAudioCtxRef.current && sirenAudioCtxRef.current.state !== 'closed') {
      try {
  
        sirenAudioCtxRef.current.close();
      } catch (e) {}
      sirenAudioCtxRef.current = null;
    }
    setSirenActive(false);
  };

  const dismissGestureEmergency = () => {
    stopRescueSiren();
    clearTimeout(countdownTimerRef.current);
    setGestureAlertActive(false);
    setCountdown(3);
    setAutoWhatsAppTriggered(false);
  };

  /* Check-in timer disabled
  useEffect(() => {
    let interval = null;
    if (checkInActive && checkInSecondsLeft > 0) {
      interval = setInterval(() => {
        setCheckInSecondsLeft(s => s - 1);
      }, 1000);
    } else if (checkInActive && checkInSecondsLeft === 0) {
      setCheckInActive(false);
    }
    return () => clearInterval(interval);
  }, []); */

  // Timer for AI Guardian Call */
  useEffect(() => {
    let interval = null;
    if (callActive) {
      interval = setInterval(() => setCallTimer(t => t + 1), 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  /* const startCheckIn = (mins) => {
    setCheckInMinutes(mins);
    setCheckInSecondsLeft(mins * 60);
    setCheckInActive(true);
    setActiveModal(null);
  };

  const cancelCheckIn = () => {
    setCheckInActive(false);
    setCheckInSecondsLeft(0);
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Toolkit cards data */
  // Master Priority List (1 to 15)
  const toolkitTools = [
    // 1. SafeRoute AI
    {
      id: 'saferoute',
      category: 'Detect',
      icon: <FaMapMarkedAlt />,
      badge: 'SAFE NAVIGATION',
      badgeClass: 'badge-simulated',
      title: 'SafeRoute AI',
      desc: 'Plan a journey with calm path guidance and travel preferences.',
      link: '/saferoute-ai'
    },
    // 2. Street Harassment Shield
    {
      id: 'harassment_shield',
      category: 'Protect',
      icon: <FaShieldAlt />,
      badge: 'URGENT ALERT',
      badgeClass: 'badge-urgent',
      title: 'Street Harassment Shield',
      desc: '1-Tap Hindi police wireless dispatch alarm to scare away street harassers under BNS 79.',
      link: '/anti-harassment'
    },
    // 3. Smart Defense Suite
    {
      id: 'route_dev',
      category: 'Defense',
      icon: <FaShieldAlt />,
      badge: 'LIVE AI',
      badgeClass: 'badge-live',
      title: 'Smart Defense Suite',
      desc: 'Hands-free AI voice distress sentinel & HerScan 360° AI vehicle inspection camera.',
      link: '/route-deviation'
    },
    // 4. SoloSafe Voyage (Trip Planner)
    {
      id: 'solo_voyage',
      category: 'Protect',
      icon: <FaTrain />,
      badge: 'LIVE GUARDIAN',
      badgeClass: 'badge-demo',
      title: 'SoloSafe Voyage (Trip Planner)',
      desc: 'Pre-plan unfamiliar trips with Meri Saheli RPF escort, live GPS corridor & parent monitoring.',
      link: '/solo-trip-planner'
    },
    // 5. Acoustic & Signal Stream
    {
      id: 'acoustic',
      category: 'Detect',
      icon: <FaVolumeUp />,
      badge: 'OFFLINE SHIELD',
      badgeClass: 'badge-simulated',
      title: 'Acoustic & Signal Stream',
      desc: 'Offline Emergency Survival Shield: loud rescue siren, police strobe, zero-data SMS, and passerby rescue QR bridge.',
      link: '/acoustic-signal'
    },
    // 6. Bystander Emergency Relay
    {
      id: 'relay',
      category: 'Protect',
      icon: <FaShieldAlt />,
      badge: 'OFFLINE BRIDGE',
      badgeClass: 'badge-simulated',
      title: 'Bystander Emergency Relay',
      desc: 'Zero-internet offline peer rescue relay and passerby distress beacon.',
      link: '/bystander-relay'
    },
    // 7. AI Guardian Call
    {
      id: 'guardian_call',
      category: 'Protect',
      icon: <FaPhoneAlt />,
      badge: 'DEMO',
      badgeClass: 'badge-demo',
      title: 'AI Guardian Call',
      desc: 'Try a companion-call flow; simulates a supportive voice check-in.',
      link: '/guardian-call'
    },
    // 8. Deepfake Forensics Lab
    {
      id: 'deepfake',
      category: 'Detect',
      icon: <FaUserShield />,
      badge: 'DEMO',
      badgeClass: 'badge-demo',
      title: 'Deepfake Forensics Lab',
      desc: 'Learn how manipulated media and fake profiles can be assessed safely.',
      link: '/deepfake-forensics'
    },
    // 9. Incident Timeline & Forensics
    {
      id: 'timeline',
      category: 'Follow up',
      icon: <FaCalendarAlt />,
      badge: 'AI FORENSICS',
      badgeClass: 'badge-verified',
      title: 'Incident Timeline & Forensics',
      desc: 'AI Chat Auto-Parser, Threat Escalation Radar & Section 63 BSA Evidence Certificate.',
      link: '/incident-timeline'
    },
    // 10. AI Cyber FIR & Legal Dossier
    {
      id: 'fir',
      category: 'Follow up',
      icon: <FaGavel />,
      badge: 'AI COUNSELOR',
      badgeClass: 'badge-simulated',
      title: 'AI Cyber FIR & Legal Dossier',
      desc: '24/7 AI Legal, Emotional & Cyber Counselor for women (BNS/IPC, Zero FIR & FIR Dossier).',
      link: '/cyber-fir-dossier'
    },
    // 11. Official Incident Reporting Desk
    {
      id: 'report_desk',
      category: 'Follow up',
      icon: <FaShieldAlt />,
      badge: 'OFFICIAL DESK',
      badgeClass: 'badge-demo',
      title: 'Official Incident Reporting Desk',
      desc: 'Anonymous safety logs and confidential incident reporting directly to local authorities.',
      link: '/report'
    },
    // 12. Anonymous Awareness Wall
    {
      id: 'awareness_hub',
      category: 'Protect',
      icon: <FaCheck />,
      badge: 'LIVE WALL',
      badgeClass: 'badge-demo',
      title: 'Anonymous Awareness Wall',
      desc: 'Share thoughts, safety awareness & community tips without exposing personal identity.',
      link: '/awareness-hub'
    },
    // 13. Route Intelligence & Reviews
    {
      id: 'route_reviews',
      category: 'Detect',
      icon: <FaMapMarkedAlt />,
      badge: 'RATINGS',
      badgeClass: 'badge-demo',
      title: 'Route Intelligence & Reviews',
      desc: 'Community comfort ratings, safety audits, and route condition intelligence.',
      link: '/route-intelligence'
    },
    // 14. HerHub Women Community Circle
    {
      id: 'community_feed',
      category: 'Understand',
      icon: <FaShieldAlt />,
      badge: 'PEER SUPPORT',
      badgeClass: 'badge-demo',
      title: 'HerHub Women Community Circle',
      desc: 'Join verified community conversations, route updates and peer support.',
      link: '/community'
    }
  ];

  /* const old_unused_tools = [
    {
      id: 'route_reviews',
      category: 'Detect',
      icon: <FaMapMarkedAlt />,
      badge: 'DEMO',
      badgeClass: 'badge-demo',
      title: 'Route Intelligence & Reviews',
      desc: 'Community comfort ratings, safety audits, and route condition intelligence.'
    },
    {
      id: 'route_dev',
      category: 'Defense',
      icon: <FaShieldAlt />,
      badge: 'LIVE AI',
      badgeClass: 'badge-live',
      title: 'Smart Defense Suite',
      desc: 'Hands-free AI voice distress sentinel & HerScan 360° AI vehicle inspection camera.'
    },
    {
      id: 'acoustic',
      category: 'Detect',
      icon: <FaVolumeUp />,

      badgeClass: 'badge-simulated',
      title: 'Acoustic & Signal Stream',
      badge: 'OFFLINE SHIELD',
      desc: 'Offline Emergency Survival Shield: loud rescue siren, police strobe, zero-data SMS, and passerby rescue QR bridge.'
    },
    {
      id: 'deepfake',
      category: 'Protect',
      icon: <FaUserShield />,
      badge: 'DEMO',
      badgeClass: 'badge-demo',
      title: 'Deepfake Forensics Lab',
      desc: 'Learn how manipulated media can be assessed safely.'
    },
    {
      id: 'saferoute',
      category: 'Protect',
      icon: <FaMapMarkedAlt />,

      badgeClass: 'badge-simulated',
      title: 'SafeRoute AI',
      badge: 'SAFE NAVIGATION',
      desc: 'Plan a journey with calm path guidance and travel preferences.'
    },
    {
      id: 'solo_voyage',
      category: 'Protect',
      icon: <FaTrain />,
      badge: 'LIVE GUARDIAN',
      badgeClass: 'badge-demo',
      title: 'SoloSafe Voyage (Trip Planner)',
      desc: 'Pre-plan unfamiliar trips with Meri Saheli RPF escort, live GPS corridor & parent monitoring.'
    },
    {
      id: 'guardian_call',
      category: 'Protect',
      icon: <FaPhoneAlt />,
      badge: 'DEMO',
      badgeClass: 'badge-demo',
      title: 'AI Guardian Call',
      desc: 'Try a companion-call flow; no real call is placed.'
    },
    {
      id: 'harassment_shield',
      category: 'Protect',
      icon: <FaShieldAlt />,
      badge: 'POLICE DETERRENT',
      badgeClass: 'badge-urgent',
      title: 'Street Harassment Shield',
      desc: '1-Tap Hindi police wireless dispatch alarm to scare away street harassers under BNS 79.'
    }
  ]; */

  const filteredTools = activeTab === 'All' 
    ? toolkitTools 
    : toolkitTools.filter(t => t.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="home-page-container">

      {/* ── ACTIVE CHECK-IN FLOATING BANNER (IF RUNNING) ── */}
      {false && (
        <div 
          style={{ 
            background: 'linear-gradient(135deg, #140E2D, #271B55)', 
            color: '#fff', 
            padding: '12px 20px',
            position: 'sticky',
            top: 61,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Active Check-In Timer:</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#D5CEFD' }}>00:00</span>
          </div>
          <button 
            onClick={() => {}}
            className="btn btn-sm btn-outline-light"
            style={{ borderRadius: 8, fontSize: '0.78rem' }}
          >
            I'm Safe (Cancel Timer)
          </button>
        </div>
      )}

      {/* ════════ HERO SECTION ════════ */}
      <section className="exact-hero">
        <div className="container">
          <div className="row align-items-center gy-5">

            {/* Left Content Column */}
            <div className="col-12 col-lg-6">
              <span className="hero-pill-tag">
                WOMEN SUPPORTING WOMEN · SINCE TODAY
              </span>

              <h1 className="exact-hero-h1">
                Safety feels<br />
                stronger when<br />
                <span className="highlight-purple">we stand<br />together.</span>
              </h1>

              <p className="hero-desc">
                Discover personal safety tools, digital protection resources, and a supportive
                community designed to help women make informed choices and feel more prepared.
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap align-items-center gap-3">
                <Link to="/safety-hub" className="btn-explore-tools text-decoration-none">
                  <span>Explore safety tools</span>
                  <span style={{ transform: 'rotate(45deg)', display: 'inline-block', fontSize: '0.8rem' }}>↑</span>
                </Link>
                
                <a href="#community" className="link-discover-community">
                  <span>Discover our community</span>
                  <FaArrowRight style={{ fontSize: '0.82rem' }} />
                </a>
              </div>

              {/* Private Guarantee */}
              <div className="private-guarantee">
                <div className="private-guarantee-icon">
                  <FaCheck />
                </div>
                <span>Private by design · Your choices stay yours</span>
              </div>

            </div>

            {/* Right Poster Artwork */}
            <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end" style={{ background: 'transparent' }}>
              <img 
                src="/empower-her.png" 
                alt="Empower Her" 
                className="img-fluid"
                style={{ 
                  borderRadius: 32, 
                  width: '100%', 
                  maxWidth: 560,
                  boxShadow: '0 25px 50px rgba(18, 16, 43, 0.12)',
                  display: 'block'
                }} 
              />
            </div>

          </div>
        </div>
      </section>

      {/* ════════ WHEN YOU NEED A NEXT STEP ════════ */}
      <section className="next-step-section">
        <div className="container">
          <div className="next-step-tag">WHEN YOU NEED A NEXT STEP</div>
          
          <div className="row g-3">
            
            {/* Card 1: 112 Emergency Help */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div 
                className="quick-action-card emergency-highlight"
                onClick={() => setActiveModal('emergency')}
              >
                <span className="badge-quick-num">112</span>
                <div>
                  <div className="quick-card-title">Emergency help</div>
                  <div className="quick-card-sub">See support numbers</div>
                </div>
                <span className="quick-card-arrow">↗</span>
              </div>
            </div>

            {/* Card 2: Start a check-in */}
            <div className="col-12 col-sm-6 col-lg-3">
              <Link 
                to="/anti-harassment"
                className="quick-action-card text-decoration-none"
              >
                <div className="badge-quick-icon">
                  <FaCheck style={{ fontSize: '0.8rem' }} />
                </div>
                <div>
                  <div className="quick-card-title">Harassment Shield</div>
                  <div className="quick-card-sub">Police wireless alarm</div>
                </div>
                <span className="quick-card-arrow">↗</span>
              </Link>
            </div>

            {/* Card 3: Explore SafeRoute */}
            <div className="col-12 col-sm-6 col-lg-3">
              <Link 
                to="/saferoute-ai"
                className="quick-action-card text-decoration-none"
              >
                <div className="badge-quick-icon">
                  ✦
                </div>
                <div>
                  <div className="quick-card-title">Explore SafeRoute</div>
                  <div className="quick-card-sub">Prepare for your journey</div>
                </div>
                <span className="quick-card-arrow">↗</span>
              </Link>
            </div>

            {/* Card 4: Report a concern */}
            <div className="col-12 col-sm-6 col-lg-3">
              <Link 
                to="/report"
                className="quick-action-card text-decoration-none"
              >
                <div className="badge-quick-icon">
                  !
                </div>
                <div>
                  <div className="quick-card-title">Report a concern</div>
                  <div className="quick-card-sub">Private by default</div>
                </div>
                <span className="quick-card-arrow">↗</span>
              </Link>
            </div>

          </div>

          {/* SoloSafe Voyage Highlight Banner */}
          <div 
            className="mt-4 p-3 rounded-4 d-flex flex-wrap align-items-center justify-content-between gap-3"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 85, 230, 0.12) 0%, rgba(224, 53, 119, 0.08) 100%)',
              border: '1px solid rgba(99, 85, 230, 0.25)'
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div 
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#6355E6',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}
              >
                <FaTrain />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#140E2D' }}>
                  SoloSafe Voyage: AI Solo Women Safe Trip Planner & Transit Guardian
                </div>
                <div style={{ fontSize: '0.84rem', color: '#5E5B7A' }}>
                  Traveling to an unfamiliar city? Pre-plan verified routes with Indian Railways 'Meri Saheli' RPF assistance, live GPS corridor geofencing & dual parent monitoring.
                </div>
              </div>
            </div>

            <Link 
              to="/solo-trip-planner"
              className="btn btn-sm d-flex align-items-center gap-2 text-decoration-none"
              style={{
                backgroundColor: '#6355E6',
                color: '#FFFFFF',
                fontWeight: 700,
                padding: '9px 18px',
                borderRadius: 10,
                boxShadow: '0 4px 14px rgba(99, 85, 230, 0.25)',
                whiteSpace: 'nowrap'
              }}
            >
              <span>Plan Safe Trip</span>
              <FaArrowRight style={{ fontSize: '0.8rem' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ YOUR TOOLKIT SECTION ════════ */}
      <section className="toolkit-section" id="toolkit">
        <div className="container">
          
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <div className="section-eyebrow">YOUR TOOLKIT</div>
              <h2 className="toolkit-header-title">Small steps. More confidence.</h2>
            </div>
            
            <Link 
              to="/safety-hub" 
              className="text-decoration-none d-flex align-items-center gap-2"
              style={{ color: '#6355E6', fontWeight: 600, fontSize: '0.92rem' }}
            >
              <span>View all tools</span>
              <FaArrowRight style={{ fontSize: '0.8rem' }} />
            </Link>
          </div>

          {/* Category Tabs */}
          <div className="toolkit-tabs">
            {['All', 'Detect', 'Protect', 'Understand', 'Follow up'].map((tab) => (
              <button
                key={tab}
                className={`toolkit-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <span style={{ fontSize: '0.65rem' }}>●</span>
                <span>{tab}</span>
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="row g-4">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="col-12 col-md-6 col-lg-4">
                <div className="toolkit-card">
                  
                  <div className="tool-card-top">
                    <div className="tool-icon-circle">
                      {tool.icon}
                    </div>
                    <span className={`tool-badge ${tool.badgeClass}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="tool-title">{tool.title}</h3>
                  <p className="tool-desc">{tool.desc}</p>

                  {tool.link ? (
                    <Link to={tool.link} className="tool-link text-decoration-none" style={tool.id === 'harassment_shield' ? { color: '#EF4444', fontWeight: 800 } : {}}>
                      <span>{tool.id === 'harassment_shield' ? '🚨 Launch Police Alarm' : 'Open feature'}</span>
                      <span>↗</span>
                    </Link>
                  ) : false ? (
                    <Link to="/saferoute-ai" className="tool-link text-decoration-none">
                      <span>Open feature</span>
                      <span>↗</span>
                    </Link>
                  ) : tool.id === 'route_reviews' ? (
                    <Link to="/route-intelligence" className="tool-link text-decoration-none">
                      <span>Open feature</span>
                      <span>↗</span>
                    </Link>
                  ) : tool.id === 'route_dev' ? (
                    <Link to="/route-deviation" className="tool-link text-decoration-none">
                      <span>Open feature</span>
                      <span>↗</span>
                    </Link>
                  ) : tool.id === 'acoustic' ? (
                    <Link to="/acoustic-signal" className="tool-link text-decoration-none">
                      <span>Open feature</span>
                      <span>↗</span>
                    </Link>
                  ) : tool.id === 'deepfake' ? (
                    <Link to="/deepfake-forensics" className="tool-link text-decoration-none">
                      <span>Open feature</span>
                      <span>↗</span>
                    </Link>
                  ) : tool.id === 'solo_voyage' ? (
                    <Link to="/solo-trip-planner" className="tool-link text-decoration-none">
                      <span>Open feature</span>
                      <span>↗</span>
                    </Link>
                  ) : tool.id === 'guardian_call' ? (
                    <Link to="/guardian-call" className="tool-link text-decoration-none">
                      <span>Open feature</span>
                      <span>↗</span>
                    </Link>
                  ) : tool.id === 'harassment_shield' ? (
                    <Link to="/anti-harassment" className="tool-link text-decoration-none" style={{ color: '#EF4444', fontWeight: 800 }}>
                      <span>🚨 Launch Police Alarm</span>
                      <span>↗</span>
                    </Link>
                  ) : tool.id === 'whatif' ? (
                    <Link to="/safety-hub" className="tool-link text-decoration-none">
                      <span>Open feature</span>
                      <span>↗</span>
                    </Link>
                  ) : tool.id === 'threat_graph' ? (
                    <Link to="/deepfake-forensics" className="tool-link text-decoration-none">
                      <span>Open feature</span>
                      <span>↗</span>
                    </Link>
                  ) : tool.id === 'fir' ? (
                    <Link to="/cyber-fir-dossier" className="tool-link text-decoration-none">
                      <span>Open feature</span>
                      <span>↗</span>
                    </Link>
                  ) : tool.id === 'timeline' ? (
                    <Link to="/incident-timeline" className="tool-link text-decoration-none">
                      <span>Open feature</span>
                      <span>↗</span>
                    </Link>
                  ) : (
                    <button 
                      className="tool-link"
                      onClick={() => setActiveModal(tool.id)}
                    >
                      <span>Open feature</span>
                      <span>↗</span>
                    </button>
                  )}

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════ THE LEARNING CIRCLE (Dark Banner) ════════ */}
      <section className="container" id="learning">
        <div className="learning-circle-banner">
          <div className="row align-items-center gy-5">
            
            {/* Left Content */}
            <div className="col-12 col-lg-6">
              <span className="lc-tag">THE LEARNING CIRCLE</span>
              <h2 className="lc-title">You're never alone in learning to stay safer.</h2>
              <p className="lc-desc">
                From fake profiles to cyber fraud, find clear language and practical
                next steps without fear-mongering or judgment.
              </p>

              <Link 
                to="/report"
                className="btn-community-pulse text-decoration-none"
              >
                <span>Visit community pulse</span>
                <span>↗</span>
              </Link>
            </div>

            {/* Right Pillars List */}
            <div className="col-12 col-lg-6">
              <div className="lc-divider">
                
                <div className="lc-item">
                  <div className="lc-num">01</div>
                  <div>
                    <div className="lc-item-title">Digital boundaries</div>
                    <div className="lc-item-sub">Privacy, account security and control</div>
                  </div>
                </div>

                <div className="lc-item">
                  <div className="lc-num">02</div>
                  <div>
                    <div className="lc-item-title">Spotting manipulation</div>
                    <div className="lc-item-sub">Fake profiles, deepfakes and coercion</div>
                  </div>
                </div>

                <div className="lc-item">
                  <div className="lc-num">03</div>
                  <div>
                    <div className="lc-item-title">Support that respects you</div>
                    <div className="lc-item-sub">Resources, reports and next steps</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════ URGENT SUPPORT NUMBERS ════════ */}
      <section className="urgent-support-section" id="community">
        <div className="container">
          <div className="row align-items-center gy-4">

            {/* Left Header */}
            <div className="col-12 col-lg-6">
              <span className="urgent-tag">IF YOU NEED URGENT SUPPORT</span>
              <h2 className="urgent-title">Keep these numbers close.</h2>
              <p className="urgent-desc">
                Tap to call only when you choose. HERHUB never calls or messages
                anyone automatically.
              </p>
            </div>

            {/* Right Number Cards */}
            <div className="col-12 col-lg-6">
              
              <a href="tel:112" className="urgent-num-card">
                <span className="urgent-dial-num">112</span>
                <span className="urgent-dial-title">Emergency response support</span>
              </a>

              <a href="tel:1090" className="urgent-num-card">
                <span className="urgent-dial-num">1090</span>
                <span className="urgent-dial-title">Women Power Line · Uttar Pradesh</span>
              </a>

              <a href="tel:1930" className="urgent-num-card">
                <span className="urgent-dial-num">1930</span>
                <span className="urgent-dial-title">Cyber fraud reporting</span>
              </a>

            </div>

          </div>
        </div>
      </section>

      {/* ════════ ABOUT US / MISSION SECTION (id="about") ════════ */}
      <section className="py-5 about-mission-section" id="about" style={{ borderTop: '1px solid #ECECF2' }}>
        <div className="container py-4">
          <div className="row align-items-center gy-4">
            <div className="col-12 col-lg-7">
              <span style={{ color: '#6355E6', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase' }}>
                ABOUT OUR MISSION
              </span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#160D33', margin: '8px 0 14px' }}>
                Empowering women through calm, privacy-first technology.
              </h2>
              <p style={{ color: '#65607E', fontSize: '0.98rem', lineHeight: 1.65, marginBottom: 20 }}>
                HERHUB replaces fear-based alerts with proactive preparation, community intelligence, and transparent AI tools. We never track your movement in the background or sell your data.
              </p>
              <Link 
                to="/about" 
                className="d-inline-flex align-items-center gap-2 text-decoration-none"
                style={{ color: '#6355E6', fontWeight: 700, fontSize: '0.95rem' }}
              >
                <span>Read our full mission & legal guidelines</span>
                <span>→</span>
              </Link>
            </div>

            <div className="col-12 col-lg-5">
              <div className="p-4 rounded-4 about-checklist-card" style={{ backgroundColor: '#F8F7FD', border: '1px solid #ECE7FD' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#6355E6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaCheck />
                  </div>
                  <div>
                    <strong style={{ color: '#160D33', fontSize: '0.94rem', display: 'block' }}>Zero Background Surveillance</strong>
                    <small className="text-muted">Tools activate only when you choose.</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#6355E6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaCheck />
                  </div>
                  <div>
                    <strong style={{ color: '#160D33', fontSize: '0.94rem', display: 'block' }}>Explainable Artificial Intelligence</strong>
                    <small className="text-muted">Clear reasoning, zero black-box confusion.</small>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#6355E6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaCheck />
                  </div>
                  <div>
                    <strong style={{ color: '#160D33', fontSize: '0.94rem', display: 'block' }}>24/7 Verified Helplines</strong>
                    <small className="text-muted">Direct links to 112, 1090, 1930 & NCW.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ MODALS FOR INTERACTIVE FEATURES ════════ */}
      {activeModal && (
        <div className="custom-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="custom-modal-card" onClick={e => e.stopPropagation()}>
            
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              style={{ position: 'absolute', top: 22, right: 24, background: 'none', border: 'none', fontSize: '1.2rem', color: '#8E8BA7', cursor: 'pointer' }}
            >
              <FaTimes />
            </button>

            {/* Modal 1: Check-in Personal Timer disabled
            {false && (
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="badge-quick-icon"><FaClock /></div>
                  <h4 style={{ fontWeight: 800, margin: 0 }}>Start a Check-in</h4>
                </div>
                <p style={{ color: '#555271', fontSize: '0.9rem', marginBottom: 24 }}>
                  Set a private countdown before starting your commute. If you don't check in by the end of the timer, HerHub can alert your trusted contacts.
                </p>

                <div className="d-flex gap-2 mb-4">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setCheckInMinutes(mins)}
                      className="btn flex-grow-1 py-2"
                      style={{
                        borderRadius: 12,
                        fontWeight: 700,
                        border: checkInMinutes === mins ? '2px solid #6355E6' : '1px solid #E9E7F2',
                        background: checkInMinutes === mins ? '#F0EDFE' : '#FFFFFF',
                        color: checkInMinutes === mins ? '#6355E6' : '#555271'
                      }}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>

                <div className="p-3 mb-4 rounded-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.82rem', color: '#64748B' }}>
                  🔒 <strong>Private by default:</strong> Your location is only saved locally on your phone unless a distress signal is triggered.
                </div>

                <button 
                  className="btn-explore-tools w-100 justify-content-center py-3"
                  onClick={() => startCheckIn(checkInMinutes)}
                >
                  Start 15-Minute Check-in
                </button>
              </div>
            )}

            */} {/* Modal 2: Emergency Numbers */}
            {activeModal === 'emergency' && (
              <div>
                <h4 style={{ fontWeight: 800, marginBottom: 8 }}>Emergency Support Numbers</h4>
                <p style={{ color: '#555271', fontSize: '0.88rem', marginBottom: 20 }}>
                  Direct emergency hotlines for India. Tap to dial directly.
                </p>
                <div className="d-flex flex-column gap-2 mb-4">
                  {[
                    { num: '112', label: 'National Emergency Help', badge: 'Police / Med / Fire' },
                    { num: '1090', label: 'Women Power Line', badge: 'Harassment & Safety' },
                    { num: '1091', label: 'Women In Distress Helpline', badge: '24/7 National' },
                    { num: '1930', label: 'National Cyber Financial Crime', badge: 'Digital Fraud' }
                  ].map(h => (
                    <a 
                      key={h.num} 
                      href={`tel:${h.num}`} 
                      className="p-3 border rounded-3 d-flex align-items-center justify-content-between text-decoration-none"
                      style={{ borderColor: '#E9E7F2' }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#12102B' }}>{h.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#716E8C' }}>{h.badge}</div>
                      </div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#EF4444' }}>{h.num}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Modal 3: Explainable Risk Indicator disabled
            {false && (
              <div>
                <span className="tool-badge badge-demo mb-2 d-inline-block">DEMO</span>
                <h4 style={{ fontWeight: 800, marginBottom: 8 }}>Explainable Risk Indicator</h4>
                <p style={{ color: '#555271', fontSize: '0.88rem', marginBottom: 20 }}>
                  Evaluate your current commute environment with an objective checklist without panic or fear-mongering.
                </p>

                <div className="d-flex flex-column gap-3 mb-4">
                  {[
                    { key: 'lighting', label: 'Is the street or transit stop poorly lit?' },
                    { key: 'deserted', label: 'Are there very few open shops or people nearby?' },
                    { key: 'transit', label: 'Is your cab or auto deviating from the usual path?' },
                    { key: 'uncomfortable', label: 'Does someone’s behavior make you feel uncomfortable?' }
                  ].map(item => (
                    <label 
                      key={item.key} 
                      className="p-3 border rounded-3 d-flex align-items-center gap-3 cursor-pointer"
                      style={{ 
                        borderColor: riskChecked[item.key] ? '#D5CEFD' : '#E9E7F2',
                        background: riskChecked[item.key] ? '#F0EDFE' : '#FFFFFF'
                      }}
                    >
                      <input 
                        type="checkbox"
                        checked={riskChecked[item.key]}
                        onChange={(e) => setRiskChecked({ ...riskChecked, [item.key]: e.target.checked })}
                        style={{ accentColor: '#6355E6', width: 18, height: 18 }}
                      />
                      <span style={{ fontSize: '0.88rem', color: '#12102B', fontWeight: 500 }}>{item.label}</span>
                    </label>
                  ))}
                </div>

                <div className="p-3 rounded-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#12102B', marginBottom: 4 }}>
                    Suggested Preparedness Action:
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#555271' }}>
                    {Object.values(riskChecked).filter(Boolean).length === 0 && "Your indicators look calm. Enjoy your commute while keeping general situational awareness."}
                    {Object.values(riskChecked).filter(Boolean).length >= 1 && Object.values(riskChecked).filter(Boolean).length <= 2 && "Moderate awareness recommended: Keep one ear free from headphones, initiate a 15-min HerHub Check-in, and share your live route with a contact."}
                    {Object.values(riskChecked).filter(Boolean).length > 2 && "Heightened preparedness: Switch to a busier street, consider triggering a simulated AI Guardian Call, or prepare the 112 emergency speed dial."}
                  </div>
                </div>

                <button 
                  className="btn-explore-tools w-100 justify-content-center"
                  onClick={() => setActiveModal(null)}
                >
                  Done Reflection
                </button>
              </div>
            )}

            */} {/* Modal 4: Route Deviation Tracker */}
            {activeModal === 'route_dev' && (
              <div>
                <span className="tool-badge badge-simulated mb-2 d-inline-block">SIMULATED</span>
                <h4 style={{ fontWeight: 800, marginBottom: 8 }}>Smart Defense Suite: Voice, Vision & Offline SOS</h4>
                <p style={{ color: '#555271', fontSize: '0.88rem', marginBottom: 20 }}>
                  Simulated demonstration of how gentle corridor monitoring detects unexpected detours without annoying false alarms.
                </p>

                <div 
                  className="p-4 rounded-3 text-center mb-4" 
                  style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <div style={{ color: '#6355E6', fontSize: '2rem', marginBottom: 8 }}>📍 ⤹ 🚩</div>
                  <div style={{ fontWeight: 700, color: '#12102B', fontSize: '0.92rem' }}>Fictional Journey: Metro Stn → Home</div>
                  <div style={{ color: '#10B981', fontSize: '0.82rem', marginTop: 4 }}>● Active Route: 94% on planned corridor</div>
                  <div style={{ color: '#64748B', fontSize: '0.78rem', marginTop: 8 }}>
                    Sample notification: <em>"Vehicle turned into 4th cross lane. Confirming route change with passenger..."</em>
                  </div>
                </div>

                <button 
                  className="btn-explore-tools w-100 justify-content-center"
                  onClick={() => setActiveModal(null)}
                >
                  Close Simulation
                </button>
              </div>
            )}

            {/* Modal 5: AI Guardian Call */}
            {activeModal === 'guardian_call' && (
              <div>
                <span className="tool-badge badge-demo mb-2 d-inline-block">DEMO</span>
                <h4 style={{ fontWeight: 800, marginBottom: 8 }}>AI Guardian Call</h4>
                <p style={{ color: '#555271', fontSize: '0.88rem', marginBottom: 20 }}>
                  A realistic simulated call flow designed to give you a discreet excuse to exit awkward conversations. No real phone call is dialed.
                </p>

                {!callActive ? (
                  <div className="text-center py-4">
                    <div 
                      style={{ 
                        width: 80, height: 80, borderRadius: '50%', background: '#F0EDFE', color: '#6355E6',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                        margin: '0 auto 20px'
                      }}
                    >
                      <FaPhoneAlt />
                    </div>
                    <button 
                      className="btn-explore-tools px-4 py-3"
                      onClick={() => setCallActive(true)}
                    >
                      Trigger Simulated Call Now
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <div style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1 }}>CALL IN PROGRESS</div>
                    <h3 style={{ fontWeight: 800, marginTop: 6 }}>Guardian Companion</h3>
                    <div style={{ color: '#6355E6', fontWeight: 700, fontSize: '1.2rem', marginBottom: 20 }}>
                      00:{callTimer < 10 ? `0${callTimer}` : callTimer}
                    </div>

                    <div className="p-3 rounded-3 text-start mb-4" style={{ background: '#F0EDFE', color: '#5244D4', fontSize: '0.88rem' }}>
                      <em>"Hey, I see you're walking down Main St. I'm right outside waiting for you by the lobby gate. See you in a minute!"</em>
                    </div>

                    <button 
                      className="btn btn-danger px-4 py-2"
                      style={{ borderRadius: 12, fontWeight: 700 }}
                      onClick={() => setCallActive(false)}
                    >
                      End Call
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Modal 6: SafeRoute AI */}
            {activeModal === 'saferoute' && (
              <div>
                <span className="tool-badge badge-simulated mb-2 d-inline-block">SIMULATED</span>
                <h4 style={{ fontWeight: 800, marginBottom: 8 }}>SafeRoute AI Planner</h4>
                <p style={{ color: '#555271', fontSize: '0.88rem', marginBottom: 20 }}>
                  Select route preferences prioritized for lighting, open convenience stores, and active public transit presence.
                </p>

                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="p-3 border rounded-3">
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Route A: Well-lit Market Avenue (Recommended)</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>14 min walk · 12 open vendors · High street illumination</div>
                  </div>
                  <div className="p-3 border rounded-3">
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Route B: Shortest Alley Path</div>
                    <div style={{ fontSize: '0.8rem', color: '#EF4444' }}>9 min walk · Low lighting · Deserted after 9 PM</div>
                  </div>
                </div>

                <button 
                  className="btn-explore-tools w-100 justify-content-center"
                  onClick={() => setActiveModal(null)}
                >
                  Confirm Safe Route
                </button>
              </div>
            )}

            {/* Modal 7: Deepfake Forensics */}
            {activeModal === 'deepfake' && (
              <div>
                <span className="tool-badge badge-demo mb-2 d-inline-block">DEMO</span>
                <h4 style={{ fontWeight: 800, marginBottom: 8 }}>Deepfake Forensics Lab</h4>
                <p style={{ color: '#555271', fontSize: '0.88rem', marginBottom: 20 }}>
                  Educational insights on how AI-manipulated photos, synthetic voice clones, and fake extortion accounts can be spotted and reported.
                </p>
                <div className="p-3 rounded-3 mb-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#555271', lineHeight: 1.6 }}>
                  1. <strong>Blinking & Gaze:</strong> Early deepfakes often exhibit unnatural blink frequencies or misaligned iris reflections.<br />
                  2. <strong>Audio Inconsistencies:</strong> AI voice clones often lack micro-breathing pauses and natural cadence variations.<br />
                  3. <strong>Immediate Action:</strong> Do not pay blackmail or ransom. Report to 1930 (Cyber Fraud Helpline) or cybercrime.gov.in immediately.
                </div>
                <button className="btn-explore-tools w-100 justify-content-center" onClick={() => setActiveModal(null)}>
                  Close Educational Guide
                </button>
              </div>
            )}

            {/* Modal 8: Acoustic & Signal */}
            {activeModal === 'acoustic' && (
              <div>
                <span className="tool-badge badge-simulated mb-2 d-inline-block">SIMULATED</span>
                <h4 style={{ fontWeight: 800, marginBottom: 8 }}>Acoustic & Signal Stream</h4>
                <p style={{ color: '#555271', fontSize: '0.88rem', marginBottom: 20 }}>
                  Sample timeline telemetry illustrating how volume fluctuations are interpreted privately on-device without continuous audio recording.
                </p>
                <div className="p-4 rounded-3 text-center mb-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '1.8rem', color: '#6355E6', marginBottom: 8 }}> ▂▃▅▇▅▃▂ </div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Ambient Audio Level: 42 dB (Normal Street Noise)</div>
                  <div style={{ color: '#10B981', fontSize: '0.8rem', marginTop: 4 }}>No sudden distress spikes detected</div>
                </div>
                <button className="btn-explore-tools w-100 justify-content-center" onClick={() => setActiveModal(null)}>
                  Close Demonstration
                </button>
              </div>
            )}

            {/* Modal 9: Report a Concern */}
            {activeModal === 'report' && (
              <div>
                <h4 style={{ fontWeight: 800, marginBottom: 8 }}>Report a Concern</h4>
                <p style={{ color: '#555271', fontSize: '0.88rem', marginBottom: 20 }}>
                  Private by default. Your feedback helps warn other women in the community.
                </p>
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Location / Landmark</label>
                  <input type="text" className="form-control" placeholder="e.g. Metro gate 2, Connaught Place" />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Observation</label>
                  <select className="form-select">
                    <option>Poor street lighting</option>
                    <option>Unregulated parking / deserted corner</option>
                    <option>Inappropriate harassment incident</option>
                    <option>Other safety concern</option>
                  </select>
                </div>
                <button 
                  className="btn-explore-tools w-100 justify-content-center mt-3"
                  onClick={() => { alert('Thank you. Your feedback has been safely logged.'); setActiveModal(null); }}
                >
                  Submit Anonymous Log
                </button>
              </div>
            )}

            {/* Modal 10: Learning Pulse */}
            {activeModal === 'learning_pulse' && (
              <div>
                <span className="lc-tag mb-2 d-inline-block">THE LEARNING CIRCLE</span>
                <h4 style={{ fontWeight: 800, marginBottom: 8 }}>Community Pulse & Safety Guides</h4>
                <p style={{ color: '#555271', fontSize: '0.88rem', marginBottom: 20 }}>
                  Practical, judgment-free resources for navigating everyday digital and physical safety.
                </p>
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="p-3 border rounded-3">
                    <div style={{ fontWeight: 700 }}>Instagram & WhatsApp Privacy Lockdowns</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Step-by-step checklist to prevent phone number leaks and stalker access.</div>
                  </div>
                  <div className="p-3 border rounded-3">
                    <div style={{ fontWeight: 700 }}>Cab Safety Protocols for Late Shifts</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Verification routines and emergency exit strategies.</div>
                  </div>
                </div>
                <button className="btn-explore-tools w-100 justify-content-center" onClick={() => setActiveModal(null)}>
                  Close
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ===================================================================
          🚨 ZERO-CLICK EMERGENCY DISTRESS OVERLAY (TRIPLE-TAP / SHAKE)
      =================================================================== */}
      {gestureAlertActive && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 6, 28, 0.94)',
            backdropFilter: 'blur(16px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div 
              style={{
                backgroundColor: '#1E1238',
                borderRadius: 24,
                border: '3px solid #EF4444',
                boxShadow: '0 0 60px rgba(239, 68, 68, 0.45)',
                maxWidth: 520,
                width: '100%',
                padding: '30px',
                color: '#FFFFFF'
              }}
            >
              {/* HEADER BADGE */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span 
                  className="badge px-3 py-2 d-inline-flex align-items-center gap-2"
                  style={{ backgroundColor: '#EF4444', color: '#FFFFFF', fontSize: '0.76rem', fontWeight: 900, letterSpacing: '0.6px' }}
                >
                  <FaExclamationTriangle /> ZERO-CLICK GESTURE SOS ACTIVE
                </span>
                <span style={{ fontSize: '0.75rem', color: '#FCA5A5' }}>
                  {triggerSource}
                </span>
              </div>

              {/* COUNTDOWN STATE */}
              {countdown > 0 ? (
                <div className="text-center py-3">
                  <div 
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: '50%',
                      border: '4px solid #EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.8rem',
                      fontWeight: 900,
                      color: '#EF4444',
                      margin: '0 auto 16px',
                      boxShadow: '0 0 25px rgba(239, 68, 68, 0.6)'
                    }}
                  >
                    {countdown}
                  </div>
                  <h4 style={{ fontWeight: 800, marginBottom: 6 }}>
                    Emergency Dispatch in {countdown}s
                  </h4>
                  <p style={{ color: '#CBD5E1', fontSize: '0.85rem', marginBottom: 24 }}>
                    Triple-tap or shake detected! Live coordinates & police dispatch will deploy automatically.
                  </p>

                  <button 
                    type="button"
                    onClick={dismissGestureEmergency}
                    className="btn btn-outline-light px-4 py-2"
                    style={{ borderRadius: 12, fontWeight: 700, fontSize: '0.86rem' }}
                  >
                    ✕ False Alarm? Cancel Immediate Dispatch
                  </button>
                </div>
              ) : (
                /* LIVE DEPLOYED EMERGENCY RESCUE STATE */
                <div>
                  <div className="text-center mb-4">
                    <div 
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        border: '2px solid #EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#EF4444',
                        fontSize: '2rem',
                        margin: '0 auto 12px'
                      }}
                    >
                      <FaBell />
                    </div>
                    <h4 style={{ fontWeight: 900, color: '#F87171', margin: 0 }}>
                      🚨 National Emergency Mode Deployed
                    </h4>
                    <small style={{ color: '#94A3B8' }}>{locationStatus}</small>
                  </div>

                  {/* GPS TELEMETRY BOX */}
                  <div 
                    className="p-3 rounded-3 mb-3"
                    style={{ backgroundColor: '#130A24', border: '1px solid #3B2A63' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span style={{ fontSize: '0.74rem', color: '#A5B4FC', fontWeight: 700 }}>
                        📍 Live GPS Pin Broadcast:
                      </span>
                      <span className="badge bg-success bg-opacity-25 text-success border border-success" style={{ fontSize: '0.68rem' }}>
                        Live Satellite Lock
                      </span>
                    </div>
                    <code style={{ fontSize: '0.82rem', color: '#F8FAFC', display: 'block', marginBottom: 6 }}>
                      Lat: {gpsCoords?.lat || '28.6139'}, Lng: {gpsCoords?.lng || '77.2090'} (Delhi NCR)
                    </code>
                    <a
                      href={`https://maps.google.com/?q=${gpsCoords?.lat || '28.6139'},${gpsCoords?.lng || '77.2090'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                      style={{ fontSize: '0.74rem', color: '#6EE7B7' }}
                    >
                      🗺️ Open GPS Map Location →
                    </a>
                  </div>

                  {/* AUTO LAUNCH NOTIFICATION BADGE */}
                  <div className="mb-3 p-2 rounded-3 text-center" style={{ backgroundColor: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366' }}>
                    <div style={{ fontSize: '0.78rem', color: '#86EFAC', fontWeight: 800 }}>
                      ⚡ WhatsApp Auto-Launched to: {emergencyPhone}
                    </div>
                    <small style={{ color: '#E2E8F0', fontSize: '0.7rem' }}>
                      (GPS location & SOS message prefilled automatically)
                    </small>
                  </div>

                  {/* 3 HIGH IMPACT ACTION BUTTONS */}
                  <div className="d-flex flex-column gap-2 mb-4">
                    {/* 1. WHATSAPP SOS */}
                    <a
                      href={`https://api.whatsapp.com/send?phone=${(emergencyPhone.replace(/[^0-9]/g, '').length === 10 ? '91' + emergencyPhone.replace(/[^0-9]/g, '') : emergencyPhone.replace(/[^0-9]/g, ''))}&text=${encodeURIComponent(
                        `🚨 EMERGENCY SOS DISTRESS! I need immediate help! My real-time live GPS coordinates: https://maps.google.com/?q=${gpsCoords?.lat || '28.6139'},${gpsCoords?.lng || '77.2090'} - Sent via HERHUB Zero-Click Gesture Sentinel.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn py-3 d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                      style={{ backgroundColor: '#25D366', color: '#FFFFFF', borderRadius: 14, fontWeight: 900, fontSize: '0.92rem' }}
                    >
                      <FaWhatsapp style={{ fontSize: '1.2rem' }} />
                      Launch WhatsApp (If Not Opened Automatically)
                    </a>

                    {/* 2. CALL POLICE 112 */}
                    <a
                      href="tel:112"
                      className="btn py-3 d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                      style={{ backgroundColor: '#EF4444', color: '#FFFFFF', borderRadius: 14, fontWeight: 900, fontSize: '0.92rem' }}
                    >
                      <FaPhoneAlt />
                      Call Police 112 Instantly
                    </a>

                    {/* 3. SIREN TOGGLE */}
                    <button
                      type="button"
                      onClick={sirenActive ? stopRescueSiren : startRescueSiren}
                      className="btn btn-sm btn-outline-warning w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                      style={{ borderRadius: 10, fontSize: '0.78rem', fontWeight: 700 }}
                    >
                      {sirenActive ? <FaVolumeMute /> : <FaVolumeUp />}
                      {sirenActive ? 'Mute 105dB Strobe Siren' : 'Sound 105dB Rescue Siren'}
                    </button>
                  </div>

                  {/* DISMISS / CANCEL BUTTON */}
                  <button
                    type="button"
                    onClick={dismissGestureEmergency}
                    className="btn btn-outline-light w-100 py-2"
                    style={{ borderRadius: 12, fontSize: '0.8rem', color: '#94A3B8', borderColor: '#334155' }}
                  >
                    ✕ Dismiss / I am Safe
                  </button>
                </div>
              )}
            </div>
        </div>
      )}
    </div>
  );
}

export default Home;
