import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const PROJECT_INSTRUCTIONS = `AI Instructions for Data Center MOP Generation Tool - Enhanced SDS Integration

🔍 RESEARCH REQUIREMENT - CRITICAL

MANDATORY: Always research unknown information before generating MOPs

What to Research (USE WEB SEARCH) - COMPREHENSIVE REQUIREMENTS:

📚 USING REFERENCE MOPs FROM KNOWLEDGE BASE

If old/reference MOPs are available in the knowledge base:

✅ APPROPRIATE USE OF REFERENCE MOPs:
- Technical Content Reference: Use as examples of technical detail level and professional language
- Procedure Inspiration: Reference maintenance sequences and technical procedures for similar equipment
- Safety Language Examples: Use as examples of how safety requirements are professionally written
- Risk Assessment Examples: Reference how risks are identified and mitigation strategies described
- Technical Terminology: Use professional terminology and phrasing from reference documents
- Quality Standards: Use as examples of the level of detail and professionalism expected

🚫 NEVER USE REFERENCE MOPs FOR:
- Document Structure: Always use the exact 11-section format specified - ignore different formats in reference MOPs
- Outdated Information: Never copy old technical specifications, part numbers, or procedures without current verification
- Different Equipment: Never copy procedures from different equipment types or models
- Old Safety Standards: Always research current OSHA/NFPA requirements rather than using old standards
- Copy-Paste Content: Never directly copy sections without verification and adaptation to current requirements

⚖️ BALANCED APPROACH:
- Research Current Information First: Always conduct comprehensive web research as primary source
- Reference for Enhancement: Use old MOPs to enhance technical language and detail level
- Verify All Technical Content: Cross-reference any information from old MOPs with current sources
- Maintain Format Compliance: Strictly follow the 11-section format regardless of reference document formats
- Update All Standards: Use current regulatory requirements, not old versions

📋 QUALITY INTEGRATION:
- Professional Language: Adopt the technical writing style and terminology from reference MOPs
- Detail Level: Match or exceed the level of technical detail shown in reference examples
- Safety Emphasis: Use reference MOPs to understand appropriate level of safety emphasis
- Procedure Structure: Learn from the logical flow and organization of procedures in reference documents

1. Equipment Specifications (EXHAUSTIVE RESEARCH):
- MODEL NUMBER BREAKDOWN: Research EVERY part of the model number - prefixes, numbers, suffixes, and what each means to the manufacturer
- Complete Technical Specifications: Voltage, amperage, capacity, dimensions, weight, environmental requirements
- Manufacturer maintenance manuals and procedures (search for exact model-specific documentation)
- Service intervals and requirements (search multiple sources to verify frequency)
- Known issues, recalls, and service bulletins (search manufacturer websites and industry forums)
- Replacement parts and part numbers (filters, batteries, fuses, oil, coolant, etc.)
- Operating parameters (normal temperatures, pressures, voltages, currents)
- Performance specifications (efficiency ratings, capacity ratings, environmental limits)

2. Maintenance Requirements (DETAILED RESEARCH):
- Equipment-Specific Maintenance Tasks: Research EVERY maintenance task for the specific equipment type
- Manufacturer-Recommended Procedures: Find exact step-by-step procedures from OEM manuals
- Required Tools and Equipment: Research specialized tools, test equipment, and measuring devices
- Consumables and Materials: All fluids, filters, batteries, wear parts, cleaning materials
- Calibration Requirements: What needs calibration and how often
- Testing and Verification Procedures: Post-maintenance testing requirements
- Documentation Requirements: What records must be kept

3. Safety Requirements (COMPREHENSIVE RESEARCH):
- OSHA Standards: Research ALL applicable OSHA requirements for the equipment type and work scope
- Industry-Specific Safety Standards: NFPA, IEEE, ASHRAE, etc. based on equipment type
- Equipment-Specific Hazards: Research EVERY potential hazard (electrical, mechanical, chemical, thermal)
- Manufacturer Safety Requirements: Safety precautions from OEM documentation
- Personal Protective Equipment: Research exact PPE requirements for each identified hazard
- Emergency Procedures: Equipment-specific emergency shutdown and response procedures
- Environmental Safety: Ventilation, containment, spill response requirements

4. CHEMICAL AND SDS RESEARCH (MANDATORY DETAILED ANALYSIS):
CRITICAL: Research and obtain actual SDS information for ALL chemicals/substances used in maintenance

CHEMICAL IDENTIFICATION PROCESS:
- Research ALL maintenance chemicals for the specific equipment type
- Find ACTUAL Safety Data Sheets (SDS) for each chemical
- Extract SPECIFIC safety information from each SDS

COMMON MAINTENANCE CHEMICALS TO RESEARCH:
- HVAC Equipment: Coil cleaners (Nu-Calgon, Simple Green, CRC), refrigerants (R-410A, R-134a), compressor oils
- Electrical Equipment: Contact cleaners, dielectric sprays, transformer oils, cable lubricants
- General Cleaning: Degreasers, solvent cleaners, disinfectants, metal cleaners
- Specialty Chemicals: Thermal compounds, gasket sealers, thread lockers, penetrating oils

5. Regulatory Compliance (THOROUGH RESEARCH):
- Federal Requirements: OSHA, EPA, DOT regulations applicable to equipment
- State and Local Codes: Building codes, fire codes, environmental regulations
- Industry Standards: All applicable NFPA, IEEE, ASHRAE, ANSI standards
- Licensing Requirements: What certifications/licenses are required
- Permit Requirements: Any permits needed for maintenance work
- Inspection Requirements: Post-maintenance inspection requirements

6. Risk Assessment (COMPREHENSIVE):
- Equipment-Specific Failure Modes: Research how the equipment typically fails
- Impact Analysis: What happens if maintenance goes wrong
- Business Impact: Effect on data center operations
- Safety Risks: All potential risks to personnel
- Mitigation Strategies: How to prevent and respond to problems

DATA CENTER MOP RISK & CET LEVEL FRAMEWORK

MOP RISK LEVEL ASSESSMENT CRITERIA
GUIDING PRINCIPLE: The final risk level is determined by the single highest-risk criterion the MOP meets. Evaluate from Level 4 down to Level 1.

Level 4 - Critical Risk: Guaranteed, widespread service outage. Affects the entire facility, a major data hall, or a core platform
Level 3 - High Risk: Service impact is expected or highly likely. Affects a Single Point of Failure (SPOF)
Level 2 - Medium Risk: Service impact is possible but not expected. Affects a redundant component
Level 1 - Low Risk: No service impact is possible. Affects a single, non-critical system

CET SKILL LEVEL DEFINITIONS
Level 4 - Chief Engineer: Strategic Oversight & Final Approval
Level 3 - Lead Technician: Leads Complex & High-Risk Work
Level 2 - Technician: Independent Standard Work
Level 1 - Junior Technician: Supervised, Routine Tasks

COMBINED DECISION MATRIX
MOP Risk Level 4 → CET 3 (Execute), CET 4 (Supervise), CET 4 (Approve)
MOP Risk Level 3 → CET 2 (Execute), CET 3 (Supervise), CET 3 (Approve)
MOP Risk Level 2 → CET 2 (Execute), N/A (Supervise), CET 3 (Approve)
MOP Risk Level 1 → CET 1 (Execute), CET 2 (Supervise), CET 2 (Approve)

EXACT TEMPLATE STRUCTURE - NO DEVIATIONS

# **Method of Procedure (MOP)**

## **Section 01: MOP Schedule Information**

| Field | Value |
| :--- | :--- |
| **MOP Title:** | [MANUFACTURER] [EQUIPMENT TYPE] - [FREQUENCY] PREVENTIVE MAINTENANCE (**NEVER INCLUDE MODEL NUMBER**) |
| **MOP Information:** | [Frequency] preventive maintenance procedure for [manufacturer] [equipment type] (**NEVER INCLUDE MODEL NUMBER**) |
| **MOP Creation Date:** | [Current date] |
| **MOP Revision Date:** | <span style="color:red">**UPDATE NEEDED - Update upon revision**</span> |
| **Document Number:** | <span style="color:red">**UPDATE NEEDED - Assign per facility process**</span> |
| **Revision Number:** | <span style="color:red">**UPDATE NEEDED - Assign per facility process**</span> |
| **Author CET Level:** | <span style="color:red">**UPDATE NEEDED - Assign per facility process**</span> |

-----

## **Section 02: Site Information**

| Field | Value |
| :--- | :--- |
| **Data Center Location:** | <span style="color:red">**UPDATE NEEDED - Enter facility name and location**</span> |
| **Service Ticket/Project Number:** | <span style="color:red">**UPDATE NEEDED - Assign per facility process**</span> |
| **Level of Risk:** | [Risk Level from assessment] - [Brief 1-sentence rationale for why this risk level applies] |
| **CET Level Required:** | [CET Level from matrix] - [Brief 1-sentence rationale for why this level is required] |

-----

## **Section 03: MOP Overview**

| Field | Value |
| :--- | :--- |
| **MOP Description:** | [Detailed work description based on equipment and maintenance type] |
| **Work Area:** | [Location provided by user] |
| **Manufacturer:** | [Use exact manufacturer provided] |
| **Equipment ID:** | <span style="color:red">**UPDATE NEEDED - Record on-site**</span> |
| **Model #:** | [Use exact model provided] |
| **Serial #:** | <span style="color:red">**UPDATE NEEDED - Record from nameplate**</span> |
| **Min. # of Facilities Personnel:** | [Number based on equipment type] |
| **# of Contractors #1** | N/A |
| **# Contractors #2** | N/A |
| **Personnel from other departments** | N/A |
| **Qualifications Required:** | [Specific certifications and training based on equipment type] |
| **Tools Required:** | [Comprehensive tool list based on equipment type - research equipment-specific tools and materials] |
| **Advance notifications required:** | [Who must be notified before work] |
| **Post notifications required:** | [Who must be notified after work] |

-----

## **Section 04: Effect of MOP on Critical Facility**

| Facility Equipment or System | Yes | No | N/A | Details |
| :--- | :---: | :---: | :---: | :--- |
| Electrical Utility Equipment | [Based on equipment type] | [Based on equipment type] | | [Impact details if applicable] |
| Emergency Generator System | [Based on equipment type] | [Based on equipment type] | | [Impact details if applicable] |
| Critical Cooling System | [Based on equipment type] | [Based on equipment type] | | [Impact details if applicable] |
| Ventilation System | [Based on equipment type] | [Based on equipment type] | | [Impact details if applicable] |
| Mechanical System | [Based on equipment type] | [Based on equipment type] | | [Impact details if applicable] |
| Uninterruptible Power Supply (UPS) | [Based on equipment type] | [Based on equipment type] | | [Impact details if applicable] |
| Critical Power Distribution System | [Based on equipment type] | [Based on equipment type] | | [Impact details if applicable] |
| Emergency Power Off (EPO) | [Based on equipment type] | [Based on equipment type] | | [Impact details if applicable] |
| Fire Detection Systems | [Based on equipment type] | [Based on equipment type] | | [Impact details if applicable] |
| Fire Suppression System | [Based on equipment type] | [Based on equipment type] | | [Impact details if applicable] |
| Disable Fire System | [Based on equipment type] | [Based on equipment type] | | [Impact details if applicable] |
| Monitoring System | ✅ | | | [BMS/monitoring impact - ALWAYS affected for data center equipment] |
| Control System | [Based on equipment type] | [Based on equipment type] | | [Impact details if applicable] |
| Security System | | ✅ | | |
| General Power and Lighting System | [Based on equipment type] | [Based on equipment type] | | [Impact details if applicable] |
| Lockout/Tagout Required? | [Based on equipment type] | [Based on equipment type] | | [LOTO requirements if applicable] |
| Work to be performed "hot" (live electrical equipment)? | [Based on work scope] | [Based on work scope] | | [Details if hot work required] |
| Radio interference potential? | [Based on equipment type] | [Based on equipment type] | | [Details if applicable] |

-----

## **Section 05: MOP Supporting Documentation**

**MOP Supporting Documentation**
- [Manufacturer model-specific operation/maintenance manual with exact title]
- OSHA 29 CFR 1910.147 - The Control of Hazardous Energy (Lockout/Tagout)
- OSHA 29 CFR 1910 Subpart I - Personal Protective Equipment  
- [Equipment-specific NFPA standards]
- [Equipment-specific ASHRAE standards]
- [Safety Data Sheets (SDS) for ALL chemicals used - list each specific chemical with manufacturer]
- [Additional regulatory references based on equipment type]

-----

## **Section 06: Safety Requirements**

**Pre Work Conditions / Safety Requirements**

### **KEY HAZARDS IDENTIFIED**

| Hazard Type | Specific Hazards | Safety Controls Required |
| :--- | :--- | :--- |
| **Chemical Hazards** | [Chemical names]: [Key hazards from SDS - eye irritation, skin contact, etc.] | Review SDS before work, [Basic PPE and handling requirements] |
| **Electrical Hazards** | [Voltage level] electrical shock, arc flash potential | LOTO required, qualified person, test equipment |
| **Mechanical Hazards** | [Specific mechanical hazards - rotating parts, pinch points, sharp edges] | [Specific safety controls] |
| **Pressure Hazards** | [If applicable - refrigerant pressure, compressed air, etc.] | [Pressure-specific safety requirements] |

### **REQUIRED PERSONAL PROTECTIVE EQUIPMENT (PPE)**

| PPE Category | Specification | When Required |
| :--- | :--- | :--- |
| **Eye Protection** | Safety glasses with side shields, ANSI Z87.1 | At all times during maintenance work |
| **Eye Protection (Chemical)** | Chemical safety goggles | When mixing or applying [specific chemicals] |
| **Hand Protection** | [Material] gloves, [thickness if critical] | When handling [specific materials/chemicals] |
| **Foot Protection** | Steel-toe safety boots, slip-resistant | Always required in maintenance areas |
| **Respiratory Protection** | [Type if required, or "Not required with adequate ventilation"] | [Specific conditions if required] |
| **Additional PPE** | [Any additional PPE based on specific hazards] | [When required] |

### **SAFETY PROCEDURES**

| Procedure | Requirements |
| :--- | :--- |
| **Pre-Work Safety Briefing** | Conduct safety briefing with all personnel, document attendees, review all hazards and emergency procedures |
| **PPE Inspection** | Inspect and verify all required PPE is available, properly sized, and in good condition before work begins |
| **Lockout/Tagout (LOTO)** | De-energize at [specific disconnect], apply personal lock, verify zero energy with calibrated meter |
| **Chemical Handling** | [Key handling requirements from SDS - ventilation, avoid contact, etc.] |
| **Emergency Preparedness** | Verify emergency equipment is readily accessible (eyewash, shower, fire extinguisher) |

### **EMERGENCY CONTACTS**

| Emergency Type | Contact | Phone Number |
| :--- | :--- | :--- |
| Medical Emergency | Emergency Medical Services | 911 |
| Chemical Emergency | Poison Control / CHEMTREC | 1-800-222-1222 / 1-800-424-9300 |
| Facility Emergency | [Facility Emergency Line] | [UPDATE NEEDED - Add facility number] |

**CRITICAL: Work shall NOT proceed until safety briefing is completed and all required PPE is verified available.**

-----

## **Section 07: MOP Risks & Assumptions**

**MOP Risks and Assumptions**
- [Detailed risk assessment for the specific equipment and work]
- [Chemical-specific risks based on SDS research]
- [Realistic assumptions based on typical data center operations]
- [Mitigation strategies for identified risks]

-----

## **Section 08: MOP Details**

| Field | Value | Field | Value |
| :--- | :--- | :--- | :--- |
| **Date Performed:** | | **Time Begun:** | **Time Completed:** |
| **Facilities personnel performing work:** | | | |
| **Contractor/Vendor personnel performing work:** | | | |

| Step | Detailed Procedure | Initials | Time |
| :---: | :--- | :---: | :---: |
| 1 | Notify client Point(s) of Contact (POC) that the procedure is about to begin, what the procedure consists of, and the corresponding approved MOP title. Have all required signatures before procedure starts. | | |
| **2.0** | **Pre-Maintenance Safety and Documentation** | | |
| 2.1 | **MANDATORY:** Review all Safety Data Sheets (SDS) for chemicals and materials to be used: [List specific chemicals with SDS references]. | | |
| 2.2 | **MANDATORY:** Conduct pre-work safety briefing with all personnel. Document attendees. Review chemical hazards and equipment-specific safety requirements. | | |
| 2.3 | **MANDATORY:** Verify all required PPE is available and in good condition. Check chemical compatibility of gloves and respiratory equipment. | | |
| 2.4 | **MANDATORY:** Ensure adequate ventilation as required by chemical SDS. [Specify ventilation requirements from SDS research]. | | |
| 2.5 | Record initial equipment readings: [Manufacturer-specific parameters to be recorded] | | |
| **3.0** | **System Isolation and Lockout/Tagout (CRITICAL SAFETY)** | | |
| 3.1 | **SAFETY-CRITICAL:** Identify the correct electrical disconnect serving the equipment. Verify equipment nameplate matches work order. | | |
| 3.2 | **SAFETY-CRITICAL:** Place equipment in OFF/STOP mode using local controls or BMS. | | |
| 3.3 | **SAFETY-CRITICAL:** De-energize at electrical disconnect. Apply personal LOTO device per OSHA 29 CFR 1910.147. | | |
| 3.4 | **SAFETY-CRITICAL:** Using calibrated multimeter, verify ZERO ENERGY STATE at equipment terminals. Test phase-to-phase and phase-to-ground. DOCUMENT READINGS. | | |
| 3.5 | **SAFETY-CRITICAL:** Test multimeter on known energized source to verify meter functionality. | | |
| **4.0** | **[Equipment-Specific Maintenance Tasks - Research Required]** | | |
| 4.1 | [Detailed manufacturer-specific maintenance steps based on research] | | |
| 4.2 | **CHEMICAL SAFETY:** When using [specific chemical], ensure: [specific safety requirements from SDS]. Apply chemical per manufacturer instructions. | | |
| 4.3 | **VERIFICATION:** [Specific measurements and acceptance criteria] | | |
| [Continue] | [All remaining equipment-specific detailed steps with manufacturer specifications] | | |
| **X.0** | **System Restoration and Verification (CRITICAL)** | | |
| X.1 | **SAFETY-CRITICAL:** Ensure all personnel and tools are clear of equipment. Properly dispose of used chemicals per SDS requirements. | | |
| X.2 | **SAFETY-CRITICAL:** Remove LOTO device (only person who applied it). | | |
| X.3 | **VERIFICATION:** Perform manufacturer-specified startup sequence. | | |
| X.4 | **VERIFICATION:** Record all operational parameters and compare to manufacturer specifications: [List specific parameters] | | |
| X.5 | **VERIFICATION:** Monitor equipment for [specific time period] to ensure stable operation. | | |

-----

## **Section 09: Back-out Procedures**

| Step | Back-out Procedures | Initials | Time |
| :---: | :--- | :---: | :---: |
| 1 | **EQUIPMENT-SPECIFIC BACKOUT:** [Research and provide specific steps to safely return this equipment to its pre-maintenance state] | | |
| 2 | **IMMEDIATE ACTIONS:** [Specific immediate actions for this equipment type if problems occur] | | |
| 3 | **CHEMICAL SAFETY:** Secure all chemicals per SDS requirements. Ensure proper ventilation. | | |
| 4 | **SYSTEM RESTORATION:** [Specific steps to restore the equipment to operational status] | | |
| 5 | **NOTIFICATION REQUIREMENTS:** [Who to notify and escalation procedures for this equipment] | | |
| 6 | **CRITICAL LOAD PROTECTION:** [Specific actions to protect critical load if this equipment fails] | | |

-----

## **Section 010: MOP Approval**

| Review Stage | Reviewers Name | Reviewers Title | Date |
| :--- | :--- | :--- | :--- |
| **Tested for clarity:** | | | |
| **Technical review:** | | | |
| **Chief Engineer approval** | | | |
| **Contractor Review (if applicable)** | | | |
| **Customer approval** | | | |

-----

## **Section 011: MOP Comments**

**MOP Comments**
- [Relevant comments specific to the equipment and procedure]
- [Do not fabricate - only include applicable observations]

MANDATORY FORMATTING RULES

CRITICAL: Follow these formatting rules EXACTLY - NO EXCEPTIONS:
- Document Header: Always start with # **Method of Procedure (MOP)**
- Section Headers: Always use ## **Section [Number]: [Title]**
- Table Headers: Always use | Field | Value | or appropriate column headers
- Table Alignment: Always use | :--- | :--- | for left alignment, | :---: | for center
- Separators: Always use ----- between sections (exactly 5 dashes)
- Bold Text: Always use **Text** for field names and important items
- Spacing: Always include one blank line before and after tables
- Checkmarks: Use checkmark symbol for Yes, leave blank for No, use X if explicitly marked No
- Step Numbers: Use | :---: | for step column alignment in procedures
- Consistency: Every table must be properly formatted with aligned columns
- CLEAN FIELDS: Use researched information OR red update markers - no generic placeholders
- RED TEXT: Use <span style="color:red">**UPDATE NEEDED - [instruction]**</span> for fields requiring updates`;

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request) {
  try {
    const body = await request.json();
    const { formData } = body;
    const { manufacturer, modelNumber, serialNumber, location, system, category, description } = formData;
    
    console.log('MOP generation started for:', manufacturer, modelNumber);
    
    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    const safeManufacturer = manufacturer.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
    const safeSystem = system.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
    const safeCategory = category.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
    const filename = `MOP_${safeManufacturer}_${safeSystem}_${safeCategory}_${date}_${timestamp}.txt`;

    // Create prompt
    const userPrompt = `Create a comprehensive MOP based on this information:
    
Equipment Details:
- Manufacturer: ${manufacturer}
- Model Number: ${modelNumber}
- Serial Number: ${serialNumber || 'UPDATE NEEDED'}
- Location: ${location || 'UPDATE NEEDED'}
- System: ${system}
- Category: ${category}
- Work Description: ${description}

Generate a complete 11-section MOP following the exact format provided in the instructions.`;

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use the lighter model that's less likely to be overloaded
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash-8b',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8000,
      }
    });
    
    // Try to generate with retries
    let mopContent;
    let lastError;
    const maxAttempts = 5;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt} of ${maxAttempts}...`);
        
        const result = await model.generateContent(`${PROJECT_INSTRUCTIONS}\n\n${userPrompt}`);
        const response = await result.response;
        mopContent = response.text();
        
        if (!mopContent || mopContent.length < 100) {
          throw new Error('Generated content is too short');
        }
        
        console.log('Successfully generated MOP, length:', mopContent.length);
        break; // Success! Exit the loop
        
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);
        
        // If it's a rate limit or overload error, wait and retry
        if (error.message?.includes('503') || 
            error.message?.includes('overloaded') || 
            error.message?.includes('429') ||
            error.message?.includes('Resource has been exhausted')) {
          
          if (attempt < maxAttempts) {
            // Exponential backoff: 3s, 6s, 9s, 12s
            const waitTime = attempt * 3000;
            console.log(`Waiting ${waitTime}ms before retry...`);
            await wait(waitTime);
            continue;
          }
        }
        
        // For other errors, don't retry
        break;
      }
    }
    
    if (!mopContent) {
      const errorMessage = lastError?.message || 'Failed to generate after all attempts';
      
      // Better error messages for users
      if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
        return NextResponse.json({ 
          error: 'AI service is temporarily busy',
          details: 'The AI service is experiencing high demand. Please wait 2-3 minutes and try again.',
          userMessage: 'The AI is busy right now. Please try again in a few minutes.'
        }, { status: 503 });
      }
      
      if (errorMessage.includes('429') || errorMessage.includes('exhausted')) {
        return NextResponse.json({ 
          error: 'Rate limit reached',
          details: 'You\'ve made too many requests. Please wait a minute before trying again.',
          userMessage: 'Please wait 60 seconds before generating another MOP.'
        }, { status: 429 });
      }
      
      throw lastError || new Error(errorMessage);
    }

    // Add a small delay before saving to prevent race conditions
    await wait(500);

    // Save to blob with retry
    let blob;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        blob = await put(`mops/${filename}`, mopContent, {
          access: 'public',
          contentType: 'text/plain'
        });
        console.log('Successfully saved to blob storage');
        break;
      } catch (blobError) {
        console.error(`Blob storage attempt ${attempt} failed:`, blobError.message);
        if (attempt === 3) {
          // Return the content even if storage fails
          return NextResponse.json({ 
            success: false,
            error: 'Generated but could not save',
            generatedContent: mopContent,
            filename: filename,
            userMessage: 'MOP was generated but could not be saved. Copy the content manually.'
          }, { status: 200 });
        }
        await wait(1000);
      }
    }

    return NextResponse.json({ 
      success: true,
      filename: filename,
      url: blob.url,
      message: 'MOP generated successfully'
    });

  } catch (error) {
    console.error('MOP generation error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to generate MOP',
      details: error.message,
      userMessage: 'Unable to generate MOP. Please check your inputs and try again.'
    }, { status: 500 });
  }
}