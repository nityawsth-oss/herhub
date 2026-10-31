import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShieldAlt, FaFolder, FaFolderPlus, FaFileAlt, FaLock, FaCheck, FaPlus, FaPrint, FaTrash, FaDownload, FaRedo } from 'react-icons/fa';

function EvidenceCaseOrganizerPage() {
  const [demoStarted, setDemoStarted] = useState(false);
  const [activeFolderId, setActiveFolderId] = useState('case_1');

  const [folders, setFolders] = useState([
    {
      id: 'case_1',
      name: 'Instagram Harassment & Clone Account',
      dateCreated: '2026-10-18',
      status: 'Active',
      filesCount: 3,
      files: [
        {
          id: 'f1',
          name: 'Screenshot_20261018_2130.png',
          type: 'Image Screenshot',
          size: '2.4 MB',
          dateRecorded: '2026-10-18 21:30',
          hash: 'sha256: 8a4f9b2c...e17d',
          notes: 'Uncut screenshot showing handle @fake_neha_urgent with visible system clock and phone battery status.'
        },
        {
          id: 'f2',
          name: 'ChatExport_Instagram_Direct.txt',
          type: 'Text Conversation Log',
          size: '142 KB',
          dateRecorded: '2026-10-18 22:15',
          hash: 'sha256: d391b10a...47ca',
          notes: 'Full export containing extortion demand messages and payment UPI reference.'
        },
        {
          id: 'f3',
          name: 'UPI_QR_Payment_Demand.pdf',
          type: 'Document / Receipt',
          size: '480 KB',
          dateRecorded: '2026-10-19 09:00',
          hash: 'sha256: c5289ab4...12fe',
          notes: 'QR code and banking VPA sent by extortionist demanding ₹25,000.'
        }
      ]
    },
    {
      id: 'case_2',
      name: 'Unsolicited VoIP Call Barrage',
      dateCreated: '2026-10-15',
      status: 'Archived',
      filesCount: 2,
      files: [
        {
          id: 'f4',
          name: 'Call_History_Export_Airtel.csv',
          type: 'Telecom Data Sheet',
          size: '98 KB',
          dateRecorded: '2026-10-15 23:45',
          hash: 'sha256: 7f88410c...33b9',
          notes: 'Logs showing 6 unsolicited VoIP calls originating outside India within 10 minutes.'
        },
        {
          id: 'f5',
          name: 'Voicemail_Recording_Sample.m4a',
          type: 'Audio File',
          size: '1.8 MB',
          dateRecorded: '2026-10-16 00:05',
          hash: 'sha256: 129fa084...980e',
          notes: 'Robocall recording threatening account deactivation.'
        }
      ]
    }
  ]);

  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('Image Screenshot');
  const [newFileNotes, setNewFileNotes] = useState('');

  const [localNoteSaved, setLocalNoteSaved] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');

  const currentFolder = folders.find(f => f.id === activeFolderId) || folders[0];

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newF = {
      id: `case_${Date.now()}`,
      name: newFolderName,
      dateCreated: new Date().toISOString().split('T')[0],
      status: 'Active',
      filesCount: 0,
      files: []
    };

    setFolders([...folders, newF]);
    setActiveFolderId(newF.id);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  const handleAddFile = (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newFile = {
      id: `f_${Date.now()}`,
      name: newFileName,
      type: newFileType,
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      dateRecorded: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      hash: `sha256: ${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      notes: newFileNotes || 'Recorded in private sandbox'
    };

    const updatedFolders = folders.map(f => {
      if (f.id === currentFolder.id) {
        return {
          ...f,
          filesCount: f.filesCount + 1,
          files: [...f.files, newFile]
        };
      }
      return f;
    });

    setFolders(updatedFolders);
    setNewFileName('');
    setNewFileNotes('');
    setShowAddFileModal(false);
  };

  const handleDeleteFile = (fileId) => {
    const updatedFolders = folders.map(f => {
      if (f.id === currentFolder.id) {
        return {
          ...f,
          filesCount: Math.max(0, f.filesCount - 1),
          files: f.files.filter(file => file.id !== fileId)
        };
      }
      return f;
    });
    setFolders(updatedFolders);
  };

  return (
    <div style={{ backgroundColor: '#FDFDFE', minHeight: '100vh' }}>
      
      {/* ════════ DARK HERO BANNER ════════ */}
      <section style={{ backgroundColor: '#160D33', color: '#FFFFFF', padding: '50px 0 65px' }}>
        <div className="container">
          
          {/* Back link */}
          <Link 
            to="/" 
            className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none"
            style={{ color: '#B2AECB', fontSize: '0.88rem', fontWeight: 500 }}
          >
            <span>← Back to safety hub</span>
          </Link>

          <div className="row align-items-center">
            
            {/* Left Content */}
            <div className="col-12 col-md-9 col-lg-8">
              <div 
                style={{ 
                  color: '#9887FE', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  letterSpacing: '1.6px', 
                  textTransform: 'uppercase',
                  marginBottom: 14 
                }}
              >
                FOLLOW UP · DEMO
              </div>

              <h1 
                style={{ 
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', 
                  fontWeight: 800, 
                  letterSpacing: '-0.5px',
                  marginBottom: 16 
                }}
              >
                Evidence & Case Organizer
              </h1>

              <p 
                style={{ 
                  fontSize: '1.05rem', 
                  color: '#C7C3DF', 
                  lineHeight: 1.65, 
                  maxWidth: 620,
                  marginBottom: 26 
                }}
              >
                Create private case folders and record file metadata. This is a guided, educational experience built to support informed choices—not to predict danger or replace professional support.
              </p>

              <span 
                style={{ 
                  display: 'inline-block',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 50,
                  padding: '6px 16px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  color: '#D5CEFD',
                  textTransform: 'uppercase'
                }}
              >
                DEMO · NO EXTERNAL SERVICE CONNECTED
              </span>
            </div>

            {/* Right Large Stylized Square Outline Graphic */}
            <div className="col-12 col-md-3 col-lg-4 text-center text-md-end mt-4 mt-md-0">
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 140,
                  height: 140,
                  color: '#8A7CFE',
                  opacity: 0.95
                }}
              >
                {/* Square outline SVG matching user screenshot */}
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <rect x="20" y="20" width="60" height="60" stroke="#8A7CFE" strokeWidth="8" rx="4" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════ MAIN CONTENT / GUIDED DEMO ════════ */}
      <section style={{ padding: '60px 0 90px' }}>
        <div className="container">
          <div className="row g-5">
            
            {/* Left 8 Cols: Guided Demo */}
            <div className="col-12 col-lg-8">
              
              <div 
                style={{ 
                  color: '#6355E6', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  letterSpacing: '1.6px', 
                  textTransform: 'uppercase',
                  marginBottom: 8 
                }}
              >
                TRY IT SAFELY
              </div>

              <h2 
                style={{ 
                  fontSize: '2.1rem', 
                  fontWeight: 800, 
                  color: '#160D33',
                  marginBottom: 28 
                }}
              >
                Explore this guided demo
              </h2>

              {!demoStarted ? (
                /* ── INITIAL DEMO CARD (Matching user screenshot) ── */
                <div 
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    border: '1px solid #ECECF2',
                    padding: '36px',
                    boxShadow: '0 8px 30px rgba(18, 16, 43, 0.04)'
                  }}
                >
                  <div className="row align-items-center g-4">
                    
                    {/* Left preview square */}
                    <div className="col-12 col-md-5 col-lg-5">
                      <div 
                        style={{
                          backgroundColor: '#F5F3FF',
                          borderRadius: 20,
                          height: 240,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          padding: 20
                        }}
                      >
                        <div 
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            border: '1.5px solid #D5CEFD',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#7967FD',
                            marginBottom: 16,
                            boxShadow: '0 4px 14px rgba(121, 103, 253, 0.1)'
                          }}
                        >
                          <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                            <rect x="22" y="22" width="56" height="56" stroke="#7967FD" strokeWidth="8" rx="4" />
                          </svg>
                        </div>

                        <span 
                          style={{ 
                            color: '#9892B0', 
                            fontSize: '0.86rem', 
                            fontWeight: 500 
                          }}
                        >
                          Ready when you are
                        </span>
                      </div>
                    </div>

                    {/* Right details */}
                    <div className="col-12 col-md-7 col-lg-7">
                      <span 
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#EDE8FE',
                          color: '#6355E6',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.8px',
                          padding: '4px 12px',
                          borderRadius: 20,
                          textTransform: 'uppercase',
                          marginBottom: 14
                        }}
                      >
                        DEMO
                      </span>

                      <h3 
                        style={{ 
                          fontSize: '1.45rem', 
                          fontWeight: 800, 
                          color: '#160D33',
                          marginBottom: 12 
                        }}
                      >
                        A thoughtful, private starting point
                      </h3>

                      <p 
                        style={{ 
                          fontSize: '0.94rem', 
                          color: '#65607E', 
                          lineHeight: 1.6,
                          marginBottom: 24 
                        }}
                      >
                        Walk through sample inputs and explanations. This demo uses fictional data and does not access your microphone, camera, location, contacts, or files.
                      </p>

                      <button
                        onClick={() => setDemoStarted(true)}
                        style={{
                          backgroundColor: '#6355E6',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 12,
                          padding: '12px 24px',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(99, 85, 230, 0.3)',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#5041DE'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6355E6'}
                      >
                        <span>Start demo</span>
                        <FaArrowRight style={{ fontSize: '0.82rem' }} />
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                /* ── ACTIVE CASE ORGANIZER WORKSPACE ── */
                <div 
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    border: '1px solid #ECECF2',
                    padding: '32px',
                    boxShadow: '0 8px 30px rgba(18, 16, 43, 0.05)'
                  }}
                >
                  
                  {/* Top Bar */}
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-4 border-bottom">
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6355E6', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        Private Case Vault
                      </span>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#160D33', margin: '4px 0 0' }}>
                        Evidence & Metadata Organizer
                      </h4>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        onClick={() => setShowNewFolderModal(true)}
                        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
                        style={{ borderColor: '#6355E6', color: '#6355E6', borderRadius: 10, padding: '7px 14px', fontWeight: 600 }}
                      >
                        <FaFolderPlus />
                        <span>New Folder</span>
                      </button>

                      <button
                        onClick={() => setShowAddFileModal(true)}
                        className="btn btn-sm btn-primary d-inline-flex align-items-center gap-2"
                        style={{ backgroundColor: '#6355E6', borderColor: '#6355E6', borderRadius: 10, padding: '7px 14px', fontWeight: 600 }}
                      >
                        <FaPlus />
                        <span>Record Evidence</span>
                      </button>

                      <button
                        onClick={() => setDemoStarted(false)}
                        className="btn btn-sm btn-outline-secondary"
                        style={{ borderRadius: 10, padding: '7px 12px' }}
                      >
                        <FaRedo />
                      </button>
                    </div>
                  </div>

                  {/* Case Folders Tabs */}
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {folders.map(folder => (
                      <button
                        key={folder.id}
                        onClick={() => setActiveFolderId(folder.id)}
                        style={{
                          padding: '10px 18px',
                          borderRadius: 12,
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          border: '1px solid',
                          borderColor: activeFolderId === folder.id ? '#6355E6' : '#E5E3EE',
                          backgroundColor: activeFolderId === folder.id ? '#EDE8FE' : '#F9F8FD',
                          color: activeFolderId === folder.id ? '#6355E6' : '#555',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8
                        }}
                      >
                        <FaFolder style={{ color: activeFolderId === folder.id ? '#6355E6' : '#A09BB8' }} />
                        <span>{folder.name}</span>
                        <span className="badge rounded-pill" style={{ backgroundColor: activeFolderId === folder.id ? '#6355E6' : '#DEDAE8', color: '#fff', fontSize: '0.7rem' }}>
                          {folder.filesCount}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Active Folder Header */}
                  <div className="p-3 mb-4 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-3" style={{ backgroundColor: '#F8F7FD', border: '1px solid #ECE7FD' }}>
                    <div>
                      <strong style={{ color: '#160D33', fontSize: '0.98rem', display: 'block' }}>{currentFolder.name}</strong>
                      <small className="text-muted">Created: {currentFolder.dateCreated} · Status: <span className="text-success fw-bold">{currentFolder.status}</span></small>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="badge" style={{ backgroundColor: '#E2FBE8', color: '#10B981', padding: '6px 12px', fontSize: '0.74rem' }}>
                        ✓ Cryptographic SHA-256 Intact
                      </span>
                    </div>
                  </div>

                  {/* Evidence Files Table */}
                  <div className="table-responsive">
                    <table className="table table-hover align-middle" style={{ fontSize: '0.86rem' }}>
                      <thead style={{ backgroundColor: '#F9F8FD', color: '#65607E', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                        <tr>
                          <th>Item / File Name</th>
                          <th>Category</th>
                          <th>File Size</th>
                          <th>Hash Verification</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentFolder.files.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-4 text-muted">
                              No evidence recorded in this folder yet. Click "Record Evidence" above to add one.
                            </td>
                          </tr>
                        ) : (
                          currentFolder.files.map(file => (
                            <tr key={file.id}>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <FaFileAlt style={{ color: '#6355E6' }} />
                                  <div>
                                    <strong className="d-block" style={{ color: '#160D33' }}>{file.name}</strong>
                                    <small className="text-muted">{file.notes}</small>
                                  </div>
                                </div>
                              </td>
                              <td><span className="badge bg-light text-dark border">{file.type}</span></td>
                              <td>{file.size}</td>
                              <td>
                                <code style={{ fontSize: '0.75rem', color: '#6355E6', backgroundColor: '#F5F3FF', padding: '2px 6px', borderRadius: 4 }}>
                                  {file.hash}
                                </code>
                              </td>
                              <td className="text-end">
                                <button
                                  onClick={() => handleDeleteFile(file.id)}
                                  className="btn btn-sm text-danger border-0 p-1"
                                  title="Delete item"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Section 65B Integrity Notice */}
                  <div className="mt-4 p-3 rounded-3 d-flex align-items-start gap-3" style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7' }}>
                    <FaShieldAlt style={{ color: '#10B981', fontSize: '1.2rem', marginTop: 3, flexShrink: 0 }} />
                    <div style={{ fontSize: '0.84rem', color: '#065F46', lineHeight: 1.55 }}>
                      <strong>Evidence Integrity Guarantee (Sec 65B Indian Evidence Act / BSA):</strong>
                      <br />
                      This organizer records original file hashes (SHA-256) and timestamp attributes locally. When lodging cyber complaints, presenting verified file hashes proves digital screenshots were not altered or modified post-incident.
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Right 4 Cols: 01, 02, 03 Guidelines (Exact from user screenshot) */}
            <div className="col-12 col-lg-4">
              <div style={{ position: 'sticky', top: 90 }}>
                
                {/* 01 What this can do */}
                <div style={{ marginBottom: 36 }}>
                  <div 
                    style={{ 
                      color: '#9887FE', 
                      fontSize: '0.82rem', 
                      fontWeight: 700, 
                      marginBottom: 8 
                    }}
                  >
                    01
                  </div>
                  <h4 
                    style={{ 
                      fontSize: '1.18rem', 
                      fontWeight: 800, 
                      color: '#160D33',
                      marginBottom: 10 
                    }}
                  >
                    What this can do
                  </h4>
                  <p 
                    style={{ 
                      fontSize: '0.92rem', 
                      color: '#65607E', 
                      lineHeight: 1.6,
                      margin: 0 
                    }}
                  >
                    Offer clear prompts, educational context, and a place to reflect on your own next step.
                  </p>
                </div>

                {/* 02 What this cannot do */}
                <div style={{ marginBottom: 36 }}>
                  <div 
                    style={{ 
                      color: '#9887FE', 
                      fontSize: '0.82rem', 
                      fontWeight: 700, 
                      marginBottom: 8 
                    }}
                  >
                    02
                  </div>
                  <h4 
                    style={{ 
                      fontSize: '1.18rem', 
                      fontWeight: 800, 
                      color: '#160D33',
                      marginBottom: 10 
                    }}
                  >
                    What this cannot do
                  </h4>
                  <p 
                    style={{ 
                      fontSize: '0.92rem', 
                      color: '#65607E', 
                      lineHeight: 1.6,
                      margin: 0 
                    }}
                  >
                    It cannot predict crime, contact emergency services, verify evidence, or guarantee your safety.
                  </p>
                </div>

                {/* 03 Keep control */}
                <div>
                  <div 
                    style={{ 
                      color: '#9887FE', 
                      fontSize: '0.82rem', 
                      fontWeight: 700, 
                      marginBottom: 8 
                    }}
                  >
                    03
                  </div>
                  <h4 
                    style={{ 
                      fontSize: '1.18rem', 
                      fontWeight: 800, 
                      color: '#160D33',
                      marginBottom: 10 
                    }}
                  >
                    Keep control
                  </h4>
                  
                  <button
                    onClick={() => setShowNoteModal(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#6355E6',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer'
                    }}
                  >
                    <span>Save a local note</span>
                    <span>→</span>
                  </button>

                  {localNoteSaved && (
                    <div 
                      className="mt-2 text-success" 
                      style={{ fontSize: '0.82rem', fontWeight: 600 }}
                    >
                      ✓ Local note stored privately in this browser session.
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MODAL: CREATE NEW CASE FOLDER ── */}
      {showNewFolderModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 14, 45, 0.65)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
          onClick={() => setShowNewFolderModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              maxWidth: 480,
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h5 style={{ fontWeight: 800, color: '#160D33', marginBottom: 14 }}>
              Create New Evidence Folder
            </h5>
            <form onSubmit={handleCreateFolder}>
              <div className="mb-3">
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6355E6', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Folder / Case Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Unwanted WhatsApp Extortion Calls"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  style={{ borderRadius: 10, fontSize: '0.92rem' }}
                  required
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" style={{ borderRadius: 10 }} onClick={() => setShowNewFolderModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#6355E6', borderColor: '#6355E6', borderRadius: 10 }}>
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: RECORD NEW EVIDENCE FILE ── */}
      {showAddFileModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 14, 45, 0.65)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
          onClick={() => setShowAddFileModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              maxWidth: 500,
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h5 style={{ fontWeight: 800, color: '#160D33', marginBottom: 14 }}>
              Record Evidence Metadata
            </h5>
            <form onSubmit={handleAddFile}>
              <div className="mb-3">
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6355E6', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  File Reference / Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Threat_Audio_Voice_Note.m4a"
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  style={{ borderRadius: 10, fontSize: '0.92rem' }}
                  required
                />
              </div>

              <div className="mb-3">
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6355E6', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Evidence Category
                </label>
                <select
                  className="form-select"
                  value={newFileType}
                  onChange={e => setNewFileType(e.target.value)}
                  style={{ borderRadius: 10, fontSize: '0.92rem' }}
                >
                  <option>Image Screenshot</option>
                  <option>Text Conversation Log</option>
                  <option>Audio Recording</option>
                  <option>Payment Receipt / VPA</option>
                  <option>Video Export</option>
                </select>
              </div>

              <div className="mb-3">
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6355E6', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Context & Observations
                </label>
                <textarea
                  rows={3}
                  className="form-control"
                  placeholder="Note device model, visible timestamp, or network sender ID..."
                  value={newFileNotes}
                  onChange={e => setNewFileNotes(e.target.value)}
                  style={{ borderRadius: 10, fontSize: '0.9rem' }}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" style={{ borderRadius: 10 }} onClick={() => setShowAddFileModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#6355E6', borderColor: '#6355E6', borderRadius: 10 }}>
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: SAVE A LOCAL NOTE ── */}
      {showNoteModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 14, 45, 0.65)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
          onClick={() => setShowNoteModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              maxWidth: 500,
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h5 style={{ fontWeight: 800, color: '#160D33', marginBottom: 12 }}>
              Save a Private Local Note
            </h5>
            <p style={{ fontSize: '0.86rem', color: '#65607E', marginBottom: 16 }}>
              Notes are stored only in memory for this session and are never sent to external servers.
            </p>
            <textarea
              rows={4}
              className="form-control mb-3"
              placeholder="e.g. Always keep master copies on an offline USB drive..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              style={{ fontSize: '0.9rem', borderRadius: 12 }}
            />
            <div className="d-flex justify-content-end gap-2">
              <button 
                className="btn btn-light" 
                style={{ borderRadius: 10 }}
                onClick={() => setShowNoteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: '#6355E6', borderColor: '#6355E6', borderRadius: 10 }}
                onClick={() => {
                  setLocalNoteSaved(true);
                  setShowNoteModal(false);
                }}
              >
                Save locally
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default EvidenceCaseOrganizerPage;
