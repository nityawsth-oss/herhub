import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShieldAlt, FaClock, FaLightbulb, FaStore, FaWalking, FaRedo } from 'react-icons/fa';

function WhatIfRouteSimulatorPage() {
  const [demoStarted, setDemoStarted] = useState(false);
  const [activeScenario, setActiveScenario] = useState('night_bus'); // 'night_bus' | 'metro_hostel' | 'cab_gated'
  const [timeOfDay, setTimeOfDay] = useState('late_night'); // 'evening' | 'late_night'
  const [walkingWith, setWalkingWith] = useState('solo'); // 'solo' | 'companion'
  const [localNoteSaved, setLocalNoteSaved] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Scenarios data
  const scenarios = {
    night_bus: {
      title: 'Bus Stop to Apartment Complex (9:45 PM)',
      subtitle: 'Fictional suburban commute comparison',
      routeA: {
        name: 'Option A: Main Avenue Corridor',
        tag: 'RECOMMENDED FOR CALM VISIBILITY',
        tagColor: '#10B981',
        tagBg: '#ECFDF5',
        dist: '1.4 km',
        time: '18 mins',
        lighting: '94% continuous street LED lighting',
        lightingLevel: 94,
        amenities: '8 open shops, 2 late-night chemists, 1 bank ATM',
        footTraffic: 'Moderate pedestrian & vehicular movement',
        exits: '3 intersecting feeder roads with clear signage',
        tradeoff: '+4 min slower, but unobstructed and well-trafficked'
      },
      routeB: {
        name: 'Option B: Residential Shortcut Lane',
        tag: 'FASTER BUT LESS VISIBILITY',
        tagColor: '#F59E0B',
        tagBg: '#FEF3C7',
        dist: '0.9 km',
        time: '11 mins',
        lighting: '38% intermittent streetlights (tree canopy cover)',
        lightingLevel: 38,
        amenities: 'Closed residential gates, zero open storefronts',
        footTraffic: 'Very low / sporadic',
        exits: 'Narrow one-way alleyway with blind turns',
        tradeoff: 'Saves 7 minutes, but high isolation after 8:30 PM'
      },
      reflection: 'Simulated observation: Choosing Option A adds just 4 minutes of walking time, but increases visible open storefronts by 8x and provides near-continuous streetlamp illumination.'
    },
    metro_hostel: {
      title: 'Metro Station to University Hostel (10:15 PM)',
      subtitle: 'Fictional campus transit comparison',
      routeA: {
        name: 'Option A: Campus Outer Ring Boulevard',
        tag: 'RECOMMENDED FOR CALM VISIBILITY',
        tagColor: '#10B981',
        tagBg: '#ECFDF5',
        dist: '1.8 km',
        time: '22 mins',
        lighting: '98% brightly illuminated campus perimeter',
        lightingLevel: 98,
        amenities: '2 campus security kiosks, continuous CCTV presence',
        footTraffic: 'Regular student shuttles and security patrols',
        exits: 'Manned barrier entry gates at 200m intervals',
        tradeoff: 'Longer route, but monitored and fully paved'
      },
      routeB: {
        name: 'Option B: Botanical Garden Walking Path',
        tag: 'UNLIT PARKWAY SHORTCUT',
        tagColor: '#EF4444',
        tagBg: '#FEE2E2',
        dist: '1.1 km',
        time: '13 mins',
        lighting: '15% solar bollard lamps (low intensity)',
        lightingLevel: 15,
        amenities: 'No commercial or institutional staff after sunset',
        footTraffic: 'Deserted after dusk',
        exits: 'Single exit at opposite hostel gate',
        tradeoff: 'Saves 9 minutes, but zero lighting or quick help points'
      },
      reflection: 'Simulated observation: Parkways offer pleasant daytime walks, but lack natural ambient lighting and quick assistance points after sunset. Boulevard route remains the informed preference.'
    },
    cab_gated: {
      title: 'Cab Drop-off Point to Gated Society (11:00 PM)',
      subtitle: 'Fictional highway drop-off choice',
      routeA: {
        name: 'Option A: Main Gate Security Boulevard',
        tag: 'RECOMMENDED FOR CALM VISIBILITY',
        tagColor: '#10B981',
        tagBg: '#ECFDF5',
        dist: '0.6 km',
        time: '8 mins',
        lighting: '100% sodium-vapor boulevard lighting',
        lightingLevel: 100,
        amenities: '24/7 security booth, visitor desk, well-lit entrance',
        footTraffic: 'Resident vehicles and gate guards present',
        exits: 'Broad double-lane carriageway with pedestrian sidewalk',
        tradeoff: 'Requires driver to take 2-min highway U-turn'
      },
      routeB: {
        name: 'Option B: Rear Service Gate Drop-off',
        tag: 'UNGUARDED SERVICE ENTRY',
        tagColor: '#F59E0B',
        tagBg: '#FEF3C7',
        dist: '0.2 km',
        time: '3 mins',
        lighting: '25% single floodlight near waste bins',
        lightingLevel: 25,
        amenities: 'Service entrance, locked pedestrian turnstile',
        footTraffic: 'None; service lane is inactive at night',
        exits: 'Cul-de-sac requiring keycard tap in the dark',
        tradeoff: 'Driver leaves sooner, but turnstile might be chained'
      },
      reflection: 'Simulated observation: Requesting cab drop-off at the Main 24/7 gate eliminates unlit waiting time and verifies security staff availability before concluding the ride.'
    }
  };

  const current = scenarios[activeScenario];

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
                PROTECT · SIMULATED
              </div>

              <h1 
                style={{ 
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', 
                  fontWeight: 800, 
                  letterSpacing: '-0.5px',
                  marginBottom: 16 
                }}
              >
                What-If Route Simulator
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
                Compare fictional route scenarios and their assumptions. This is a guided, educational experience built to support informed choices—not to predict danger or replace professional support.
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
                SIMULATED · NO EXTERNAL SERVICE CONNECTED
              </span>
            </div>

            {/* Right Large Stylized Command / Looped Square Graphic */}
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
                {/* Looped square command symbol SVG */}
                <svg 
                  width="110" 
                  height="110" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
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
                            width: 86,
                            height: 86,
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#7967FD',
                            marginBottom: 16,
                            boxShadow: '0 4px 14px rgba(121, 103, 253, 0.12)'
                          }}
                        >
                          <svg 
                            width="42" 
                            height="42" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0 3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
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
                        SIMULATED
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
                /* ── ACTIVE INTERACTIVE ROUTE SIMULATOR WORKSPACE ── */
                <div 
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    border: '1px solid #ECECF2',
                    padding: '32px',
                    boxShadow: '0 8px 30px rgba(18, 16, 43, 0.05)'
                  }}
                >
                  
                  {/* Scenario Switcher Tabs */}
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-4 border-bottom">
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6355E6', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        Fictional Scenario
                      </span>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#160D33', margin: '4px 0 0' }}>
                        {current.title}
                      </h4>
                      <small style={{ color: '#7E7A97' }}>{current.subtitle}</small>
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

                  {/* Scenario selection pills */}
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => setActiveScenario('night_bus')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 10,
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: activeScenario === 'night_bus' ? '#6355E6' : '#E5E3EE',
                        backgroundColor: activeScenario === 'night_bus' ? '#EDE8FE' : '#F9F8FD',
                        color: activeScenario === 'night_bus' ? '#6355E6' : '#555'
                      }}
                    >
                      🚌 Bus Stop to Home
                    </button>
                    <button
                      onClick={() => setActiveScenario('metro_hostel')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 10,
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: activeScenario === 'metro_hostel' ? '#6355E6' : '#E5E3EE',
                        backgroundColor: activeScenario === 'metro_hostel' ? '#EDE8FE' : '#F9F8FD',
                        color: activeScenario === 'metro_hostel' ? '#6355E6' : '#555'
                      }}
                    >
                      🚇 Metro to Hostel
                    </button>
                    <button
                      onClick={() => setActiveScenario('cab_gated')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 10,
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: activeScenario === 'cab_gated' ? '#6355E6' : '#E5E3EE',
                        backgroundColor: activeScenario === 'cab_gated' ? '#EDE8FE' : '#F9F8FD',
                        color: activeScenario === 'cab_gated' ? '#6355E6' : '#555'
                      }}
                    >
                      🚕 Cab Drop-off Point
                    </button>
                  </div>

                  {/* Variables: Time & Companion */}
                  <div className="p-3 mb-4 rounded-3" style={{ backgroundColor: '#F8F7FC', border: '1px solid #ECEAF5' }}>
                    <div className="row g-3 align-items-center">
                      <div className="col-12 col-sm-6">
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6355E6', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                          Simulated Time of Day
                        </label>
                        <div className="btn-group w-100" role="group">
                          <button
                            type="button"
                            className={`btn btn-sm ${timeOfDay === 'evening' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setTimeOfDay('evening')}
                            style={{ 
                              backgroundColor: timeOfDay === 'evening' ? '#6355E6' : 'transparent',
                              borderColor: '#6355E6',
                              fontSize: '0.82rem',
                              fontWeight: 600
                            }}
                          >
                            🌇 Evening (6:30 PM)
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${timeOfDay === 'late_night' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setTimeOfDay('late_night')}
                            style={{ 
                              backgroundColor: timeOfDay === 'late_night' ? '#6355E6' : 'transparent',
                              borderColor: '#6355E6',
                              fontSize: '0.82rem',
                              fontWeight: 600
                            }}
                          >
                            🌙 Late Night (10:30 PM)
                          </button>
                        </div>
                      </div>

                      <div className="col-12 col-sm-6">
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6355E6', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                          Walking Scenario
                        </label>
                        <div className="btn-group w-100" role="group">
                          <button
                            type="button"
                            className={`btn btn-sm ${walkingWith === 'solo' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setWalkingWith('solo')}
                            style={{ 
                              backgroundColor: walkingWith === 'solo' ? '#6355E6' : 'transparent',
                              borderColor: '#6355E6',
                              fontSize: '0.82rem',
                              fontWeight: 600
                            }}
                          >
                            🚶‍♀️ Walking Solo
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${walkingWith === 'companion' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setWalkingWith('companion')}
                            style={{ 
                              backgroundColor: walkingWith === 'companion' ? '#6355E6' : 'transparent',
                              borderColor: '#6355E6',
                              fontSize: '0.82rem',
                              fontWeight: 600
                            }}
                          >
                            👥 With Companion
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2-COLUMN ROUTE COMPARATOR */}
                  <div className="row g-4 mb-4">
                    
                    {/* Option A (Recommended) */}
                    <div className="col-12 col-md-6">
                      <div 
                        style={{
                          border: '2px solid #10B981',
                          borderRadius: 18,
                          padding: '22px',
                          backgroundColor: '#FAFCFA',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <span 
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            letterSpacing: '0.7px',
                            color: current.routeA.tagColor,
                            backgroundColor: current.routeA.tagBg,
                            padding: '4px 10px',
                            borderRadius: 20,
                            display: 'inline-block',
                            width: 'fit-content',
                            marginBottom: 12
                          }}
                        >
                          {current.routeA.tag}
                        </span>

                        <h5 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#160D33', marginBottom: 12 }}>
                          {current.routeA.name}
                        </h5>

                        <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                          <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.88rem' }}>
                            <FaWalking style={{ color: '#6355E6' }} />
                            <strong>{current.routeA.dist}</strong>
                          </div>
                          <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.88rem' }}>
                            <FaClock style={{ color: '#6355E6' }} />
                            <strong>{current.routeA.time}</strong>
                          </div>
                        </div>

                        {/* Factors */}
                        <div style={{ fontSize: '0.84rem', lineHeight: 1.6, flexGrow: 1 }}>
                          <div className="mb-2">
                            <span className="text-muted d-block" style={{ fontSize: '0.75rem', fontWeight: 600 }}>STREET LIGHTING</span>
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <div className="progress flex-grow-1" style={{ height: 6 }}>
                                <div className="progress-bar bg-success" style={{ width: `${current.routeA.lightingLevel}%` }}></div>
                              </div>
                              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10B981' }}>{current.routeA.lightingLevel}%</span>
                            </div>
                            <small className="text-secondary">{current.routeA.lighting}</small>
                          </div>

                          <div className="mb-2 mt-3">
                            <span className="text-muted d-block" style={{ fontSize: '0.75rem', fontWeight: 600 }}>SURROUNDINGS</span>
                            <div className="d-flex align-items-start gap-2 mt-1">
                              <FaStore style={{ color: '#10B981', marginTop: 3, flexShrink: 0 }} />
                              <span>{current.routeA.amenities}</span>
                            </div>
                          </div>

                          <div className="mb-2 mt-3">
                            <span className="text-muted d-block" style={{ fontSize: '0.75rem', fontWeight: 600 }}>PEDESTRIAN TRAFFIC</span>
                            <span>{current.routeA.footTraffic}</span>
                          </div>

                          <div className="mt-3 p-2 rounded" style={{ backgroundColor: '#ECFDF5', fontSize: '0.8rem', color: '#065F46' }}>
                            <strong>Informed takeaway:</strong> {current.routeA.tradeoff}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Option B (Shortcut Alley) */}
                    <div className="col-12 col-md-6">
                      <div 
                        style={{
                          border: '1px solid #E5E3EE',
                          borderRadius: 18,
                          padding: '22px',
                          backgroundColor: '#FFFFFF',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <span 
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            letterSpacing: '0.7px',
                            color: current.routeB.tagColor,
                            backgroundColor: current.routeB.tagBg,
                            padding: '4px 10px',
                            borderRadius: 20,
                            display: 'inline-block',
                            width: 'fit-content',
                            marginBottom: 12
                          }}
                        >
                          {current.routeB.tag}
                        </span>

                        <h5 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#160D33', marginBottom: 12 }}>
                          {current.routeB.name}
                        </h5>

                        <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                          <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.88rem' }}>
                            <FaWalking style={{ color: '#888' }} />
                            <strong>{current.routeB.dist}</strong>
                          </div>
                          <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.88rem' }}>
                            <FaClock style={{ color: '#888' }} />
                            <strong>{current.routeB.time}</strong>
                          </div>
                        </div>

                        {/* Factors */}
                        <div style={{ fontSize: '0.84rem', lineHeight: 1.6, flexGrow: 1 }}>
                          <div className="mb-2">
                            <span className="text-muted d-block" style={{ fontSize: '0.75rem', fontWeight: 600 }}>STREET LIGHTING</span>
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <div className="progress flex-grow-1" style={{ height: 6 }}>
                                <div className="progress-bar bg-warning" style={{ width: `${current.routeB.lightingLevel}%` }}></div>
                              </div>
                              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#D97706' }}>{current.routeB.lightingLevel}%</span>
                            </div>
                            <small className="text-secondary">{current.routeB.lighting}</small>
                          </div>

                          <div className="mb-2 mt-3">
                            <span className="text-muted d-block" style={{ fontSize: '0.75rem', fontWeight: 600 }}>SURROUNDINGS</span>
                            <div className="d-flex align-items-start gap-2 mt-1 text-muted">
                              <FaLightbulb style={{ color: '#D97706', marginTop: 3, flexShrink: 0 }} />
                              <span>{current.routeB.amenities}</span>
                            </div>
                          </div>

                          <div className="mb-2 mt-3">
                            <span className="text-muted d-block" style={{ fontSize: '0.75rem', fontWeight: 600 }}>PEDESTRIAN TRAFFIC</span>
                            <span className="text-muted">{current.routeB.footTraffic}</span>
                          </div>

                          <div className="mt-3 p-2 rounded" style={{ backgroundColor: '#FEF3C7', fontSize: '0.8rem', color: '#92400E' }}>
                            <strong>Informed takeaway:</strong> {current.routeB.tradeoff}
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Summary Reflection Callout */}
                  <div 
                    style={{
                      backgroundColor: '#F7F5FE',
                      border: '1px solid #E2DCFA',
                      borderRadius: 16,
                      padding: '18px 24px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 16
                    }}
                  >
                    <div 
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        backgroundColor: '#6355E6',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <FaShieldAlt style={{ fontSize: '0.95rem' }} />
                    </div>
                    <div>
                      <strong style={{ color: '#160D33', fontSize: '0.92rem', display: 'block', marginBottom: 4 }}>
                        Educational Summary
                      </strong>
                      <p style={{ color: '#4F4A6E', fontSize: '0.88rem', margin: 0, lineHeight: 1.55 }}>
                        {current.reflection}
                      </p>
                    </div>
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
              placeholder="e.g. For late night walks from the bus stop, always pick Option A via Main Avenue..."
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

export default WhatIfRouteSimulatorPage;
