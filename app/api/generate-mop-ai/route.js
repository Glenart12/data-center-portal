import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const PROJECT_INSTRUCTIONS = `You are creating Methods of Procedure (MOPs) for data center technicians. Generate COMPLETE, DETAILED MOPs - no placeholders or research notes.

CRITICAL FORMATTING RULES:
1. Use PLAIN TEXT ONLY - no special characters, no unicode symbols
2. For checkmarks in tables, use "Yes" or "X" (not ✅ or checkmarks)
3. NEVER include model numbers in the MOP Title
4. Generate COMPLETE procedures - no "research needed" placeholders
5. Always determine Risk Level and CET Level based on the work

RISK LEVEL DETERMINATION:
- Level 4 (Critical Risk): Affects entire facility, guaranteed outage
- Level 3 (High Risk): Single point of failure, service impact likely
- Level 2 (Medium Risk): Redundant component, impact possible but not expected  
- Level 1 (Low Risk): Non-critical system, no service impact possible

CET LEVEL MAPPING:
- Risk Level 4 → CET 3 (Lead Technician) to execute, CET 4 (Chief Engineer) to approve
- Risk Level 3 → CET 2 (Technician) to execute, CET 3 (Lead Technician) to approve
- Risk Level 2 → CET 2 (Technician) to execute, CET 3 (Lead Technician) to approve
- Risk Level 1 → CET 1 (Junior Technician) to execute, CET 2 (Technician) to approve

EXACT 11-SECTION FORMAT:

# **Method of Procedure (MOP)**

## **Section 01: MOP Schedule Information**

| Field | Value |
| :--- | :--- |
| **MOP Title:** | [MANUFACTURER] [EQUIPMENT TYPE] - [FREQUENCY] PREVENTIVE MAINTENANCE |
| **MOP Information:** | [Frequency] preventive maintenance procedure for [manufacturer] [equipment type] |
| **MOP Creation Date:** | [Current date MM/DD/YYYY] |
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
| **Level of Risk:** | Level [1-4] ([Risk Name]) - [One sentence explaining why this risk level applies] |
| **CET Level Required:** | CET [1-4] ([Title]) - [One sentence explaining why this CET level is required] |

-----

## **Section 03: MOP Overview**

| Field | Value |
| :--- | :--- |
| **MOP Description:** | [Detailed description of the work to be performed] |
| **Work Area:** | [Location from user or UPDATE NEEDED] |
| **Manufacturer:** | [Manufacturer name] |
| **Equipment ID:** | <span style="color:red">**UPDATE NEEDED - Record on-site**</span> |
| **Model #:** | [Model number] |
| **Serial #:** | [Serial from user or <span style="color:red">**UPDATE NEEDED - Record from nameplate**</span>] |
| **Min. # of Facilities Personnel:** | [Number based on equipment complexity] |
| **# of Contractors #1** | N/A |
| **# Contractors #2** | N/A |
| **Personnel from other departments** | N/A |
| **Qualifications Required:** | [List specific certifications and training] |
| **Tools Required:** | [Comprehensive list of tools and equipment] |
| **Advance notifications required:** | [List who needs to be notified before work] |
| **Post notifications required:** | [List who needs to be notified after work] |

-----

## **Section 04: Effect of MOP on Critical Facility**

| Facility Equipment or System | Yes | No | N/A | Details |
| :--- | :---: | :---: | :---: | :--- |
| Electrical Utility Equipment | [Yes/blank] | [X/blank] | [blank] | [Impact details if Yes] |
| Emergency Generator System | [Yes/blank] | [X/blank] | [blank] | [Impact details if Yes] |
| Critical Cooling System | [Yes/blank] | [X/blank] | [blank] | [Impact details if Yes] |
| Ventilation System | [Yes/blank] | [X/blank] | [blank] | [Impact details if Yes] |
| Mechanical System | [Yes/blank] | [X/blank] | [blank] | [Impact details if Yes] |
| Uninterruptible Power Supply (UPS) | [Yes/blank] | [X/blank] | [blank] | [Impact details if Yes] |
| Critical Power Distribution System | [Yes/blank] | [X/blank] | [blank] | [Impact details if Yes] |
| Emergency Power Off (EPO) | [Yes/blank] | [X/blank] | [blank] | [Impact details if Yes] |
| Fire Detection Systems | [Yes/blank] | [X/blank] | [blank] | [Impact details if Yes] |
| Fire Suppression System | [Yes/blank] | [X/blank] | [blank] | [Impact details if Yes] |
| Disable Fire System | [Yes/blank] | [X/blank] | [blank] | [Impact details if Yes] |
| Monitoring System | Yes | | | BMS monitoring will be affected |
| Control System | [Yes/blank] | [X/blank] | [blank] | [Impact details if Yes] |
| Security System | | X | | |
| General Power and Lighting System | [Yes/blank] | [X/blank] | [blank] | [Impact details if Yes] |
| Lockout/Tagout Required? | [Yes/blank] | [X/blank] | [blank] | [LOTO details if Yes] |
| Work to be performed "hot" (live electrical equipment)? | [Yes/blank] | [X/blank] | [blank] | [Details if Yes] |
| Radio interference potential? | [Yes/blank] | [X/blank] | [blank] | [Details if Yes] |

-----

## **Section 05: MOP Supporting Documentation**

**MOP Supporting Documentation**
- [Manufacturer] [Model] Operation and Maintenance Manual
- OSHA 29 CFR 1910.147 - The Control of Hazardous Energy (Lockout/Tagout)
- OSHA 29 CFR 1910 Subpart I - Personal Protective Equipment
- [List applicable NFPA standards based on equipment]
- [List applicable industry standards]
- [List specific SDS documents for chemicals used]

-----

## **Section 06: Safety Requirements**

**Pre Work Conditions / Safety Requirements**

### **KEY HAZARDS IDENTIFIED**

| Hazard Type | Specific Hazards | Safety Controls Required |
| :--- | :--- | :--- |
| **Chemical Hazards** | [List specific chemicals and hazards] | [List specific controls and PPE] |
| **Electrical Hazards** | [Voltage levels, shock/arc flash risks] | LOTO required, qualified person, proper PPE |
| **Mechanical Hazards** | [Moving parts, pinch points, etc.] | [Specific controls] |
| **Pressure Hazards** | [If applicable] | [Specific controls] |

### **REQUIRED PERSONAL PROTECTIVE EQUIPMENT (PPE)**

| PPE Category | Specification | When Required |
| :--- | :--- | :--- |
| **Eye Protection** | Safety glasses with side shields, ANSI Z87.1 | At all times during maintenance |
| **Eye Protection (Chemical)** | Chemical safety goggles | When handling chemicals |
| **Hand Protection** | [Specify glove type and material] | [When required] |
| **Foot Protection** | Steel-toe safety boots, slip-resistant | Always in maintenance areas |
| **Respiratory Protection** | [Type or "Not required with adequate ventilation"] | [When required] |
| **Additional PPE** | [As needed] | [When required] |

### **SAFETY PROCEDURES**

| Procedure | Requirements |
| :--- | :--- |
| **Pre-Work Safety Briefing** | Conduct safety briefing with all personnel, document attendees, review all hazards |
| **PPE Inspection** | Verify all required PPE is available and in good condition |
| **Lockout/Tagout (LOTO)** | De-energize at [location], apply personal locks, verify zero energy |
| **Chemical Handling** | [Specific handling requirements] |
| **Emergency Preparedness** | Verify emergency equipment locations |

### **EMERGENCY CONTACTS**

| Emergency Type | Contact | Phone Number |
| :--- | :--- | :--- |
| Medical Emergency | Emergency Medical Services | 911 |
| Chemical Emergency | Poison Control / CHEMTREC | 1-800-222-1222 / 1-800-424-9300 |
| Facility Emergency | [Facility Emergency Line] | <span style="color:red">**UPDATE NEEDED - Add facility number**</span> |

**CRITICAL: Work shall NOT proceed until safety briefing is completed and all required PPE is verified available.**

-----

## **Section 07: MOP Risks & Assumptions**

**MOP Risks and Assumptions**
- [List specific risks for this equipment and work]
- [List assumptions about facility conditions]
- [List mitigation strategies for each risk]

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
| 2.1 | **MANDATORY:** Review all Safety Data Sheets (SDS) for chemicals and materials to be used. | | |
| 2.2 | **MANDATORY:** Conduct pre-work safety briefing with all personnel. Document attendees. Review all hazards and emergency procedures. | | |
| 2.3 | **MANDATORY:** Verify all required PPE is available and in good condition. | | |
| 2.4 | **MANDATORY:** Ensure adequate ventilation in work area. | | |
| 2.5 | Record initial equipment readings and status. | | |
| **3.0** | **System Isolation and Lockout/Tagout (CRITICAL SAFETY)** | | |
| 3.1 | **SAFETY-CRITICAL:** Identify the correct electrical disconnect. Verify equipment nameplate matches work order. | | |
| 3.2 | **SAFETY-CRITICAL:** Place equipment in OFF/STOP mode using local controls. | | |
| 3.3 | **SAFETY-CRITICAL:** De-energize at electrical disconnect. Apply personal LOTO device per OSHA 29 CFR 1910.147. | | |
| 3.4 | **SAFETY-CRITICAL:** Using calibrated multimeter, verify ZERO ENERGY STATE. Test all phases. DOCUMENT READINGS. | | |
| 3.5 | **SAFETY-CRITICAL:** Test multimeter on known energized source to verify functionality. | | |
| **4.0** | **[Equipment-Specific Maintenance Tasks]** | | |
| 4.1 | [Generate detailed maintenance steps based on equipment type] | | |
| 4.2 | [Continue with specific procedures] | | |
| [etc.] | [Continue with all maintenance steps] | | |
| **X.0** | **System Restoration and Verification** | | |
| X.1 | **SAFETY-CRITICAL:** Ensure all personnel and tools are clear of equipment. | | |
| X.2 | **SAFETY-CRITICAL:** Remove LOTO devices (only by person who applied them). | | |
| X.3 | **VERIFICATION:** Perform startup sequence. | | |
| X.4 | **VERIFICATION:** Record operational parameters and verify normal operation. | | |
| X.5 | **VERIFICATION:** Monitor equipment for proper operation. | | |

-----

## **Section 09: Back-out Procedures**

| Step | Back-out Procedures | Initials | Time |
| :---: | :--- | :---: | :---: |
| 1 | **IMMEDIATE ACTIONS:** If any issue occurs, immediately stop work and secure the equipment in a safe state. | | |
| 2 | **EQUIPMENT SAFETY:** Ensure all energy sources remain isolated and locked out. | | |
| 3 | **ASSESSMENT:** Evaluate the nature and severity of the issue. | | |
| 4 | **NOTIFICATION:** Immediately notify facility management and affected departments. | | |
| 5 | **SYSTEM RESTORATION:** If safe to do so, follow emergency restoration procedures to return equipment to operational status. | | |
| 6 | **DOCUMENTATION:** Document all issues encountered and actions taken. | | |

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
- [Add relevant comments about the procedure]
- [Note any special considerations]

CRITICAL REQUIREMENTS FOR GENERATION:
1. NEVER put model numbers in the MOP Title - only manufacturer and equipment type
2. ALWAYS determine the risk level based on the work and provide a rationale
3. ALWAYS determine the CET level based on the risk level and provide a rationale
4. Use "Yes" or "X" in tables, never use special characters or symbols
5. Generate COMPLETE procedures in Section 08 - minimum 20-30 detailed steps
6. Generate COMPLETE back-out procedures in Section 09 - minimum 6 steps
7. Include specific chemical names and safety requirements based on equipment type
8. Format dates as MM/DD/YYYY`;

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

    // Create enhanced prompt
    const userPrompt = `Create a COMPLETE MOP based on this information:
    
Equipment Details:
- Manufacturer: ${manufacturer}
- Model Number: ${modelNumber} (DO NOT include this in the title)
- Serial Number: ${serialNumber || 'UPDATE NEEDED'}
- Location: ${location || 'UPDATE NEEDED'}
- System: ${system}
- Category: ${category}
- Work Description: ${description}

CRITICAL INSTRUCTIONS:
1. The MOP Title should be: "${manufacturer.toUpperCase()} ${system.toUpperCase()} - ${description.includes('annual') ? 'ANNUAL' : description.includes('quarterly') ? 'QUARTERLY' : description.includes('monthly') ? 'MONTHLY' : ''} PREVENTIVE MAINTENANCE"
2. Determine the risk level (1-4) based on whether this is critical equipment and provide a one-sentence rationale
3. Determine the CET level based on the risk level and provide a one-sentence rationale
4. Generate COMPLETE detailed procedures in Section 08 (minimum 20-30 steps)
5. Generate COMPLETE back-out procedures in Section 09 (minimum 6 steps)
6. Use plain text only - no special characters or unicode
7. For the systems table in Section 04, use "Yes" or leave blank for Yes column, "X" or leave blank for No column

Generate a complete 11-section MOP following the EXACT format provided.`;

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