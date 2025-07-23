'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import UploadButton from '../components/UploadButton';
import PDFPreviewModal from '../components/PDFPreviewModal';

function EopPage() {
  const [filenames, setFilenames] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch the list of files from the API
    fetch('/api/files/eops')
      .then(res => res.json())
      .then(data => setFilenames(data.files || []))
      .catch(err => console.log('No files found'));
  }, []);

  const handlePDFClick = (filename) => {
    setSelectedPDF({
      url: `/eops/${filename}`,
      name: filename.replace('.pdf', '')
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPDF(null);
  };

  return (
    <>
      <div style={{ 
        padding: '40px',
        fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{ 
            color: '#0f3456', 
            marginBottom: '30px',
            fontSize: '2.5em',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            Emergency Operating Procedures (EOPs)
          </h1>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '15px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <UploadButton type="eops" />
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '25px',
              marginTop: '25px'
            }}>
              {filenames.map((filename) => (
                <div key={filename} style={{ 
                  border: '1px solid rgba(15, 52, 86, 0.2)', 
                  padding: '25px', 
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                }}
                onClick={() => handlePDFClick(filename)}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#dc3545',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    🚨
                  </div>
                  <h3 style={{ 
                    marginBottom: '18px', 
                    fontSize: '16px',
                    wordWrap: 'break-word',
                    color: '#0f3456',
                    fontWeight: 'bold'
                  }}>
                    {filename.replace('.pdf', '')}
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePDFClick(filename);
                      }}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Preview
                    </button>
                    <a 
                      href={`/eops/${filename}`} 
                      download
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        background: '#28a745',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {filenames.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#666',
                fontSize: '1.1em'
              }}>
                <p>No EOP documents available.</p>
                <p style={{ marginTop: '10px', fontSize: '0.9em' }}>Upload some PDFs to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        pdfUrl={selectedPDF?.url}
        pdfName={selectedPDF?.name}
      />
    </>
  );
}

export default withPageAuthRequired(EopPage);