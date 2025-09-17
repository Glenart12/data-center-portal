'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';

function Documents() {
  const [sites, setSites] = useState([]);
  const [hoveredFolder, setHoveredFolder] = useState(null);

  const handleAddSite = () => {
    const siteName = prompt('Enter site name:');
    if (siteName && siteName.trim()) {
      setSites([...sites, {
        id: Date.now(),
        name: siteName.trim(),
        createdAt: new Date().toISOString()
      }]);
    }
  };

  const handleFolderClick = (site) => {
    // Future: Navigate to site documents
    console.log('Opening site:', site.name);
  };

  // Button style matching existing pages
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
    fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
    backgroundColor: '#0A1628',
    color: 'white'
  };

  return (
    <>
      {/* Background gradient */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, #FFFFFF, #F9FAFB)',
        zIndex: -2
      }} />

      {/* Circuit pattern overlay - EXACT from dashboard */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h10v10h10v-10h10v10h10v10h10v10h-10v10h10v10h10v10h-10v10h-10v-10h-10v10h-10v-10h-10v-10h-10v-10h10v-10h-10v-10h-10v-10h10v-10zm20 20h10v10h-10v-10zm20 0h10v10h-10v-10zm0 20h10v10h-10v-10zm-20 0h10v10h-10v-10z' fill='%23001f3f' fill-opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Main Content */}
      <div style={{
        padding: '32px',
        paddingTop: '100px',
        fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{
            color: '#0A1628',
            fontSize: '2.25rem',
            textAlign: 'center',
            marginBottom: '32px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            UPLOAD DOCUMENTS
          </h1>

          {/* Add Site Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '32px'
          }}>
            <button
              onClick={handleAddSite}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1E3A5F';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0A1628';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <span style={{ fontSize: '18px' }}>➕</span>
              Add Site
            </button>
          </div>

          {/* Sites Container */}
          <div style={{
            marginTop: '32px',
            backgroundColor: '#fafafa',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e8e8e8',
            width: '100%',
            boxSizing: 'border-box',
            minHeight: '400px'
          }}>
            {sites.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#666',
                fontSize: '18px',
                padding: '60px 20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '2px dashed #ddd'
              }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#0f3456' }}>
                  No sites added yet
                </p>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  Click "Add Site" to create your first site folder
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px'
              }}>
                {sites.map((site) => (
                  <div
                    key={site.id}
                    onClick={() => handleFolderClick(site)}
                    onMouseEnter={() => setHoveredFolder(site.id)}
                    onMouseLeave={() => setHoveredFolder(null)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '30px 20px',
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: hoveredFolder === site.id ? 'translateY(-5px)' : 'translateY(0)',
                      boxShadow: hoveredFolder === site.id
                        ? '0 8px 25px rgba(0,0,0,0.12)'
                        : '0 2px 8px rgba(0,0,0,0.05)',
                      borderColor: hoveredFolder === site.id ? '#0f3456' : '#e0e0e0'
                    }}
                  >
                    {/* Folder Icon */}
                    <div style={{
                      fontSize: '48px',
                      marginBottom: '12px',
                      filter: hoveredFolder === site.id ? 'brightness(1.2)' : 'brightness(1)'
                    }}>
                      📁
                    </div>

                    {/* Site Name */}
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#0A1628',
                      textAlign: 'center',
                      wordBreak: 'break-word',
                      width: '100%'
                    }}>
                      {site.name}
                    </div>

                    {/* Date Added */}
                    <div style={{
                      fontSize: '12px',
                      color: '#999',
                      marginTop: '8px'
                    }}>
                      {new Date(site.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default withPageAuthRequired(Documents);