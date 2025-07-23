'use client';

import { useState } from 'react';

export default function MOPGenerationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    manufacturer: '',
    equipmentId: '',
    modelNumber: '',
    serialNumber: '',
    supportingDoc: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      supportingDoc: file
    }));
  };

  const handleCreateMOP = () => {
    // For now, just show an alert - you can implement actual functionality later
    alert('MOP Generation would happen here!\n\nForm data:\n' + 
          `Manufacturer: ${formData.manufacturer}\n` +
          `Equipment ID: ${formData.equipmentId}\n` +
          `Model #: ${formData.modelNumber}\n` +
          `Serial #: ${formData.serialNumber}\n` +
          `Supporting Doc: ${formData.supportingDoc?.name || 'None'}`);
    onClose();
  };

  const resetForm = () => {
    setFormData({
      manufacturer: '',
      equipmentId: '',
      modelNumber: '',
      serialNumber: '',
      supportingDoc: null
    });
  };

  if (!isOpen) return null;

  const inputStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
    marginBottom: '20px',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#0f3456',
    fontSize: '14px',
    fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
    textAlign: 'left'
  };

  return (
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
      zIndex: 2000,
      padding: '20px',
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '30px',
          borderBottom: '1px solid #eee',
          backgroundColor: '#f8f9fa',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <span style={{ fontSize: '48px' }}>✨</span>
          </div>
          <h2 style={{
            margin: 0,
            color: '#0f3456',
            fontSize: '1.6em',
            fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
          }}>
            Generate New MOP
          </h2>
          <p style={{
            margin: '15px 0 0 0',
            color: '#666',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Fill out the required information to generate a Method of Procedure
          </p>
        </div>

        {/* Form Content */}
        <div style={{
          padding: '40px',
          overflowY: 'auto',
          flex: 1
        }}>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ textAlign: 'left', marginBottom: '25px' }}>
              <label style={labelStyle}>Manufacturer:</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                style={inputStyle}
                placeholder="Enter equipment manufacturer"
                onFocus={(e) => e.target.style.borderColor = '#0f3456'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              gap: '20px',
              marginBottom: '25px'
            }}>
              <div style={{ textAlign: 'left' }}>
                <label style={labelStyle}>Equipment ID:</label>
                <input
                  type="text"
                  value={formData.equipmentId}
                  onChange={(e) => handleInputChange('equipmentId', e.target.value)}
                  style={inputStyle}
                  placeholder="Equipment ID"
                  onFocus={(e) => e.target.style.borderColor = '#0f3456'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>

              <div style={{ textAlign: 'left' }}>
                <label style={labelStyle}>Model #:</label>
                <input
                  type="text"
                  value={formData.modelNumber}
                  onChange={(e) => handleInputChange('modelNumber', e.target.value)}
                  style={inputStyle}
                  placeholder="Model Number"
                  onFocus={(e) => e.target.style.borderColor = '#0f3456'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>

              <div style={{ textAlign: 'left' }}>
                <label style={labelStyle}>Serial #:</label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  style={inputStyle}
                  placeholder="Serial Number"
                  onFocus={(e) => e.target.style.borderColor = '#0f3456'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={labelStyle}>MOP Supporting Documentation:</label>
              <div style={{
                border: '2px dashed #0f3456',
                borderRadius: '12px',
                padding: '30px 20px',
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                marginBottom: '20px',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontSize: '48px', color: '#0f3456' }}>📄</span>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
                  }}
                  accept=".pdf,.doc,.docx,.txt"
                />
                {formData.supportingDoc && (
                  <div style={{ marginTop: '15px' }}>
                    <span style={{ fontSize: '24px' }}>✅</span>
                    <p style={{
                      marginTop: '10px',
                      color: '#0f3456',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      Selected: {formData.supportingDoc.name}
                    </p>
                  </div>
                )}
                <p style={{
                  margin: '15px 0 0 0',
                  fontSize: '14px',
                  color: '#666',
                  fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
                }}>
                  Supports PDF, DOC, DOCX, and TXT files
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div style={{
          padding: '25px 40px',
          borderTop: '1px solid #eee',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          gap: '15px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            style={{
              padding: '12px 30px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
          >
            Cancel
          </button>
          
          <button
            onClick={handleCreateMOP}
            style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #0f3456 0%, #1e5f8b 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
              boxShadow: '0 3px 15px rgba(15, 52, 86, 0.3)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Create MOP
          </button>
        </div>
      </div>
    </div>
  );
}