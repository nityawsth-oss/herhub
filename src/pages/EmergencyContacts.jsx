import React, { useState, useEffect } from 'react';
import {
  FaPhone, FaTrash, FaPlus, FaShieldAlt,
  FaCheckCircle, FaSms, FaUserPlus, FaTimes, FaWhatsapp
} from 'react-icons/fa';
import { saveEmergencyContact, deleteEmergencyContact, getEmergencyContacts } from '../services/databaseService';

const initialContacts = [
  {
    id: 1,
    name: 'Rajesh Sharma (Papa)',
    relation: 'Father / Primary Guardian',
    phone: '+91 75240 72395',
    avatar: 'M',
    color: '#EC4899',
    notifyOnSOS: true,
    shareLocation: true,
    verified: true,
  },
  {
    id: 2,
    name: 'Rahul Bhaiya',
    relation: 'Brother',
    phone: '+91 91234 56789',
    avatar: 'R',
    color: '#7C3AED',
    notifyOnSOS: true,
    shareLocation: true,
    verified: true,
  },
  {
    id: 3,
    name: 'Sneha (Best Friend)',
    relation: 'Friend',
    phone: '+91 99887 76655',
    avatar: 'S',
    color: '#3B82F6',
    notifyOnSOS: true,
    shareLocation: false,
    verified: false,
  },
];

const emptyForm = { name: '', relation: '', phone: '' };

function EmergencyContacts() {
  const [contacts,   setContacts]  = useState(initialContacts);
  const [showForm,   setShowForm]  = useState(false);
  const [form,       setForm]      = useState(emptyForm);
  const [errors,     setErrors]    = useState({});
  const [alertMsg,   setAlertMsg]  = useState('');
  const [deleteId,   setDeleteId]  = useState(null);
  // Load contacts from database on mount
  useEffect(() => {
    getEmergencyContacts().then(dbContacts => {
      if (dbContacts && dbContacts.length > 0) {
        setContacts(dbContacts);
      }
    }).catch(() => {});
  }, []);

  const avatarColors = ['#EC4899', '#7C3AED', '#3B82F6', '#10B981', '#F97316', '#F59E0B'];

  const update = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())                            e.name     = 'Name is required.';
    if (!form.relation.trim())                        e.relation = 'Relation is required.';
    if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone))  e.phone    = 'Enter a valid phone number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const newContact = {
      id: Date.now(),
      name: form.name.trim(),
      relation: form.relation.trim(),
      phone: form.phone.trim(),
      avatar: form.name.trim().charAt(0).toUpperCase(),
      color: avatarColors[contacts.length % avatarColors.length],
      notifyOnSOS: true,
      shareLocation: true,
      verified: false,
    };
    setContacts([...contacts, newContact]);
    setForm(emptyForm);
    setErrors({});
    setShowForm(false);
    flash('✅ Guardian added successfully!');
    // Persist to HerHub database
    saveEmergencyContact(newContact).catch(() => {});
  };

  const handleDelete = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
    // Remove from HerHub database
    deleteEmergencyContact(id).catch(() => {});
    flash('🗑️ Contact removed.');
  };

  const toggleOption = (id, field) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: !c[field] } : c))
    );
  };

  const flash = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const handleSendAlert = () => {
    flash(`🚨 Test SOS alert sent to ${contacts.filter(c => c.notifyOnSOS).length} guardians!`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F0A1E', padding: '60px 0' }}>
      <div className="container">

        {/* ── Header ── */}
        <div className="text-center mb-5">
          <span className="section-tag">Emergency Contacts</span>
          <h2 className="section-title">Your Trusted Guardians</h2>
          <p className="section-subtitle">
            Add family and friends as guardians. They will be instantly notified with your live location when you trigger SOS.
          </p>
        </div>

        {/* ── Flash Message ── */}
        {alertMsg && (
          <div
            className="mb-4 px-4 py-3 text-center"
            style={{
              background: alertMsg.startsWith('🚨')
                ? 'rgba(239,68,68,0.15)'
                : alertMsg.startsWith('🗑️')
                ? 'rgba(239,68,68,0.1)'
                : 'rgba(16,185,129,0.15)',
              border: `1px solid ${alertMsg.startsWith('✅') ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
              borderRadius: 12,
              color: alertMsg.startsWith('✅') ? '#10B981' : '#EF4444',
              fontWeight: 600, fontSize: '0.9rem',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            {alertMsg}
          </div>
        )}

        <div className="row g-4">

          {/* ── LEFT — Contact Cards ── */}
          <div className="col-12 col-lg-7">

            {/* Top Bar */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
              <div style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
                <FaShieldAlt style={{ color: '#7C3AED', marginRight: 8 }} />
                <span style={{ color: '#C4B5FD', fontWeight: 700 }}>{contacts.length}</span> guardians added
                {' · '}
                <span style={{ color: '#10B981', fontWeight: 600 }}>
                  {contacts.filter((c) => c.notifyOnSOS).length} active for SOS
                </span>
              </div>
              <button
                className="btn btn-primary-pink py-2 px-4"
                style={{ fontSize: '0.88rem' }}
                onClick={() => { setShowForm(true); setErrors({}); setForm(emptyForm); }}
              >
                <FaUserPlus style={{ marginRight: 8 }} />
                Add Guardian
              </button>
            </div>

            {/* Add Guardian Form */}
            {showForm && (
              <div
                className="mb-4 p-4"
                style={{
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.4)',
                  borderRadius: 18,
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 style={{ color: '#fff', fontWeight: 700, margin: 0 }}>
                    <FaUserPlus style={{ color: '#EC4899', marginRight: 8 }} />
                    Add New Guardian
                  </h6>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '1.1rem' }}
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleAdd}>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Mom, Rahul Bhaiya"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                      />
                      {errors.name && <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: 4 }}>{errors.name}</p>}
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label">Relation *</label>
                      <select
                        className="form-select"
                        value={form.relation}
                        onChange={(e) => update('relation', e.target.value)}
                      >
                        <option value="">Select relation</option>
                        <option>Mother</option>
                        <option>Father</option>
                        <option>Sister</option>
                        <option>Brother</option>
                        <option>Friend</option>
                        <option>Husband</option>
                        <option>Colleague</option>
                        <option>Other</option>
                      </select>
                      {errors.relation && <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: 4 }}>{errors.relation}</p>}
                    </div>
                    <div className="col-12">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="+91 75240 72395"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                      />
                      {errors.phone && <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: 4 }}>{errors.phone}</p>}
                    </div>
                    <div className="col-12 d-flex gap-2 justify-content-end">
                      <button type="button" className="btn btn-outline-white py-2 px-4"
                        onClick={() => setShowForm(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary-pink py-2 px-4">
                        <FaPlus style={{ marginRight: 6 }} /> Add Guardian
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Contact Cards */}
            <div className="d-flex flex-column gap-3">
              {contacts.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>👥</div>
                  <p style={{ color: '#94A3B8' }}>No guardians added yet.</p>
                  <button className="btn btn-primary-pink px-4 py-2" onClick={() => setShowForm(true)}>
                    Add Your First Guardian
                  </button>
                </div>
              ) : (
                contacts.map((c) => (
                  <div key={c.id} className="contact-card flex-column flex-sm-row align-items-start align-items-sm-center">

                    {/* Avatar + Info */}
                    <div className="d-flex align-items-center gap-3 flex-grow-1 w-100">
                      <div
                        className="contact-avatar"
                        style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}99)` }}
                      >
                        {c.avatar}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span className="contact-name">{c.name}</span>
                          {c.verified && (
                            <span style={{
                              fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px',
                              borderRadius: 50, background: 'rgba(16,185,129,0.15)',
                              border: '1px solid rgba(16,185,129,0.3)', color: '#10B981',
                            }}>
                              <FaCheckCircle style={{ marginRight: 4, fontSize: '0.6rem' }} />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="contact-relation">{c.relation}</div>
                        <div className="contact-phone">{c.phone}</div>
                      </div>

                      {/* Delete Confirm */}
                      {deleteId === c.id ? (
                        <div className="d-flex gap-2">
                          <button
                            className="btn py-1 px-3"
                            style={{
                              fontSize: '0.78rem', fontWeight: 600, borderRadius: 50,
                              background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
                              color: '#EF4444',
                            }}
                            onClick={() => handleDelete(c.id)}
                          >
                            Confirm
                          </button>
                          <button
                            className="btn py-1 px-3"
                            style={{
                              fontSize: '0.78rem', fontWeight: 600, borderRadius: 50,
                              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.25)',
                              color: '#94A3B8',
                            }}
                            onClick={() => setDeleteId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(c.id)}
                          style={{
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                            borderRadius: 8, padding: '8px 10px', color: '#EF4444',
                            cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s',
                          }}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>

                    {/* Toggles */}
                    <div
                      className="d-flex gap-3 mt-3 mt-sm-0 ms-sm-4 pt-3 pt-sm-0 w-100 w-sm-auto"
                      style={{ borderTop: '1px solid rgba(139,92,246,0.1)', paddingTop: 12 }}
                    >
                      {[
                        { field: 'notifyOnSOS',   label: 'SOS Alert',       activeColor: '#EF4444' },
                        { field: 'shareLocation', label: 'Share Location',   activeColor: '#10B981' },
                      ].map((opt) => (
                        <div key={opt.field} className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleOption(c.id, opt.field)}
                            style={{
                              width: 38, height: 20, borderRadius: 50, border: 'none', cursor: 'pointer',
                              background: c[opt.field] ? opt.activeColor : 'rgba(255,255,255,0.1)',
                              transition: 'background 0.3s ease', position: 'relative',
                              flexShrink: 0,
                            }}
                          >
                            <span style={{
                              position: 'absolute', top: 2,
                              left: c[opt.field] ? 20 : 2,
                              width: 16, height: 16, borderRadius: '50%',
                              background: '#fff', transition: 'left 0.3s ease',
                            }} />
                          </button>
                          <span style={{ color: '#94A3B8', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                            {opt.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Call / SMS */}
                    <div className="d-flex gap-2 mt-3 w-100">
                      <a
                        href={`tel:${c.phone.replace(/\s+/g, '')}`}
                        className="btn btn-call flex-grow-1 d-flex align-items-center justify-content-center"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <FaPhone style={{ marginRight: 6 }} /> Call
                      </a>
                      <a
                        href={`https://api.whatsapp.com/send?phone=${c.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                          `🚨 EMERGENCY SOS ALERT! I need urgent assistance. Live GPS Location: https://maps.google.com/?q=28.6139,77.2090`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn flex-grow-1 d-flex align-items-center justify-content-center text-white"
                        style={{
                          borderRadius: 50, fontSize: '0.8rem', fontWeight: 700,
                          backgroundColor: '#25D366', border: 'none'
                        }}
                      >
                        <FaWhatsapp style={{ marginRight: 5 }} /> WhatsApp
                      </a>
                      <a
                        href={`sms:${c.phone.replace(/\s+/g, '')}?body=${encodeURIComponent(
                          `EMERGENCY SOS: I need urgent assistance! Live GPS: https://maps.google.com/?q=28.6139,77.2090`
                        )}`}
                        className="btn flex-grow-1 d-flex align-items-center justify-content-center"
                        style={{
                          borderRadius: 50, fontSize: '0.8rem', fontWeight: 600,
                          background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)',
                          color: '#C4B5FD',
                        }}
                      >
                        <FaSms style={{ marginRight: 6 }} /> SMS
                      </a>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="col-12 col-lg-5 d-flex flex-column gap-4">

            {/* SOS Test */}
            <div className="dashboard-card text-center">
              <h6 className="fw-bold text-white mb-2">🚨 Test SOS Alert</h6>
              <p style={{ color: '#94A3B8', fontSize: '0.83rem', marginBottom: 20 }}>
                Send a test alert to all active guardians to make sure they receive your notifications.
              </p>
              <button
                className="btn btn-sos w-100 py-3"
                onClick={handleSendAlert}
                style={{ fontSize: '1rem', fontWeight: 700 }}
              >
                <FaShieldAlt style={{ marginRight: 8 }} />
                Send Test Alert
              </button>
              <p style={{ color: '#64748B', fontSize: '0.75rem', marginTop: 12, marginBottom: 0 }}>
                {contacts.filter(c => c.notifyOnSOS).length} guardian(s) will receive the test alert
              </p>
            </div>

            {/* Tips */}
            <div className="dashboard-card">
              <h6 className="fw-bold text-white mb-3">💡 Guardian Tips</h6>
              <div className="d-flex flex-column gap-3">
                {[
                  { icon: '👥', tip: 'Add at least 3 guardians for maximum safety coverage.' },
                  { icon: '📍', tip: 'Enable "Share Location" for guardians who can physically reach you.' },
                  { icon: '✅', tip: 'Ask your guardians to install HerHub too so they can track you in real time.' },
                  { icon: '🔄', tip: 'Update your guardian list regularly — especially when traveling to a new city.' },
                ].map((t) => (
                  <div key={t.tip} className="d-flex align-items-start gap-3">
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{t.icon}</span>
                    <span style={{ color: '#94A3B8', fontSize: '0.83rem', lineHeight: 1.6 }}>{t.tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Numbers */}
            <div className="dashboard-card">
              <h6 className="fw-bold text-white mb-3">📞 Official Emergency</h6>
              {[
                { num: '112',  label: 'National Emergency', color: '#EF4444' },
                { num: '1091', label: 'Women Helpline',     color: '#EC4899' },
                { num: '100',  label: 'Police',             color: '#3B82F6' },
                { num: '108',  label: 'Ambulance',          color: '#10B981' },
              ].map((e) => (
                <a
                  key={e.num}
                  href={`tel:${e.num}`}
                  className="d-flex align-items-center justify-content-between px-3 py-2 mb-2 text-decoration-none"
                  style={{
                    background: `${e.color}11`, border: `1px solid ${e.color}33`,
                    borderRadius: 10, transition: 'all 0.2s',
                  }}
                >
                  <span style={{ color: '#94A3B8', fontSize: '0.83rem' }}>{e.label}</span>
                  <span style={{ color: e.color, fontWeight: 800, fontSize: '1rem' }}>{e.num}</span>
                </a>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencyContacts;
