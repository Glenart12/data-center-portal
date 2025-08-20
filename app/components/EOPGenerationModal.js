'use client';

import { useState, useEffect } from 'react';

export default function EOPGenerationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    manufacturer: '',
    modelNumber: '',
    equipmentNumber: '',
    serialNumber: '',
    location: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    system: '',
    category: '',
    description: ''
  });
  
  const [supportingDocs, setSupportingDocs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [lastGenerationTime, setLastGenerationTime] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Check for cooldown on component mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      const lastTime = parseInt(localStorage.getItem('lastEOPGeneration') || '0');
      setLastGenerationTime(lastTime);
      updateCooldown(lastTime);
    }
  }, [isOpen]);

  // Update cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        updateCooldown(lastGenerationTime);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining, lastGenerationTime]);

  const updateCooldown = (lastTime) => {
    const now = Date.now();
    const timePassed = now - lastTime;
    const cooldownPeriod = 60000; // 60 seconds
    const remaining = Math.max(0, cooldownPeriod - timePassed);
    setCooldownRemaining(Math.ceil(remaining / 1000));
  };

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (addressField, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [addressField]: value
      }
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
    // Check cooldown
    if (cooldownRemaining > 0) {
      alert(`Please wait ${cooldownRemaining} more seconds before generating another EOP. This helps ensure reliable service for all users.`);
      return;
    }

    // Check all required fields
    if (!formData.manufacturer || !formData.modelNumber || !formData.equipmentNumber || !formData.system || 
        !formData.category || !formData.description) {
      alert('Please fill in all required fields:\n• Manufacturer\n• Model Number\n• Equipment Number\n• System\n• Category\n• Work Description');
      return;
    }

    setIsGenerating(true);
    setUploadProgress('Connecting to AI service...');

    try {
      const response = await fetch('/api/generate-eop-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: {
            ...formData,
            frequency: formData.category, // Add frequency field using category value
            workDescription: formData.description, // Ensure workDescription is available
            component: formData.category, // Add component field that the EOP route expects
            emergencyType: 'Power Failure' // Add default emergency type that EOP route expects
          },
          supportingDocs: supportingDocs.map(doc => ({
            name: doc.name,
            type: doc.type,
            content: doc.content
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Use the user-friendly message if available
        const errorMessage = data.userMessage || data.error || 'Failed to generate EOP';
        throw new Error(errorMessage);
      }
      
      // Success! Update last generation time
      const now = Date.now();
      localStorage.setItem('lastEOPGeneration', now.toString());
      setLastGenerationTime(now);
      
      alert('EOP generated successfully! Check the EOP gallery.');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Generation error:', error);
      
      // Show user-friendly error messages
      if (error.message.includes('busy') || error.message.includes('try again')) {
        alert('The AI service is currently busy. Please wait 2-3 minutes and try again.');
      } else if (error.message.includes('wait')) {
        alert(error.message);
      } else {
        alert(`Failed to generate EOP: ${error.message}`);
      }
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
          <h2 style={{ marginBottom: '5px', fontSize: '24px' }}>Generate EOP with AI</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Fill in the basic equipment information and let AI create a comprehensive EOP
          </p>
          
          {/* Cooldown Notice */}
          {cooldownRemaining > 0 && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              color: '#856404'
            }}>
              ⏱️ Please wait {cooldownRemaining} seconds before generating another EOP
            </div>
          )}
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
                Equipment Number *
              </label>
              <input
                type="text"
                value={formData.equipmentNumber}
                onChange={(e) => handleInputChange('equipmentNumber', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                placeholder="e.g., Chiller 1, Generator 2"
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
          </div>

          <div style={{ marginBottom: '15px' }}>
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

          {/* Address Section */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
              Site Address
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px', gap: '15px', marginBottom: '15px' }}>
              <div>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  placeholder="Street Address"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  placeholder="City"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}
                  placeholder="State"
                  maxLength="2"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px' }}>
              <div>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  placeholder="ZIP Code"
                  maxLength="10"
                />
              </div>
              <div></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>

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
                Component Type *
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
                placeholder="e.g., Air Cooled Chiller, Pump, etc."
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
              placeholder="Describe the emergency operating procedure (e.g., emergency shutdown, power failure response, cooling failure mitigation)..."
            />
          </div>
        </div>

        {/* Supporting Documents */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Supporting Documents</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
            Upload equipment manuals, specifications, or reference documents to help the AI generate a more accurate EOP
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
          <strong>Note:</strong> The AI will automatically generate all necessary EOP sections including immediate actions, 
          safety requirements, emergency procedures, and recovery steps based on the equipment information you provide.
          {' '}To ensure reliable service, there's a 60-second cooldown between generations.
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
              backgroundColor: cooldownRemaining > 0 ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: (isGenerating || cooldownRemaining > 0) ? 'not-allowed' : 'pointer',
              opacity: (isGenerating || cooldownRemaining > 0) ? 0.6 : 1,
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => !isGenerating && cooldownRemaining === 0 && (e.currentTarget.style.backgroundColor = '#218838')}
            onMouseLeave={(e) => !isGenerating && cooldownRemaining === 0 && (e.currentTarget.style.backgroundColor = '#28a745')}
            disabled={isGenerating || cooldownRemaining > 0}
          >
            {isGenerating ? 'Generating...' : cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : '🤖 Generate EOP'}
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