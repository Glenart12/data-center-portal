import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { enhancePromptWithSearchResults } from '@/lib/eop-generation/search-enhancement-adapter';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper Functions for Intelligent SOP Generation

// Determine if task is intrusive or non-intrusive
function determineTaskType(workDescription) {
  const nonIntrusiveKeywords = [
    'daily', 'check', 'observation', 'monitoring', 'visual', 
    'reading', 'BMS', 'review', 'log', 'record', 'inspect visually',
    'routine inspection', 'parameter recording', 'control panel'
  ];
  
  const intrusiveKeywords = [
    'maintenance', 'repair', 'replace', 'isolation', 'LOTO', 
    'shutdown', 'startup', 'gauge', 'connect', 'open panel', 
    'service', 'clean', 'test', 'calibrate', 'adjust', 'install',
    'remove', 'drain', 'fill', 'torque', 'measure resistance'
  ];
  
  const lowerDesc = workDescription.toLowerCase();
  
  // Check for intrusive indicators first (higher priority)
  for (const keyword of intrusiveKeywords) {
    if (lowerDesc.includes(keyword)) return 'intrusive';
  }
  
  // Then check for non-intrusive
  for (const keyword of nonIntrusiveKeywords) {
    if (lowerDesc.includes(keyword)) return 'non-intrusive';
  }
  
  return 'intrusive'; // Default to intrusive for safety
}

// Determine personnel required based on task type
function calculatePersonnelRequired(taskType, isSubcontractor) {
  let basePersonnel = taskType === 'non-intrusive' ? 1 : 2;
  let escortRequired = isSubcontractor ? 1 : 0;
  
  return {
    facilities: basePersonnel,
    escort: escortRequired,
    total: basePersonnel + escortRequired
  };
}

// Generate PPE requirements based on task type and system
function generatePPE(taskType, systemType, workDescription) {
  const basePPE = [
    { item: 'Safety Glasses', spec: 'ANSI Z87.1 compliant', when: 'Always in mechanical rooms' },
    { item: 'Steel-Toe Safety Boots', spec: 'ANSI Z41 PT99 compliant', when: 'Always in mechanical rooms' }
  ];
  
  const lowerSystem = systemType.toLowerCase();
  const lowerDesc = workDescription.toLowerCase();
  
  if (taskType === 'non-intrusive') {
    // Minimal PPE for observation only
    basePPE.push(
      { item: 'Hearing Protection', spec: 'NRR 25 dB earplugs/muffs', when: 'If prolonged exposure near operating equipment' }
    );
    // NO GLOVES for control panel only work
  } else {
    // Full PPE for intrusive work
    basePPE.push(
      { item: 'Work Gloves', spec: 'Cut-resistant, chemical-resistant', when: 'When handling tools or equipment' },
      { item: 'Hearing Protection', spec: 'NRR 25 dB or higher', when: 'When working near operating equipment' }
    );
    
    // Add electrical PPE if needed
    if (lowerSystem.includes('electrical') || lowerSystem.includes('ups') || 
        lowerSystem.includes('switchgear') || lowerDesc.includes('electrical')) {
      basePPE.push(
        { item: 'Arc Flash PPE', spec: 'Category 2 minimum', when: 'When working on electrical systems' },
        { item: 'Insulated Gloves', spec: 'Class 0 voltage rated', when: 'When working on live electrical components' }
      );
    }
    
    // Add refrigerant PPE if needed
    if (lowerSystem.includes('chiller') || lowerSystem.includes('crac') || 
        lowerSystem.includes('cooling') || lowerDesc.includes('refrigerant')) {
      basePPE.push(
        { item: 'Chemical Gloves', spec: 'Nitrile or neoprene', when: 'When handling refrigerants' },
        { item: 'Safety Goggles', spec: 'Chemical splash protection', when: 'When working with refrigerant systems' }
      );
    }
  }
  
  return basePPE;
}

// Generate required tools based on task type and manufacturer
function generateRequiredTools(taskType, manufacturer, systemType, personnelCount) {
  const tools = [];
  const lowerSystem = systemType.toLowerCase();
  
  if (taskType === 'non-intrusive') {
    // Minimal tools for observation/reading only
    tools.push(
      { tool: 'Flashlight/Headlamp', spec: 'High-lumen LED', available: true },
      { tool: 'Clipboard and Pen', spec: 'For recording readings', available: true }
    );
    
    // Add communication device if single person
    if (personnelCount === 1) {
      tools.push({ tool: 'Site Radio/Communication Device', spec: 'Two-way radio or mobile phone', available: true });
    }
    
    // Controller access based on manufacturer
    if (manufacturer.toLowerCase().includes('carrier')) {
      tools.push({ tool: 'ComfortLINK™ Access', spec: 'Operator password (no physical key required)', available: true });
    } else if (manufacturer.toLowerCase().includes('trane')) {
      tools.push({ tool: 'Tracer™ SC+ Access', spec: 'Login credentials required', available: true });
    } else if (manufacturer.toLowerCase().includes('york')) {
      tools.push({ tool: 'YorkTalk™ Access', spec: 'Operator login credentials', available: true });
    } else if (manufacturer.toLowerCase().includes('liebert')) {
      tools.push({ tool: 'iCOM™ Access', spec: 'Display panel access code', available: true });
    } else {
      tools.push({ tool: 'BMS/Control Panel Access', spec: 'Login credentials required', available: true });
    }
    // DO NOT include: Infrared Thermometer, Multimeter, Manifold Gauges, Hand tools for non-intrusive
    
  } else {
    // Full tool set for intrusive work
    tools.push(
      { tool: 'Digital Multimeter', spec: 'CAT III 1000V rated', available: true },
      { tool: 'Basic Hand Tools', spec: 'Screwdrivers, wrenches, pliers', available: true },
      { tool: 'Flashlight/Headlamp', spec: 'High-lumen LED', available: true }
    );
    
    // Add HVAC specific tools
    if (lowerSystem.includes('chiller') || lowerSystem.includes('crac') || 
        lowerSystem.includes('cooling') || lowerSystem.includes('hvac')) {
      tools.push(
        { tool: 'HVAC Manifold Gauge Set', spec: 'For refrigerant type in system', available: true },
        { tool: 'Infrared Thermometer', spec: '-50°F to 1000°F range', available: true },
        { tool: 'Refrigerant Recovery Equipment', spec: 'EPA certified', available: false }
      );
    }
    
    // Add electrical tools
    if (lowerSystem.includes('electrical') || lowerSystem.includes('ups') || 
        lowerSystem.includes('switchgear') || lowerSystem.includes('pdu')) {
      tools.push(
        { tool: 'LOTO Kit', spec: 'Locks, tags, and verification device', available: true },
        { tool: 'Voltage Detector', spec: 'Non-contact voltage tester', available: true },
        { tool: 'Insulated Tools', spec: '1000V rated tool set', available: true }
      );
    }
    
    // Add generator specific tools
    if (lowerSystem.includes('generator')) {
      tools.push(
        { tool: 'Coolant Hydrometer', spec: 'For coolant testing', available: true },
        { tool: 'Battery Hydrometer', spec: 'For battery specific gravity', available: true },
        { tool: 'Fuel Sample Kit', spec: 'For fuel quality testing', available: false }
      );
    }
  }
  
  return tools;
}

// Generate site-specific hazards based on task type and equipment
function generateHazards(taskType, equipmentType, workDescription) {
  const hazards = [];
  const lowerEquip = equipmentType.toLowerCase();
  const lowerDesc = workDescription.toLowerCase();
  
  // Always present hazards (area hazards)
  hazards.push(
    { type: 'Rotating Machinery', desc: 'Compressors, pumps, fans operating', control: 'Keep clear of moving parts, maintain safe distance' },
    { type: 'Hot Surfaces', desc: 'Discharge lines, motor surfaces >140°F', control: 'No direct contact, use IR thermometer for readings' },
    { type: 'Noise Exposure', desc: 'Operating equipment >85 dB', control: 'Wear hearing protection when required' },
    { type: 'Slips/Trips/Falls', desc: 'Wet floors, equipment bases, raised platforms', control: 'Watch for hazards, clean spills immediately' }
  );
  
  // Only add these for intrusive work
  if (taskType === 'intrusive') {
    hazards.push(
      { type: 'Electrical Shock', desc: '480V/208V electrical systems', control: 'Follow LOTO procedures, verify zero energy' },
      { type: 'Pressurized Systems', desc: 'Refrigerant lines (300+ PSI)', control: 'Depressurize before opening, wear PPE' },
      { type: 'Chemical Exposure', desc: 'Refrigerants, oils, treatment chemicals', control: 'Use appropriate PPE, ensure ventilation' }
    );
    
    // Add confined space if applicable
    if (lowerDesc.includes('tank') || lowerDesc.includes('vessel') || lowerDesc.includes('confined')) {
      hazards.push(
        { type: 'Confined Space', desc: 'Limited entry/exit, potential atmosphere hazards', control: 'Follow confined space procedures, use gas monitor' }
      );
    }
  }
  
  // Equipment-specific hazards
  if (lowerEquip.includes('chiller')) {
    hazards.push(
      { type: 'Refrigerant Release', desc: 'R-134a/R-410A under pressure', control: 'Monitor for leaks, ensure ventilation' }
    );
  }
  
  if (lowerEquip.includes('generator')) {
    hazards.push(
      { type: 'Carbon Monoxide', desc: 'Exhaust gases in enclosed space', control: 'Ensure proper ventilation, use CO monitor' },
      { type: 'Fuel Hazards', desc: 'Diesel fuel - flammable', control: 'No ignition sources, spill containment ready' }
    );
  }
  
  return hazards;
}

// Generate back-out procedures based on task type
function generateBackoutProcedures(taskType, systemType) {
  const lowerSystem = systemType.toLowerCase();
  
  if (taskType === 'non-intrusive') {
    return [
      { 
        condition: 'Active alarms present on control panel',
        action: 'Document alarm codes and descriptions, notify Operations Manager, do not attempt to clear',
        verification: 'Screenshot or photo of alarm panel taken',
        required: 'Escalation to Operations Manager within 15 minutes'
      },
      {
        condition: 'Abnormal readings outside expected ranges',
        action: 'Verify readings twice, document values with timestamp, escalate to Lead Technician',
        verification: 'Readings documented in SOP form',
        required: 'Lead Tech notification if >20% deviation from normal'
      },
      {
        condition: 'Unusual noise, vibration, or odor detected',
        action: 'Mark specific location, secure area if safety concern, notify Operations immediately',
        verification: 'Area marked and documented',
        required: 'Immediate notification if safety concern'
      },
      {
        condition: 'Visible leaks or damage observed',
        action: 'Document location/severity with photos, place drip containment if safe, notify Operations',
        verification: 'Photos taken and containment placed',
        required: 'Operations notified for repair scheduling'
      },
      {
        condition: 'Unable to access BMS or control panel',
        action: 'Check credentials, verify network connectivity, contact IT support if needed',
        verification: 'Access attempt documented',
        required: 'IT ticket submitted if access issue persists'
      }
    ];
  } else {
    // Intrusive work back-out procedures
    const procedures = [
      {
        condition: 'System fails to start after maintenance',
        action: 'Check all connections, verify control settings, review alarm history',
        verification: 'All connections verified secure',
        required: 'Escalate to manufacturer support if needed'
      },
      {
        condition: 'Abnormal vibration or noise after service',
        action: 'Stop equipment immediately, check mounting and alignment',
        verification: 'Equipment stopped safely',
        required: 'Do not restart until issue resolved'
      },
      {
        condition: 'Refrigerant leak detected during service',
        action: 'Isolate section, evacuate area if major, begin recovery procedures',
        verification: 'Area evacuated and ventilated',
        required: 'Environmental spill response if >10 lbs'
      },
      {
        condition: 'Electrical fault or arc flash',
        action: 'De-energize immediately, assess personnel, initiate emergency response',
        verification: 'Power secured at main disconnect',
        required: 'Call 911 if injuries, notify Safety Officer'
      }
    ];
    
    // Add system-specific procedures
    if (lowerSystem.includes('ups')) {
      procedures.push({
        condition: 'UPS fails to transfer to bypass',
        action: 'Initiate manual bypass procedure, notify critical load customers',
        verification: 'Manual bypass engaged successfully',
        required: 'Customer notification within 5 minutes'
      });
    }
    
    return procedures;
  }
}

const SOP_INSTRUCTIONS = `
You are an expert data center operations engineer creating a Standard Operating Procedure (SOP) document.
Generate a comprehensive, professional SOP document in HTML format with ALL 12 sections listed below.

IMPORTANT: You must generate EQUIPMENT-SPECIFIC procedures based on the exact manufacturer and model provided.
Do NOT generate generic procedures. All steps, safety requirements, and technical details must be specific to the equipment.

HEADER FORMAT (At the very top of document):
- Title: Standard Operating Procedure (SOP)
- Use green color (#198754) for the SOP header

CRITICAL: You MUST include ALL 12 sections in order:
- Section 01: SOP Schedule Information
- Section 02: Site Information
- Section 03: SOP Overview
- Section 04: Effect of SOP on Critical Facility
- Section 05: SOP Supporting Documentation
- Section 06: Safety Requirements
- Section 07: SOP Risks & Assumptions
- Section 08: SOP Details
- Section 09: Back-out Procedures
- Section 10: SOP Approval
- Section 11: SOP Completion
- Section 12: Comments

SECTION-BY-SECTION REQUIREMENTS:

Section 01: SOP Schedule Information
- SOP Identifier: Generate unique ID (e.g., SOP-[SYSTEM]-[DATE]-[NUMBER])
- Procedure Title: Clear, descriptive title including manufacturer and model
- Duration: AUTO-CALCULATE based on task complexity:
  * Daily checks: 30-45 minutes
  * Weekly maintenance: 1-2 hours
  * Monthly maintenance: 2-4 hours
  * Quarterly/Annual: 4-8 hours
- Level of Risk (LOR): Calculate using exact same logic as MOP generation:
  * Level 1 (Low): Routine non-intrusive checks
  * Level 2 (Medium): Standard maintenance with redundancy
  * Level 3 (High): Work on critical systems (UPS, generators, chillers)
  * Level 4 (Critical): Work on single points of failure or switchgear
- Author: <input type="text" placeholder="Enter Author Name" style="border: 1px solid #999; padding: 2px; width: 200px;">
- Date: ${new Date().toLocaleDateString('en-US')} (today's date)
- Version: <input type="text" value="1.0" style="border: 1px solid #999; padding: 2px; width: 80px;">
- CET Level Required to Perform Task: AUTO-POPULATE based on Level of Risk (LOR)
- Author CET Level: <input type="text" placeholder="Author CET Level" style="border: 1px solid #999; padding: 2px; width: 100px;">
- Frequency: Based on the procedure type provided

Section 02: Site Information
- Customer: [Customer name from form]
- Site Name: [Site name from form - REQUIRED field]
- Site Address: [Full site address or UPDATE NEEDED]
DO NOT include Customer Address

Section 03: SOP Overview
MUST format EXACTLY as:
<h2>Section 03: SOP Overview</h2>
<table class="info-table">
  <tr><td>Work Area:</td><td>[Work area or Data Hall 1]</td></tr>
  <tr><td>Affected Systems:</td><td>[Affected systems or Cooling System]</td></tr>
  <tr>
    <td>Work Performed By:</td>
    <td>
      <input type="checkbox" id="self-delivered" name="work-type"> 
      <label for="self-delivered">Self-Delivered</label>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <input type="checkbox" id="subcontractor" name="work-type"> 
      <label for="subcontractor">Subcontractor</label>
    </td>
  </tr>
  <tr><td>If Subcontractor - Company Name:</td><td><input type="text" placeholder="Enter company name" style="border: 1px solid #999; padding: 2px; width: 250px;"></td></tr>
  <tr><td>If Subcontractor - Personnel Name:</td><td><input type="text" placeholder="Enter personnel name" style="border: 1px solid #999; padding: 2px; width: 250px;"></td></tr>
  <tr><td>If Subcontractor - Contact Details:</td><td><input type="text" placeholder="Enter contact details" style="border: 1px solid #999; padding: 2px; width: 250px;"></td></tr>
  <tr><td>Qualifications Required:</td><td>[AUTO-POPULATED based on equipment and task - DO NOT use form data]</td></tr>
</table>
<h3>Equipment Information:</h3>
<table class="info-table">
  <tr><td>Manufacturer:</td><td>[Manufacturer from form]</td></tr>
  <tr><td>Model #:</td><td>[Model number from form]</td></tr>
  <tr><td>Serial #:</td><td>[Serial number or UPDATE NEEDED]</td></tr>
</table>
<h3>Personnel Required:</h3>
<table class="info-table">
  <tr><td># of Facilities Personnel:</td><td><input type="text" value="[DYNAMIC based on task type]" style="border: 1px solid #999; padding: 2px; width: 50px;"></td></tr>
  <tr><td># of Contractors #1:</td><td><input type="text" value="0" style="border: 1px solid #999; padding: 2px; width: 50px;"></td></tr>
  <tr><td># of Contractors #2:</td><td><input type="text" value="0" style="border: 1px solid #999; padding: 2px; width: 50px;"></td></tr>
  <tr><td># of Customers:</td><td><input type="text" value="0" style="border: 1px solid #999; padding: 2px; width: 50px;"></td></tr>
  <tr><td>Note:</td><td>[Add note if task is non-intrusive about single technician]</td></tr>
</table>

Section 04: Effect of SOP on Critical Facility
Create table with EXACTLY these 15 systems and columns:
| Facility Equipment or System | Yes | No | N/A | Details |
Include these 15 systems exactly:
1. Cooling System
2. Electrical System
3. UPS System
4. Generator System
5. Fire Protection
6. BMS/EPMS
7. Security System
8. Network Infrastructure
9. Water/Plumbing
10. Access Control
11. VESDA/Smoke Detection
12. Fuel System
13. Emergency Lighting
14. HVAC Controls
15. Communication Systems

Section 05: SOP Supporting Documentation
Based on LOR value calculated in Section 01:
- LOR 1 (Low): "Basic operating procedure reference guide"
- LOR 2 (Medium): Add "Equipment safety data sheets"
- LOR 3 (High): Add "Equipment O&M manuals, electrical diagrams"
- LOR 4 (Critical): Add "Complete documentation package including OEM manuals, as-builts, commissioning reports"

Section 06: Safety Requirements
<h3>REQUIRED PERSONAL PROTECTIVE EQUIPMENT (PPE)</h3>
<table>
  <tr>
    <th>PPE Category</th>
    <th>Specification</th>
    <th>When Required</th>
  </tr>
  <tr>
    <td>Safety Glasses</td>
    <td>ANSI Z87.1 compliant</td>
    <td>Always in mechanical rooms</td>
  </tr>
  <!-- Add equipment-specific PPE based on manufacturer and model -->
</table>

<h3>Required Tools & Test Equipment for [Manufacturer] [Model]:</h3>
<table>
  <tr>
    <th>Tool/Equipment</th>
    <th>Specific Model/Type for [Model Number]</th>
    <th>Available</th>
  </tr>
  <!-- Generate equipment-specific tools -->
</table>

<h3>EMERGENCY CONTACTS</h3>
<table>
  <tr>
    <th>Emergency Type</th>
    <th>Contact</th>
    <th>Phone Number</th>
  </tr>
  <tr>
    <td>Fire/Medical/Police</td>
    <td>Emergency Services</td>
    <td>911</td>
  </tr>
  <tr>
    <td>Site Operations Manager</td>
    <td><input type="text" placeholder="Name" style="border: 1px solid #999; padding: 2px;"></td>
    <td><input type="text" placeholder="Phone" style="border: 1px solid #999; padding: 2px;"></td>
  </tr>
  <tr>
    <td>Facility Manager</td>
    <td><input type="text" placeholder="Name" style="border: 1px solid #999; padding: 2px;"></td>
    <td><input type="text" placeholder="Phone" style="border: 1px solid #999; padding: 2px;"></td>
  </tr>
  <tr>
    <td>Lead Technician On-Call</td>
    <td><input type="text" placeholder="Name" style="border: 1px solid #999; padding: 2px;"></td>
    <td><input type="text" placeholder="Phone" style="border: 1px solid #999; padding: 2px;"></td>
  </tr>
  <tr>
    <td>HVAC Service Provider</td>
    <td><input type="text" placeholder="Company" style="border: 1px solid #999; padding: 2px;"></td>
    <td><input type="text" placeholder="Phone" style="border: 1px solid #999; padding: 2px;"></td>
  </tr>
  <tr>
    <td>Electrical Contractor</td>
    <td><input type="text" placeholder="Company" style="border: 1px solid #999; padding: 2px;"></td>
    <td><input type="text" placeholder="Phone" style="border: 1px solid #999; padding: 2px;"></td>
  </tr>
  <tr>
    <td>Environmental Spill Response</td>
    <td><input type="text" placeholder="Company" style="border: 1px solid #999; padding: 2px;"></td>
    <td><input type="text" placeholder="Phone" style="border: 1px solid #999; padding: 2px;"></td>
  </tr>
  <tr>
    <td>Customer NOC</td>
    <td><input type="text" placeholder="Name" style="border: 1px solid #999; padding: 2px;"></td>
    <td><input type="text" placeholder="Phone" style="border: 1px solid #999; padding: 2px;"></td>
  </tr>
  <!-- Add manufacturer-specific support if applicable -->
</table>

<h3>Site-Specific Hazards</h3>
<table>
  <tr>
    <th>Hazard Type</th>
    <th>Description</th>
    <th>Control Measures</th>
  </tr>
  <!-- Generate equipment-specific hazards -->
</table>

Section 07: SOP Risks & Assumptions
<h3>System Redundancy Assessment</h3>
<table class="info-table">
  <tr>
    <td>System Redundancy Level:</td>
    <td>
      <select style="border: 1px solid #999; padding: 2px;">
        <option>Unknown</option>
        <option>None</option>
        <option>N+1</option>
        <option>N+2</option>
        <option>2N</option>
      </select>
    </td>
  </tr>
  <tr><td>Total Units in System:</td><td><input type="text" placeholder="e.g., 4" style="border: 1px solid #999; padding: 2px; width: 50px;"></td></tr>
  <tr><td>Units Required for Full Load:</td><td><input type="text" placeholder="e.g., 3" style="border: 1px solid #999; padding: 2px; width: 50px;"></td></tr>
  <tr>
    <td>Impact if This Unit Fails:</td>
    <td>
      <select style="border: 1px solid #999; padding: 2px; width: 350px;">
        <option>No immediate impact (redundancy available)</option>
        <option>Reduced redundancy but load maintained</option>
        <option>Partial load loss possible</option>
        <option>Critical load loss likely</option>
      </select>
    </td>
  </tr>
</table>

<h3>Risk Analysis Matrix</h3>
<table>
  <tr>
    <th>Risk Category</th>
    <th>Description</th>
    <th>Likelihood</th>
    <th>Impact</th>
    <th>Mitigation Strategy</th>
  </tr>
  <!-- Generate risks based on equipment and task -->
</table>

<h3>Key Project Assumptions</h3>
<table>
  <tr>
    <th>Category</th>
    <th>Assumption</th>
  </tr>
  <tr>
    <td>Equipment Status</td>
    <td>[Manufacturer] [Model] is operational</td>
  </tr>
  <!-- Add more assumptions -->
</table>

<h3>Critical Decision Points</h3>
<!-- List critical decision points -->

Section 08: SOP Details
Convert ALL subsections to table format:
<h3>8.1 Pre-Procedure Checks</h3>
<table>
  <tr>
    <th>Step</th>
    <th>Description</th>
    <th>Expected Result</th>
    <th>Actual Result</th>
    <th>Action if Not Met</th>
    <th style="width: 60px;">Initials</th>
    <th style="width: 80px;">Time</th>
  </tr>
  <!-- For each row, format as:
  <tr>
    <td>1</td>
    <td>[Description]</td>
    <td>[Expected Result]</td>
    <td><input type="text" style="width: 95%; border: 1px solid #999; padding: 2px;"></td>
    <td>[Action if Not Met]</td>
    <td><input type="text" style="width: 95%; border: 1px solid #999; padding: 2px;"></td>
    <td><input type="text" style="width: 95%; border: 1px solid #999; padding: 2px;"></td>
  </tr>
  -->
</table>

<h3>8.2 Detailed Procedure Steps</h3>
<table>
  <tr>
    <th>Step</th>
    <th>Description</th>
    <th>Expected Range</th>
    <th>Source</th>
    <th>Recorded Value</th>
    <th>Action if Out of Range</th>
    <th style="width: 60px;">Initials</th>
    <th style="width: 80px;">Time</th>
  </tr>
  <!-- For each row, format as:
  <tr>
    <td>1</td>
    <td>[Description]</td>
    <td>[Expected Range]</td>
    <td>[Source: PIC5+/BMS/Physical Gauge]</td>
    <td><input type="text" style="width: 95%; border: 1px solid #999; padding: 2px;"></td>
    <td>[Action if Out of Range]</td>
    <td><input type="text" style="width: 95%; border: 1px solid #999; padding: 2px;"></td>
    <td><input type="text" style="width: 95%; border: 1px solid #999; padding: 2px;"></td>
  </tr>
  -->
</table>

Section 09: Back-out Procedures
RENAME from "Escalation/Communication" to "Back-out Procedures"
Move Section 8.3 Post-Procedure Verification content here as table:
<h2>Section 09: Back-out Procedures</h2>
<table>
  <tr>
    <th>Step</th>
    <th>Description</th>
    <th>Verification</th>
    <th>Action Required</th>
    <th style="width: 60px;">Initials</th>
    <th style="width: 80px;">Time</th>
  </tr>
  <!-- For each row, format as:
  <tr>
    <td>1</td>
    <td>[Description]</td>
    <td>[Verification]</td>
    <td>[Action Required]</td>
    <td><input type="text" style="width: 95%; border: 1px solid #999; padding: 2px;"></td>
    <td><input type="text" style="width: 95%; border: 1px solid #999; padding: 2px;"></td>
  </tr>
  -->
</table>

Section 10: SOP Approval
Create an approval matrix table with:
- Role (Operations Manager, Facility Manager, Safety Officer, Customer Representative)
- Name (input field)
- Signature (input field)
- Date (input field)

Section 11: SOP Completion
ONLY include:
- Technician Sign-off table with Name, Signature, Date, Time fields

Section 12: Comments
Include:
- Revision History table: Version | Date | Author | Changes
- General comments field (optional)

FORMATTING REQUIREMENTS:
- Use professional green color theme (#198754 for headers, #20c997 for accents)
- Include input fields for data entry during execution
- Add checkboxes for verification steps
- Use tables for structured information
- Include "UPDATE NEEDED" markers for missing information
- Make the document printer-friendly
- Use clear section numbering (Section 01, Section 02, etc.)
`;

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>__SOP_TITLE__</title>
    <style>
        body { 
            font-family: 'Century Gothic', Arial, sans-serif; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #f5f5f5; 
            line-height: 1.6;
        }
        .container { 
            background-color: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        h1 { 
            color: #198754; 
            text-align: center; 
            margin-bottom: 40px; 
            font-size: 2.5em;
            border-bottom: 3px solid #198754;
            padding-bottom: 20px;
        }
        h2 { 
            color: #198754; 
            border-bottom: 2px solid #20c997; 
            padding-bottom: 10px; 
            margin-top: 40px; 
            font-size: 1.8em;
        }
        h3 {
            color: #146c43;
            margin-top: 25px;
            font-size: 1.3em;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: left; 
        }
        th { 
            background-color: #198754; 
            color: white; 
            font-weight: bold;
        }
        tr:nth-child(even) { 
            background-color: #f9f9f9; 
        }
        .info-table td:first-child { 
            font-weight: bold; 
            background-color: #e8f5e9; 
            width: 35%; 
        }
        .procedure-step {
            background-color: #f0f9f5;
            padding: 15px;
            border-left: 5px solid #20c997;
            margin: 15px 0;
        }
        .caution-box {
            background-color: #fff3cd;
            border: 2px solid #ffc107;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
        .warning-box {
            background-color: #fee;
            border: 2px solid #dc3545;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
            font-weight: bold;
        }
        .success-criteria {
            background-color: #d1f2eb;
            padding: 15px;
            border-left: 5px solid #198754;
            margin: 15px 0;
        }
        input[type="text"], input[type="date"], input[type="time"], textarea {
            border: 1px solid #999;
            padding: 5px;
            background-color: #fff;
            font-family: inherit;
            font-size: inherit;
            width: 90%;
        }
        input[type="checkbox"] {
            margin-right: 8px;
            transform: scale(1.2);
        }
        .checkbox-item {
            margin: 10px 0;
            padding: 8px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }
        ul { 
            line-height: 1.8; 
            margin-left: 20px;
        }
        li {
            margin-bottom: 8px;
        }
        .update-needed {
            color: #dc3545;
            font-weight: bold;
            background-color: #ffe6e6;
            padding: 2px 6px;
            border-radius: 3px;
        }
        .section-separator {
            border-top: 2px solid #ccc;
            margin: 40px 0;
        }
        .approval-signature {
            border: 1px solid #999;
            width: 200px;
            height: 40px;
            background-color: #fff;
            margin-top: 5px;
        }
        .completion-checklist {
            background-color: #e8f5e9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        @media print {
            body { background-color: white; }
            .container { box-shadow: none; padding: 20px; }
            h1, h2 { page-break-after: avoid; }
            table { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="container">
        {{CONTENT}}
    </div>
</body>
</html>`;

export async function POST(request) {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json({ 
        error: 'Configuration error',
        userMessage: 'AI service is not properly configured. Please check GEMINI_API_KEY.'
      }, { status: 500 });
    }
    
    const body = await request.json();
    const { formData } = body;
    
    // Validate required fields
    if (!formData?.manufacturer || !formData?.modelNumber || !formData?.system || 
        !formData?.category || !formData?.description || !formData?.procedureType || !formData?.customer) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        userMessage: 'Please fill in all required fields'
      }, { status: 400 });
    }
    
    console.log('Starting SOP generation for:', formData.manufacturer, formData.modelNumber);
    
    // Determine task type (intrusive vs non-intrusive)
    const taskType = determineTaskType(formData.description || '');
    console.log('Task type determined:', taskType);
    
    // Calculate personnel requirements
    const personnel = calculatePersonnelRequired(taskType, false);
    
    // Generate dynamic PPE requirements
    const ppeRequirements = generatePPE(taskType, formData.system || '', formData.description || '');
    
    // Generate required tools
    const requiredTools = generateRequiredTools(taskType, formData.manufacturer || '', formData.system || '', personnel.facilities);
    
    // Generate site-specific hazards
    const siteHazards = generateHazards(taskType, formData.system || '', formData.description || '');
    
    // Generate back-out procedures
    const backoutProcedures = generateBackoutProcedures(taskType, formData.system || '');
    
    // Determine LOR based on task type and system criticality
    let riskLevel = 2;
    let riskJustification = "Single system affected with redundancy available";
    
    const workDescription = formData.description?.toLowerCase() || '';
    const system = formData.system?.toLowerCase() || '';
    const procedureType = formData.procedureType?.toLowerCase() || '';
    
    if (taskType === 'non-intrusive') {
      riskLevel = 1;
      riskJustification = "Read-only observation of operating parameters via BMS/control panel. No physical intervention or system changes.";
    } else if (workDescription.includes('electrical') && system.includes('switchgear')) {
      riskLevel = 4;
      riskJustification = "Main switchgear work affects entire facility";
    } else if (system.includes('chiller') && (workDescription.includes('major') || procedureType.includes('annual'))) {
      riskLevel = 3;
      riskJustification = "Critical cooling system with limited redundancy";
    } else if (system.includes('generator')) {
      riskLevel = 3;
      riskJustification = "Critical power system maintenance";
    } else if (system.includes('ups')) {
      riskLevel = 3;
      riskJustification = "Critical power protection system";
    } else {
      riskLevel = 2;
      riskJustification = "Intrusive work requiring system interaction. Proper isolation and safety procedures required.";
    }
    
    // Auto-calculate duration based on procedure type
    let duration = "45 minutes";
    if (procedureType.includes('weekly')) {
      duration = "1-2 hours";
    } else if (procedureType.includes('monthly')) {
      duration = "2-4 hours";
    } else if (procedureType.includes('quarterly') || procedureType.includes('annual')) {
      duration = "4-8 hours";
    } else if (procedureType.includes('daily')) {
      duration = "30-45 minutes";
    }
    
    // Get current date for input fields
    const currentDate = new Date().toLocaleDateString('en-US');
    
    // Determine CET level based on risk level (same logic as MOP)
    const cetRequired = {
      1: "CET 1 (Technician) to execute, CET 2 (Lead Technician) to approve",
      2: "CET 2 (Technician) to execute, CET 3 (Lead Technician) to approve",
      3: "CET 3 (Lead Technician) to execute, CET 4 (Manager) to approve",
      4: "CET 4 (Manager) to execute, CET 5 (Director) to approve"
    };
    
    // Determine qualifications based on equipment and task (similar to MOP logic)
    let qualificationsRequired = "Standard facility technician certification";
    
    // Refrigerant work requires EPA certification
    if (system.includes('chiller') || system.includes('crac') || system.includes('crah') || 
        system.includes('cooling') || system.includes('hvac') || workDescription.includes('refrigerant')) {
      qualificationsRequired = "EPA 608 Universal Certification, HVAC Technician License";
    }
    
    // Electrical work requires electrical qualifications
    if (system.includes('electrical') || system.includes('switchgear') || system.includes('ups') || 
        system.includes('pdu') || workDescription.includes('electrical')) {
      qualificationsRequired = "Qualified Electrical Worker, NFPA 70E Certification";
    }
    
    // Generator work requires specific qualifications
    if (system.includes('generator') || system.includes('genset')) {
      qualificationsRequired = "Diesel Generator Technician Certification, Electrical License";
    }
    
    // Critical work requires higher qualifications
    if (riskLevel >= 3) {
      qualificationsRequired += ", 5+ years data center experience";
    }
    
    // Annual/complex procedures require manufacturer certification
    if (procedureType.includes('annual') || procedureType.includes('major')) {
      qualificationsRequired += `, ${formData.manufacturer} Certified Technician (preferred)`;
    }
    
    // Format dynamic content for prompt
    const ppeTable = ppeRequirements.map(ppe => 
      `<tr><td>${ppe.item}</td><td>${ppe.spec}</td><td>${ppe.when}</td></tr>`
    ).join('\n');
    
    const toolsTable = requiredTools.map(tool => 
      `<tr><td>${tool.tool}</td><td>${tool.spec}</td><td><input type="checkbox" ${tool.available ? 'checked' : ''}> Available</td></tr>`
    ).join('\n');
    
    const hazardsTable = siteHazards.map(hazard => 
      `<tr><td>${hazard.type}</td><td>${hazard.desc}</td><td>${hazard.control}</td></tr>`
    ).join('\n');
    
    const backoutTable = backoutProcedures.map((proc, idx) => 
      `<tr>
        <td>${idx + 1}</td>
        <td>${proc.condition}</td>
        <td>${proc.verification}</td>
        <td>${proc.required}</td>
        <td><input type="text" style="width: 95%; border: 1px solid #999; padding: 2px;"></td>
        <td><input type="text" style="width: 95%; border: 1px solid #999; padding: 2px;"></td>
      </tr>`
    ).join('\n');
    
    // Prepare the prompt for Gemini
    const prompt = `${SOP_INSTRUCTIONS}

Equipment Details:
- Manufacturer: ${formData.manufacturer}
- Model Number: ${formData.modelNumber}
- Serial Number: ${formData.serialNumber || 'UPDATE NEEDED'}
- Location: ${formData.location || 'UPDATE NEEDED'}
- System: ${formData.system}
- Category: ${formData.category}
- Procedure Type: ${formData.procedureType}
- Frequency: ${formData.frequency || 'As per procedure type'}
- Procedure Description: ${formData.description}
- Task Type: ${taskType.toUpperCase()}

Customer Information:
- Customer: ${formData.customer}
- Site Name: ${formData.siteName || 'UPDATE NEEDED'}

Auto-Populated Values:
- Qualifications Required: ${qualificationsRequired}
- Personnel Required: ${personnel.facilities} Facilities Personnel${taskType === 'non-intrusive' ? ' (Single technician sufficient for non-intrusive observation)' : ''}

Site Address:
- Street: ${formData.address?.street || 'UPDATE NEEDED'}
- City: ${formData.address?.city || 'UPDATE NEEDED'}
- State: ${formData.address?.state || 'UPDATE NEEDED'}
- ZIP Code: ${formData.address?.zipCode || 'UPDATE NEEDED'}

CALCULATED VALUES:
- Level of Risk (LOR): ${riskLevel} - ${['Low', 'Medium', 'High', 'Critical'][riskLevel-1]}
- Risk Justification: ${riskJustification}
- Duration: ${duration}
- CET Level Required: ${cetRequired[riskLevel]}

Current Date: ${currentDate}

DYNAMIC CONTENT TO INCLUDE:

PPE Requirements (Use this exact table in Section 6):
${ppeTable}

Required Tools (Use this exact table in Section 6):
${toolsTable}

Site-Specific Hazards (Use this exact table in Section 6):
${hazardsTable}

Back-out Procedures (Use this exact content in Section 9):
${backoutTable}

Generate ONLY the content that goes inside the container div - no DOCTYPE, html, head, body, or container tags.
Start with <h1>Standard Operating Procedure (SOP)</h1> and proceed with all 12 sections using H2 headers.

IMPORTANT TABLE STRUCTURE REQUIREMENTS:
- Section 8.1 Pre-Procedure Checks: MUST have columns [Step, Description, Expected Result, Actual Result, Action if Not Met, Initials, Time]
- Section 8.2 Detailed Procedure Steps: MUST have columns [Step, Description, Expected Range, Source, Recorded Value, Action if Out of Range, Initials, Time]
- Section 9 Back-out Procedures: MUST have columns [Step, Description, Verification, Action Required, Initials, Time]
- ALL Initials and Time cells MUST contain input fields: <td><input type="text" style="width: 95%; border: 1px solid #999; padding: 2px;"></td>

CRITICAL REQUIREMENTS:
1. Generate ALL 12 sections completely - do not stop early
2. Section 01 MUST include calculated LOR: ${riskLevel} and Duration: ${duration}
3. Section 01 MUST show CET Level Required as: "${cetRequired[riskLevel]}" with italic text "Based on risk level assessment"
4. Section 01 MUST have editable input fields for Author, Version, Author CET Level
5. Section 02 MUST show Customer: ${formData.customer} and Site Name: ${formData.siteName || 'UPDATE NEEDED'}
6. Section 03 MUST show:
   - Fillable checkboxes for Work Performed By and input fields for subcontractor details
   - Auto-populate Qualifications Required as: "${qualificationsRequired}"
   - Personnel count: ${personnel.facilities} for Facilities Personnel
   - Add note: "${taskType === 'non-intrusive' ? 'Single technician sufficient for non-intrusive observation tasks. Add escort if subcontractor performs work.' : ''}"
7. Section 06 MUST use the EXACT dynamic content provided:
   - PPE table with the specific items provided above
   - Tools table with the specific tools provided above
   - Emergency contacts in EOP format with all 8 contact types
   - Site hazards table with the specific hazards provided above
8. Section 07 MUST include:
   - System Redundancy Assessment table with dropdowns and input fields
   - Risk justification: "${riskJustification}"
9. Section 08 MUST:
   - For non-intrusive tasks: Focus on reading from BMS/control panel only, NO physical measurements
   - For intrusive tasks: Include full maintenance procedures with physical tools
   - Use tables with input fields in Initials and Time columns
10. Section 09 MUST use the EXACT back-out procedures provided in the dynamic content
11. ALL tables in Sections 8 and 9 MUST have Initials and Time cells with input fields

Generate comprehensive, detailed content for ALL sections. Do NOT use placeholder text.`;

    // Search Enhancement
    let enhancedPrompt = prompt;
    if (process.env.SEARCH_ENABLED === 'true') {
      try {
        enhancedPrompt = await enhancePromptWithSearchResults(prompt, formData.modelNumber, formData.manufacturer);
        console.log('Search enhancement applied successfully');
      } catch (error) {
        console.log('Search enhancement skipped:', error.message);
        // Use original prompt if search fails
      }
    }

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 32000, // Increased for complete 12 sections
        candidateCount: 1
      }
    });
    
    console.log('Sending prompt to Gemini AI...');
    
    let result, response, generatedContent;
    try {
      result = await model.generateContent(enhancedPrompt);
      response = await result.response;
      generatedContent = response.text();
    } catch (aiError) {
      console.error('AI Generation Error:', aiError);
      
      // Try with simpler configuration on retry
      console.log('Retrying with simpler configuration...');
      try {
        const retryModel = genAI.getGenerativeModel({ 
          model: 'gemini-2.5-flash',
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 28000
          }
        });
        result = await retryModel.generateContent(enhancedPrompt);
        response = await result.response;
        generatedContent = response.text();
      } catch (retryError) {
        console.error('Retry also failed:', retryError.message);
        throw new Error(`AI generation failed: ${aiError.message}`);
      }
    }
    
    console.log('AI Response received, length:', generatedContent ? generatedContent.length : 0);
    
    // Check if all sections are present
    const sectionMatches = generatedContent.match(/Section \d+:/g) || [];
    console.log('Number of sections found:', sectionMatches.length);
    
    // Clean up the response
    generatedContent = generatedContent
      .replace(/```html/g, '')
      .replace(/```/g, '')
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<\/?html[^>]*>/gi, '')
      .replace(/<\/?head[^>]*>/gi, '')
      .replace(/<\/?body[^>]*>/gi, '')
      .replace(/<div[^>]*class="container"[^>]*>/gi, '')
      .replace(/<\/div>\s*$/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
      .trim();
    
    // Add the main title if not present
    if (!generatedContent.includes('<h1>')) {
      generatedContent = `<h1>Standard Operating Procedure (SOP)</h1>\n${generatedContent}`;
    }
    
    // Generate dynamic SOP title
    const sopTitle = `SOP - ${formData.manufacturer} ${formData.modelNumber} - ${formData.procedureType}`;
    
    // Build complete HTML with dynamic title
    const completeHtml = HTML_TEMPLATE
      .replace('__SOP_TITLE__', sopTitle)
      .replace('{{CONTENT}}', generatedContent);
    
    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    const safeManufacturer = formData.manufacturer.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
    const safeModel = formData.modelNumber.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
    const safeProcedure = formData.procedureType.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
    const filename = `SOP_${safeManufacturer}_${safeModel}_${safeProcedure}_${date}_${timestamp}.html`;

    // Save to blob storage
    const blob = await put(`sops/${filename}`, completeHtml, {
      access: 'public',
      contentType: 'text/html',
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    console.log('SOP generation complete:', filename);
    
    return NextResponse.json({ 
      success: true,
      filename: filename,
      url: blob.url,
      message: 'SOP generated successfully'
    });
    
  } catch (error) {
    console.error('SOP generation error:', error);
    
    // Handle specific error types
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return NextResponse.json({ 
        error: 'AI service is busy',
        userMessage: 'The AI service is currently busy. Please wait 2-3 minutes and try again.'
      }, { status: 429 });
    }
    
    if (error.message?.includes('API key') || error.message?.includes('API_KEY')) {
      return NextResponse.json({ 
        error: 'Configuration error',
        userMessage: 'AI service is not properly configured. Please contact support.'
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to generate SOP',
      details: error.message,
      userMessage: 'Unable to generate SOP. Please try again.'
    }, { status: 500 });
  }
}