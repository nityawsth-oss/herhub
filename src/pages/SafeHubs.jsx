import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaDirections, FaStar, FaMap, FaSearch } from 'react-icons/fa';

const allHubs = [
  {
    id: 1,
    type: 'police',
    name: 'Connaught Place Police Station',
    address: 'Connaught Place, New Delhi - 110001',
    distance: '0.3 km',
    phone: '011-23341234',
    open: '24/7',
    rating: 4.5,
  },
  {
    id: 2,
    type: 'hospital',
    name: 'Ram Manohar Lohia Hospital',
    address: 'Baba Kharak Singh Marg, New Delhi - 110001',
    distance: '0.7 km',
    phone: '011-23365525',
    open: '24/7',
    rating: 4.3,
  },
  {
    id: 3,
    type: 'safezone',
    name: 'Palika Bazaar Safe Zone',
    address: 'Connaught Place, New Delhi',
    distance: '0.9 km',
    phone: '112',
    open: '8AM – 10PM',
    rating: 4.1,
  },
  {
    id: 4,
    type: 'police',
    name: 'Janpath Police Post',
    address: 'Janpath, New Delhi - 110001',
    distance: '1.1 km',
    phone: '011-23364444',
    open: '24/7',
    rating: 4.2,
  },
  {
    id: 5,
    type: 'hospital',
    name: 'Lady Hardinge Medical College',
    address: 'Shaheed Bhagat Singh Marg, New Delhi',
    distance: '1.4 km',
    phone: '011-23408300',
    open: '24/7',
    rating: 4.4,
  },
  {
    id: 6,
    type: 'safezone',
    name: 'Central Park Safe Zone',
    address: 'Connaught Place Inner Circle, New Delhi',
    distance: '0.5 km',
    phone: '112',
    open: '6AM – 11PM',
    rating: 4.6,
  },
  {
    id: 7,
    type: 'police',
    name: 'Parliament Street Police Station',
    address: 'Parliament Street, New Delhi - 110001',
    distance: '1.6 km',
    phone: '011-23742073',
    open: '24/7',
    rating: 4.3,
  },
  {
    id: 8,
    type: 'hospital',
    name: 'Safdarjung Hospital',
    address: 'Sri Aurobindo Marg, New Delhi - 110029',
    distance: '2.2 km',
    phone: '011-26165060',
    open: '24/7',
    rating: 4.5,
  },
  {
    id: 9,
    type: 'safezone',
    name: 'Select Citywalk Mall Safe Zone',
    address: 'Saket, New Delhi - 110017',
    distance: '2.8 km',
    phone: '011-40500333',
    open: '10AM – 11PM',
    rating: 4.7,
  },
];

const typeConfig = {
  police:   { label: 'Police Station', badgeClass: 'badge-police',   icon: '👮', color: '#3B82F6' },
  hospital: { label: 'Hospital',       badgeClass: 'badge-hospital',  icon: '🏥', color: '#10B981' },
  safezone: { label: 'Safe Zone',      badgeClass: 'badge-safezone',  icon: '🛡️', color: '#7C3AED' },
};

function SafeHubs() {
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');

  const filtered = allHubs.filter((h) => {
    const matchType   = filter === 'all' || h.type === filter;
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
                        h.address.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0F0A1E', padding: '60px 0' }}>
      <div className="container">

        {/* ── Header ── */}
        <div className="text-center mb-5">
          <span className="section-tag">Safety Map</span>
          <h2 className="section-title">Nearby Safe Hubs</h2>
          <p className="section-subtitle">
            Verified police stations, hospitals, and community safe zones near you — updated in real time.
          </p>
        </div>

        {/* ── Map Placeholder ── */}
        <div className="map-placeholder mb-5" style={{ height: 280 }}>
          <FaMap style={{ fontSize: '3.5rem', color: '#7C3AED', opacity: 0.6 }} />
          <span style={{ fontSize: '1rem', color: '#94A3B8' }}>Interactive Safety Map</span>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Showing safe hubs within 5 km of your location
          </span>
          <div className="d-flex gap-4 mt-2 flex-wrap justify-content-center">
            {Object.entries(typeConfig).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#94A3B8' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: val.color, display: 'inline-block' }} />
                {val.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Filters + Search ── */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">

          {/* Filter Buttons */}
          <div className="d-flex gap-2 flex-wrap">
            {[
              { key: 'all',      label: '🔍 All Hubs' },
              { key: 'police',   label: '👮 Police' },
              { key: 'hospital', label: '🏥 Hospitals' },
              { key: 'safezone', label: '🛡️ Safe Zones' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="btn"
                style={{
                  borderRadius: 50,
                  padding: '7px 18px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: filter === f.key
                    ? '1px solid #7C3AED'
                    : '1px solid rgba(139,92,246,0.3)',
                  background: filter === f.key
                    ? 'rgba(124,58,237,0.25)'
                    : 'rgba(255,255,255,0.04)',
                  color: filter === f.key ? '#C4B5FD' : '#94A3B8',
                  transition: 'all 0.2s ease',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="position-relative" style={{ minWidth: 240 }}>
            <FaSearch style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)', color: '#64748B', fontSize: '0.85rem',
            }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search hubs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 38 }}
            />
          </div>
        </div>

        {/* ── Results Count ── */}
        <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: 20 }}>
          Showing <span style={{ color: '#C4B5FD', fontWeight: 600 }}>{filtered.length}</span> safe hubs near you
        </p>

        {/* ── Hub Cards ── */}
        <div className="row g-4">
          {filtered.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
              <p style={{ color: '#94A3B8' }}>No hubs found for your search.</p>
            </div>
          ) : (
            filtered.map((hub) => {
              const cfg = typeConfig[hub.type];
              return (
                <div key={hub.id} className="col-12 col-md-6 col-lg-4">
                  <div className="safe-hub-card h-100">

                    {/* Top Row */}
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '1.4rem' }}>{cfg.icon}</span>
                        <span className={`hub-type-badge ${cfg.badgeClass}`}>{cfg.label}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1" style={{ color: '#F59E0B', fontSize: '0.8rem' }}>
                        <FaStar />
                        <span style={{ color: '#94A3B8' }}>{hub.rating}</span>
                      </div>
                    </div>

                    {/* Name */}
                    <h6 style={{ color: '#fff', fontWeight: 700, marginBottom: 6 }}>{hub.name}</h6>

                    {/* Address */}
                    <div className="d-flex align-items-start gap-2 mb-3">
                      <FaMapMarkerAlt style={{ color: '#EC4899', marginTop: 3, flexShrink: 0, fontSize: '0.8rem' }} />
                      <span style={{ color: '#94A3B8', fontSize: '0.83rem', lineHeight: 1.5 }}>{hub.address}</span>
                    </div>

                    {/* Info Row */}
                    <div className="d-flex gap-3 mb-4 flex-wrap">
                      <span style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)',
                        borderRadius: 50, padding: '3px 12px', fontSize: '0.77rem', color: '#C4B5FD',
                      }}>
                        📍 {hub.distance}
                      </span>
                      <span style={{
                        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                        borderRadius: 50, padding: '3px 12px', fontSize: '0.77rem', color: '#10B981',
                      }}>
                        🕐 {hub.open}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2">
                      <a
                        href={`tel:${hub.phone}`}
                        className="btn btn-call flex-grow-1"
                        style={{ fontSize: '0.82rem' }}
                      >
                        <FaPhone style={{ marginRight: 6 }} />
                        Call
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(hub.name)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn flex-grow-1"
                        style={{
                          borderRadius: 50, fontSize: '0.82rem', fontWeight: 600,
                          background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)',
                          color: '#C4B5FD',
                        }}
                      >
                        <FaDirections style={{ marginRight: 6 }} />
                        Directions
                      </a>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}

export default SafeHubs;
