// Direct function exports for all MOP section generation
// This allows compile route to call sections directly without HTTP calls

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { getEquipmentData, getCompressorCount } from '@/lib/mop-knowledge/enhanced-equipment-database';
import { ENHANCED_PPE_REQUIREMENTS } from '@/lib/mop-knowledge/enhanced-safety-standards';
import { getRelevantEOPs } from '@/lib/mop-knowledge/eop-references';
import { SourceManager } from '@/lib/mop-knowledge/source-manager';

// Import the already-extracted AI section functions
export { generateSection06 } from './section-06-safety/route.js';
export { generateSection07 } from './section-07-risks/route.js';
export { generateSection08 } from './section-08-procedures/route.js';
export { generateSection11 } from './section-11-comments/route.js';

// Section 01: Schedule
export async function generateSection01(formData) {
  try {
    console.log('=== Section 01 Schedule Generation ===');
    console.log('FormData:', JSON.stringify(formData, null, 2));
    
    const { manufacturer, system, category, frequency } = formData;
    
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    
    const equipmentType = system && system.includes('Chiller') ? 'CHILLER' : 
                         system && system.includes('Generator') ? 'GENERATOR' :
                         system && system.includes('UPS') ? 'UPS' : 
                         system ? system.toUpperCase() : 'EQUIPMENT';
    
    const title = `${(manufacturer || 'UNKNOWN').toUpperCase()} ${equipmentType} - ${(category || 'MAINTENANCE').toUpperCase()}`;

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
        <td>MOP Version:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Version Number" style="width:150px" /></td>
    </tr>
    <tr>
        <td>Work Date(s):</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Scheduled Date(s)" style="width:250px" /></td>
    </tr>
    <tr>
        <td>Implementation Time:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Start Time" style="width:150px" /> to <input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - End Time" style="width:150px" /></td>
    </tr>
    <tr>
        <td>Service Window:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - X hours" style="width:150px" /></td>
    </tr>
    <tr>
        <td>Maintenance Type:</td>
        <td>${(frequency || 'ROUTINE').toUpperCase()} ${(category || 'MAINTENANCE').toUpperCase()}</td>
    </tr>
    <tr>
        <td>Criticality:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Normal/Emergency" style="width:150px" /></td>
    </tr>
</table>`;

    console.log('Section 01 completed successfully');
    return { html, sources: [] };
    
  } catch (error) {
    console.error('Section 01 generation error:', error);
    throw error;
  }
}

// Section 02: Site
export async function generateSection02(formData) {
  try {
    console.log('=== Section 02 Site Generation ===');
    const { location, manufacturer, modelNumber, address } = formData;
    
    const html = `<h2>Section 02: Site Information</h2>
<table class="info-table">
    <tr>
        <td>Site/Building Name:</td>
        <td>${location || '<input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Site Name" style="width:300px" />'}</td>
    </tr>
    <tr>
        <td>Site Address:</td>
        <td>${address?.street || '<input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Street Address" style="width:400px" />'}<br>
            ${address?.city || 'City'}, ${address?.state || 'State'} ${address?.zipCode || 'ZIP'}</td>
    </tr>
    <tr>
        <td>Equipment Location:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Floor/Room Number" style="width:300px" /></td>
    </tr>
    <tr>
        <td>Equipment Make/Model:</td>
        <td>${manufacturer || 'Equipment'} ${modelNumber || ''}</td>
    </tr>
    <tr>
        <td>Serial Number(s):</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Serial Number" style="width:300px" /></td>
    </tr>
    <tr>
        <td>Asset Tag:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Asset Tag Number" style="width:200px" /></td>
    </tr>
    <tr>
        <td>Site Contact:</td>
        <td>
            Name: <input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Contact Name" style="width:250px" /><br>
            Phone: <input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Phone" style="width:150px" /><br>
            Email: <input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Email" style="width:250px" />
        </td>
    </tr>
    <tr>
        <td>Access Requirements:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Badge/Key/Escort Required" style="width:400px" /></td>
    </tr>
</table>`;

    console.log('Section 02 completed successfully');
    return { html, sources: [] };
    
  } catch (error) {
    console.error('Section 02 generation error:', error);
    throw error;
  }
}

// Section 03: Overview
export async function generateSection03(formData) {
  try {
    console.log('=== Section 03 Overview Generation ===');
    const { manufacturer, modelNumber, system, workDescription, category } = formData;
    
    const purpose = workDescription || category || 'maintenance';
    
    const html = `<h2>Section 03: MOP Overview</h2>
<h3>Objective</h3>
<p>This Method of Procedure (MOP) provides detailed instructions for performing ${purpose.toLowerCase()} on the ${manufacturer || 'equipment'} ${modelNumber || ''} ${system || 'system'}.</p>

<h3>Scope of Work</h3>
<ul>
    <li>Equipment: ${manufacturer || 'Equipment'} ${modelNumber || 'Model'} ${system || 'System'}</li>
    <li>Work Type: ${(category || 'Maintenance').toUpperCase()}</li>
    <li>Description: ${workDescription || 'Routine maintenance and inspection'}</li>
    <li>Duration: <input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Estimated hours" style="width:100px" /> hours</li>
    <li>Personnel Required: <input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Number of technicians" style="width:50px" /> technician(s)</li>
</ul>

<h3>Expected Outcomes</h3>
<ul>
    <li>Equipment restored to optimal operating condition</li>
    <li>All preventive maintenance tasks completed per manufacturer specifications</li>
    <li>Equipment performance verified within acceptable parameters</li>
    <li>All safety and operational checks passed</li>
    <li>Documentation of all work performed and findings</li>
</ul>

<h3>Critical Requirements</h3>
<ul>
    <li>Qualified personnel with ${manufacturer || 'equipment'} certification/training</li>
    <li>All required tools and test equipment available and calibrated</li>
    <li>Replacement parts and consumables on hand</li>
    <li>Proper safety equipment and PPE</li>
    <li>Approved maintenance window and work permit</li>
</ul>`;

    console.log('Section 03 completed successfully');
    return { html, sources: [] };
    
  } catch (error) {
    console.error('Section 03 generation error:', error);
    throw error;
  }
}

// Section 04: Facility
export async function generateSection04(formData) {
  try {
    console.log('=== Section 04 Facility Generation ===');
    const { system, location } = formData;
    
    const html = `<h2>Section 04: Facility Information</h2>
<h3>Critical Infrastructure Dependencies</h3>
<table>
    <thead>
        <tr>
            <th>System</th>
            <th>Impact if Offline</th>
            <th>Redundancy Available</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Primary Power</td>
            <td>Critical</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Yes/No" style="width:80px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Notes" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Backup Power (UPS/Generator)</td>
            <td>Critical</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Yes/No" style="width:80px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Runtime available" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Cooling System</td>
            <td>Critical</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Yes/No" style="width:80px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Redundant units" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Building Management System</td>
            <td>Moderate</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Yes/No" style="width:80px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Manual override available" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Fire Suppression</td>
            <td>Critical</td>
            <td>N/A</td>
            <td>Must remain active during maintenance</td>
        </tr>
    </tbody>
</table>

<h3>Affected Areas</h3>
<table>
    <thead>
        <tr>
            <th>Area/Room</th>
            <th>Equipment Supported</th>
            <th>Impact During Maintenance</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Area name" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Equipment list" style="width:250px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Impact description" style="width:250px" /></td>
        </tr>
        <tr>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Area name" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Equipment list" style="width:250px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Impact description" style="width:250px" /></td>
        </tr>
    </tbody>
</table>

<h3>Special Considerations</h3>
<ul>
    <li>Site Access: <input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Access requirements" style="width:400px" /></li>
    <li>Environmental Conditions: <input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Temperature/humidity requirements" style="width:400px" /></li>
    <li>Noise Restrictions: <input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Any noise limitations" style="width:400px" /></li>
    <li>Working Hours: <input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Permitted work hours" style="width:400px" /></li>
</ul>`;

    console.log('Section 04 completed successfully');
    return { html, sources: [] };
    
  } catch (error) {
    console.error('Section 04 generation error:', error);
    throw error;
  }
}

// Section 05: Documentation
export async function generateSection05(formData) {
  try {
    console.log('=== Section 05 Documentation Generation ===');
    const { manufacturer, modelNumber } = formData;
    
    const html = `<h2>Section 05: Required Documentation</h2>
<h3>Pre-Work Documentation</h3>
<table>
    <thead>
        <tr>
            <th>Document</th>
            <th>Required</th>
            <th>Verified</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Work Permit/Authorization</td>
            <td>Yes</td>
            <td><input type="checkbox" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Permit number" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Equipment Service Manual</td>
            <td>Yes</td>
            <td><input type="checkbox" /></td>
            <td>${manufacturer || 'Manufacturer'} ${modelNumber || 'Model'} Service Documentation</td>
        </tr>
        <tr>
            <td>Site Electrical Drawings</td>
            <td>Yes</td>
            <td><input type="checkbox" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Drawing numbers" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Previous Maintenance Records</td>
            <td>Yes</td>
            <td><input type="checkbox" /></td>
            <td>Last 3 maintenance reports</td>
        </tr>
        <tr>
            <td>Emergency Procedures</td>
            <td>Yes</td>
            <td><input type="checkbox" /></td>
            <td>Site-specific emergency response plan</td>
        </tr>
        <tr>
            <td>LOTO Procedures</td>
            <td>Yes</td>
            <td><input type="checkbox" /></td>
            <td>Site LOTO policy and tags</td>
        </tr>
        <tr>
            <td>Risk Assessment</td>
            <td>Yes</td>
            <td><input type="checkbox" /></td>
            <td>Job safety analysis completed</td>
        </tr>
    </tbody>
</table>

<h3>Reference Documents</h3>
<ul>
    <li>${manufacturer || 'Manufacturer'} ${modelNumber || 'Model'} Installation Manual</li>
    <li>${manufacturer || 'Manufacturer'} ${modelNumber || 'Model'} Operation Manual</li>
    <li>${manufacturer || 'Manufacturer'} Service Bulletins (if applicable)</li>
    <li>Site Standard Operating Procedures (SOPs)</li>
    <li>Site Emergency Operating Procedures (EOPs)</li>
    <li>OSHA Safety Standards (29 CFR 1910)</li>
    <li>NFPA 70E - Electrical Safety Standards</li>
    <li>Local Building Codes and Regulations</li>
</ul>

<h3>Post-Work Documentation Requirements</h3>
<table>
    <thead>
        <tr>
            <th>Document</th>
            <th>Responsibility</th>
            <th>Due Date</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Completed MOP with all data recorded</td>
            <td>Lead Technician</td>
            <td>End of work</td>
        </tr>
        <tr>
            <td>Equipment Test Reports</td>
            <td>Lead Technician</td>
            <td>Within 24 hours</td>
        </tr>
        <tr>
            <td>Updated Equipment Log</td>
            <td>Facility Manager</td>
            <td>Within 48 hours</td>
        </tr>
        <tr>
            <td>Warranty Documentation Updates</td>
            <td>Facility Manager</td>
            <td>Within 1 week</td>
        </tr>
        <tr>
            <td>Lessons Learned (if applicable)</td>
            <td>Team Lead</td>
            <td>Within 1 week</td>
        </tr>
    </tbody>
</table>`;

    console.log('Section 05 completed successfully');
    return { html, sources: [] };
    
  } catch (error) {
    console.error('Section 05 generation error:', error);
    throw error;
  }
}

// Section 09: Backout
export async function generateSection09(formData) {
  try {
    console.log('=== Section 09 Backout Generation ===');
    const { system, manufacturer } = formData;
    
    const html = `<h2>Section 09: Backout/Recovery Plan</h2>
<h3>Backout Criteria</h3>
<p>Initiate backout procedures if any of the following conditions occur:</p>
<ul>
    <li>Unable to restore equipment to operational status within maintenance window</li>
    <li>Discovery of critical component failure requiring parts not on hand</li>
    <li>Safety hazard that cannot be immediately mitigated</li>
    <li>Loss of redundant system during maintenance</li>
    <li>Environmental conditions exceed safe operating limits</li>
    <li>Direction from site management or emergency response team</li>
</ul>

<h3>Backout Procedures</h3>
<table>
    <thead>
        <tr>
            <th>Step</th>
            <th>Action</th>
            <th>Responsible</th>
            <th>Time Est.</th>
            <th>Complete</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td><strong>STOP all work immediately</strong> and secure the work area</td>
            <td>All Personnel</td>
            <td>Immediate</td>
            <td><input type="checkbox" /></td>
        </tr>
        <tr>
            <td>2</td>
            <td>Notify site management and stakeholders of backout initiation</td>
            <td>Team Lead</td>
            <td>5 min</td>
            <td><input type="checkbox" /></td>
        </tr>
        <tr>
            <td>3</td>
            <td>Document current equipment status and work completed</td>
            <td>Lead Tech</td>
            <td>10 min</td>
            <td><input type="checkbox" /></td>
        </tr>
        <tr>
            <td>4</td>
            <td>Reinstall any removed components (if safe to do so)</td>
            <td>Tech Team</td>
            <td>30 min</td>
            <td><input type="checkbox" /></td>
        </tr>
        <tr>
            <td>5</td>
            <td>Restore all electrical connections to original configuration</td>
            <td>Electrician</td>
            <td>20 min</td>
            <td><input type="checkbox" /></td>
        </tr>
        <tr>
            <td>6</td>
            <td>Verify all safety devices are operational</td>
            <td>Lead Tech</td>
            <td>15 min</td>
            <td><input type="checkbox" /></td>
        </tr>
        <tr>
            <td>7</td>
            <td>Remove LOTO and restore power to equipment</td>
            <td>Authorized Person</td>
            <td>10 min</td>
            <td><input type="checkbox" /></td>
        </tr>
        <tr>
            <td>8</td>
            <td>Perform equipment startup sequence</td>
            <td>Lead Tech</td>
            <td>15 min</td>
            <td><input type="checkbox" /></td>
        </tr>
        <tr>
            <td>9</td>
            <td>Verify equipment operation and all alarms cleared</td>
            <td>Lead Tech</td>
            <td>15 min</td>
            <td><input type="checkbox" /></td>
        </tr>
        <tr>
            <td>10</td>
            <td>Transfer to normal operation mode</td>
            <td>Operations</td>
            <td>10 min</td>
            <td><input type="checkbox" /></td>
        </tr>
        <tr>
            <td>11</td>
            <td>Complete backout documentation and lessons learned</td>
            <td>Team Lead</td>
            <td>30 min</td>
            <td><input type="checkbox" /></td>
        </tr>
    </tbody>
</table>

<h3>Emergency Contacts for Backout Support</h3>
<table>
    <thead>
        <tr>
            <th>Role</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Alternate</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Site Manager</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
        </tr>
        <tr>
            <td>Chief Engineer</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
        </tr>
        <tr>
            <td>${manufacturer || 'Manufacturer'} Support</td>
            <td>Technical Support</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td>24/7 Hotline</td>
        </tr>
    </tbody>
</table>

<h3>Post-Backout Requirements</h3>
<ul>
    <li>Root cause analysis to be completed within 48 hours</li>
    <li>Revised MOP to be created addressing issues encountered</li>
    <li>Parts/tools procurement for future attempt</li>
    <li>Additional training if skill gap identified</li>
    <li>Stakeholder communication on rescheduling</li>
</ul>`;

    console.log('Section 09 completed successfully');
    return { html, sources: [] };
    
  } catch (error) {
    console.error('Section 09 generation error:', error);
    throw error;
  }
}

// Section 10: Approval
export async function generateSection10(formData) {
  try {
    console.log('=== Section 10 Approval Generation ===');
    
    const html = `<h2>Section 10: Review and Approval</h2>
<h3>MOP Review Checklist</h3>
<table>
    <thead>
        <tr>
            <th>Review Item</th>
            <th>Verified</th>
            <th>Reviewer Initials</th>
            <th>Comments</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>All sections complete and accurate</td>
            <td><input type="checkbox" /></td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Safety requirements identified</td>
            <td><input type="checkbox" /></td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Risk assessment complete</td>
            <td><input type="checkbox" /></td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Backout plan adequate</td>
            <td><input type="checkbox" /></td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Resource requirements confirmed</td>
            <td><input type="checkbox" /></td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Schedule conflicts resolved</td>
            <td><input type="checkbox" /></td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" style="width:200px" /></td>
        </tr>
    </tbody>
</table>

<h3>Approval Signatures</h3>
<table>
    <thead>
        <tr>
            <th>Role</th>
            <th>Name (Print)</th>
            <th>Signature</th>
            <th>Date</th>
            <th>Time</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>MOP Author</strong></td>
            <td><input type="text" class="contractor-input" placeholder="Print name" /></td>
            <td><input type="text" class="contractor-input" placeholder="Signature" /></td>
            <td><input type="text" class="small-input" style="width:100px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Technical Reviewer</strong></td>
            <td><input type="text" class="contractor-input" placeholder="Print name" /></td>
            <td><input type="text" class="contractor-input" placeholder="Signature" /></td>
            <td><input type="text" class="small-input" style="width:100px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Safety Officer</strong></td>
            <td><input type="text" class="contractor-input" placeholder="Print name" /></td>
            <td><input type="text" class="contractor-input" placeholder="Signature" /></td>
            <td><input type="text" class="small-input" style="width:100px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Facility Manager</strong></td>
            <td><input type="text" class="contractor-input" placeholder="Print name" /></td>
            <td><input type="text" class="contractor-input" placeholder="Signature" /></td>
            <td><input type="text" class="small-input" style="width:100px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Site Manager</strong></td>
            <td><input type="text" class="contractor-input" placeholder="Print name" /></td>
            <td><input type="text" class="contractor-input" placeholder="Signature" /></td>
            <td><input type="text" class="small-input" style="width:100px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Customer Representative</strong></td>
            <td><input type="text" class="contractor-input" placeholder="Print name" /></td>
            <td><input type="text" class="contractor-input" placeholder="Signature" /></td>
            <td><input type="text" class="small-input" style="width:100px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
    </tbody>
</table>

<h3>Work Execution Sign-off</h3>
<table>
    <thead>
        <tr>
            <th>Milestone</th>
            <th>Completed By</th>
            <th>Date/Time</th>
            <th>Verified By</th>
            <th>Date/Time</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Pre-work safety briefing</td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
        </tr>
        <tr>
            <td>Work commenced</td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
        </tr>
        <tr>
            <td>Work completed</td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
        </tr>
        <tr>
            <td>System tested and operational</td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
        </tr>
        <tr>
            <td>Site returned to normal</td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" style="width:150px" /></td>
        </tr>
    </tbody>
</table>`;

    console.log('Section 10 completed successfully');
    return { html, sources: [] };
    
  } catch (error) {
    console.error('Section 10 generation error:', error);
    throw error;
  }
}

// Section 12: References
export async function generateSection12(formData) {
  try {
    console.log('=== Section 12 References Generation ===');
    const { manufacturer, modelNumber } = formData;
    
    const html = `<h2>Section 12: References and Resources</h2>
<h3>Technical References</h3>
<ul>
    <li>${manufacturer || 'Manufacturer'} ${modelNumber || 'Model'} Installation Manual</li>
    <li>${manufacturer || 'Manufacturer'} ${modelNumber || 'Model'} Operation & Maintenance Manual</li>
    <li>${manufacturer || 'Manufacturer'} ${modelNumber || 'Model'} Troubleshooting Guide</li>
    <li>${manufacturer || 'Manufacturer'} Technical Service Bulletins</li>
    <li>${manufacturer || 'Manufacturer'} Recommended Spare Parts List</li>
</ul>

<h3>Industry Standards and Codes</h3>
<ul>
    <li>ASHRAE Guidelines - HVAC Systems Operation and Maintenance</li>
    <li>NFPA 70 - National Electrical Code (NEC)</li>
    <li>NFPA 70E - Standard for Electrical Safety in the Workplace</li>
    <li>OSHA 29 CFR 1910 - Occupational Safety and Health Standards</li>
    <li>OSHA 29 CFR 1910.147 - The Control of Hazardous Energy (Lockout/Tagout)</li>
    <li>EPA 608 - Refrigerant Management Regulations</li>
    <li>IEEE Standards for Electrical Equipment</li>
    <li>ISA Standards for Instrumentation</li>
</ul>

<h3>Site-Specific Documentation</h3>
<ul>
    <li>Site Standard Operating Procedures (SOPs)</li>
    <li>Site Emergency Operating Procedures (EOPs)</li>
    <li>Site Safety Manual</li>
    <li>Site Electrical Single-Line Diagrams</li>
    <li>Site Mechanical P&ID Drawings</li>
    <li>Building Management System (BMS) Documentation</li>
    <li>Previous Maintenance Reports and History</li>
</ul>

<h3>Contact Information</h3>
<table>
    <thead>
        <tr>
            <th>Resource</th>
            <th>Contact</th>
            <th>Phone</th>
            <th>Email/Website</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>${manufacturer || 'Manufacturer'} Technical Support</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Parts Supplier</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Calibration Services</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:200px" /></td>
        </tr>
        <tr>
            <td>Emergency Service Provider</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:200px" /></td>
        </tr>
    </tbody>
</table>

<h3>Training and Certification Requirements</h3>
<ul>
    <li>${manufacturer || 'Manufacturer'} Factory Training Certification</li>
    <li>OSHA 10/30 Hour Safety Training</li>
    <li>NFPA 70E Electrical Safety Training</li>
    <li>EPA 608 Universal Certification (for refrigerant handling)</li>
    <li>Site-Specific Safety Orientation</li>
    <li>Confined Space Entry Certification (if applicable)</li>
    <li>Fall Protection Training (if applicable)</li>
</ul>

<h3>Revision History</h3>
<table>
    <thead>
        <tr>
            <th>Version</th>
            <th>Date</th>
            <th>Author</th>
            <th>Description of Changes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1.0</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
            <td>Initial MOP creation</td>
        </tr>
    </tbody>
</table>`;

    console.log('Section 12 completed successfully');
    return { html, sources: [] };
    
  } catch (error) {
    console.error('Section 12 generation error:', error);
    throw error;
  }
}