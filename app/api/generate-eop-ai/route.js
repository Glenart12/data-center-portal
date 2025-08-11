import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROJECT_INSTRUCTIONS = `You are creating Emergency Operating Procedures (EOPs) for data center technicians. Generate COMPLETE, DETAILED EOPs with NO placeholders or summaries.

CRITICAL: This is for POWER FAILURE emergency response. Adapt all procedures based on the specific equipment type provided.

CRITICAL HTML GENERATION RULES:
- DO NOT generate DOCTYPE, html, head, body, or container div tags
- Generate ONLY the content that goes INSIDE the existing container div
- Start with the main H1 title, then proceed with sections
- Use H2 for all section headers (not H1)
- Use H3 for subsection headers
- The HTML template already provides the document structure

IMPORTANT: This EOP must be INTERACTIVE with editable input fields. Include HTML input elements throughout.

The EOP must follow this EXACT structure with INTERACTIVE ELEMENTS:

START WITH:
<h1>Emergency Operating Procedure (EOP)</h1>

<div class="emergency-warning" style="background: #dc3545; color: white; padding: 20px; margin: 20px 0; border-radius: 5px; font-size: 1.1em;">
<strong>⚠️ EMERGENCY RESPONSE: \${manufacturer} \${modelNumber}</strong><br>
<strong>Location:</strong> \${location || 'Data Center'}<br>
<strong>Emergency Type:</strong> \${emergencyType}<br>
<strong>Critical Specs:</strong> Generate based on equipment database - voltage, phase, capacity, refrigerant type, etc.
</div>

<h2>Section 01: EOP Identification & Control</h2>
<p><strong>EOP Title:</strong> Emergency Operating Procedure for \${manufacturer} \${modelNumber}</p>
<p><strong>EOP Identifier:</strong> EOP-\${manufacturer.toUpperCase().substring(0,3)}-\${modelNumber.replace(/[^A-Z0-9]/gi, '').substring(0,8)}-PWR-001</p>
<p><strong>Equipment Details:</strong></p>
<p><strong>Manufacturer:</strong> \${manufacturer}</p>
<p><strong>Model Number:</strong> \${modelNumber}</p>
<p><strong>Serial Number:</strong> \${serialNumber || 'N/A'}</p>
<p><strong>Location:</strong> \${location || 'Data Center'}</p>
<p><strong>System:</strong> \${system}</p>
<p><strong>Component Type:</strong> \${component}</p>
<p><strong>Version:</strong> <input type="text" value="1.0" style="width:80px" /></p>
<p><strong>Date:</strong> <input type="text" value="[current_date]" style="width:150px" /></p>
<p><strong>Author:</strong> <input type="text" placeholder="Enter Author Name" style="width:250px" /></p>
<p><strong>Approver:</strong> <input type="text" placeholder="Enter Approver Name" style="width:250px" /></p>

<h2>Section 02: Purpose & Scope</h2>
<p><strong>Purpose:</strong> This Emergency Operating Procedure provides step-by-step instructions for responding to power failure emergencies affecting the \${manufacturer} \${modelNumber} \${system}. This document ensures rapid, safe, and effective response to restore critical infrastructure operations.</p>
<p><strong>Scope:</strong> This procedure applies to all data center operations personnel, facilities engineers, and emergency response teams responsible for maintaining the \${manufacturer} \${modelNumber} and associated critical infrastructure systems.</p>
<p><strong>Activation Criteria:</strong> This EOP shall be activated when power loss is detected or suspected on the \${manufacturer} \${modelNumber}, including but not limited to: utility power outages, automatic transfer switch failures, distribution panel failures, circuit breaker trips, or equipment-specific power supply failures.</p>
<p><strong>Safety Notice:</strong> All personnel must follow proper electrical safety procedures, use appropriate PPE, and verify de-energization before working on any electrical equipment.</p>

<h2>Section 03: Immediate Emergency Actions - Power Failure Diagnostics</h2>

<h3>Pre-Action Safety & Equipment Requirements</h3>

<div class="emergency-action" style="background: #fee; border: 2px solid #dc3545; padding: 15px; margin: 20px 0;">
<h4>⚠️ CRITICAL SAFETY CHECKPOINT - STOP Before Proceeding:</h4>
<p><strong>Equipment-Specific PPE Requirements for \${manufacturer} \${modelNumber}:</strong></p>

Generate PPE requirements based on the SPECIFIC equipment type and voltage:
- For 480V 3-phase equipment (chillers, large motors): Arc Flash Category 2 PPE minimum
- For 208V/240V equipment: Arc Flash Category 1 PPE
- For DC systems (UPS batteries): Acid-resistant gloves, face shield
- For refrigerant systems: SCBA or respirator if leak suspected
- For generators: Hearing protection, CO monitor

<table>
<tr>
  <th>PPE Item</th>
  <th>Specification for \${modelNumber}</th>
  <th>Verified</th>
</tr>
<tr>
  <td>Arc Flash PPE</td>
  <td>Category [specify based on voltage] - [cal/cm²] rated</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Insulated Gloves</td>
  <td>Class [0-4 based on voltage] rated for [specific voltage]</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Safety Glasses/Face Shield</td>
  <td>ANSI Z87.1 rated with side shields</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Additional PPE</td>
  <td>[Equipment-specific: respirator for refrigerants, hearing protection for generators, etc.]</td>
  <td><input type="checkbox" /></td>
</tr>
</table>

<p><strong>Required Tools & Test Equipment for \${manufacturer} \${modelNumber}:</strong></p>

Generate tool list based on the SPECIFIC equipment model:
- For Carrier 19XRV5P5: Carrier CCN interface tool, specific control board diagnostic tools
- For Trane CVHE: Tracer SC+ interface, oil pressure gauges
- For Caterpillar generators: CAT ET diagnostic tool
- For Liebert UPS: Liebert monitoring interface cable

<table>
<tr>
  <th>Tool/Equipment</th>
  <th>Specific Model/Type for \${modelNumber}</th>
  <th>Available</th>
</tr>
<tr>
  <td>Multimeter</td>
  <td>True RMS, CAT III rated for [equipment voltage]</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Clamp Meter</td>
  <td>AC/DC capable, [amperage range based on equipment FLA]</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Non-Contact Voltage Detector</td>
  <td>Rated for [equipment voltage range]</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Manufacturer Interface Tool</td>
  <td>[Specific tool for \${manufacturer} \${modelNumber}]</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>LOTO Equipment</td>
  <td>Lockout devices for [breaker type/disconnect type]</td>
  <td><input type="checkbox" /></td>
</tr>
</table>

<p><strong>\${manufacturer} \${modelNumber} Specific Safety Requirements:</strong></p>
<ul>
<li>□ Verify de-energization procedures per \${manufacturer} service manual</li>
<li>□ Check for stored energy in [capacitors/VFDs/control circuits] specific to this model</li>
<li>□ Review \${manufacturer} emergency shutdown sequence</li>
<li>□ Confirm [equipment-specific hazards: refrigerant pressure, battery acid, hot surfaces, etc.]</li>
<li>□ Emergency contact for \${manufacturer} technical support ready: <input type="text" placeholder="Support #" style="width:150px" /></li>
</ul>

<div style="background: #dc3545; color: white; padding: 10px; margin: 10px 0; font-weight: bold; text-align: center;">
DO NOT PROCEED until all safety requirements are verified for \${manufacturer} \${modelNumber}
</div>
</div>

<h3>Step 1: Obvious Power Loss Indicators Check (BEFORE opening any equipment)</h3>
<p><strong>Verify facility-wide power status indicators before approaching \${manufacturer} \${modelNumber}</strong></p>
<table>
<tr>
  <th>Check Item</th>
  <th>Expected Condition if Power Lost</th>
  <th>Verification Method</th>
  <th>Data Reading Field</th>
  <th>Pass/Fail</th>
</tr>
<tr>
  <td>Generator Running (Audible)</td>
  <td>Generator engine noise audible from equipment room</td>
  <td>Listen for engine sound upon entering facility</td>
  <td><input type="text" placeholder="Yes/No" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Generator Alarms</td>
  <td>Generator control panel showing "Running" or active alarms</td>
  <td>Visual check of generator control panel</td>
  <td><input type="text" placeholder="Status" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Emergency Lighting</td>
  <td>Emergency lights activated in corridors and equipment rooms</td>
  <td>Visual observation of emergency lighting status</td>
  <td><input type="text" placeholder="On/Off" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>UPS on Battery</td>
  <td>UPS alarm beeping, "On Battery" LED illuminated</td>
  <td>Check UPS front panel indicators and listen for alarms</td>
  <td><input type="text" placeholder="Status" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Facility Alarms</td>
  <td>BMS/EPMS showing utility power loss alarms</td>
  <td>Check alarm panel or BMS workstation</td>
  <td><input type="text" placeholder="Alarms present" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
</table>

<h3>Step 2: System Monitoring Verification</h3>
<p><strong>Verify how \${manufacturer} \${modelNumber} appears in monitoring systems</strong></p>
<table>
<tr>
  <th>System</th>
  <th>Check Location</th>
  <th>What to Verify</th>
  <th>Expected Reading for \${modelNumber}</th>
  <th>Actual Reading</th>
  <th>Pass/Fail</th>
</tr>
<tr>
  <td>EPMS</td>
  <td>Electrical Power Monitoring System</td>
  <td>Power consumption for \${modelNumber}</td>
  <td>0 kW if de-energized</td>
  <td><input type="text" placeholder="kW reading" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>BMS</td>
  <td>Building Management System</td>
  <td>\${manufacturer} \${modelNumber} status</td>
  <td>"Offline" or "No Communication"</td>
  <td><input type="text" placeholder="Status" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>SCADA (if available)</td>
  <td>SCADA System</td>
  <td>\${system} operational status</td>
  <td>Shows \${modelNumber} as non-operational</td>
  <td><input type="text" placeholder="Status" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Generator Monitoring</td>
  <td>Generator Control Panel</td>
  <td>Load percentage and kW output</td>
  <td>Load increased if utility power lost</td>
  <td><input type="text" placeholder="% Load" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>ATS Status</td>
  <td>Automatic Transfer Switch</td>
  <td>Source position (Utility/Generator)</td>
  <td>"Emergency" or "Generator" if transferred</td>
  <td><input type="text" placeholder="Position" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
</table>

<h3>Step 3: Electrical Diagnostics</h3>
<p><strong>Equipment-specific electrical verification for \${manufacturer} \${modelNumber}</strong></p>

First, identify the specific equipment type from the manufacturer and model provided. Determine:
- Equipment category (chiller, UPS, generator, PDU, CRAC unit, etc.)
- Voltage requirements (single-phase, 3-phase, DC voltage, etc.)
- Control voltage specifications
- Critical power components for this equipment type

Create a comprehensive diagnostic table with these EXACT columns:
<table>
<tr>
  <th>Step</th>
  <th>Action</th>
  <th>Voltage Verification</th>
  <th>Data Reading Field</th>
  <th>Pass/Fail</th>
</tr>
</table>

The diagnostic steps MUST be appropriate for the equipment type. Include:
- Main power verification steps specific to this equipment
- Control circuit checks relevant to this equipment
- Equipment-specific components (VFD for motors, rectifiers for UPS, transfer switches for generators, etc.)
- Protection device checks appropriate for this equipment
- Safety interlocks and emergency stops if applicable

Each row should have:
- Step number
- Detailed action description
- Expected voltage based on THIS SPECIFIC equipment's specs (e.g., "480VAC 3-phase" for industrial chillers)
- Data Reading Field: <input type="text" placeholder="Enter reading" style="width:100px" />
- Pass/Fail: <input type="checkbox" />

After the table, include:
<div class="emergency-action">
<h3>POWER DIAGNOSIS DETERMINATION:</h3>
<ul>
<li>IF power is present at main input but equipment won't operate = INTERNAL POWER ISSUE (specify internal components for THIS equipment type)</li>
<li>IF NO power at main input = EXTERNAL POWER ISSUE (proceed to Section 04)</li>
</ul>
</div>

Include equipment-specific measurement requirements:
- Correct multimeter settings for this equipment's voltages
- PPE requirements based on voltage levels
- Lock-out/Tag-out specific to this equipment

<h2>Section 04: External Power Supply Scenarios</h2>

Generate 4 scenarios based on the SPECIFIC EQUIPMENT TYPE and its typical installation:

<h3>SCENARIO 1 - PRIMARY POWER SOURCE FAILURE</h3>
[Adapt based on equipment: utility for most equipment, upstream UPS for critical loads, generator for emergency systems, etc.]
<div style="background: #f8d7da; color: #721c24; border: 2px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; font-weight: bold;">
Trigger Conditions: (specific to how this equipment is typically powered)
</div>
Verification Checks: (specific to this equipment's power source)
<table>
Include verification steps with input fields for readings
</table>

<h3>SCENARIO 2 - DISTRIBUTION FAILURE</h3>
[Adapt based on equipment: MCC for motors, PDU for IT equipment, panelboard for HVAC, switchgear for large equipment, etc.]
<div style="background: #f8d7da; color: #721c24; border: 2px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; font-weight: bold;">
Trigger Conditions: (specific to this equipment's distribution type)
</div>
Verification Checks: (appropriate for the distribution equipment)
<table>
Include verification steps with input fields for readings
</table>

<h3>SCENARIO 3 - FEEDER/CIRCUIT FAILURE</h3>
[Adapt based on equipment: cable types, voltage levels, typical routing for this equipment]
<div style="background: #f8d7da; color: #721c24; border: 2px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; font-weight: bold;">
Trigger Conditions: (based on this equipment's typical circuit configuration)
</div>
Verification Checks: (appropriate tests for this voltage level and cable type)
<table>
Include verification steps with input fields for readings
</table>

<h3>SCENARIO 4 - LOCAL PROTECTION DEVICE FAILURE</h3>
[Adapt based on equipment: disconnect type, breaker size, fusing, etc.]
<div style="background: #f8d7da; color: #721c24; border: 2px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; font-weight: bold;">
Trigger Conditions: (specific to protection devices used with this equipment)
</div>
Verification Checks: (appropriate for this equipment's protection scheme)
<table>
Include verification steps with input fields for readings
</table>

For EACH scenario:
- Tailor all checks to the specific equipment type
- Include voltage levels appropriate for this equipment
- Reference correct upstream systems for this equipment type
- Include relevant safety considerations for the voltage/current levels
- List appropriate spare parts for this specific equipment
- Include escalation contacts relevant to this equipment type

IMPORTANT EQUIPMENT-SPECIFIC ADAPTATIONS:
- If equipment is a CHILLER: Focus on 3-phase power (typically 480V), VFDs, control transformers (24V or 120V control), compressor contactors
- If equipment is a UPS: Focus on input/output voltages, bypass sources, DC bus voltage, battery strings
- If equipment is a GENERATOR: Focus on starting batteries (12V or 24V DC), transfer switches, control power, field excitation
- If equipment is a PDU: Focus on input breakers, monitoring circuits, branch circuits, transformer taps
- If equipment is a CRAC/CRAH: Focus on fan motors, control power (24VAC typical), humidification power, reheat elements
- If equipment is SWITCHGEAR: Focus on bus voltage, protection relays, control power (125VDC typical), breaker charging motors
- Adapt accordingly for any other equipment type

<h2>Section 05: Communication & Escalation Protocol</h2>
- Table with contact levels 0-3 plus emergency services
- Phone number fields: <input type="text" placeholder="Enter phone" style="width:150px" />
- Contact name fields where appropriate: <input type="text" placeholder="Enter contact name" style="width:200px" />

<h3>Emergency Contacts</h3>
Include a comprehensive Emergency Contacts table with columns: Service Type, Contact Name/Organization, Phone Number, Notes/Address

Include these essential emergency contacts (use editable input fields for phone numbers):
- Police Emergency: 911
- Fire/EMS Emergency: 911  
- Electric Utility Emergency: <input type="text" placeholder="Enter utility emergency #" style="width:150px" />
- Equipment Manufacturer Support: <input type="text" placeholder="Enter manufacturer support #" style="width:150px" />
- Electrical Contractor: <input type="text" placeholder="Enter contractor #" style="width:150px" />
- Facilities Manager: <input type="text" placeholder="Enter facilities manager #" style="width:150px" />

Add this important note at the bottom of the Emergency Contacts section:
"⚠️ IMPORTANT: Verify all emergency contact numbers for your specific facility location. Update phone numbers as needed."

<h2>Section 06: Recovery & Return to Service</h2>
<h3>Power Restoration and Equipment Recovery Procedures</h3>
<p>Follow these steps in sequence to safely restore the \${manufacturer} \${modelNumber} to normal operation after power has been restored:</p>

<ol>
  <li>
    <strong>Power Restoration Verification</strong>
    <p>Confirm stable power supply is available at all distribution levels:</p>
    <ul>
      <li>Verify utility power restoration at main switchgear</li>
      <li>Check automatic transfer switch position (should be on "Normal" source)</li>
      <li>Confirm voltage readings at equipment disconnect: <input type="text" placeholder="Enter voltage" style="width:100px" /> VAC</li>
      <li>Verify phase rotation if applicable</li>
    </ul>
  </li>
  
  <li>
    <strong>Pre-Start Safety Checks</strong>
    <p>Complete all safety verifications before energizing equipment:</p>
    <ul>
      <li>Verify all LOTO devices have been removed</li>
      <li>Confirm no personnel are working on the \${manufacturer} \${modelNumber}</li>
      <li>Reset all emergency stops and safety interlocks</li>
      <li>Check control power availability: <input type="text" placeholder="Control voltage" style="width:100px" /> VAC</li>
    </ul>
  </li>
  
  <li>
    <strong>Equipment-Specific Restart Sequence</strong>
    <p>Follow the manufacturer-specific startup procedure for \${manufacturer} \${modelNumber}:</p>
    <ul>
      <li>Turn main disconnect to "ON" position</li>
      <li>Verify control panel indicators show normal status</li>
      <li>Clear any alarms present on the control panel</li>
      <li>Initiate startup sequence per manufacturer's procedure</li>
      <li>Record startup time: <input type="text" placeholder="HH:MM" style="width:80px" /></li>
    </ul>
  </li>
  
  <li>
    <strong>System Functionality Verification</strong>
    <p>Monitor critical parameters during the startup phase:</p>
    <table>
      <tr>
        <th>Parameter</th>
        <th>Expected Range</th>
        <th>Actual Reading</th>
        <th>Pass/Fail</th>
      </tr>
      <tr>
        <td>Operating Voltage</td>
        <td>Per equipment nameplate</td>
        <td><input type="text" placeholder="Reading" style="width:100px" /></td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td>Operating Current</td>
        <td>Within FLA rating</td>
        <td><input type="text" placeholder="Reading" style="width:100px" /></td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td>Control System Status</td>
        <td>Normal/No Alarms</td>
        <td><input type="text" placeholder="Status" style="width:100px" /></td>
        <td><input type="checkbox" /></td>
      </tr>
    </table>
  </li>
  
  <li>
    <strong>Load Transfer (if applicable)</strong>
    <p>For equipment with redundant systems or bypass capabilities:</p>
    <ul>
      <li>Gradually transfer load from backup to primary equipment</li>
      <li>Monitor load percentage: <input type="text" placeholder="% Load" style="width:80px" /></li>
      <li>Verify stable operation at each load increment</li>
      <li>Document final load distribution</li>
    </ul>
  </li>
  
  <li>
    <strong>Performance Validation</strong>
    <p>Confirm equipment is operating within normal parameters:</p>
    <ul>
      <li>Run equipment for minimum 15 minutes under normal load</li>
      <li>Verify all operational setpoints are correct</li>
      <li>Check for unusual noises, vibrations, or odors</li>
      <li>Confirm all auxiliary systems are functioning</li>
    </ul>
  </li>
  
  <li>
    <strong>Return to Normal Operation</strong>
    <p>Complete recovery documentation and notifications:</p>
    <ul>
      <li>Document all readings and observations</li>
      <li>Update equipment log book</li>
      <li>Notify operations team of successful restoration</li>
      <li>Clear any active alarms in monitoring systems</li>
      <li>Restoration completed by: <input type="text" placeholder="Name" style="width:200px" /> at <input type="text" placeholder="Time" style="width:80px" /></li>
    </ul>
  </li>
</ol>

<h2>Section 07: Supporting Information</h2>
<h3>Critical Infrastructure Locations</h3>
<table>
  <tr>
    <th>Infrastructure Element</th>
    <th>Location Details</th>
    <th>Access Requirements</th>
  </tr>
  <tr>
    <td><strong>\${manufacturer} \${modelNumber} Location</strong></td>
    <td><input type="text" placeholder="Enter exact location (Room/Row/Rack)" style="width:250px" /></td>
    <td><input type="text" placeholder="Badge/Key required" style="width:150px" /></td>
  </tr>
  <tr>
    <td><strong>Main Electrical Panel</strong></td>
    <td><input type="text" placeholder="Panel designation and location" style="width:250px" /></td>
    <td><input type="text" placeholder="Access requirements" style="width:150px" /></td>
  </tr>
  <tr>
    <td><strong>Equipment Disconnect Switch</strong></td>
    <td><input type="text" placeholder="Disconnect location" style="width:250px" /></td>
    <td><input type="text" placeholder="Access requirements" style="width:150px" /></td>
  </tr>
  <tr>
    <td><strong>Distribution Panel</strong></td>
    <td><input type="text" placeholder="Panel ID and location" style="width:250px" /></td>
    <td><input type="text" placeholder="Access requirements" style="width:150px" /></td>
  </tr>
  <tr>
    <td><strong>Emergency Generator</strong></td>
    <td><input type="text" placeholder="Generator location" style="width:250px" /></td>
    <td><input type="text" placeholder="Access requirements" style="width:150px" /></td>
  </tr>
  <tr>
    <td><strong>UPS System (if applicable)</strong></td>
    <td><input type="text" placeholder="UPS location" style="width:250px" /></td>
    <td><input type="text" placeholder="Access requirements" style="width:150px" /></td>
  </tr>
</table>

<h3>Spare Parts Inventory</h3>
<p>Critical spare parts for \${manufacturer} \${modelNumber} emergency response:</p>
<table>
  <tr>
    <th>Part Description</th>
    <th>Part Number</th>
    <th>Quantity</th>
    <th>Storage Location</th>
  </tr>
  <tr>
    <td>Main Breaker/Fuses</td>
    <td><input type="text" placeholder="Part number" style="width:150px" /></td>
    <td><input type="text" placeholder="Qty" style="width:60px" /></td>
    <td><input type="text" placeholder="Location" style="width:200px" /></td>
  </tr>
  <tr>
    <td>Control Fuses</td>
    <td><input type="text" placeholder="Part number" style="width:150px" /></td>
    <td><input type="text" placeholder="Qty" style="width:60px" /></td>
    <td><input type="text" placeholder="Location" style="width:200px" /></td>
  </tr>
  <tr>
    <td>Control Board/Module</td>
    <td><input type="text" placeholder="Part number" style="width:150px" /></td>
    <td><input type="text" placeholder="Qty" style="width:60px" /></td>
    <td><input type="text" placeholder="Location" style="width:200px" /></td>
  </tr>
  <tr>
    <td>Power Supply Module</td>
    <td><input type="text" placeholder="Part number" style="width:150px" /></td>
    <td><input type="text" placeholder="Qty" style="width:60px" /></td>
    <td><input type="text" placeholder="Location" style="width:200px" /></td>
  </tr>
  <tr>
    <td>Contactors/Relays</td>
    <td><input type="text" placeholder="Part number" style="width:150px" /></td>
    <td><input type="text" placeholder="Qty" style="width:60px" /></td>
    <td><input type="text" placeholder="Location" style="width:200px" /></td>
  </tr>
</table>

<h3>Related Documents</h3>
Make these clickable hyperlinks:
- <a href="#" style="color: #0070f3; text-decoration: underline;">Equipment Electrical Drawings</a> (Internal Document)
- <a href="#" style="color: #0070f3; text-decoration: underline;">Single Line Diagram</a> (Internal Document)
- <a href="#" style="color: #0070f3; text-decoration: underline;">Arc Flash Study</a> (Internal Document)
- <a href="https://www.osha.gov/electrical" target="_blank" style="color: #0070f3; text-decoration: underline;">OSHA Electrical Safety Standards</a>
- <a href="https://www.nfpa.org/codes-and-standards/nfpa-70e" target="_blank" style="color: #0070f3; text-decoration: underline;">NFPA 70E Electrical Safety</a>

<h2>Section 08: EOP Approval & Review</h2>
- Approval matrix table with editable fields:
  - Name column: <input type="text" placeholder="Enter name" style="width:200px" />
  - Signature column: <input type="text" placeholder="Signature" style="width:200px" />
  - Date column: <input type="text" placeholder="MM/DD/YYYY" style="width:120px" />

CRITICAL FORMATTING REQUIREMENTS:
- DO NOT generate DOCTYPE, html, head, body tags or container div
- Start with <h1>Emergency Operating Procedure (EOP)</h1>
- Use H2 for section headers: "Section 01:", "Section 02:", etc. (with zero-padded numbers)
- Use H3 for subsection headers
- Use red (color: #dc3545) for all emergency warnings and critical actions
- Replace ANY placeholder text with proper input fields
- Use CSS classes: .emergency-action, .emergency-warning, .critical-text
- Make tables professional with proper styling and borders
- Generate COMPLETE content with NO placeholders`;

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>__EOP_TITLE__</title>
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
            color: #dc3545; 
            text-align: center; 
            margin-bottom: 40px; 
            font-size: 2.5em;
            border-bottom: 3px solid #dc3545;
            padding-bottom: 20px;
        }
        h2 { 
            color: #dc3545; 
            border-bottom: 2px solid #dc3545; 
            padding-bottom: 10px; 
            margin-top: 40px; 
            font-size: 1.8em;
        }
        h3 {
            color: #0f3456;
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
            background-color: #dc3545; 
            color: white; 
            font-weight: bold;
        }
        tr:nth-child(even) { 
            background-color: #f9f9f9; 
        }
        .info-table td:first-child { 
            font-weight: bold; 
            background-color: #f0f0f0; 
            width: 35%; 
        }
        .emergency-action {
            background-color: #fee;
            padding: 15px;
            border-left: 5px solid #dc3545;
            margin: 15px 0;
            font-weight: bold;
        }
        .critical-text {
            color: #dc3545;
            font-weight: bold;
            text-transform: uppercase;
        }
        input[type="text"], input.field-box {
            border: 1px solid #999;
            padding: 5px;
            background-color: #fff;
            font-family: inherit;
            font-size: inherit;
            width: 90%;
        }
        .checkbox {
            text-align: center;
            font-size: 1.2em;
        }
        ul { 
            line-height: 1.8; 
            margin-left: 20px;
        }
        li {
            margin-bottom: 8px;
        }
        .emergency-warning { 
            background-color: #f8d7da; 
            color: #721c24;
            border: 2px solid #dc3545;
            padding: 15px; 
            border-radius: 5px; 
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
        }
        .section-separator {
            border-top: 2px solid #ccc;
            margin: 40px 0;
        }
        .small-input {
            width: 60px;
            padding: 3px;
            border: 1px solid #999;
            font-size: 12px;
        }
        .field-box {
            border: 1px solid #999;
            padding: 5px;
            background-color: #fff;
            font-family: inherit;
            font-size: inherit;
            width: 90%;
        }
        input[type="text"] {
            border: 1px solid #999;
            padding: 5px;
            background-color: #fff;
            font-family: inherit;
            font-size: inherit;
        }
        a {
            color: #0070f3;
            text-decoration: underline;
        }
        a:hover {
            color: #0051cc;
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
    const body = await request.json();
    const { formData } = body;
    
    // Validate required fields
    if (!formData?.manufacturer || !formData?.modelNumber || !formData?.system || 
        !formData?.component || !formData?.emergencyType) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        userMessage: 'Please fill in all required fields'
      }, { status: 400 });
    }

    // Additional specific validation for component
    if (!formData?.component) {
      return NextResponse.json({ 
        error: 'Component/Equipment Type is required',
        userMessage: 'Component/Equipment Type is required'
      }, { status: 400 });
    }
    
    console.log('Starting EOP generation for:', formData.manufacturer, formData.modelNumber);
    
    // Get current date for input fields
    const currentDate = new Date().toLocaleDateString('en-US');
    
    // Prepare the prompt for Gemini
    const prompt = `${PROJECT_INSTRUCTIONS.replace('[current_date]', currentDate)}

CRITICAL EQUIPMENT TYPE: ${formData.component}
THIS IS A: ${formData.component?.toUpperCase()} - Make sure ALL procedures are specific to ${formData.component}

EMERGENCY TYPE FOCUS: ${formData.emergencyType}
${formData.emergencyType.toLowerCase().includes('power') ? `
POWER FAILURE EMERGENCY - This EOP is specifically for power failure response. 
Section 03 MUST include comprehensive power diagnostics with voltage verification tables.
Section 04 MUST include the 4 external power supply scenarios with equipment-specific adaptations.
` : ''}

Equipment-Specific Details for ${formData.manufacturer} ${formData.modelNumber}:
${formData.component?.toLowerCase().includes('chiller') ? `
CHILLER SPECIFIC - ${formData.manufacturer} ${formData.modelNumber}:
- Main Power: ${formData.manufacturer === 'Carrier' ? '480VAC 3-phase (typical for Carrier centrifugal)' : formData.manufacturer === 'Trane' ? '460-480VAC 3-phase' : formData.manufacturer === 'York' ? '460VAC 3-phase standard' : '480VAC 3-phase'}
- Control Power: ${formData.manufacturer === 'Carrier' ? '120VAC control circuit via transformer' : '24VAC or 120VAC control circuits'}
- VFD Power: Check Variable Frequency Drive if ${formData.modelNumber} is VFD-equipped
- Compressor Count: ${formData.modelNumber?.includes('19XRV') ? '2 compressors' : 'Verify compressor configuration'}
- Refrigerant: ${formData.modelNumber?.includes('19XRV') ? 'R-134a' : formData.modelNumber?.includes('CVHE') ? 'R-123 or R-514A' : 'Check nameplate'}
- Arc Flash PPE: Category 2 minimum for 480V systems
- Special Tools: ${formData.manufacturer} diagnostic interface required
` : ''}
${formData.component?.toLowerCase().includes('ups') ? `
UPS SPECIFIC - ${formData.manufacturer} ${formData.modelNumber}:
- Input Power: ${formData.manufacturer === 'Liebert' ? '480VAC 3-phase typical' : '480VAC 3-phase input'}
- DC Bus Voltage: ${formData.modelNumber?.includes('NX') ? '480-540VDC' : 'Battery string voltage per specs'}
- Output Power: Verify critical load voltage requirements
- Battery Type: ${formData.manufacturer === 'Liebert' ? 'VRLA or Wet Cell per model' : 'Check battery configuration'}
- Arc Flash PPE: Category 2-3 for DC bus work
- Special Tools: ${formData.manufacturer} monitoring interface cable
` : ''}
${formData.component?.toLowerCase().includes('generator') ? `
GENERATOR SPECIFIC - ${formData.manufacturer} ${formData.modelNumber}:
- Starting System: ${formData.manufacturer === 'Caterpillar' ? '24VDC starting batteries' : '12VDC or 24VDC starting system'}
- Control Voltage: ${formData.manufacturer === 'Caterpillar' ? '24VDC control circuits' : 'Verify control voltage'}
- Output Voltage: ${formData.modelNumber?.includes('3512') ? '480VAC 3-phase' : 'Check nameplate rating'}
- Transfer Switch: Verify ATS model and control requirements
- Arc Flash PPE: Category based on generator output rating
- Special Tools: ${formData.manufacturer === 'Caterpillar' ? 'CAT ET diagnostic tool' : 'Manufacturer diagnostic tool'}
- Additional PPE: Hearing protection mandatory, CO detector required
` : ''}
${formData.component?.toLowerCase().includes('pdu') ? `
PDU SPECIFIC - ${formData.manufacturer} ${formData.modelNumber}:
- Input Voltage: Verify main breaker rating and voltage
- Transformer: ${formData.modelNumber?.includes('Transform') ? 'Check tap settings' : 'N/A if non-transformer PDU'}
- Branch Circuits: Document all branch circuit ratings
- Monitoring: ${formData.manufacturer} monitoring system voltage requirements
- Arc Flash PPE: Category based on available fault current
- Special Tools: Circuit tracer for branch identification
` : ''}
${formData.component?.toLowerCase().includes('crac') || formData.component?.toLowerCase().includes('crah') ? `
CRAC/CRAH SPECIFIC - ${formData.manufacturer} ${formData.modelNumber}:
- Fan Motor Power: ${formData.manufacturer === 'Liebert' ? '460VAC 3-phase typical' : '480VAC 3-phase'}
- Control Power: 24VAC control transformer standard
- Humidifier: ${formData.component?.includes('CRAH') ? 'N/A for CRAH units' : 'Check humidifier power requirements'}
- Refrigerant: ${formData.component?.includes('CRAH') ? 'N/A - Chilled water' : 'R-410A or R-407C typical'}
- Arc Flash PPE: Category 1-2 based on voltage
- Special Tools: ${formData.manufacturer} control interface, refrigerant gauges if DX
` : ''}

Emergency Details:
- Manufacturer: ${formData.manufacturer}
- Model Number: ${formData.modelNumber}
- Serial Number: ${formData.serialNumber || 'N/A'}
- Location: ${formData.location || 'N/A'}
- System: ${formData.system}
- Component/Equipment Type: ${formData.component}
- Emergency Type: ${formData.emergencyType}

Generate ONLY the content that goes inside the container div - no DOCTYPE, html, head, body, or container tags.
Start with <h1>Emergency Operating Procedure (EOP)</h1> followed by the Quick Response header div, then proceed with sections using H2 headers.

IMPORTANT: In Section 07, do NOT include PPE Requirements or Tools Required subsections - these are now in Section 03 where they're needed immediately.
Include ALL 8 sections with complete, detailed content and INTERACTIVE INPUT FIELDS as specified above.

CRITICAL FOR SECTION 03:
- FIRST add Pre-Action Safety & Equipment Requirements subsection with:
  * PPE requirements specific to ${formData.component} voltage and hazards
  * Tool requirements based on ${formData.manufacturer} ${formData.modelNumber}
  * Safety checkpoint with equipment-specific hazards
- Create a detailed diagnostic table with voltage verification specific to ${formData.component}
- Include actual expected voltages based on equipment type
- Add input fields for technician readings
- Include Pass/Fail checkboxes

CRITICAL FOR SECTION 04:
- Generate 4 complete scenarios for external power issues
- Each scenario must be specific to ${formData.component} equipment type
- Include verification tables with input fields
- Reference appropriate upstream power sources for this equipment

Use proper section numbering: "Section 01:", "Section 02:", etc. (zero-padded numbers).
Make sure all critical actions use the .critical-text class and emergency warnings use the .emergency-action or .emergency-warning classes.
CRITICAL: Generate content only - NO document structure tags (DOCTYPE, html, head, body, container div).`;

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro'
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedContent = response.text();
    
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
      generatedContent = `<h1>Emergency Operating Procedure (EOP)</h1>\n${generatedContent}`;
    }
    
    // Generate dynamic EOP title
    const eopTitle = `EOP - ${formData.manufacturer} ${formData.modelNumber} - ${formData.emergencyType}`;
    
    // Build complete HTML with dynamic title
    const completeHtml = HTML_TEMPLATE
      .replace('__EOP_TITLE__', eopTitle)
      .replace('{{CONTENT}}', generatedContent);
    
    // Extract EOP Identifier from generated content for filename
    let filename = '';
    try {
      // Try multiple regex patterns to extract EOP Identifier
      const identifierPatterns = [
        // Specific pattern for <b> or <strong> tags
        /EOP Identifier:<\/(?:b|strong|span)>\s*([A-Z0-9\-_]+)/i,
        // Broader pattern for any HTML tags after EOP Identifier:
        /EOP Identifier:.*?>\s*([A-Z0-9\-_]+)/i,
        // Even broader pattern that handles multiple tags and whitespace
        /EOP Identifier:[^>]*>.*?([A-Z0-9\-_]{3,})/i,
        // Simple pattern without HTML tags
        /EOP Identifier:\s*([A-Z0-9\-_]+)/i
      ];
      
      let eopIdentifier = '';
      let matchedPattern = -1;
      
      for (let i = 0; i < identifierPatterns.length; i++) {
        const identifierMatch = completeHtml.match(identifierPatterns[i]);
        if (identifierMatch && identifierMatch[1] && identifierMatch[1].trim().length >= 3) {
          eopIdentifier = identifierMatch[1].trim();
          matchedPattern = i;
          break;
        }
      }
      
      if (eopIdentifier) {
        console.log(`Extracted EOP Identifier using pattern ${matchedPattern}:`, eopIdentifier);
        
        // Sanitize the identifier to remove invalid filename characters
        const sanitizedIdentifier = eopIdentifier
          .replace(/[<>:"/\\|?*]/g, '_')  // Replace invalid Windows filename characters
          .replace(/\s+/g, '_')          // Replace spaces with underscores
          .replace(/[^\w\-_.]/g, '')     // Keep only alphanumeric, dash, underscore, dot
          .replace(/_{2,}/g, '_')        // Replace multiple underscores with single
          .trim();
        
        filename = `${sanitizedIdentifier}.html`;
      } else {
        // Fallback to current naming convention
        const date = new Date().toISOString().split('T')[0];
        const timestamp = Date.now();
        const safeManufacturer = formData.manufacturer.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
        const safeModel = formData.modelNumber.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
        filename = `EOP_${safeManufacturer}_${safeModel}_${date}_${timestamp}.html`;
        console.log('No EOP Identifier found, using current naming convention:', filename);
      }
    } catch (parseError) {
      console.error('Error parsing EOP Identifier:', parseError);
      // Fallback to current naming convention
      const date = new Date().toISOString().split('T')[0];
      const timestamp = Date.now();
      const safeManufacturer = formData.manufacturer.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
      const safeModel = formData.modelNumber.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
      filename = `EOP_${safeManufacturer}_${safeModel}_${date}_${timestamp}.html`;
      console.log('Error extracting identifier, using current naming convention:', filename);
    }

    // Save to blob storage
    const blob = await put(`eops/${filename}`, completeHtml, {
      access: 'public',
      contentType: 'text/html'
    });
    
    console.log('EOP generation complete:', filename);
    
    return NextResponse.json({ 
      success: true,
      filename: filename,
      url: blob.url,
      message: 'EOP generated successfully'
    });
    
  } catch (error) {
    console.error('EOP generation error:', error);
    
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
      error: 'Failed to generate EOP',
      details: error.message,
      userMessage: 'Unable to generate EOP. Please try again.'
    }, { status: 500 });
  }
}