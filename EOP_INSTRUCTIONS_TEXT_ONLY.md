=================================
EOP INSTRUCTIONS - TEXT ONLY FOR EDITING
=================================
Purpose: Instruction text for expert review and editing
Date: January 12, 2025

=================================
SECTION 1: HEADER INSTRUCTIONS
=================================

You are creating Emergency Operating Procedures (EOPs) for data center technicians. Generate COMPLETE, DETAILED EOPs with NO placeholders or summaries.

CRITICAL: This is for [emergencyType] emergency response. Adapt all procedures based on the specific equipment type provided.

CRITICAL HTML GENERATION RULES:
- DO NOT generate DOCTYPE, html, head, body, or container div tags
- Generate ONLY the content that goes INSIDE the existing container div
- Start with the main H1 title, then proceed with sections
- Use H2 for all section headers (not H1)
- Use H3 for subsection headers
- The HTML template already provides the document structure

IMPORTANT: This EOP must be INTERACTIVE with editable input fields. Include HTML input elements throughout.

ADDITIONAL MANDATORY GENERATION REQUIREMENTS:
- MANDATORY: Generate accurate specifications based on the manufacturer and model number provided
- MANDATORY: Equipment specs must match known specifications for that exact model (voltage, amperage, refrigerant type, etc.)
- MANDATORY: All procedures must be specific to the Component/Equipment Type selected (Chiller, Generator, UPS, etc.)
- MANDATORY: Adapt ALL sections based on the Emergency Type selected (Power Failure, High Temperature, etc.)
- MANDATORY: Use manufacturer-specific terminology and control systems (e.g., Carrier uses CCN, Trane uses Tracer)
- MANDATORY: If serial number provided, include it in identification but recognize specs come from model number
- MANDATORY: Location field must be used exactly as entered by user throughout the document
- FORBIDDEN: Generic procedures that could apply to any manufacturer
- FORBIDDEN: Mixing procedures from different equipment types
- FORBIDDEN: Ignoring the selected emergency type - entire document must address THAT specific emergency

The EOP must follow this EXACT structure with INTERACTIVE ELEMENTS:

START WITH:
Emergency Operating Procedure (EOP)

Emergency warning box with:
- ⚠️ EMERGENCY RESPONSE: [manufacturer] [modelNumber]
- Location: [location or 'Data Center']
- Emergency Type: [emergencyType]
- Critical Specs: Generate based on equipment database - voltage, phase, capacity, refrigerant type, etc.

=================================
SECTION 2: IDENTIFICATION INSTRUCTIONS  
=================================

Section 01: EOP Identification & Control

EOP Title: Emergency Operating Procedure for [manufacturer] [modelNumber]

IMPORTANT: Replace EOP Identifier line with emergency code mapping based on emergency type:

Emergency type codes:
- Power Failure / Outage = PWR
- High Discharge Pressure Alarm = HDP
- Low Suction Pressure/Temperature = LSP
- Compressor Failure = COMP
- High Water Temperature Alarm = HWT
- Refrigerant Leak Detection = REFL
- Control System Failure = CTRL
- Condenser Fan Failure = CDF
- Condenser Water Flow Failure = CWF
- Chilled Water Flow Failure = CHWF
- Extreme Ambient Temperature = TEMP
- Vibration/Noise Alarm = VIB
- Complete Chiller Shutdown = SHUT
- Fire/Smoke Detection = FIRE
- Recovery Procedures = RECV
- Fan Failure = FAN
- Pump Failure = PUMP
- Gear Box Failure = GEAR
- Pump Motor Failure = MTR
- Pump Seal Failure = SEAL
- Bearing Failure = BRG
- VFD Failure = VFD
- Blocked Strainer = STRN
- Pump Air Locked = AIRL
- Pump Cavitation = CAV
- Loss of airflow = FLOW
- Water leak detection = LEAK
- Communication Loss = COMM
- Frost Coil Alarm = FRST
- Differential pressure alarm = DIFF
- Humidity Alarm = HUM
- Emergency manual override = EMER
- Smoke Detection Alarm = SMOK
- Loss of cooling = COOL
- Condensate water alarm = COND

If emergency type doesn't match exactly, use first 3-4 relevant letters

EOP Identifier: EOP-[manufacturer 3 letters]-[modelNumber 8 chars]-[emergency code]-001

Include fields for:
- Equipment Details
- Manufacturer
- Model Number
- Serial Number
- Location
- System
- Component Type
- Version (input field)
- Date (input field)
- Author (input field)
- Approver (input field)

=================================
SECTION 3: PURPOSE & SCOPE INSTRUCTIONS
=================================

Section 02: Purpose & Scope

MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Replace "power failure emergencies" with the actual emergency type selected from the form
- MANDATORY: Purpose must state the specific goal based on emergency type (restore power, stop leak, reduce pressure, etc.)
- MANDATORY: Scope must reference the specific Component/Equipment Type (Chiller, Generator, UPS, CRAC, CRAH, Pump, etc.)
- MANDATORY: Activation Criteria must list the actual triggers for THIS emergency type, not generic power loss
- MANDATORY: Activation Criteria must include equipment-specific alarm points, pressure limits, or failure indicators
- MANDATORY: Safety Notice must include hazards specific to the equipment type (refrigerant, high voltage, rotating equipment, batteries, fuel, etc.)
- MANDATORY: Safety Notice must include hazards specific to the emergency type (electrical, chemical, thermal, mechanical)
- MANDATORY: Use the Location field exactly as entered throughout this section
- FORBIDDEN: Using "power failure" language when the emergency is not power-related
- FORBIDDEN: Generic activation criteria that don't match the selected emergency type

Purpose: This Emergency Operating Procedure provides step-by-step instructions for responding to [emergency type] affecting the [manufacturer] [modelNumber] [system]. This document ensures rapid, safe, and effective response to restore critical infrastructure operations.

Scope: This procedure applies to all data center operations personnel, facilities engineers, and emergency response teams responsible for maintaining the [manufacturer] [modelNumber] and associated critical infrastructure systems.

Activation Criteria: This EOP shall be activated when [specific emergency indicators] are detected on the [manufacturer] [modelNumber], including but not limited to: [list specific triggers for this emergency type].

Safety Notice: All personnel must follow proper [emergency-specific] safety procedures, use appropriate PPE, and verify [emergency-specific safety checks] before working on any equipment.

=================================
SECTION 4: IMMEDIATE ACTIONS INSTRUCTIONS
=================================

Section 03: Immediate Emergency Actions - [emergencyType] Diagnostics

MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Step 1 title and checks must change based on emergency type (not always "Power Loss Indicators")
- MANDATORY: For non-power emergencies, Step 1 should check indicators specific to that emergency
- MANDATORY: Step 3 diagnostics must match the emergency type
- MANDATORY: PPE table must adapt to emergency type (respirator for refrigerant leak, burn protection for high temp, etc.)
- MANDATORY: Tools table must include emergency-specific tools
- MANDATORY: Diagnostic table columns must change based on emergency
- MANDATORY: Safety requirements must include emergency-specific hazards
- MANDATORY: Power diagnosis determination box at end must change to match emergency type
- FORBIDDEN: Using electrical diagnostics for non-electrical emergencies
- FORBIDDEN: Generic "power loss" language when emergency is not power-related

Pre-Action Safety & Equipment Requirements:

⚠️ CRITICAL SAFETY CHECKPOINT - STOP Before Proceeding:

Equipment-Specific PPE Requirements for [manufacturer] [modelNumber]:

Generate PPE requirements based on the SPECIFIC equipment type and voltage:
- For 480V 3-phase equipment: Arc Flash Category 2 PPE minimum
- For 208V/240V equipment: Arc Flash Category 1 PPE
- For DC systems: Acid-resistant gloves, face shield
- For refrigerant systems: SCBA or respirator if leak suspected
- For generators: Hearing protection, CO monitor

Include PPE table with columns:
- PPE Item
- Specification for [modelNumber]
- Verified (checkbox)

Required Tools & Test Equipment for [manufacturer] [modelNumber]:

Generate tool list based on the SPECIFIC equipment model:
- For Carrier: CCN interface tool, specific control board diagnostic tools
- For Trane: Tracer SC+ interface, oil pressure gauges
- For Caterpillar: CAT ET diagnostic tool
- For Liebert: Liebert monitoring interface cable

Include tools table with columns:
- Tool/Equipment
- Specific Model/Type for [modelNumber]
- Available (checkbox)

[manufacturer] [modelNumber] Specific Safety Requirements:
- Verify de-energization procedures per manufacturer service manual
- Check for stored energy in capacitors/VFDs/control circuits
- Review manufacturer emergency shutdown sequence
- Confirm equipment-specific hazards
- Emergency contact for manufacturer technical support (input field)

DO NOT PROCEED until all safety requirements are verified

Step 1: [Emergency-Specific] Indicators Check

For Power emergencies: "Power Loss Indicators Check"
For Refrigerant emergencies: "Refrigerant Leak Indicators Check"
For Fire/Smoke: "Fire/Smoke Detection Verification"
For Temperature: "Temperature Alarm Verification"
For Pressure: "Pressure Alarm Verification"
Otherwise: "Emergency Indicators Check"

Include verification table with emergency-appropriate checks

Step 2: System Monitoring Verification

Verify how equipment appears in monitoring systems (EPMS, BMS, SCADA, etc.)

Step 3: [Emergency-Specific] Diagnostics

Create diagnostic table appropriate for the emergency type with columns:
- Step
- Action
- Expected Reading/Verification
- Data Reading Field (input)
- Pass/Fail (checkbox)

DIAGNOSIS DETERMINATION:
- IF [emergency condition] verified = [Specific issue type]
- IF NOT verified = Check [alternative cause]

=================================
SECTION 5: SCENARIOS INSTRUCTIONS
=================================

Section 04: External Power Supply Scenarios

MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Generate 4 completely different scenarios based on the specific emergency type selected
- MANDATORY: For Power/Electrical emergencies: Use power supply scenarios
- MANDATORY: For Pressure emergencies: Generate pressure-related scenarios
- MANDATORY: For Temperature emergencies: Generate thermal scenarios
- MANDATORY: For Refrigerant emergencies: Generate leak scenarios
- MANDATORY: For Mechanical emergencies: Generate mechanical failure scenarios
- MANDATORY: For Flow emergencies: Generate flow disruption scenarios
- MANDATORY: For Control emergencies: Generate control scenarios
- MANDATORY: For Water emergencies: Generate water-related scenarios
- MANDATORY: For Safety emergencies: Generate safety scenarios
- MANDATORY: Each scenario must include emergency-specific verification tables
- FORBIDDEN: Using voltage/electrical checks for non-electrical emergencies
- FORBIDDEN: Generic "power" language in scenarios for non-power emergencies

Generate 4 scenarios based on the SPECIFIC EQUIPMENT TYPE:

SCENARIO 1 - [Primary failure type for this emergency]
Trigger Conditions: [specific to this emergency and equipment]
Verification Checks: [appropriate measurements with input fields]

SCENARIO 2 - [Secondary failure type]
Trigger Conditions: [specific to this emergency and equipment]
Verification Checks: [appropriate measurements with input fields]

SCENARIO 3 - [Tertiary failure type]
Trigger Conditions: [specific to this emergency and equipment]
Verification Checks: [appropriate measurements with input fields]

SCENARIO 4 - [Cascading/compound failure]
Trigger Conditions: [specific to this emergency and equipment]
Verification Checks: [appropriate measurements with input fields]

IMPORTANT EQUIPMENT-SPECIFIC ADAPTATIONS:
- CHILLER: Focus on 3-phase power, VFDs, control transformers, compressor contactors
- UPS: Focus on input/output voltages, bypass sources, DC bus, battery strings
- GENERATOR: Focus on starting batteries, transfer switches, control power, field excitation
- PDU: Focus on input breakers, monitoring circuits, branch circuits, transformer taps
- CRAC/CRAH: Focus on fan motors, control power, humidification, reheat elements
- SWITCHGEAR: Focus on bus voltage, protection relays, control power, breaker charging

=================================
SECTION 6: COMMUNICATION INSTRUCTIONS
=================================

Section 05: Communication & Escalation Protocol

MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Equipment Manufacturer Support must show the actual manufacturer name
- MANDATORY: Add emergency-specific contacts based on the emergency type
- MANDATORY: For Refrigerant Leak: Add Environmental Response Team, EPA Hotline
- MANDATORY: For Fire/Smoke: Add Fire Marshal, Suppression System Vendor
- MANDATORY: For Water emergencies: Add Plumbing Contractor, Water Restoration
- MANDATORY: For Control failures: Add IT Support, Control System Vendor
- MANDATORY: For Mechanical failures: Add Mechanical Contractor, Vibration Specialist
- MANDATORY: For High Temperature: Add HVAC Contractor, Temporary Cooling Vendor
- MANDATORY: Include manufacturer-specific technical support numbers when known
- FORBIDDEN: Generic "equipment manufacturer" - must specify actual manufacturer
- FORBIDDEN: Missing critical emergency-specific contacts

Emergency Contacts table with columns:
- Service Type
- Contact Name/Organization (input field)
- Phone Number (input field)
- Notes/Address

Include essential contacts:
- Police Emergency: 911
- Fire/EMS Emergency: 911
- Electric Utility Emergency (input field)
- [manufacturer] Technical Support (input field)
- Electrical Contractor (input field)
- Facilities Manager (input field)
- [Additional emergency-specific contacts]

⚠️ IMPORTANT: Verify all emergency contact numbers for your specific facility location.

=================================
SECTION 7: RECOVERY INSTRUCTIONS
=================================

Section 06: Recovery & Return to Service

MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Section title must change to match the emergency type
- MANDATORY: Step 1 must verify resolution of the ACTUAL emergency
- MANDATORY: For Refrigerant Leak: Verify leak sealed, area ventilated, EPA documentation
- MANDATORY: For High Pressure/Temperature: Verify normal range, root cause addressed
- MANDATORY: For Mechanical Failures: Verify repairs completed, alignment checked
- MANDATORY: For Water emergencies: Verify leak stopped, water removed, equipment dried
- MANDATORY: For Fire/Smoke: Verify all-clear, suppression reset, smoke cleared
- MANDATORY: For Control failures: Verify system restored, communication re-established
- MANDATORY: Pre-start checks must include emergency-specific items
- MANDATORY: Functionality table must measure parameters relevant to the emergency
- MANDATORY: Documentation must include emergency-specific requirements
- FORBIDDEN: Using "power restoration" language for non-power emergencies
- FORBIDDEN: Generic recovery steps that don't address the specific emergency

[Emergency-Specific Title] and Equipment Recovery Procedures

Follow these steps in sequence to safely restore the [manufacturer] [modelNumber]:

1. [Emergency Resolution] Verification
   - Confirm [emergency condition] has been resolved
   - Check [emergency-specific parameters]
   - Verify [safety conditions]
   - Measure: [relevant parameter] (input field)

2. Pre-Start Safety Checks
   - Verify all LOTO devices removed
   - Confirm no personnel working on equipment
   - Reset emergency stops and safety interlocks
   - Check [emergency-specific safety items]

3. Equipment-Specific Restart Sequence
   - Follow manufacturer procedure for [manufacturer] [modelNumber]
   - Turn main disconnect to ON
   - Clear alarms on control panel
   - Initiate startup sequence
   - Record startup time (input field)

4. System Functionality Verification
   Table with emergency-specific parameters:
   - Parameter | Expected Range | Actual Reading | Pass/Fail

5. Load Transfer (if applicable)
   - Gradually transfer load from backup
   - Monitor load percentage (input field)
   - Verify stable operation

6. Performance Validation
   - Run equipment for minimum 15 minutes
   - Verify operational setpoints
   - Check for unusual conditions
   - Confirm auxiliary systems functioning

7. Return to Normal Operation
   - Document all readings
   - Update equipment log
   - Notify operations team
   - Clear monitoring system alarms
   - Restoration completed by: (input field) at (input field)

=================================
SECTION 8: SUPPORTING INFO INSTRUCTIONS
=================================

Section 07: Supporting Information

MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Infrastructure locations must include emergency-specific critical locations
- MANDATORY: For Refrigerant: Add refrigerant storage, recovery equipment, leak detectors
- MANDATORY: For Water: Add water shutoffs, floor drains, sump pumps, wet vacs
- MANDATORY: For Fire/Smoke: Add fire alarm panel, suppression controls, extinguishers
- MANDATORY: For Mechanical: Add spare motor location, bearing storage, alignment tools
- MANDATORY: For Temperature: Add temporary cooling connections, portable unit staging
- MANDATORY: For Control: Add network closets, control panels, BMS workstations
- MANDATORY: Spare parts must list parts relevant to the emergency type
- MANDATORY: Related documents must include emergency-specific references
- FORBIDDEN: Only listing electrical infrastructure for non-electrical emergencies
- FORBIDDEN: Generic spare parts list that doesn't match the emergency type

Critical Infrastructure Locations table:
- Infrastructure Element | Location Details (input) | Access Requirements (input)

Include:
- [manufacturer] [modelNumber] Location
- Main Electrical Panel
- Equipment Disconnect Switch
- Distribution Panel
- Emergency Generator
- UPS System (if applicable)
- [Emergency-specific locations]

Spare Parts Inventory table:
- Part Description | Part Number (input) | Quantity (input) | Storage Location (input)

Include emergency-relevant parts:
- For electrical: Breakers, fuses, control boards
- For refrigerant: Recovery cylinders, filter driers, leak repair kits
- For mechanical: Bearings, belts, couplings, shaft seals
- For water: Pipe clamps, drain hoses, pumps, absorbent materials
- For control: Control boards, sensors, network cards, modules

Related Documents (as hyperlinks):
- Equipment Electrical Drawings
- Single Line Diagram
- Arc Flash Study
- OSHA Electrical Safety Standards
- NFPA 70E Electrical Safety
- [Emergency-specific standards and guidelines]

=================================
SECTION 9: APPROVAL INSTRUCTIONS
=================================

Section 08: EOP Approval & Review

MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Include standard approvers: Author, Approver, Reviewer
- MANDATORY: Add emergency-specific approvers based on type
- MANDATORY: For Refrigerant: Add Environmental Compliance Officer
- MANDATORY: For Fire/Smoke: Add Fire Marshal and Life Safety Officer
- MANDATORY: For Control failures: Add IT Manager and Control Systems Engineer
- MANDATORY: For Water: Add Plumbing Supervisor and Risk Management
- MANDATORY: For High Temperature: Add Data Center Operations Manager
- MANDATORY: For Mechanical: Add Mechanical Engineering Lead
- MANDATORY: Next Review Date must default to one year from current date
- MANDATORY: Include revision tracking table
- FORBIDDEN: Generic approval matrix that doesn't reflect emergency stakeholders
- FORBIDDEN: Missing critical approvers for safety-sensitive emergencies

Approval Matrix table:
- Role | Name (input) | Signature (input) | Date (input)

Include:
- Author (Facilities Engineer)
- Approver (Facilities Manager)
- Reviewer (Safety Officer)
- [Emergency-specific approvers]

Next Review Date: (input field - one year from today)

Revision History table:
- Revision | Date (input) | Description of Changes (input) | Changed By (input)

Initial entry:
- 1.0 | Current Date | Initial release | [Author name]

=================================
SECTION 10: FORMATTING INSTRUCTIONS
=================================

CRITICAL FORMATTING REQUIREMENTS:
- DO NOT generate DOCTYPE, html, head, body tags or container div
- Start with <h1>Emergency Operating Procedure (EOP)</h1>
- Use H2 for section headers: "Section 01:", "Section 02:", etc. (with zero-padded numbers)
- Use H3 for subsection headers
- Use red (color: #dc3545) for all emergency warnings and critical actions
- Replace ANY placeholder text with proper input fields
- Use CSS classes: .emergency-action, .emergency-warning, .critical-text
- Make tables professional with proper styling and borders
- Generate COMPLETE content with NO placeholders

=================================
END OF INSTRUCTIONS
=================================

NOTES FOR EDITING:
1. Replace [bracketed items] with actual values from user input
2. All "input field" references should generate HTML input elements
3. Emergency-specific adaptations are critical - the entire document must match the emergency type
4. Equipment specifications must be accurate for the specific manufacturer and model
5. Safety requirements vary by emergency type and must be comprehensive

=================================