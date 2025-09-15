'use client';

import { useState } from 'react';

export default function MOPTemplateModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    // Section 01 - MOP Schedule Information
    mopTitle: '',
    mopInformation: '',
    mopAuthor: '',
    mopCreationDate: '',
    mopRevisionDate: '',
    documentNumber: '',
    revisionNumber: '',
    authorCETLevel: '',
    
    // Section 02 - Site Information
    dataCenterStreet: '',
    dataCenterCity: '',
    dataCenterState: '',
    dataCenterZip: '',
    serviceTicket: '',
    levelOfRisk: '',
    mbmRequired: '',
    
    // Section 03 - MOP Overview
    mopDescription: '',
    workArea: '',
    affectedSystems: '',
    equipmentInformation: '',
    manufacturer: '',
    equipmentId: '',
    modelNumber: '',
    serialNumber: '',
    personnelRequired: '',
    minFacilitiesPersonnel: '',
    contractors1: '',
    contractors2: '',
    personnelOtherDepts: '',
    qualificationsRequired: '',
    toolsRequired: '',
    advanceNotifications: '',
    postNotifications: '',
    
    // Section 04 - Effect of MOP on Critical Facility (Table format)
    facilityEffects: {
      electricalUtility: { yes: false, no: false, na: false, details: '' },
      emergencyGenerator: { yes: false, no: false, na: false, details: '' },
      criticalCooling: { yes: false, no: false, na: false, details: '' },
      ventilationSystem: { yes: false, no: false, na: false, details: '' },
      mechanicalSystem: { yes: false, no: false, na: false, details: '' },
      ups: { yes: false, no: false, na: false, details: '' },
      criticalPowerDist: { yes: false, no: false, na: false, details: '' },
      epo: { yes: false, no: false, na: false, details: '' },
      fireDetection: { yes: false, no: false, na: false, details: '' },
      fireSuppression: { yes: false, no: false, na: false, details: '' },
      disableFireSystem: { yes: false, no: false, na: false, details: '' },
      monitoringSystem: { yes: false, no: false, na: false, details: '' },
      controlSystem: { yes: false, no: false, na: false, details: '' },
      securitySystem: { yes: false, no: false, na: false, details: '' },
      generalPower: { yes: false, no: false, na: false, details: '' },
      lockoutTagout: { yes: false, no: false, na: false, details: '' },
      workHot: { yes: false, no: false, na: false, details: '' },
      radioInterference: { yes: false, no: false, na: false, details: '' }
    },
    
    // Section 05 - MOP Supporting Documentation (now text field)
    supportingDocumentation: '',
    
    // Section 06 - Safety Requirements
    safetyRequirements: '',
    
    // Section 07 - MOP Risks & Assumptions
    risksAssumptions: '',
    
    // Section 08 - MOP Details
    datePerformed: '',
    timeBegun: '',
    timeCompleted: '',
    facilitiesPersonnel: '',
    contractorPersonnel: '',
    chillerTable: Array(10).fill({ chiller: '', initials: '', time: '' }),
    
    // Section 09 - Back-out Procedures
    backoutTable: Array(10).fill({ procedure: '', initials: '', time: '' }),
    
    // Section 10 - MOP Approval
    clarityApproved: '',
    clarityReviewerName: '',
    clarityReviewerTitle: '',
    clarityDate: '',
    technicalApproved: '',
    technicalReviewerName: '',
    technicalReviewerTitle: '',
    technicalDate: '',
    chiefApproved: '',
    chiefReviewerName: '',
    chiefReviewerTitle: '',
    chiefDate: '',
    contractorApproved: '',
    contractorReviewerName: '',
    contractorReviewerTitle: '',
    contractorDate: '',
    capitalOneApproved: '',
    capitalOneReviewerName: '',
    capitalOneReviewerTitle: '',
    capitalOneDate: '',
    
    // Section 11 - MOP Comments
    mopComments: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFacilityEffectChange = (facility, field, value) => {
    setFormData(prev => ({
      ...prev,
      facilityEffects: {
        ...prev.facilityEffects,
        [facility]: {
          ...prev.facilityEffects[facility],
          [field]: value
        }
      }
    }));
  };

  const handleTableChange = (tableName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tableName]: prev[tableName].map((row, i) => 
        i === index ? { ...row, [field]: value } : row
      )
    }));
  };

  const handleCreateTemplate = async () => {
    if (!formData.mopTitle.trim()) {
      alert('Please enter a MOP title');
      return;
    }

    setIsSaving(true);
    
    // Create formatted MOP content
    let fileContent = `METHOD OF PROCEDURE (MOP)\n`;
    fileContent += `========================\n\n`;
    
    fileContent += `SECTION 01 - MOP SCHEDULE INFORMATION\n`;
    fileContent += `-------------------------------------\n`;
    fileContent += `MOP Title: ${formData.mopTitle}\n`;
    fileContent += `MOP Information: ${formData.mopInformation}\n`;
    fileContent += `MOP Author: ${formData.mopAuthor}\n`;
    fileContent += `MOP Creation Date: ${formData.mopCreationDate}\n`;
    fileContent += `MOP Revision Date: ${formData.mopRevisionDate}\n`;
    fileContent += `Document Number: ${formData.documentNumber}\n`;
    fileContent += `Revision Number: ${formData.revisionNumber}\n`;
    fileContent += `Author CET Level: ${formData.authorCETLevel}\n\n`;
    
    fileContent += `SECTION 02 - SITE INFORMATION\n`;
    fileContent += `-----------------------------\n`;
    fileContent += `Data Center Location:\n`;
    fileContent += `  Street: ${formData.dataCenterStreet}\n`;
    fileContent += `  City: ${formData.dataCenterCity}\n`;
    fileContent += `  State: ${formData.dataCenterState}\n`;
    fileContent += `  ZIP: ${formData.dataCenterZip}\n`;
    fileContent += `Service Ticket/Project Number: ${formData.serviceTicket}\n`;
    fileContent += `Level of Risk: ${formData.levelOfRisk}\n`;
    fileContent += `MBM Required?: ${formData.mbmRequired}\n\n`;
    
    fileContent += `SECTION 03 - MOP OVERVIEW\n`;
    fileContent += `-------------------------\n`;
    fileContent += `MOP Description: ${formData.mopDescription}\n`;
    fileContent += `Work Area: ${formData.workArea}\n`;
    fileContent += `Affected Systems: ${formData.affectedSystems}\n`;
    fileContent += `Equipment Information: ${formData.equipmentInformation}\n`;
    fileContent += `Manufacturer: ${formData.manufacturer}\n`;
    fileContent += `Equipment ID: ${formData.equipmentId}\n`;
    fileContent += `Model #: ${formData.modelNumber}\n`;
    fileContent += `Serial #: ${formData.serialNumber}\n`;
    fileContent += `Personnel Required: ${formData.personnelRequired}\n`;
    fileContent += `Min. # of Facilities Personnel: ${formData.minFacilitiesPersonnel}\n`;
    fileContent += `# of Contractors #1: ${formData.contractors1}\n`;
    fileContent += `# of Contractors #2: ${formData.contractors2}\n`;
    fileContent += `Personnel from other departments: ${formData.personnelOtherDepts}\n`;
    fileContent += `Qualifications Required: ${formData.qualificationsRequired}\n`;
    fileContent += `Tools Required: ${formData.toolsRequired}\n`;
    fileContent += `Advance notifications required: ${formData.advanceNotifications}\n`;
    fileContent += `Post notifications required: ${formData.postNotifications}\n\n`;

    fileContent += `SECTION 04 - EFFECT OF MOP ON CRITICAL FACILITY\n`;
    fileContent += `-----------------------------------------------\n`;
    
    const facilityNames = {
      electricalUtility: 'Electrical Utility Equipment',
      emergencyGenerator: 'Emergency Generator System',
      criticalCooling: 'Critical Cooling System',
      ventilationSystem: 'Ventilation System',
      mechanicalSystem: 'Mechanical System',
      ups: 'Uninterruptible Power Supply (UPS)',
      criticalPowerDist: 'Critical Power Distribution System',
      epo: 'Emergency Power Off (EPO)',
      fireDetection: 'Fire Detection Systems',
      fireSuppression: 'Fire Suppression System',
      disableFireSystem: 'Disable Fire System',
      monitoringSystem: 'Monitoring System',
      controlSystem: 'Control System',
      securitySystem: 'Security System',
      generalPower: 'General Power and Lighting System',
      lockoutTagout: 'Lockout/Tagout Required?',
      workHot: 'Work to be performed "hot"?',
      radioInterference: 'Radio interference potential?'
    };

    Object.entries(formData.facilityEffects).forEach(([key, value]) => {
      const status = value.yes ? 'Yes' : value.no ? 'No' : value.na ? 'N/A' : 'Not specified';
      fileContent += `${facilityNames[key]}: ${status}${value.details ? ` - ${value.details}` : ''}\n`;
    });

    fileContent += `\nSECTION 05 - MOP SUPPORTING DOCUMENTATION\n`;
    fileContent += `-----------------------------------------\n`;
    fileContent += `${formData.supportingDocumentation}\n\n`;

    fileContent += `SECTION 06 - SAFETY REQUIREMENTS\n`;
    fileContent += `--------------------------------\n`;
    fileContent += `${formData.safetyRequirements}\n\n`;

    fileContent += `SECTION 07 - MOP RISKS & ASSUMPTIONS\n`;
    fileContent += `------------------------------------\n`;
    fileContent += `${formData.risksAssumptions}\n\n`;

    fileContent += `SECTION 08 - MOP DETAILS\n`;
    fileContent += `------------------------\n`;
    fileContent += `Date Performed: ${formData.datePerformed}\n`;
    fileContent += `Time Begun: ${formData.timeBegun}\n`;
    fileContent += `Time Completed: ${formData.timeCompleted}\n`;
    fileContent += `Facilities personnel performing work: ${formData.facilitiesPersonnel}\n`;
    fileContent += `Contractor/Vendor personnel performing work: ${formData.contractorPersonnel}\n\n`;
    
    fileContent += `Chiller Operations Log:\n`;
    formData.chillerTable.forEach((row, index) => {
      if (row.chiller || row.initials || row.time) {
        fileContent += `Row ${index + 1}: Chiller: ${row.chiller}, Initials: ${row.initials}, Time: ${row.time}\n`;
      }
    });

    fileContent += `\nSECTION 09 - BACK-OUT PROCEDURES\n`;
    fileContent += `--------------------------------\n`;
    fileContent += `IMPORTANT NOTES:\n`;
    fileContent += `1. Back-out procedures will commence immediately if any problem/failure occurs that affects the critical load.\n`;
    fileContent += `2. Any Issues Encountered, at any of the listed verification steps, will signal a STOP of work. Issues will be immediately identified for Root Cause. Corrections will be made. The system(s) will be returned to normal operating condition and allowed to stabilize. Evaluation will be conducted before a decision is to continue or stop work. The Emergency will be immediately notified and work will STOP.\n\n`;
    
    fileContent += `Back-out Procedures Log:\n`;
    formData.backoutTable.forEach((row, index) => {
      if (row.procedure || row.initials || row.time) {
        fileContent += `Row ${index + 1}: Procedure: ${row.procedure}, Initials: ${row.initials}, Time: ${row.time}\n`;
      }
    });

    fileContent += `\nSECTION 10 - MOP APPROVAL\n`;
    fileContent += `-------------------------\n`;
    fileContent += `Tested for clarity:\n`;
    fileContent += `  Reviewer's Name: ${formData.clarityReviewerName}\n`;
    fileContent += `  Reviewer's Title: ${formData.clarityReviewerTitle}\n`;
    fileContent += `  Date: ${formData.clarityDate}\n`;
    fileContent += `  Approved: ${formData.clarityApproved}\n\n`;
    
    fileContent += `Technical review:\n`;
    fileContent += `  Reviewer's Name: ${formData.technicalReviewerName}\n`;
    fileContent += `  Reviewer's Title: ${formData.technicalReviewerTitle}\n`;
    fileContent += `  Date: ${formData.technicalDate}\n`;
    fileContent += `  Approved: ${formData.technicalApproved}\n\n`;
    
    fileContent += `JLL Chief Engineer approval:\n`;
    fileContent += `  Reviewer's Name: ${formData.chiefReviewerName}\n`;
    fileContent += `  Reviewer's Title: ${formData.chiefReviewerTitle}\n`;
    fileContent += `  Date: ${formData.chiefDate}\n`;
    fileContent += `  Approved: ${formData.chiefApproved}\n\n`;
    
    fileContent += `Contractor Review (if applicable):\n`;
    fileContent += `  Reviewer's Name: ${formData.contractorReviewerName}\n`;
    fileContent += `  Reviewer's Title: ${formData.contractorReviewerTitle}\n`;
    fileContent += `  Date: ${formData.contractorDate}\n`;
    fileContent += `  Approved: ${formData.contractorApproved}\n\n`;
    
    fileContent += `Capital One approval:\n`;
    fileContent += `  Reviewer's Name: ${formData.capitalOneReviewerName}\n`;
    fileContent += `  Reviewer's Title: ${formData.capitalOneReviewerTitle}\n`;
    fileContent += `  Date: ${formData.capitalOneDate}\n`;
    fileContent += `  Approved: ${formData.capitalOneApproved}\n\n`;

    fileContent += `SECTION 11 - MOP COMMENTS\n`;
    fileContent += `-------------------------\n`;
    fileContent += `${formData.mopComments}\n`;

    try {
      // Send the content to the server to save as a file
      const response = await fetch('/api/generate-mop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: fileContent,
          filename: formData.mopTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        }),
      });

      if (response.ok) {
        alert('MOP Template created successfully!');
        onClose();
        // Refresh the page to show the new file
        window.location.reload();
      } else {
        alert('Failed to create MOP Template. Please try again.');
      }
    } catch (error) {
      console.error('Error creating MOP:', error);
      alert('Failed to create MOP Template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      mopTitle: '', mopInformation: '', mopAuthor: '', mopCreationDate: '', mopRevisionDate: '',
      documentNumber: '', revisionNumber: '', authorCETLevel: '', dataCenterStreet: '', dataCenterCity: '',
      dataCenterState: '', dataCenterZip: '', serviceTicket: '', levelOfRisk: '', mbmRequired: '',
      mopDescription: '', workArea: '', affectedSystems: '', equipmentInformation: '', manufacturer: '',
      equipmentId: '', modelNumber: '', serialNumber: '', personnelRequired: '', minFacilitiesPersonnel: '',
      contractors1: '', contractors2: '', personnelOtherDepts: '', qualificationsRequired: '',
      toolsRequired: '', advanceNotifications: '', postNotifications: '',
      facilityEffects: {
        electricalUtility: { yes: false, no: false, na: false, details: '' },
        emergencyGenerator: { yes: false, no: false, na: false, details: '' },
        criticalCooling: { yes: false, no: false, na: false, details: '' },
        ventilationSystem: { yes: false, no: false, na: false, details: '' },
        mechanicalSystem: { yes: false, no: false, na: false, details: '' },
        ups: { yes: false, no: false, na: false, details: '' },
        criticalPowerDist: { yes: false, no: false, na: false, details: '' },
        epo: { yes: false, no: false, na: false, details: '' },
        fireDetection: { yes: false, no: false, na: false, details: '' },
        fireSuppression: { yes: false, no: false, na: false, details: '' },
        disableFireSystem: { yes: false, no: false, na: false, details: '' },
        monitoringSystem: { yes: false, no: false, na: false, details: '' },
        controlSystem: { yes: false, no: false, na: false, details: '' },
        securitySystem: { yes: false, no: false, na: false, details: '' },
        generalPower: { yes: false, no: false, na: false, details: '' },
        lockoutTagout: { yes: false, no: false, na: false, details: '' },
        workHot: { yes: false, no: false, na: false, details: '' },
        radioInterference: { yes: false, no: false, na: false, details: '' }
      },
      supportingDocumentation: '', safetyRequirements: '', risksAssumptions: '', datePerformed: '',
      timeBegun: '', timeCompleted: '', facilitiesPersonnel: '', contractorPersonnel: '',
      chillerTable: Array(10).fill({ chiller: '', initials: '', time: '' }),
      backoutTable: Array(10).fill({ procedure: '', initials: '', time: '' }),
      clarityApproved: '', clarityReviewerName: '', clarityReviewerTitle: '', clarityDate: '',
      technicalApproved: '', technicalReviewerName: '', technicalReviewerTitle: '', technicalDate: '',
      chiefApproved: '', chiefReviewerName: '', chiefReviewerTitle: '', chiefDate: '',
      contractorApproved: '', contractorReviewerName: '', contractorReviewerTitle: '', contractorDate: '',
      capitalOneApproved: '', capitalOneReviewerName: '', capitalOneReviewerTitle: '', capitalOneDate: '',
      mopComments: ''
    });
  };

  if (!isOpen) return null;

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
    marginBottom: '15px',
    boxSizing: 'border-box'
  };

  const textAreaStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#0f3456',
    fontSize: '14px'
  };

  const sectionStyle = {
    marginBottom: '30px',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '20px'
  };

  const sectionHeaderStyle = {
    backgroundColor: '#0f3456',
    color: 'white',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px',
    borderRadius: '6px',
    textAlign: 'center'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  };

  const thStyle = {
    backgroundColor: '#f8f9fa',
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left',
    fontWeight: 'bold'
  };

  const tdStyle = {
    padding: '8px',
    border: '1px solid #ddd'
  };

  const checkboxStyle = {
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  };

  const facilityOptions = [
    { key: 'electricalUtility', label: 'Electrical Utility Equipment' },
    { key: 'emergencyGenerator', label: 'Emergency Generator System' },
    { key: 'criticalCooling', label: 'Critical Cooling System' },
    { key: 'ventilationSystem', label: 'Ventilation System' },
    { key: 'mechanicalSystem', label: 'Mechanical System' },
    { key: 'ups', label: 'Uninterruptible Power Supply (UPS)' },
    { key: 'criticalPowerDist', label: 'Critical Power Distribution System' },
    { key: 'epo', label: 'Emergency Power Off (EPO)' },
    { key: 'fireDetection', label: 'Fire Detection Systems' },
    { key: 'fireSuppression', label: 'Fire Suppression System' },
    { key: 'disableFireSystem', label: 'Disable Fire System' },
    { key: 'monitoringSystem', label: 'Monitoring System' },
    { key: 'controlSystem', label: 'Control System' },
    { key: 'securitySystem', label: 'Security System' },
    { key: 'generalPower', label: 'General Power and Lighting System' },
    { key: 'lockoutTagout', label: 'Lockout/Tagout Required?' },
    { key: 'workHot', label: 'Work to be performed "hot" (live electrical equipment)?' },
    { key: 'radioInterference', label: 'Radio interference potential?' }
  ];

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
      paddingTop: '100px',
      backdropFilter: 'blur(5px)',
      overflow: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        width: '95%',
        maxWidth: '1000px',
        maxHeight: 'calc(100vh - 120px)',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '40px'
      }}>
        {/* Header */}
        <div style={{
          padding: '25px 30px',
          borderBottom: '1px solid #eee',
          backgroundColor: '#f8f9fa',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <span style={{ fontSize: '48px' }}>📋</span>
          </div>
          <h2 style={{
            margin: 0,
            color: '#0f3456',
            fontSize: '1.6em',
            fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif'
          }}>
            MOP Template Generator
          </h2>
          <p style={{
            margin: '15px 0 0 0',
            color: '#666',
            fontSize: '14px'
          }}>
            Create a comprehensive Method of Procedure document
          </p>
        </div>

        {/* Form Content - Scrollable */}
        <div style={{
          padding: '30px',
          overflowY: 'auto',
          flex: 1
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Section 01 - MOP Schedule Information */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>Section 01 - MOP Schedule Information</div>
              
              <label style={labelStyle}>MOP Title:</label>
              <input type="text" value={formData.mopTitle} onChange={(e) => handleInputChange('mopTitle', e.target.value)} style={inputStyle} placeholder="Enter MOP title" />
              
              <label style={labelStyle}>MOP Information:</label>
              <textarea value={formData.mopInformation} onChange={(e) => handleInputChange('mopInformation', e.target.value)} style={textAreaStyle} placeholder="Enter MOP information" />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>MOP Author:</label>
                  <input type="text" value={formData.mopAuthor} onChange={(e) => handleInputChange('mopAuthor', e.target.value)} style={inputStyle} placeholder="Enter author name" />
                </div>
                <div>
                  <label style={labelStyle}>Author CET Level:</label>
                  <select value={formData.authorCETLevel} onChange={(e) => handleInputChange('authorCETLevel', e.target.value)} style={inputStyle}>
                    <option value="">Select Level</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>MOP Creation Date:</label>
                  <input type="date" value={formData.mopCreationDate} onChange={(e) => handleInputChange('mopCreationDate', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>MOP Revision Date:</label>
                  <input type="date" value={formData.mopRevisionDate} onChange={(e) => handleInputChange('mopRevisionDate', e.target.value)} style={inputStyle} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Document Number:</label>
                  <input type="text" value={formData.documentNumber} onChange={(e) => handleInputChange('documentNumber', e.target.value)} style={inputStyle} placeholder="Enter document number" />
                </div>
                <div>
                  <label style={labelStyle}>Revision Number:</label>
                  <input type="text" value={formData.revisionNumber} onChange={(e) => handleInputChange('revisionNumber', e.target.value)} style={inputStyle} placeholder="Enter revision number" />
                </div>
              </div>
            </div>

            {/* Section 02 - Site Information */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>Section 02 - Site Information</div>
              
              <label style={labelStyle}>Data Center Location:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <input
                  type="text"
                  value={formData.dataCenterStreet}
                  onChange={(e) => handleInputChange('dataCenterStreet', e.target.value)}
                  style={{ ...inputStyle, marginBottom: '0' }}
                  placeholder="Street Address"
                />
                <input
                  type="text"
                  value={formData.dataCenterCity}
                  onChange={(e) => handleInputChange('dataCenterCity', e.target.value)}
                  style={{ ...inputStyle, marginBottom: '0' }}
                  placeholder="City"
                />
                <input
                  type="text"
                  value={formData.dataCenterState}
                  onChange={(e) => handleInputChange('dataCenterState', e.target.value)}
                  style={{ ...inputStyle, marginBottom: '0' }}
                  placeholder="State"
                />
                <input
                  type="text"
                  value={formData.dataCenterZip}
                  onChange={(e) => handleInputChange('dataCenterZip', e.target.value)}
                  style={{ ...inputStyle, marginBottom: '0' }}
                  placeholder="ZIP Code"
                />
              </div>
              
              <label style={labelStyle}>Service Ticket/Project Number:</label>
              <input type="text" value={formData.serviceTicket} onChange={(e) => handleInputChange('serviceTicket', e.target.value)} style={inputStyle} placeholder="Enter ticket/project number" />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Level of Risk:</label>
                  <select value={formData.levelOfRisk} onChange={(e) => handleInputChange('levelOfRisk', e.target.value)} style={inputStyle}>
                    <option value="">Select Risk Level</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>MBM Required?</label>
                  <select value={formData.mbmRequired} onChange={(e) => handleInputChange('mbmRequired', e.target.value)} style={inputStyle}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 03 - MOP Overview */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>Section 03 - MOP Overview</div>
              
              <label style={labelStyle}>MOP Description:</label>
              <textarea value={formData.mopDescription} onChange={(e) => handleInputChange('mopDescription', e.target.value)} style={textAreaStyle} placeholder="Enter MOP description" />
              
              <label style={labelStyle}>Work Area:</label>
              <input type="text" value={formData.workArea} onChange={(e) => handleInputChange('workArea', e.target.value)} style={inputStyle} placeholder="Enter work area" />
              
              <label style={labelStyle}>Affected Systems:</label>
              <textarea value={formData.affectedSystems} onChange={(e) => handleInputChange('affectedSystems', e.target.value)} style={textAreaStyle} placeholder="Enter affected systems" />
              
              <label style={labelStyle}>Equipment Information:</label>
              <textarea value={formData.equipmentInformation} onChange={(e) => handleInputChange('equipmentInformation', e.target.value)} style={textAreaStyle} placeholder="Enter equipment information" />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Manufacturer:</label>
                  <input type="text" value={formData.manufacturer} onChange={(e) => handleInputChange('manufacturer', e.target.value)} style={inputStyle} placeholder="Enter manufacturer" />
                </div>
                <div>
                  <label style={labelStyle}>Equipment ID:</label>
                  <input type="text" value={formData.equipmentId} onChange={(e) => handleInputChange('equipmentId', e.target.value)} style={inputStyle} placeholder="Enter equipment ID" />
                </div>
                <div>
                  <label style={labelStyle}>Model #:</label>
                  <input type="text" value={formData.modelNumber} onChange={(e) => handleInputChange('modelNumber', e.target.value)} style={inputStyle} placeholder="Enter model number" />
                </div>
              </div>
              
              <label style={labelStyle}>Serial #:</label>
              <input type="text" value={formData.serialNumber} onChange={(e) => handleInputChange('serialNumber', e.target.value)} style={inputStyle} placeholder="Enter serial number" />
              
              <label style={labelStyle}>Personnel Required:</label>
              <textarea value={formData.personnelRequired} onChange={(e) => handleInputChange('personnelRequired', e.target.value)} style={textAreaStyle} placeholder="Enter personnel requirements" />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Min. # of Facilities Personnel:</label>
                  <input type="text" value={formData.minFacilitiesPersonnel} onChange={(e) => handleInputChange('minFacilitiesPersonnel', e.target.value)} style={inputStyle} placeholder="Enter minimum number" />
                </div>
                <div>
                  <label style={labelStyle}># of Contractors #1:</label>
                  <input type="text" value={formData.contractors1} onChange={(e) => handleInputChange('contractors1', e.target.value)} style={inputStyle} placeholder="Enter number" />
                </div>
                <div>
                  <label style={labelStyle}># of Contractors #2:</label>
                  <input type="text" value={formData.contractors2} onChange={(e) => handleInputChange('contractors2', e.target.value)} style={inputStyle} placeholder="Enter number" />
                </div>
              </div>
              
              <label style={labelStyle}>Personnel from other departments:</label>
              <textarea value={formData.personnelOtherDepts} onChange={(e) => handleInputChange('personnelOtherDepts', e.target.value)} style={textAreaStyle} placeholder="Enter personnel from other departments" />
              
              <label style={labelStyle}>Qualifications Required:</label>
              <textarea value={formData.qualificationsRequired} onChange={(e) => handleInputChange('qualificationsRequired', e.target.value)} style={textAreaStyle} placeholder="Enter required qualifications" />
              
              <label style={labelStyle}>Tools Required:</label>
              <textarea value={formData.toolsRequired} onChange={(e) => handleInputChange('toolsRequired', e.target.value)} style={textAreaStyle} placeholder="Enter required tools" />
              
              <label style={labelStyle}>Advance notifications required:</label>
              <textarea value={formData.advanceNotifications} onChange={(e) => handleInputChange('advanceNotifications', e.target.value)} style={textAreaStyle} placeholder="Enter advance notification requirements" />
              
              <label style={labelStyle}>Post notifications required:</label>
              <textarea value={formData.postNotifications} onChange={(e) => handleInputChange('postNotifications', e.target.value)} style={textAreaStyle} placeholder="Enter post notification requirements" />
            </div>

            {/* Section 04 - Effect of MOP on Critical Facility (Table) */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>Section 04 - Effect of MOP on Critical Facility</div>
              
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Facility Equipment or System</th>
                    <th style={{ ...thStyle, width: '80px', textAlign: 'center' }}>Yes</th>
                    <th style={{ ...thStyle, width: '80px', textAlign: 'center' }}>No</th>
                    <th style={{ ...thStyle, width: '80px', textAlign: 'center' }}>N/A</th>
                    <th style={thStyle}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {facilityOptions.map(({ key, label }) => (
                    <tr key={key}>
                      <td style={tdStyle}>{label}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={formData.facilityEffects[key].yes}
                          onChange={(e) => {
                            handleFacilityEffectChange(key, 'yes', e.target.checked);
                            if (e.target.checked) {
                              handleFacilityEffectChange(key, 'no', false);
                              handleFacilityEffectChange(key, 'na', false);
                            }
                          }}
                          style={checkboxStyle}
                        />
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={formData.facilityEffects[key].no}
                          onChange={(e) => {
                            handleFacilityEffectChange(key, 'no', e.target.checked);
                            if (e.target.checked) {
                              handleFacilityEffectChange(key, 'yes', false);
                              handleFacilityEffectChange(key, 'na', false);
                            }
                          }}
                          style={checkboxStyle}
                        />
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={formData.facilityEffects[key].na}
                          onChange={(e) => {
                            handleFacilityEffectChange(key, 'na', e.target.checked);
                            if (e.target.checked) {
                              handleFacilityEffectChange(key, 'yes', false);
                              handleFacilityEffectChange(key, 'no', false);
                            }
                          }}
                          style={checkboxStyle}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={formData.facilityEffects[key].details}
                          onChange={(e) => handleFacilityEffectChange(key, 'details', e.target.value)}
                          style={{ width: '100%', border: 'none', padding: '4px' }}
                          placeholder="Enter details"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 05 - MOP Supporting Documentation */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>Section 05 - MOP Supporting Documentation</div>
              
              <label style={labelStyle}>MOP Supporting Documentation:</label>
              <textarea 
                value={formData.supportingDocumentation} 
                onChange={(e) => handleInputChange('supportingDocumentation', e.target.value)} 
                style={{ ...textAreaStyle, minHeight: '120px' }}
                placeholder="Enter supporting documentation details"
              />
            </div>

            {/* Section 06 - Safety Requirements */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>Section 06 - Safety Requirements</div>
              
              <label style={labelStyle}>Pre Work Conditions / Safety Requirements:</label>
              <textarea value={formData.safetyRequirements} onChange={(e) => handleInputChange('safetyRequirements', e.target.value)} style={textAreaStyle} placeholder="Enter safety requirements" />
            </div>

            {/* Section 07 - MOP Risks & Assumptions */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>Section 07 - MOP Risks & Assumptions</div>
              
              <label style={labelStyle}>MOP Risks and Assumptions:</label>
              <textarea value={formData.risksAssumptions} onChange={(e) => handleInputChange('risksAssumptions', e.target.value)} style={textAreaStyle} placeholder="Enter risks and assumptions" />
            </div>

            {/* Section 08 - MOP Details */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>Section 08 - MOP Details</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Date Performed:</label>
                  <input type="date" value={formData.datePerformed} onChange={(e) => handleInputChange('datePerformed', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Time Begun:</label>
                  <input type="time" value={formData.timeBegun} onChange={(e) => handleInputChange('timeBegun', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Time Completed:</label>
                  <input type="time" value={formData.timeCompleted} onChange={(e) => handleInputChange('timeCompleted', e.target.value)} style={inputStyle} />
                </div>
              </div>
              
              <label style={labelStyle}>Facilities personnel performing work:</label>
              <textarea value={formData.facilitiesPersonnel} onChange={(e) => handleInputChange('facilitiesPersonnel', e.target.value)} style={textAreaStyle} placeholder="Enter personnel names" />
              
              <label style={labelStyle}>Contractor/Vendor personnel performing work:</label>
              <textarea value={formData.contractorPersonnel} onChange={(e) => handleInputChange('contractorPersonnel', e.target.value)} style={textAreaStyle} placeholder="Enter contractor/vendor names" />

              {/* Chiller Table */}
              <h4 style={{ marginTop: '30px', marginBottom: '10px' }}>Chiller Operations Log</h4>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Chiller, Variable Speed Drive (VSD), Low Voltage, &gt;790 HP Comprehensive</th>
                    <th style={thStyle}>Initials</th>
                    <th style={thStyle}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.chillerTable.map((row, index) => (
                    <tr key={index}>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={row.chiller}
                          onChange={(e) => handleTableChange('chillerTable', index, 'chiller', e.target.value)}
                          style={{ width: '100%', border: 'none', padding: '4px' }}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={row.initials}
                          onChange={(e) => handleTableChange('chillerTable', index, 'initials', e.target.value)}
                          style={{ width: '100%', border: 'none', padding: '4px' }}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="time"
                          value={row.time}
                          onChange={(e) => handleTableChange('chillerTable', index, 'time', e.target.value)}
                          style={{ width: '100%', border: 'none', padding: '4px' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 09 - Back-out Procedures */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>Section 09 - Back-out Procedures</div>
              
              <div style={{ 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7',
                borderRadius: '4px',
                padding: '15px',
                marginBottom: '20px'
              }}>
                <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>⚠️ IMPORTANT NOTES:</p>
                <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                  <li>Back-out procedures will commence immediately if any problem/failure occurs that affects the critical load.</li>
                  <li>Any Issues Encountered, at any of the listed verification steps, will signal a STOP of work. Issues will be immediately identified for Root Cause. Corrections will be made. The system(s) will be returned to normal operating condition and allowed to stabilize. Evaluation will be conducted before a decision is to continue or stop work. The Emergency will be immediately notified and work will STOP.</li>
                </ol>
              </div>

              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Back-out Procedures</th>
                    <th style={thStyle}>Initials</th>
                    <th style={thStyle}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.backoutTable.map((row, index) => (
                    <tr key={index}>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={row.procedure}
                          onChange={(e) => handleTableChange('backoutTable', index, 'procedure', e.target.value)}
                          style={{ width: '100%', border: 'none', padding: '4px' }}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          value={row.initials}
                          onChange={(e) => handleTableChange('backoutTable', index, 'initials', e.target.value)}
                          style={{ width: '100%', border: 'none', padding: '4px' }}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="time"
                          value={row.time}
                          onChange={(e) => handleTableChange('backoutTable', index, 'time', e.target.value)}
                          style={{ width: '100%', border: 'none', padding: '4px' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Section 10 - MOP Approval */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>Section 10 - MOP Approval</div>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '10px' }}>Tested for clarity:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 120px', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Reviewer's Name:</label>
                    <input type="text" value={formData.clarityReviewerName} onChange={(e) => handleInputChange('clarityReviewerName', e.target.value)} style={inputStyle} placeholder="Enter reviewer name" />
                  </div>
                  <div>
                    <label style={labelStyle}>Reviewer's Title:</label>
                    <input type="text" value={formData.clarityReviewerTitle} onChange={(e) => handleInputChange('clarityReviewerTitle', e.target.value)} style={inputStyle} placeholder="Enter reviewer title" />
                  </div>
                  <div>
                    <label style={labelStyle}>Date:</label>
                    <input type="date" value={formData.clarityDate} onChange={(e) => handleInputChange('clarityDate', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Approved:</label>
                    <select value={formData.clarityApproved} onChange={(e) => handleInputChange('clarityApproved', e.target.value)} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '10px' }}>Technical review:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 120px', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Reviewer's Name:</label>
                    <input type="text" value={formData.technicalReviewerName} onChange={(e) => handleInputChange('technicalReviewerName', e.target.value)} style={inputStyle} placeholder="Enter reviewer name" />
                  </div>
                  <div>
                    <label style={labelStyle}>Reviewer's Title:</label>
                    <input type="text" value={formData.technicalReviewerTitle} onChange={(e) => handleInputChange('technicalReviewerTitle', e.target.value)} style={inputStyle} placeholder="Enter reviewer title" />
                  </div>
                  <div>
                    <label style={labelStyle}>Date:</label>
                    <input type="date" value={formData.technicalDate} onChange={(e) => handleInputChange('technicalDate', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Approved:</label>
                    <select value={formData.technicalApproved} onChange={(e) => handleInputChange('technicalApproved', e.target.value)} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '10px' }}>JLL Chief Engineer approval:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 120px', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Reviewer's Name:</label>
                    <input type="text" value={formData.chiefReviewerName} onChange={(e) => handleInputChange('chiefReviewerName', e.target.value)} style={inputStyle} placeholder="Enter reviewer name" />
                  </div>
                  <div>
                    <label style={labelStyle}>Reviewer's Title:</label>
                    <input type="text" value={formData.chiefReviewerTitle} onChange={(e) => handleInputChange('chiefReviewerTitle', e.target.value)} style={inputStyle} placeholder="Enter reviewer title" />
                  </div>
                  <div>
                    <label style={labelStyle}>Date:</label>
                    <input type="date" value={formData.chiefDate} onChange={(e) => handleInputChange('chiefDate', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Approved:</label>
                    <select value={formData.chiefApproved} onChange={(e) => handleInputChange('chiefApproved', e.target.value)} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '10px' }}>Contractor Review (if applicable):</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 120px', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Reviewer's Name:</label>
                    <input type="text" value={formData.contractorReviewerName} onChange={(e) => handleInputChange('contractorReviewerName', e.target.value)} style={inputStyle} placeholder="Enter reviewer name" />
                  </div>
                  <div>
                    <label style={labelStyle}>Reviewer's Title:</label>
                    <input type="text" value={formData.contractorReviewerTitle} onChange={(e) => handleInputChange('contractorReviewerTitle', e.target.value)} style={inputStyle} placeholder="Enter reviewer title" />
                  </div>
                  <div>
                    <label style={labelStyle}>Date:</label>
                    <input type="date" value={formData.contractorDate} onChange={(e) => handleInputChange('contractorDate', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Approved:</label>
                    <select value={formData.contractorApproved} onChange={(e) => handleInputChange('contractorApproved', e.target.value)} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '10px' }}>Capital One approval:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 120px', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Reviewer's Name:</label>
                    <input type="text" value={formData.capitalOneReviewerName} onChange={(e) => handleInputChange('capitalOneReviewerName', e.target.value)} style={inputStyle} placeholder="Enter reviewer name" />
                  </div>
                  <div>
                    <label style={labelStyle}>Reviewer's Title:</label>
                    <input type="text" value={formData.capitalOneReviewerTitle} onChange={(e) => handleInputChange('capitalOneReviewerTitle', e.target.value)} style={inputStyle} placeholder="Enter reviewer title" />
                  </div>
                  <div>
                    <label style={labelStyle}>Date:</label>
                    <input type="date" value={formData.capitalOneDate} onChange={(e) => handleInputChange('capitalOneDate', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Approved:</label>
                    <select value={formData.capitalOneApproved} onChange={(e) => handleInputChange('capitalOneApproved', e.target.value)} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 11 - MOP Comments */}
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>Section 11 - MOP Comments</div>
              
              <label style={labelStyle}>MOP Comments:</label>
              <textarea value={formData.mopComments} onChange={(e) => handleInputChange('mopComments', e.target.value)} style={{ ...textAreaStyle, minHeight: '120px' }} placeholder="Enter any additional comments" />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div style={{
          padding: '25px 30px',
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
              fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
              transition: 'background-color 0.2s ease'
            }}
            disabled={isSaving}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
          >
            Cancel
          </button>
          
          <button
            onClick={handleCreateTemplate}
            disabled={isSaving || !formData.mopTitle.trim()}
            style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #6f42c1 0%, #8e4ec6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 3px 15px rgba(111, 66, 193, 0.3)',
              opacity: isSaving || !formData.mopTitle.trim() ? 0.6 : 1,
              fontFamily: '"Century Gothic", "Questrial", -apple-system, sans-serif',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isSaving && formData.mopTitle.trim()) {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving && formData.mopTitle.trim()) {
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isSaving ? 'Creating MOP...' : 'Create MOP Template'}
          </button>
        </div>
      </div>
    </div>
  );
}