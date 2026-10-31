import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaArrowLeft, FaClock, FaTimes, FaShieldAlt } from 'react-icons/fa';

function CheckInSentinel() {
  const [duration, setDuration] = useState('30');
  const [note, setNote] = useState('');
  const [activeCheckIn, setActiveCheckIn] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  // Timer countdown
  useEffect(() => {
    let timer = null;
    if (activeCheckIn && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (activeCheckIn && secondsLeft === 0) {
      setActiveCheckIn(false);
    }
    return () => clearInterval(timer);
  }, [activeCheckIn, secondsLeft]);

  const handleStart = (e) => {
    e.preventDefault();
    const secs = parseInt(duration, 10) * 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setActiveCheckIn(true);
  };

  const handleImSafe = () => {
    setActiveCheckIn(false);
    setSecondsLeft(0);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = totalSeconds > 0 
    ? Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100)
    : 0;

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
                PROTECT · DEMO
              </div>

              <h1 
                style={{ 
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', 
                  fontWeight: 800, 
                  letterSpacing: '-0.5px',
                  marginBottom: 16 
                }}
              >
                Check-in Sentinel
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
                Create a personal check-in with a visible countdown. This is a guided, educational experience built to support informed choices—not to predict danger or replace professional support.
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

            {/* Right Large Stylized Checkmark Graphic */}
            <div className="col-12 col-md-3 col-lg-4 text-center text-md-end mt-4 mt-md-0">
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 140,
                  height: 140,
                  color: '#8A7CFE',
                  fontSize: '6.5rem',
                  opacity: 0.9,
                  transform: 'rotate(-5deg)'
                }}
              >
                ✓
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ════════ FORM & GUIDELINES SECTION ════════ */}
      <section style={{ padding: '60px 0 100px' }}>
        <div className="container">
          <div className="row gy-5">

            {/* Left Column: Form / Active State */}
            <div className="col-12 col-lg-7">
              <div style={{ maxWidth: 540 }}>
                
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
                  Set a personal check-in
                </h2>

                {!activeCheckIn ? (
                  <form onSubmit={handleStart}>
                    
                    {/* Duration Select */}
                    <div className="mb-4">
                      <label 
                        className="form-label" 
                        style={{ fontWeight: 600, fontSize: '0.9rem', color: '#12102B', marginBottom: 8 }}
                      >
                        How long should your check-in last?
                      </label>
                      <select 
                        className="form-select"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        style={{
                          background: '#FFFFFF',
                          borderColor: '#E9E7F2',
                          color: '#12102B',
                          borderRadius: 12,
                          padding: '12px 16px',
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1 hour 30 minutes</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>

                    {/* Optional Note */}
                    <div className="mb-4">
                      <label 
                        className="form-label" 
                        style={{ fontWeight: 600, fontSize: '0.9rem', color: '#12102B', marginBottom: 8 }}
                      >
                        Optional note
                      </label>
                      <input 
                        type="text"
                        className="form-control"
                        placeholder="e.g. Heading home after class"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        style={{
                          background: '#FFFFFF',
                          borderColor: '#E9E7F2',
                          color: '#12102B',
                          borderRadius: 12,
                          padding: '12px 16px',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit"
                      style={{
                        background: '#6355E6',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 12,
                        padding: '14px 28px',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        width: '100%',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(99, 85, 230, 0.28)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5244D4'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6355E6'}
                    >
                      Start check-in
                    </button>

                  </form>
                ) : (
                  /* Active Countdown Display */
                  <div 
                    style={{ 
                      background: '#FFFFFF', 
                      border: '2px solid #D5CEFD', 
                      borderRadius: 20, 
                      padding: '34px 28px',
                      boxShadow: '0 16px 36px rgba(99, 85, 230, 0.08)',
                      textAlign: 'center'
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2" style={{ color: '#10B981', fontWeight: 700, fontSize: '0.82rem', letterSpacing: 1 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                      CHECK-IN SENTINEL RUNNING
                    </div>

                    <div style={{ fontSize: '3.6rem', fontWeight: 900, color: '#12102B', margin: '14px 0 8px' }}>
                      {formatTime(secondsLeft)}
                    </div>

                    {note && (
                      <div style={{ fontSize: '0.92rem', color: '#5E5B7A', fontStyle: 'italic', marginBottom: 20 }}>
                        "{note}"
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div style={{ background: '#F0EDFE', height: 8, borderRadius: 10, overflow: 'hidden', margin: '20px 0 28px' }}>
                      <div 
                        style={{ 
                          width: `${progressPercent}%`, 
                          background: '#6355E6', 
                          height: '100%', 
                          transition: 'width 1s linear' 
                        }} 
                      />
                    </div>

                    <div className="d-flex gap-3 justify-content-center">
                      <button 
                        onClick={handleImSafe}
                        style={{
                          background: '#10B981',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 12,
                          padding: '12px 28px',
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          cursor: 'pointer'
                        }}
                      >
                        ✓ I'm Safe (Complete Check-in)
                      </button>
                      
                      <button 
                        onClick={() => setSecondsLeft((s) => s + 15 * 60)}
                        style={{
                          background: '#F0EDFE',
                          color: '#6355E6',
                          border: '1px solid #D5CEFD',
                          borderRadius: 12,
                          padding: '12px 20px',
                          fontWeight: 600,
                          fontSize: '0.92rem',
                          cursor: 'pointer'
                        }}
                      >
                        +15 min
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </div>

            {/* Right Column: Information Pillars */}
            <div className="col-12 col-lg-5">
              <div style={{ paddingLeft: 'clamp(0px, 4vw, 40px)', borderLeft: '1px solid #ECEAF5' }}>
                
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

export default CheckInSentinel;
