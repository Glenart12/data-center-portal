'use client';

import { useState } from 'react';

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
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        height: '90%',
        maxWidth: '1000px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 30px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{
            margin: 0,
            color: '#0f3456',
            fontSize: '1.2em',
            fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
          }}>
            {pdfName}
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              href={pdfUrl}
              download
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Download
            </a>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div style={{ flex: 1, position: 'relative' }}>
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            title={`PDF Preview: ${pdfName}`}
          />
        </div>
      </div>
    </div>
  );
}