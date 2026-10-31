import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaHeart, FaPen, FaShieldAlt } from 'react-icons/fa';
import { getThoughts, likeThought, isThoughtLiked } from '../services/communityThoughtsService';
import ShareThoughtModal from './ShareThoughtModal';

function AwarenessTicker() {
  const [thoughts, setThoughts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slideAnim, setSlideAnim] = useState('fade-in');
  const timerRef = useRef(null);

  // Load thoughts from storage & sync on custom event
  const refreshThoughts = () => {
    const list = getThoughts();
    setThoughts(list);
  };

  useEffect(() => {
    refreshThoughts();

    const handleUpdate = () => {
      refreshThoughts();
    };

    window.addEventListener('herhub_thoughts_updated', handleUpdate);
    return () => window.removeEventListener('herhub_thoughts_updated', handleUpdate);
  }, []);

  // Auto-sliding interval (every 4.5 seconds)
  useEffect(() => {
    if (isPaused || thoughts.length <= 1) return;

    timerRef.current = setInterval(() => {
      setSlideAnim('slide-out');
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % thoughts.length);
        setSlideAnim('slide-in');
      }, 250);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, thoughts.length, currentIndex]);

  const goToNext = () => {
    setSlideAnim('slide-out');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % thoughts.length);
      setSlideAnim('slide-in');
    }, 150);
  };

  const goToPrev = () => {
    setSlideAnim('slide-out');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + thoughts.length) % thoughts.length);
      setSlideAnim('slide-in');
    }, 150);
  };

  const handleLike = (e, id) => {
    e.stopPropagation();
    likeThought(id);
    refreshThoughts();
  };

  if (!thoughts || thoughts.length === 0) return null;

  const currentThought = thoughts[currentIndex] || thoughts[0];
  const isLiked = isThoughtLiked(currentThought.id);

  return (
    <>
      <div 
        className="awareness-top-ticker"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          background: 'linear-gradient(90deg, #120926 0%, #1D103D 50%, #120926 100%)',
          color: '#FFFFFF',
          borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 2px 12px rgba(18, 9, 38, 0.35)',
          padding: '6px 0',
          position: 'relative',
          zIndex: 1001,
          fontSize: '0.82rem',
          userSelect: 'none'
        }}
      >
        <div className="container-fluid px-3 px-md-4">
          <div className="d-flex align-items-center justify-content-between gap-2">
            
            {/* 1. LEFT LIVE BADGE */}
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <span 
                className="badge d-inline-flex align-items-center gap-1 px-2 py-1"
                style={{
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '0.68rem',
                  letterSpacing: '0.5px',
                  borderRadius: 6
                }}
              >
                <span className="spinner-grow spinner-grow-sm text-light" style={{ width: 6, height: 6 }} />
                LIVE AWARENESS
              </span>

              <span className="badge bg-secondary bg-opacity-25 text-light d-none d-md-inline" style={{ fontSize: '0.68rem', borderRadius: 4 }}>
                {currentIndex + 1} / {thoughts.length}
              </span>
            </div>

            {/* 2. CENTER SLIDING THOUGHT CONTENT */}
            <div 
              className="flex-grow-1 overflow-hidden mx-2 text-center text-md-start"
              style={{
                minHeight: '26px',
                display: 'flex',
                alignItems: 'center',
                transition: 'opacity 0.25s ease, transform 0.25s ease',
                opacity: slideAnim === 'slide-out' ? 0.2 : 1,
                transform: slideAnim === 'slide-out' ? 'translateY(-4px)' : 'translateY(0)'
              }}
            >
              <div className="d-flex align-items-center gap-2 flex-wrap flex-md-nowrap w-100 justify-content-center justify-content-md-start">
                
                {/* Category Pill */}
                <span 
                  className="badge px-2 py-1 text-nowrap flex-shrink-0"
                  style={{
                    backgroundColor: `${currentThought.categoryColor}25`,
                    color: currentThought.categoryColor,
                    border: `1px solid ${currentThought.categoryColor}60`,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: 6
                  }}
                >
                  {currentThought.icon} {currentThought.category}
                </span>

                {/* The Awareness Thought */}
                <span 
                  className="text-truncate text-light fw-medium"
                  style={{
                    maxWidth: 'clamp(280px, 50vw, 750px)',
                    fontSize: '0.8rem',
                    color: '#F1F5F9',
                    letterSpacing: '0.2px'
                  }}
                  title={currentThought.content}
                >
                  "{currentThought.content}"
                </span>

                {/* Anonymous Author Tag (Strict Zero Identity Disclosure) */}
                <span 
                  className="d-none d-lg-inline-flex align-items-center gap-1 text-nowrap flex-shrink-0"
                  style={{ fontSize: '0.72rem', color: '#A5B4FC' }}
                >
                  <FaShieldAlt style={{ color: '#10B981', fontSize: '0.65rem' }} />
                  <span>{currentThought.alias}</span>
                  {currentThought.region && (
                    <span style={{ color: '#64748B' }}>· {currentThought.region}</span>
                  )}
                </span>

                {/* Quick Like Heart */}
                <button
                  type="button"
                  onClick={(e) => handleLike(e, currentThought.id)}
                  className="btn btn-sm p-0 d-inline-flex align-items-center gap-1 border-0 bg-transparent text-nowrap flex-shrink-0"
                  style={{
                    color: isLiked ? '#EC4899' : '#94A3B8',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                  title="Stand in solidarity"
                >
                  <FaHeart style={{ transform: isLiked ? 'scale(1.15)' : 'none', transition: 'transform 0.15s' }} />
                  <span>{currentThought.likes || 0}</span>
                </button>
              </div>
            </div>

            {/* 3. RIGHT CONTROLS & CTA BUTTON */}
            <div className="d-flex align-items-center gap-1 flex-shrink-0">
              
              {/* Prev / Play / Next Controls */}
              <div className="d-flex align-items-center bg-dark bg-opacity-50 rounded-2 p-1 me-1">
                <button
                  type="button"
                  onClick={goToPrev}
                  className="btn btn-sm text-light p-0 px-1 border-0"
                  style={{ fontSize: '0.7rem', opacity: 0.8 }}
                  title="Previous thought"
                >
                  <FaChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="btn btn-sm text-light p-0 px-1 border-0"
                  style={{ fontSize: '0.65rem', opacity: 0.8 }}
                  title={isPaused ? "Resume sliding" : "Pause sliding"}
                >
                  {isPaused ? <FaPlay /> : <FaPause />}
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="btn btn-sm text-light p-0 px-1 border-0"
                  style={{ fontSize: '0.7rem', opacity: 0.8 }}
                  title="Next thought"
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* POST AWARENESS BUTTON (Triggers Modal) */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="btn btn-sm d-inline-flex align-items-center gap-1 py-1 px-2"
                style={{
                  background: 'linear-gradient(135deg, #6355E6 0%, #8A7CFE 100%)',
                  color: '#FFFFFF',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(99, 85, 230, 0.4)'
                }}
              >
                <FaPen style={{ fontSize: '0.68rem' }} />
                <span>Share Voice</span>
              </button>

              {/* View All Link */}
              <Link
                to="/awareness-hub"
                className="d-none d-xl-inline text-decoration-none text-light opacity-75 ms-1"
                style={{ fontSize: '0.72rem', fontWeight: 600 }}
              >
                Wall →
              </Link>

            </div>

          </div>
        </div>
      </div>

      {/* SHARE THOUGHT MODAL */}
      <ShareThoughtModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onThoughtAdded={() => {
          refreshThoughts();
          setCurrentIndex(0); // Jump directly to the newly posted thought on top!
        }}
      />
    </>
  );
}

export default AwarenessTicker;
