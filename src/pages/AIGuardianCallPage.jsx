import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPhone, FaPhoneSlash, FaMicrophone, FaMicrophoneSlash,
  FaVolumeUp, FaTh, FaCheckCircle
} from 'react-icons/fa';

function AIGuardianCallPage() {
  const [callState, setCallState] = useState('idle'); // 'idle' | 'ringing' | 'connected'
  const [callerName, setCallerName] = useState('Papa');
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [keypadInput, setKeypadInput] = useState('');
  const [transcriptIndex, setTranscriptIndex] = useState(0);

  // Audio Context Ref for Synthesizing Ringtone
  const audioCtxRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const ringOscillatorRef = useRef(null);
  const ringIntervalRef = useRef(null);

  // Authentic recorded voice for Brother (Rahul), Mom & Papa
  const brotherAudioRef = useRef(null);
  const momAudioRef = useRef(null);
  const papaAudioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/brother_guardian_call.ogg');
    audio.preload = 'auto';
    brotherAudioRef.current = audio;

    const momAudio = new Audio('/mom_guardian_call.ogg');
    momAudio.preload = 'auto';
    momAudioRef.current = momAudio;

    const papaAudio = new Audio('/papa_guardian_call.ogg');
    papaAudio.preload = 'auto';
    papaAudioRef.current = papaAudio;

    return () => {
      if (brotherAudioRef.current) {
        brotherAudioRef.current.pause();
        brotherAudioRef.current = null;
      }
      if (momAudioRef.current) {
        momAudioRef.current.pause();
        momAudioRef.current = null;
      }
      if (papaAudioRef.current) {
        papaAudioRef.current.pause();
        papaAudioRef.current = null;
      }
    };
  }, []);

  // Authentic spoken Hindi transcript from Papa audio recording
  const papaScript = [
    "Hello beta... Haan, kahan pahunchi?",
    "Achha... Kitni der lagegi?",
    "Theek hai beta, apna location bhej do mujhe...",
    "...Gaadi ka number bhi message kar dena. Bas tumhari safety ko lekar pooch raha hoon.",
    "Phone apne paas hi rakhna, aur ghar pahunch kar mujhe bata dena.",
    "Haan beta, aaram se aana."
  ];

  // Authentic spoken Hindi transcript from Mom audio recording
  const momScript = [
    "Hello, haan beta, kahan ho tum?",
    "Achha, abhi tak ghar nahi pahunchi? Achha kitni der lagegi?",
    "Okay okay, haan aur suno apni location bhej do mujhe, aur gaadi ka number bhi bhej dena.",
    "Hmm, haan main tumhara wait kar rahi hoon, phone apne paas hi rakhna, aur ghar pahunch kar mujhe bata dena, theek hai?",
    "Okay okay, dhyan se aana, bye."
  ];

  // Authentic spoken Hindi transcript from Brother (Rahul) audio recording
  const brotherScript = [
    "Hello, haan kahan ho tum? Achha, abhi kitni der lagegi ghar pahunchne mein?",
    "Theek hai, suno apni live location WhatsApp kar do...",
    "...aur gaadi ka number bhi bhej dena. Main dekh leta hoon kahan pahunchi ho tum.",
    "Aur haan phone silent mat karna, ghar pahunch kar ek call kar dena.",
    "Achha theek hai, dhyan se aana."
  ];

  // Realistic script sentences spoken by the AI guardian (Mom / Papa)
  const callScript = [
    "Hey beta! Where are you right now? Are you on your way home?",
    "Dad and I are waiting right by the main gate. It's well-lit here.",
    "Stay on the main road, okay? Don't take any deserted alley shortcuts.",
    "Keep talking to me. What landmark are you crossing right now?",
    "Okay perfect, I see car headlights coming up. Walk towards the convenience store, we're standing right outside."
  ];

  // Ringtone synthesizer using Web Audio API (No external mp3 required!)
  const startRingtone = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const playRingBurst = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        // Standard 440Hz + 480Hz dual tone
        osc1.type = 'sine';
        osc1.frequency.value = 440;
        osc2.type = 'sine';
        osc2.frequency.value = 480;

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.8);
        osc2.stop(ctx.currentTime + 1.8);
      };

      playRingBurst();
      ringIntervalRef.current = setInterval(playRingBurst, 3500);
    } catch (e) {
      console.log('AudioContext not allowed without gesture', e);
    }
  };

  const stopRingtone = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  // Speak a line using native SpeechSynthesis
  const speakLine = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Natural talking pace
    utterance.pitch = 1.05; // Friendly warm pitch

    // Try finding a natural female / Hindi-English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.includes('en-IN') || v.name.includes('India') || v.name.includes('Natural') || v.name.includes('Zira') || v.name.includes('Samantha')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  };

  // Trigger Incoming Call
  const triggerIncomingCall = (name = 'Papa') => {
    setCallerName(name);
    setCallState('ringing');
    setCallTimer(0);
    setTranscriptIndex(0);
    startRingtone();
  };

  // Accept Call
  const handleAcceptCall = () => {
    stopRingtone();
    setCallState('connected');
    setCallTimer(0);
    setTranscriptIndex(0);

    if (callerName.includes('Papa')) {
      // Play authentic recorded Hindi voice for Papa (NEVER fallback to robotic AI speech)
      const papaAudio = papaAudioRef.current || new Audio((process.env.PUBLIC_URL || '') + '/papa_guardian_call.ogg');
      papaAudio.currentTime = 0;
      papaAudio.muted = isMuted;
      papaAudio.volume = speakerOn ? 1.0 : 0.6;
      const playPromise = papaAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.warn('Audio play notice, retrying:', e);
          setTimeout(() => papaAudio.play().catch(console.error), 100);
        });
      }
    } else if (callerName.includes('Brother')) {
      // Play authentic recorded Hindi voice for Rahul (Brother)
      const brotherAudio = brotherAudioRef.current || new Audio((process.env.PUBLIC_URL || '') + '/brother_guardian_call.ogg');
      brotherAudio.currentTime = 0;
      brotherAudio.muted = isMuted;
      brotherAudio.volume = speakerOn ? 1.0 : 0.6;
      brotherAudio.play().catch(e => console.warn('Brother audio notice:', e));
    } else if (callerName.includes('Mom')) {
      // Play authentic recorded Hindi voice for Mom
      const momAudio = momAudioRef.current || new Audio((process.env.PUBLIC_URL || '') + '/mom_guardian_call.ogg');
      momAudio.currentTime = 0;
      momAudioRef.current = momAudio;
      momAudio.currentTime = 0;
      momAudio.muted = isMuted;
      momAudio.volume = speakerOn ? 1.0 : 0.6;
      momAudio.play().catch(e => console.warn('Mom audio notice:', e));
    } else {
      // Speak first line immediately via SpeechSynthesis for custom personas
      speakLine(callScript[0]);
    }
  };

  // Decline / End Call
  const handleEndCall = () => {
    stopRingtone();
    if (brotherAudioRef.current) {
      brotherAudioRef.current.pause();
      brotherAudioRef.current.currentTime = 0;
    }
    if (momAudioRef.current) {
      momAudioRef.current.pause();
      momAudioRef.current.currentTime = 0;
    }
    if (papaAudioRef.current) {
      papaAudioRef.current.pause();
      papaAudioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCallState('idle');
    setCallTimer(0);
    setShowKeypad(false);
  };

  // In-call duration timer and periodic speech
  useEffect(() => {
    let interval = null;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallTimer(prev => {
          const next = prev + 1;
          if (callerName.includes('Brother')) {
            // Synchronize transcript bubble with brother's spoken voice
            if (next === 5) setTranscriptIndex(1);
            else if (next === 10) setTranscriptIndex(2);
            else if (next === 17) setTranscriptIndex(3);
            else if (next === 23) setTranscriptIndex(4);
          } else if (callerName.includes('Mom')) {
            // Synchronize transcript bubble with Mom's authentic voice
            if (next === 6) setTranscriptIndex(1);
            else if (next === 12) setTranscriptIndex(2);
            else if (next === 19) setTranscriptIndex(3);
            else if (next === 26) setTranscriptIndex(4);
          } else if (callerName.includes('Papa')) {
            // Synchronize transcript bubble with Papa's authentic voice
            if (next === 5) setTranscriptIndex(1);
            else if (next === 10) setTranscriptIndex(2);
            else if (next === 16) setTranscriptIndex(3);
            else if (next === 23) setTranscriptIndex(4);
            else if (next === 30) setTranscriptIndex(5);
          } else {
            // Progress through speech synthesis script every 6-8 seconds
            if (next === 6 && callScript[1]) {
              setTranscriptIndex(1);
              speakLine(callScript[1]);
            } else if (next === 14 && callScript[2]) {
              setTranscriptIndex(2);
              speakLine(callScript[2]);
            } else if (next === 22 && callScript[3]) {
              setTranscriptIndex(3);
              speakLine(callScript[3]);
            } else if (next === 30 && callScript[4]) {
              setTranscriptIndex(4);
              speakLine(callScript[4]);
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callState, callerName]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopRingtone();
      if (brotherAudioRef.current) {
        brotherAudioRef.current.pause();
        brotherAudioRef.current = null;
      }
      if (momAudioRef.current) {
        momAudioRef.current.pause();
        momAudioRef.current = null;
      }
      if (papaAudioRef.current) {
        papaAudioRef.current.pause();
        papaAudioRef.current = null;
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ backgroundColor: '#FDFDFE', minHeight: '100vh' }}>
      
      {/* ════════ DARK HERO BANNER ════════ */}
      <section style={{ backgroundColor: '#160D33', color: '#FFFFFF', padding: '50px 0 65px' }}>
        <div className="container">
          
          <Link 
            to="/" 
            className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none"
            style={{ color: '#B2AECB', fontSize: '0.88rem', fontWeight: 500 }}
          >
            <span>← Back to safety hub</span>
          </Link>

          <div className="row align-items-center">
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
                PROTECT · REALISTIC DEMO
              </div>

              <h1 
                style={{ 
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', 
                  fontWeight: 800, 
                  letterSpacing: '-0.5px',
                  marginBottom: 16 
                }}
              >
                AI Guardian Call
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
                Experience a hyper-realistic incoming call with authentic voice dialogue. Designed to project an active conversation with family or guardians to gracefully exit uncomfortable situations.
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
                REALISTIC VOICE COMPANION · BROWSER AUDIO
              </span>
            </div>

            <div className="col-12 col-md-3 col-lg-4 text-center text-md-end mt-4 mt-md-0">
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 130,
                  height: 130,
                  borderRadius: '50%',
                  background: 'rgba(138, 124, 254, 0.15)',
                  border: '2px solid #8A7CFE',
                  color: '#8A7CFE',
                  fontSize: '3.5rem'
                }}
              >
                <FaPhone style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ════════ CALL LAUNCHER & REALISTIC DEVICE SCREEN ════════ */}
      <section style={{ padding: '60px 0 100px' }}>
        <div className="container">
          <div className="row gy-5 justify-content-center">

            {/* Left Column: Launcher Options */}
            <div className="col-12 col-lg-6">
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
                  marginBottom: 20 
                }}
              >
                Trigger a realistic companion call
              </h2>

              <p style={{ color: '#555271', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: 28 }}>
                Choose who you want calling you. When the call rings, tap <strong>Accept</strong> and listen through your speaker or headphones as your guardian talks to you!
              </p>

              {/* Caller Selection Cards */}
              <div className="d-flex flex-column gap-3 mb-4">
                {[
                  { name: 'Papa', phone: '+91 75240 72395', icon: '👨', sub: 'Primary Guardian (Authentic Recorded Voice)' },
                  { name: 'Mom', phone: '+91 98110 12345', icon: '👩', sub: 'Urgent family pickup check-in' },
                  { name: 'Rahul (Brother)', phone: '+91 91234 56789', icon: '👦', sub: 'Checking live location and ride safety' }
                ].map(c => (
                  <div
                    key={c.name}
                    className="p-3 border rounded-3 d-flex align-items-center justify-content-between"
                    style={{
                      borderColor: callerName === c.name ? '#6355E6' : '#E9E7F2',
                      background: callerName === c.name ? '#F0EDFE' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setCallerName(c.name)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span style={{ fontSize: '1.8rem' }}>{c.icon}</span>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ fontWeight: 700, color: '#12102B', fontSize: '0.95rem' }}>{c.name}</span>
                        </div>
                        <div style={{ color: '#716E8C', fontSize: '0.78rem' }}>{c.phone} · {c.sub}</div>
                      </div>
                    </div>
                    {callerName === c.name && <FaCheckCircle style={{ color: '#6355E6', fontSize: '1.1rem' }} />}
                  </div>
                ))}
              </div>

              {/* Trigger Button */}
              {callState === 'idle' && (
                <button
                  onClick={() => triggerIncomingCall(callerName)}
                  style={{
                    background: '#6355E6',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 14,
                    padding: '16px 32px',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    boxShadow: '0 8px 24px rgba(99, 85, 230, 0.3)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5244D4'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6355E6'}
                >
                  <FaPhone />
                  <span>Call My Phone Now ({callerName})</span>
                </button>
              )}

              {/* Status Note */}
              <div className="mt-4 p-3 rounded-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.82rem', color: '#64748B' }}>
                💡 <strong>Discreet Tip:</strong> When walking alone, answer the call and reply out loud: <em>"Yes, I'm almost at the gate, I can see your car lights!"</em> People around you will know someone is actively waiting for you.
              </div>
            </div>

            {/* Right Column: Realistic Smartphone Call Simulation */}
            <div className="col-12 col-lg-5 d-flex justify-content-center">
              
              <div
                style={{
                  width: '100%',
                  maxWidth: 360,
                  height: 640,
                  background: '#0F0922',
                  borderRadius: 44,
                  border: '6px solid #231940',
                  boxShadow: '0 30px 80px rgba(18, 16, 43, 0.4)',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  color: '#FFFFFF'
                }}
              >
                {/* Phone Speaker Notch */}
                <div 
                  style={{
                    width: 90,
                    height: 5,
                    background: '#332958',
                    borderRadius: 3,
                    margin: '0 auto 20px'
                  }}
                />

                {/* IDLE STATE */}
                {callState === 'idle' && (
                  <div className="my-auto text-center px-3">
                    <div 
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: '#1F1444',
                        border: '2px solid #6355E6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        color: '#9887FE',
                        margin: '0 auto 20px'
                      }}
                    >
                      <FaPhone />
                    </div>
                    <h5 style={{ fontWeight: 800 }}>Guardian Call Standby</h5>
                    <p style={{ color: '#8E8BA7', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 24 }}>
                      Tap the purple button on the left to trigger the realistic incoming call screen.
                    </p>
                    <button
                      onClick={() => triggerIncomingCall(callerName)}
                      className="btn btn-sm btn-outline-light py-2 px-4"
                      style={{ borderRadius: 10, fontSize: '0.82rem', borderColor: '#483B75' }}
                    >
                      Quick Ring Preview
                    </button>
                  </div>
                )}

                {/* RINGING STATE */}
                {callState === 'ringing' && (
                  <div className="d-flex flex-column h-100 justify-content-between text-center pt-3 pb-2">
                    <div>
                      <div style={{ color: '#D5CEFD', fontSize: '0.78rem', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
                        INCOMING CALL
                      </div>
                      <h2 style={{ fontWeight: 900, fontSize: '2.2rem', marginBottom: 4 }}>
                        {callerName}
                      </h2>
                      <div style={{ color: '#A09DB7', fontSize: '0.88rem' }}>
                        +91 75240 72395 · Mobile
                      </div>
                    </div>

                    {/* Animated Pulsing Avatar */}
                    <div 
                      style={{
                        width: 130,
                        height: 130,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #EC4899, #6355E6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3.4rem',
                        fontWeight: 800,
                        margin: '0 auto',
                        boxShadow: '0 0 0 12px rgba(99, 85, 230, 0.25), 0 0 0 24px rgba(99, 85, 230, 0.1)',
                        animation: 'pulse 1.2s infinite'
                      }}
                    >
                      {callerName.charAt(0)}
                    </div>

                    {/* Decline & Accept Buttons */}
                    <div className="d-flex justify-content-around align-items-center px-3 mb-2">
                      {/* Decline */}
                      <div className="text-center">
                        <button
                          onClick={handleEndCall}
                          style={{
                            width: 66,
                            height: 66,
                            borderRadius: '50%',
                            background: '#EF4444',
                            border: 'none',
                            color: '#FFFFFF',
                            fontSize: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)'
                          }}
                        >
                          <FaPhoneSlash />
                        </button>
                        <div style={{ fontSize: '0.75rem', color: '#D5CEFD', marginTop: 8 }}>Decline</div>
                      </div>

                      {/* Accept */}
                      <div className="text-center">
                        <button
                          onClick={handleAcceptCall}
                          style={{
                            width: 66,
                            height: 66,
                            borderRadius: '50%',
                            background: '#10B981',
                            border: 'none',
                            color: '#FFFFFF',
                            fontSize: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                            animation: 'bounce 1s infinite'
                          }}
                        >
                          <FaPhone />
                        </button>
                        <div style={{ fontSize: '0.75rem', color: '#D5CEFD', marginTop: 8 }}>Accept</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CONNECTED IN-CALL STATE */}
                {callState === 'connected' && (
                  <div className="d-flex flex-column h-100 justify-content-between text-center pt-2">
                    
                    {/* Header */}
                    <div>
                      <h3 style={{ fontWeight: 800, fontSize: '1.8rem', margin: '4px 0' }}>
                        {callerName}
                      </h3>
                      <div style={{ color: '#10B981', fontSize: '0.95rem', fontWeight: 700, letterSpacing: 1 }}>
                        {formatDuration(callTimer)}
                      </div>
                    </div>

                    {/* Live Speech Prompt Bubble */}
                    <div 
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: 18,
                        padding: '16px 14px',
                        margin: '10px 0',
                        fontSize: '0.85rem',
                        lineHeight: 1.55,
                        color: '#E0DBFC'
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span style={{ fontSize: '0.7rem', color: '#9887FE', fontWeight: 800, textTransform: 'uppercase' }}>
                          🗣️ {callerName} Speaking:
                        </span>
                      </div>
                      <em>"{(callerName.includes('Brother') ? brotherScript : callerName.includes('Mom') ? momScript : callerName.includes('Papa') ? papaScript : callScript)[transcriptIndex] || ''}"</em>
                    </div>

                    {/* Smartphone In-Call Grid (Mute, Keypad, Speaker, Video, etc.) */}
                    {!showKeypad ? (
                      <div className="row g-3 px-2 mb-2">
                        <div className="col-4">
                          <button
                            onClick={() => {
                              const next = !isMuted;
                              setIsMuted(next);
                              if (brotherAudioRef.current) {
                                brotherAudioRef.current.muted = next;
                              }
                              if (momAudioRef.current) {
                                momAudioRef.current.muted = next;
                              }
                              if (papaAudioRef.current) {
                                papaAudioRef.current.muted = next;
                              }
                            }}
                            style={{
                              width: 54, height: 54, borderRadius: '50%',
                              background: isMuted ? '#6355E6' : 'rgba(255,255,255,0.1)',
                              border: 'none', color: '#fff', fontSize: '1.1rem', margin: '0 auto',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                          </button>
                          <div style={{ fontSize: '0.7rem', color: '#A09DB7', marginTop: 4 }}>Mute</div>
                        </div>

                        <div className="col-4">
                          <button
                            onClick={() => setShowKeypad(true)}
                            style={{
                              width: 54, height: 54, borderRadius: '50%',
                              background: 'rgba(255,255,255,0.1)',
                              border: 'none', color: '#fff', fontSize: '1.1rem', margin: '0 auto',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            <FaTh />
                          </button>
                          <div style={{ fontSize: '0.7rem', color: '#A09DB7', marginTop: 4 }}>Keypad</div>
                        </div>

                        <div className="col-4">
                          <button
                            onClick={() => {
                              const next = !speakerOn;
                              setSpeakerOn(next);
                              if (brotherAudioRef.current) {
                                brotherAudioRef.current.volume = next ? 1.0 : 0.4;
                              }
                              if (momAudioRef.current) {
                                momAudioRef.current.volume = next ? 1.0 : 0.4;
                              }
                              if (papaAudioRef.current) {
                                papaAudioRef.current.volume = next ? 1.0 : 0.4;
                              }
                            }}
                            style={{
                              width: 54, height: 54, borderRadius: '50%',
                              background: speakerOn ? '#6355E6' : 'rgba(255,255,255,0.1)',
                              border: 'none', color: '#fff', fontSize: '1.1rem', margin: '0 auto',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            <FaVolumeUp />
                          </button>
                          <div style={{ fontSize: '0.7rem', color: '#A09DB7', marginTop: 4 }}>Speaker</div>
                        </div>
                      </div>
                    ) : (
                      /* Dialpad Overlay */
                      <div className="p-2 mb-2">
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', height: 28, marginBottom: 8 }}>
                          {keypadInput || ' '}
                        </div>
                        <div className="row g-2">
                          {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(k => (
                            <div key={k} className="col-4">
                              <button
                                onClick={() => setKeypadInput(prev => prev + k)}
                                style={{
                                  width: '100%', height: 38, borderRadius: 10,
                                  background: 'rgba(255,255,255,0.12)', border: 'none',
                                  color: '#fff', fontWeight: 700, fontSize: '1rem'
                                }}
                              >
                                {k}
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowKeypad(false)}
                          className="btn btn-sm text-light mt-2"
                          style={{ fontSize: '0.75rem' }}
                        >
                          Hide Keypad
                        </button>
                      </div>
                    )}

                    {/* Big End Call Button */}
                    <div className="mb-2">
                      <button
                        onClick={handleEndCall}
                        style={{
                          width: 66,
                          height: 66,
                          borderRadius: '50%',
                          background: '#EF4444',
                          border: 'none',
                          color: '#FFFFFF',
                          fontSize: '1.6rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto',
                          cursor: 'pointer',
                          boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)'
                        }}
                      >
                        <FaPhoneSlash />
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Hidden Native Audio Players for 100% Reliable Cross-Browser & Deployed Playback */}
      <audio 
        ref={papaAudioRef} 
        src={(process.env.PUBLIC_URL || '') + '/papa_guardian_call.ogg'} 
        preload="auto" 
      />
      <audio 
        ref={brotherAudioRef} 
        src={(process.env.PUBLIC_URL || '') + '/brother_guardian_call.ogg'} 
        preload="auto" 
      />
      <audio 
        ref={momAudioRef} 
        src={(process.env.PUBLIC_URL || '') + '/mom_guardian_call.ogg'} 
        preload="auto" 
      />

    </div>
  );
}

export default AIGuardianCallPage;
