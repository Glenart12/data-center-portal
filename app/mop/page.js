'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import UploadButton from '../components/UploadButton';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import MOPGenerationModal from '../components/MOPGenerationModal';
import HiddenFilesModal from '../components/HiddenFilesModal';

function MopPage() {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [filesData, setFilesData] = useState({}); // Store file URLs and metadata
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [deletingFile, setDeletingFile] = useState(null);
  const [hiddenFilesCount, setHiddenFilesCount] = useState(0);
  const [isHiddenModalOpen, setIsHiddenModalOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [hidingFile, setHidingFile] = useState(null);

  useEffect(() => {
    fetchFiles();
    fetchHiddenCount();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files/mops');
      const data = await response.json();
      
      // Store both the filenames array and the detailed data
      setFiles(data.files || []);
      setFilteredFiles(data.files || []);
      
      // Create a lookup object for file data
      const fileDataMap = {};
      if (data.filesWithUrls) {
        data.filesWithUrls.forEach(file => {
          fileDataMap[file.filename] = file;
        });
      }
      setFilesData(fileDataMap);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const fetchHiddenCount = async () => {
    try {
      const response = await fetch('/api/files/mops?hidden=true');
      const data = await response.json();
      setHiddenFilesCount(data.files?.length || 0);
    } catch (err) {
      console.error('Error fetching hidden files count:', err);
    }
  };

  // Filter files when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter(filename =>
        filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [files, searchTerm]);

  const handlePDFClick = (filename) => {
    const fileData = filesData[filename];
    const originalUrl = fileData?.url || `/mops/${filename}`;
    
    // For HTML files from blob storage, use the serve-html API
    const url = fileData?.source === 'blob' && filename.endsWith('.html') 
      ? `/api/serve-html?url=${encodeURIComponent(originalUrl)}`
      : originalUrl;
    
    setSelectedPDF({
      url: url,
      name: filename.replace('.pdf', '').replace('.txt', '').replace('.html', ''),
      fullFilename: filename  // Pass the full filename with extension
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPDF(null);
  };

  const closeGenerateModal = () => {
    setIsGenerateModalOpen(false);
    // Refresh files after closing generate modal
    fetchFiles();
    fetchHiddenCount();
  };

  const handleHide = async (filename, e) => {
    if (e) e.stopPropagation();
    setDropdownOpen(null);
    setHidingFile(filename);
    
    try {
      const response = await fetch('/api/hide-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          type: 'mops'
        })
      });

      if (response.ok) {
        await fetchFiles();
        await fetchHiddenCount();
      } else {
        const error = await response.json();
        alert(`Failed to hide file: ${error.error}`);
      }
    } catch (error) {
      console.error('Hide error:', error);
      alert('Failed to hide file');
    } finally {
      setHidingFile(null);
    }
  };

  const handleUnhideCallback = () => {
    fetchFiles();
    fetchHiddenCount();
  };


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleDelete = async (filename, e) => {
    e.stopPropagation(); // Prevent card click
    
    // Confirmation dialog
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    setDeletingFile(filename);

    try {
      const response = await fetch('/api/delete-file', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          type: 'mops'
        })
      });

      if (response.ok) {
        // Refresh the file list
        await fetchFiles();
        alert('File deleted successfully');
      } else {
        const error = await response.json();
        alert(`Failed to delete file: ${error.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    } finally {
      setDeletingFile(null);
    }
  };

  // Fixed button style with proper emoji and text alignment
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '180px',
    height: '48px',
    fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
  };

  const emojiStyle = {
    fontSize: '18px',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center'
  };

  const getFileTypeColor = (filename) => {
    if (filename.toLowerCase().endsWith('.pdf')) return '#dc3545';
    if (filename.toLowerCase().endsWith('.html')) return '#0f3456';
    return '#6c757d'; // Default for .txt and others
  };

  const getFileTypeLabel = (filename) => {
    const extension = filename.split('.').pop().toUpperCase();
    if (extension === 'HTML') return 'HTML';
    if (extension === 'PDF') return 'PDF';
    if (extension === 'TXT') return 'TXT';
    return extension;
  };

  const extractVersion = (filename) => {
    const match = filename.match(/V(\d+)\.html/i);
    return match ? match[1] : '1';
  };

  return (
    <div style={{
      padding: '40px 20px',
      minHeight: '100vh',
      fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
    }}>
      {/* Page Header - OUTSIDE the container */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        maxWidth: '1200px',
        margin: '0 auto 40px auto'
      }}>
        <h1 style={{
          fontSize: '2.5em',
          color: '#0f3456',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          Methods of Procedure (MOPs)
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          margin: '0'
        }}>
          Create, manage, and access your operational procedures
        </p>
      </div>

      {/* Main Container with Off-White Background - ONLY around search, buttons, and grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#fafafa',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e8e8e8'
      }}>
        {/* Search Bar - Wider and Thinner */}
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '700px'
          }}>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '12px 20px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '25px',
                outline: 'none',
                backgroundColor: 'white',
                transition: 'border-color 0.3s ease',
                paddingRight: searchTerm ? '50px' : '20px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0070f3'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  color: '#999',
                  cursor: 'pointer',
                  padding: '5px'
                }}
                onMouseEnter={(e) => e.target.style.color = '#333'}
                onMouseLeave={(e) => e.target.style.color = '#999'}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#e8f4f8',
            borderRadius: '8px',
            color: '#0f3456'
          }}>
            {filteredFiles.length === 0 ? (
              <span>No documents found matching "{searchTerm}"</span>
            ) : (
              <span>
                Found {filteredFiles.length} document{filteredFiles.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </span>
            )}
          </div>
        )}
        
        {/* Fixed Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '30px', 
          flexWrap: 'wrap',
          alignItems: 'stretch',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            style={{
              ...buttonStyle,
              backgroundColor: '#0f3456',
              color: 'white',
              boxShadow: '0 2px 10px rgba(15, 52, 86, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(15, 52, 86, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(15, 52, 86, 0.3)';
            }}
          >
            <span style={emojiStyle}>✨</span>
            <span>Generate MOP</span>
          </button>

          <div style={{ minWidth: '180px', height: '48px' }}>
            <UploadButton type="mops" onUploadSuccess={() => { fetchFiles(); fetchHiddenCount(); }} />
          </div>
        </div>

        {/* File Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '25px', 
          marginTop: '20px' 
        }}>
          {filteredFiles.length === 0 && !searchTerm ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              fontSize: '18px',
              gridColumn: '1 / -1',
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '2px dashed #ddd'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '64px' }}>⚙️</span>
              </div>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#0f3456' }}>No MOP files found</p>
              <p style={{ margin: 0, fontSize: '16px' }}>Upload PDFs or create new MOPs to get started</p>
            </div>
          ) : (
            filteredFiles.map((filename) => {
              const fileData = filesData[filename];
              const downloadUrl = fileData?.url || `/mops/${filename}`;
              const displayName = filename.replace('.pdf', '').replace('.txt', '').replace('.html', '');
              
              return (
                <div key={filename} style={{ 
                  border: '1px solid #e0e0e0', 
                  padding: '25px 25px 70px 25px', 
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onClick={() => handlePDFClick(filename)}
                onMouseEnter={(e) => {
                  setHoveredCard(filename);
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = '#0f3456';
                }}
                onMouseLeave={(e) => {
                  setHoveredCard(null);
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
                >
                  {/* Three dots menu - only show on hover for Blob storage files */}
                  {fileData?.source === 'blob' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        opacity: hoveredCard === filename ? 1 : 0,
                        transition: 'opacity 0.2s ease',
                        zIndex: 10
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownOpen(dropdownOpen === filename ? null : filename);
                        }}
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
                            onClick={(e) => handleHide(filename, e)}
                            disabled={hidingFile === filename}
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '10px 15px',
                              border: 'none',
                              background: 'none',
                              textAlign: 'left',
                              cursor: hidingFile === filename ? 'wait' : 'pointer',
                              fontSize: '14px',
                              color: '#333',
                              transition: 'background-color 0.2s ease',
                              borderRadius: '6px 6px 0 0'
                            }}
                            onMouseEnter={(e) => {
                              if (hidingFile !== filename) {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            {hidingFile === filename ? 'Hiding...' : 'Hide'}
                          </button>
                          <div style={{ borderTop: '1px solid #eee' }}></div>
                          <button
                            onClick={(e) => handleDelete(filename, e)}
                            disabled={deletingFile === filename}
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '10px 15px',
                              border: 'none',
                              background: 'none',
                              textAlign: 'left',
                              cursor: deletingFile === filename ? 'wait' : 'pointer',
                              fontSize: '14px',
                              color: '#dc3545',
                              transition: 'background-color 0.2s ease',
                              borderRadius: '0 0 6px 6px'
                            }}
                            onMouseEnter={(e) => {
                              if (deletingFile !== filename) {
                                e.currentTarget.style.backgroundColor = '#fef2f2';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            {deletingFile === filename ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    marginBottom: '15px',
                    gap: '10px',
                    paddingRight: '40px' // Make room for delete button
                  }}>
                    <span style={{ fontSize: '32px', color: '#0f3456', flexShrink: 0 }}>⚙️</span>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: '18px', 
                      color: '#333',
                      lineHeight: '1.4',
                      flex: 1,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      wordBreak: 'break-word'
                    }}
                    title={displayName} // Show full name on hover
                    >
                      {displayName}
                    </h3>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px',
                    marginTop: '15px'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePDFClick(filename);
                      }}
                      style={{
                        padding: '10px 15px',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
                        fontWeight: '500',
                        flex: 1
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#0051cc';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#0070f3';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Preview
                    </button>
                    <a 
                      href={downloadUrl}
                      download={filename}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: '10px 15px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
                        fontWeight: '500',
                        flex: 1,
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#218838';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#28a745';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Download
                    </a>
                  </div>

                  {/* Version Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '15px',
                    backgroundColor: '#0f3456',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    V{extractVersion(filename)}
                  </div>

                  {/* File Type Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    right: '15px',
                    backgroundColor: getFileTypeColor(filename),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {getFileTypeLabel(filename)}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Hidden Documents Button */}
        {hiddenFilesCount > 0 && (
          <div style={{
            textAlign: 'center',
            marginTop: '30px'
          }}>
            <button
              onClick={() => setIsHiddenModalOpen(true)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
                boxShadow: '0 2px 8px rgba(108, 117, 125, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#5a6268';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(108, 117, 125, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6c757d';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(108, 117, 125, 0.2)';
              }}
            >
              🔒 Hidden Documents ({hiddenFilesCount})
            </button>
          </div>
        )}
      </div>

      {/* All the Modals */}
      <DocumentPreviewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        pdfUrl={selectedPDF?.url}
        pdfName={selectedPDF?.name}
        fullFilename={selectedPDF?.fullFilename}
      />

      <MOPGenerationModal
        isOpen={isGenerateModalOpen}
        onClose={closeGenerateModal}
      />
      
      <HiddenFilesModal
        isOpen={isHiddenModalOpen}
        onClose={() => setIsHiddenModalOpen(false)}
        type="mops"
        onUnhide={handleUnhideCallback}
      />

    </div>
  );
}

export default withPageAuthRequired(MopPage);