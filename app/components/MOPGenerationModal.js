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
    transition: 'border-color 0.3s ease'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#0f3456',
    fontSize: '14px',
    fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
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
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '25px 30px',
          borderBottom: '1px solid #eee',
          backgroundColor: '#f8f9fa'
        }}>
          <h2 style={{
            margin: 0,
            color: '#0f3456',
            fontSize: '1.5em',
            fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
            textAlign: 'center'
          }}>
            Generate New MOP
          </h2>
          <p style={{
            margin: '10px 0 0 0',
            color: '#666',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            Fill out the required information to generate a Method of Procedure
          </p>
        </div>

        {/* Form Content */}
        <div style={{
          padding: '30px',
          overflowY: 'auto',
          flex: 1
        }}>
          <div>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
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

            <div>
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

            <div>
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

          <div>
            <label style={labelStyle}>MOP Supporting Documentation:</label>
            <div style={{
              border: '2px dashed #0f3456',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              marginBottom: '20px'
            }}>
              <input
                type="file"
                onChange={handleFileChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
                accept=".pdf,.doc,.docx,.txt"
              />
              {formData.supportingDoc && (
                <p style={{
                  marginTop: '10px',
                  color: '#0f3456',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  Selected: {formData.supportingDoc.name}
                </p>
              )}
              <p style={{
                margin: '10px 0 0 0',
                fontSize: '12px',
                color: '#666'
              }}>
                Supports PDF, DOC, DOCX, and TXT files
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div style={{
          padding: '20px 30px',
          borderTop: '1px solid #eee',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          gap: '15px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => {
              resetForm();
              onClose();
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
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif'
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={handleCreateMOP}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #0f3456 0%, #1e5f8b 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif',
              boxShadow: '0 3px 15px rgba(15, 52, 86, 0.3)'
            }}
          >
            Create MOP
          </button>
        </div>
      </div>
    </div>
  );
}