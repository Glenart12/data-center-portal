'use client';

import { useState, useEffect } from 'react';
import { upload } from '@vercel/blob/client';

export default function MOPGenerationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    manufacturer: '',
    modelNumber: '',
    equipmentNumber: '',
    serialNumber: '',
    location: '',
    customer: '',
    siteName: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    system: '',
    componentType: '',
    description: '',
    workType: 'self-delivered', // New field for self-delivered vs subcontractor
    contractors1: '',
    contractorCompany1: '',
    contractorPersonnel1: '',
    contractorContact1: '',
    contractors2: '',
    contractorCompany2: '',
    contractorPersonnel2: '',
    contractorContact2: ''
  });
  
  const [supportingDocs, setSupportingDocs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [lastGenerationTime, setLastGenerationTime] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [namePlatePhoto, setNamePlatePhoto] = useState(null);
  const [equipmentPhoto, setEquipmentPhoto] = useState(null);

  // Check for cooldown on component mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      const lastTime = parseInt(localStorage.getItem('lastMOPGeneration') || '0');
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

  const handlePhotoSelection = (e, type) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (type === 'nameplate') {
        setNamePlatePhoto(file);
      } else {
        setEquipmentPhoto(file);
      }
    }
  };

  const handleGenerate = async () => {
    // Check cooldown
    if (cooldownRemaining > 0) {
      alert(`Please wait ${cooldownRemaining} more seconds before generating another MOP. This helps ensure reliable service for all users.`);
      return;
    }

    // Check all required fields
    if (!formData.manufacturer || !formData.modelNumber || !formData.equipmentNumber || !formData.system || 
        !formData.description || !formData.customer || !formData.siteName) {
      alert('Please fill in all required fields:\n• Manufacturer\n• Model Number\n• Equipment Number\n• System\n• Work Description\n• Customer\n• Site Name');
      return;
    }

    setIsGenerating(true);

    try {
      let oneLineDiagramUrl = null;
      let namePlatePhotoUrl = null;
      let equipmentPhotoUrl = null;

      // Upload equipment name plate photo if exists
      if (namePlatePhoto) {
        setUploadProgress('Uploading equipment name plate photo...');
        try {
          const timestamp = new Date().toISOString().split('T')[0];
          const sanitizedName = namePlatePhoto.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filename = `equipment-photos/nameplate/${timestamp}_${sanitizedName}`;

          const blob = await upload(filename, namePlatePhoto, {
            access: 'public',
            handleUploadUrl: '/api/upload',
          });

          namePlatePhotoUrl = blob.url;
          console.log('Name plate photo uploaded:', namePlatePhotoUrl);
        } catch (uploadError) {
          console.error('Failed to upload name plate photo:', uploadError);
        }
      }

      // Upload equipment photo if exists
      if (equipmentPhoto) {
        setUploadProgress('Uploading equipment photo...');
        try {
          const timestamp = new Date().toISOString().split('T')[0];
          const sanitizedName = equipmentPhoto.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filename = `equipment-photos/equipment/${timestamp}_${sanitizedName}`;

          const blob = await upload(filename, equipmentPhoto, {
            access: 'public',
            handleUploadUrl: '/api/upload',
          });

          equipmentPhotoUrl = blob.url;
          console.log('Equipment photo uploaded:', equipmentPhotoUrl);
        } catch (uploadError) {
          console.error('Failed to upload equipment photo:', uploadError);
        }
      }

      // Check if there's a PDF in supporting docs (one-line diagram)
      const pdfDoc = supportingDocs.find(doc => doc.type === 'application/pdf');

      if (pdfDoc) {
        setUploadProgress('Uploading one-line diagram (direct to storage)...');

        try {
          // Convert base64 back to File object
          const base64Data = pdfDoc.content.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const file = new File([byteArray], pdfDoc.name, { type: 'application/pdf' });

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().split('T')[0];
          const sanitizedName = pdfDoc.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filename = `one-line-diagrams/${timestamp}_${sanitizedName}`;

          // Upload directly to Vercel Blob from client
          // This bypasses the serverless function entirely
          const blob = await upload(filename, file, {
            access: 'public',
            handleUploadUrl: '/api/upload', // Use the correct endpoint for client uploads
          });

          oneLineDiagramUrl = blob.url;
          console.log('One-line diagram uploaded directly:', oneLineDiagramUrl);
        } catch (uploadError) {
          console.error('Direct upload failed, trying server upload:', uploadError);

          // Fallback to server upload for smaller files
          const base64Data = pdfDoc.content.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const file = new File([byteArray], pdfDoc.name, { type: 'application/pdf' });

          const uploadFormData = new FormData();
          uploadFormData.append('file', file);

          const uploadResponse = await fetch('/api/upload-one-line', {
            method: 'POST',
            body: uploadFormData
          });

          if (!uploadResponse.ok) {
            const uploadError = await uploadResponse.json();
            throw new Error(uploadError.error || 'Failed to upload one-line diagram');
          }

          const uploadResult = await uploadResponse.json();
          oneLineDiagramUrl = uploadResult.url;
          console.log('One-line diagram uploaded via server:', oneLineDiagramUrl);
        }
      }

      setUploadProgress('Connecting to AI service...');

      // Filter out PDF from supportingDocs and truncate content for non-PDFs
      const filteredDocs = supportingDocs
        .filter(doc => doc.type !== 'application/pdf')
        .map(doc => ({
          name: doc.name,
          type: doc.type,
          content: doc.content.substring(0, 1000) // Only send first 1000 chars for AI context
        }));

      const response = await fetch('/api/generate-mop-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: {
            ...formData,
            workDescription: formData.description, // Ensure workDescription is available
            oneLineDiagramUrl: oneLineDiagramUrl, // Add the uploaded PDF URL
            namePlatePhotoUrl: namePlatePhotoUrl, // Add nameplate photo URL
            equipmentPhotoUrl: equipmentPhotoUrl // Add equipment photo URL
          },
          supportingDocs: filteredDocs
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Use the user-friendly message if available
        const errorMessage = data.userMessage || data.error || 'Failed to generate MOP';
        throw new Error(errorMessage);
      }
      
      // Success! Update last generation time
      const now = Date.now();
      localStorage.setItem('lastMOPGeneration', now.toString());
      setLastGenerationTime(now);
      
      alert('MOP generated successfully! Check the MOP gallery.');
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
        alert(`Failed to generate MOP: ${error.message}`);
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
      paddingTop: '100px',
      overflow: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        width: '95%',
        maxWidth: '700px',
        maxHeight: 'calc(100vh - 120px)',
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
              ⏱️ Please wait {cooldownRemaining} seconds before generating another MOP
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
                placeholder="e.g., CHILLER-1, ATS-2, GEN-3"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Customer *
              </label>
              <input
                type="text"
                value={formData.customer}
                onChange={(e) => handleInputChange('customer', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                placeholder="e.g., Company Name"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Site Name *
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                placeholder="e.g., Main Data Center"
              />
            </div>
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
                Component Type
              </label>
              <input
                type="text"
                value={formData.componentType}
                onChange={(e) => handleInputChange('componentType', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                placeholder="e.g., Air-Cooled Chiller, Pump, Generator"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Work Description *
            </label>
            <select
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">Select Work Description</option>
              <option value="Weekly Preventative Maintenance">Weekly Preventative Maintenance</option>
              <option value="Monthly Preventative Maintenance">Monthly Preventative Maintenance</option>
              <option value="Quarterly Preventative Maintenance">Quarterly Preventative Maintenance</option>
              <option value="Semi-Annual Preventative Maintenance">Semi-Annual Preventative Maintenance</option>
              <option value="Annual Preventative Maintenance">Annual Preventative Maintenance</option>
            </select>
          </div>
        </div>

        {/* Work Type Selection */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Work Execution Type</h3>
          <div style={{ display: 'flex', gap: '30px', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="workType"
                value="self-delivered"
                checked={formData.workType === 'self-delivered'}
                onChange={(e) => handleInputChange('workType', e.target.value)}
                style={{ marginRight: '8px' }}
              />
              Self-Delivered
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="workType"
                value="subcontractor"
                checked={formData.workType === 'subcontractor'}
                onChange={(e) => handleInputChange('workType', e.target.value)}
                style={{ marginRight: '8px' }}
              />
              Subcontractor
            </label>
          </div>

          {/* Contractor Fields - Only show when Subcontractor is selected */}
          {formData.workType === 'subcontractor' && (
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ marginBottom: '15px', color: '#495057' }}>Contractor #1</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Number of Contractors
                  </label>
                  <input
                    type="text"
                    value={formData.contractors1}
                    onChange={(e) => handleInputChange('contractors1', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    placeholder="e.g., 2"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.contractorCompany1}
                    onChange={(e) => handleInputChange('contractorCompany1', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    placeholder="e.g., ACME HVAC Services"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Personnel Name(s)
                  </label>
                  <input
                    type="text"
                    value={formData.contractorPersonnel1}
                    onChange={(e) => handleInputChange('contractorPersonnel1', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    placeholder="e.g., John Smith, Jane Doe"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Contact Details
                  </label>
                  <input
                    type="text"
                    value={formData.contractorContact1}
                    onChange={(e) => handleInputChange('contractorContact1', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    placeholder="e.g., 555-1234, john@acme.com"
                  />
                </div>
              </div>

              <h4 style={{ marginBottom: '15px', color: '#495057' }}>Contractor #2 (Optional)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Number of Contractors
                  </label>
                  <input
                    type="text"
                    value={formData.contractors2}
                    onChange={(e) => handleInputChange('contractors2', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    placeholder="e.g., 1"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.contractorCompany2}
                    onChange={(e) => handleInputChange('contractorCompany2', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    placeholder="e.g., XYZ Electrical"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Personnel Name(s)
                  </label>
                  <input
                    type="text"
                    value={formData.contractorPersonnel2}
                    onChange={(e) => handleInputChange('contractorPersonnel2', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    placeholder="e.g., Bob Johnson"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Contact Details
                  </label>
                  <input
                    type="text"
                    value={formData.contractorContact2}
                    onChange={(e) => handleInputChange('contractorContact2', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    placeholder="e.g., 555-5678, bob@xyz.com"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Supporting Documents */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>One-Line Diagram</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
            Upload facility one-line diagram to help the AI generate a more accurate MOP
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

          <p style={{
            fontSize: '12px',
            fontStyle: 'italic',
            color: '#999',
            marginTop: '5px',
            marginBottom: '10px'
          }}>
            Maximum file size: 3.5MB for PDFs. Please keep files under this size for best results.
          </p>

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

        {/* Equipment Name Plate Photo */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Equipment Name Plate Photo</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
            Upload equipment name plate photo to document specifications
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoSelection(e, 'nameplate')}
            style={{ display: 'none' }}
            id="nameplate-photo-upload"
          />
          <label
            htmlFor="nameplate-photo-upload"
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
            📎 Add Photo
          </label>

          {namePlatePhoto && (
            <div style={{ color: '#666', fontSize: '14px' }}>Photo selected: {namePlatePhoto.name}</div>
          )}
        </div>

        {/* Equipment Photo */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Equipment Photo</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
            Upload equipment photo for visual documentation
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoSelection(e, 'equipment')}
            style={{ display: 'none' }}
            id="equipment-photo-upload"
          />
          <label
            htmlFor="equipment-photo-upload"
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
            📎 Add Photo
          </label>

          {equipmentPhoto && (
            <div style={{ color: '#666', fontSize: '14px' }}>Photo selected: {equipmentPhoto.name}</div>
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
            {isGenerating ? 'Generating...' : cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : '🤖 Generate MOP'}
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