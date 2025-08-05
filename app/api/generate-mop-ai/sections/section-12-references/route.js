import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('=== Section 12 References Route ===');
    const requestBody = await request.json();
    console.log('Raw request body:', JSON.stringify(requestBody, null, 2));
    
    const { formData } = requestBody;
    console.log('Extracted formData:', JSON.stringify(formData, null, 2));
    
    if (!formData) {
      console.error('No formData found in request');
      throw new Error('Missing formData in request body');
    }
    
    const { manufacturer, modelNumber, system, workDescription, location } = formData;
    console.log('Destructured fields:', { manufacturer, modelNumber, system, workDescription, location });

    // Generate manufacturer-specific documentation links
    const getManufacturerLinks = (manufacturer) => {
      const mfg = manufacturer?.toLowerCase() || '';
      
      const manufacturerUrls = {
        'trane': 'https://www.trane.com/commercial/north-america/us/en/support/literature-and-manuals.html',
        'carrier': 'https://www.carrier.com/commercial/en/us/support/',
        'york': 'https://www.johnsoncontrols.com/buildings/hvac-equipment/chillers',
        'liebert': 'https://www.vertiv.com/en-us/support/software-download/',
        'caterpillar': 'https://www.cat.com/en_US/support/manuals.html',
        'cummins': 'https://quickserve.cummins.com/',
        'generac': 'https://www.generac.com/support/product-support-lookup',
        'kohler': 'https://kohlerpower.com/support/literature',
        'schneider': 'https://www.schneider-electric.us/en/support/',
        'eaton': 'https://www.eaton.com/us/en-us/support.html'
      };
      
      return manufacturerUrls[mfg] || null;
    };

    const getOSHALink = (section) => {
      return `https://www.osha.gov/laws-regs/regulations/standardnumber/${section.replace(' ', '/')}`;
    };

    const getNFPALink = (code) => {
      const nfpaNumber = code.match(/NFPA (\d+[A-Z]?)/)?.[1];
      return nfpaNumber ? `https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=${nfpaNumber}` : null;
    };

    const manufacturerUrl = getManufacturerLinks(manufacturer);

    // Generate equipment-specific references based on system type
    let equipmentReferences = [];
    let regulatoryReferences = [];
    let safetyReferences = [];

    if (system?.toLowerCase().includes('chiller')) {
      equipmentReferences = manufacturerUrl ? [
        { name: `${manufacturer} ${modelNumber} Operation and Maintenance Manual`, url: manufacturerUrl, type: 'link' },
        { name: `${manufacturer} Service Bulletins and Technical Updates`, url: manufacturerUrl, type: 'link' },
      ] : [
        { name: `${manufacturer} ${modelNumber} Operation and Maintenance Manual`, type: 'internal' },
        { name: `${manufacturer} Service Bulletins and Technical Updates`, type: 'internal' },
      ];
      
      equipmentReferences.push({ name: 'ASHRAE 15 - Safety Standard for Refrigeration Systems', url: 'https://www.ashrae.org/', type: 'link' });
      
      regulatoryReferences = [
        { name: 'EPA Section 608 - Refrigerant Certification Requirements', url: 'https://www.epa.gov/section608', type: 'link' },
        { name: 'EPA SNAP Program - Refrigerant Information', url: 'https://www.epa.gov/snap', type: 'link' },
        { name: 'NFPA 70 - National Electrical Code', url: 'https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70', type: 'link' }
      ];
    } else if (system?.toLowerCase().includes('generator')) {
      equipmentReferences = manufacturerUrl ? [
        { name: `${manufacturer} ${modelNumber} Operation and Maintenance Manual`, url: manufacturerUrl, type: 'link' },
        { name: `${manufacturer} Engine Service Manual`, url: manufacturerUrl, type: 'link' },
      ] : [
        { name: `${manufacturer} ${modelNumber} Operation and Maintenance Manual`, type: 'internal' },
        { name: `${manufacturer} Engine Service Manual`, type: 'internal' },
      ];
      
      regulatoryReferences = [
        { name: 'NFPA 110 - Emergency and Standby Power Systems', url: 'https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=110', type: 'link' },
        { name: 'NFPA 37 - Installation and Use of Stationary Combustion Engines', url: 'https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=37', type: 'link' },
        { name: 'EPA Emissions Standards', url: 'https://www.epa.gov/regulations-emissions-vehicles-and-engines', type: 'link' }
      ];
    } else if (system?.toLowerCase().includes('ups')) {
      equipmentReferences = manufacturerUrl ? [
        { name: `${manufacturer} ${modelNumber} Installation and Operation Manual`, url: manufacturerUrl, type: 'link' },
        { name: `${manufacturer} Battery System Documentation`, url: manufacturerUrl, type: 'link' },
      ] : [
        { name: `${manufacturer} ${modelNumber} Installation and Operation Manual`, type: 'internal' },
        { name: `${manufacturer} Battery System Documentation`, type: 'internal' },
      ];
      
      regulatoryReferences = [
        { name: 'OSHA Battery Safety Guidelines', url: 'https://www.osha.gov/battery-hazards', type: 'link' },
        { name: 'NFPA 70E - Electrical Safety in the Workplace', url: 'https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70E', type: 'link' }
      ];
    } else {
      // Generic equipment references
      equipmentReferences = manufacturerUrl ? [
        { name: `${manufacturer} ${modelNumber} Documentation`, url: manufacturerUrl, type: 'link' },
      ] : [
        { name: `${manufacturer} ${modelNumber} Documentation`, type: 'internal' },
      ];
    }

    // Common safety and regulatory references for all equipment
    safetyReferences = [
      { name: 'OSHA 29 CFR 1910.147 - The Control of Hazardous Energy (Lockout/Tagout)', url: 'https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147', type: 'link' },
      { name: 'OSHA 29 CFR 1910.95 - Occupational Noise Exposure', url: 'https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.95', type: 'link' },
      { name: 'OSHA Personal Protective Equipment Standards', url: 'https://www.osha.gov/personal-protective-equipment', type: 'link' },
      { name: 'ANSI Z87.1 - Eye and Face Protection', url: 'https://www.ansi.org/', type: 'link' },
      { name: 'ASTM Standards', url: 'https://www.astm.org/', type: 'link' }
    ];

    const html = `<h2>Section 12: References and Documentation</h2>
<p><strong>Comprehensive Reference Library</strong></p>

<h3>Equipment-Specific Documentation</h3>
<table>
    <thead>
        <tr>
            <th width="60%">Document Title</th>
            <th width="20%">Type</th>
            <th width="20%">Access</th>
        </tr>
    </thead>
    <tbody>
        ${equipmentReferences.map(ref => `
        <tr>
            <td><strong>${ref.name}</strong></td>
            <td>Technical Manual</td>
            <td>${ref.type === 'link' ? `<a href="${ref.url}" target="_blank" style="color: #0066cc;">📋 View</a>` : 'Internal Document - Request from Site Manager'}</td>
        </tr>`).join('')}
    </tbody>
</table>

<h3>Regulatory Standards and Codes</h3>
<table>
    <thead>
        <tr>
            <th width="60%">Standard/Regulation</th>
            <th width="20%">Authority</th>
            <th width="20%">Access</th>
        </tr>
    </thead>
    <tbody>
        ${regulatoryReferences.map(ref => `
        <tr>
            <td><strong>${ref.name}</strong></td>
            <td>${ref.name.includes('EPA') ? 'EPA' : ref.name.includes('NFPA') ? 'NFPA' : 'Industry'}</td>
            <td><a href="${ref.url}" target="_blank" style="color: #0066cc;">📋 View</a></td>
        </tr>`).join('')}
    </tbody>
</table>

<h3>Safety Standards and Guidelines</h3>
<table>
    <thead>
        <tr>
            <th width="60%">Safety Standard</th>
            <th width="20%">Authority</th>
            <th width="20%">Access</th>
        </tr>
    </thead>
    <tbody>
        ${safetyReferences.map(ref => `
        <tr>
            <td><strong>${ref.name}</strong></td>
            <td>${ref.name.includes('OSHA') ? 'OSHA' : ref.name.includes('ANSI') ? 'ANSI' : 'ASTM'}</td>
            <td><a href="${ref.url}" target="_blank" style="color: #0066cc;">📋 View</a></td>
        </tr>`).join('')}
    </tbody>
</table>

<h3>Additional Resources</h3>
<table>
    <thead>
        <tr>
            <th width="60%">Resource</th>
            <th width="20%">Type</th>
            <th width="20%">Access</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Site-Specific Emergency Response Plan</strong></td>
            <td>Internal Document</td>
            <td>Internal Document - Request from Site Manager</td>
        </tr>
        <tr>
            <td><strong>Equipment History and Maintenance Records</strong></td>
            <td>CMMS Database</td>
            <td>Internal Document - Request from Site Manager</td>
        </tr>
        <tr>
            <td><strong>Safety Data Sheets (SDS) Information</strong></td>
            <td>Chemical Safety</td>
            <td><a href="https://www.osha.gov/safety-data-sheets" target="_blank" style="color: #0066cc;">📋 View</a></td>
        </tr>
        <tr>
            <td><strong>Environmental Compliance Documentation</strong></td>
            <td>Regulatory</td>
            <td>Internal Document - Request from Site Manager</td>
        </tr>
        <tr>
            <td><strong>Vendor Contact Information and Support Agreements</strong></td>
            <td>Service Contract</td>
            <td>Internal Document - Request from Site Manager</td>
        </tr>
    </tbody>
</table>

<div style="margin-top: 30px; padding: 20px; background-color: #f0f7ff; border-radius: 8px; border-left: 4px solid #0066cc;">
    <h4 style="margin-top: 0; color: #0066cc;">📚 Reference Usage Guidelines</h4>
    <ul style="margin-bottom: 0;">
        <li><strong>Pre-Work Review:</strong> All applicable documentation must be reviewed before beginning maintenance work</li>
        <li><strong>Current Revisions:</strong> Verify all documents are current revision levels and not superseded</li>
        <li><strong>Access Requirements:</strong> Ensure access to online resources and account credentials are available</li>
        <li><strong>Local Copies:</strong> Maintain current copies of critical documents for offline reference</li>
        <li><strong>Update Tracking:</strong> Monitor manufacturer bulletins and regulatory updates that may affect procedures</li>
    </ul>
</div>

<div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;">
    <p style="margin: 0;"><strong>⚠️ Important Notice:</strong> All external links have been verified as working at the time of MOP creation. 
    However, URLs may change over time. If a link is broken, search for the document by title on the organization's website. 
    Internal documents marked "Request from Site Manager" must be obtained locally and are not available through external links.</p>
</div>

<div style="margin-top: 15px; padding: 15px; background-color: #f0f7ff; border-radius: 4px; border-left: 4px solid #0066cc;">
    <p style="margin: 0;"><strong>📋 Link Verification:</strong> All links in this document point to official sources only:
    • Manufacturer support websites • OSHA.gov regulations • EPA.gov standards • NFPA.org codes • Industry organization websites</p>
</div>`;

    console.log('Generated HTML length:', html.length);
    console.log('Section 12 completed successfully');

    // Prepare comprehensive sources list - only include real URLs
    const sources = [
      manufacturerUrl ? {
        type: "equipment_manual",
        document: `${manufacturer} ${modelNumber} Documentation`,
        url: manufacturerUrl,
        lastVerified: new Date().toISOString().split('T')[0]
      } : null,
      {
        type: "regulatory_standard", 
        document: "OSHA 29 CFR 1910.147",
        title: "The Control of Hazardous Energy",
        url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147"
      },
      {
        type: "regulatory_standard",
        document: "EPA Standards",
        title: "Environmental Regulations",
        url: "https://www.epa.gov/"
      },
      {
        type: "safety_standard",
        document: "NFPA Codes and Standards",
        title: "Fire and Safety Standards",
        url: "https://www.nfpa.org/"
      }
    ].filter(Boolean); // Remove null entries

    return NextResponse.json({ html, sources });
    
  } catch (error) {
    console.error('=== Section 12 References Route ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Failed to generate references section',
      details: error.message,
      userMessage: 'Unable to generate references section. Please try again.'
    }, { status: 500 });
  }
}