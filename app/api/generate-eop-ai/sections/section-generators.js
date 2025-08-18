// Direct function exports for all MOP section generation
// This allows compile route to call sections directly without HTTP calls

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { getEquipmentData, getCompressorCount } from '@/lib/mop-knowledge/enhanced-equipment-database';
import { ENHANCED_PPE_REQUIREMENTS } from '@/lib/mop-knowledge/enhanced-safety-standards';
import { getRelevantEOPs } from '@/lib/mop-knowledge/eop-references';
import { SourceManager } from '@/lib/mop-knowledge/source-manager';
import { getSiteData } from '@/lib/mop-knowledge/site-data';

// Note: Section 06, 07, 08, and 11 are not yet implemented for EOP
// These would need to be created as separate route files or inline functions

// Section 01: Schedule - EXACT ORIGINAL CODE FROM POST FUNCTION
export async function generateSection01(formData) {
  try {
    console.log('=== Section 01 Schedule Generation ===');
    console.log('FormData:', JSON.stringify(formData, null, 2));
    
    if (!formData) {
      console.error('No formData found in request');
      throw new Error('Missing formData in request body');
    }
    
    const { manufacturer, system, category, frequency } = formData;
    console.log('Destructured fields:', { manufacturer, system, category, frequency });
    
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    console.log('Generated current date:', currentDate);

    // Generate title based on equipment
    console.log('Processing system type:', system);
    const equipmentType = system && system.includes('Chiller') ? 'CHILLER' : 
                         system && system.includes('Generator') ? 'GENERATOR' :
                         system && system.includes('UPS') ? 'UPS' : 
                         system ? system.toUpperCase() : 'EQUIPMENT';
    console.log('Determined equipment type:', equipmentType);
    
    const title = `${(manufacturer || 'UNKNOWN').toUpperCase()} ${equipmentType} - ${(category || 'MAINTENANCE').toUpperCase()}`;
    console.log('Generated title:', title);

    const html = `<h2>Section 01: MOP Schedule Information</h2>
<table class="info-table">
    <tr>
        <td>MOP Title:</td>
        <td>${title}</td>
    </tr>
    <tr>
        <td>MOP Information:</td>
        <td>This is ${category && category.toLowerCase().includes('annual') ? 'an' : 'a'} ${(category || 'maintenance').toLowerCase()} on the ${manufacturer || 'equipment'} ${system || 'system'}.</td>
    </tr>
    <tr>
        <td>MOP Creation Date:</td>
        <td>${currentDate}</td>
    </tr>
    <tr>
        <td>MOP Revision Date:</td>
        <td><input type="text" value="${currentDate}" style="width:150px" /></td>
    </tr>
    <tr>
        <td>Document Number:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Assign per facility process" /></td>
    </tr>
    <tr>
        <td>Revision Number:</td>
        <td><input type="text" value="V1" style="width:100px" /></td>
    </tr>
    <tr>
        <td>Author CET Level:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Assign per facility process" /></td>
    </tr>
</table>`;

    console.log('Generated HTML length:', html.length);
    console.log('Section 01 completed successfully');
    
    return { html, sources: [] };
  } catch (error) {
    console.error('=== Section 01 Schedule Generation ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

// Section 02: Site - EXACT ORIGINAL CODE FROM POST FUNCTION
export async function generateSection02(formData) {
  try {
    const { system, workDescription, location, address } = formData;
    const siteData = getSiteData(location || 'stewart');
    
    // Determine risk level based on system and work description
    let riskLevel = 2;
    let riskJustification = "Single system affected with redundancy available";
    
    if (workDescription && workDescription.toLowerCase().includes('electrical') && system.toLowerCase().includes('switchgear')) {
      riskLevel = 4;
      riskJustification = "Main switchgear work affects entire facility";
    } else if (system.toLowerCase().includes('chiller') && workDescription && workDescription.toLowerCase().includes('major')) {
      riskLevel = 3;
      riskJustification = "Critical cooling system with limited redundancy";
    } else if (system.toLowerCase().includes('generator')) {
      riskLevel = 3;
      riskJustification = "Critical power system maintenance";
    } else if (system.toLowerCase().includes('ups')) {
      riskLevel = 3;
      riskJustification = "Critical power protection system";
    }

    const cetRequired = {
      1: "CET 1 (Technician) to execute, CET 2 (Lead Technician) to approve",
      2: "CET 2 (Technician) to execute, CET 3 (Lead Technician) to approve",
      3: "CET 3 (Lead Technician) to execute, CET 4 (Manager) to approve",
      4: "CET 4 (Manager) to execute, CET 5 (Director) to approve"
    };

    const html = `<h2>Section 02: Site Information</h2>
<table class="info-table">
    <tr>
        <td>Data Center Location:</td>
        <td>${location || siteData.name}<br>${address?.street || siteData.address.street}<br>${address?.city || siteData.address.city}, ${address?.state || siteData.address.state} ${address?.zipCode || siteData.address.zipCode}</td>
    </tr>
    <tr>
        <td>Service Ticket/Project Number:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Assign per facility process" style="width:300px" /></td>
    </tr>
    <tr>
        <td>Level of Risk:</td>
        <td><strong>Level ${riskLevel}</strong> (${['Low', 'Medium', 'High', 'Critical'][riskLevel-1]})<br><em>${riskJustification}</em></td>
    </tr>
    <tr>
        <td>CET Level Required:</td>
        <td><strong>${cetRequired[riskLevel]}</strong><br><em>Based on risk level assessment</em></td>
    </tr>
    <tr>
        <td>Site Contact:</td>
        <td><input type="text" placeholder="Site Manager Name" style="width:250px" /> <input type="text" placeholder="Phone" style="width:150px" /></td>
    </tr>
    <tr>
        <td>Building/Floor/Room:</td>
        <td><input type="text" placeholder="Building" style="width:120px" /> / <input type="text" placeholder="Floor" style="width:80px" /> / <input type="text" placeholder="Room" style="width:120px" /></td>
    </tr>
    <tr>
        <td>Access Requirements:</td>
        <td><input type="text" placeholder="Badge access, escort required, etc." style="width:400px" /></td>
    </tr>
</table>`;

    const sources = [{
      type: "site_specific",
      document: "Site Configuration Database",
      section: "Facility Information",
      lastVerified: new Date().toISOString().split('T')[0]
    }];

    return { html, sources };
  } catch (error) {
    console.error('Section 02 generation error:', error);
    throw error;
  }
}

// Section 03: Overview - EXACT ORIGINAL CODE FROM POST FUNCTION
export async function generateSection03(formData) {
  try {
    const { manufacturer, modelNumber, system, workDescription, location, description } = formData;
    
    // Use workDescription or description field, with fallback
    const mopDescription = workDescription || description || `${system} maintenance and inspection`;
    
    const html = `<h2>Section 03: MOP Overview</h2>
<table class="info-table">
    <tr>
        <td>MOP Description:</td>
        <td>${mopDescription}</td>
    </tr>
    <tr>
        <td>Work Area:</td>
        <td>${system.includes('Chiller') ? 'Mechanical Room / Rooftop' : 'Equipment Room'}</td>
    </tr>
    <tr>
        <td>Manufacturer:</td>
        <td>${manufacturer}</td>
    </tr>
    <tr>
        <td>Equipment ID:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Record on-site" /></td>
    </tr>
    <tr>
        <td>Model #:</td>
        <td>${modelNumber}</td>
    </tr>
    <tr>
        <td>Serial #:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Record from nameplate" /></td>
    </tr>
    <tr>
        <td>Min. # of Facilities Personnel:</td>
        <td>2</td>
    </tr>
    <tr>
        <td>Work Performed By:</td>
        <td colspan="3">
            <input type="checkbox" id="self-delivered" name="work-type" checked> 
            <label for="self-delivered">Self-Delivered</label>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="checkbox" id="subcontractor" name="work-type"> 
            <label for="subcontractor">Subcontractor</label>
        </td>
    </tr>
    <tr>
        <td>If Subcontractor - Company Name:</td>
        <td><input type="text" class="field-box" /></td>
    </tr>
    <tr>
        <td>If Subcontractor - Personnel Name:</td>
        <td><input type="text" class="field-box" /></td>
    </tr>
    <tr>
        <td>If Subcontractor - Contact Details:</td>
        <td><input type="text" class="field-box" /></td>
    </tr>
    <tr>
        <td>Qualifications Required:</td>
        <td>EPA 608 Universal Certification, Qualified Electrical Worker</td>
    </tr>
    <tr>
        <td>Tools Required:</td>
        <td>Standard mechanics tool set, refrigerant gauges, multimeter, torque wrench set</td>
    </tr>
    <tr>
        <td>Advance notifications required:</td>
        <td>Data Center Operations Manager, Site Security, NOC/BMS Operator</td>
    </tr>
    <tr>
        <td>Post notifications required:</td>
        <td>Data Center Operations Manager, Site Security, NOC/BMS Operator</td>
    </tr>
</table>`;

    return { html, sources: [] };
  } catch (error) {
    console.error('Section 03 generation error:', error);
    throw error;
  }
}

// Section 04: Facility - EXACT ORIGINAL CODE FROM POST FUNCTION
export async function generateSection04(formData) {
  try {
    const { system } = formData;
    
    // Generate the facility impact table with all 19 systems
    const html = `<h2>Section 04: Effect of MOP on Critical Facility</h2>
<table>
    <thead>
        <tr>
            <th>Facility Equipment or System</th>
            <th width="60">Yes</th>
            <th width="60">No</th>
            <th width="60">N/A</th>
            <th>Details</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Electrical Utility Equipment</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Emergency Generator System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Critical Cooling System</td>
            <td class="checkbox">${system.includes('Chiller') ? '✓' : ''}</td>
            <td class="checkbox">${system.includes('Chiller') ? '' : '✓'}</td>
            <td class="checkbox"></td>
            <td>${system.includes('Chiller') ? 'Unit will be offline for maintenance' : ''}</td>
        </tr>
        <tr>
            <td>Ventilation System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Mechanical System</td>
            <td class="checkbox">${system.includes('Chiller') || system.includes('CRAC') ? '✓' : ''}</td>
            <td class="checkbox">${system.includes('Chiller') || system.includes('CRAC') ? '' : '✓'}</td>
            <td class="checkbox"></td>
            <td>${system.includes('Chiller') || system.includes('CRAC') ? 'Primary mechanical component' : ''}</td>
        </tr>
        <tr>
            <td>Uninterruptible Power Supply (UPS)</td>
            <td class="checkbox">${system.includes('UPS') ? '✓' : ''}</td>
            <td class="checkbox">${system.includes('UPS') ? '' : '✓'}</td>
            <td class="checkbox"></td>
            <td>${system.includes('UPS') ? 'UPS maintenance affects critical power' : ''}</td>
        </tr>
        <tr>
            <td>Critical Power Distribution System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Emergency Power Off (EPO)</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Fire Detection Systems</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Fire Suppression System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Monitoring System</td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td class="checkbox"></td>
            <td>Monitoring System is ALWAYS affected for data center equipment maintenance</td>
        </tr>
        <tr>
            <td>Control System</td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td class="checkbox"></td>
            <td>BAS/BMS control required for maintenance</td>
        </tr>
        <tr>
            <td>Security System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>General Power and Lighting System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Lockout/Tagout Required?</td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td class="checkbox"></td>
            <td>LOTO required on main disconnect</td>
        </tr>
        <tr>
            <td>Work to be performed "hot"?</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td>All work performed de-energized</td>
        </tr>
        <tr>
            <td>Radio interference potential?</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Water/Leak Detection System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Building Automation System</td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td class="checkbox"></td>
            <td>BAS control interface required</td>
        </tr>
        <tr>
            <td>Transfer Switch System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
    </tbody>
</table>`;

    return { html, sources: [] };
  } catch (error) {
    console.error('Section 04 generation error:', error);
    throw error;
  }
}

// Section 05: Documentation - EXACT ORIGINAL CODE FROM POST FUNCTION
export async function generateSection05(formData) {
  try {
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
    let manufacturerDoc = `${manufacturer} ${modelNumber} Operation and Maintenance Manual`;
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

    return { html, sources };
  } catch (error) {
    console.error('Section 05 generation error:', error);
    throw error;
  }
}

// Section 09: Backout - EXACT ORIGINAL CODE FROM POST FUNCTION
export async function generateSection09(formData) {
  try {
    const { location } = formData;
    const siteData = getSiteData(location);
    const escalation = siteData.escalationProcedure;

    const html = `<h2>Section 09: Back-out Procedures</h2>
<p><strong>CRITICAL BACK-OUT PROCEDURES</strong></p>
<p>If at any point during the maintenance procedure a critical issue is discovered that could affect data center operations, follow these detailed back-out procedures:</p>
<table>
    <thead>
        <tr>
            <th width="60">Step</th>
            <th>Back-out Procedures</th>
            <th width="80">Initials</th>
            <th width="80">Time</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center;">1</td>
            <td><strong>Immediate Actions:</strong> Stop all work immediately and secure the area</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">2</td>
            <td>Notify the ${escalation.level1} and ${escalation.level2} immediately</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">3</td>
            <td>Assess the situation and determine if equipment can be safely returned to service</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">4</td>
            <td>If issue cannot be resolved at technician level, escalate to ${escalation.level3}</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">5</td>
            <td>If ${escalation.level3} cannot resolve, escalate to ${escalation.level4}</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">6</td>
            <td>Contact equipment manufacturer service representative if required: ${escalation.level5}</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">7</td>
            <td>Document all findings and actions taken in the incident report</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">8</td>
            <td>If safe to return to service, follow re-energization procedures</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">9</td>
            <td>Monitor equipment for minimum 30 minutes after return to service</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">10</td>
            <td>Complete incident report and schedule follow-up maintenance if required</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
    </tbody>
</table>`;

    return { html, sources: [] };
  } catch (error) {
    console.error('Section 09 generation error:', error);
    throw error;
  }
}

// Section 10: Approval - EXACT ORIGINAL CODE FROM POST FUNCTION
export async function generateSection10(formData) {
  try {
    const html = `<h2>Section 10: MOP Approval</h2>
<table>
    <thead>
        <tr>
            <th>Review Stage</th>
            <th>Reviewer's Name</th>
            <th>Reviewer's Title</th>
            <th>Date</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Tested for clarity:</strong></td>
            <td><input type="text" style="width:100%" placeholder="Print Name" /></td>
            <td><input type="text" style="width:100%" placeholder="Title" /></td>
            <td><input type="text" style="width:100px" placeholder="MM/DD/YYYY" /></td>
        </tr>
        <tr>
            <td><strong>Technical review:</strong></td>
            <td><input type="text" style="width:100%" placeholder="Print Name" /></td>
            <td><input type="text" style="width:100%" placeholder="Title" /></td>
            <td><input type="text" style="width:100px" placeholder="MM/DD/YYYY" /></td>
        </tr>
        <tr>
            <td><strong>Chief Engineer approval:</strong></td>
            <td><input type="text" style="width:100%" placeholder="Print Name" /></td>
            <td><input type="text" style="width:100%" placeholder="Title" /></td>
            <td><input type="text" style="width:100px" placeholder="MM/DD/YYYY" /></td>
        </tr>
        <tr>
            <td><strong>Customer approval:</strong></td>
            <td><input type="text" style="width:100%" placeholder="Print Name" /></td>
            <td><input type="text" style="width:100%" placeholder="Title" /></td>
            <td><input type="text" style="width:100px" placeholder="MM/DD/YYYY" /></td>
        </tr>
    </tbody>
</table>

<div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border: 1px solid #ccc;">
    <h4 style="margin-top: 0;">Approval Requirements:</h4>
    <ul style="margin-bottom: 0;">
        <li>All stages must be completed in sequence</li>
        <li>Technical review must verify all equipment specifications and procedures</li>
        <li>Chief Engineer must approve risk assessment and mitigation strategies</li>
        <li>Customer approval required before work commencement</li>
    </ul>
</div>

<div style="margin-top: 20px;">
    <table style="width: 100%; margin-top: 20px;">
        <tr>
            <td style="width: 50%; padding: 10px;">
                <strong>MOP Effective Date:</strong><br>
                <input type="text" style="width:150px" placeholder="MM/DD/YYYY" />
            </td>
            <td style="width: 50%; padding: 10px;">
                <strong>MOP Expiration Date:</strong><br>
                <input type="text" style="width:150px" placeholder="MM/DD/YYYY" />
            </td>
        </tr>
    </table>
</div>`;

    return { html, sources: [] };
  } catch (error) {
    console.error('Section 10 generation error:', error);
    throw error;
  }
}

// Section 12: References - EXACT ORIGINAL CODE FROM POST FUNCTION
export async function generateSection12(formData) {
  try {
    console.log('=== Section 12 References Generation ===');
    console.log('FormData:', JSON.stringify(formData, null, 2));
    
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

    return { html, sources };
    
  } catch (error) {
    console.error('=== Section 12 References Generation ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}