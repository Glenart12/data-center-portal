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
        <td>CRITICAL AI INSTRUCTION - ANALYZE THESE INPUTS TO DETERMINE REQUIRED QUALIFICATIONS:
        1. CET Level from Section 01: [CET_LEVEL_PLACEHOLDER] - This sets the MINIMUM certification level
        2. Level of Risk (LOR) from Section 01: [RISK_LEVEL_PLACEHOLDER] - Higher risk = more stringent requirements
        3. Equipment: [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER] - Determines manufacturer-specific certifications
        4. Emergency Type: [EMERGENCY_TYPE_PLACEHOLDER] - Defines specialized response skills needed
        5. Component Type: [COMPONENT_PLACEHOLDER] - Identifies system-specific expertise required
        
        GENERATE INTELLIGENT REQUIREMENTS BASED ON ANALYSIS:
        - For LOR 4 (Critical): REQUIRE lead technician with CET-4, manufacturer certification, 5+ years experience
        - For LOR 3 (High): REQUIRE CET-3 minimum, equipment-specific training, 3+ years experience  
        - For electrical emergencies on [MANUFACTURER_PLACEHOLDER] equipment: REQUIRE NFPA 70E certification, arc flash training
        - For refrigerant leaks: REQUIRE EPA 608 Universal certification, HAZMAT response training
        - For [MANUFACTURER_PLACEHOLDER] equipment: REQUIRE manufacturer-specific service certification (e.g., Carrier CCN certified, Trane Tracer certified)
        - For fire/life safety: REQUIRE emergency response team training, first aid/CPR certification
        - Based on [COMPONENT_PLACEHOLDER]: Add specific system expertise (chiller specialist, UPS technician, generator mechanic)
        
        OUTPUT FORMAT: Generate as clean HTML bullet list with REQUIRED (not suggested) qualifications:
        <ul>
        <li><strong>Minimum Certification:</strong> [Specific CET level based on inputs]</li>
        <li><strong>Manufacturer Requirement:</strong> [Specific to MANUFACTURER_PLACEHOLDER]</li>
        <li><strong>Emergency Response:</strong> [Based on EMERGENCY_TYPE_PLACEHOLDER severity]</li>
        <li><strong>Safety Certifications:</strong> [Based on electrical/mechanical/refrigerant hazards]</li>
        <li><strong>Experience Level:</strong> [Years based on LOR and complexity]</li>
        </ul>
        DO NOT use placeholders - generate actual requirements based on the emergency criticality</td>
    </tr>
    <tr>
        <td>Immediate notifications required:</td>
        <td>CRITICAL AI INSTRUCTION - DETERMINE IMMEDIATE NOTIFICATIONS BASED ON EMERGENCY ANALYSIS:
        ANALYZE THESE CRITICAL INPUTS:
        1. Level of Risk (LOR): [RISK_LEVEL_PLACEHOLDER] - Higher LOR = more stakeholders must be notified
        2. CET Level Required: [CET_LEVEL_PLACEHOLDER] - Higher CET = technical escalation required
        3. Equipment Criticality: [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER] on [COMPONENT_PLACEHOLDER]
        4. Emergency Type: [EMERGENCY_TYPE_PLACEHOLDER] - Determines urgency and scope of notifications
        5. System Impact: [SYSTEM_PLACEHOLDER] - Identifies affected systems and dependencies
        
        INTELLIGENT NOTIFICATION DETERMINATION RULES:
        FOR LOR 4 (CRITICAL) EMERGENCIES:
        - IMMEDIATELY notify: Site Director, Operations Manager, Customer Emergency Contact
        - IMMEDIATELY notify: Manufacturer 24/7 support for [MANUFACTURER_PLACEHOLDER]
        - IMMEDIATELY notify: All affected tenant representatives if multi-tenant facility
        - IMMEDIATELY page: On-call CET-4 certified technician
        
        FOR LOR 3 (HIGH) EMERGENCIES:
        - IMMEDIATELY notify: Facilities Manager, Shift Supervisor
        - IMMEDIATELY notify: Customer technical contact
        - IMMEDIATELY page: On-call CET-3 technician with [COMPONENT_PLACEHOLDER] expertise
        
        FOR SPECIFIC EMERGENCY TYPES:
        - Power/Electrical failures: Notify utility emergency desk, electrical contractor on-call
        - Cooling failures on [COMPONENT_PLACEHOLDER]: Notify mechanical contractor, adjacent zone managers
        - Fire/Smoke: Call 911 FIRST, then notify all building occupants, fire marshal
        - Refrigerant leak: Notify HAZMAT team, evacuate affected areas, EPA reporting if >50 lbs
        - Generator failure: Notify fuel supplier, generator service contractor
        - UPS failure: Notify all critical load customers within 5 minutes
        
        BASED ON [MANUFACTURER_PLACEHOLDER] EQUIPMENT:
        - Include manufacturer's emergency support line with contract number
        - Notify certified [MANUFACTURER_PLACEHOLDER] service partner in region
        
        OUTPUT FORMAT - Generate prioritized notification list as HTML:
        <ul>
        <li><strong>Priority 1 (0-5 minutes):</strong> [Most critical notifications based on emergency type]</li>
        <li><strong>Priority 2 (5-15 minutes):</strong> [Secondary stakeholders based on LOR]</li>
        <li><strong>Priority 3 (15-30 minutes):</strong> [Support and documentation contacts]</li>
        <li><strong>Manufacturer Support:</strong> [Specific [MANUFACTURER_PLACEHOLDER] emergency line]</li>
        <li><strong>Escalation Path:</strong> [Based on CET level and equipment criticality]</li>
        </ul>
        Generate ACTUAL REQUIRED notifications - not generic suggestions</td>
    </tr>
    <tr>
        <td>Post notifications required:</td>
        <td>CRITICAL AI INSTRUCTION - DETERMINE POST-EMERGENCY NOTIFICATIONS BASED ON RESOLUTION:
        ANALYZE EMERGENCY RESOLUTION CONTEXT:
        1. Level of Risk (LOR): [RISK_LEVEL_PLACEHOLDER] - Determines follow-up reporting requirements
        2. CET Level: [CET_LEVEL_PLACEHOLDER] - Identifies technical review requirements
        3. Equipment: [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER] - Warranty and service contract notifications
        4. Emergency Type Resolved: [EMERGENCY_TYPE_PLACEHOLDER] - Determines regulatory reporting
        5. Component Affected: [COMPONENT_PLACEHOLDER] - System restoration confirmations needed
        
        INTELLIGENT POST-NOTIFICATION RULES BASED ON EMERGENCY RESOLUTION:
        
        FOR LOR 4 (CRITICAL) RESOLUTION:
        - NOTIFY within 1 hour: Executive team with incident summary and restoration confirmation
        - NOTIFY within 2 hours: All affected customers with RFO (Reason for Outage) preliminary report
        - NOTIFY within 4 hours: Insurance carrier if equipment damage occurred
        - DOCUMENT within 24 hours: Full incident report for compliance records
        
        FOR LOR 3 (HIGH) RESOLUTION:
        - NOTIFY within 2 hours: Operations Manager with restoration details
        - NOTIFY within 4 hours: Customer technical contacts with service restoration confirmation
        - UPDATE within 8 hours: CMMS system with work completed and parts used
        
        BASED ON EMERGENCY TYPE RESOLVED:
        - Power restoration: Confirm with all affected tenants, update power quality logs
        - Cooling restored: Verify temperature normalization with affected zones, trend data review
        - Fire/Smoke cleared: Fire marshal final report, insurance documentation, air quality confirmation
        - Refrigerant leak sealed: EPA reporting if required, environmental compliance documentation
        - Generator restored: Update run-time logs, schedule follow-up load bank test
        - UPS restored: Battery analysis report, runtime verification, bypass cleared confirmation
        
        FOR [MANUFACTURER_PLACEHOLDER] EQUIPMENT:
        - Submit warranty claim if applicable for [MODEL_PLACEHOLDER]
        - Update [MANUFACTURER_PLACEHOLDER] service portal with incident details
        - Schedule follow-up inspection per manufacturer requirements
        - Order replacement parts for emergency stock based on what was used
        
        REGULATORY/COMPLIANCE NOTIFICATIONS:
        - Environmental: EPA notification for refrigerant loss >50 lbs within 24 hours
        - Safety: OSHA reporting if injury occurred within 8 hours
        - Utility: Coordinate with utility for power quality report if utility-caused
        - Building: Update building management system logs and emergency response records
        
        OUTPUT FORMAT - Generate time-based post-notification requirements as HTML:
        <ul>
        <li><strong>Immediate (within 1 hour):</strong> [Critical stakeholder confirmations based on LOR]</li>
        <li><strong>Short-term (1-4 hours):</strong> [Customer and management notifications]</li>
        <li><strong>Documentation (4-24 hours):</strong> [Reports and regulatory filings based on emergency type]</li>
        <li><strong>Follow-up (24-72 hours):</strong> [Manufacturer reporting, parts ordering, preventive actions]</li>
        <li><strong>Compliance Requirements:</strong> [Specific regulatory notifications if applicable]</li>
        </ul>
        Generate SPECIFIC post-emergency requirements based on the criticality and type of emergency resolved</td>
    </tr>
</table>

<h2>Section 04: Immediate Emergency Actions - [WORK_DESCRIPTION] Diagnostics</h2>

<h3>Pre-Action Safety & Equipment Requirements</h3>

<div class="emergency-action" style="background: #fee; border: 2px solid #dc3545; padding: 15px; margin: 20px 0;">
<h4>⚠️ CRITICAL SAFETY CHECKPOINT - STOP Before Proceeding:</h4>
<p><strong>Equipment-Specific PPE Requirements for [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]:</strong></p>

CRITICAL AI INSTRUCTION - DETERMINE REQUIRED PPE BASED ON EMERGENCY ANALYSIS:
ANALYZE THESE CRITICAL INPUTS FOR PPE DETERMINATION:
1. Emergency Type: [EMERGENCY_TYPE_PLACEHOLDER] - Defines primary hazard exposure
2. Equipment: [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER] - Determines voltage, chemical, mechanical hazards
3. Component Type: [COMPONENT_PLACEHOLDER] - Identifies system-specific PPE needs
4. Serial Number: [SERIAL_PLACEHOLDER] - May indicate specific model variations

ENHANCED EMERGENCY TYPE DETECTION AND PPE FILTERING:
FIRST, DETECT THE EMERGENCY TYPE FROM [WORK_DESCRIPTION] AND [EMERGENCY_TYPE_PLACEHOLDER]:
- IF emergency contains "refrigerant", "leak", "chemical", "R-134a", "R-410A", "ammonia": 
  SET PPE_FOCUS = CHEMICAL_RESPIRATORY
  EXCLUDE arc flash PPE UNLESS [WORK_DESCRIPTION] explicitly mentions "opening electrical panels", "electrical isolation", or "power work"
- IF emergency contains "electrical", "power", "voltage", "breaker", "transformer", "VFD":
  SET PPE_FOCUS = ELECTRICAL_ARC_FLASH
  REQUIRE full arc flash PPE based on voltage level
- IF emergency contains "mechanical", "bearing", "vibration", "alignment", "belt":
  SET PPE_FOCUS = MECHANICAL_HAZARDS
  INCLUDE arc flash PPE ONLY if [WORK_DESCRIPTION] mentions "electrical isolation required" or "LOTO procedures"
- IF emergency contains "cooling", "thermal", "temperature", "heat exchanger" (but NOT "leak"):
  SET PPE_FOCUS = THERMAL_STANDARD
  EXCLUDE arc flash PPE unless electrical work is explicitly mentioned

APPLY PPE_FOCUS FILTER TO ALL FOLLOWING REQUIREMENTS (preserve all logic, filter output):

INTELLIGENT PPE DETERMINATION BASED ON EMERGENCY + EQUIPMENT:

FOR ELECTRICAL EMERGENCIES on [MANUFACTURER_PLACEHOLDER] equipment:
- Power failure/electrical fault on 480V equipment: REQUIRE Arc Flash Category 2-4 PPE (based on incident energy)
- UPS/PDU emergencies with DC bus exposure: REQUIRE Class 2 rubber gloves, arc flash suit, face shield
- Generator electrical issues: REQUIRE Category 2 arc flash PPE, hearing protection mandatory
- Control circuit work (24-120VAC): REQUIRE Category 0-1 PPE minimum

FOR REFRIGERANT EMERGENCIES on [MANUFACTURER_PLACEHOLDER] chillers/CRAC:
- Refrigerant leak on [MODEL_PLACEHOLDER]: REQUIRE SCBA or supplied air respirator, chemical gloves
- R-134a leak: REQUIRE full-face respirator with organic vapor cartridge
- R-410A high pressure leak: REQUIRE face shield, cryogenic gloves for liquid contact
- Ammonia systems: REQUIRE Level B hazmat suit, SCBA mandatory

FOR MECHANICAL/THERMAL EMERGENCIES:
- Bearing failure/hot surface on rotating equipment: REQUIRE heat-resistant gloves (500°F rated)
- Compressor failure with oil exposure: REQUIRE oil-resistant gloves, safety glasses
- High temperature alarm response: REQUIRE heat-resistant PPE, infrared thermometer

FOR MANUFACTURER-SPECIFIC REQUIREMENTS:
- Carrier equipment: Follow Carrier Safety Manual PPE matrix for [MODEL_PLACEHOLDER]
- Trane equipment: Comply with Trane Service First PPE requirements
- Caterpillar generators: CAT-specified hearing protection (NRR 30+) and safety boots
- Liebert/Vertiv UPS: Vertiv arc flash PPE per equipment label

EMERGENCY SEVERITY MULTIPLIER:
- If [EMERGENCY_TYPE_PLACEHOLDER] includes "fire" or "smoke": ADD SCBA, flame-resistant clothing
- If [EMERGENCY_TYPE_PLACEHOLDER] includes "flood" or "water": ADD electrical boots, waterproof suit
- If [EMERGENCY_TYPE_PLACEHOLDER] includes "chemical": ADD chemical suit appropriate to hazard

<table>
<tr>
  <th>PPE Item</th>
  <th>Specification for [MODEL_PLACEHOLDER]</th>
  <th>Verified</th>
</tr>
APPLY PPE_FOCUS FILTER HERE:
- IF PPE_FOCUS = CHEMICAL_RESPIRATORY: Skip arc flash row unless electrical work detected
- IF PPE_FOCUS = ELECTRICAL_ARC_FLASH: Include arc flash row with full specifications
- IF PPE_FOCUS = MECHANICAL_HAZARDS: Include arc flash row only if electrical isolation mentioned
- IF PPE_FOCUS = THERMAL_STANDARD: Skip arc flash row unless electrical work mentioned
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

CRITICAL AI INSTRUCTION - DETERMINE REQUIRED TOOLS BASED ON EMERGENCY + EQUIPMENT:
ANALYZE THESE INPUTS FOR TOOL REQUIREMENTS:
1. Emergency Type: [EMERGENCY_TYPE_PLACEHOLDER] - Determines diagnostic and response tools needed
2. Manufacturer: [MANUFACTURER_PLACEHOLDER] - Defines proprietary diagnostic tools required
3. Model Number: [MODEL_PLACEHOLDER] - Specifies exact interface tools and adapters
4. Serial Number: [SERIAL_PLACEHOLDER] - May indicate special tool requirements for variants

ENHANCED EMERGENCY TYPE DETECTION FOR LOTO REQUIREMENTS:
FIRST, ANALYZE [WORK_DESCRIPTION] AND [EMERGENCY_TYPE_PLACEHOLDER] TO SET LOTO FLAG:
- IF emergency contains "refrigerant", "leak", "chemical" AND NO mention of "electrical panels", "power isolation":
  SET LOTO_REQUIRED = FALSE (refrigerant work without electrical involvement)
  FOCUS on refrigerant tools, gauges, recovery equipment
- IF emergency contains "electrical", "power", "breaker", "transformer", "VFD", "voltage":
  SET LOTO_REQUIRED = TRUE (electrical work always requires LOTO)
  INCLUDE full electrical LOTO procedures and devices
- IF emergency contains "mechanical", "bearing", "vibration", "belt" AND mentions "accessing moving parts", "internal components":
  SET LOTO_REQUIRED = TRUE (mechanical isolation needed)
  INCLUDE mechanical and electrical LOTO as needed
- IF emergency contains "cooling", "thermal", "temperature" WITHOUT "leak" AND NO mention of electrical work:
  SET LOTO_REQUIRED = FALSE (monitoring/adjustment only)
  FOCUS on diagnostic and temperature measurement tools
- DEFAULT: If unclear or mixed hazards, SET LOTO_REQUIRED = TRUE (safer approach)

APPLY LOTO_REQUIRED FLAG TO TOOL SELECTION (preserve all existing logic):

INTELLIGENT TOOL DETERMINATION BY EMERGENCY TYPE:

FOR POWER/ELECTRICAL EMERGENCIES on [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]:
- REQUIRE: True RMS multimeter (Fluke 87V or equivalent) rated for equipment voltage
- REQUIRE: Clamp meter capable of measuring equipment FLA (Full Load Amps)
- REQUIRE: Non-contact voltage detector appropriate for voltage level
- REQUIRE: Insulation resistance tester (megohmmeter) for motor/transformer testing
- REQUIRE: Power quality analyzer if power disturbance suspected
- REQUIRE: Infrared thermal camera for hot spot detection

FOR REFRIGERANT/COOLING EMERGENCIES on [MANUFACTURER_PLACEHOLDER] equipment:
- REQUIRE: Digital refrigerant manifold gauges compatible with refrigerant type
- REQUIRE: Electronic leak detector certified for refrigerant in [MODEL_PLACEHOLDER]
- REQUIRE: Refrigerant recovery machine if leak repair needed
- REQUIRE: Vacuum pump and micron gauge for system evacuation
- REQUIRE: Temperature probes for superheat/subcooling calculations
- REQUIRE: Refrigerant scale for charging

FOR MECHANICAL EMERGENCIES:
- REQUIRE: Vibration analyzer for bearing/alignment issues
- REQUIRE: Dial indicators for shaft alignment verification
- REQUIRE: Torque wrenches calibrated to manufacturer specs
- REQUIRE: Borescope for internal inspection without disassembly
- REQUIRE: Oil analysis kit for compressor/bearing diagnostics

MANUFACTURER-SPECIFIC DIAGNOSTIC TOOLS:
FOR CARRIER EQUIPMENT:
- [MODEL_PLACEHOLDER] requires: CCN Service Tool, i-Vu interface, or Carrier Service Assistant
- Carrier 19XR series: ComfortVIEW interface tool mandatory
- Carrier 30XA/30HX: Pro-Dialog+ handheld required

FOR TRANE EQUIPMENT:
- [MODEL_PLACEHOLDER] requires: Tracer TU service tool or Tracer SC+ interface
- CVHE/CVHF chillers: CH530 service tool required
- IntelliPak units: Rover service tool needed

FOR CATERPILLAR GENERATORS:
- [MODEL_PLACEHOLDER] requires: CAT Electronic Technician (ET) with current license
- CAT 3500 series: Multi-pin diagnostic adapter required
- EMCP controllers: CAT Communication Adapter III

FOR LIEBERT/VERTIV UPS:
- [MODEL_PLACEHOLDER] requires: Liebert IntelliSlot communication cable
- NX/NXL series: Unity card interface tool
- APM series: Life.net diagnostic software

FOR YORK EQUIPMENT:
- [MODEL_PLACEHOLDER] requires: OptiView Control Center interface
- YK chillers: ISN network tool required

EMERGENCY-SPECIFIC ADDITIONS:
- If [EMERGENCY_TYPE_PLACEHOLDER] includes "communication": ADD protocol analyzer, network tester
- If [EMERGENCY_TYPE_PLACEHOLDER] includes "water/flood": ADD moisture meter, pump equipment
- If [EMERGENCY_TYPE_PLACEHOLDER] includes "fire/smoke": ADD gas detector, thermal imaging camera

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
APPLY LOTO_REQUIRED FLAG HERE:
- IF LOTO_REQUIRED = TRUE: Include this LOTO row with full specifications
- IF LOTO_REQUIRED = FALSE: Skip this LOTO row entirely (not needed for this emergency type)
<tr>
  <td>LOTO Equipment</td>
  <td>Lockout devices for [breaker type/disconnect type]</td>
  <td><input type="checkbox" /></td>
</tr>
</table>

<p><strong>[MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER] Specific Safety Requirements:</strong></p>

CRITICAL AI INSTRUCTION - GENERATE SAFETY REQUIREMENTS BASED ON EMERGENCY + EQUIPMENT:
ANALYZE THESE INPUTS FOR SAFETY PROTOCOL DETERMINATION:
1. Emergency Type: [EMERGENCY_TYPE_PLACEHOLDER] - Defines immediate safety priorities
2. Manufacturer: [MANUFACTURER_PLACEHOLDER] - Determines OEM safety protocols
3. Model Number: [MODEL_PLACEHOLDER] - Specifies exact safety procedures and hazards
4. Component Type: [COMPONENT_PLACEHOLDER] - Identifies system-specific safety requirements

INTELLIGENT SAFETY REQUIREMENTS BY MANUFACTURER AND EMERGENCY:

FOR CARRIER EQUIPMENT EMERGENCIES:
<ul>
<li>□ CRITICAL: For [MODEL_PLACEHOLDER] follow Carrier Emergency Response Protocol in Service Manual Section 3</li>
<li>□ For electrical emergencies: Verify 5-minute capacitor discharge time on VFD before access</li>
<li>□ For refrigerant emergencies: Confirm pressure relief valve operation, ventilation rate >4 ACH</li>
<li>□ Carrier 19XR series: Wait 15 minutes after shutdown for bearing oil to settle</li>
<li>□ Implement Carrier LOTO procedure: Main disconnect + control circuit breaker + VFD disconnect</li>
<li>□ Emergency contact: Carrier 24/7 Support 1-800-CARRIER with contract #: <input type="text" placeholder="Contract #" style="width:100px" /></li>
</ul>

FOR TRANE EQUIPMENT EMERGENCIES:
<ul>
<li>□ CRITICAL: For [MODEL_PLACEHOLDER] implement Trane Emergency Shutdown Sequence per IOM manual</li>
<li>□ For power emergencies: Verify Adaptive Frequency Drive capacitor discharge (10 minutes minimum)</li>
<li>□ For refrigerant emergencies: Activate purge unit, verify ventilation before entry</li>
<li>□ CVHE/CVHF: Check oil pressure must remain >18 PSID during coast-down</li>
<li>□ Tracer controls: Place in Emergency Override mode before manual intervention</li>
<li>□ Emergency contact: Trane Service 1-800-884-2653 with equipment serial: [SERIAL_PLACEHOLDER]</li>
</ul>

FOR CATERPILLAR GENERATOR EMERGENCIES:
<ul>
<li>□ CRITICAL: For [MODEL_PLACEHOLDER] press Emergency Stop, verify engine stopped, remove starting batteries</li>
<li>□ For fuel emergencies: Close manual fuel valves, activate fire suppression if equipped</li>
<li>□ For overspeed: Manually close air intake if emergency shutdown fails</li>
<li>□ Block radiator fan before any front-end work (fan may auto-start)</li>
<li>□ Verify zero energy: No AC output, DC control power isolated, starting air depleted</li>
<li>□ Emergency contact: CAT 24-Hour 1-877-228-3519 with ESN: [SERIAL_PLACEHOLDER]</li>
</ul>

FOR LIEBERT/VERTIV UPS EMERGENCIES:
<ul>
<li>□ CRITICAL: For [MODEL_PLACEHOLDER] press EPO, verify inverter offline, open battery breaker</li>
<li>□ For battery emergencies: Ventilate area (hydrogen gas), neutralize spills with baking soda</li>
<li>□ For thermal events: Bypass to maintenance mode, verify cooling before investigation</li>
<li>□ DC bus hazard: Wait 5 minutes after shutdown for capacitor discharge</li>
<li>□ Battery safety: PPE required even after disconnect (stored energy present)</li>
<li>□ Emergency contact: Vertiv 1-800-543-2378 with site ID: <input type="text" placeholder="Site ID" style="width:100px" /></li>
</ul>

FOR YORK EQUIPMENT EMERGENCIES:
<ul>
<li>□ CRITICAL: For [MODEL_PLACEHOLDER] activate QuickStop, verify compressor coast-down complete</li>
<li>□ For refrigerant emergencies: OptiView panel to pumpdown mode, isolate sections</li>
<li>□ For bearing emergencies: Monitor oil temperature during shutdown (<180°F)</li>
<li>□ YK centrifugal: Verify guide vane closed position before service</li>
<li>□ Micro panel: Download fault log before power removal</li>
<li>□ Emergency contact: York Service 1-800-861-1001 with model/serial</li>
</ul>

EMERGENCY-SPECIFIC SAFETY OVERRIDES:
- If [EMERGENCY_TYPE_PLACEHOLDER] includes "fire": EVACUATE FIRST, then implement shutdown
- If [EMERGENCY_TYPE_PLACEHOLDER] includes "refrigerant leak": EVACUATE area, PPE mandatory before entry
- If [EMERGENCY_TYPE_PLACEHOLDER] includes "electrical arc": DO NOT APPROACH, de-energize remotely
- If [EMERGENCY_TYPE_PLACEHOLDER] includes "flood": Secure all power before entering area

GENERATE ACTUAL MANUFACTURER-SPECIFIC PROCEDURES - Not generic safety steps

<div style="background: #dc3545; color: white; padding: 10px; margin: 10px 0; font-weight: bold; text-align: center;">
DO NOT PROCEED until all safety requirements are verified for [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]
</div>
</div>

<h3>Internal Equipment Diagnostics for [MANUFACTURER_PLACEHOLDER] [MODEL_PLACEHOLDER]</h3>
<p><strong>Perform systematic internal component checks to identify the source of [WORK_DESCRIPTION]</strong></p>

CRITICAL AI INSTRUCTIONS - FULLY DYNAMIC DIAGNOSTIC GENERATION BASED ON ACTUAL EMERGENCY:

STEP 1 - PARSE AND ANALYZE THE ACTUAL EMERGENCY:
Extract the ACTUAL emergency type from [WORK_DESCRIPTION] and [EMERGENCY_TYPE_PLACEHOLDER].
Common emergency patterns to detect:
- REFRIGERANT/CHEMICAL: "leak", "refrigerant", "R-410A", "R-134a", "chemical", "oil"
- ELECTRICAL/POWER: "power failure", "electrical fault", "breaker trip", "phase loss", "voltage", "outage"
- COOLING/THERMAL: "high temp", "overheating", "cooling loss", "temperature alarm", "thermal"
- MECHANICAL: "bearing", "vibration", "noise", "belt", "coupling", "motor failure", "mechanical"
- WATER/FLOOD: "water", "flood", "moisture", "condensate", "drain", "leak" (with water context)
- FIRE/SMOKE: "fire", "smoke", "burning", "smell", "hot spot"
- UPS/BATTERY: "UPS", "battery", "DC bus", "inverter", "runtime"
- GENERATOR: "generator", "fuel", "starting", "transfer", "genset"
- NETWORK/COMM: "communication", "network", "BMS", "control", "monitoring"

STEP 2 - APPLY EMERGENCY-SPECIFIC DIAGNOSTIC LOGIC:

FOR REFRIGERANT/CHEMICAL EMERGENCIES:
<table>
<tr>
  <th>Step Number</th>
  <th>Internal Component to Check</th>
  <th>Expected Reading/Condition</th>
  <th>Actual Reading</th>
  <th>Pass/Fail</th>
</tr>
<tr>
  <td>1</td>
  <td>Refrigerant system pressure - suction side</td>
  <td>Normal operating range per manufacturer specs</td>
  <td><input type="text" placeholder="PSI" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>2</td>
  <td>Refrigerant system pressure - discharge side</td>
  <td>Normal operating range per manufacturer specs</td>
  <td><input type="text" placeholder="PSI" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>3</td>
  <td>Visual inspection for oil traces at joints</td>
  <td>No oil residue visible</td>
  <td><input type="text" placeholder="Location if found" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>4</td>
  <td>Electronic leak detector sweep - compressor area</td>
  <td>No refrigerant detected (<10 PPM)</td>
  <td><input type="text" placeholder="PPM reading" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>5</td>
  <td>Electronic leak detector sweep - evaporator coil</td>
  <td>No refrigerant detected (<10 PPM)</td>
  <td><input type="text" placeholder="PPM reading" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>6</td>
  <td>Electronic leak detector sweep - condenser coil</td>
  <td>No refrigerant detected (<10 PPM)</td>
  <td><input type="text" placeholder="PPM reading" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>7</td>
  <td>Check service valve caps and cores</td>
  <td>Tight, no hissing, caps present</td>
  <td><input type="text" placeholder="Condition" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>8</td>
  <td>Soap bubble test on suspect joints</td>
  <td>No bubbles forming</td>
  <td><input type="text" placeholder="Results" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>9</td>
  <td>Check filter drier pressure drop</td>
  <td><5 PSI differential</td>
  <td><input type="text" placeholder="PSI diff" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>10</td>
  <td>Refrigerant sight glass inspection</td>
  <td>Clear, no bubbles</td>
  <td><input type="text" placeholder="Observation" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
IMPORTANT: NO LOTO REQUIRED for leak detection - not performing electrical work
</table>

FOR ELECTRICAL/POWER EMERGENCIES:
<table>
<tr>
  <th>Step Number</th>
  <th>Internal Component to Check</th>
  <th>Expected Reading/Condition</th>
  <th>Actual Reading</th>
  <th>Pass/Fail</th>
</tr>
<tr>
  <td>1</td>
  <td>Main disconnect voltage - all phases</td>
  <td>Rated voltage ±10% on all phases</td>
  <td><input type="text" placeholder="L1-L2, L2-L3, L1-L3" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>2</td>
  <td>Phase sequence verification</td>
  <td>Correct rotation (ABC)</td>
  <td><input type="text" placeholder="Sequence" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>3</td>
  <td>Control transformer secondary voltage</td>
  <td>24VAC or 120VAC per specs</td>
  <td><input type="text" placeholder="VAC" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>4</td>
  <td>Control fuse continuity check</td>
  <td>All fuses show continuity</td>
  <td><input type="text" placeholder="Status" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>5</td>
  <td>Main breaker status and trip indicators</td>
  <td>Closed, no trip flags</td>
  <td><input type="text" placeholder="Status" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr style="background-color: #dc3545; color: white;">
  <td>6</td>
  <td colspan="2"><strong>⚠️ CRITICAL: APPLY LOCKOUT/TAGOUT PROCEDURE NOW</strong><br>De-energize equipment per OSHA 1910.147 and verify zero energy state</td>
  <td>LOTO Applied: <input type="checkbox" /></td>
  <td>Verified: <input type="checkbox" /></td>
</tr>
<tr>
  <td>7</td>
  <td>Insulation resistance test - motor windings</td>
  <td>>1 megohm minimum</td>
  <td><input type="text" placeholder="Megohms" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>8</td>
  <td>Contactor inspection - pitting/burning</td>
  <td>Clean contacts, no excessive wear</td>
  <td><input type="text" placeholder="Condition" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>9</td>
  <td>Terminal connection tightness - torque check</td>
  <td>Per manufacturer torque specs</td>
  <td><input type="text" placeholder="Status" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>10</td>
  <td>Capacitor physical inspection (if present)</td>
  <td>No bulging, leaking, or damage</td>
  <td><input type="text" placeholder="Condition" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>11</td>
  <td>Ground fault test</td>
  <td>No ground faults detected</td>
  <td><input type="text" placeholder="Result" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
</table>

FOR COOLING/THERMAL EMERGENCIES:
<table>
<tr>
  <th>Step Number</th>
  <th>Internal Component to Check</th>
  <th>Expected Reading/Condition</th>
  <th>Actual Reading</th>
  <th>Pass/Fail</th>
</tr>
<tr>
  <td>1</td>
  <td>Supply air temperature</td>
  <td>Within setpoint range</td>
  <td><input type="text" placeholder="°F" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>2</td>
  <td>Return air temperature</td>
  <td>Normal return temp for load</td>
  <td><input type="text" placeholder="°F" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>3</td>
  <td>Temperature differential (delta T)</td>
  <td>15-20°F typical</td>
  <td><input type="text" placeholder="°F delta" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>4</td>
  <td>Fan motor operation and RPM</td>
  <td>Running at rated speed</td>
  <td><input type="text" placeholder="RPM" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>5</td>
  <td>Airflow obstructions - filters</td>
  <td>Clean, <1" w.g. pressure drop</td>
  <td><input type="text" placeholder="Pressure drop" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>6</td>
  <td>Damper positions and actuators</td>
  <td>Correct position per control signal</td>
  <td><input type="text" placeholder="% open" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>7</td>
  <td>Cooling coil condition</td>
  <td>Clean, no ice formation</td>
  <td><input type="text" placeholder="Condition" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>8</td>
  <td>Refrigerant pressures (if DX)</td>
  <td>Within operating range</td>
  <td><input type="text" placeholder="Suction/Discharge PSI" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>9</td>
  <td>Chilled water flow (if chilled water)</td>
  <td>Design GPM ±10%</td>
  <td><input type="text" placeholder="GPM" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>10</td>
  <td>Hot gas bypass valve (if equipped)</td>
  <td>Modulating correctly</td>
  <td><input type="text" placeholder="% open" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>11</td>
  <td>Compressor staging/cycling</td>
  <td>Proper sequence, no short cycling</td>
  <td><input type="text" placeholder="Status" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>12</td>
  <td>Control setpoints verification</td>
  <td>Matches required conditions</td>
  <td><input type="text" placeholder="Settings" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
</table>

FOR MECHANICAL EMERGENCIES:
<table>
<tr>
  <th>Step Number</th>
  <th>Internal Component to Check</th>
  <th>Expected Reading/Condition</th>
  <th>Actual Reading</th>
  <th>Pass/Fail</th>
</tr>
<tr>
  <td>1</td>
  <td>Vibration analysis - motor DE bearing</td>
  <td><0.3 in/sec velocity</td>
  <td><input type="text" placeholder="in/sec" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>2</td>
  <td>Vibration analysis - motor NDE bearing</td>
  <td><0.3 in/sec velocity</td>
  <td><input type="text" placeholder="in/sec" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>3</td>
  <td>Bearing temperature - infrared scan</td>
  <td><180°F, no hot spots</td>
  <td><input type="text" placeholder="°F" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>4</td>
  <td>Motor current draw - all phases</td>
  <td>Within FLA, balanced ±5%</td>
  <td><input type="text" placeholder="A1/A2/A3" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>5</td>
  <td>Audible noise assessment</td>
  <td>Normal operating sound</td>
  <td><input type="text" placeholder="Description" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr style="background-color: #dc3545; color: white;">
  <td>6</td>
  <td colspan="2"><strong>⚠️ CRITICAL: APPLY LOCKOUT/TAGOUT PROCEDURE NOW</strong><br>De-energize equipment per OSHA 1910.147 and verify zero energy state</td>
  <td>LOTO Applied: <input type="checkbox" /></td>
  <td>Verified: <input type="checkbox" /></td>
</tr>
<tr>
  <td>7</td>
  <td>Belt tension check (if belt-driven)</td>
  <td>1/2" deflection per ft span</td>
  <td><input type="text" placeholder="Deflection" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>8</td>
  <td>Coupling alignment verification</td>
  <td>Within 0.003" TIR</td>
  <td><input type="text" placeholder="TIR reading" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>9</td>
  <td>Oil level and condition</td>
  <td>Proper level, clear color</td>
  <td><input type="text" placeholder="Condition" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>10</td>
  <td>Shaft play/end play check</td>
  <td><0.010" axial play</td>
  <td><input type="text" placeholder="Measurement" style="width:80px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>11</td>
  <td>Bearing physical inspection</td>
  <td>No pitting, scoring, or damage</td>
  <td><input type="text" placeholder="Condition" style="width:150px" /></td>
  <td><input type="checkbox" /></td>
</tr>
</table>

FOR ALL OTHER EMERGENCY TYPES:
Generate appropriate diagnostic steps based on the specific emergency detected in [WORK_DESCRIPTION]:

WATER/FLOOD: Focus on moisture detection, drain blockages, pump operation (LOTO for electrical safety)
FIRE/SMOKE: Thermal imaging, connection inspection, immediate power isolation required
UPS/BATTERY: DC bus checks, battery voltages, thermal runaway monitoring (LOTO for battery work)
GENERATOR: Fuel system, starting batteries, transfer switch, governor (LOTO for mechanical access)
NETWORK/COMM: Protocol verification, cable testing, configuration checks (NO LOTO needed)

<table>
<tr>
  <th>Step Number</th>
  <th>Internal Component to Check</th>
  <th>Expected Reading/Condition</th>
  <th>Actual Reading</th>
  <th>Pass/Fail</th>
</tr>

AI MUST GENERATE 10-15 RELEVANT DIAGNOSTIC STEPS HERE based on analyzing [WORK_DESCRIPTION]:
- Each step must directly relate to finding the ROOT CAUSE of the specific emergency
- Order steps logically: safe checks first, then LOTO if needed, then invasive checks
- Include appropriate measurement units and expected values
- Reference [MANUFACTURER_PLACEHOLDER] specific procedures where applicable
- DO NOT use fake equipment IDs - use descriptive names only

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
IMPORTANT: Use the site address from Section 02 ([SITE_ADDRESS_PLACEHOLDER]) to intelligently determine local emergency services.

Include a comprehensive Emergency Contacts table with columns: Service Type, Contact Name/Organization, Phone Number, Notes/Address

INTELLIGENT LOCAL SERVICE LOOKUP INSTRUCTIONS:
1. Parse the site address from [SITE_ADDRESS_PLACEHOLDER] to extract city, state, and zip code
2. Based on the location, research and provide ACTUAL local emergency services:
   - Look up the actual local police department (non-emergency number) for that city
   - Find the actual local fire department (non-emergency number) for that city  
   - Identify the actual electric utility company serving that zip code:
     * For Illinois ZIP codes starting with 60-62: Use ComEd (1-800-334-7661) or Ameren (1-800-755-5000) based on specific location
     * For New York ZIP codes starting with 10-14: Use ConEd (1-800-752-6633) or National Grid (1-800-642-4272) based on borough/county
     * For California: PG&E (1-800-743-5000) for northern CA, SCE (1-800-655-4555) for southern CA, SDG&E (1-800-411-7343) for San Diego area
     * For Texas: Oncor (1-888-313-4747), CenterPoint (1-800-332-7143), or AEP Texas (1-866-223-8508) based on region
     * For other states: Research and provide the actual utility company name and emergency number
   - Find the nearest hospital emergency room to the site address
   - Look up local mechanical/electrical contractors that service data centers in that region

Include these essential emergency contacts with intelligent population:
- Police/Fire/EMS Emergency: 911 (combined single row for immediate emergencies)
- Local Police (Non-Emergency): [INTELLIGENTLY DETERMINE based on city from site address - provide actual department name and non-emergency number]
- Local Fire (Non-Emergency): [INTELLIGENTLY DETERMINE based on city from site address - provide actual department name and non-emergency number]  
- Nearest Hospital/Medical Center: [RESEARCH and provide actual hospital name, address, and phone number closest to site address]
- Electric Utility Emergency: [INTELLIGENTLY DETERMINE based on zip code - provide actual utility company name and 24/7 emergency number]
- Equipment Manufacturer Support: INTELLIGENTLY POPULATE based on [MANUFACTURER_PLACEHOLDER]:
  * For Carrier equipment: Suggest "Carrier Commercial Service: 1-800-CARRIER (1-800-227-7437)"
  * For Trane equipment: Suggest "Trane Commercial Service: 1-800-884-2653"
  * For York equipment: Suggest "York Service: 1-800-861-1001"
  * For Liebert/Vertiv equipment: Suggest "Vertiv Services: 1-800-543-2378"
  * For Cummins generators: Suggest "Cummins Power Generation: 1-800-888-6626"
  * For Caterpillar equipment: Suggest "CAT 24-Hour Support: 1-877-228-3519"
  * For Eaton UPS: Suggest "Eaton Service: 1-800-356-5794"
  * For other manufacturers: Use placeholder <input type="text" placeholder="Enter [MANUFACTURER_PLACEHOLDER] support #" style="width:150px" />
- Local Electrical Contractor: [RESEARCH local electrical contractors serving data centers in the region, provide name or use <input type="text" placeholder="Enter local electrical contractor #" style="width:150px" />]
- Local Mechanical Contractor: [RESEARCH local mechanical contractors serving data centers in the region, provide name or use <input type="text" placeholder="Enter local mechanical contractor #" style="width:150px" />]
- Facilities Manager: <input type="text" placeholder="Enter facilities manager #" style="width:150px" />

Add this important note at the bottom of the Emergency Contacts section:
"✓ RESEARCHED: Contact information has been researched for the specific location at [SITE_ADDRESS_PLACEHOLDER]. Please verify current phone numbers before use as they may change over time."

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

    // Generate content using Gemini with error handling
    let generatedContent = '';
    try {
      console.log('Initializing Gemini model...');
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-pro'
      });
      
      console.log('Calling Gemini API...');
      const result = await model.generateContent(prompt);
      
      console.log('Getting response from Gemini...');
      const response = await result.response;
      
      console.log('Extracting text from response...');
      generatedContent = response.text();
      
      if (!generatedContent) {
        throw new Error('Gemini returned empty content');
      }
      
      console.log('Gemini generation successful, content length:', generatedContent.length);
      
    } catch (geminiError) {
      console.error('=== GEMINI API ERROR ===');
      console.error('Error during Gemini generation:', geminiError);
      console.error('Error name:', geminiError.name);
      console.error('Error message:', geminiError.message);
      if (geminiError.response) {
        console.error('Gemini response:', geminiError.response);
      }
      console.error('=== END GEMINI ERROR ===');
      throw geminiError; // Re-throw to be caught by outer try-catch
    }
    
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
    
    // Generate filename using new format with component type and full values
    // TYPE_EQUIP_ID_COMPONENT_TYPE_MANUFACTURER_WORK_DESC_DATE_VERSION
    let filename = '';
    const date = new Date().toISOString().split('T')[0];
    const equipmentId = (formData.equipmentNumber || '').replace(/-/g, ''); // Remove hyphens
    const componentType = (formData.componentType || formData.system || 'EQUIPMENT')
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, ''); // Use full component type with underscores
    const manufacturer = (formData.manufacturer || 'UNKNOWN')
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, ''); // Use full manufacturer name with underscores
    const workDesc = (formData.category || 'EMERGENCY')
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, ''); // Use full category with underscores
    filename = `EOP_${equipmentId}_${componentType}_${manufacturer}_${workDesc}_${date}_V1.html`;

    // Save to blob storage
    console.log('Attempting to save to blob storage with filename:', filename);
    let blob;
    try {
      blob = await put(`eops/${filename}`, completeHtml, {
        access: 'public',
        contentType: 'text/html'
      });
      console.log('Blob storage upload successful, URL:', blob.url);
    } catch (blobError) {
      console.error('=== BLOB STORAGE ERROR ===');
      console.error('Error uploading to blob storage:', blobError);
      console.error('Blob error message:', blobError.message);
      console.error('Filename attempted:', filename);
      console.error('Content length:', completeHtml?.length);
      console.error('=== END BLOB ERROR ===');
      throw new Error(`Blob storage upload failed: ${blobError.message || 'Unknown blob error'}`);
    }
    
    console.log('EOP generation complete:', filename);
    
    return NextResponse.json({
      success: true,
      filename: filename,
      url: blob.url || blob.downloadUrl || '',
      message: 'EOP generated successfully'
    }, { status: 200 });
    
  } catch (error) {
    // Enhanced error logging
    console.error('=== EOP GENERATION ERROR ===');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    
    // Log specific details if available
    if (error.response) {
      console.error('Error Response:', error.response);
    }
    if (error.status) {
      console.error('Error Status:', error.status);
    }
    
    // Log the last known state
    console.error('Last Known Equipment:', formData?.manufacturer, formData?.modelNumber);
    console.error('Last Known Emergency Type:', formData?.workDescription);
    console.error('=== END ERROR LOG ===');
    
    // Handle specific error types
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return NextResponse.json({ 
        error: 'AI service is busy',
        userMessage: 'The AI service is currently busy. Please wait 2-3 minutes and try again.',
        details: error.message
      }, { status: 429 });
    }
    
    if (error.message?.includes('API key') || error.message?.includes('API_KEY')) {
      return NextResponse.json({ 
        error: 'Configuration error',
        userMessage: 'AI service is not properly configured. Please contact support.',
        details: error.message
      }, { status: 500 });
    }
    
    // Check for Gemini-specific errors
    if (error.message?.includes('Gemini') || error.message?.includes('generate')) {
      return NextResponse.json({ 
        error: 'AI generation failed',
        userMessage: 'The AI model encountered an error generating the EOP. Please try again.',
        details: error.message,
        equipment: `${formData?.manufacturer} ${formData?.modelNumber}`,
        emergency: formData?.workDescription
      }, { status: 500 });
    }
    
    // Default error response with more details
    return NextResponse.json({ 
      error: 'Failed to generate EOP',
      details: error.message || String(error) || 'Unknown error',
      userMessage: 'Unable to generate EOP. Please check the server logs for details.',
      equipment: formData ? `${formData.manufacturer} ${formData.modelNumber}` : 'Unknown equipment',
      emergency: formData?.workDescription || 'Unknown emergency'
    }, { status: 500 });
  }
}