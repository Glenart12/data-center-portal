=================================
EOP GENERATION INSTRUCTIONS - VERSION 2
=================================
Generated: 2025-08-11
Status: Post-Implementation with Emergency Type Adaptations

This document contains the complete, updated instructions that guide the AI in generating Emergency Operating Procedures. All emergency-type adaptations have been implemented.

=================================

SECTION: Critical Formatting Requirements
FILE: lib/eop-sections/formatting.js
CURRENT INSTRUCTIONS (Including all MANDATORY/FORBIDDEN rules):
- DO NOT generate DOCTYPE, html, head, body tags or container div
- Start with `<h1>Emergency Operating Procedure (EOP)</h1>`
- Use H2 for section headers: "Section 01:", "Section 02:", etc. (with zero-padded numbers)
- Use H3 for subsection headers
- Use red (color: #dc3545) for all emergency warnings and critical actions
- Replace ANY placeholder text with proper input fields
- Use CSS classes: .emergency-action, .emergency-warning, .critical-text
- Make tables professional with proper styling and borders
- Generate COMPLETE content with NO placeholders

---

SECTION: EOP Header Instructions
FILE: lib/eop-sections/header.js
CURRENT INSTRUCTIONS (Including all MANDATORY/FORBIDDEN rules):
- **CRITICAL:** This is for POWER FAILURE emergency response - adapt all procedures based on specific equipment type
- **CRITICAL HTML GENERATION RULES:**
  - DO NOT generate DOCTYPE, html, head, body, or container div tags
  - Generate ONLY content that goes INSIDE existing container div
  - Start with main H1 title, then proceed with sections
  - Use H2 for all section headers (not H1)
  - Use H3 for subsection headers

**MANDATORY REQUIREMENTS:**
- Generate accurate specifications based on manufacturer and model number
- Equipment specs must match known specifications for exact model (voltage, amperage, refrigerant type)
- All procedures must be specific to Component/Equipment Type selected (Chiller, Generator, UPS, etc.)
- >>> Adapt ALL sections based on Emergency Type selected (Power Failure, High Temperature, etc.) <<<
- Use manufacturer-specific terminology and control systems
- Location field must be used exactly as entered throughout document

**FORBIDDEN:**
- Generic procedures that could apply to any manufacturer
- Mixing procedures from different equipment types
- Ignoring selected emergency type

---

SECTION: EOP Identification & Control
FILE: lib/eop-sections/section-01-identification.js
CURRENT INSTRUCTIONS (Including all MANDATORY/FORBIDDEN rules):

**Emergency Type Code Mappings (MANDATORY):**
- Power Failure/Outage = PWR
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

**EOP Identifier Format:** EOP-[manufacturer 3 letters]-[model 8 chars]-[emergency code]-001

---

SECTION: Purpose & Scope
FILE: lib/eop-sections/section-02-purpose-scope.js
CURRENT INSTRUCTIONS (Including all MANDATORY/FORBIDDEN rules):

**MANDATORY REQUIREMENTS:**
- >>> Replace "power failure emergencies" with actual emergency type selected <<<
- Purpose must state specific goal based on emergency type (restore power, stop leak, reduce pressure, etc.)
- Scope must reference specific Component/Equipment Type (Chiller, Generator, UPS, CRAC, CRAH, Pump, etc.)
- Activation Criteria must list actual triggers for THIS emergency type, not generic power loss
- Activation Criteria must include equipment-specific alarm points, pressure limits, or failure indicators
- Safety Notice must include hazards specific to equipment type and emergency type

**FORBIDDEN:**
- Using "power failure" language when emergency is not power-related
- Generic activation criteria that don't match selected emergency type

---

SECTION: Immediate Emergency Actions - Power Failure Diagnostics
FILE: lib/eop-sections/section-03-immediate-actions.js
CURRENT INSTRUCTIONS (Including all MANDATORY/FORBIDDEN rules):

**MANDATORY REQUIREMENTS:**
- >>> Step 1 title and checks must change based on emergency type (not always "Power Loss Indicators") <<<
- For non-power emergencies, Step 1 should check indicators specific to that emergency
- Step 3 diagnostics must match emergency type - electrical for power issues, refrigerant for leaks, mechanical for compressor failures
- >>> PPE table must adapt to emergency type (respirator for refrigerant leak, burn protection for high temp, etc.) <<<
- >>> Tools table must include emergency-specific tools (refrigerant detector for leaks, temperature gun for overheating, vibration meter for mechanical issues) <<<
- Diagnostic table columns must change based on emergency (could be "Pressure Reading", "Temperature Check", "Vibration Level", etc.)
- Safety requirements must include emergency-specific hazards

**Equipment-Specific PPE Requirements:**
- For 480V 3-phase equipment: Arc Flash Category 2 PPE minimum
- For 208V/240V equipment: Arc Flash Category 1 PPE
- For DC systems (UPS batteries): Acid-resistant gloves, face shield
- For refrigerant systems: SCBA or respirator if leak suspected
- For generators: Hearing protection, CO monitor

**FORBIDDEN:**
- Using electrical diagnostics for non-electrical emergencies
- Generic "power loss" language when emergency is not power-related

---

SECTION: External Power Supply Scenarios
FILE: lib/eop-sections/section-04-scenarios.js
CURRENT INSTRUCTIONS (Including all MANDATORY/FORBIDDEN rules):

**MANDATORY REQUIREMENTS:**
- >>> Generate 4 completely different scenarios based on specific emergency type selected <<<
- For Power/Electrical emergencies: Use power supply scenarios
- For Pressure emergencies: Generate pressure-related scenarios
- For Temperature emergencies: Generate thermal scenarios
- For Refrigerant emergencies: Generate leak scenarios
- For Mechanical emergencies: Generate mechanical failure scenarios
- For Flow emergencies: Generate flow disruption scenarios
- For Control emergencies: Generate control scenarios
- For Water emergencies: Generate water-related scenarios
- For Safety emergencies: Generate safety scenarios
- >>> Each scenario must include emergency-specific verification tables with appropriate measurements <<<

**FORBIDDEN:**
- Using voltage/electrical checks for non-electrical emergencies
- Generic "power" language in scenarios for non-power emergencies

---

SECTION: Communication & Escalation Protocol
FILE: lib/eop-sections/section-05-communication.js
CURRENT INSTRUCTIONS (Including all MANDATORY/FORBIDDEN rules):

**MANDATORY REQUIREMENTS:**
- Equipment Manufacturer Support must show actual manufacturer name from form input
- >>> Add emergency-specific contacts based on emergency type: <<<
  - For Refrigerant Leak: Environmental Response Team, Refrigerant Recovery Service, EPA Hotline
  - For Fire/Smoke: Fire Marshal, Suppression System Vendor, Evacuation Coordinator
  - For Water emergencies: Plumbing Contractor, Water Restoration Service, Water Utility
  - For Control System failures: IT Support, Control System Vendor, Network Operations Center
  - For Mechanical failures: Mechanical Contractor, Vibration Specialist, Equipment Rental
  - For High Temperature emergencies: HVAC Contractor, Temporary Cooling Vendor, Load Shedding Coordinator
- Include manufacturer-specific technical support numbers

**FORBIDDEN:**
- Generic "equipment manufacturer" - must specify actual manufacturer
- Missing critical emergency-specific contacts

---

SECTION: Recovery & Return to Service
FILE: lib/eop-sections/section-06-recovery.js
CURRENT INSTRUCTIONS (Including all MANDATORY/FORBIDDEN rules):

**MANDATORY REQUIREMENTS:**
- >>> Section title must change from "Power Restoration" to match emergency type <<<
- Step 1 must verify resolution of ACTUAL emergency (not always power restoration)
- >>> Emergency-specific recovery steps: <<<
  - For Refrigerant Leak: Verify leak sealed, area ventilated, refrigerant levels restored, EPA documentation complete
  - For High Pressure/Temperature: Verify pressures/temps within normal range, root cause addressed, safety limits reset
  - For Mechanical Failures: Verify repairs completed, alignment checked, vibration levels normal, test run performed
  - For Water emergencies: Verify leak stopped, water removed, equipment dried, electrical components tested
  - For Fire/Smoke: Verify fire department all-clear, suppression system reset, smoke cleared, equipment inspection complete
  - For Control failures: Verify control system restored, communication re-established, all points responding, setpoints verified

**FORBIDDEN:**
- Using "power restoration" language for non-power emergencies
- Generic recovery steps that don't address specific emergency type

---

SECTION: Supporting Information
FILE: lib/eop-sections/section-07-supporting.js
CURRENT INSTRUCTIONS (Including all MANDATORY/FORBIDDEN rules):

**MANDATORY REQUIREMENTS:**
- >>> Infrastructure locations must include emergency-specific critical locations: <<<
  - For Refrigerant emergencies: Add refrigerant storage, recovery equipment, leak detectors, ventilation controls, PPE storage locations
  - For Water emergencies: Add water shutoff valves, floor drains, sump pumps, wet vacs, water sensors locations
  - For Fire/Smoke: Add fire alarm panel, suppression controls, extinguishers, evacuation routes, fire pump locations
  - For Mechanical failures: Add spare motor location, bearing storage, belt/coupling storage, alignment tools locations
  - For Temperature emergencies: Add temporary cooling connection points, load bank locations, portable unit staging areas
  - For Control failures: Add network closets, control panels, BMS workstations, backup control locations
- >>> Spare parts table must list parts relevant to emergency type (not just electrical parts) <<<

**FORBIDDEN:**
- Only listing electrical infrastructure for non-electrical emergencies
- Generic spare parts list that doesn't match emergency type

---

SECTION: EOP Approval & Review
FILE: lib/eop-sections/section-08-approval.js
CURRENT INSTRUCTIONS (Including all MANDATORY/FORBIDDEN rules):

**MANDATORY REQUIREMENTS:**
- Include standard approvers: Author (Facilities Engineer), Approver (Facilities Manager), Reviewer (Safety Officer)
- >>> Add emergency-specific approvers: <<<
  - For Refrigerant emergencies: Environmental Compliance Officer, Refrigerant Program Manager
  - For Fire/Smoke emergencies: Fire Marshal, Life Safety Officer
  - For Control System failures: IT Manager, Control Systems Engineer
  - For Water emergencies: Plumbing Supervisor, Risk Management
  - For High Temperature/Cooling Loss: Data Center Operations Manager, Critical Systems Manager
  - For Mechanical failures: Mechanical Engineering Lead, Reliability Engineer
- Next Review Date must default to one year from current date
- Include revision tracking table

**FORBIDDEN:**
- Generic approval matrix that doesn't reflect emergency type's stakeholders
- Missing critical approvers for safety-sensitive emergencies

=================================
EMERGENCY TYPE CODES REFERENCE
=================================

Complete mapping of emergency types to their 3-4 letter codes for EOP identification:

1. PWR - Power Failure/Outage
2. HDP - High Discharge Pressure Alarm
3. LSP - Low Suction Pressure/Temperature
4. COMP - Compressor Failure
5. HWT - High Water Temperature Alarm
6. REFL - Refrigerant Leak Detection
7. CTRL - Control System Failure
8. CDF - Condenser Fan Failure
9. CWF - Condenser Water Flow Failure
10. CHWF - Chilled Water Flow Failure
11. TEMP - Extreme Ambient Temperature
12. VIB - Vibration/Noise Alarm
13. SHUT - Complete Chiller Shutdown
14. FIRE - Fire/Smoke Detection
15. RECV - Recovery Procedures
16. FAN - Fan Failure
17. PUMP - Pump Failure
18. GEAR - Gear Box Failure
19. MTR - Pump Motor Failure
20. SEAL - Pump Seal Failure
21. BRG - Bearing Failure
22. VFD - VFD Failure
23. STRN - Blocked Strainer
24. AIRL - Pump Air Locked
25. CAV - Pump Cavitation
26. FLOW - Loss of Airflow
27. LEAK - Water Leak Detection
28. COMM - Communication Loss
29. FRST - Frost Coil Alarm
30. DIFF - Differential Pressure Alarm
31. HUM - Humidity Alarm
32. EMER - Emergency Manual Override
33. SMOK - Smoke Detection Alarm
34. COOL - Loss of Cooling
35. COND - Condensate Water Alarm

=================================
KEY IMPROVEMENTS IN VERSION 2
=================================

**1. Emergency-Specific Adaptations**
   - All sections now dynamically adapt content based on the selected emergency type
   - Removed generic "power failure" language throughout
   - Each section contains specific instructions for different emergency scenarios

**2. Comprehensive Emergency Type Coverage**
   - 40+ distinct emergency type codes implemented
   - Clear mapping between emergency descriptions and codes
   - EOP identifier format includes emergency code for easy identification

**3. Manufacturer-Specific Requirements**
   - Enforced use of actual manufacturer names and model numbers
   - Required manufacturer-specific terminology (e.g., Carrier CCN, Trane Tracer)
   - Equipment specifications must match known model specifications

**4. Dynamic Content Generation**
   - PPE requirements change based on emergency type
   - Tools and equipment lists adapt to emergency needs
   - Recovery procedures specific to each emergency type
   - Contact lists include emergency-appropriate responders

**5. Enhanced Safety Requirements**
   - Emergency-specific hazard identification
   - Voltage-specific Arc Flash PPE requirements
   - Refrigerant handling safety for leak scenarios
   - Fire/smoke specific evacuation procedures

**6. Improved Document Structure**
   - Clear MANDATORY and FORBIDDEN rules in each section
   - Adaptive section titles (not just "Power Restoration")
   - Emergency-specific verification tables and checklists
   - Proper HTML formatting without container elements

**7. Compliance and Approval**
   - Emergency-specific approver requirements
   - Environmental compliance for refrigerant emergencies
   - Fire Marshal involvement for fire/smoke events
   - IT management for control system failures

**8. Location and Infrastructure Tracking**
   - Emergency-specific critical location identification
   - Spare parts lists relevant to emergency type
   - Infrastructure maps adapted to emergency needs
   - Clear location field usage throughout document

**IMPLEMENTATION NOTES:**
- All adaptive instructions are marked with >>> <<< for easy identification
- The AI must read the emergency type from the form and adapt ALL sections accordingly
- No generic procedures are allowed - everything must be specific to the equipment and emergency
- The document must be immediately actionable with no placeholder text