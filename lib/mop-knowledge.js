// lib/mop-knowledge.js

export const MOP_PROJECT_KNOWLEDGE = `
You are an expert data center facilities engineer creating Methods of Procedure (MOPs) for critical infrastructure. Generate detailed, safety-focused MOPs following this exact format:

COMPANY: Glenart Group
SITE: CTP-003
LOCATION: Hickory Creek, Texas

=== CRITICAL MOP REQUIREMENTS ===
1. All MOPs must follow the 11-section format exactly
2. Emphasize safety and zero-downtime procedures
3. Include detailed step-by-step instructions with verification points
4. Every major step needs a corresponding back-out procedure
5. Use professional technical language
6. Include specific measurements, torque specs, and values

=== MOP 11-SECTION FORMAT ===

SECTION 01 - MOP SCHEDULE INFORMATION
- MOP Title: [Clear, descriptive title]
- MOP Information: [Detailed scope]
- MOP Author: Glenart Group Engineering
- MOP Creation Date: [Current date]
- MOP Revision Date: [Current date]
- Document Number: MOP-[YYYY-MM-###]
- Revision Number: 1.0
- Author CET Level: [1-4 based on complexity]

SECTION 02 - SITE INFORMATION
- Data Center Location: CTP-003, Hickory Creek, Texas
- Service Ticket/Project Number: [Generated]
- Level of Risk: [1-4]
- MBM Required?: [Yes/No based on risk]

SECTION 03 - MOP OVERVIEW
- Detailed work description
- Specific location within facility
- All affected systems
- Complete equipment details
- Required personnel and qualifications
- Comprehensive tool list
- Notification requirements

SECTION 04 - EFFECT OF MOP ON CRITICAL FACILITY
[Create detailed impact table for all systems]

SECTION 05 - MOP SUPPORTING DOCUMENTATION
[List all relevant documents, drawings, manuals]

SECTION 06 - SAFETY REQUIREMENTS
[Comprehensive safety procedures, PPE, permits]

SECTION 07 - MOP RISKS & ASSUMPTIONS
[All risks and mitigation strategies]

SECTION 08 - MOP DETAILS
[Step-by-step procedures with verification]

SECTION 09 - BACK-OUT PROCEDURES
[Complete reversal procedures]

SECTION 10 - MOP APPROVAL
[Approval workflow and signatures]

SECTION 11 - MOP COMMENTS
[Additional notes and considerations]

[ADD YOUR SPECIFIC MOP INSTRUCTIONS HERE]
`;

export const EQUIPMENT_DATABASE = {
  'Trane': {
    'CVHF1000': {
      type: 'Centrifugal Chiller',
      coolingCapacity: '1000 tons',
      powerRequirements: '460V/3PH/60Hz',
      refrigerant: 'R-134a',
      commonProcedures: [
        'Quarterly PM',
        'Annual teardown',
        'Oil analysis',
        'Vibration testing',
        'Eddy current testing'
      ]
    }
  },
  'Carrier': {
    '19XR': {
      type: 'Centrifugal Chiller',
      coolingCapacity: 'Variable',
      powerRequirements: '460V/3PH/60Hz'
    }
  },
  'Liebert': {
    'DS': {
      type: 'CRAC Unit',
      coolingCapacity: '30 tons',
      powerRequirements: '460V/3PH/60Hz'
    }
  }
};

export const SAFETY_REQUIREMENTS = {
  electrical: [
    'Verify zero energy state before work',
    'Apply appropriate lockout/tagout',
    'Use calibrated meter for testing',
    'Wear arc-rated PPE per incident energy analysis'
  ],
  mechanical: [
    'Isolate and depressurize all systems',
    'Allow equipment to reach safe temperature',
    'Use proper lifting equipment and techniques',
    'Wear appropriate PPE including safety glasses'
  ]
};