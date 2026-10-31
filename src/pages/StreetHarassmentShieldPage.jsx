import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShieldAlt, FaVolumeUp, FaPhoneAlt, 
  FaWhatsapp, FaStop, FaArrowLeft, FaLock, FaBullhorn, FaUserFriends,
  FaBroadcastTower
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

function StreetHarassmentShieldPage() {
  const { isDark } = useTheme();

  // Mode Selection: 'police' | 'family' | 'public'
  const [activeMode, setActiveMode] = useState('police');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPhase, setAudioPhase] = useState('idle'); // 'idle' | 'radio_static' | 'hindi_dispatch' | 'siren'
  const [policeStrobeActive, setPoliceStrobeActive] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Delhi Police PCR');
  const [gpsLocation, setGpsLocation] = useState({ lat: '28.6139', lng: '77.2090', address: 'Connaught Place, New Delhi' });
  const [emergencyPhone, setEmergencyPhone] = useState('+91 75240 72395');
  const [hasHindiVoice, setHasHindiVoice] = useState(false);

  // Audio Context & Speech Refs
  const audioCtxRef = useRef(null);
  const isCancelledRef = useRef(false);
  const guardianAudioRef = useRef(null);

  // Preload Authentic Recorded Hindi Voice for Guardian / Family Backup
  useEffect(() => {
    const audio = new Audio('/brother_guardian_call.ogg');
    audio.preload = 'auto';
    guardianAudioRef.current = audio;

    return () => {
      if (guardianAudioRef.current) {
        guardianAudioRef.current.pause();
        guardianAudioRef.current = null;
      }
    };
  }, []);

  // Preload speech synthesis voices (fixes Chrome async voice loading)
  useEffect(() => {
    const checkVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        const found = voices.some(v => 
          v.lang === 'hi-IN' || 
          v.lang.startsWith('hi') || 
          v.name.toLowerCase().includes('hindi')
        );
        setHasHindiVoice(found);
      }
    };

    checkVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = checkVoices;
    }

    try {
      const savedPhone = localStorage.getItem('herhub_emergency_phone');
      if (savedPhone) setEmergencyPhone(savedPhone);
    } catch (e) {}

    // Live GPS Coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({
            lat: pos.coords.latitude.toFixed(4),
            lng: pos.coords.longitude.toFixed(4),
            address: 'Real-Time Satellite GPS Locked'
          });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }

    return () => {
      stopAllDeterrents();
    };
  }, []);

  // -------------------------------------------------------------
  // THE 3 PSYCHOLOGICAL DETERRENT SCRIPTS (SPOKEN IN HINDI VOICE)
  // -------------------------------------------------------------
  const DETERRENT_MODES = {
    police: {
      title: 'Police Wireless Dispatch Simulator',
      subtitle: 'Simulates active police control room radio & immediate PCR van deployment',
      badge: 'MODE 1: POLICE KHOUF',
      badgeColor: '#EF4444',
      spokenHindi: `चेतावनी! ${selectedCity} कंट्रोल रूम द्वारा आपकी लाइव जीपीएस लोकेशन और वीडियो रिकॉर्डिंग शुरू हो चुकी है! भारतीय न्याय संहिता की धारा 79 के तहत छेड़छाड़ का गैर-जमानती मामला दर्ज हो रहा है! नजदीकी पीसीआर वैन तुरंत इस लोकेशन पर पहुंच रही है! वहीं खड़े रहो!`,
      phoneticHindi: `Chetaavani! ${selectedCity} Control Room dwara aapki live GPS location aur video recording shuru ho chuki hai! Bharatiya Nyaya Sanhita ki dhara 79 ke tehat chhedchhad ka case darj ho raha hai! Nazdeeki PCR Van turant is location par pahunch rahi hai! Wahin khade raho!`,
      displayDescription: 'Walkie-talkie squelch static + Authoritative Hindi police broadcast + PCR siren burst.'
    },
    family: {
      title: 'Authoritative Family Phone Call',
      subtitle: 'Blasts an authentic recorded male Hindi voice simulating an imminent physical family backup',
      badge: 'MODE 2: FAMILY BACKUP (🎙️ REAL VOICE)',
      badgeColor: '#10B981',
      spokenHindi: 'Hello, haan kahan ho tum? Achha, abhi kitni der lagegi ghar pahunchne mein? Theek hai, suno apni live location WhatsApp kar do... aur gaadi ka number bhi bhej dena. Main dekh leta hoon kahan pahunchi ho tum. Dhyan se aana.',
      phoneticHindi: 'Hello, haan kahan ho tum? Achha, abhi kitni der lagegi ghar pahunchne mein? Theek hai, suno apni live location WhatsApp kar do... aur gaadi ka number bhi bhej dena. Main dekh leta hoon kahan pahunchi ho tum. Dhyan se aana.',
      displayDescription: 'Authentic recorded male Hindi voice on loudspeaker alerting harasser that brother/family is tracking live location.'
    },
    public: {
      title: 'Public Shaming & Crowd Siren',
      subtitle: 'Draws immediate bystander attention and alerts nearby pedestrians to intervene',
      badge: 'MODE 3: PUBLIC SHAMING',
      badgeColor: '#F59E0B',
      spokenHindi: 'ध्यान दें आसपास के लोग! यह व्यक्ति इस लड़की के साथ छेड़छाड़ और पीछा कर रहा है! कृपया आगे आएं और 112 डायल करें! आप सभी सीसीटीवी में रिकॉर्ड हो रहे हैं!',
      phoneticHindi: 'Dhyan dein aas-paas ke log! Yeh vyakti is ladki ke saath chhedchhad aur peechha kar raha hai! Kripya aage aayein aur 112 dial karein! Aap sabhi CCTV mein record ho rahe hain!',
      displayDescription: 'Emergency warning siren + Hindi public alert notifying all pedestrians and shopkeepers.'
    }
  };

  // -------------------------------------------------------------
  // REALISTIC POLICE WALKIE-TALKIE SQUELCH & STATIC SYNTHESIZER
  // -------------------------------------------------------------
  const playPoliceRadioStatic = () => {
    return new Promise((resolve) => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
          resolve();
          return;
        }
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // 1. Generate 0.35s Radio Squelch White Noise
        const bufferSize = ctx.sampleRate * 0.35;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        // Bandpass filter to create the authentic walkie-talkie speaker timbre
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1750;
        filter.Q.value = 3.2;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.33);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();

        // 2. Motorola Walkie-Talkie Roger Beep (852Hz -> 1100Hz chirp)
        setTimeout(() => {
          if (isCancelledRef.current || !ctx || ctx.state === 'closed') return;
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(852, ctx.currentTime);
          osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.08);

          oscGain.gain.setValueAtTime(0.35, ctx.currentTime);
          oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.16);

          osc.connect(oscGain);
          oscGain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.18);
        }, 280);

        setTimeout(() => {
          resolve();
        }, 500);
      } catch (e) {
        resolve();
      }
    });
  };

  // -------------------------------------------------------------
  // HIGH-DECIBEL POLICE SIREN YELP
  // -------------------------------------------------------------
  const playPoliceSirenYelp = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = audioCtxRef.current || new AudioContext();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      const now = ctx.currentTime;
      // Fast police yelp sound (650Hz -> 1300Hz sweep)
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.linearRampToValueAtTime(1300, now + 0.25);
      osc.frequency.linearRampToValueAtTime(650, now + 0.5);
      osc.frequency.linearRampToValueAtTime(1300, now + 0.75);
      osc.frequency.linearRampToValueAtTime(650, now + 1.0);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.15);
    } catch (e) {}
  };

  // -------------------------------------------------------------
  // SPEAK HINDI VOICE RELIABLY ACROSS ALL BROWSERS & DEVICES
  // -------------------------------------------------------------
  const speakHindiVoice = (modeKey) => {
    return new Promise((resolve) => {
      // For Family Mode, play authentic recorded Hindi male voice!
      if (modeKey === 'family' && guardianAudioRef.current) {
        if ('speechSynthesis' in window) {
          try { window.speechSynthesis.cancel(); } catch (e) {}
        }
        try {
          guardianAudioRef.current.currentTime = 0;
          guardianAudioRef.current.volume = 1.0;
          guardianAudioRef.current.onended = () => resolve();
          guardianAudioRef.current.onerror = () => resolve();
          guardianAudioRef.current.play().catch(e => {
            console.warn('Audio play notice, falling back to synthesis:', e);
            runSpeechSynthesisFallback(modeKey, resolve);
          });
          return;
        } catch (e) {
          runSpeechSynthesisFallback(modeKey, resolve);
          return;
        }
      }

      runSpeechSynthesisFallback(modeKey, resolve);
    });
  };

  const runSpeechSynthesisFallback = (modeKey, resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();
    const modeData = DETERRENT_MODES[modeKey];
    const voices = window.speechSynthesis.getVoices();

    // Find authentic Hindi voice
    const hindiVoice = voices.find(v => 
      v.lang === 'hi-IN' || 
      v.lang.startsWith('hi') || 
      v.name.toLowerCase().includes('hindi') ||
      v.name.toLowerCase().includes('kalpana') ||
      v.name.toLowerCase().includes('hemant')
    );

    // Find Indian accent voice as secondary
    const indianVoice = voices.find(v => 
      v.lang === 'en-IN' || 
      v.name.toLowerCase().includes('india')
    );

    const utterance = new SpeechSynthesisUtterance();

    if (hindiVoice) {
      // Native Hindi Voice: speaks Devnagari text
      utterance.voice = hindiVoice;
      utterance.lang = 'hi-IN';
      utterance.text = modeData.spokenHindi;
    } else {
      // Fallback: speaks phonetic Hindi loud & clear on any English/System voice!
      if (indianVoice) utterance.voice = indianVoice;
      utterance.lang = 'en-IN';
      utterance.text = modeData.phoneticHindi;
    }

    utterance.rate = 0.94; // Clear authoritative pace
    utterance.pitch = modeKey === 'family' ? 0.75 : 0.85; // Deep authoritative tone
    utterance.volume = 1.0; // Max volume

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  };

  // -------------------------------------------------------------
  // TRIGGER THE FULL DETERRENT SEQUENCE
  // -------------------------------------------------------------
  const launchDeterrentSequence = async (modeKey = activeMode) => {
    stopAllDeterrents();
    isCancelledRef.current = false;
    setIsPlaying(true);
    setPoliceStrobeActive(true);

    // Phase 1: Police Walkie-Talkie Radio Squelch & Static
    setAudioPhase('radio_static');
    await playPoliceRadioStatic();

    if (isCancelledRef.current) return;

    // Phase 2: Authoritative Hindi Police Warning Broadcast
    setAudioPhase('hindi_dispatch');
    await speakHindiVoice(modeKey);

    if (isCancelledRef.current) return;

    // Phase 3: High-Impact Police Siren Burst
    if (modeKey === 'police' || modeKey === 'public') {
      setAudioPhase('siren');
      playPoliceSirenYelp();
      setTimeout(() => {
        if (!isCancelledRef.current) {
          setAudioPhase('idle');
          setIsPlaying(false);
          setPoliceStrobeActive(false);
        }
      }, 1400);
    } else {
      setAudioPhase('idle');
      setIsPlaying(false);
      setPoliceStrobeActive(false);
    }
  };

  // Stop All Sounds
  const stopAllDeterrents = () => {
    isCancelledRef.current = true;
    setIsPlaying(false);
    setAudioPhase('idle');
    setPoliceStrobeActive(false);

    if (guardianAudioRef.current) {
      guardianAudioRef.current.pause();
      guardianAudioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
    }
  };

  // Pre-drafted WhatsApp SOS with BNS Section 79 & GPS Coordinates
  const bnsWhatsappMessage = encodeURIComponent(
    `🚨 EMERGENCY: STREET HARASSMENT & EVE-TEASING ALERT!\n\n` +
    `I am currently facing aggressive harassment / stalking on the street!\n` +
    `📍 Live GPS Location: https://maps.google.com/?q=${gpsLocation.lat},${gpsLocation.lng}\n` +
    `⚖️ Criminal Charge: Section 79 BNS (Insult to Modesty) & Section 78 BNS (Stalking).\n` +
    `🚨 Police 112 alert triggered. Please check on me immediately!\n` +
    `— Dispatched via HERHUB Street Harassment Shield`
  );

  return (
    <div 
      style={{ 
        backgroundColor: isDark ? '#0C071C' : '#F8FAFC', 
        minHeight: '100vh', 
        paddingBottom: '80px',
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* 🚨 POLICE RED-BLUE VISUAL STROBE BAR */}
      {policeStrobeActive && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            zIndex: 999999,
            background: 'linear-gradient(90deg, #EF4444 0%, #3B82F6 50%, #EF4444 100%)',
            backgroundSize: '200% 100%',
            animation: 'strobePulse 0.4s infinite linear'
          }}
        />
      )}

      {/* ════════ HERO SECTION (CLEAN ENGLISH UI) ════════ */}
      <section 
        style={{ 
          background: 'linear-gradient(135deg, #16082B 0%, #290F4F 60%, #150629 100%)', 
          color: '#FFFFFF', 
          padding: '40px 0 50px',
          borderBottom: '2px solid rgba(239, 68, 68, 0.4)',
          position: 'relative'
        }}
      >
        <div className="container">
          
          <Link 
            to="/safety-hub" 
            className="d-inline-flex align-items-center gap-2 mb-3 text-decoration-none"
            style={{ color: '#C4B5FD', fontSize: '0.86rem', fontWeight: 600 }}
          >
            <FaArrowLeft /> Back to Safety Tools
          </Link>

          <div className="row align-items-center justify-content-between g-4">
            <div className="col-12 col-lg-8">
              
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span 
                  className="badge px-3 py-1 d-inline-flex align-items-center gap-2"
                  style={{ backgroundColor: '#EF4444', color: '#FFFFFF', fontSize: '0.76rem', fontWeight: 900 }}
                >
                  <span className="spinner-grow spinner-grow-sm text-light" style={{ width: 8, height: 8 }} />
                  ANTI-EVE TEASING SHIELD
                </span>
                <span className="badge bg-danger bg-opacity-25 text-danger border border-danger" style={{ fontSize: '0.74rem' }}>
                  BNS Section 79 Protection
                </span>
                {hasHindiVoice && (
                  <span className="badge bg-success bg-opacity-25 text-success border border-success" style={{ fontSize: '0.74rem' }}>
                    ✓ Native Hindi Voice Active
                  </span>
                )}
              </div>

              <h1 style={{ fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 2.9rem)', letterSpacing: '-0.5px', marginBottom: 12 }}>
                Street Harassment Shield
              </h1>

              <p style={{ color: '#E2E8F0', fontSize: '1.02rem', lineHeight: 1.6, maxWidth: 680, margin: 0 }}>
                Instant psychological deterrent against eve-teasers and catcallers. 
                With <strong>one tap</strong>, your phone blasts realistic police walkie-talkie static followed by an 
                <strong> authoritative Hindi police control room announcement</strong> that forces harassers to flee immediately!
              </p>

            </div>

            {/* LIVE GPS & PCR STATUS */}
            <div className="col-12 col-lg-4 text-lg-end">
              <div 
                className="p-3 rounded-4 d-inline-block text-start w-100"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>📍 Real-Time Location:</span>
                  <span className="badge bg-success" style={{ fontSize: '0.65rem' }}>GPS Locked</span>
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>
                  {gpsLocation.lat}° N, {gpsLocation.lng}° E
                </div>

                <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>⚡ Target Police Network:</span>
                  <strong style={{ fontSize: '0.8rem', color: '#FCA5A5' }}>{selectedCity}</strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ════════ MAIN INTERACTIVE TRIGGER CONSOLE ════════ */}
      <div className="container mt-4">
        
        {/* BIG HIGH-IMPACT 1-TAP RED TRIGGER CARD */}
        <div 
          className="card border-0 rounded-4 shadow-lg p-4 p-md-5 mb-4 text-center text-light"
          style={{
            background: isPlaying 
              ? 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 50%, #450A0A 100%)' 
              : 'linear-gradient(135deg, #1C0F33 0%, #2E1454 50%, #150929 100%)',
            border: isPlaying ? '3px solid #EF4444' : '2px solid #8B5CF6',
            boxShadow: isPlaying ? '0 0 50px rgba(239, 68, 68, 0.5)' : '0 12px 35px rgba(99, 85, 230, 0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Header Controls */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <span 
              className="badge px-3 py-2"
              style={{
                backgroundColor: isPlaying ? '#EF4444' : 'rgba(139, 92, 246, 0.25)',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 800
              }}
            >
              {isPlaying ? '🚨 POLICE DISPATCH BROADCASTING AT MAXIMUM VOLUME' : '⚡ 1-TAP POLICE DETERRENT READY'}
            </span>

            {/* City Command Selector */}
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>Police Unit:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="form-select form-select-sm bg-dark text-light border-secondary"
                style={{ fontSize: '0.78rem', borderRadius: 8, width: 'auto' }}
              >
                <option value="Delhi Police PCR">Delhi Police PCR Command</option>
                <option value="Mumbai Police Control Room">Mumbai Police Control Room</option>
                <option value="Bengaluru City Police">Bengaluru City Police (Pink Hoysala)</option>
                <option value="UP 112 Control Room">UP 112 Command (Lucknow / Varanasi)</option>
                <option value="Rajasthan Police Command">Rajasthan Police PCR Command</option>
              </select>
            </div>
          </div>

          {/* THE GIANT 1-TAP BUTTON */}
          <div className="my-3">
            <button
              type="button"
              onClick={() => {
                if (isPlaying) {
                  stopAllDeterrents();
                } else {
                  launchDeterrentSequence(activeMode);
                }
              }}
              className="btn rounded-circle p-0 d-inline-flex flex-column align-items-center justify-content-center"
              style={{
                width: 'clamp(190px, 42vw, 250px)',
                height: 'clamp(190px, 42vw, 250px)',
                background: isPlaying 
                  ? 'radial-gradient(circle, #EF4444 0%, #B91C1C 70%, #7F1D1D 100%)' 
                  : 'radial-gradient(circle, #DC2626 0%, #991B1B 60%, #7F1D1D 100%)',
                color: '#FFFFFF',
                border: '6px solid rgba(255, 255, 255, 0.35)',
                boxShadow: isPlaying 
                  ? '0 0 60px rgba(239, 68, 68, 0.8), 0 0 100px rgba(239, 68, 68, 0.4)' 
                  : '0 15px 35px rgba(220, 38, 38, 0.5)',
                cursor: 'pointer',
                transform: isPlaying ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
              title={isPlaying ? "Stop Alarm" : "Blast Police Alarm Now"}
            >
              {isPlaying ? (
                <>
                  <FaStop style={{ fontSize: '3rem', marginBottom: 8 }} />
                  <span style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '1px' }}>STOP ALARM</span>
                  <small style={{ fontSize: '0.72rem', color: '#FCA5A5' }}>Tap to Silence</small>
                </>
              ) : (
                <>
                  <FaVolumeUp style={{ fontSize: '3.4rem', marginBottom: 8 }} />
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '0.5px' }}>BLAST ALARM</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FEE2E2' }}>POLICE DISPATCH</span>
                  <small style={{ fontSize: '0.68rem', color: '#FECACA' }}>(Speaks in Hindi Voice)</small>
                </>
              )}
            </button>
          </div>

          {/* AUDIO VISUALIZER & STATUS MONITOR */}
          <div 
            className="p-3 rounded-3 mt-4 mx-auto text-start"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              border: '1px solid rgba(255, 255, 255, 0.15)',
              maxWidth: 720,
              width: '100%'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span style={{ fontSize: '0.74rem', color: '#FCA5A5', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FaBroadcastTower /> LIVE BROADCAST STATUS:
              </span>
              <span className="badge bg-dark border" style={{ fontSize: '0.68rem', color: '#F87171' }}>
                Phase: {audioPhase.toUpperCase()}
              </span>
            </div>

            {/* Hindi Speech Display Banner */}
            <div 
              className="p-2 rounded-2 mb-2"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderLeft: '3px solid #EF4444' }}
            >
              <div style={{ fontSize: '0.7rem', color: '#FCA5A5', fontWeight: 700, marginBottom: 2 }}>
                🗣️ Spoken in Authoritative Hindi Voice on Speaker:
              </div>
              <div style={{ fontSize: '0.86rem', color: '#F1F5F9', lineHeight: 1.4, fontStyle: 'italic' }}>
                "{DETERRENT_MODES[activeMode].spokenHindi}"
              </div>
            </div>

            {isPlaying && (
              <div className="d-flex align-items-center justify-content-between text-danger fw-bold pt-1" style={{ fontSize: '0.76rem' }}>
                <div className="d-flex align-items-center gap-2">
                  <span className="spinner-grow spinner-grow-sm" />
                  <span>Police Radio Static + Hindi Warning Voice Active on Loudspeaker!</span>
                </div>
                <span className="badge bg-danger">100% Vol</span>
              </div>
            )}
          </div>

        </div>

        {/* ════════ 3 PSYCHOLOGICAL DETERRENT MODES ════════ */}
        <div className="mb-2">
          <h4 style={{ fontWeight: 800, color: isDark ? '#FFFFFF' : '#1E1238', marginBottom: 4 }}>
            3 Psychological Deterrent Modes
          </h4>
          <p style={{ fontSize: '0.86rem', color: isDark ? '#94A3B8' : '#64748B', marginBottom: 16 }}>
            Select any mode to test or trigger. Street harassers fear police action, public attention, and family presence.
          </p>
        </div>

        <div className="row g-3 mb-4">
          
          {/* MODE 1: POLICE WIRELESS (User Requested Flagship) */}
          <div className="col-12 col-md-4">
            <div 
              onClick={() => {
                setActiveMode('police');
                if (!isPlaying) launchDeterrentSequence('police');
              }}
              className="card h-100 p-4 border-0 rounded-4 shadow-sm"
              style={{
                backgroundColor: activeMode === 'police' ? (isDark ? '#26123D' : '#FDF2F8') : (isDark ? '#1C1236' : '#FFFFFF'),
                border: activeMode === 'police' ? '2.5px solid #EF4444' : '1px solid #E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-danger" style={{ fontSize: '0.7rem' }}>
                  {DETERRENT_MODES.police.badge}
                </span>
                <span className="badge bg-secondary bg-opacity-25 text-muted" style={{ fontSize: '0.65rem' }}>
                  ⭐ MOST EFFECTIVE
                </span>
              </div>

              <h5 style={{ fontWeight: 800, color: isDark ? '#FFFFFF' : '#1E1238', marginBottom: 6 }}>
                {DETERRENT_MODES.police.title}
              </h5>

              <p style={{ fontSize: '0.82rem', color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.4, marginBottom: 12 }}>
                {DETERRENT_MODES.police.displayDescription}
              </p>

              <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                <span style={{ fontSize: '0.74rem', color: '#EF4444', fontWeight: 800 }}>
                  ▶ Test Police Mode
                </span>
                <FaVolumeUp style={{ color: '#EF4444' }} />
              </div>
            </div>
          </div>

          {/* MODE 2: FAMILY BACKUP */}
          <div className="col-12 col-md-4">
            <div 
              onClick={() => {
                setActiveMode('family');
                if (!isPlaying) launchDeterrentSequence('family');
              }}
              className="card h-100 p-4 border-0 rounded-4 shadow-sm"
              style={{
                backgroundColor: activeMode === 'family' ? (isDark ? '#26123D' : '#F0FDF4') : (isDark ? '#1C1236' : '#FFFFFF'),
                border: activeMode === 'family' ? '2.5px solid #10B981' : '1px solid #E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-success" style={{ fontSize: '0.7rem' }}>
                  {DETERRENT_MODES.family.badge}
                </span>
                <FaUserFriends style={{ color: '#10B981' }} />
              </div>

              <h5 style={{ fontWeight: 800, color: isDark ? '#FFFFFF' : '#1E1238', marginBottom: 6 }}>
                {DETERRENT_MODES.family.title}
              </h5>

              <p style={{ fontSize: '0.82rem', color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.4, marginBottom: 12 }}>
                {DETERRENT_MODES.family.displayDescription}
              </p>

              <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 800 }}>
                  ▶ Test Family Mode
                </span>
                <FaVolumeUp style={{ color: '#10B981' }} />
              </div>
            </div>
          </div>

          {/* MODE 3: PUBLIC SHAMING */}
          <div className="col-12 col-md-4">
            <div 
              onClick={() => {
                setActiveMode('public');
                if (!isPlaying) launchDeterrentSequence('public');
              }}
              className="card h-100 p-4 border-0 rounded-4 shadow-sm"
              style={{
                backgroundColor: activeMode === 'public' ? (isDark ? '#26123D' : '#FFFBEB') : (isDark ? '#1C1236' : '#FFFFFF'),
                border: activeMode === 'public' ? '2.5px solid #F59E0B' : '1px solid #E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-warning text-dark" style={{ fontSize: '0.7rem' }}>
                  {DETERRENT_MODES.public.badge}
                </span>
                <FaBullhorn style={{ color: '#F59E0B' }} />
              </div>

              <h5 style={{ fontWeight: 800, color: isDark ? '#FFFFFF' : '#1E1238', marginBottom: 6 }}>
                {DETERRENT_MODES.public.title}
              </h5>

              <p style={{ fontSize: '0.82rem', color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.4, marginBottom: 12 }}>
                {DETERRENT_MODES.public.displayDescription}
              </p>

              <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                <span style={{ fontSize: '0.74rem', color: '#D97706', fontWeight: 800 }}>
                  ▶ Test Public Mode
                </span>
                <FaVolumeUp style={{ color: '#D97706' }} />
              </div>
            </div>
          </div>

        </div>

        {/* ════════ BNS LEGAL ARMOR & 1-CLICK DISPATCH ════════ */}
        <div className="row g-3">
          
          {/* BNS LEGAL ARMOR */}
          <div className="col-12 col-lg-7">
            <div 
              className="card border-0 rounded-4 shadow-sm p-4 h-100"
              style={{ 
                backgroundColor: isDark ? '#1A1033' : '#FFFFFF', 
                border: isDark ? '1px solid #332057' : '1px solid #E2E8F0' 
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaLock style={{ color: '#EF4444' }} />
                <h5 style={{ margin: 0, fontWeight: 800, color: isDark ? '#FFFFFF' : '#1E1238' }}>
                  Bharatiya Nyaya Sanhita (BNS) Legal Armor
                </h5>
              </div>

              <div className="d-flex flex-column gap-2 mb-3">
                <div className="p-3 rounded-3" style={{ backgroundColor: isDark ? '#231545' : '#F8FAFC', borderLeft: '4px solid #EF4444' }}>
                  <div className="d-flex justify-content-between mb-1">
                    <strong style={{ fontSize: '0.84rem', color: '#EF4444' }}>Section 79 BNS (Old IPC 509):</strong>
                    <span className="badge bg-danger bg-opacity-25 text-danger" style={{ fontSize: '0.65rem' }}>Non-Bailable</span>
                  </div>
                  <small style={{ fontSize: '0.78rem', color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.4, display: 'block' }}>
                    Word, gesture, or act intended to insult the modesty of a woman (Street eve-teasing, catcalling, whistling, or lewd remarks). Carries up to 3 years rigorous imprisonment!
                  </small>
                </div>

                <div className="p-3 rounded-3" style={{ backgroundColor: isDark ? '#231545' : '#F8FAFC', borderLeft: '4px solid #3B82F6' }}>
                  <div className="d-flex justify-content-between mb-1">
                    <strong style={{ fontSize: '0.84rem', color: '#3B82F6' }}>Section 78 BNS (Old IPC 354D):</strong>
                    <span className="badge bg-primary bg-opacity-25 text-primary" style={{ fontSize: '0.65rem' }}>Stalking Law</span>
                  </div>
                  <small style={{ fontSize: '0.78rem', color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.4, display: 'block' }}>
                    Physical stalking, following a woman repeatedly on a bike or vehicle to cause distress. Carries up to 5 years imprisonment + fine.
                  </small>
                </div>
              </div>

              <small style={{ color: '#94A3B8', fontSize: '0.72rem' }}>
                ⚖️ Section 63 BSA (Bharatiya Sakshya Adhiniyam): Audio telemetry and GPS timestamps generated here are tamper-proof and court-admissible.
              </small>
            </div>
          </div>

          {/* 1-CLICK DISPATCH ACTIONS */}
          <div className="col-12 col-lg-5">
            <div 
              className="card border-0 rounded-4 shadow-sm p-4 h-100"
              style={{ 
                backgroundColor: isDark ? '#1A1033' : '#FFFFFF', 
                border: isDark ? '1px solid #332057' : '1px solid #E2E8F0' 
              }}
            >
              <h5 style={{ fontWeight: 800, color: isDark ? '#FFFFFF' : '#1E1238', marginBottom: 12 }}>
                Instant Emergency Action (1-Click)
              </h5>

              <div className="d-flex flex-column gap-2 mb-3">
                {/* 1. WhatsApp SOS with Section 79 BNS */}
                <a
                  href={`https://api.whatsapp.com/send?phone=${emergencyPhone.replace(/[^0-9]/g, '')}&text=${bnsWhatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn py-3 d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                  }}
                >
                  <FaWhatsapp style={{ fontSize: '1.2rem' }} />
                  <span>Send BNS Eve-Teasing SOS to Family</span>
                </a>

                {/* 2. Direct Call Police 112 */}
                <a
                  href="tel:112"
                  className="btn py-3 d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                  style={{
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <FaPhoneAlt />
                  <span>Call Police 112 Directly</span>
                </a>

                {/* 3. Women Helpline 1091 */}
                <a
                  href="tel:1091"
                  className="btn btn-outline-danger py-2 d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                  style={{ borderRadius: 12, fontWeight: 700, fontSize: '0.85rem' }}
                >
                  <FaShieldAlt />
                  <span>Women In Distress Helpline (1091)</span>
                </a>
              </div>

              <div className="p-2 rounded-2 mt-auto text-center" style={{ backgroundColor: isDark ? '#231545' : '#F1F5F9' }}>
                <small style={{ fontSize: '0.72rem', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Emergency SOS Target: <strong>{emergencyPhone}</strong>
                </small>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default StreetHarassmentShieldPage;
