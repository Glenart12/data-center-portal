import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROJECT_INSTRUCTIONS = `You are creating Emergency Operating Procedures (EOPs) for data center technicians. Generate COMPLETE, DETAILED EOPs with NO placeholders or summaries.

CRITICAL: This is for [EMERGENCY_TYPE_PLACEHOLDER] emergency response. Adapt all procedures based on the specific equipment type provided.

CRITICAL HTML GENERATION RULES:
- DO NOT generate DOCTYPE, html, head, body, or container div tags
- Generate ONLY the content that goes INSIDE the existing container div
- Start with the main H1 title, then proceed with sections
- Use H2 for all section headers (not H1)
- Use H3 for subsection headers
- The HTML template already provides the document structure

IMPORTANT: This EOP must be INTERACTIVE with editable input fields. Include HTML input elements throughout.

CRITICAL VARIABLE MAPPING for template placeholders:
- Use [MANUFACTURER_PLACEHOLDER] for Manufacturer (from Emergency Details)
- Use [MODEL_PLACEHOLDER] for Model Number (from Emergency Details)
- Use [SERIAL_PLACEHOLDER] for Serial Number (from Emergency Details)
- Use [COMPONENT_PLACEHOLDER] for Component Type (from Emergency Details)
- Use [EMERGENCY_TYPE_PLACEHOLDER] for Emergency Type/Work Description (from Emergency Details)
- Use [LOCATION_PLACEHOLDER] for Location/Data Center Location (from Emergency Details)
- Use [CUSTOMER_PLACEHOLDER] for Customer (from Emergency Details)
- Use [SITE_NAME_PLACEHOLDER] for Site Name (from Emergency Details)
- Use [SITE_ADDRESS_PLACEHOLDER] for Site Address (from Emergency Details)
- Use [SYSTEM_PLACEHOLDER] for System (from Emergency Details)
- Use [EQUIPMENT_NUMBER_PLACEHOLDER] for Equipment Number (from Emergency Details)

The EOP must follow this EXACT structure with INTERACTIVE ELEMENTS:

START WITH:
<h1>Emergency Operating Procedure (EOP)</h1>

<div style="background: #dc3545; color: white; padding: 30px; margin: 20px 0; border-radius: 5px; text-align: center;">
    <h2 style="font-size: 2.5em; margin: 0; color: white;">[COMPONENT_PLACEHOLDER] [EMERGENCY_TYPE_PLACEHOLDER]</h2>
</div>

<h2>Section 01: EOP Identification & Control</h2>
<table class="info-table">
    <tr>
        <td>EOP Title:</td>
        <td>[COMPONENT_PLACEHOLDER] - [EMERGENCY_TYPE_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>EOP Identifier:</td>
        <td><input type="text" placeholder="TO BE ASSIGNED" style="width:250px" /></td>
    </tr>
    <tr>
        <td>Version:</td>
        <td><input type="text" value="V1" style="width:80px" /></td>
    </tr>
    <tr>
        <td>Creation Date:</td>
        <td>[current_date]</td>
    </tr>
    <tr>
        <td>Work Description:</td>
        <td>[EMERGENCY_TYPE_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Component Type:</td>
        <td>[COMPONENT_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Manufacturer:</td>
        <td>[MANUFACTURER_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Model Number:</td>
        <td>[MODEL_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Serial Number:</td>
        <td>[SERIAL_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Equipment Number:</td>
        <td>[EQUIPMENT_NUMBER_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Location:</td>
        <td>[LOCATION_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Duration:</td>
        <td>[DURATION_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Level of Risk (LOR):</td>
        <td>[RISK_LEVEL_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>CET Level Required:</td>
        <td>[CET_LEVEL_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Author:</td>
        <td><input type="text" placeholder="Enter Author Name" style="width:250px" /></td>
    </tr>
    <tr>
        <td>Author CET Level:</td>
        <td><input type="text" placeholder="Enter Author CET Level" style="width:250px" /></td>
    </tr>
    <tr>
        <td>Approver:</td>
        <td><input type="text" placeholder="Enter Approver Name" style="width:250px" /></td>
    </tr>
</table>

<h2>Section 02: Site Information</h2>
<table class="info-table">
    <tr>
        <td>Customer:</td>
        <td>[CUSTOMER_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Site Name:</td>
        <td>[SITE_NAME_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Data Center Location:</td>
        <td>[LOCATION_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Site Address:</td>
        <td>[SITE_ADDRESS_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Site Contact:</td>
        <td>UPDATE NEEDED</td>
    </tr>
</table>

<h2>Section 03: EOP Overview</h2>
<table class="info-table">
    <tr>
        <td>EOP Title:</td>
        <td>[COMPONENT_PLACEHOLDER] - [EMERGENCY_TYPE_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Work Area:</td>
        <td><input type="text" placeholder="Enter work area" style="width:300px" /></td>
    </tr>
    <tr>
        <td>Building/Floor/Room:</td>
        <td><input type="text" placeholder="Enter building/floor/room" style="width:300px" /></td>
    </tr>
    <tr>
        <td>Access Requirements:</td>
        <td><input type="text" placeholder="Enter access requirements" style="width:400px" /></td>
    </tr>
    <tr>
        <td>Delivery Method:</td>
        <td>[DELIVERY_METHOD_PLACEHOLDER]</td>
    </tr>
    <tr>
        <td>Qualifications Required:</td>
        <td>PLACEHOLDER: AI must generate specific qualifications based on [EMERGENCY_TYPE_PLACEHOLDER] response complexity for [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]. Include certifications, training requirements, experience levels, and equipment-specific emergency response qualifications. FORMAT AS CLEAN HTML: Use ul and li tags. Use strong tags for emphasis. DO NOT output markdown asterisks</td>
    </tr>
    <tr>
        <td>Immediate notifications required:</td>
        <td>PLACEHOLDER: AI must generate IMMEDIATE emergency notifications required based on equipment type [COMPONENT_PLACEHOLDER] and emergency type [EMERGENCY_TYPE_PLACEHOLDER]. These are IMMEDIATE notifications during an emergency, not advance notifications. Include who must be notified immediately upon emergency detection (operations team, facilities manager, customer representatives, etc.). FORMAT AS CLEAN HTML: Use ul and li tags for bullet points. Use strong tags for emphasis. DO NOT output markdown asterisks. Keep the same bullet point format as used in MOP/SOP.</td>
    </tr>
    <tr>
        <td>Post notifications required:</td>
        <td>PLACEHOLDER: AI must research and explain based on equipment type [COMPONENT_PLACEHOLDER] and emergency type [EMERGENCY_TYPE_PLACEHOLDER]. FORMAT AS CLEAN HTML: Use ul and li tags if listing multiple items. Use strong tags for emphasis. DO NOT output markdown asterisks</td>
    </tr>
</table>

<h2>Section 04: Immediate Emergency Actions - [WORK_DESCRIPTION] Diagnostics</h2>

<h3>Pre-Action Safety & Equipment Requirements</h3>

<div class="emergency-action" style="background: #fee; border: 2px solid #dc3545; padding: 15px; margin: 20px 0;">
<h4>⚠️ CRITICAL SAFETY CHECKPOINT - STOP Before Proceeding:</h4>
<p><strong>Equipment-Specific PPE Requirements for [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]:</strong></p>

Generate PPE requirements based on the SPECIFIC equipment type and voltage:
- For 480V 3-phase equipment (chillers, large motors): Arc Flash Category 2 PPE minimum
- For 208V/240V equipment: Arc Flash Category 1 PPE
- For DC systems (UPS batteries): Acid-resistant gloves, face shield
- For refrigerant systems: SCBA or respirator if leak suspected
- For generators: Hearing protection, CO monitor

<table>
<tr>
  <th>PPE Item</th>
  <th>Specification for [MODEL_PLACEHOLDER]</th>
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

<p><strong>Required Tools & Test Equipment for [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]:</strong></p>

Generate tool list based on the SPECIFIC equipment model:
- For Carrier 19XRV5P5: Carrier CCN interface tool, specific control board diagnostic tools
- For Trane CVHE: Tracer SC+ interface, oil pressure gauges
- For Caterpillar generators: CAT ET diagnostic tool
- For Liebert UPS: Liebert monitoring interface cable

<table>
<tr>
  <th>Tool/Equipment</th>
  <th>Specific Model/Type for [MODEL_PLACEHOLDER]</th>
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
  <td>[Specific tool for [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]]</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>LOTO Equipment</td>
  <td>Lockout devices for [breaker type/disconnect type]</td>
  <td><input type="checkbox" /></td>
</tr>
</table>

<p><strong>[MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER] Specific Safety Requirements:</strong></p>
<ul>
<li>□ Verify de-energization procedures per [MANUFACTURER_PLACEHOLDER] service manual</li>
<li>□ Check for stored energy in [capacitors/VFDs/control circuits] specific to this model</li>
<li>□ Review [MANUFACTURER_PLACEHOLDER] emergency shutdown sequence</li>
<li>□ Confirm [equipment-specific hazards: refrigerant pressure, battery acid, hot surfaces, etc.]</li>
<li>□ Emergency contact for [MANUFACTURER_PLACEHOLDER] technical support ready: <input type="text" placeholder="Support #" style="width:150px" /></li>
</ul>

<div style="background: #dc3545; color: white; padding: 10px; margin: 10px 0; font-weight: bold; text-align: center;">
DO NOT PROCEED until all safety requirements are verified for [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]
</div>
</div>

<h3>Internal Equipment Diagnostics for [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]</h3>
<p><strong>Perform systematic internal component checks to identify the source of [WORK_DESCRIPTION]</strong></p>

CRITICAL AI INSTRUCTIONS FOR DYNAMIC DIAGNOSTIC GENERATION:

1. ANALYZE THE SPECIFIC SITUATION:
   - Equipment type from [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]
   - Emergency type from [WORK_DESCRIPTION]
   - Determine the technical nature of the failure

2. DETERMINE LOTO REQUIREMENT:
   Analyze [WORK_DESCRIPTION] to determine if Lockout/Tagout is needed:
   - LOTO REQUIRED for: electrical failures, mechanical repairs, internal component access, bearing failures, motor issues, compressor problems, any physical inspection of energized components
   - LOTO NOT REQUIRED for: communication failures, software issues, sensor alarms only, network problems, monitoring issues, display errors
   - CONDITIONAL LOTO: high temp alarms, flow issues - only if physical inspection needed

3. GENERATE APPROPRIATE NUMBER OF DIAGNOSTIC STEPS:
   Based on equipment complexity and emergency type:
   - Simple sensor failure on basic equipment: Generate 3-5 diagnostic steps
   - Complex compressor failure on chiller: Generate 15-25 diagnostic steps  
   - UPS battery failure: Generate 10-15 diagnostic steps
   - Generator won't start: Generate 20-30 diagnostic steps
   - Communication loss: Generate 3-5 steps (no LOTO)
   - Bearing failure on pump: Generate 10-15 steps (with LOTO)
   
4. IF LOTO IS REQUIRED - CRITICAL SEQUENCING:
   Structure the diagnostic table in this EXACT order:
   a) FIRST: Generate ALL diagnostic steps that can be done with power ON
      - Control panel readings
      - Display checks
      - Voltage measurements at disconnect
      - Current measurements
      - Temperature readings
      - Pressure readings
      - Any remote diagnostics
   
   b) THEN: Insert a CLEAR LOTO STEP with red warning:
      <tr style="background-color: #dc3545; color: white;">
        <td>[step#]</td>
        <td><strong>⚠️ CRITICAL: APPLY LOCKOUT/TAGOUT PROCEDURE NOW</strong></td>
        <td>De-energize equipment per OSHA 1910.147 and verify zero energy state</td>
        <td>LOTO Applied: <input type="checkbox" /></td>
        <td>Verified: <input type="checkbox" /></td>
      </tr>
   
   c) FINALLY: Generate ALL steps requiring de-energized state
      - Physical component inspection
      - Megohmmeter testing
      - Mechanical checks
      - Internal wiring inspection
      - Component replacement checks

5. IF LOTO NOT REQUIRED:
   - Generate ONLY diagnostic steps that are safe with equipment energized
   - DO NOT include any LOTO step
   - Focus on control system checks, communication, software, displays

6. EQUIPMENT-SPECIFIC DIAGNOSTIC EXAMPLES:
   For CHILLERS with compressor failure: Check suction/discharge pressures, oil pressure, superheat, subcooling, motor amps, vibration, control board errors, safety switches, THEN LOTO, then check motor windings, mechanical components
   For UPS with battery failure: Check DC bus voltage, individual battery voltages, charging current, temperature, THEN LOTO if replacing batteries
   For GENERATORS that won't start: Check starting battery voltage, fuel pressure, control panel, safety shutdowns, transfer switch position, THEN LOTO for starter motor inspection
   For PUMPS with bearing failure: Check vibration readings, motor amps, temperature, THEN LOTO, then inspect bearings, shaft alignment, coupling
   For BMS communication loss: Check network connectivity, protocol settings, addressing - NO LOTO NEEDED

7. CRITICAL EQUIPMENT NAMING CONVENTION:
   DO NOT generate fake equipment identifiers or numbers:
   - DO NOT create identifiers like (PMP-CW-1), MCC-CH-1, CT-1, CHILLER-1, GEN-1, UPS-A, etc.
   - Instead use generic descriptions: "condenser water pump", "upstream breaker", "cooling tower", "supply fan"
   - Reference the main equipment as "the [MANUFACTURER_PLACEHOLDER] [equipment type]" (e.g., "the Carrier chiller", "the Cummins generator")
   - If specific equipment designation is needed, use: "[Equipment ID to be verified on-site]"
   - For components, use descriptive names: "main control board", "compressor motor", "discharge pressure sensor"
   
<table>
<tr>
  <th>Step Number</th>
  <th>Internal Component to Check</th>
  <th>Expected Reading/Condition</th>
  <th>Actual Reading</th>
  <th>Pass/Fail</th>
</tr>

GENERATE DYNAMIC NUMBER OF ROWS HERE based on the analysis above. 
- Start with step 1 and continue sequentially
- Number of steps must match the complexity determined in instruction #3
- Follow the EXACT sequence from instruction #4 if LOTO is required
- Each step must be specific to [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER] and [WORK_DESCRIPTION]
- Use proper technical terminology for the specific equipment type
- Include measurement units (VAC, VDC, PSI, °F, Hz, etc.) where applicable

</table>

<div style="background: #fff3cd; border: 2px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
<strong>⚠️ WARNING:</strong> If internal diagnostics do not identify the cause of [WORK_DESCRIPTION], proceed to Section 05 for external equipment diagnostics.
</div>

<h2>Section 05: [WORK_DESCRIPTION] Detection External Response Actions</h2>
<p><strong>Verify all external equipment and systems that connect to or support the [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]</strong></p>

CRITICAL AI INSTRUCTIONS FOR DYNAMIC EXTERNAL EQUIPMENT ANALYSIS:

1. IDENTIFY ALL CONNECTED SYSTEMS:
   Analyze [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER] to determine ALL external equipment that could affect or cause [WORK_DESCRIPTION]:
   - POWER CHAIN: Trace from utility to equipment (transformers, switchgear, panels, breakers, ATS, generators, UPS)
   - MECHANICAL SUPPORT: Identify cooling, ventilation, pumping systems
   - CONTROL SYSTEMS: BMS, SCADA, VFDs, control panels
   - AUXILIARY SYSTEMS: Any equipment this unit depends on or supplies

2. DETERMINE NUMBER OF EXTERNAL CHECKS:
   Based on system integration complexity:
   - Simple standalone equipment (window AC, small pump): Generate 3-5 external checks
   - Moderately integrated (CRAC unit, standard generator): Generate 6-10 external checks
   - Highly integrated chiller system: Generate 12-18 external checks  
   - Critical infrastructure UPS: Generate 10-15 external checks
   - Complex switchgear/PDU: Generate 8-12 external checks

3. PRIORITIZE BY FAILURE PROBABILITY:
   Order checks from most likely to least likely cause of [WORK_DESCRIPTION]:
   - If power failure: Start with immediate upstream power (breaker, panel, ATS)
   - If cooling issue: Start with cooling support systems
   - If communication failure: Start with network infrastructure
   - If mechanical failure: Start with related mechanical systems

4. EQUIPMENT-SPECIFIC EXTERNAL DEPENDENCIES:

   CHILLERS require checking:
   - Cooling tower operation and fans
   - Condenser water pumps and flow
   - Chilled water pumps and flow  
   - Isolation and control valves
   - VFDs controlling pumps
   - BMS setpoints and commands
   - Make-up water systems
   
   UPS SYSTEMS require checking:
   - Input switchgear and breakers
   - Maintenance bypass switch position
   - Output distribution panels
   - Static transfer switch
   - Battery disconnect switches
   - Parallel UPS modules (if applicable)
   - Generator interface (if on emergency power)
   
   GENERATORS require checking:
   - Fuel supply system and day tanks
   - Transfer switches (all connected ATSs)
   - Paralleling switchgear (if applicable)
   - Load bank connections
   - Battery charger operation
   - Block heater operation
   - Remote start signals
   
   CRAC/CRAH UNITS require checking:
   - Chilled water supply temperature and flow
   - Condenser water (if water-cooled)
   - Humidification water supply
   - Hot water/steam for reheat (if applicable)
   - BMS control signals
   - Static pressure sensors
   
   PDUs require checking:
   - Upstream switchgear
   - Input breakers from multiple sources
   - Static transfer switches
   - Subfeed breakers
   - Monitoring system communication
   
   PUMPS require checking:
   - Motor control center (MCC)
   - Pressure tanks and switches
   - Control/isolation valves
   - Flow sensors and switches
   - VFD or soft starter
   - Suction source availability

5. GENERATE FAILURE-MODE SPECIFIC CHECKS:
   Each external check must explain:
   - What specific failure mode it could cause
   - How it connects to the main equipment
   - What to verify to rule it out as the cause

6. CRITICAL EQUIPMENT NAMING CONVENTION:
   DO NOT generate fake equipment identifiers or numbers:
   - DO NOT create identifiers like (PMP-CW-1), MCC-CH-1, CT-1, CHILLER-1, ATS-A, PDU-2B, etc.
   - Instead use generic descriptions: "condenser water pump", "cooling tower fan", "upstream breaker", "distribution panel"
   - Reference the main equipment as "the [MANUFACTURER_PLACEHOLDER] [equipment type]" (e.g., "the Trane chiller", "the Liebert UPS")
   - For external equipment, use descriptive names: "main distribution panel", "automatic transfer switch", "building management system"
   - If specific equipment designation is needed, use: "[Equipment ID to be verified on-site]"
   - DO NOT use made-up designations like CHILLER-1, GEN-SET-A, UPS-B, PDU-1, etc.

<table>
<tr>
  <th>Step Number</th>
  <th>External Equipment/System to Check</th>
  <th>Connection to [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]</th>
  <th>Potential Failure Mode Causing [WORK_DESCRIPTION]</th>
  <th>Verification Method</th>
  <th>Actual Status</th>
  <th>Pass/Fail</th>
</tr>

GENERATE DYNAMIC NUMBER OF ROWS HERE based on the analysis above:
- Start with step 1 and continue sequentially
- Number of steps must match the complexity determined in instruction #2
- Order by likelihood of causing [WORK_DESCRIPTION] per instruction #3
- Each external system must be specific to the actual equipment installation
- Include how each external system could specifically cause [WORK_DESCRIPTION]
- Provide clear verification methods with expected values
- Cover ALL systems that connect to or support [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]

</table>

<h2>Section 06: Communication & Escalation Protocol</h2>

<h3>Escalation Matrix</h3>
Create an escalation table with contact levels 0-3 (DO NOT include emergency services row as they are in the Emergency Contacts table below):
- Level 0: Initial Response Team
- Level 1: Facility Manager/Supervisor  
- Level 2: Operations Manager
- Level 3: Executive/Director Level
Include phone number fields: <input type="text" placeholder="Enter phone" style="width:150px" />
Include contact name fields: <input type="text" placeholder="Enter contact name" style="width:200px" />

<h3>Emergency Contacts</h3>
Include a comprehensive Emergency Contacts table with columns: Service Type, Contact Name/Organization, Phone Number, Notes/Address

Include these essential emergency contacts:
- Police/Fire/EMS Emergency: 911 (combined single row)
- Electric Utility Emergency: <input type="text" placeholder="Enter utility emergency #" style="width:150px" />
- Equipment Manufacturer Support: INTELLIGENTLY POPULATE based on [MANUFACTURER_PLACEHOLDER]:
  * For Carrier equipment: Suggest "Carrier Commercial Service: 1-800-CARRIER (1-800-227-7437)"
  * For Trane equipment: Suggest "Trane Commercial Service: 1-800-884-2653"
  * For York equipment: Suggest "York Service: 1-800-861-1001"
  * For Liebert/Vertiv equipment: Suggest "Vertiv Services: 1-800-543-2378"
  * For Cummins generators: Suggest "Cummins Power Generation: 1-800-888-6626"
  * For Caterpillar equipment: Suggest "CAT 24-Hour Support: 1-877-228-3519"
  * For Eaton UPS: Suggest "Eaton Service: 1-800-356-5794"
  * For other manufacturers: Use placeholder <input type="text" placeholder="Enter [MANUFACTURER_PLACEHOLDER] support #" style="width:150px" />
- Electrical Contractor: <input type="text" placeholder="Enter contractor #" style="width:150px" />
- Mechanical Contractor: <input type="text" placeholder="Enter contractor #" style="width:150px" />
- Facilities Manager: <input type="text" placeholder="Enter facilities manager #" style="width:150px" />

Add this important note at the bottom of the Emergency Contacts section:
"⚠️ IMPORTANT: Verify all emergency contact numbers for your specific facility location. Update phone numbers as needed."

<h2>Section 07: Recovery & Return to Service</h2>
<h3>[WORK_DESCRIPTION] Resolution and Equipment Recovery Procedures</h3>
<p>Follow these steps in sequence to safely restore the [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER] to normal operation after [WORK_DESCRIPTION] has been resolved:</p>

<ol>
  <li>
    <strong>[WORK_DESCRIPTION] Resolution Verification</strong>
    <p>Confirm stable operating conditions are available at all system levels:</p>
    <ul>
      <li>Verify [WORK_DESCRIPTION] resolution at main equipment</li>
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
      <li>Confirm no personnel are working on the [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]</li>
      <li>Reset all emergency stops and safety interlocks</li>
      <li>Check control system availability: <input type="text" placeholder="Control parameters" style="width:100px" /> VAC</li>
    </ul>
  </li>
  
  <li>
    <strong>Equipment-Specific Restart Sequence</strong>
    <p>Follow the manufacturer-specific startup procedure for [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]:</p>
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

<h2>Section 08: Supporting Information</h2>
<h3>Critical Infrastructure Locations</h3>
<table>
  <tr>
    <th>Infrastructure Element</th>
    <th>Location Details</th>
    <th>Access Requirements</th>
  </tr>
  <tr>
    <td><strong>[MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER] Location</strong></td>
    <td><input type="text" placeholder="Enter exact location (Room/Row/Rack)" style="width:250px" /></td>
    <td><input type="text" placeholder="Badge/Key required" style="width:150px" /></td>
  </tr>
  <tr>
    <td><strong>Main Control Panel</strong></td>
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
<p>Critical spare parts for [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER] emergency response:</p>
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
    <td>System Supply Module</td>
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
- <a href="#" style="color: #0070f3; text-decoration: underline;">Equipment System Drawings</a> (Internal Document)
- <a href="#" style="color: #0070f3; text-decoration: underline;">Single Line Diagram</a> (Internal Document)
- <a href="#" style="color: #0070f3; text-decoration: underline;">Arc Flash Study</a> (Internal Document)
- <a href="https://www.osha.gov/safety-and-health-topics" target="_blank" style="color: #0070f3; text-decoration: underline;">OSHA Safety Standards</a>
- <a href="https://www.nfpa.org/codes-and-standards" target="_blank" style="color: #0070f3; text-decoration: underline;">NFPA Safety Standards</a>

<h2>Section 09: EOP Approval & Review</h2>
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
        !formData?.component || !formData?.workDescription) {
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
    console.log('Work Description from user:', formData.workDescription);
    
    // Get current date for input fields
    const currentDate = new Date().toLocaleDateString('en-US');
    
    // Determine risk level based on component type and emergency type
    let riskLevel = 3; // Default to High for emergencies
    let riskJustification = "Emergency response procedure with critical system impact";
    
    const componentLower = (formData.component || '').toLowerCase();
    const emergencyType = (formData.workDescription || '').toLowerCase();
    
    // Risk level determination for EOP (emergencies are typically higher risk)
    if (emergencyType.includes('power') && componentLower.includes('switchgear')) {
      riskLevel = 4;
      riskJustification = "Critical system failure affecting main switchgear - facility-wide impact";
    } else if (emergencyType.includes('power') && (componentLower.includes('ups') || componentLower.includes('pdu'))) {
      riskLevel = 4;
      riskJustification = "System failure on critical distribution - IT load at risk";
    } else if (emergencyType.includes('power') && componentLower.includes('generator')) {
      riskLevel = 4;
      riskJustification = "Emergency system failure - no backup available";
    } else if (componentLower.includes('chiller') || componentLower.includes('crac')) {
      riskLevel = 3;
      riskJustification = "Critical cooling system emergency - temperature rise risk";
    } else if (emergencyType.includes('fire') || emergencyType.includes('smoke')) {
      riskLevel = 4;
      riskJustification = "Life safety emergency - immediate response required";
    } else if (emergencyType.includes('leak') || emergencyType.includes('flood')) {
      riskLevel = 3;
      riskJustification = "Water/refrigerant leak emergency - equipment damage risk";
    }
    
    // CET level determination for emergency response
    let cetLevel = 3; // Default to CET-3 for emergency response
    let cetJustification = "Emergency response requiring technical expertise";
    
    // Determine CET level based on emergency complexity
    if (componentLower.includes('switchgear') || emergencyType.includes('utility')) {
      cetLevel = 4;
      cetJustification = "High-voltage emergency response, utility coordination required";
    } else if (componentLower.includes('ups') || componentLower.includes('pdu')) {
      cetLevel = 3;
      cetJustification = "Critical system emergency response";
    } else if (componentLower.includes('generator')) {
      cetLevel = 3;
      cetJustification = "Emergency generator system troubleshooting and recovery";
    } else if (emergencyType.includes('alarm') || emergencyType.includes('monitoring')) {
      cetLevel = 2;
      cetJustification = "Alarm response and system monitoring";
    }
    
    // Duration determination for emergency procedures
    let duration = "30-60 minutes";
    if (emergencyType.includes('power') && componentLower.includes('switchgear')) {
      duration = "60-120 minutes";
    } else if (emergencyType.includes('power') && componentLower.includes('ups')) {
      duration = "30-90 minutes";
    } else if (emergencyType.includes('power') && componentLower.includes('generator')) {
      duration = "45-90 minutes";
    } else if (componentLower.includes('chiller')) {
      duration = "45-120 minutes";
    } else if (emergencyType.includes('shutdown')) {
      duration = "15-30 minutes";
    } else if (emergencyType.includes('transfer') || emergencyType.includes('bypass')) {
      duration = "30-60 minutes";
    }
    
    // Format risk level and CET level for display
    const riskLevelDisplay = `<strong>Level ${riskLevel}</strong> (${['Low', 'Medium', 'High', 'Critical'][riskLevel-1]})<br><em>${riskJustification}</em>`;
    const cetLevelDisplay = `<strong>CET-${cetLevel} required to perform work</strong><br><em>${cetJustification}</em>`;
    
    // Prepare the prompt for Gemini with calculated values
    const prompt = `${PROJECT_INSTRUCTIONS
      .replace('[current_date]', currentDate)
      .replace('[DURATION_PLACEHOLDER]', duration)
      .replace('[RISK_LEVEL_PLACEHOLDER]', riskLevelDisplay)
      .replace('[CET_LEVEL_PLACEHOLDER]', cetLevelDisplay)
      .replace(/\[MANUFACTURER_PLACEHOLDER\]/g, formData.manufacturer || 'UPDATE NEEDED')
      .replace(/\[MODEL_PLACEHOLDER\]/g, formData.modelNumber || 'UPDATE NEEDED')
      .replace(/\[SERIAL_PLACEHOLDER\]/g, formData.serialNumber || 'N/A')
      .replace(/\[EQUIPMENT_NUMBER_PLACEHOLDER\]/g, formData.equipmentNumber || 'N/A')
      .replace(/\[COMPONENT_PLACEHOLDER\]/g, formData.component || 'UPDATE NEEDED')
      .replace(/\[EMERGENCY_TYPE_PLACEHOLDER\]/g, formData.workDescription || 'Emergency Response')
      .replace(/\[WORK_DESCRIPTION\]/g, formData.workDescription || 'Emergency Response')
      .replace(/\[LOCATION_PLACEHOLDER\]/g, formData.location || 'Data Center')
      .replace(/\[SYSTEM_PLACEHOLDER\]/g, formData.system || 'UPDATE NEEDED')
      .replace(/\[CUSTOMER_PLACEHOLDER\]/g, formData.customer || 'UPDATE NEEDED')
      .replace(/\[SITE_NAME_PLACEHOLDER\]/g, formData.siteName || 'UPDATE NEEDED')
      .replace(/\[SITE_ADDRESS_PLACEHOLDER\]/g, formData.address ? 
        `${formData.address.street || ''}, ${formData.address.city || ''}, ${formData.address.state || ''} ${formData.address.zipCode || ''}`.trim() || 'UPDATE NEEDED' : 
        'UPDATE NEEDED')
      .replace(/\[DELIVERY_METHOD_PLACEHOLDER\]/g, formData.deliveryMethod === 'subcontractor' ? 'Subcontractor' : 'Self-Delivered')}

CRITICAL EQUIPMENT TYPE: ${formData.component}
THIS IS A: ${formData.component?.toUpperCase()} - Make sure ALL procedures are specific to ${formData.component}

EMERGENCY TYPE FOCUS: ${formData.workDescription}
${(formData.workDescription || '').toLowerCase().includes('power') ? `
EMERGENCY RESPONSE - This EOP is specifically for ${formData.workDescription} response. 
Section 04 MUST include comprehensive diagnostics with verification tables.
Section 05 MUST include the 4 response scenarios with equipment-specific adaptations.
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
- Emergency Type: ${formData.workDescription}
Variables for template use:
- customer: ${formData.customer || 'UPDATE NEEDED'}
- siteName: ${formData.siteName || 'UPDATE NEEDED'}
- siteAddress: ${formData.address ? `${formData.address.street || ''}, ${formData.address.city || ''}, ${formData.address.state || ''} ${formData.address.zipCode || ''}` : 'UPDATE NEEDED'}

CALCULATED VALUES FOR SECTION 01:
- Duration: ${duration}
- Level of Risk (LOR): ${riskLevelDisplay}
- CET Level Required: ${cetLevelDisplay}

IMPORTANT: In Section 01, use these EXACT calculated values as provided above. The Duration, Level of Risk, and CET Level Required have been pre-calculated based on the equipment type and emergency scenario.

Generate ONLY the content that goes inside the container div - no DOCTYPE, html, head, body, or container tags.
Start with <h1>Emergency Operating Procedure (EOP)</h1> followed by the Quick Response header div, then proceed with sections using H2 headers.

IMPORTANT: In Section 08, do NOT include PPE Requirements or Tools Required subsections - these are now in Section 04 where they're needed immediately.
Include ALL 9 sections with complete, detailed content and INTERACTIVE INPUT FIELDS as specified above.

CRITICAL FOR SECTION 04:
- FIRST add Pre-Action Safety & Equipment Requirements subsection with:
  * PPE requirements specific to [COMPONENT_PLACEHOLDER] voltage and hazards
  * Tool requirements based on [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]
  * Safety checkpoint with equipment-specific hazards
- Create a detailed diagnostic table with voltage verification specific to [COMPONENT_PLACEHOLDER]
- Include actual expected voltages based on equipment type
- Add input fields for technician readings
- Include Pass/Fail checkboxes

CRITICAL FOR SECTION 05:
- Generate 4 complete scenarios for [WORK_DESCRIPTION] issues
- Each scenario must be specific to [COMPONENT_PLACEHOLDER] equipment type
- Include verification tables with input fields
- Reference appropriate upstream systems for this equipment

Use proper section numbering: "Section 01:", "Section 02:", etc. (zero-padded numbers).
Make sure all critical actions use the .critical-text class and emergency warnings use the .emergency-action or .emergency-warning classes.
CRITICAL: Generate content only - NO document structure tags (DOCTYPE, html, head, body, container div).`;

    // Debug logging to track what's being sent to AI
    console.log('=== AI PROMPT DEBUG ===');
    console.log('Work Description being sent to AI:', formData.workDescription);
    console.log('Equipment:', formData.manufacturer, formData.modelNumber);
    console.log('Component:', formData.component);
    console.log('Is power check triggered?:', (formData.workDescription || '').toLowerCase().includes('power'));
    console.log('Full prompt snippet being sent (first 500 chars):', prompt.substring(0, 500));
    console.log('Searching for hardcoded power references in prompt...');
    const powerMatches = prompt.match(/power failure|power outage|electrical failure/gi);
    console.log('Found hardcoded power references:', powerMatches ? powerMatches.length : 0, powerMatches || 'None');
    console.log('=== END AI PROMPT DEBUG ===');

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro'
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedContent = response.text();
    
    // Debug logging for AI response
    console.log('=== AI RESPONSE DEBUG ===');
    console.log('AI Response length:', generatedContent.length);
    console.log('AI Response snippet (first 300 chars):', generatedContent.substring(0, 300));
    const responseWorkDescMatches = generatedContent.match(new RegExp(formData.workDescription, 'gi'));
    console.log('Work description appears in response:', responseWorkDescMatches ? responseWorkDescMatches.length : 0, 'times');
    console.log('=== END AI RESPONSE DEBUG ===');
    
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
    const eopTitle = `EOP - ${formData.manufacturer} ${formData.modelNumber} - ${formData.workDescription}`;
    
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
      details: error.message || error.toString() || 'Unknown error',
      userMessage: 'Unable to generate EOP. Please try again.'
    }, { status: 500 });
  }
}