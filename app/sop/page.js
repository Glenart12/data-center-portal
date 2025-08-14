'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import UploadButton from '../components/UploadButton';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import SOPGenerationModal from '../components/SOPGenerationModal';

function SopPage() {
  const [files, setFiles] = useState([]);
  const [filesData, setFilesData] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/files/sops')
      .then(res => res.json())
      .then(data => {
        setFiles(data.files || []);
        setFilesData(data.filesWithUrls || []);
        setFilteredFiles(data.filesWithUrls || []);
      })
      .catch(err => console.error('Error fetching files:', err));
  }, []);

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
    setSelectedPDF({
      url: fileData.url,
      name: fileData.filename.replace('.pdf', '').replace('.txt', '').replace('.html', '')
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

  const getFileTypeColor = (filename) => {
    if (filename.toLowerCase().endsWith('.pdf')) return '#dc3545';
    if (filename.toLowerCase().endsWith('.html')) return '#17a2b8';
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
          color: '#0f3456',
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
            <UploadButton type="sops" />
          </div>
          <button
            onClick={() => setIsGenerationModalOpen(true)}
            style={{
              minWidth: '180px',
              height: '48px',
              padding: '12px 24px',
              backgroundColor: '#198754',
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
              e.currentTarget.style.backgroundColor = '#146c43';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#198754';
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
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#0f3456' }}>No SOP files found</p>
              <p style={{ margin: 0, fontSize: '16px' }}>Upload PDFs to get started</p>
            </div>
          ) : (
            filteredFiles.map((fileData) => (
              <div key={fileData.filename} style={{ 
                border: '1px solid #e0e0e0', 
                padding: '25px', 
                borderRadius: '12px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onClick={() => handlePDFClick(fileData)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                e.currentTarget.style.borderColor = '#0f3456';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '15px',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '32px', color: '#ffa500' }}>📋</span>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '18px', 
                    color: '#333',
                    lineHeight: '1.4',
                    flex: 1
                  }}>
                    {fileData.filename.replace('.pdf', '').replace('.txt', '').replace('.html', '')}
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
                    download
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

                {/* File Type Badge */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
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
            ))
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        pdfUrl={selectedPDF?.url}
        pdfName={selectedPDF?.name}
      />

      {/* SOP Generation Modal */}
      <SOPGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
      />
    </div>
  );
}

export default withPageAuthRequired(SopPage);