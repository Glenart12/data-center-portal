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

      if (response.ok) {
        alert('File uploaded successfully!');
        setShowModal(false);
        setSelectedFile(null);
        
        // Refresh the page to show the new file
        if (onUploadSuccess) {
          onUploadSuccess();
        } else {
          window.location.reload();
        }
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '25px',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 10px rgba(40, 167, 69, 0.3)'
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
        <span style={{ fontSize: '18px' }}>📁</span>
        Upload PDF
      </button>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '15px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ 
              marginBottom: '25px',
              color: '#0f3456',
              textAlign: 'center',
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
            }}>
              Upload PDF to {type.toUpperCase()}
            </h2>
            
            <div style={{ marginBottom: '25px' }}>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px dashed #28a745',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </div>

            {selectedFile && (
              <div style={{
                marginBottom: '25px',
                padding: '15px',
                backgroundColor: '#e8f5e8',
                borderRadius: '8px',
                border: '1px solid #28a745'
              }}>
                <strong style={{ color: '#0f3456' }}>Selected file:</strong> 
                <span style={{ marginLeft: '8px', color: '#666' }}>{selectedFile.name}</span>
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              justifyContent: 'flex-end' 
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
                  cursor: 'pointer'
                }}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  opacity: isUploading || !selectedFile ? 0.6 : 1
                }}
              >
                {isUploading ? 'Uploading...' : 'Upload PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}