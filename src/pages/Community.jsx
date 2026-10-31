import React, { useState } from 'react';
import {
  FaHeart, FaComment, FaShare, FaMapMarkerAlt,
  FaShieldAlt, FaPlus, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';

const initialPosts = [
  {
    id: 1,
    type: 'checkin',
    author: 'Priya Mehta',
    location: 'Lajpat Nagar, Delhi',
    time: '5 min ago',
    content: 'Reached home safely! The route via South Ex was well-lit and safe tonight. 🙏',
    likes: 24,
    comments: 6,
    liked: false,
    avatar: 'P',
    tag: 'Safe Check-in',
    tagColor: '#10B981',
  },
  {
    id: 2,
    type: 'alert',
    author: 'Sambhavi Singh',
    location: 'Karol Bagh, Delhi',
    time: '18 min ago',
    content: '⚠️ Heads up! The lane near Karol Bagh metro is poorly lit after 9PM. Please avoid or go in groups.',
    likes: 47,
    comments: 12,
    liked: false,
    avatar: 'S',
    tag: 'Safety Alert',
    tagColor: '#EF4444',
  },
  {
    id: 3,
    type: 'tip',
    author: 'Ananya Sharma',
    location: 'Noida Sector 18',
    time: '1 hr ago',
    content: '💡 Tip: Always share your live location with at least one trusted contact when traveling after dark. HerHub makes it super easy — just tap "Share Journey" from the dashboard!',
    likes: 89,
    comments: 21,
    liked: false,
    avatar: 'A',
    tag: 'Safety Tip',
    tagColor: '#7C3AED',
  },
  {
    id: 4,
    type: 'checkin',
    author: 'Ritu Agarwal',
    location: 'Gurugram Sector 29',
    time: '2 hr ago',
    content: 'Just used the fake call feature for the first time — it worked perfectly! Felt so much safer. Thank you HerHub! ❤️',
    likes: 63,
    comments: 8,
    liked: false,
    avatar: 'R',
    tag: 'Safe Check-in',
    tagColor: '#10B981',
  },
  {
    id: 5,
    type: 'alert',
    author: 'Meera Joshi',
    location: 'Dwarka Sector 10, Delhi',
    time: '3 hr ago',
    content: '⚠️ Alert: Reported suspicious activity near the bus stop at Dwarka Sector 10 around 8PM. Stay alert, travel in groups if possible.',
    likes: 112,
    comments: 34,
    liked: false,
    avatar: 'M',
    tag: 'Safety Alert',
    tagColor: '#EF4444',
  },
  {
    id: 6,
    type: 'tip',
    author: 'Divya Krishnan',
    location: 'Bengaluru, Karnataka',
    time: '5 hr ago',
    content: '💡 Pro tip: Save 112 and 1091 on speed dial. Also, the HerHub SOS button alerts your guardians automatically — no need to call manually in an emergency!',
    likes: 156,
    comments: 28,
    liked: false,
    avatar: 'D',
    tag: 'Safety Tip',
    tagColor: '#7C3AED',
  },
];

const typeIcon = {
  checkin: <FaCheckCircle />,
  alert:   <FaExclamationTriangle />,
  tip:     <FaShieldAlt />,
};

function Community() {
  const [posts,      setPosts]      = useState(initialPosts);
  const [filter,     setFilter]     = useState('all');
  const [newPost,    setNewPost]    = useState('');
  const [showForm,   setShowForm]   = useState(false);
  const [postType,   setPostType]   = useState('checkin');

  /* Toggle like */
  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  /* Submit new post */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const tagMap = {
      checkin: { tag: 'Safe Check-in', tagColor: '#10B981' },
      alert:   { tag: 'Safety Alert',  tagColor: '#EF4444' },
      tip:     { tag: 'Safety Tip',    tagColor: '#7C3AED' },
    };

    const post = {
      id: Date.now(),
      type: postType,
      author: 'You',
      location: 'Your Location',
      time: 'Just now',
      content: newPost,
      likes: 0,
      comments: 0,
      liked: false,
      avatar: 'Y',
      ...tagMap[postType],
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setShowForm(false);
  };

  const filtered = filter === 'all'
    ? posts
    : posts.filter((p) => p.type === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#0F0A1E', padding: '60px 0' }}>
      <div className="container">

        {/* ── Header ── */}
        <div className="text-center mb-5">
          <span className="section-tag">Community</span>
          <h2 className="section-title">Safety Community Feed</h2>
          <p className="section-subtitle">
            Share check-ins, safety alerts, and tips with women in your city. Together we are safer.
          </p>
        </div>

        <div className="row g-4">

          {/* ── MAIN FEED ── */}
          <div className="col-12 col-lg-8">

            {/* New Post Button */}
            <div
              className="mb-4 px-4 py-3 d-flex align-items-center gap-3"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(139,92,246,0.3)',
                borderRadius: 16,
                cursor: 'pointer',
              }}
              onClick={() => setShowForm(!showForm)}
            >
              <div className="author-avatar" style={{ width: 40, height: 40, borderRadius: '50%', fontSize: '1rem' }}>Y</div>
              <span style={{ color: '#64748B', fontSize: '0.9rem', flex: 1 }}>
                Share a safety update with the community...
              </span>
              <button className="btn btn-primary-pink py-1 px-3" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                <FaPlus style={{ marginRight: 6 }} />
                Post
              </button>
            </div>

            {/* New Post Form */}
            {showForm && (
              <form onSubmit={handleSubmit} className="mb-4 p-4" style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(139,92,246,0.35)',
                borderRadius: 16,
              }}>
                {/* Post Type */}
                <div className="d-flex gap-2 mb-3 flex-wrap">
                  {[
                    { key: 'checkin', label: '✅ Check-in' },
                    { key: 'alert',   label: '⚠️ Alert' },
                    { key: 'tip',     label: '💡 Tip' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setPostType(t.key)}
                      className="btn"
                      style={{
                        borderRadius: 50, padding: '5px 16px', fontSize: '0.82rem', fontWeight: 600,
                        background: postType === t.key ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)',
                        border: postType === t.key ? '1px solid #7C3AED' : '1px solid rgba(139,92,246,0.25)',
                        color: postType === t.key ? '#C4B5FD' : '#94A3B8',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <textarea
                  className="form-control mb-3"
                  rows={3}
                  placeholder="Share your safety update, alert, or tip..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  required
                />
                <div className="d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-outline-white py-2 px-4"
                    onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-pink py-2 px-4">
                    Post Update
                  </button>
                </div>
              </form>
            )}

            {/* Filter Tabs */}
            <div className="d-flex gap-2 mb-4 flex-wrap">
              {[
                { key: 'all',     label: '📋 All' },
                { key: 'checkin', label: '✅ Check-ins' },
                { key: 'alert',   label: '⚠️ Alerts' },
                { key: 'tip',     label: '💡 Tips' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="btn"
                  style={{
                    borderRadius: 50, padding: '6px 18px', fontSize: '0.85rem', fontWeight: 600,
                    border: filter === f.key ? '1px solid #7C3AED' : '1px solid rgba(139,92,246,0.3)',
                    background: filter === f.key ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)',
                    color: filter === f.key ? '#C4B5FD' : '#94A3B8',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            {filtered.map((post) => (
              <div key={post.id} className="community-post">

                {/* Author Row */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="author-avatar">{post.avatar}</div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>
                        {post.author}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px',
                          borderRadius: 50, background: `${post.tagColor}22`,
                          border: `1px solid ${post.tagColor}55`, color: post.tagColor,
                        }}
                      >
                        {typeIcon[post.type]}{' '}{post.tag}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <FaMapMarkerAlt style={{ color: '#EC4899', fontSize: '0.7rem' }} />
                      <span style={{ color: '#64748B', fontSize: '0.78rem' }}>{post.location}</span>
                      <span style={{ color: '#334155', fontSize: '0.72rem' }}>· {post.time}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p style={{ color: '#C4B5FD', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 16 }}>
                  {post.content}
                </p>

                {/* Action Bar */}
                <div className="d-flex align-items-center gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="btn p-0 d-flex align-items-center gap-2"
                    style={{
                      color: post.liked ? '#EC4899' : '#64748B',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: 'none',
                      border: 'none',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    <FaHeart />
                    {post.likes}
                  </button>
                  <button
                    className="btn p-0 d-flex align-items-center gap-2"
                    style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600, background: 'none', border: 'none' }}
                  >
                    <FaComment />
                    {post.comments}
                  </button>
                  <button
                    className="btn p-0 d-flex align-items-center gap-2 ms-auto"
                    style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600, background: 'none', border: 'none' }}
                  >
                    <FaShare />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="col-12 col-lg-4">

            {/* Community Stats */}
            <div className="dashboard-card mb-4">
              <h6 className="fw-bold text-white mb-3">🌸 Community Stats</h6>
              {[
                { label: 'Active Members',    value: '2,847',  color: '#C4B5FD' },
                { label: 'Safe Check-ins Today', value: '134', color: '#10B981' },
                { label: 'Alerts This Week',  value: '12',     color: '#EF4444' },
                { label: 'Tips Shared',       value: '568',    color: '#7C3AED' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="d-flex justify-content-between align-items-center py-2"
                  style={{ borderBottom: '1px solid rgba(139,92,246,0.1)' }}
                >
                  <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{s.label}</span>
                  <span style={{ color: s.color, fontWeight: 700, fontSize: '0.95rem' }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Active Users Nearby */}
            <div className="dashboard-card mb-4">
              <h6 className="fw-bold text-white mb-3">📍 Active Nearby</h6>
              {[
                { name: 'Kavya R.',   loc: '0.4 km · Connaught Place', av: 'K' },
                { name: 'Sneha P.',   loc: '0.9 km · Janpath',         av: 'S' },
                { name: 'Tanvi M.',   loc: '1.2 km · Karol Bagh',      av: 'T' },
                { name: 'Pooja D.',   loc: '1.8 km · Saket',           av: 'P' },
              ].map((u) => (
                <div key={u.name} className="d-flex align-items-center gap-3 mb-3">
                  <div className="author-avatar" style={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                    {u.av}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{u.name}</div>
                    <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{u.loc}</div>
                  </div>
                  <div
                    style={{
                      marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%',
                      background: '#10B981', animation: 'pulse-dot 1.5s infinite',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Quick Emergency */}
            <div className="dashboard-card">
              <h6 className="fw-bold text-white mb-3">🚨 Quick Emergency</h6>
              <div className="d-flex flex-column gap-2">
                {[
                  { num: '112', label: 'National Emergency', color: '#EF4444' },
                  { num: '1091', label: 'Women Helpline',    color: '#EC4899' },
                  { num: '100',  label: 'Police',            color: '#3B82F6' },
                ].map((e) => (
                  <a
                    key={e.num}
                    href={`tel:${e.num}`}
                    className="d-flex align-items-center justify-content-between px-3 py-2 text-decoration-none"
                    style={{
                      background: `${e.color}11`,
                      border: `1px solid ${e.color}33`,
                      borderRadius: 10,
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{e.label}</span>
                    <span style={{ color: e.color, fontWeight: 800, fontSize: '1rem' }}>{e.num}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;
