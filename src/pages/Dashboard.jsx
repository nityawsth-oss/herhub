import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaShieldAlt, FaPhone, FaUsers,
  FaBell, FaCheckCircle, FaExclamationTriangle, FaMap
} from 'react-icons/fa';

const quickActions = [
  { icon: <FaPhone />,           label: 'Fake Call',        color: 'icon-pink',   path: '#!' },
  { icon: <FaMap />,             label: 'Safe Hubs',        color: 'icon-blue',   path: '/safe-hubs' },
  { icon: <FaUsers />,           label: 'My Guardians',     color: 'icon-purple', path: '/emergency-contacts' },
  { icon: <FaExclamationTriangle />, label: 'Report',       color: 'icon-orange', path: '/report' },
];

const recentAlerts = [
  { icon: '📍', text: 'Location shared with 3 guardians', time: '2 min ago',  color: '#10B981' },
  { icon: '👮', text: 'Nearby safe hub found — 0.3 km',   time: '10 min ago', color: '#3B82F6' },
  { icon: '✅', text: 'Journey safely completed',          time: '1 hr ago',   color: '#C4B5FD' },
];

function Dashboard() {
  const [sosActive, setSosActive] = useState(false);
  const [sosTimer,  setSosTimer]  = useState(null);

  /* Hold 2s to activate SOS */
  const handleSosDown = () => {
    const t = setTimeout(() => {
      setSosActive(true);
      alert('🚨 SOS Activated! Alerting your emergency contacts and dialing 112...');
      setTimeout(() => setSosActive(false), 4000);
    }, 2000);
    setSosTimer(t);
  };

  const handleSosUp = () => {
    clearTimeout(sosTimer);
  };

  return (
    <div className="dashboard-page">
      <div className="container">

        {/* ── Header ── */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="fw-800 mb-1" style={{ color: '#fff', fontWeight: 800 }}>
              Dashboard
            </h2>
            <p className="mb-0" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: '#10B981', fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#10B981', display: 'inline-block',
                    animation: 'pulse-dot 1.5s infinite',
                  }}
                />
                Protected · GPS Active
              </span>
              &nbsp;· Last updated just now
            </p>
          </div>
          <Link to="/report" className="btn btn-sos px-4 py-2">
            🚨 Report Incident
          </Link>
        </div>

        <div className="row g-4">

          {/* ── LEFT COLUMN ── */}
          <div className="col-12 col-lg-7">

            {/* Map */}
            <div className="dashboard-card mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="mb-0 fw-bold text-white">
                  <FaMapMarkerAlt style={{ color: '#EC4899', marginRight: 8 }} />
                  Your Location
                </h6>
                <Link to="/safe-hubs" className="btn btn-primary-pink py-1 px-3" style={{ fontSize: '0.8rem' }}>
                  View Full Map
                </Link>
              </div>

              <div className="map-placeholder">
                <FaMap style={{ fontSize: '3rem', color: '#7C3AED', opacity: 0.6 }} />
                <span style={{ fontSize: '0.9rem' }}>Interactive Map</span>
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  📍 New Delhi, India · GPS Active
                </span>
                <div className="d-flex gap-3 mt-2">
                  {[
                    { dot: '#3B82F6', label: 'Police Station' },
                    { dot: '#10B981', label: 'Hospital' },
                    { dot: '#7C3AED', label: 'Safe Zone' },
                  ].map((l) => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#94A3B8' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.dot, display: 'inline-block' }} />
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card">
              <h6 className="mb-3 fw-bold text-white">Quick Actions</h6>
              <div className="row g-3">
                {quickActions.map((a) => (
                  <div key={a.label} className="col-6 col-sm-3">
                    <Link
                      to={a.path}
                      className="d-flex flex-column align-items-center justify-content-center gap-2 text-decoration-none py-3 px-2"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(139,92,246,0.25)',
                        borderRadius: 14,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'}
                    >
                      <div className={`feature-icon-wrap ${a.color} mb-0`} style={{ width: 44, height: 44, fontSize: '1.1rem', borderRadius: 12 }}>
                        {a.icon}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#C4B5FD', fontWeight: 500 }}>
                        {a.label}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="col-12 col-lg-5 d-flex flex-column gap-4">

            {/* SOS Button */}
            <div className="dashboard-card text-center">
              <h6 className="mb-1 fw-bold text-white">Emergency SOS</h6>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: 24 }}>
                Hold button for 2 seconds to activate
              </p>

              <button
                className="big-sos-btn"
                style={{ background: sosActive ? '#DC2626' : undefined }}
                onMouseDown={handleSosDown}
                onMouseUp={handleSosUp}
                onTouchStart={handleSosDown}
                onTouchEnd={handleSosUp}
              >
                <FaShieldAlt style={{ fontSize: '2.2rem', marginBottom: 4 }} />
                <span style={{ fontSize: '1.1rem', letterSpacing: 2 }}>SOS</span>
              </button>

              {sosActive && (
                <div
                  className="mt-3 px-3 py-2"
                  style={{
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.4)',
                    borderRadius: 10,
                    color: '#EF4444',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  🚨 SOS Activated! Alerting guardians...
                </div>
              )}

              <p className="mt-3 mb-0" style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Will alert 3 guardians + dial 112
              </p>
            </div>

            {/* Status Cards */}
            <div className="dashboard-card">
              <h6 className="mb-3 fw-bold text-white">
                <FaShieldAlt style={{ color: '#7C3AED', marginRight: 8 }} />
                Safety Status
              </h6>
              <div className="d-flex flex-column gap-2">
                {[
                  { icon: <FaCheckCircle />, label: 'GPS Tracking',    status: 'Active',  color: '#10B981' },
                  { icon: <FaUsers />,       label: 'Guardians',       status: '3 Added', color: '#C4B5FD' },
                  { icon: <FaBell />,        label: 'Notifications',   status: 'On',      color: '#EC4899' },
                  { icon: <FaShieldAlt />,   label: 'Safety Shield',   status: 'Armed',   color: '#7C3AED' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="d-flex align-items-center justify-content-between px-3 py-2"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(139,92,246,0.15)',
                      borderRadius: 10,
                    }}
                  >
                    <div className="d-flex align-items-center gap-2" style={{ color: '#94A3B8', fontSize: '0.87rem' }}>
                      <span style={{ color: s.color }}>{s.icon}</span>
                      {s.label}
                    </div>
                    <span style={{ color: s.color, fontSize: '0.8rem', fontWeight: 600 }}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="dashboard-card">
              <h6 className="mb-3 fw-bold text-white">
                <FaBell style={{ color: '#EC4899', marginRight: 8 }} />
                Recent Activity
              </h6>
              <div className="d-flex flex-column gap-2">
                {recentAlerts.map((a) => (
                  <div
                    key={a.text}
                    className="d-flex align-items-start gap-3 px-3 py-2"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(139,92,246,0.15)',
                      borderRadius: 10,
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{a.icon}</span>
                    <div className="flex-grow-1">
                      <div style={{ fontSize: '0.82rem', color: a.color, fontWeight: 500 }}>{a.text}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 2 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
