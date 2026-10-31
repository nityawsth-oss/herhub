import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaDatabase, FaShieldAlt, FaUnlock, FaEye, FaEyeSlash,
  FaCopy, FaCheckCircle, FaSignOutAlt,
  FaUsers, FaExclamationTriangle, FaTrain, FaCar, FaSyncAlt,
  FaChartBar, FaServer, FaKey
} from 'react-icons/fa';
import { getDatabaseTelemetry, getSosIncidents, getEmergencyContacts, getSoloTrips, getVehicleScans } from '../services/databaseService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { useTheme } from '../context/ThemeContext';

// --- Admin Credentials ---
const ADMIN_PASSWORD = 'herhub@admin2026';
const ADMIN_KEY      = 'HERHUB_ADMIN_UNLOCKED';

export default function AdminDashboardPage() {
  const { isDark } = useTheme();
  const navigate    = useNavigate();

  // Auth state
  const [unlocked,    setUnlocked]    = useState(() => sessionStorage.getItem(ADMIN_KEY) === 'true');
  const [pwInput,     setPwInput]     = useState('');
  const [showPw,      setShowPw]      = useState(false);
  const [pwError,     setPwError]     = useState('');

  // Data state
  const [telemetry,   setTelemetry]   = useState(null);
  const [sosRecords,  setSosRecords]  = useState([]);
  const [contacts,    setContacts]    = useState([]);
  const [trips,       setTrips]       = useState([]);
  const [scans,       setScans]       = useState([]);
  const [activeTab,   setActiveTab]   = useState('overview');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [refreshing,  setRefreshing]  = useState(false);

  const theme = {
    bg:         isDark ? '#080516' : '#F0EFFA',
    card:       isDark ? '#110D2A' : '#FFFFFF',
    border:     isDark ? '#2A2055' : '#E2E0F0',
    text:       isDark ? '#E8E4FF' : '#1A1440',
    sub:        isDark ? '#8B82C4' : '#6B5FA0',
    input:      isDark ? '#1C1640' : '#F5F3FF',
    inputBorder: isDark ? '#3D3472' : '#C8C2F0',
  };

  const SCHEMA_SQL = `-- HerHub Supabase Schema v2.0 (Paste in SQL Editor -> Run)
CREATE TABLE IF NOT EXISTS sos_incidents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_type text NOT NULL,
  latitude float8, longitude float8,
  accuracy_meters text DEFAULT '5m',
  guardian_phone text DEFAULT '+91 75240 72395',
  status text DEFAULT 'active',
  whatsapp_dispatched bool DEFAULT false,
  siren_decibels int DEFAULT 105,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id text PRIMARY KEY,
  name text NOT NULL, relation text,
  phone text NOT NULL, avatar text, color text,
  notify_on_sos bool DEFAULT true,
  share_location bool DEFAULT true,
  verified bool DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS solo_trips (
  id text PRIMARY KEY,
  trip_title text, origin_city text, origin_station text,
  destination_city text, destination_station text,
  train_number text, train_name text,
  coach_number text, seat_number text,
  guardian_phone text DEFAULT '+91 75240 72395',
  trip_status text DEFAULT 'in_transit',
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS vehicle_scans (
  id text PRIMARY KEY,
  plate_number text NOT NULL, state_code text,
  rto_office text, vehicle_model text, vehicle_class text,
  registered_owner text, father_name text,
  commercial_permit_no text, permit_valid_until text,
  child_lock_hazard bool DEFAULT false,
  police_cleared bool DEFAULT true,
  scanned_at timestamptz DEFAULT now()
);`;

  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [tel, sos, ctc, trp, veh] = await Promise.all([
        Promise.resolve(getDatabaseTelemetry()),
        getSosIncidents(),
        getEmergencyContacts(),
        getSoloTrips(),
        getVehicleScans()
      ]);
      setTelemetry(tel);
      setSosRecords(sos || []);
      setContacts(ctc || []);
      setTrips(trp || []);
      setScans(veh || []);
    } catch (e) {
      console.warn('Admin load error:', e);
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (unlocked) loadData();
  }, [unlocked, loadData]);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_KEY, 'true');
      setUnlocked(true);
      setPwError('');
    } else {
      setPwError('Incorrect admin password. Access denied.');
      setPwInput('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_KEY);
    setUnlocked(false);
    navigate('/');
  };

  const copySchema = () => {
    navigator.clipboard.writeText(SCHEMA_SQL).then(() => {
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2500);
    }).catch(() => {});
  };

  if (!unlocked) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: theme.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20
      }}>
        <div style={{
          backgroundColor: theme.card,
          border: `1.5px solid ${theme.border}`,
          borderRadius: 24, padding: '40px 36px',
          width: '100%', maxWidth: 420,
          boxShadow: isDark ? '0 0 60px rgba(99,85,230,0.2)' : '0 12px 40px rgba(99,85,230,0.12)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, #6355E6, #E03577)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <FaShieldAlt style={{ color: '#fff', fontSize: '1.6rem' }} />
            </div>
            <h2 style={{ fontWeight: 900, color: theme.text, marginBottom: 4, fontSize: '1.4rem' }}>
              HerHub Admin Panel
            </h2>
            <p style={{ color: theme.sub, fontSize: '0.82rem', margin: 0 }}>
              Restricted Access - Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.sub, display: 'block', marginBottom: 6 }}>
              <FaKey style={{ marginRight: 6 }} />Admin Password
            </label>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={pwInput}
                onChange={e => { setPwInput(e.target.value); setPwError(''); }}
                placeholder="Enter admin password"
                autoFocus
                style={{
                  width: '100%', padding: '12px 44px 12px 14px',
                  borderRadius: 12, border: `1.5px solid ${pwError ? '#EF4444' : theme.inputBorder}`,
                  backgroundColor: theme.input, color: theme.text,
                  fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: theme.sub, cursor: 'pointer', padding: 0
                }}
              >
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {pwError && (
              <div style={{ color: '#EF4444', fontSize: '0.78rem', marginBottom: 12, fontWeight: 600 }}>
                {pwError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%', padding: '13px',
                background: 'linear-gradient(135deg, #6355E6, #E03577)',
                color: '#fff', border: 'none', borderRadius: 12,
                fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(99,85,230,0.35)'
              }}
            >
              <FaUnlock style={{ marginRight: 8 }} />
              Access Admin Panel
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', color: theme.sub, fontSize: '0.78rem', cursor: 'pointer' }}
            >
              Back to HerHub
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCloud = isSupabaseConfigured();
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'sos',      label: 'SOS Logs', icon: FaExclamationTriangle },
    { id: 'contacts', label: 'Contacts', icon: FaUsers },
    { id: 'trips',    label: 'Trips',    icon: FaTrain },
    { id: 'vehicles', label: 'Vehicles', icon: FaCar },
    { id: 'schema',   label: 'Schema',   icon: FaServer },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, paddingBottom: 60 }}>
      {/* Top Bar */}
      <div style={{
        backgroundColor: isDark ? '#0D0820' : '#1A1440',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '2px solid #6355E6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6355E6, #E03577)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FaDatabase style={{ color: '#fff', fontSize: '1rem' }} />
          </div>
          <div>
            <div style={{ fontWeight: 900, color: '#FFFFFF', fontSize: '1rem' }}>HerHub Admin Panel</div>
            <div style={{ fontSize: '0.68rem', color: '#9887FE' }}>Database Intelligence Dashboard</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            padding: '4px 12px', borderRadius: 20,
            backgroundColor: isCloud ? 'rgba(16,185,129,0.15)' : 'rgba(99,85,230,0.15)',
            border: isCloud ? '1px solid #10B981' : '1px solid #6355E6',
            fontSize: '0.72rem', fontWeight: 700,
            color: isCloud ? '#10B981' : '#9887FE'
          }}>
            {isCloud ? 'Supabase PostgreSQL Cloud' : 'Local Encrypted Vault'}
          </div>
          <button
            onClick={loadData}
            disabled={refreshing}
            style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8, padding: '5px 10px', color: '#fff', cursor: 'pointer', fontSize: '0.8rem'
            }}
            title="Refresh database records"
          >
            <FaSyncAlt style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8, padding: '5px 12px', color: '#EF4444',
              cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        backgroundColor: isDark ? '#0F0B25' : '#1E1660',
        padding: '0 24px',
        display: 'flex', gap: 4, overflowX: 'auto'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 16px',
              background: 'none', border: 'none',
              borderBottom: activeTab === tab.id ? '2.5px solid #9887FE' : '2.5px solid transparent',
              color: activeTab === tab.id ? '#FFFFFF' : '#9887FE',
              fontWeight: activeTab === tab.id ? 800 : 500,
              fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
        {activeTab === 'overview' && telemetry && (
          <div>
            <h3 style={{ color: theme.text, fontWeight: 900, marginBottom: 20 }}>Database Metrics Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'SOS Incidents', count: telemetry.counts.sos_incidents, color: '#EF4444', desc: 'Total SOS events logged' },
                { label: 'Emergency Contacts', count: telemetry.counts.emergency_contacts, color: '#F59E0B', desc: 'Guardian contacts saved' },
                { label: 'Solo Trips', count: telemetry.counts.solo_trips, color: '#10B981', desc: 'Journey records stored' },
                { label: 'Vehicle Scans', count: telemetry.counts.vehicle_scans, color: '#3B82F6', desc: 'VAHAN audits performed' },
                { label: 'Total Records', count: telemetry.counts.total_records, color: '#8B5CF6', desc: 'Total database entries' },
              ].map(item => (
                <div key={item.label} style={{
                  backgroundColor: theme.card,
                  border: `1.5px solid ${item.color}30`,
                  borderRadius: 16, padding: '20px 18px'
                }}>
                  <div style={{ fontWeight: 900, fontSize: '2rem', color: item.color, lineHeight: 1 }}>{item.count}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: theme.text, marginTop: 4 }}>{item.label}</div>
                  <div style={{ fontSize: '0.7rem', color: theme.sub, marginTop: 2 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{
              backgroundColor: theme.card, border: `1px solid ${theme.border}`,
              borderRadius: 16, padding: 20
            }}>
              <div style={{ fontWeight: 800, color: theme.text, marginBottom: 14, fontSize: '0.9rem' }}>
                System Configuration & Architecture
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Engine Mode', telemetry.mode],
                  ['Primary Guardian Contact', telemetry.primaryGuardian],
                  ['Last Synchronized', telemetry.lastSync],
                  ['Database Endpoint', isCloud ? telemetry.url : 'Local Persistent Storage (Client Fallback)'],
                  ['Active Tables', telemetry.tables?.join(', ')],
                  ['Cloud Sync Status', isCloud ? 'Supabase Connected' : 'Offline Vault Active'],
                ].map(([k, v]) => (
                  <div key={k} style={{ padding: '10px 12px', backgroundColor: isDark ? '#16103A' : '#F5F3FF', borderRadius: 10 }}>
                    <div style={{ fontSize: '0.68rem', color: theme.sub, fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{k}</div>
                    <div style={{ fontSize: '0.78rem', color: theme.text, fontWeight: 600, wordBreak: 'break-all' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sos' && (
          <div>
            <h3 style={{ color: theme.text, fontWeight: 900, marginBottom: 20 }}>SOS Incident History ({sosRecords.length})</h3>
            {sosRecords.length === 0 ? (
              <div style={{ textAlign: 'center', color: theme.sub, padding: 60, backgroundColor: theme.card, borderRadius: 16 }}>
                No SOS incidents recorded yet.
              </div>
            ) : sosRecords.map((r, i) => (
              <div key={i} style={{
                backgroundColor: theme.card, border: `1px solid ${theme.border}`,
                borderRadius: 14, padding: '16px 18px', marginBottom: 12
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{
                    backgroundColor: r.whatsapp_dispatched ? 'rgba(37,211,102,0.15)' : 'rgba(239,68,68,0.12)',
                    color: r.whatsapp_dispatched ? '#25D366' : '#EF4444',
                    padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700
                  }}>
                    {r.whatsapp_dispatched ? 'WhatsApp Dispatched' : 'Alarm Triggered (Standby)'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: theme.sub }}>
                    {r.created_at ? new Date(r.created_at).toLocaleString('en-US') : 'Recorded recently'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, fontSize: '0.74rem' }}>
                  <div><span style={{ color: theme.sub }}>Event Type:</span> <strong style={{ color: theme.text }}>{r.trigger_type || r.triggerType}</strong></div>
                  <div><span style={{ color: theme.sub }}>Target Phone:</span> <strong style={{ color: '#EC4899' }}>{r.guardian_phone || r.guardianPhone}</strong></div>
                  <div><span style={{ color: theme.sub }}>Coordinates:</span> <strong style={{ color: '#10B981' }}>{r.latitude || r.lat}°N, {r.longitude || r.lng}°E</strong></div>
                  <div><span style={{ color: theme.sub }}>Status:</span> <strong style={{ color: theme.text }}>{r.status}</strong></div>
                  <div><span style={{ color: theme.sub }}>Audio Output:</span> <strong style={{ color: theme.text }}>{r.siren_decibels || r.sirenDecibels} dB</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <h3 style={{ color: theme.text, fontWeight: 900, marginBottom: 20 }}>Verified Emergency Contacts ({contacts.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {contacts.map((c, i) => (
                <div key={i} style={{
                  backgroundColor: theme.card, border: `1.5px solid ${c.color || theme.border}40`,
                  borderRadius: 14, padding: '16px 18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      backgroundColor: c.color || '#6355E6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 900, fontSize: '1rem'
                    }}>{c.avatar || (c.name || 'U').charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 800, color: theme.text, fontSize: '0.88rem' }}>{c.name}</div>
                      <div style={{ color: theme.sub, fontSize: '0.72rem' }}>{c.relation}</div>
                    </div>
                    {c.verified && <FaCheckCircle style={{ color: '#10B981', marginLeft: 'auto' }} title="Verified" />}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#EC4899', fontWeight: 700 }}>{c.phone}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <span style={{ fontSize: '0.64rem', padding: '2px 8px', borderRadius: 10, backgroundColor: c.notifyOnSOS ? 'rgba(239,68,68,0.12)' : 'rgba(100,116,139,0.1)', color: c.notifyOnSOS ? '#EF4444' : '#94A3B8', fontWeight: 600 }}>
                      {c.notifyOnSOS ? 'SOS Notify: Active' : 'SOS: Disabled'}
                    </span>
                    <span style={{ fontSize: '0.64rem', padding: '2px 8px', borderRadius: 10, backgroundColor: c.shareLocation ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.1)', color: c.shareLocation ? '#10B981' : '#94A3B8', fontWeight: 600 }}>
                      {c.shareLocation ? 'Location: Shared' : 'Location: Hidden'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trips' && (
          <div>
            <h3 style={{ color: theme.text, fontWeight: 900, marginBottom: 20 }}>Solo Trip Plans ({trips.length})</h3>
            {trips.length === 0 ? (
              <div style={{ textAlign: 'center', color: theme.sub, padding: 60, backgroundColor: theme.card, borderRadius: 16 }}>
                No trip records stored yet. Trips created in Solo Trip Planner will appear here.
              </div>
            ) : trips.map((t, i) => (
              <div key={i} style={{
                backgroundColor: theme.card, border: `1px solid ${theme.border}`,
                borderRadius: 14, padding: '16px 18px', marginBottom: 12
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontWeight: 800, color: theme.text, fontSize: '0.9rem' }}>
                    {t.trip_title || t.title}
                  </div>
                  <span style={{
                    backgroundColor: t.trip_status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(99,85,230,0.12)',
                    color: t.trip_status === 'completed' ? '#10B981' : '#9887FE',
                    padding: '3px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700
                  }}>
                    {t.trip_status || 'in_transit'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: '0.74rem' }}>
                  <div><span style={{ color: theme.sub }}>Departure:</span> <strong style={{ color: theme.text }}>{t.origin_city || t.originCity}</strong></div>
                  <div><span style={{ color: theme.sub }}>Destination:</span> <strong style={{ color: theme.text }}>{t.destination_city || t.destinationCity}</strong></div>
                  <div><span style={{ color: theme.sub }}>Transit:</span> <strong style={{ color: '#6355E6' }}>{t.train_number} {t.train_name}</strong></div>
                  <div><span style={{ color: theme.sub }}>Guardian:</span> <strong style={{ color: '#EC4899' }}>{t.guardian_phone}</strong></div>
                  <div><span style={{ color: theme.sub }}>Logged Date:</span> <strong style={{ color: theme.text }}>{t.created_at ? new Date(t.created_at).toLocaleDateString('en-US') : 'Recent'}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div>
            <h3 style={{ color: theme.text, fontWeight: 900, marginBottom: 20 }}>Vehicle Audits & HerScan 360 Logs ({scans.length})</h3>
            {scans.length === 0 ? (
              <div style={{ textAlign: 'center', color: theme.sub, padding: 60, backgroundColor: theme.card, borderRadius: 16 }}>
                No vehicle scans yet. Plates scanned in HerScan 360 will be catalogued here.
              </div>
            ) : scans.map((v, i) => (
              <div key={i} style={{
                backgroundColor: theme.card, border: `1px solid ${theme.border}`,
                borderRadius: 14, padding: '16px 18px', marginBottom: 12
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{
                    backgroundColor: '#1A1035', padding: '4px 14px', borderRadius: 6,
                    fontFamily: 'monospace', fontWeight: 900, color: '#FCD34D', fontSize: '1rem',
                    border: '2px solid #FCD34D', letterSpacing: 2
                  }}>
                    {v.plate_number || v.plate}
                  </div>
                  <span style={{
                    backgroundColor: v.police_cleared ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    color: v.police_cleared ? '#10B981' : '#EF4444',
                    padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700
                  }}>
                    {v.police_cleared ? 'NCRB Cleared' : 'Flagged for Review'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: '0.74rem' }}>
                  <div><span style={{ color: theme.sub }}>Registered Owner:</span> <strong style={{ color: theme.text }}>{v.registered_owner}</strong></div>
                  <div><span style={{ color: theme.sub }}>Vehicle:</span> <strong style={{ color: theme.text }}>{v.vehicle_model}</strong></div>
                  <div><span style={{ color: theme.sub }}>RTO Division:</span> <strong style={{ color: theme.text }}>{v.rto_office}</strong></div>
                  <div><span style={{ color: theme.sub }}>Scan Timestamp:</span> <strong style={{ color: theme.text }}>{v.scanned_at ? new Date(v.scanned_at).toLocaleString('en-US') : 'Recent'}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'schema' && (
          <div>
            <h3 style={{ color: theme.text, fontWeight: 900, marginBottom: 20 }}>Supabase PostgreSQL Schema (SQL)</h3>
            <div style={{
              backgroundColor: isCloud ? 'rgba(16,185,129,0.08)' : 'rgba(99,85,230,0.08)',
              border: `1.5px solid ${isCloud ? '#10B981' : '#6355E6'}`,
              borderRadius: 14, padding: '16px 20px', marginBottom: 20
            }}>
              <div style={{ fontWeight: 800, color: isCloud ? '#10B981' : '#9887FE', marginBottom: 8 }}>
                {isCloud ? 'Supabase Cloud Database Connected' : 'Supabase Credentials Not Yet Configured'}
              </div>
              {!isCloud && (
                <ol style={{ color: theme.text, fontSize: '0.82rem', margin: 0, paddingLeft: 20, lineHeight: 2 }}>
                  <li>Open <strong>supabase.com</strong> and create a project</li>
                  <li>Copy your <strong>Project URL</strong> and <strong>API Anon Key</strong></li>
                  <li>Paste into the <code style={{ backgroundColor: isDark ? '#1C1640' : '#EEE', padding: '1px 6px', borderRadius: 4 }}>.env</code> file in root folder</li>
                  <li>Execute the SQL migration schema below in your <strong>Supabase SQL Editor</strong></li>
                  <li>Reload application</li>
                </ol>
              )}
            </div>

            <pre style={{
              backgroundColor: isDark ? '#0A0618' : '#1E1A40',
              color: '#A5B4FC', borderRadius: 14,
              padding: '20px 24px', fontSize: '0.72rem',
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              maxHeight: 420, overflowY: 'auto',
              border: '1px solid #2D2060', lineHeight: 1.6
            }}>
              {SCHEMA_SQL}
            </pre>

            <button
              onClick={copySchema}
              style={{
                marginTop: 14,
                background: copiedSchema ? '#10B981' : 'linear-gradient(135deg, #6355E6, #4338CA)',
                color: '#fff', border: 'none', borderRadius: 12,
                padding: '12px 24px', fontWeight: 800, fontSize: '0.88rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(99,85,230,0.3)'
              }}
            >
              {copiedSchema ? <FaCheckCircle /> : <FaCopy />}
              {copiedSchema ? 'SQL Copied to Clipboard!' : 'Copy SQL Schema for Supabase'}
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
