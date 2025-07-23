'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import UploadButton from '../components/UploadButton';
import PDFPreviewModal from '../components/PDFPreviewModal';
import MOPGenerationModal from '../components/MOPGenerationModal';
import MOPTemplateModal from '../components/MOPTemplateModal';

function MopPage() {
  const [files, setFiles] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/files/mops')
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
      .catch(err => console.error('Error fetching files:', err));
  }, []);

  const handlePDFClick = (filename) => {
    setSelectedPDF({
      url: `/mops/${filename}`,
      name: filename.replace('.pdf', '').replace('.txt', '')
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPDF(null);
  };

  const closeGenerateModal = () => {
    setIsGenerateModalOpen(false);
  };

  const closeTemplateModal = () => {
    setIsTemplateModalOpen(false);
  };

  // Standardized button style
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '160px',
    justifyContent: 'center'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Methods of Procedure (MOPs)</h1>
      
      {/* Action Buttons - All Same Size */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '30px', 
        flexWrap: 'wrap' 
      }}>
        <button
          onClick={() => setIsGenerateModalOpen(true)}
          style={{
            ...buttonStyle,
            backgroundColor: '#0f3456',
            color: 'white',
            boxShadow: '0 2px 10px rgba(15, 52, 86, 0.3)'
          }}
        >
          <span style={{ fontSize: '18px' }}>✨</span>
          Generate MOP
        </button>

        <button
          onClick={() => setIsTemplateModalOpen(true)}
          style={{
            ...buttonStyle,
            backgroundColor: '#6f42c1',
            color: 'white',
            boxShadow: '0 2px 10px rgba(111, 66, 193, 0.3)'
          }}
        >
          <span style={{ fontSize: '18px' }}>📋</span>
          MOP Template
        </button>

        <div style={{
          ...buttonStyle,
          backgroundColor: '#28a745',
          color: 'white',
          boxShadow: '0 2px 10px rgba(40, 167, 69, 0.3)',
          padding: '0'
        }}>
          <UploadButton type="mops" />
        </div>
      </div>

      {/* File Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px', 
        marginTop: '20px' 
      }}>
        {files.length === 0 ? (
          <p>No MOP files found. Upload some PDFs to get started.</p>
        ) : (
          files.map((filename) => (
            <div key={filename} style={{ 
              border: '1px solid #ccc', 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onClick={() => handlePDFClick(filename)}
            >
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                {filename.replace('.pdf', '').replace('.txt', '')}
              </h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePDFClick(filename);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Preview
                </button>
                <a 
                  href={`/mops/${filename}`} 
                  download
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  Download
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* All the Modals */}
      <PDFPreviewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        pdfUrl={selectedPDF?.url}
        pdfName={selectedPDF?.name}
      />

      <MOPGenerationModal
        isOpen={isGenerateModalOpen}
        onClose={closeGenerateModal}
      />

      <MOPTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={closeTemplateModal}
      />
    </div>
  );
}

export default withPageAuthRequired(MopPage);