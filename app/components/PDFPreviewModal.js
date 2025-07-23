'use client';

export default function PDFPreviewModal({ isOpen, onClose, pdfUrl, pdfName }) {
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
      backdropFilter: 'blur(5px)',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        width: '95%',
        maxWidth: '900px',
        maxHeight: 'calc(100vh - 140px)',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '40px'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 30px',
          borderBottom: '1px solid #eee',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '32px' }}>📄</span>
            </div>
            <h2 style={{
              margin: 0,
              color: '#0f3456',
              fontSize: '1.4em',
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
            }}>
              {pdfName || 'PDF Preview'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: '#f8f9fa',
              border: '1px solid #ddd',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#666',
              padding: '8px 12px',
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

        {/* PDF Content */}
        <div style={{
          flex: 1,
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px'
        }}>
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              style={{
                width: '100%',
                height: 'calc(70vh - 100px)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
              title={pdfName}
            />
          ) : (
            <div style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '18px',
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
            }}>
              <span style={{ fontSize: '64px', display: 'block', marginBottom: '20px' }}>📄</span>
              <p style={{ margin: 0 }}>No PDF selected for preview</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 30px',
          borderTop: '1px solid #eee',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          gap: '15px',
          justifyContent: 'center'
        }}>
          {pdfUrl && (
            <a
              href={pdfUrl}
              download
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
            >
              <span>📥</span>
              Download PDF
            </a>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
              transition: 'background-color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
          >
            <span>✕</span>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}