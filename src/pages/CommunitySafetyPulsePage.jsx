import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaExclamationCircle, FaShieldAlt, FaMapMarkerAlt, FaPlus, FaCheck } from 'react-icons/fa';

function CommunitySafetyPulsePage() {
  const [demoStarted, setDemoStarted] = useState(false);
  const [concernType, setConcernType] = useState('lighting');
  const [locationNote, setLocationNote] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const sampleCommunityPosts = [
    {
      id: 1,
      tag: 'Lighting Notice',
      tagColor: '#6355E6',
      title: 'Streetlamp repair underway near Metro Gate 2',
      time: '2 hours ago · Connaught Place Corridor',
      desc: 'Municipal crew was observed fixing two flickering lamps near the south subway underpass.'
    },
    {
      id: 2,
      tag: 'Transit Awareness',
      tagColor: '#10B981',
      title: 'Active auto stand staffed until 11:30 PM',
      time: 'Today · Sector 18 Transit Plaza',
      desc: 'Prepaid booth is active with women helpdesk personnel on duty.'
    }
  ];

  const handleSubmitConcern = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
                UNDERSTAND · DEMO
              </div>

              <h1 
                style={{ 
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', 
                  fontWeight: 800, 
                  letterSpacing: '-0.5px',
                  marginBottom: 16 
                }}
              >
                Community Safety Pulse
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
                Review fictional awareness posts and submit a concern privately. This is a guided, educational experience built to support informed choices—not to predict danger or replace professional support.
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

            {/* Right Large Concentric Circle Pulse Graphic */}
            <div className="col-12 col-md-3 col-lg-4 text-center text-md-end mt-4 mt-md-0">
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  border: '8px solid rgba(138, 124, 254, 0.35)',
                  background: 'transparent',
                  position: 'relative'
                }}
              >
                <div 
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: '#8A7CFE',
                    opacity: 0.95
                  }}
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ════════ GUIDED DEMO & GUIDELINES ════════ */}
      <section style={{ padding: '60px 0 100px' }}>
        <div className="container">
          <div className="row gy-5">

            {/* Left Column: Demo Card / Interactive View */}
            <div className="col-12 col-lg-8">
              
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
                Explore this guided demo
              </h2>

              {!demoStarted ? (
                /* The Initial Big Guided Demo Card */
                <div 
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E9E7F2',
                    borderRadius: 20,
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24,
                    boxShadow: '0 8px 24px rgba(18, 16, 43, 0.04)'
                  }}
                  className="flex-md-row align-items-center"
                >
                  
                  {/* Left Purple Box with Pulse Icon */}
                  <div 
                    style={{
                      background: '#F0EDFE',
                      borderRadius: 18,
                      width: '100%',
                      maxWidth: 200,
                      height: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <div 
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        border: '5px solid #D5CEFD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16
                      }}
                    >
                      <div 
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: '#6355E6'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#716E8C', fontWeight: 500 }}>
                      Ready when you are
                    </span>
                  </div>

                  {/* Right Description & Button */}
                  <div style={{ flex: 1, paddingLeft: 'clamp(0px, 2vw, 16px)' }}>
                    
                    <span 
                      style={{
                        display: 'inline-block',
                        background: '#F0EDFE',
                        color: '#6355E6',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        padding: '4px 10px',
                        borderRadius: 6,
                        textTransform: 'uppercase',
                        marginBottom: 12
                      }}
                    >
                      DEMO
                    </span>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#12102B', marginBottom: 12 }}>
                      A thoughtful, private starting point
                    </h3>

                    <p style={{ fontSize: '0.9rem', color: '#555271', lineHeight: 1.65, marginBottom: 24 }}>
                      Walk through sample inputs and explanations. This demo uses fictional data and does not access your microphone, camera, location, contacts, or files.
                    </p>

                    <button 
                      onClick={() => setDemoStarted(true)}
                      style={{
                        background: '#6355E6',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 12,
                        padding: '12px 24px',
                        fontWeight: 600,
                        fontSize: '0.92rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(99, 85, 230, 0.28)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5244D4'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6355E6'}
                    >
                      <span>Start demo</span>
                      <span>→</span>
                    </button>

                  </div>

                </div>
              ) : (
                /* Interactive Community Pulse Demonstration */
                <div 
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #D5CEFD',
                    borderRadius: 20,
                    padding: '32px',
                    boxShadow: '0 12px 30px rgba(99, 85, 230, 0.08)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                    <div>
                      <h4 style={{ fontWeight: 800, color: '#12102B', margin: 0 }}>
                        Fictional Community Awareness & Concern Logger
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: '#716E8C' }}>Sample community updates & private reflection form</span>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => { setDemoStarted(false); setSubmitted(false); }}
                      style={{ borderRadius: 8, fontSize: '0.78rem' }}
                    >
                      Reset Demo
                    </button>
                  </div>

                  {/* Sample Awareness Feed */}
                  <h5 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#12102B', marginBottom: 12 }}>
                    Recent Awareness Updates
                  </h5>
                  <div className="d-flex flex-column gap-3 mb-4">
                    {sampleCommunityPosts.map(post => (
                      <div 
                        key={post.id}
                        className="p-3 border rounded-3"
                        style={{ borderColor: '#E9E7F2', background: '#FAFAFD' }}
                      >
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span 
                            style={{ 
                              fontSize: '0.7rem', 
                              fontWeight: 700, 
                              color: post.tagColor, 
                              background: '#F0EDFE', 
                              padding: '2px 8px', 
                              borderRadius: 4 
                            }}
                          >
                            {post.tag}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#8E8BA7' }}>{post.time}</span>
                        </div>
                        <div style={{ fontWeight: 700, color: '#12102B', fontSize: '0.9rem' }}>{post.title}</div>
                        <div style={{ color: '#555271', fontSize: '0.82rem', marginTop: 4 }}>{post.desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Form to submit a concern */}
                  <h5 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#12102B', marginBottom: 12 }}>
                    Privately Log a Concern (Sample Form)
                  </h5>

                  {!submitted ? (
                    <form onSubmit={handleSubmitConcern}>
                      <div className="mb-3">
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Observation Category</label>
                        <select 
                          className="form-select"
                          value={concernType}
                          onChange={(e) => setConcernType(e.target.value)}
                          style={{ borderRadius: 10, borderColor: '#E9E7F2' }}
                        >
                          <option value="lighting">Poor or malfunctioning streetlighting</option>
                          <option value="deserted">Unregulated corner / deserted subway path</option>
                          <option value="transit">Irregular cab / unmetered auto stand</option>
                          <option value="harassment">Inappropriate behavior or street harassment</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Fictional Location</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. Underpass near Sector 18 Metro"
                          value={locationNote}
                          onChange={(e) => setLocationNote(e.target.value)}
                          style={{ borderRadius: 10, borderColor: '#E9E7F2' }}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Observation Note</label>
                        <textarea 
                          className="form-control" 
                          rows={3}
                          placeholder="Describe what you noticed to help keep others informed..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          style={{ borderRadius: 10, borderColor: '#E9E7F2' }}
                        />
                      </div>

                      <button 
                        type="submit"
                        style={{
                          background: '#6355E6',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 12,
                          padding: '12px 24px',
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          cursor: 'pointer'
                        }}
                      >
                        Submit Anonymous Concern (Demo)
                      </button>
                    </form>
                  ) : (
                    <div className="p-3 rounded-3" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46' }}>
                      <div className="d-flex align-items-center gap-2 mb-1" style={{ fontWeight: 700 }}>
                        <FaCheckCircle />
                        <span>Concern Recorded Privately</span>
                      </div>
                      <div style={{ fontSize: '0.82rem' }}>
                        Your sample concern has been logged anonymously. In real operation, no personal identifiers or account details are attached to community updates.
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Right Column: Information Pillars */}
            <div className="col-12 col-lg-4">
              <div style={{ paddingLeft: 'clamp(0px, 3vw, 30px)', borderLeft: '1px solid #ECEAF5' }}>
                
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

export default CommunitySafetyPulsePage;
