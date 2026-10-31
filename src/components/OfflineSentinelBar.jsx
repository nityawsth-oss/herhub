import React, { useState, useEffect } from 'react';
import { FaWifi, FaBolt, FaCheckCircle } from 'react-icons/fa';

export default function OfflineSentinelBar() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setDismissed(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline || dismissed) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: '#1E1035',
        borderBottom: '2px solid #F59E0B',
        color: '#FFFFFF',
        padding: '8px 16px',
        fontSize: '0.82rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 99999,
        position: 'sticky',
        top: 0,
        boxShadow: '0 4px 18px rgba(245, 158, 11, 0.25)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            backgroundColor: '#F59E0B',
            color: '#000000',
            padding: '2px 8px',
            borderRadius: 12,
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <FaBolt /> OFFLINE MODE
        </span>
        <span style={{ color: '#FDE68A' }}>
          Zero-Internet Sentinel Active — App is running 100% offline via local cache storage.
        </span>
        <span style={{ color: '#A7F3D0', fontSize: '0.76rem', display: 'none' }} className="d-md-inline">
          <FaCheckCircle style={{ marginRight: 4 }} />
          Siren, GPS lock, and Emergency Telephony operational.
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
          <FaWifi style={{ opacity: 0.5, marginRight: 4 }} /> Disconnected
        </span>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#CBD5E1',
            cursor: 'pointer',
            fontSize: '0.85rem',
            padding: '0 4px'
          }}
          title="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
