'use client';

import { useState, useEffect } from 'react';

export default function HiddenFilesModal({ isOpen, onClose, type, onUnhide }) {
  const [hiddenFiles, setHiddenFiles] = useState([]);
  const [filesData, setFilesData] = useState({});
  const [loading, setLoading] = useState(false);
  const [unhidingFile, setUnhidingFile] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchHiddenFiles();
    }
  }, [isOpen, type]);

  const fetchHiddenFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/files/${type}?hidden=true`);
      const data = await response.json();
      
      setHiddenFiles(data.files || []);
      
      const fileDataMap = {};
      if (data.filesWithUrls) {
        data.filesWithUrls.forEach(file => {
          fileDataMap[file.filename] = file;
        });
      }
      setFilesData(fileDataMap);
    } catch (err) {
      console.error('Error fetching hidden files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnhide = async (filename) => {
    setUnhidingFile(filename);
    setDropdownOpen(null);
    
    try {
      const response = await fetch('/api/unhide-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          type
        })
      });

      if (response.ok) {
        await fetchHiddenFiles();
        if (onUnhide) {
          onUnhide();
        }
      } else {
        const error = await response.json();
        alert(`Failed to unhide file: ${error.error}`);
      }
    } catch (error) {
      console.error('Unhide error:', error);
      alert('Failed to unhide file');
    } finally {
      setUnhidingFile(null);
    }
  };

  const getFileTypeLabel = (filename) => {
    const extension = filename.split('.').pop().toUpperCase();
    if (extension === 'HTML') return 'HTML';
    if (extension === 'PDF') return 'PDF';
    if (extension === 'TXT') return 'TXT';
    return extension;
  };

  const getFileTypeColor = (filename) => {
    if (filename.toLowerCase().endsWith('.pdf')) return '#dc3545';
    if (filename.toLowerCase().endsWith('.html')) return '#0f3456';
    return '#6c757d';
  };

  const getEmoji = () => {
    if (type === 'mops') return '⚙️';
    if (type === 'sops') return '📋';
    if (type === 'eops') return '🚨';
    return '📄';
  };

  const getTitle = () => {
    if (type === 'mops') return 'Hidden MOPs';
    if (type === 'sops') return 'Hidden SOPs';
    if (type === 'eops') return 'Hidden EOPs';
    return 'Hidden Documents';
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '90%',
          maxHeight: '85%',
          width: '1000px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 30px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            color: '#0f3456',
            fontWeight: 'bold'
          }}>
            {getTitle()}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '30px',
              color: '#999',
              cursor: 'pointer',
              padding: '0',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '30px',
          overflowY: 'auto',
          flex: 1
        }}>
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              Loading hidden files...
            </div>
          ) : hiddenFiles.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '2px dashed #ddd'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '64px', opacity: 0.5 }}>{getEmoji()}</span>
              </div>
              <p style={{ margin: '0', fontSize: '18px', color: '#666' }}>
                No hidden {type.toUpperCase()} files
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {hiddenFiles.map((filename) => {
                const fileData = filesData[filename];
                const displayName = filename.replace('.pdf', '').replace('.txt', '').replace('.html', '');
                
                return (
                  <div
                    key={filename}
                    style={{
                      border: '1px solid #e0e0e0',
                      padding: '20px',
                      borderRadius: '10px',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      transform: hoveredCard === filename ? 'translateY(-3px)' : 'translateY(0)',
                      boxShadow: hoveredCard === filename ? '0 6px 20px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={() => setHoveredCard(filename)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Three dots menu - only show on hover */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        opacity: hoveredCard === filename ? 1 : 0,
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === filename ? null : filename)}
                        style={{
                          background: 'white',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          color: '#666',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f0f0f0';
                          e.currentTarget.style.borderColor = '#999';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.borderColor = '#ddd';
                        }}
                      >
                        ⋮
                      </button>
                      
                      {/* Dropdown menu */}
                      {dropdownOpen === filename && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '35px',
                            right: '0',
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            zIndex: 1000,
                            minWidth: '120px'
                          }}
                        >
                          <button
                            onClick={() => handleUnhide(filename)}
                            disabled={unhidingFile === filename}
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '10px 15px',
                              border: 'none',
                              background: 'none',
                              textAlign: 'left',
                              cursor: unhidingFile === filename ? 'wait' : 'pointer',
                              fontSize: '14px',
                              color: '#333',
                              transition: 'background-color 0.2s ease',
                              borderRadius: '6px'
                            }}
                            onMouseEnter={(e) => {
                              if (unhidingFile !== filename) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            {unhidingFile === filename ? 'Unhiding...' : 'Unhide'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* File info */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      paddingRight: '30px'
                    }}>
                      <span style={{ fontSize: '28px', flexShrink: 0 }}>{getEmoji()}</span>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          margin: '0 0 8px 0',
                          fontSize: '16px',
                          color: '#333',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          wordBreak: 'break-word'
                        }}>
                          {displayName}
                        </h4>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          backgroundColor: getFileTypeColor(filename),
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {getFileTypeLabel(filename)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}