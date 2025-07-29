// lib/mop-knowledge.js

export const MOP_PROJECT_KNOWLEDGE = `
AI Instructions for Data Center MOP Generation Tool - Enhanced SDS Integration

🔍 RESEARCH REQUIREMENT - CRITICAL

MANDATORY: Always research unknown information before generating MOPs

What to Research (USE WEB SEARCH) - COMPREHENSIVE REQUIREMENTS:

📚 USING REFERENCE MOPs FROM KNOWLEDGE BASE

If old/reference MOPs are available in the knowledge base:

✅ APPROPRIATE USE OF REFERENCE MOPs:

Technical Content Reference: Use as examples of technical detail level and professional language
Procedure Inspiration: Reference maintenance sequences and technical procedures for similar equipment
Safety Language Examples: Use as examples of how safety requirements are professionally written
Risk Assessment Examples: Reference how risks are identified and mitigation strategies described
Technical Terminology: Use professional terminology and phrasing from reference documents
Quality Standards: Use as examples of the level of detail and professionalism expected

🚫 NEVER USE REFERENCE MOPs FOR:

Document Structure: Always use the exact 11-section format specified - ignore different formats in reference MOPs
Outdated Information: Never copy old technical specifications, part numbers, or procedures without current verification
Different Equipment: Never copy procedures from different equipment types or models
Old Safety Standards: Always research current OSHA/NFPA requirements rather than using old standards
Copy-Paste Content: Never directly copy sections without verification and adaptation to current requirements

⚖️ BALANCED APPROACH:

Research Current Information First: Always conduct comprehensive web research as primary source
Reference for Enhancement: Use old MOPs to enhance technical language and detail level
Verify All Technical Content: Cross-reference any information from old MOPs with current sources
Maintain Format Compliance: Strictly follow the 11-section format regardless of reference document formats
Update All Standards: Use current regulatory requirements, not old versions

📋 QUALITY INTEGRATION:

Professional Language: Adopt the technical writing style and terminology from reference MOPs
Detail Level: Match or exceed the level of technical detail shown in reference examples
Safety Emphasis: Use reference MOPs to understand appropriate level of safety emphasis
Procedure Structure: Learn from the logical flow and organization of procedures in reference documents

[CONTINUE WITH ALL YOUR INSTRUCTIONS...]
`;

export const EQUIPMENT_DATABASE = {
  'Trane': {
    'CVHF1000': {
      type: 'Centrifugal Chiller',
      coolingCapacity: '1000 tons',
      powerRequirements: '460V/3PH/60Hz',
      fullLoadAmps: '1250A',
      refrigerant: 'R-134a',
      refrigerantCharge: '1200 lbs',
      oilType: 'Trane Oil 00022',
      serviceIntervals: {
        oil: 'Annual or 5000 hours',
        vibration: 'Quarterly',
        eddyCurrent: 'Annual',
        megger: 'Annual'
      },
      criticalSpecs: {
        minOilPressure: '18 PSID',
        maxDischargeTemp: '220°F',
        minEvapApproach: '2°F',
        maxCondApproach: '5°F'
      },
      commonIssues: [
        'VSD faults (check IGBT modules)',
        'Oil pressure trips (check oil filter)',
        'Condenser approach (clean tubes)',
        'Surge conditions (check guide vanes)'
      ],
      shutdownProcedure: [
        'Reduce load to minimum (20%)',
        'Verify redundant chiller stable',
        'Enable soft shutdown',
        'Monitor oil return',
        'Close chilled water valves after coast-down'
      ],
      commonProcedures: [
        'Quarterly PM',
        'Annual teardown',
        'Oil analysis',
        'Vibration testing',
        'Eddy current testing'
      ]
    },
    'CVHF500': {
      type: 'Centrifugal Chiller',
      coolingCapacity: '500 tons',
      powerRequirements: '460V/3PH/60Hz',
      refrigerant: 'R-134a'
    }
  },
  'Carrier': {
    '19XR': {
      type: 'Centrifugal Chiller',
      coolingCapacity: 'Variable',
      powerRequirements: '460V/3PH/60Hz',
      refrigerant: 'R-134a'
    }
  },
  'York': {
    'YK': {
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
    },
    'DSE': {
      type: 'CRAC Unit with Economizer',
      coolingCapacity: '30 tons',
      powerRequirements: '460V/3PH/60Hz'
    }
  },
  'Caterpillar': {
    '3516B': {
      type: 'Diesel Generator',
      powerOutput: '2000 kW',
      voltage: '480V/3PH/60Hz',
      fuel: 'Diesel #2'
    }
  }
};

export const SAFETY_REQUIREMENTS = {
  electrical: {
    lockoutTagout: [
      'Notify all affected personnel',
      'Identify all energy sources',
      'Shut down equipment via normal procedure',
      'Isolate all energy sources',
      'Apply locks and tags',
      'Verify zero energy state with meter',
      'Attempt restart to confirm isolation'
    ],
    arcFlash: {
      category0: 'Untreated cotton (min 4.5 cal/cm²)',
      category1: 'FR shirt and pants (min 4 cal/cm²)',
      category2: 'FR clothing set (min 8 cal/cm²)', 
      category3: 'FR clothing + arc flash suit (min 25 cal/cm²)',
      category4: 'Full arc flash suit (min 40 cal/cm²)'
    }
  },
  mechanical: {
    hotWork: [
      'Obtain hot work permit',
      'Fire watch posted',
      'Fire extinguisher within 35 feet',
      'Remove combustibles 35-foot radius',
      'Continuous atmospheric monitoring',
      '1-hour fire watch after completion'
    ],
    confinedSpace: [
      'Atmospheric testing required',
      'Continuous ventilation',
      'Attendant required',
      'Retrieval equipment ready',
      'Communication maintained'
    ]
  },
  refrigerant: {
    'R-134a': {
      exposureLimit: '1000 ppm TWA',
      symptoms: 'Dizziness, loss of concentration',
      ppe: 'SCBA for > 1000 ppm',
      monitoring: 'Continuous with alarm at 500 ppm'
    },
    'R-410A': {
      exposureLimit: '1000 ppm TWA',
      symptoms: 'Cardiac sensitization risk',
      ppe: 'SCBA for > 1000 ppm',
      monitoring: 'Required for all work'
    }
  }
};

export const STANDARD_TOOLS = {
  electrical: {
    testing: [
      'Digital multimeter (Fluke 87V or equivalent) - Calibrated',
      'Clamp meter (1000A capacity minimum)',
      'Insulation tester (1000V megger)',
      'Phase rotation meter',
      'Infrared camera (FLIR or equivalent)',
      'Oscilloscope (for VSD troubleshooting)'
    ],
    safety: [
      'Voltage detector (non-contact)',
      'Lock-out/tag-out kit with hasps',
      'Insulated tools (1000V rated)',
      'Rubber blankets and barriers',
      'Ground cluster assembly',
      'Hot stick (for racking breakers)'
    ]
  },
  hvac: {
    service: [
      'Digital refrigerant gauges',
      'Vacuum pump (500 micron capability)',
      'Refrigerant recovery unit',
      'Torque wrench (up to 600 ft-lbs)',
      'Tube cleaning kit',
      'Eddy current tester',
      'Vibration analyzer'
    ],
    measurement: [
      'Digital psychrometer',
      'Differential pressure gauge',
      'Flow meter (ultrasonic)',
      'Temperature probes (calibrated)',
      'Data logger (8 channel minimum)',
      'Laser tachometer'
    ]
  },
  general: [
    'Ladder (fiberglass, appropriate height)',
    'Portable lighting (intrinsically safe)',
    'Spill kit (for oil/refrigerant)',
    'First aid kit',
    'Two-way radios',
    'Barrier tape and cones',
    'Digital camera for documentation'
  ]
};

export const VERIFICATION_PROCEDURES = {
  electrical: {
    postMaintenance: [
      'Verify phase rotation',
      'Check all connections with IR camera',
      'Measure and record voltages all phases',
      'Verify current balance < 5%',
      'Check all safety interlocks',
      'Test emergency stops',
      'Verify alarm functions'
    ]
  },
  mechanical: {
    chiller: [
      'Check oil level and pressure',
      'Verify refrigerant pressures',
      'Record superheat and subcooling',
      'Check vibration levels',
      'Verify flow rates',
      'Test all safeties',
      'Confirm BMS communication'
    ]
  }
};

// Helper function to get equipment specs
export function getEquipmentSpecs(manufacturer, model) {
  return EQUIPMENT_DATABASE[manufacturer]?.[model] || null;
}

// Helper function to get safety requirements
export function getSafetyRequirements(workType) {
  const requirements = [];
  if (workType.includes('electrical')) {
    requirements.push(...SAFETY_REQUIREMENTS.electrical.lockoutTagout);
  }
  if (workType.includes('refrigerant')) {
    requirements.push('Refrigerant monitoring required');
  }
  return requirements;
}