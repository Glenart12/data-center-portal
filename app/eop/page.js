'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';

function EopPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch('/api/files/eops')
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
      .catch(err => console.error('Error fetching files:', err));
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Emergency Operating Procedures (EOPs)</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {files.length === 0 ? (
          <p>No EOP files found. Upload some PDFs to get started.</p>
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
                href={`/eops/${filename}`} 
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

export default withPageAuthRequired(EopPage);