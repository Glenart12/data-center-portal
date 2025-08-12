=================================
EOP GENERATION SYSTEM - SECTION REVIEW
=================================
Document Purpose: Expert review of AI instructions for EOP generation
Review Date: January 12, 2025
Reviewer: ________________________

SYSTEM OVERVIEW:
- 10 instruction files totaling 778 lines
- 35 emergency types supported
- 34 equipment models in database
- Generates 8-section HTML documents

REVIEW GOALS:
1. Verify section content meets industry standards
2. Identify missing safety requirements
3. Improve emergency-specific adaptations
4. Ensure compliance with regulations

=================================


=================================
SECTION: Header & Document Setup
FILE: lib/eop-sections/header.js
PURPOSE: Creates the main EOP header with equipment identification and establishes document generation rules
=================================

CURRENT INSTRUCTIONS TO AI:
- Generate complete, detailed procedures with NO placeholders or generic text
- Create interactive HTML with editable input fields throughout the document
- Use manufacturer-specific terminology (Carrier uses CCN, Trane uses Tracer, etc.)
- Include a prominent warning box with emergency type and critical equipment specs
- Adapt ALL content based on the specific equipment and emergency type

WHAT IT GENERATES:
- Red warning box with emergency type and equipment model
- Critical specifications display (voltage, phase, refrigerant type, capacity)
- Manufacturer-specific control system references
- Location and date fields

EMERGENCY TYPE ADAPTATIONS:
- Power Failure: Emphasizes electrical specifications and voltage ratings
- Refrigerant Leak: Highlights refrigerant type and charge amount
- Fire/Smoke: Includes fire suppression system type
- High Temperature: Shows cooling capacity and temperature ratings

REVIEW QUESTIONS FOR EOP EXPERT:
□ Is the warning box format standard for emergency procedures?
□ Should we include additional critical specs in the header?
□ Are manufacturer-specific terms correctly applied?
□ Should the header include immediate danger warnings?

EXPERT NOTES:
_________________________________
_________________________________
_________________________________

---

=================================
SECTION: Section 01 - Identification
FILE: lib/eop-sections/section-01-identification.js
PURPOSE: Creates unique EOP identifier and maps emergency types to standardized codes
=================================

CURRENT INSTRUCTIONS TO AI:
- Generate unique EOP ID using pattern: EOP-[Manufacturer]-[Model]-[Emergency Code]-[Number]
- Map each emergency type to a 3-4 letter code (PWR, REFL, FIRE, etc.)
- Include comprehensive equipment identification fields
- Create version control and tracking fields

WHAT IT GENERATES:
- EOP identifier (e.g., EOP-CAR-19XRV5P5-PWR-001)
- Emergency type code mapping
- Equipment serial number field
- Location identifier
- Version and revision tracking

EMERGENCY TYPE ADAPTATIONS:
- Power Failure: Uses code PWR
- Refrigerant Leak: Uses code REFL
- Fire/Smoke: Uses code FIRE
- High Temperature: Uses code TEMP
- Plus 30+ additional emergency codes

REVIEW QUESTIONS FOR EOP EXPERT:
□ Are the emergency codes industry standard?
□ Should we follow a different EOP numbering system?
□ Do we need additional identification fields?
□ Should codes align with NFPA or other standards?

EXPERT NOTES:
_________________________________
_________________________________
_________________________________

---

=================================
SECTION: Section 02 - Purpose & Scope
FILE: lib/eop-sections/section-02-purpose-scope.js
PURPOSE: Defines the EOP's purpose, scope, activation criteria, and safety notices
=================================

CURRENT INSTRUCTIONS TO AI:
- State specific purpose based on emergency type (restore power, stop leak, reduce pressure)
- Define scope referencing the actual equipment component
- List activation criteria specific to the emergency
- Include safety notices with emergency-specific hazards

WHAT IT GENERATES:
- Purpose statement tailored to emergency
- Scope defining equipment and area coverage
- Bullet list of activation triggers
- Red-boxed safety notice with specific warnings

EMERGENCY TYPE ADAPTATIONS:
- Power Failure: Focus on electrical safety and de-energization procedures
- Refrigerant Leak: Emphasize chemical exposure and ventilation requirements
- Fire/Smoke: Include evacuation procedures and suppression system info
- High Temperature: Highlight thermal hazards and heat stress prevention

REVIEW QUESTIONS FOR EOP EXPERT:
□ Are activation criteria comprehensive enough?
□ Should scope include adjacent equipment?
□ Are safety notices sufficiently prominent?
□ Do we need regulatory compliance statements?

EXPERT NOTES:
_________________________________
_________________________________
_________________________________

---

=================================
SECTION: Section 03 - Immediate Actions
FILE: lib/eop-sections/section-03-immediate-actions.js
PURPOSE: Provides immediate emergency response actions, safety requirements, and initial diagnostics
=================================

CURRENT INSTRUCTIONS TO AI:
- Create emergency-specific immediate action steps (not generic)
- Generate PPE requirements table adapted to emergency type
- List required tools specific to the emergency
- Include diagnostic procedures with measurement tables
- Add manufacturer technical support contacts

WHAT IT GENERATES:
- Step-by-step immediate response actions
- PPE requirements table with specific items
- Tools and equipment checklist
- Diagnostic measurement table with input fields
- Safety verification procedures

EMERGENCY TYPE ADAPTATIONS:
- Power Failure: Electrical PPE (arc flash suit), multimeter, voltage verification table
- Refrigerant Leak: Respiratory protection, gas detector, concentration measurement table
- Fire/Smoke: Fire-resistant gear, smoke detector status, suppression system checks
- High Temperature: Heat-resistant gloves, IR thermometer, temperature mapping table

REVIEW QUESTIONS FOR EOP EXPERT:
□ Are immediate actions in the correct priority order?
□ Is the PPE table comprehensive for all hazards?
□ Should diagnostics include more parameters?
□ Do we need lockout/tagout procedures here?

EXPERT NOTES:
_________________________________
_________________________________
_________________________________

---

=================================
SECTION: Section 04 - Emergency Scenarios
FILE: lib/eop-sections/section-04-scenarios.js
PURPOSE: Generates four different emergency scenarios with specific response procedures
=================================

CURRENT INSTRUCTIONS TO AI:
- Create 4 scenarios completely different based on emergency type
- Include trigger conditions for each scenario
- Generate verification tables with appropriate measurements
- Provide detailed response steps for each scenario
- Include equipment-specific recovery procedures

WHAT IT GENERATES:
- Four detailed scenarios with increasing severity
- Trigger condition descriptions
- Verification check tables
- Step-by-step response procedures
- Recovery criteria for each scenario

EMERGENCY TYPE ADAPTATIONS:
- Power Failure: Primary power loss, distribution failure, circuit failure, protection trip
- Refrigerant Leak: Minor leak (<25ppm), major leak (>100ppm), catastrophic rupture, multiple leaks
- Fire/Smoke: Detector alarm, visible smoke, active fire, post-suppression
- High Temperature: Gradual rise, rapid spike, cooling loss, cascade failure

REVIEW QUESTIONS FOR EOP EXPERT:
□ Are scenario progressions logical?
□ Do we cover all likely failure modes?
□ Are response procedures detailed enough?
□ Should we include time estimates?

EXPERT NOTES:
_________________________________
_________________________________
_________________________________

---

=================================
SECTION: Section 05 - Communication Protocols
FILE: lib/eop-sections/section-05-communication.js
PURPOSE: Establishes communication protocols and emergency contact lists
=================================

CURRENT INSTRUCTIONS TO AI:
- Include manufacturer-specific support contacts
- Add emergency-specific response teams
- Create editable contact tables
- Include escalation procedures
- Add regulatory notification requirements where applicable

WHAT IT GENERATES:
- Emergency contact table with service types
- Manufacturer technical support numbers
- Specialized response team contacts
- Escalation matrix
- Input fields for phone numbers

EMERGENCY TYPE ADAPTATIONS:
- Power Failure: Electrical contractor, utility company, generator service
- Refrigerant Leak: EPA hotline, environmental team, refrigerant recovery service
- Fire/Smoke: Fire marshal, suppression vendor, evacuation coordinator
- High Temperature: HVAC contractor, temporary cooling vendor, load management

REVIEW QUESTIONS FOR EOP EXPERT:
□ Are all required contacts included?
□ Should we add backup contacts?
□ Do we need international contacts?
□ Should escalation times be specified?

EXPERT NOTES:
_________________________________
_________________________________
_________________________________

---

=================================
SECTION: Section 06 - Recovery Procedures
FILE: lib/eop-sections/section-06-recovery.js
PURPOSE: Provides systematic recovery and return-to-service procedures
=================================

CURRENT INSTRUCTIONS TO AI:
- Change title to match emergency type (not always "Power Restoration")
- Verify resolution of the actual emergency condition
- Include pre-start safety checks specific to emergency
- Measure parameters relevant to the emergency type
- Include documentation requirements (EPA for refrigerant, etc.)

WHAT IT GENERATES:
- 7-step recovery process
- Verification checklist tables
- Parameter measurement requirements
- Gradual restart procedures
- Documentation requirements

EMERGENCY TYPE ADAPTATIONS:
- Power Failure: Voltage verification, phase rotation check, load sequencing
- Refrigerant Leak: Leak repair verification, evacuation, recharge procedures, EPA forms
- Fire/Smoke: All-clear verification, smoke purge, equipment inspection, reset procedures
- High Temperature: Temperature normalization, root cause verification, limit resets

REVIEW QUESTIONS FOR EOP EXPERT:
□ Are recovery steps in safe sequence?
□ Do we need more verification points?
□ Are documentation requirements complete?
□ Should we include test run procedures?

EXPERT NOTES:
_________________________________
_________________________________
_________________________________

---

=================================
SECTION: Section 07 - Supporting Information
FILE: lib/eop-sections/section-07-supporting.js
PURPOSE: Provides reference information including locations, spare parts, and documents
=================================

CURRENT INSTRUCTIONS TO AI:
- List emergency-specific infrastructure locations
- Include spare parts relevant to emergency type
- Reference applicable technical documents
- Add equipment-specific resource locations

WHAT IT GENERATES:
- Critical infrastructure locations table
- Spare parts inventory list
- Related documents reference list
- Resource location maps/descriptions

EMERGENCY TYPE ADAPTATIONS:
- Power Failure: Electrical panels, disconnects, transfer switches, generator connections
- Refrigerant Leak: Storage locations, recovery equipment, ventilation controls, sensors
- Fire/Smoke: Alarm panels, suppression controls, extinguisher locations, exits
- High Temperature: Cooling connections, load banks, portable unit staging areas

REVIEW QUESTIONS FOR EOP EXPERT:
□ Are all critical locations identified?
□ Is spare parts list comprehensive?
□ Should we include part numbers?
□ Do we need facility diagrams?

EXPERT NOTES:
_________________________________
_________________________________
_________________________________

---

=================================
SECTION: Section 08 - Approval & Revision
FILE: lib/eop-sections/section-08-approval.js
PURPOSE: Creates approval matrix and revision tracking system
=================================

CURRENT INSTRUCTIONS TO AI:
- Include standard approvers (Author, Technical, Operations)
- Add emergency-specific approvers based on type
- Set review cycle to one year
- Create revision history tracking table

WHAT IT GENERATES:
- Approval signature matrix
- Role-based approval requirements
- Next review date (auto-calculated)
- Revision history table
- Change tracking fields

EMERGENCY TYPE ADAPTATIONS:
- Power Failure: Electrical supervisor approval required
- Refrigerant Leak: Environmental compliance officer, refrigerant program manager
- Fire/Smoke: Fire marshal, life safety officer approval
- High Temperature: Critical systems manager, data center ops manager

REVIEW QUESTIONS FOR EOP EXPERT:
□ Are approval levels appropriate?
□ Should we require more signatures?
□ Is one-year review cycle correct?
□ Do we need regulatory approvals?

EXPERT NOTES:
_________________________________
_________________________________
_________________________________

---

=================================
SECTION: Formatting Instructions
FILE: lib/eop-sections/formatting.js
PURPOSE: Provides HTML formatting rules and styling requirements
=================================

CURRENT INSTRUCTIONS TO AI:
- DO NOT generate DOCTYPE or HTML structure tags
- Use specific H1/H2 heading formats
- Apply red color (#dc3545) to all warnings
- Create professional tables with borders
- Replace placeholders with input fields

WHAT IT GENERATES:
- Consistent heading hierarchy
- Standardized table formatting
- Red emergency warnings
- Interactive input fields
- Professional styling

EMERGENCY TYPE ADAPTATIONS:
- None - provides universal formatting for all emergency types

REVIEW QUESTIONS FOR EOP EXPERT:
□ Is the formatting professional enough?
□ Should warnings be more prominent?
□ Do tables need different styling?
□ Should we follow specific standards?

EXPERT NOTES:
_________________________________
_________________________________
_________________________________

---

=================================
EXPERT RECOMMENDATIONS SUMMARY
=================================

CRITICAL CHANGES NEEDED:
1. ________________________________
2. ________________________________
3. ________________________________

NICE-TO-HAVE IMPROVEMENTS:
1. ________________________________
2. ________________________________
3. ________________________________

SECTIONS THAT ARE PERFECT AS-IS:
1. ________________________________
2. ________________________________

REGULATORY COMPLIANCE CHECK:
□ OSHA electrical safety standards
□ EPA refrigerant management requirements
□ NFPA emergency response codes
□ Local fire marshal requirements
□ Industry best practices (ASHRAE, etc.)

NEXT STEPS:
□ Update section files based on recommendations
□ Add missing emergency adaptations
□ Test with sample equipment
□ Deploy updated version

Signed: _________________________ Date: _________

=================================

SUMMARY FOR MANAGEMENT:

This document reviews the 10 instruction files that tell our AI system how to generate Emergency Operating Procedures (EOPs). Each section has been designed to adapt based on the specific emergency type selected (power failure, refrigerant leak, fire, etc.) and the equipment involved.

KEY REVIEW AREAS NEEDING EXPERT INPUT:

1. EMERGENCY CODES: We use 3-4 letter codes (PWR, REFL, FIRE) for each emergency type. Need verification these align with industry standards.

2. PPE REQUIREMENTS: Each emergency type specifies different protective equipment. Need expert validation that we're not missing critical safety gear.

3. RECOVERY SEQUENCES: The order of steps for returning equipment to service after each emergency. Critical for safety - needs expert review.

4. REGULATORY REQUIREMENTS: Currently includes EPA for refrigerant and OSHA for electrical. Need to verify we're meeting all compliance requirements.

5. SCENARIO COVERAGE: Each emergency type generates 4 scenarios of increasing severity. Need confirmation we're covering all likely failure modes.

The system currently supports 35 different emergency types and 34 equipment models, generating comprehensive 8-section documents in 5-10 seconds. This review will ensure our AI-generated procedures meet all industry standards and safety requirements.

=================================