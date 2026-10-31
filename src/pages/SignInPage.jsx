import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaShieldAlt, FaEye, FaEyeSlash, FaCheckCircle, FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function SignInPage() {
  const { login, signup, isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('signin');
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleDemoFill = () => {
    setIdentifier('neha.patel@herhub.org');
    setPassword('SafetyFirst2026!');
    setError('');
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your email or mobile number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    login(identifier, password);
    setSuccessMsg('Signed in successfully! Redirecting...');
    setTimeout(() => {
      navigate('/safety-hub');
    }, 1000);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
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

    setSuccessMsg('Account created successfully! Redirecting...');
    setTimeout(() => {
      navigate('/safety-hub');
    }, 1000);
  };

  if (isLoggedIn && user) {
    return (
      <div style={{ backgroundColor: '#FDFDFE', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #ECECF2', borderRadius: 24, padding: 40, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(18,16,43,0.06)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#EDE8FE', color: '#6355E6', fontSize: '1.5rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            {user.avatarInitial || 'U'}
          </div>
          <h3 style={{ fontWeight: 800, color: '#160D33', marginBottom: 8 }}>You're signed in</h3>
          <p style={{ color: '#65607E', fontSize: '0.95rem', marginBottom: 20 }}>
            Active as <strong>{user.name}</strong> ({user.email || user.phone})
          </p>
          <div className="d-flex flex-column gap-2">
            <Link to="/safety-hub" className="btn btn-primary" style={{ backgroundColor: '#6355E6', borderColor: '#6355E6', borderRadius: 12, padding: '12px', fontWeight: 700 }}>
              Go to Safety Hub
            </Link>
            <button onClick={logout} className="btn btn-outline-danger" style={{ borderRadius: 12, padding: '10px' }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FDFDFE', minHeight: '85vh', padding: '60px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          maxWidth: 480,
          width: '100%',
          padding: '40px 36px',
          boxShadow: '0 18px 45px rgba(18, 16, 43, 0.08)',
          border: '1px solid #ECECF2'
        }}
      >
        
        {/* Brand Logo & Heading */}
        <div className="text-center mb-4">
          <div 
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: '#140E2D',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12
            }}
          >
            <FaHeart style={{ color: '#FFFFFF', fontSize: '1.15rem' }} />
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#160D33', margin: '0 0 6px' }}>
            {tab === 'signin' ? 'Sign in to HERHUB' : 'Create your Safe Account'}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#65607E', margin: 0 }}>
            {tab === 'signin' 
              ? 'Access your private check-ins and emergency guardian circle.' 
              : 'End-to-end encrypted safety workspace.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div 
          className="d-flex p-1 mb-4 rounded-3" 
          style={{ backgroundColor: '#F3F1FA', border: '1px solid #ECE7FD' }}
        >
          <button
            type="button"
            className="btn btn-sm flex-grow-1"
            onClick={() => { setTab('signin'); setError(''); }}
            style={{
              borderRadius: 10,
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: tab === 'signin' ? '#FFFFFF' : 'transparent',
              color: tab === 'signin' ? '#160D33' : '#65607E',
              boxShadow: tab === 'signin' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              border: 'none',
              padding: '9px 0'
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
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: tab === 'signup' ? '#FFFFFF' : 'transparent',
              color: tab === 'signup' ? '#160D33' : '#65607E',
              boxShadow: tab === 'signup' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              border: 'none',
              padding: '9px 0'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Alerts */}
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

        {/* ── TAB 1: SIGN IN ── */}
        {tab === 'signin' ? (
          <form onSubmit={handleSignInSubmit}>
            
            <div 
              className="p-2 mb-3 rounded-2 d-flex align-items-center justify-content-between"
              style={{ backgroundColor: '#F6F4FE', border: '1px dashed #D5CEFD' }}
            >
              <small style={{ color: '#6355E6', fontWeight: 600, fontSize: '0.8rem' }}>
                Testing the app?
              </small>
              <button
                type="button"
                onClick={handleDemoFill}
                className="btn btn-sm"
                style={{
                  backgroundColor: '#6355E6',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: 6,
                  padding: '4px 12px'
                }}
              >
                1-Click Demo Fill
              </button>
            </div>

            <div className="mb-3">
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#160D33', display: 'block', marginBottom: 6 }}>
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

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#160D33', margin: 0 }}>
                  Password
                </label>
                <span 
                  onClick={() => alert('Demo Reset: Click "1-Click Demo Fill" above to sign in instantly!')}
                  style={{ fontSize: '0.78rem', color: '#6355E6', fontWeight: 600, cursor: 'pointer' }}
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

            <button
              type="submit"
              className="btn w-100 mt-2"
              style={{
                backgroundColor: '#6355E6',
                color: '#FFFFFF',
                borderRadius: 12,
                padding: '13px',
                fontSize: '0.96rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(99, 85, 230, 0.35)'
              }}
            >
              Sign In to Safe Hub
            </button>

          </form>
        ) : (
          /* ── TAB 2: SIGN UP ── */
          <form onSubmit={handleSignUpSubmit}>
            
            <div className="mb-3">
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#160D33', display: 'block', marginBottom: 6 }}>
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

            <div className="row g-2 mb-3">
              <div className="col-12 col-sm-6">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#160D33', display: 'block', marginBottom: 4 }}>
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
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#160D33', display: 'block', marginBottom: 4 }}>
                  Mobile Number
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

            <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: '#F8F7FD', border: '1px solid #ECE7FD' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#6355E6', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Primary Emergency Guardian
              </span>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Name (e.g. Mom)"
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
            </div>

            <div className="mb-4">
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#160D33', display: 'block', marginBottom: 6 }}>
                Password
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

            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: '#6355E6',
                color: '#FFFFFF',
                borderRadius: 12,
                padding: '13px',
                fontSize: '0.96rem',
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
          <div className="d-flex align-items-center justify-content-center gap-2 text-muted" style={{ fontSize: '0.78rem' }}>
            <FaShieldAlt style={{ color: '#10B981' }} />
            <span>Private by Design · End-to-end encrypted local credentials</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SignInPage;
