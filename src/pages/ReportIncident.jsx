import React, { useState } from 'react';
import {
  FaExclamationTriangle, FaMapMarkerAlt, FaCamera,
  FaCheckCircle, FaArrowRight, FaArrowLeft, FaShieldAlt
} from 'react-icons/fa';

const steps = ['Incident Type', 'Location & Time', 'Description', 'Evidence', 'Review & Submit'];

const incidentTypes = [
  { key: 'harassment',  icon: '😔', label: 'Harassment',        desc: 'Verbal or physical harassment in public' },
  { key: 'stalking',    icon: '👁️', label: 'Stalking',          desc: 'Being followed or monitored without consent' },
  { key: 'assault',     icon: '🚨', label: 'Physical Assault',  desc: 'Physical attack or threat of violence' },
  { key: 'cyber',       icon: '💻', label: 'Cybercrime',        desc: 'Online harassment, threats, or abuse' },
  { key: 'unsafe_area', icon: '⚠️', label: 'Unsafe Area',       desc: 'Report a location that feels unsafe' },
  { key: 'other',       icon: '📋', label: 'Other',             desc: 'Any other safety concern or incident' },
];

const initialForm = {
  incidentType: '',
  date: '',
  time: '',
  location: '',
  description: '',
  anonymous: false,
  severity: 'medium',
  witnesses: '',
  policeReported: 'no',
};

function ReportIncident() {
  const [step,       setStep]       = useState(0);
  const [form,       setForm]       = useState(initialForm);
  const [submitted,  setSubmitted]  = useState(false);
  const [errors,     setErrors]     = useState({});

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  /* Basic validation per step */
  const validate = () => {
    const e = {};
    if (step === 0 && !form.incidentType) e.incidentType = 'Please select an incident type.';
    if (step === 1) {
      if (!form.date)     e.date     = 'Date is required.';
      if (!form.time)     e.time     = 'Time is required.';
      if (!form.location) e.location = 'Location is required.';
    }
    if (step === 2 && form.description.trim().length < 20)
      e.description = 'Please provide at least 20 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => s + 1); };
  const back = () => { setStep((s) => s - 1); setErrors({}); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  /* ── SUCCESS SCREEN ── */
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#0F0A1E', padding: '80px 0', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 text-center">
              <div
                style={{
                  width: 90, height: 90, borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)',
                  border: '2px solid rgba(16,185,129,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '2.5rem', color: '#10B981',
                }}
              >
                <FaCheckCircle />
              </div>
              <h3 style={{ color: '#fff', fontWeight: 800, marginBottom: 14 }}>
                Report Submitted Successfully
              </h3>
              <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: 8 }}>
                Your incident report has been securely recorded. Your report ID is:
              </p>
              <div
                style={{
                  background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.4)',
                  borderRadius: 12, padding: '10px 24px',
                  color: '#C4B5FD', fontWeight: 800,
                  fontSize: '1.2rem', letterSpacing: 2,
                  display: 'inline-block', marginBottom: 28,
                }}
              >
                #HH{Math.floor(Math.random() * 90000) + 10000}
              </div>
              <div className="d-flex flex-column gap-2 mb-4">
                {[
                  '✅ Report encrypted & securely stored',
                  '✅ Nearest safe hub notified',
                  '✅ Support team will review within 24 hrs',
                ].map((t) => (
                  <div key={t} style={{ color: '#10B981', fontSize: '0.88rem' }}>{t}</div>
                ))}
              </div>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <button className="btn btn-primary-pink px-4 py-2"
                  onClick={() => { setSubmitted(false); setForm(initialForm); setStep(0); }}>
                  Submit Another Report
                </button>
                <a href="tel:112" className="btn btn-sos px-4 py-2">
                  🚨 Call 112
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="container">

        {/* ── Header ── */}
        <div className="text-center mb-5">
          <span className="section-tag">Report Incident</span>
          <h2 className="section-title">Report a Safety Incident</h2>
          <p className="section-subtitle">
            Your report is encrypted and confidential. Every report helps make the community safer.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">

            {/* ── Stepper ── */}
            <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-2">
              {steps.map((label, i) => (
                <React.Fragment key={label}>
                  <div className="d-flex flex-column align-items-center gap-1" style={{ minWidth: 60 }}>
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: i < step
                          ? '#10B981'
                          : i === step
                          ? 'linear-gradient(135deg,#7C3AED,#EC4899)'
                          : 'rgba(255,255,255,0.06)',
                        border: i === step
                          ? '2px solid #7C3AED'
                          : i < step
                          ? '2px solid #10B981'
                          : '2px solid rgba(139,92,246,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {i < step ? <FaCheckCircle style={{ fontSize: '0.9rem' }} /> : i + 1}
                    </div>
                    <span style={{
                      fontSize: '0.68rem', color: i === step ? '#C4B5FD' : '#64748B',
                      fontWeight: i === step ? 600 : 400, textAlign: 'center',
                    }}>
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{
                      flex: 1, height: 2, minWidth: 16,
                      background: i < step
                        ? 'linear-gradient(90deg,#10B981,#10B981)'
                        : 'rgba(139,92,246,0.2)',
                      borderRadius: 2, marginBottom: 20,
                      transition: 'background 0.3s ease',
                    }} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* ── Form Card ── */}
            <form onSubmit={handleSubmit}>
              <div className="form-card">

                {/* ── STEP 0: Incident Type ── */}
                {step === 0 && (
                  <div>
                    <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: 6 }}>
                      What type of incident are you reporting?
                    </h5>
                    <p style={{ color: '#64748B', fontSize: '0.87rem', marginBottom: 24 }}>
                      Select the category that best describes the incident.
                    </p>
                    <div className="row g-3">
                      {incidentTypes.map((t) => (
                        <div key={t.key} className="col-12 col-sm-6">
                          <div
                            onClick={() => update('incidentType', t.key)}
                            style={{
                              padding: '16px 18px', borderRadius: 14, cursor: 'pointer',
                              border: form.incidentType === t.key
                                ? '2px solid #7C3AED'
                                : '1px solid rgba(139,92,246,0.25)',
                              background: form.incidentType === t.key
                                ? 'rgba(124,58,237,0.15)'
                                : 'rgba(255,255,255,0.04)',
                              transition: 'all 0.2s ease',
                              display: 'flex', alignItems: 'flex-start', gap: 14,
                            }}
                          >
                            <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                            <div>
                              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.92rem' }}>
                                {t.label}
                              </div>
                              <div style={{ color: '#64748B', fontSize: '0.78rem', marginTop: 3 }}>
                                {t.desc}
                              </div>
                            </div>
                            {form.incidentType === t.key && (
                              <FaCheckCircle className="ms-auto mt-1" style={{ color: '#7C3AED', flexShrink: 0 }} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.incidentType && (
                      <p style={{ color: '#EF4444', fontSize: '0.82rem', marginTop: 12 }}>
                        {errors.incidentType}
                      </p>
                    )}
                  </div>
                )}

                {/* ── STEP 1: Location & Time ── */}
                {step === 1 && (
                  <div>
                    <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: 6 }}>
                      When and where did it happen?
                    </h5>
                    <p style={{ color: '#64748B', fontSize: '0.87rem', marginBottom: 24 }}>
                      Accurate location and time helps authorities respond effectively.
                    </p>
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <label className="form-label">Date of Incident *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={form.date}
                          max={new Date().toISOString().split('T')[0]}
                          onChange={(e) => update('date', e.target.value)}
                        />
                        {errors.date && <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: 4 }}>{errors.date}</p>}
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="form-label">Time of Incident *</label>
                        <input
                          type="time"
                          className="form-control"
                          value={form.time}
                          onChange={(e) => update('time', e.target.value)}
                        />
                        {errors.time && <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: 4 }}>{errors.time}</p>}
                      </div>
                      <div className="col-12">
                        <label className="form-label">
                          <FaMapMarkerAlt style={{ color: '#EC4899', marginRight: 6 }} />
                          Location / Address *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Near Metro Station, Connaught Place, New Delhi"
                          value={form.location}
                          onChange={(e) => update('location', e.target.value)}
                        />
                        {errors.location && <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: 4 }}>{errors.location}</p>}
                      </div>
                      <div className="col-12">
                        <label className="form-label">Severity Level</label>
                        <div className="d-flex gap-2 flex-wrap">
                          {[
                            { key: 'low',      label: '🟡 Low',      color: '#F59E0B' },
                            { key: 'medium',   label: '🟠 Medium',   color: '#F97316' },
                            { key: 'high',     label: '🔴 High',     color: '#EF4444' },
                            { key: 'critical', label: '🆘 Critical', color: '#DC2626' },
                          ].map((s) => (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => update('severity', s.key)}
                              className="btn"
                              style={{
                                borderRadius: 50, padding: '6px 16px', fontSize: '0.82rem', fontWeight: 600,
                                border: form.severity === s.key ? `2px solid ${s.color}` : '1px solid rgba(139,92,246,0.25)',
                                background: form.severity === s.key ? `${s.color}22` : 'rgba(255,255,255,0.04)',
                                color: form.severity === s.key ? s.color : '#94A3B8',
                              }}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Description ── */}
                {step === 2 && (
                  <div>
                    <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: 6 }}>
                      Describe what happened
                    </h5>
                    <p style={{ color: '#64748B', fontSize: '0.87rem', marginBottom: 24 }}>
                      Provide as much detail as you can. This helps investigators understand the incident.
                    </p>
                    <div className="mb-3">
                      <label className="form-label">Incident Description *</label>
                      <textarea
                        className="form-control"
                        rows={6}
                        placeholder="Describe what happened in detail — who was involved, what was said or done, how you felt..."
                        value={form.description}
                        onChange={(e) => update('description', e.target.value)}
                      />
                      <div className="d-flex justify-content-between mt-1">
                        {errors.description
                          ? <p style={{ color: '#EF4444', fontSize: '0.78rem' }}>{errors.description}</p>
                          : <span />
                        }
                        <span style={{ color: '#64748B', fontSize: '0.75rem' }}>
                          {form.description.length} characters
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Were there any witnesses?</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Optional — describe any witnesses (don't share personal info)"
                        value={form.witnesses}
                        onChange={(e) => update('witnesses', e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Was this reported to police?</label>
                      <select
                        className="form-select"
                        value={form.policeReported}
                        onChange={(e) => update('policeReported', e.target.value)}
                      >
                        <option value="no">No, not yet</option>
                        <option value="yes">Yes, already reported</option>
                        <option value="planning">Planning to report</option>
                      </select>
                    </div>
                    <div className="d-flex align-items-center gap-3 p-3" style={{
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)',
                      borderRadius: 10,
                    }}>
                      <input
                        type="checkbox"
                        id="anonymous"
                        style={{ width: 18, height: 18, accentColor: '#7C3AED', cursor: 'pointer' }}
                        checked={form.anonymous}
                        onChange={(e) => update('anonymous', e.target.checked)}
                      />
                      <label htmlFor="anonymous" style={{ color: '#C4B5FD', fontSize: '0.88rem', cursor: 'pointer', margin: 0 }}>
                        Submit this report anonymously (your identity will not be shared)
                      </label>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Evidence ── */}
                {step === 3 && (
                  <div>
                    <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: 6 }}>
                      Add supporting evidence
                    </h5>
                    <p style={{ color: '#64748B', fontSize: '0.87rem', marginBottom: 24 }}>
                      Photos, screenshots or documents help strengthen your report. This step is optional.
                    </p>
                    <div
                      style={{
                        border: '2px dashed rgba(139,92,246,0.4)', borderRadius: 16,
                        padding: '50px 24px', textAlign: 'center', cursor: 'pointer',
                        background: 'rgba(124,58,237,0.05)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.7)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'}
                    >
                      <FaCamera style={{ fontSize: '2.5rem', color: '#7C3AED', opacity: 0.6, marginBottom: 16 }} />
                      <p style={{ color: '#C4B5FD', fontWeight: 600, marginBottom: 6 }}>
                        Drag & drop files here
                      </p>
                      <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: 16 }}>
                        Supports: JPG, PNG, PDF, MP4 (max 50MB)
                      </p>
                      <button type="button" className="btn btn-outline-white px-4 py-2" style={{ fontSize: '0.85rem' }}>
                        Browse Files
                      </button>
                    </div>
                    <div className="mt-4 p-3 d-flex align-items-start gap-3" style={{
                      background: 'rgba(16,185,129,0.08)',
                      border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12,
                    }}>
                      <FaShieldAlt style={{ color: '#10B981', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <p style={{ color: '#10B981', fontWeight: 600, fontSize: '0.88rem', marginBottom: 4 }}>
                          Your evidence is secure
                        </p>
                        <p style={{ color: '#64748B', fontSize: '0.8rem', margin: 0 }}>
                          All uploaded files are end-to-end encrypted and stored securely.
                          Only authorized personnel can access them.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Review & Submit ── */}
                {step === 4 && (
                  <div>
                    <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: 6 }}>
                      Review your report
                    </h5>
                    <p style={{ color: '#64748B', fontSize: '0.87rem', marginBottom: 24 }}>
                      Please review all details before submitting. Once submitted, a confirmation will be sent.
                    </p>
                    <div className="d-flex flex-column gap-3">
                      {[
                        {
                          label: 'Incident Type',
                          value: incidentTypes.find((t) => t.key === form.incidentType)?.label || '—',
                        },
                        { label: 'Date & Time',   value: form.date && form.time ? `${form.date} at ${form.time}` : '—' },
                        { label: 'Location',      value: form.location    || '—' },
                        { label: 'Severity',      value: form.severity    || '—' },
                        { label: 'Description',   value: form.description || '—' },
                        { label: 'Police Report', value: form.policeReported === 'yes' ? 'Already reported' : form.policeReported === 'planning' ? 'Planning to report' : 'Not yet reported' },
                        { label: 'Anonymous',     value: form.anonymous   ? 'Yes' : 'No' },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="d-flex gap-3 px-3 py-2"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(139,92,246,0.15)',
                            borderRadius: 10,
                          }}
                        >
                          <span style={{ color: '#64748B', fontSize: '0.82rem', minWidth: 120, flexShrink: 0 }}>
                            {row.label}
                          </span>
                          <span style={{
                            color: '#C4B5FD', fontSize: '0.85rem', fontWeight: 500,
                            wordBreak: 'break-word',
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 d-flex align-items-start gap-3" style={{
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12,
                    }}>
                      <FaExclamationTriangle style={{ color: '#EF4444', marginTop: 2, flexShrink: 0 }} />
                      <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: 0 }}>
                        By submitting you confirm that the information provided is accurate to the best of your knowledge.
                        False reports may be subject to legal action.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Navigation Buttons ── */}
                <div className="d-flex justify-content-between align-items-center mt-5 flex-wrap gap-3">
                  {step > 0 ? (
                    <button type="button" className="btn btn-outline-white px-4 py-2" onClick={back}>
                      <FaArrowLeft style={{ marginRight: 8 }} /> Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < steps.length - 1 ? (
                    <button type="button" className="btn btn-primary-pink px-5 py-2" onClick={next}>
                      Continue <FaArrowRight style={{ marginLeft: 8 }} />
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-sos px-5 py-2">
                      🚨 Submit Report
                    </button>
                  )}
                </div>

              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportIncident;
