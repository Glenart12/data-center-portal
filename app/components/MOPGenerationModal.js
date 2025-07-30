'use client';

import { useState } from 'react';

export default function MOPGenerationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    manufacturer: '',
    modelNumber: '',
    serialNumber: '',
    location: '',
    system: '',
    category: '',
    description: ''
  });
  
  const [supportingDocs, setSupportingDocs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    setUploadProgress('Reading files...');
    
    const newDocs = [];
    
    for (const file of files) {
      if (file.type === 'application/pdf' || file.type === 'text/plain' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        
        // Convert file to base64 for sending to API
        const reader = new FileReader();
        const base64 = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
        
        newDocs.push({
          name: file.name,
          type: file.type,
          content: base64,
          size: file.size
        });
      }
    }
    
    setSupportingDocs(prev => [...prev, ...newDocs]);
    setUploadProgress('');
  };

  const removeDoc = (index) => {
    setSupportingDocs(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    // Check all required fields
    if (!formData.manufacturer || !formData.modelNumber || !formData.system || 
        !formData.category || !formData.description) {
      alert('Please fill in all required fields:\n• Manufacturer\n• Model Number\n• System\n• Category\n• Work Description');
      return;
    }

    setIsGenerating(true);
    setUploadProgress('Generating MOP with AI...');

    try {
      const response = await fetch('/api/generate-mop-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          supportingDocs: supportingDocs.map(doc => ({
            name: doc.name,
            type: doc.type,
            content: doc.content
          }))
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate MOP');
      }

      const data = await response.json();
      
      alert('MOP generated successfully! Check the MOP gallery.');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Generation error:', error);
      alert(`Failed to generate MOP: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setUploadProgress('');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 9999,
      paddingTop: '90px',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        width: '95%',
        maxWidth: '700px',
        maxHeight: 'calc(100vh - 140px)',
        overflowY: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '40px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🤖</div>
          <h2 style={{ marginBottom: '5px', fontSize: '24px' }}>Generate MOP with AI</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Fill in the basic equipment information and let AI create a comprehensive MOP
          </p>
        </div>

        {/* Equipment Information */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Equipment Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Manufacturer *
              </label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                placeholder="e.g., Trane, Carrier, York"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Model Number *
              </label>
              <input
                type="text"
                value={formData.modelNumber}
                onChange={(e) => handleInputChange('modelNumber', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                placeholder="e.g., CVHF1000"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Serial Number
              </label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                placeholder="e.g., SN123456789"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                placeholder="e.g., Data Hall 1"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                System *
              </label>
              <input
                type="text"
                value={formData.system}
                onChange={(e) => handleInputChange('system', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                placeholder="e.g., Cooling, Power, UPS"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                placeholder="e.g., Preventive Maintenance"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Work Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                minHeight: '120px',
                resize: 'vertical'
              }}
              placeholder="Describe the work to be performed (e.g., quarterly preventive maintenance, filter replacement, bearing inspection)..."
            />
          </div>
        </div>

        {/* Supporting Documents */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Supporting Documents</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
            Upload equipment manuals, specifications, or reference documents to help the AI generate a more accurate MOP
          </p>
          
          <input
            type="file"
            multiple
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="doc-upload"
          />
          
          <label
            htmlFor="doc-upload"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '15px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0051cc'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0070f3'}
          >
            📎 Add Documents
          </label>

          {supportingDocs.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              {supportingDocs.map((doc, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '14px' }}>
                    📄 {doc.name} ({(doc.size / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    onClick={() => removeDoc(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc3545',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '5px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Message */}
        {uploadProgress && (
          <div style={{
            padding: '15px',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center',
            color: '#1976d2'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '3px solid #1976d2',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              {uploadProgress}
            </div>
          </div>
        )}

        {/* Note about AI capabilities */}
        <div style={{
          padding: '15px',
          backgroundColor: '#f0f7ff',
          borderRadius: '4px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#555'
        }}>
          <strong>Note:</strong> The AI will automatically generate all necessary MOP sections including safety requirements, 
          tools needed, detailed procedures, and back-out plans based on the equipment information you provide.
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 30px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
            disabled={isGenerating}
          >
            Cancel
          </button>
          
          <button
            onClick={handleGenerate}
            style={{
              padding: '12px 30px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              opacity: isGenerating ? 0.6 : 1,
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => !isGenerating && (e.currentTarget.style.backgroundColor = '#218838')}
            onMouseLeave={(e) => !isGenerating && (e.currentTarget.style.backgroundColor = '#28a745')}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : '🤖 Generate MOP'}
          </button>
        </div>
      </div>

      {/* Add spinning animation */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}