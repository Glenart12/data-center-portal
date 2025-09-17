'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

function Documents() {
  const { user } = useUser();
  const [sites, setSites] = useState([]);
  const [hoveredFolder, setHoveredFolder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch sites on component mount
  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sites');
      const data = await response.json();

      if (data.success) {
        setSites(data.sites);
      } else {
        console.error('Failed to fetch sites:', data.error);
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSite = async () => {
    if (!siteName.trim()) {
      setError('Site name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: siteName.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh the sites list
        await fetchSites();

        // Close modal and reset
        setShowAddModal(false);
        setSiteName('');
      } else {
        setError(data.error || 'Failed to create site');
      }
    } catch (error) {
      console.error('Error adding site:', error);
      setError('Failed to add site. Please try again.');
    } finally {
      setIsSubmitting(false);
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
              onClick={() => setShowAddModal(true)}
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
            {isLoading ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#666'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                <p>Loading sites...</p>
              </div>
            ) : sites.length === 0 ? (
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

      {/* Add Site Modal */}
      {showAddModal && (
        <>
          {/* Dark Overlay */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9998
            }}
            onClick={() => {
              if (!isSubmitting) {
                setShowAddModal(false);
                setSiteName('');
                setError('');
              }
            }}
          >
            {/* Modal Box */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '500px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                zIndex: 9999
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #E5E7EB'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#0A1628',
                  margin: 0,
                  fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
                }}>
                  Add New Site
                </h2>
              </div>

              {/* Modal Body */}
              <div style={{
                padding: '24px'
              }}>
                {/* Site Name Input */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Site Name *
                  </label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Enter site name..."
                    disabled={isSubmitting}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isSubmitting) {
                        handleAddSite();
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      opacity: isSubmitting ? 0.5 : 1
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0A1628'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    autoFocus
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #FECACA',
                    borderRadius: '6px',
                    color: '#DC2626',
                    fontSize: '14px',
                    marginBottom: '20px'
                  }}>
                    {error}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '24px',
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                {/* Cancel Button */}
                <button
                  onClick={() => {
                    if (!isSubmitting) {
                      setShowAddModal(false);
                      setSiteName('');
                      setError('');
                    }
                  }}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#6B7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                    opacity: isSubmitting ? 0.5 : 1,
                    fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
                  }}
                  onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#4B5563')}
                  onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#6B7280')}
                >
                  Cancel
                </button>

                {/* Add Button */}
                <button
                  onClick={handleAddSite}
                  disabled={isSubmitting || !siteName.trim()}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#0A1628',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: (isSubmitting || !siteName.trim()) ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                    opacity: (isSubmitting || !siteName.trim()) ? 0.5 : 1,
                    fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
                  }}
                  onMouseEnter={(e) => !isSubmitting && siteName.trim() && (e.currentTarget.style.backgroundColor = '#1E3A5F')}
                  onMouseLeave={(e) => !isSubmitting && siteName.trim() && (e.currentTarget.style.backgroundColor = '#0A1628')}
                >
                  {isSubmitting ? 'Adding...' : 'Add Site'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Documents);