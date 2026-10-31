import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaHeart, FaTimes, FaShieldAlt, FaEye, FaEyeSlash, FaCheckCircle, FaUser, FaLock } from 'react-icons/fa';

function AuthModal() {
  const { authModalOpen, closeAuthModal, login, signup } = useAuth();
  const { isDark } = useTheme();
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  
  // Sign in fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign up fields
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!authModalOpen) return null;

  const handleDemoFill = () => {
    setIdentifier('neha.patel@herhub.org');
    setPassword('SafetyFirst2026!');
    setError('');
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    login(identifier, password);
    setSuccessMsg('Signed in safely!');
    setTimeout(() => {
      setSuccessMsg('');
    }, 1500);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!signupEmail.trim() && !signupPhone.trim()) {
      setError('Please provide at least an email or mobile number.');
      return;
    }

    signup({
      name,
      email: signupEmail,
      phone: signupPhone,
      emergencyContactName: guardianName,
      emergencyContactPhone: guardianPhone,
      password: signupPassword
    });

    setSuccessMsg('Account created successfully!');
    setTimeout(() => {
      setSuccessMsg('');
    }, 1500);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 14, 45, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
      onClick={closeAuthModal}
    >
      <div 
        style={{
          backgroundColor: isDark ? '#171133' : '#FFFFFF',
          borderRadius: 24,
          maxWidth: 480,
          width: '100%',
          padding: '36px 32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
          border: isDark ? '1px solid #2F2459' : '1px solid #ECECF2',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
          color: isDark ? '#FFFFFF' : '#160D33'
        }}
        onClick={e => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'none',
            border: 'none',
            fontSize: '1.1rem',
            color: '#8A86A8',
            cursor: 'pointer',
            padding: 8
          }}
          aria-label="Close"
        >
          <FaTimes />
        </button>

        {/* Brand Logo & Heading */}
        <div className="text-center mb-4">
          <div 
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#140E2D',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12
            }}
          >
            <FaHeart style={{ color: '#FFFFFF', fontSize: '1.05rem' }} />
          </div>

          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: isDark ? '#FFFFFF' : '#160D33', margin: '0 0 6px' }}>
            {tab === 'signin' ? 'Welcome back to HERHUB' : 'Create your Safe Account'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: isDark ? '#B5B1CF' : '#65607E', margin: 0 }}>
            {tab === 'signin' 
              ? 'Sign in to access your private notes, check-ins, and safety network.' 
              : 'End-to-end encrypted safety workspace tailored for you.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div 
          className="d-flex p-1 mb-4 rounded-3" 
          style={{ backgroundColor: isDark ? '#231A47' : '#F3F1FA', border: isDark ? '1px solid #36286B' : '1px solid #ECE7FD' }}
        >
          <button
            type="button"
            className="btn btn-sm flex-grow-1"
            onClick={() => { setTab('signin'); setError(''); }}
            style={{
              borderRadius: 10,
              fontSize: '0.86rem',
              fontWeight: 700,
              backgroundColor: tab === 'signin' ? (isDark ? '#322566' : '#FFFFFF') : 'transparent',
              color: tab === 'signin' ? '#FFFFFF' : (isDark ? '#B5B1CF' : '#65607E'),
              boxShadow: tab === 'signin' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              border: 'none',
              padding: '8px 0'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className="btn btn-sm flex-grow-1"
            onClick={() => { setTab('signup'); setError(''); }}
            style={{
              borderRadius: 10,
              fontSize: '0.86rem',
              fontWeight: 700,
              backgroundColor: tab === 'signup' ? (isDark ? '#322566' : '#FFFFFF') : 'transparent',
              color: tab === 'signup' ? '#FFFFFF' : (isDark ? '#B5B1CF' : '#65607E'),
              boxShadow: tab === 'signup' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              border: 'none',
              padding: '8px 0'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.84rem', borderRadius: 10 }}>
            {error}
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success py-2 px-3 mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.84rem', borderRadius: 10 }}>
            <FaCheckCircle />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ── TAB 1: SIGN IN FORM ── */}
        {tab === 'signin' ? (
          <form onSubmit={handleSignInSubmit}>
            
            {/* 1-Click Demo Fill Banner */}
            <div 
              className="p-2 mb-3 rounded-2 d-flex align-items-center justify-content-between"
              style={{ backgroundColor: '#F6F4FE', border: '1px dashed #D5CEFD' }}
            >
              <small style={{ color: '#6355E6', fontWeight: 600, fontSize: '0.78rem' }}>
                Testing the app?
              </small>
              <button
                type="button"
                onClick={handleDemoFill}
                className="btn btn-sm"
                style={{
                  backgroundColor: '#6355E6',
                  color: '#FFFFFF',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  borderRadius: 6,
                  padding: '3px 10px'
                }}
              >
                1-Click Demo Fill
              </button>
            </div>

            {/* Email / Phone Field */}
            <div className="mb-3">
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#160D33', display: 'block', marginBottom: 6 }}>
                Email or Mobile Number
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                  <FaUser style={{ fontSize: '0.85rem' }} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="e.g. neha@example.com or 7524072395"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  style={{ borderRadius: '0 12px 12px 0', fontSize: '0.92rem', padding: '10px 14px' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#160D33', margin: 0 }}>
                  Password
                </label>
                <span 
                  onClick={() => alert('Demo Reset: You can click "1-Click Demo Fill" above to sign in instantly!')}
                  style={{ fontSize: '0.76rem', color: '#6355E6', fontWeight: 600, cursor: 'pointer' }}
                >
                  Forgot password?
                </span>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                  <FaLock style={{ fontSize: '0.85rem' }} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control border-start-0 border-end-0"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ fontSize: '0.92rem', padding: '10px 14px' }}
                />
                <button
                  type="button"
                  className="input-group-text bg-light text-muted border-start-0"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ borderRadius: '0 12px 12px 0', cursor: 'pointer' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="form-check mb-4">
              <input className="form-check-input" type="checkbox" id="rememberMe" defaultChecked />
              <label className="form-check-label text-muted" htmlFor="rememberMe" style={{ fontSize: '0.82rem' }}>
                Keep me securely signed in on this browser
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: '#6355E6',
                color: '#FFFFFF',
                borderRadius: 12,
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(99, 85, 230, 0.35)'
              }}
            >
              Sign In to Safe Hub
            </button>

          </form>
        ) : (
          /* ── TAB 2: SIGN UP FORM ── */
          <form onSubmit={handleSignUpSubmit}>
            
            {/* Full Name */}
            <div className="mb-3">
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#160D33', display: 'block', marginBottom: 6 }}>
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Neha Patel"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ borderRadius: 12, fontSize: '0.92rem', padding: '10px 14px' }}
                required
              />
            </div>

            {/* Email & Phone */}
            <div className="row g-2 mb-3">
              <div className="col-12 col-sm-6">
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#160D33', display: 'block', marginBottom: 4 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="neha@example.com"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  style={{ borderRadius: 10, fontSize: '0.88rem' }}
                />
              </div>
              <div className="col-12 col-sm-6">
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#160D33', display: 'block', marginBottom: 4 }}>
                  Mobile (For Alerts)
                </label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+91 98765 XXXXX"
                  value={signupPhone}
                  onChange={e => setSignupPhone(e.target.value)}
                  style={{ borderRadius: 10, fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {/* Primary Guardian Contact */}
            <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: '#F8F7FD', border: '1px solid #ECE7FD' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#6355E6', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Primary Emergency Guardian
              </span>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Guardian Name (e.g. Mom)"
                    value={guardianName}
                    onChange={e => setGuardianName(e.target.value)}
                    style={{ borderRadius: 8, fontSize: '0.82rem' }}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="tel"
                    className="form-control form-control-sm"
                    placeholder="Phone number"
                    value={guardianPhone}
                    onChange={e => setGuardianPhone(e.target.value)}
                    style={{ borderRadius: 8, fontSize: '0.82rem' }}
                  />
                </div>
              </div>
              <small className="text-muted d-block mt-2" style={{ fontSize: '0.72rem' }}>
                Used automatically by Sentinel check-in and Fake Guardian Call.
              </small>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#160D33', display: 'block', marginBottom: 6 }}>
                Create Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Minimum 8 characters"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                style={{ borderRadius: 12, fontSize: '0.92rem', padding: '10px 14px' }}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: '#6355E6',
                color: '#FFFFFF',
                borderRadius: 12,
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(99, 85, 230, 0.35)'
              }}
            >
              Create Encrypted Account
            </button>

          </form>
        )}

        {/* Privacy Note */}
        <div className="mt-4 pt-3 border-top text-center">
          <div className="d-flex align-items-center justify-content-center gap-2 text-muted" style={{ fontSize: '0.76rem' }}>
            <FaShieldAlt style={{ color: '#10B981' }} />
            <span>Private by Design · Never shared with advertisers or third parties</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthModal;
