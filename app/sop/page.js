'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import UploadButton from '../components/UploadButton';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import SOPGenerationModal from '../components/SOPGenerationModal';
import HiddenFilesModal from '../components/HiddenFilesModal';
import { parseFilename } from '@/lib/parseFilename';

function SopPage() {
  const [files, setFiles] = useState([]);
  const [filesData, setFilesData] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
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
      const res = await fetch('/api/files/sops');
      const data = await res.json();
      setFiles(data.files || []);
      setFilesData(data.filesWithUrls || []);
      setFilteredFiles(data.filesWithUrls || []);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const fetchHiddenCount = async () => {
    try {
      const response = await fetch('/api/files/sops?hidden=true');
      const data = await response.json();
      setHiddenFilesCount(data.files?.length || 0);
    } catch (err) {
      console.error('Error fetching hidden files count:', err);
    }
  };

  // Filter files when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFiles(filesData);
    } else {
      const filtered = filesData.filter(file =>
        file.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [filesData, searchTerm]);

  const handlePDFClick = (fileData) => {
    // For HTML files from blob storage, use the serve-html API
    const url = fileData.url && fileData.filename.endsWith('.html')
      ? `/api/serve-html?url=${encodeURIComponent(fileData.url)}`
      : fileData.url;
    
    setSelectedPDF({
      url: url,
      name: fileData.filename.replace('.pdf', '').replace('.txt', '').replace('.html', ''),
      fullFilename: fileData.filename  // Pass the full filename with extension
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPDF(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
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
          type: 'sops'
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
          type: 'sops'
        })
      });

      if (response.ok) {
        // Refresh the file list
        await fetchFiles();
        await fetchHiddenCount();
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

  const getFileTypeColor = (filename) => {
    if (filename.toLowerCase().endsWith('.pdf')) return '#dc3545';
    if (filename.toLowerCase().endsWith('.html')) return '#28a745';
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
          color: '#28a745',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          Standard Operating Procedures (SOPs)
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          margin: '0'
        }}>
          Access and manage your standard operational procedures
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
            color: '#28a745'
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
        
        {/* Upload and Generate Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '30px', 
          flexWrap: 'wrap',
          alignItems: 'stretch',
          justifyContent: 'center'
        }}>
          <div style={{ minWidth: '180px', height: '48px' }}>
            <UploadButton type="sops" onUploadSuccess={() => { fetchFiles(); fetchHiddenCount(); }} />
          </div>
          <button
            onClick={() => setIsGenerationModalOpen(true)}
            style={{
              minWidth: '180px',
              height: '48px',
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#218838';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#28a745';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            <span style={{ fontSize: '20px' }}>📋</span>
            Generate SOP
          </button>
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
                <span style={{ fontSize: '64px' }}>📋</span>
              </div>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#28a745' }}>No SOP files found</p>
              <p style={{ margin: 0, fontSize: '16px' }}>Upload PDFs to get started</p>
            </div>
          ) : (
            filteredFiles.map((fileData) => {
              const parsedInfo = parseFilename(fileData.filename);
              
              // Fix SOP parsing: Use double underscore delimiter to split component and work
              // FORMAT: SOP_CHILLER1_WATER_COOLED_CHILLER_CARRIER__DAILY_STARTUP_PROCEDURE_2025-08-27_V1
              let cleanComponentType = parsedInfo.componentType;
              let workDescription = parsedInfo.workDescription;
              
              if (fileData.filename.startsWith('SOP_')) {
                // Check if filename uses the new double underscore delimiter format
                if (fileData.filename.includes('__')) {
                  // NEW FORMAT with delimiter - parse exactly where component ends and work begins
                  const cleanName = fileData.filename.replace(/\.(html|pdf)$/i, '');
                  const [beforeWork, afterWork] = cleanName.split('__');
                  
                  // Extract component type and manufacturer
                  const beforeParts = beforeWork.split('_');
                  
                  // Known manufacturer names
                  const knownManufacturers = ['CARRIER', 'TRANE', 'YORK', 'LIEBERT', 'ASCO', 'CATERPILLAR', 'CAT', 
                                             'EATON', 'SCHNEIDER', 'GE', 'GENERAC', 'CUMMINS', 'KOHLER', 
                                             'JOHNSON', 'CONTROLS', 'SIEMENS', 'ABB', 'VERTIV'];
                  
                  // Find manufacturer position (start from position 2)
                  let manufacturerIndex = -1;
                  for (let i = 2; i < beforeParts.length; i++) {
                    if (knownManufacturers.includes(beforeParts[i].toUpperCase())) {
                      manufacturerIndex = i;
                      break;
                    }
                  }
                  
                  if (manufacturerIndex > 0) {
                    // Component type is everything from position 2 until manufacturer
                    const componentParts = beforeParts.slice(2, manufacturerIndex);
                    cleanComponentType = componentParts.join(' ')
                      .toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
                  } else {
                    // If manufacturer not found, assume last word before delimiter is manufacturer
                    const componentParts = beforeParts.slice(2, beforeParts.length - 1);
                    cleanComponentType = componentParts.join(' ')
                      .toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
                  }
                  
                  // Extract work description (everything after delimiter until date)
                  if (afterWork) {
                    const afterParts = afterWork.split('_');
                    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
                    let dateIndex = -1;
                    
                    for (let i = 0; i < afterParts.length; i++) {
                      if (datePattern.test(afterParts[i])) {
                        dateIndex = i;
                        break;
                      }
                    }
                    
                    if (dateIndex > 0) {
                      const workParts = afterParts.slice(0, dateIndex);
                      workDescription = workParts.join(' ')
                        .toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
                    } else if (dateIndex === -1) {
                      // No date found, take everything as work description except version
                      const workParts = afterParts.filter(part => !part.match(/^V\d+$/i));
                      workDescription = workParts.join(' ')
                        .toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
                    }
                  }
                } else {
                  // OLD FORMAT without delimiter - use parseFilename results as-is
                  cleanComponentType = parsedInfo.componentType;
                  workDescription = parsedInfo.workDescription;
                }
              }
              
              // Clean up component type to remove manufacturer if it's included
              if (cleanComponentType) {
                const manufacturers = ['Asco', 'Caterpillar', 'Cat', 'Trane', 'Carrier', 'York', 'Liebert', 'Eaton', 'Schneider', 'GE', 'Generac', 'Cummins', 'Kohler'];
                for (const mfr of manufacturers) {
                  const regex = new RegExp(`\\s+${mfr}$`, 'i');
                  cleanComponentType = cleanComponentType.replace(regex, '');
                }
              }
              
              return (
              <div key={fileData.filename} style={{ 
                border: '1px solid #e0e0e0', 
                padding: '25px 25px 70px 25px', 
                borderRadius: '12px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onClick={() => handlePDFClick(fileData)}
              onMouseEnter={(e) => {
                setHoveredCard(fileData.filename);
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                e.currentTarget.style.borderColor = '#28a745';
              }}
              onMouseLeave={(e) => {
                setHoveredCard(null);
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
              >
                {/* Three dots menu - only show on hover for Blob storage files */}
                {fileData.source === 'blob' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      opacity: hoveredCard === fileData.filename ? 1 : 0,
                      transition: 'opacity 0.2s ease',
                      zIndex: 10
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen(dropdownOpen === fileData.filename ? null : fileData.filename);
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
                    {dropdownOpen === fileData.filename && (
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
                          onClick={(e) => handleHide(fileData.filename, e)}
                          disabled={hidingFile === fileData.filename}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px 15px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: hidingFile === fileData.filename ? 'wait' : 'pointer',
                            fontSize: '14px',
                            color: '#333',
                            transition: 'background-color 0.2s ease',
                            borderRadius: '6px 6px 0 0'
                          }}
                          onMouseEnter={(e) => {
                            if (hidingFile !== fileData.filename) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {hidingFile === fileData.filename ? 'Hiding...' : 'Hide'}
                        </button>
                        <div style={{ borderTop: '1px solid #eee' }}></div>
                        <button
                          onClick={(e) => handleDelete(fileData.filename, e)}
                          disabled={deletingFile === fileData.filename}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px 15px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: deletingFile === fileData.filename ? 'wait' : 'pointer',
                            fontSize: '14px',
                            color: '#dc3545',
                            transition: 'background-color 0.2s ease',
                            borderRadius: '0 0 6px 6px'
                          }}
                          onMouseEnter={(e) => {
                            if (deletingFile !== fileData.filename) {
                              e.currentTarget.style.backgroundColor = '#fef2f2';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {deletingFile === fileData.filename ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '15px',
                  gap: '10px',
                  paddingRight: '40px' // Make room for delete button
                }}>
                  <span style={{ fontSize: '32px', color: '#ffa500' }}>📋</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 'bold' }}>Component:</span> {cleanComponentType}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 'bold' }}>Work:</span> {workDescription}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 'bold' }}>Date:</span> {parsedInfo.date}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      <span style={{ fontWeight: 'bold' }}>Equipment Number:</span> {parsedInfo.equipmentId}
                    </div>
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
                      handlePDFClick(fileData);
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
                    href={fileData.url} 
                    download={fileData.filename}
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
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {parsedInfo.version}
                </div>

                {/* File Type Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '30px',
                  right: '15px',
                  backgroundColor: getFileTypeColor(fileData.filename),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {getFileTypeLabel(fileData.filename)}
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

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        pdfUrl={selectedPDF?.url}
        pdfName={selectedPDF?.name}
        fullFilename={selectedPDF?.fullFilename}
      />

      {/* SOP Generation Modal */}
      <SOPGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => { setIsGenerationModalOpen(false); fetchFiles(); fetchHiddenCount(); }}
      />
      
      {/* Hidden Files Modal */}
      <HiddenFilesModal
        isOpen={isHiddenModalOpen}
        onClose={() => setIsHiddenModalOpen(false)}
        type="sops"
        onUnhide={handleUnhideCallback}
      />
    </div>
  );
}

export default withPageAuthRequired(SopPage);