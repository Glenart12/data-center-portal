'use client';

import { useState, useEffect } from 'react';

export default function DocumentPreviewModal({ isOpen, onClose, pdfUrl, pdfName }) {
  const [htmlContent, setHtmlContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Determine file type
  const fileExtension = pdfUrl?.split('.').pop()?.toLowerCase();
  const isHtml = fileExtension === 'html' || fileExtension === 'htm';
  const isPdf = fileExtension === 'pdf';
  const isTxt = fileExtension === 'txt';
  
  // Choose appropriate icon based on file type
  const getFileIcon = () => {
    if (isHtml) return '🌐';
    if (isTxt) return '📝';
    return '📄';
  };

  // Get display name without extension
  const displayName = pdfName?.replace(/\.(pdf|html|htm|txt)$/i, '') || 'Document Preview';

  // Fetch HTML content when modal opens for HTML files
  useEffect(() => {
    if (isOpen && isHtml && pdfUrl) {
      setIsLoading(true);
      fetch(pdfUrl)
        .then(response => response.text())
        .then(html => {
          setHtmlContent(html);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching HTML:', error);
          setIsLoading(false);
        });
    } else {
      // Reset when modal closes or for non-HTML files
      setHtmlContent(null);
      setIsLoading(false);
    }
  }, [isOpen, isHtml, pdfUrl]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      paddingTop: '90px',
      paddingBottom: '20px',
      backdropFilter: 'blur(5px)',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        width: '95%',
        maxWidth: '1000px',
        height: 'calc(100vh - 180px)',
        maxHeight: 'calc(100vh - 180px)',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header - Fixed Height */}
        <div style={{
          padding: '20px 30px',
          borderBottom: '1px solid #eee',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          flexShrink: 0,
          textAlign: 'center',
          minHeight: '100px'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '36px' }}>{getFileIcon()}</span>
            </div>
            <h2 style={{
              margin: 0,
              color: '#0f3456',
              fontSize: '1.4em',
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
              lineHeight: '1.2'
            }}>
              {displayName}
            </h2>
            <p style={{
              margin: '5px 0 0 0',
              color: '#666',
              fontSize: '0.9em',
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
            }}>
              {isHtml ? 'HTML Document' : isPdf ? 'PDF Document' : isTxt ? 'Text Document' : 'Document'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: '#f8f9fa',
              border: '1px solid #ddd',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#666',
              padding: '6px 10px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e9ecef';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.color = '#666';
            }}
          >
            ✕
          </button>
        </div>

        {/* Document Content - Flexible Height */}
        <div style={{
          flex: 1,
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          minHeight: '200px',
          backgroundColor: '#fafafa'
        }}>
          {pdfUrl && (
            <>
              {isLoading ? (
                <div style={{
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '18px',
                  fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #0f3456',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                  }} />
                  <p>Loading document...</p>
                  <style jsx>{`
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              ) : isHtml && htmlContent ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    overflow: 'auto'
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : (
                <iframe
                  src={pdfUrl}
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '200px',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    backgroundColor: 'white'
                  }}
                  title={pdfName}
                />
              )}
            </>
          )}
          {!pdfUrl && (
            <div style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '18px',
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
            }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>{getFileIcon()}</span>
              <p style={{ margin: 0 }}>No document selected for preview</p>
            </div>
          )}
        </div>

        {/* Footer - Fixed Height, Always Visible */}
        <div style={{
          padding: '20px 30px',
          borderTop: '1px solid #eee',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexShrink: 0,
          minHeight: '60px'
        }}>
          {pdfUrl && (
            <a
              href={pdfUrl}
              download
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap'
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
              Download {isHtml ? 'HTML' : isPdf ? 'PDF' : isTxt ? 'Text' : 'Document'}
            </a>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5a6268';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6c757d';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}