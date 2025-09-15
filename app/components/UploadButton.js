'use client';

import { useState } from 'react';

export default function UploadButton({ type, onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
      e.target.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', type);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert(`PDF uploaded successfully to ${type.toUpperCase()}!`);
        setShowModal(false);
        setSelectedFile(null);
        
        // Refresh the page to show the new file
        if (onUploadSuccess) {
          onUploadSuccess();
        } else {
          window.location.reload();
        }
      } else {
        alert(`Upload failed: ${data.error || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please check your connection and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const emojiStyle = {
    fontSize: '18px',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '12px 24px',
          backgroundColor: '#0A1628',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 10px rgba(40, 167, 69, 0.3)',
          width: '100%',
          height: '48px',
          fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1E3A5F';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#0A1628';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span>Upload PDF</span>
      </button>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(5px)',
          padding: '20px',
          paddingTop: '90px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '15px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: 'calc(100vh - 140px)',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              marginBottom: '30px',
              color: '#0f3456',
              fontSize: '1.5em',
              fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
              textAlign: 'center'
            }}>
              Upload PDF to {type.toUpperCase()}
            </h2>
            
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <div style={{
                border: '2px dashed #28a745',
                borderRadius: '12px',
                padding: '30px 20px',
                backgroundColor: '#f8f9fa',
                margin: '0 auto',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontSize: '48px', color: '#28a745' }}>📁</span>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
                  }}
                />
                <p style={{
                  margin: '15px 0 0 0',
                  fontSize: '14px',
                  color: '#666',
                  fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
                }}>
                  Select a PDF file to upload to {type.toUpperCase()}
                </p>
              </div>
            </div>

            {selectedFile && (
              <div style={{
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#e8f5e8',
                borderRadius: '12px',
                border: '1px solid #28a745',
                textAlign: 'center'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px' }}>✅</span>
                </div>
                <p style={{ margin: 0, color: '#0f3456', fontWeight: 'bold' }}>
                  Selected file:
                </p>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                  {selectedFile.name}
                </p>
                <p style={{ margin: '10px 0 0 0', color: '#28a745', fontSize: '12px' }}>
                  Ready to upload to {type.toUpperCase()}
                </p>
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              justifyContent: 'center',
              marginTop: '30px'
            }}>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedFile(null);
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
                  transition: 'background-color 0.2s ease'
                }}
                disabled={isUploading}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#0A1628',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  opacity: isUploading || !selectedFile ? 0.6 : 1,
                  fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isUploading && selectedFile) {
                    e.currentTarget.style.backgroundColor = '#1E3A5F';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isUploading && selectedFile) {
                    e.currentTarget.style.backgroundColor = '#0A1628';
                  }
                }}
              >
                {isUploading ? `Uploading to ${type.toUpperCase()}...` : `Upload to ${type.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}