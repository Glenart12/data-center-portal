import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Your comprehensive MOP project instructions
const MOP_PROJECT_KNOWLEDGE = `
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

1. Equipment Specifications (EXHAUSTIVE RESEARCH):

MODEL NUMBER BREAKDOWN: Research EVERY part of the model number - prefixes, numbers, suffixes, and what each means to the manufacturer
Complete Technical Specifications: Voltage, amperage, capacity, dimensions, weight, environmental requirements
Manufacturer maintenance manuals and procedures (search for exact model-specific documentation)
Service intervals and requirements (search multiple sources to verify frequency)
Known issues, recalls, and service bulletins (search manufacturer websites and industry forums)
Replacement parts and part numbers (filters, batteries, fuses, oil, coolant, etc.)
Operating parameters (normal temperatures, pressures, voltages, currents)
Performance specifications (efficiency ratings, capacity ratings, environmental limits)

2. Maintenance Requirements (DETAILED RESEARCH):

Equipment-Specific Maintenance Tasks: Research EVERY maintenance task for the specific equipment type
Manufacturer-Recommended Procedures: Find exact step-by-step procedures from OEM manuals
Required Tools and Equipment: Research specialized tools, test equipment, and measuring devices
Consumables and Materials: All fluids, filters, batteries, wear parts, cleaning materials
Calibration Requirements: What needs calibration and how often
Testing and Verification Procedures: Post-maintenance testing requirements
Documentation Requirements: What records must be kept

3. Safety Requirements (COMPREHENSIVE RESEARCH):

OSHA Standards: Research ALL applicable OSHA requirements for the equipment type and work scope
Industry-Specific Safety Standards: NFPA, IEEE, ASHRAE, etc. based on equipment type
Equipment-Specific Hazards: Research EVERY potential hazard (electrical, mechanical, chemical, thermal)
Manufacturer Safety Requirements: Safety precautions from OEM documentation
Personal Protective Equipment: Research exact PPE requirements for each identified hazard
Emergency Procedures: Equipment-specific emergency shutdown and response procedures
Environmental Safety: Ventilation, containment, spill response requirements

4. CHEMICAL AND SDS RESEARCH (MANDATORY DETAILED ANALYSIS):

CRITICAL: Research and obtain actual SDS information for ALL chemicals/substances used in maintenance

CHEMICAL IDENTIFICATION PROCESS:

Research ALL maintenance chemicals for the specific equipment type:
Search: "[Equipment type] maintenance chemicals cleaning fluids"
Search: "[Equipment type] coil cleaner refrigerant lubricants"
Search: "[Manufacturer] [Model] approved chemicals maintenance materials"
MANDATORY: Identify EVERY substance that will be used during maintenance

Find ACTUAL Safety Data Sheets (SDS) for each chemical:
Search: "[Chemical name] safety data sheet SDS"
Search: "[Chemical name] [Manufacturer] SDS PDF"
Use SDS databases: Chemical Safety database, manufacturer websites
REQUIREMENT: Access and review actual SDS documents, not just summaries

Extract SPECIFIC safety information from each SDS:
Section 8 - Exposure Controls/Personal Protection: Exact PPE requirements
Section 2 - Hazards Identification: Specific hazards and signal words
Section 4 - First Aid Measures: Chemical-specific first aid procedures
Section 5 - Fire Fighting Measures: Fire/explosion hazards and extinguishing media
Section 7 - Handling and Storage: Safe handling and storage requirements
Section 11 - Toxicological Information: Health effects and exposure limits

COMMON MAINTENANCE CHEMICALS TO RESEARCH:

HVAC Equipment: Coil cleaners (Nu-Calgon, Simple Green, CRC), refrigerants (R-410A, R-134a), compressor oils
Electrical Equipment: Contact cleaners, dielectric sprays, transformer oils, cable lubricants
General Cleaning: Degreasers, solvent cleaners, disinfectants, metal cleaners
Specialty Chemicals: Thermal compounds, gasket sealers, thread lockers, penetrating oils

SDS INFORMATION INTEGRATION REQUIREMENTS:

Extract manufacturer name and product name from SDS
Document exact chemical composition (if disclosed in SDS)
Record specific PPE requirements from Section 8 of SDS
Note exposure limits and ventilation requirements
Document storage and handling requirements
Record first aid procedures specific to each chemical
Identify incompatible materials and storage restrictions

5. Regulatory Compliance (THOROUGH RESEARCH):

Federal Requirements: OSHA, EPA, DOT regulations applicable to equipment
State and Local Codes: Building codes, fire codes, environmental regulations
Industry Standards: All applicable NFPA, IEEE, ASHRAE, ANSI standards
Licensing Requirements: What certifications/licenses are required
Permit Requirements: Any permits needed for maintenance work
Inspection Requirements: Post-maintenance inspection requirements

6. Risk Assessment (COMPREHENSIVE):

Equipment-Specific Failure Modes: Research how the equipment typically fails
Impact Analysis: What happens if maintenance goes wrong
Business Impact: Effect on data center operations
Safety Risks: All potential risks to personnel
Mitigation Strategies: How to prevent and respond to problems

Research Process (COMPREHENSIVE 12-STEP METHODOLOGY):

MANDATORY RESEARCH SEQUENCE - NO SHORTCUTS ALLOWED

Step 1: Equipment Identification Research
Search: "[Manufacturer] [Model Number] specifications datasheet"
Search: "[Manufacturer] [Model Number] technical manual PDF"
Search: "[Model Number] service manual download"
Search: "[Manufacturer] [Model Number] parts list"
Break down EVERY part of the model number and research what each segment means
Research exact electrical specifications: voltage, phase, amperage, MCA, MOCP
Research physical specifications: dimensions, weight, mounting requirements
Research environmental specifications: operating temperature range, humidity limits

Step 2: Manufacturer Documentation Research
Search: "[Manufacturer] [Equipment Type] maintenance manual"
Search: "[Manufacturer] [Model Number] installation operation manual"
Search: "[Manufacturer] [Model Number] service procedures checklist"
Search: "[Manufacturer] [Model Number] troubleshooting guide"
Find official OEM documentation with specific maintenance intervals
Research manufacturer-specific tools and procedures
Find manufacturer part numbers for filters, belts, consumables

Step 3: Safety and Hazard Research
Search: "[Equipment Type] OSHA safety requirements"
Search: "[Equipment Type] maintenance hazards"
Search: "[Equipment Type] safety data sheet requirements"
Search: "[Manufacturer] [Model Number] safety precautions"
Identify ALL potential hazards

Step 4: CHEMICAL AND SDS RESEARCH (ENHANCED):
Search: "[Equipment Type] maintenance chemicals required"
Search: "[Equipment Type] coil cleaner refrigerant lubricants"
Search: "[Specific Chemical Name] safety data sheet SDS"
Search: "[Chemical Name] [Manufacturer] SDS PDF download"
MANDATORY: Find and review actual SDS documents for EVERY chemical
Extract specific PPE requirements from Section 8 of each SDS
Document hazards from Section 2 of each SDS
Record handling requirements from Section 7 of each SDS

Step 5: Regulatory and Standards Research
Search: "[Equipment Type] NFPA standards"
Search: "[Equipment Type] IEEE standards" (if electrical)
Search: "[Equipment Type] ASHRAE standards" (if HVAC)
Search: "[Equipment Type] building code requirements"
Find ALL applicable standards

Step 6: Maintenance Procedures Research
Search: "[Equipment Type] preventive maintenance procedures"
Search: "[Manufacturer] [Model Number] maintenance checklist"
Search: "[Equipment Type] maintenance best practices"
Search: "[Equipment Type] service interval recommendations"
Get detailed maintenance procedures

Step 7: Tools and Materials Research
Search: "[Equipment Type] maintenance tools required"
Search: "[Manufacturer] [Model Number] recommended tools"
Search: "[Equipment Type] test equipment requirements"
Search: "[Equipment Type] maintenance materials parts"
Identify ALL required tools and materials

Step 8: Personnel Requirements Research
Search: "[Equipment Type] technician certification requirements"
Search: "[Equipment Type] training requirements"
Search: "[Manufacturer] [Equipment Type] authorized service"
Search: "[Equipment Type] licensing requirements"
Determine qualified personnel needs

Step 9: Risk and Impact Research
Search: "[Equipment Type] failure modes"
Search: "[Equipment Type] maintenance risks"
Search: "[Equipment Type] data center impact"
Search: "[Equipment Type] business continuity"
Assess all risks and impacts

Step 10: Emergency and Backout Research
Search: "[Equipment Type] emergency shutdown procedures"
Search: "[Manufacturer] [Model Number] emergency procedures"
Search: "[Equipment Type] malfunction response"
Search: "[Equipment Type] restoration procedures"
Develop equipment-specific emergency procedures

Step 11: Verification and Cross-Reference
Cross-reference information from multiple sources
Verify technical specifications from manufacturer sources
Confirm safety requirements from official standards
Ensure 100% accuracy of all information

Step 12: Gap Analysis and Marking
Identify any information that cannot be verified
Mark uncertain information for human verification
Note any conflicting information found
Mark gaps with red "UPDATE NEEDED" text

What NOT to Research (Mark for Update):
Facility-specific details (serial numbers, asset tags, personnel names)
Customer-specific procedures and approval processes
Site-specific safety procedures not publicly available
Proprietary facility information

DATA CENTER MOP RISK & CET LEVEL FRAMEWORK

MOP RISK LEVEL ASSESSMENT CRITERIA

GUIDING PRINCIPLE: The final risk level is determined by the single highest-risk criterion the MOP meets. Evaluate from Level 4 down to Level 1.

Level 4 - Critical Risk: Guaranteed, widespread service outage. Affects the entire facility, a major data hall, or a core platform (e.g., "black building" power-down test, primary chiller plant replacement). Rollback may not be feasible.

Level 3 - High Risk: Service impact is expected or highly likely. Affects a Single Point of Failure (SPOF), a critical system without full redundancy, or a large fleet of systems (e.g., core router firmware upgrade, patching all hypervisors).

Level 2 - Medium Risk: Service impact is possible but not expected. Affects a redundant component of a critical system (e.g., one PDU in an A/B pair) or a small group (2-5) of non-critical systems.

Level 1 - Low Risk: No service impact is possible. Affects a single, non-critical system (e.g., cabling a new server, decommissioning a lab device).

CET SKILL LEVEL DEFINITIONS

GUIDING PRINCIPLE: This defines the minimum skill level required to perform or lead a task. A higher-level CET can always perform tasks designated for a lower level.

Level 4 - Chief Engineer: Strategic Oversight & Final Approval. Provides ultimate technical authority on critical operations. Reviews and provides final engineering approval for Level 4 MOPs. Does not typically perform hands-on work but oversees the entire operation.

Level 3 - Lead Technician: Leads Complex & High-Risk Work. Authorized to lead the execution of complex procedures. Writes, reviews, and approves Level 3 MOPs. Capable of troubleshooting critical systems under pressure and mentoring junior staff.

Level 2 - Technician: Independent Standard Work. Works independently on well-documented, standard procedures. Authorized to execute Level 2 MOPs without direct supervision and can supervise CET 1s. Possesses a comprehensive understanding of most data center systems.

Level 1 - Junior Technician: Supervised, Routine Tasks. Executes pre-defined, low-risk tasks on non-critical systems. Must work under the direct supervision of a CET 2 or higher at all times. Authorized to execute Level 1 MOPs only.

COMBINED DECISION MATRIX & LOGIC

MOP Risk Level to CET Level Mapping:
- Risk Level 4 → CET 3 to Execute, CET 4 to Supervise/Lead, CET 4 to Approve
- Risk Level 3 → CET 2 to Execute, CET 3 to Supervise/Lead, CET 3 to Approve
- Risk Level 2 → CET 2 to Execute, Can work independently, CET 3 to Approve
- Risk Level 1 → CET 1 to Execute, CET 2 to Supervise, CET 2 to Approve

[FULL MOP TEMPLATE AND REQUIREMENTS CONTINUE...]
`;

// Equipment database (you can expand this)
const EQUIPMENT_DATABASE = {
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

const SAFETY_REQUIREMENTS = {
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

export async function POST(request) {
  try {
    console.log('AI MOP Generation request received');
    
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { formData, supportingDocs } = await request.json();
    
    // Get equipment specs if available
    const equipmentSpecs = EQUIPMENT_DATABASE[formData.manufacturer]?.[formData.modelNumber] || {};
    
    // Extract content from supporting documents
    let documentContext = '';
    if (supportingDocs && supportingDocs.length > 0) {
      documentContext = '\n\nSUPPORTING DOCUMENTS PROVIDED:\n';
      for (const doc of supportingDocs) {
        documentContext += `\nDocument: ${doc.name}\n`;
        // Note: In production, you'd parse PDFs here
        // For now, we just note that documents were provided
      }
    }

    // Create comprehensive prompt with your complete instructions
    const prompt = `
${MOP_PROJECT_KNOWLEDGE}

CURRENT EQUIPMENT INFORMATION PROVIDED BY USER:
- Manufacturer: ${formData.manufacturer}
- Model Number: ${formData.modelNumber}
- Equipment ID: ${formData.equipmentId || 'TO BE DETERMINED'}
- Serial Number: ${formData.serialNumber || 'TO BE DETERMINED'}
- Work Type: ${formData.workType}
- Risk Level: ${formData.riskLevel}
- Location: ${formData.location || 'Data Center'}
- Affected Systems: ${formData.affectedSystems || 'TO BE DETERMINED'}

EQUIPMENT SPECIFICATIONS FROM DATABASE:
${JSON.stringify(equipmentSpecs, null, 2)}

WORK DESCRIPTION PROVIDED:
${formData.description}

APPLICABLE SAFETY REQUIREMENTS:
${JSON.stringify(SAFETY_REQUIREMENTS, null, 2)}

${documentContext}

CRITICAL INSTRUCTIONS:
1. Follow the EXACT 11-section MOP format provided in the instructions above
2. Conduct comprehensive research for all technical specifications and requirements
3. Research and include actual SDS information for all maintenance chemicals
4. Use red <span style="color:red">**UPDATE NEEDED - [instruction]**</span> markers for any information that requires on-site verification
5. Include specific manufacturer part numbers, specifications, and procedures
6. Determine risk level using the 4-level framework and provide brief rationale
7. Map CET level from risk level using the decision matrix and provide brief rationale
8. Format the document EXACTLY as specified in the template
9. Make the MOP immediately usable by field technicians

Generate a complete, professional Method of Procedure (MOP) following ALL requirements above.`;

    console.log('Calling Gemini AI...');
    
    // Generate content with Gemini - UPDATED MODEL NAME
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',  // Fixed model name
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const mopContent = response.text();
    
    console.log('AI generation successful');

    // Create filename
    const timestamp = new Date().toISOString().split('T')[0];
    const safeManufacturer = formData.manufacturer.replace(/[^a-zA-Z0-9]/g, '_');
    const safeModel = formData.modelNumber.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `MOP_${safeManufacturer}_${safeModel}_${timestamp}`;

    // Ensure directory exists
    const mopsDir = path.join(process.cwd(), 'public', 'mops');
    if (!existsSync(mopsDir)) {
      await mkdir(mopsDir, { recursive: true });
    }

    // Save the generated MOP
    const filePath = path.join(mopsDir, `${filename}.txt`);
    await writeFile(filePath, mopContent, 'utf8');
    
    console.log(`MOP saved to: ${filePath}`);

    return NextResponse.json({ 
      message: 'MOP generated successfully with AI',
      filename: `${filename}.txt`,
      preview: mopContent.substring(0, 500) + '...' // Send preview
    });

  } catch (error) {
    console.error('Error generating MOP with AI:', error);
    return NextResponse.json(
      { error: `Failed to generate MOP: ${error.message}` },
      { status: 500 }
    );
  }
}