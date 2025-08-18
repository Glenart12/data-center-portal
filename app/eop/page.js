'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import UploadButton from '../components/UploadButton';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import EOPGenerationModal from '../components/EOPGenerationModal';
import { extractEOPMetadata, groupEOPsByEquipment } from '@/lib/eop-version-manager';

function EopPage() {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [filesData, setFilesData] = useState({}); // Store file URLs and metadata
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [deletingFile, setDeletingFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files/eops');
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
    const originalUrl = fileData?.url || `/eops/${filename}`;
    
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
          type: 'eops'
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
    if (filename.toLowerCase().endsWith('.html')) return '#dc3545';
    return '#6c757d'; // Default for .txt and others
  };

  const getFileTypeLabel = (filename) => {
    const extension = filename.split('.').pop().toUpperCase();
    if (extension === 'HTML') return 'HTML';
    if (extension === 'PDF') return 'PDF';
    if (extension === 'TXT') return 'TXT';
    return extension;
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
          color: '#dc3545',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          Emergency Operating Procedures (EOPs)
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          margin: '0'
        }}>
          Access and manage critical emergency response procedures
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
              onFocus={(e) => e.target.style.borderColor = '#dc3545'}
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
            backgroundColor: '#ffe8e8',
            borderRadius: '8px',
            color: '#dc3545'
          }}>
            {filteredFiles.length === 0 ? (
              <span>No documents found matching &quot;{searchTerm}&quot;</span>
            ) : (
              <span>
                Found {filteredFiles.length} document{filteredFiles.length !== 1 ? 's' : ''} matching &quot;{searchTerm}&quot;
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
              backgroundColor: '#dc3545',
              color: 'white',
              boxShadow: '0 2px 10px rgba(220, 53, 69, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(220, 53, 69, 0.3)';
            }}
          >
            <span style={emojiStyle}>🚨</span>
            <span>Generate EOP</span>
          </button>

          <div style={{ minWidth: '180px', height: '48px' }}>
            <UploadButton type="eops" onUploadSuccess={fetchFiles} />
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
                <span style={{ fontSize: '64px' }}>🚨</span>
              </div>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#dc3545' }}>No EOP files found</p>
              <p style={{ margin: 0, fontSize: '16px' }}>Upload PDFs or create new EOPs to get started</p>
            </div>
          ) : (
            filteredFiles.map((filename) => {
              const fileData = filesData[filename];
              const downloadUrl = fileData?.url || `/eops/${filename}`;
              const displayName = filename.replace('.pdf', '').replace('.txt', '').replace('.html', '');
              
              // Extract version information
              const metadata = extractEOPMetadata(filename);
              const versionDisplay = metadata.version ? `V${metadata.version}` : '';
              
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
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = '#dc3545';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
                >
                  {/* Delete Button - Only show for Blob storage files */}
                  {fileData?.source === 'blob' && (
                    <button
                      onClick={(e) => handleDelete(filename, e)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#dc3545',
                        cursor: 'pointer',
                        fontSize: '20px',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        opacity: 0.7,
                        zIndex: 10
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc3545';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#dc3545';
                        e.currentTarget.style.opacity = '0.7';
                      }}
                      disabled={deletingFile === filename}
                      title="Delete file"
                    >
                      {deletingFile === filename ? '⟳' : '×'}
                    </button>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    marginBottom: '15px',
                    gap: '10px',
                    paddingRight: '40px' // Make room for delete button
                  }}>
                    <span style={{ fontSize: '32px', color: '#dc3545', flexShrink: 0 }}>🚨</span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: '18px', 
                        color: '#333',
                        lineHeight: '1.4',
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
                      {metadata.manufacturer && metadata.emergencyType && (
                        <p style={{
                          margin: '5px 0 0 0',
                          fontSize: '13px',
                          color: '#666',
                          fontStyle: 'italic'
                        }}>
                          {metadata.manufacturer} {metadata.model} - {metadata.emergencyType.replace(/_/g, ' ')}
                        </p>
                      )}
                    </div>
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
                  {versionDisplay && (
                    <div style={{
                      position: 'absolute',
                      bottom: '30px',
                      left: '15px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {versionDisplay}
                    </div>
                  )}

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
      </div>

      {/* All the Modals */}
      <DocumentPreviewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        pdfUrl={selectedPDF?.url}
        pdfName={selectedPDF?.name}
        fullFilename={selectedPDF?.fullFilename}
      />

      <EOPGenerationModal
        isOpen={isGenerateModalOpen}
        onClose={closeGenerateModal}
      />
    </div>
  );
}

export default withPageAuthRequired(EopPage);