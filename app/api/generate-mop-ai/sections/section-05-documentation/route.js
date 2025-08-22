import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const { manufacturer, modelNumber, system, workDescription } = formData;
    
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
      const nfpaNumber = code.match(/NFPA (\d+)/)?.[1];
      return nfpaNumber ? `https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=${nfpaNumber}` : null;
    };

    // Determine relevant documentation based on equipment type
    let manufacturerDoc = `${manufacturer} ${system || 'Equipment'} Operation and Maintenance Manual`;
    let manufacturerUrl = getManufacturerLinks(manufacturer);
    let nfpaStandards = [];
    let additionalDocs = [];
    
    if (system.toLowerCase().includes('chiller')) {
      nfpaStandards = [
        { name: 'NFPA 70 - National Electrical Code', url: 'https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70' }
      ];
      additionalDocs = [
        { name: 'EPA 608 Certification Requirements', url: 'https://www.epa.gov/section608' },
        { name: 'EPA SNAP Program - Refrigerant Information', url: 'https://www.epa.gov/snap' }
      ];
    } else if (system.toLowerCase().includes('generator')) {
      nfpaStandards = [
        { name: 'NFPA 110 - Emergency and Standby Power Systems', url: 'https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=110' },
        { name: 'NFPA 70 - National Electrical Code', url: 'https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70' }
      ];
      additionalDocs = [
        { name: 'EPA Diesel Engine Regulations', url: 'https://www.epa.gov/regulations-emissions-vehicles-and-engines/regulations-emissions-nonroad-vehicles-and-engines' }
      ];
    } else if (system.toLowerCase().includes('ups')) {
      nfpaStandards = [
        { name: 'NFPA 70E - Electrical Safety in the Workplace', url: 'https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70E' }
      ];
      additionalDocs = [
        { name: 'OSHA Battery Safety Guidelines', url: 'https://www.osha.gov/battery-hazards' }
      ];
    }

    const html = `<h2>Section 05: MOP Supporting Documentation</h2>
<p><strong>MOP Supporting Documentation</strong></p>

<h3>Manufacturer Documentation</h3>
<ul>
    ${manufacturerUrl ? `<li><a href="${manufacturerUrl}" target="_blank">${manufacturerDoc}</a></li>` : `<li>${manufacturerDoc} - Contact manufacturer for documentation</li>`}
    ${manufacturerUrl ? `<li><a href="${manufacturerUrl}" target="_blank">${manufacturer} Service Bulletins and Technical Updates</a></li>` : `<li>${manufacturer} Service Bulletins - Contact manufacturer</li>`}
    ${manufacturerUrl ? `<li><a href="${manufacturerUrl}" target="_blank">${manufacturer} Parts and Service Support</a></li>` : `<li>${manufacturer} Parts and Service Support - Contact manufacturer</li>`}
</ul>

<h3>Regulatory Standards</h3>
<ul>
    <li><a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147" target="_blank">OSHA 29 CFR 1910.147 - The Control of Hazardous Energy (Lockout/Tagout)</a></li>
    <li><a href="https://www.osha.gov/personal-protective-equipment" target="_blank">OSHA Personal Protective Equipment Standards</a></li>
    <li><a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.95" target="_blank">OSHA 29 CFR 1910.95 - Occupational Noise Exposure</a></li>
    ${nfpaStandards.map(standard => `<li><a href="${standard.url}" target="_blank">${standard.name}</a></li>`).join('\n    ')}
</ul>

<h3>Technical References</h3>
<ul>
    ${additionalDocs.map(doc => `<li><a href="${doc.url}" target="_blank">${doc.name}</a></li>`).join('\n    ')}
    <li>Site-Specific Emergency Response Plan - Available on-site</li>
    <li>Equipment History and Previous Maintenance Records - Available in CMMS</li>
    <li><a href="https://www.osha.gov/safety-data-sheets" target="_blank">OSHA Safety Data Sheets Information</a></li>
</ul>

<div style="margin-top: 20px; padding: 15px; background-color: #f0f7ff; border-radius: 4px;">
    <strong>Note:</strong> All personnel must review applicable documentation before beginning work. 
    Verify current revision levels of manufacturer manuals and regulatory standards. 
    Links provided are current as of MOP creation date.
</div>`;

    const sources = [{
      type: "regulatory_standard",
      document: "OSHA 29 CFR 1910.147",
      title: "The Control of Hazardous Energy",
      url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147"
    }];

    return NextResponse.json({ html, sources });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}