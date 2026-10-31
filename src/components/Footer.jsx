import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="exact-footer">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
          
          {/* Logo & Tagline */}
          <Link to="/" className="d-flex align-items-center gap-3 text-decoration-none">
            <div className="brand-badge-logo">
              <FaHeart style={{ fontSize: '0.82rem', color: '#fff' }} />
            </div>
            <span className="brand-title">HERHUB</span>
            <span className="d-none d-sm-inline" style={{ color: '#8E8BA7', fontSize: '0.82rem' }}>
              — Your safety. Your voice. Your community.
            </span>
          </Link>

          {/* Links */}
          <div className="d-flex flex-wrap justify-content-center gap-4">
            <Link to="/safety-hub" className="footer-nav-link m-0 text-decoration-none">Safety tools</Link>
            <Link to="/community" className="footer-nav-link m-0 text-decoration-none">Community</Link>
            <Link to="/deepfake-forensics" className="footer-nav-link m-0 text-decoration-none">Digital Safety</Link>
            <Link to="/about" className="footer-nav-link m-0 text-decoration-none">About</Link>
          </div>

        </div>

        <div className="text-center text-md-start mt-4 pt-3 border-top" style={{ borderColor: '#F0EDFA', fontSize: '0.78rem', color: '#A09DB7' }}>
          © {new Date().getFullYear()} HERHUB. Designed for women's autonomy, privacy, and safety.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
