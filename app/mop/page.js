'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import UploadButton from '../components/UploadButton';

function MopPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch PDF files from the mops folder
    fetch('/api/files/mops')
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
      .catch(err => console.error('Error fetching files:', err));
  }, []);

  const handleGenerateMOP = () => {
    alert('Generate MOP feature coming soon!');
  };

  const handleMOPTemplate = () => {
    alert('MOP Template feature coming soon!');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Methods of Procedure (MOPs)</h1>
      
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <UploadButton type="mops" />
        
        <button onClick={handleGenerateMOP} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          backgroundColor: '#0f3456',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(15, 52, 86, 0.3)'
        }}>
          ✨ Generate MOP
        </button>

        <button onClick={handleMOPTemplate} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          backgroundColor: '#6f42c1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(111, 66, 193, 0.3)'
        }}>
          📋 MOP Template
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {files.length === 0 ? (
          <p>No MOP files found. Upload some PDFs to get started.</p>
        ) : (
          files.map((filename) => (
            <div key={filename} style={{ 
              border: '1px solid #ccc', 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                {filename.replace('.pdf', '')}
              </h3>
              <a 
                href={`/mops/${filename}`} 
                download
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                Download PDF
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default withPageAuthRequired(MopPage);