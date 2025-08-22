import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { enhancePromptWithSearchResults } from '@/lib/eop-generation/search-enhancement-adapter';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to calculate CET Level based on task complexity
function calculateCETLevel(manufacturer, model, task) {
  const taskStr = task || '';
  
  // High complexity operational procedures requiring CET 3
  if (taskStr === 'Emergency Shutdown Procedure' || 
      taskStr === 'Backup System Activation' || 
      taskStr === 'Load Transfer Procedure') {
    return '<strong>CET 3 (Lead Technician)</strong> - Critical procedure requiring advanced expertise';
  }
  
  // Medium complexity operational procedures requiring CET 2
  if (taskStr === 'System Changeover Procedure' || 
      taskStr === 'Alarm Response Procedure') {
    return '<strong>CET 2 (Technician)</strong> - Standard operational procedure requiring experience';
  }
  
  // Routine operational procedures requiring CET 1
  return '<strong>CET 1 (Junior Technician)</strong> - Routine operational procedure';
}

// Helper function to calculate Risk Level based on task criticality
function calculateRiskLevel(manufacturer, model, task) {
  const taskStr = task || '';
  
  // High risk operational procedures
  if (taskStr === 'Emergency Shutdown Procedure' || 
      taskStr === 'Backup System Activation' || 
      taskStr === 'Load Transfer Procedure') {
    return '<strong>Level 3</strong> (High) - Critical operational procedure affecting facility operations';
  }
  
  // Medium risk operational procedures
  if (taskStr === 'System Changeover Procedure' || 
      taskStr === 'Alarm Response Procedure') {
    return '<strong>Level 2</strong> (Medium) - Operational procedure with moderate impact';
  }
  
  // Low risk operational procedures
  return '<strong>Level 1</strong> (Low) - Routine operational procedure with minimal impact';
}

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>__SOP_TITLE__</title>
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
            color: #198754; 
            text-align: center; 
            margin-bottom: 40px; 
            font-size: 2.5em;
            border: none !important;  /* Remove all borders */
            text-decoration: none !important;
            padding-bottom: 20px;
        }
        h1, h2, h3 {
            text-decoration: none !important;
            border-bottom: none !important;
        }
        h2 { 
            color: #198754; 
            padding-bottom: 10px; 
            margin-top: 40px; 
            font-size: 1.8em;
        }
        h3 {
            color: #146c43;
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
            background-color: #198754; 
            color: white; 
            font-weight: bold;
        }
        tr:nth-child(even) { 
            background-color: #f9f9f9; 
        }
        .info-table td:first-child { 
            font-weight: bold; 
            background-color: #f0f0f0 !important; 
            width: 35%; 
        }
        .procedure-step {
            background-color: #f0f9f5;
            padding: 15px;
            border-left: 5px solid #20c997;
            margin: 15px 0;
        }
        .caution-box {
            background-color: #fff3cd;
            border: 2px solid #ffc107;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
        .warning-box {
            background-color: #fee;
            border: 2px solid #dc3545;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
            font-weight: bold;
        }
        .success-criteria {
            background-color: #d1f2eb;
            padding: 15px;
            border-left: 5px solid #198754;
            margin: 15px 0;
        }
        input[type="text"], input[type="date"], input[type="time"], textarea {
            border: 1px solid #999;
            padding: 5px;
            background-color: #fff;
            font-family: inherit;
            font-size: inherit;
            width: 90%;
        }
        input[type="checkbox"] {
            margin-right: 8px;
            transform: scale(1.2);
        }
        .checkbox {
            text-align: center;
            font-size: 1.2em;
        }
        .checkbox-item {
            margin: 10px 0;
            padding: 8px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }
        ul { 
            line-height: 1.8; 
            margin-left: 20px;
        }
        li {
            margin-bottom: 8px;
        }
        .update-needed {
            color: #dc3545;
            font-weight: bold;
            background-color: #ffe6e6;
            padding: 2px 6px;
            border-radius: 3px;
        }
        .section-separator {
            border-top: 2px solid #198754;
            margin: 40px 0;
            border-bottom: none;
            border-left: none;
            border-right: none;
        }
        .approval-signature {
            border: 1px solid #999;
            width: 200px;
            height: 40px;
            background-color: #fff;
            margin-top: 5px;
        }
        .completion-checklist {
            background-color: #e8f5e9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
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
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json({ 
        error: 'Configuration error',
        userMessage: 'AI service is not properly configured. Please check GEMINI_API_KEY.'
      }, { status: 500 });
    }
    
    const body = await request.json();
    const { formData } = body;
    
    // Validate required fields
    if (!formData?.manufacturer || !formData?.modelNumber || !formData?.system || 
        !formData?.componentType || !formData?.workDescription || !formData?.customer) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        userMessage: 'Please fill in all required fields'
      }, { status: 400 });
    }
    
    console.log('Starting SOP generation for:', formData.manufacturer, formData.modelNumber);
    
    // Determine LOR based on operational procedure type
    let riskLevel = 2;
    let riskJustification = "Standard operational procedure";
    
    const workDesc = formData.workDescription || '';
    const system = formData.system?.toLowerCase() || '';
    const componentType = formData.componentType?.toLowerCase() || '';
    
    // Risk levels for operational procedures (not maintenance)
    if (workDesc === 'Emergency Shutdown Procedure') {
      riskLevel = 3;
      riskJustification = "Emergency procedure affecting critical systems";
    } else if (workDesc === 'Backup System Activation') {
      riskLevel = 3;
      riskJustification = "Critical failover procedure requiring precise execution";
    } else if (workDesc === 'Load Transfer Procedure') {
      riskLevel = 3;
      riskJustification = "Power transfer operation affecting critical loads";
    } else if (workDesc === 'Alarm Response Procedure') {
      riskLevel = 2;
      riskJustification = "Response procedure requiring immediate action";
    } else if (workDesc === 'System Changeover Procedure') {
      riskLevel = 2;
      riskJustification = "System transition requiring coordinated steps";
    } else if (workDesc === 'Daily Startup Procedure' || workDesc === 'Daily Shutdown Procedure' ||
               workDesc === 'Weekly System Check' || workDesc === 'Equipment Monitoring Protocol' ||
               workDesc === 'Normal Operating Procedure') {
      riskLevel = 1;
      riskJustification = "Routine operational procedure with minimal risk";
    }
    
    // Additional risk factors based on equipment type
    if (system.includes('electrical') && componentType.includes('switchgear')) {
      riskLevel = Math.max(riskLevel, 3);
      riskJustification = "Critical electrical system operation";
    } else if (componentType.includes('ups') || componentType.includes('generator')) {
      riskLevel = Math.max(riskLevel, 2);
      riskJustification = "Critical power system operation";
    }
    
    // Auto-calculate duration based on operational procedure type
    let duration = "30 minutes";
    if (workDesc === 'Emergency Shutdown Procedure') {
      duration = "15-30 minutes";
    } else if (workDesc === 'Backup System Activation' || workDesc === 'Load Transfer Procedure') {
      duration = "30-60 minutes";
    } else if (workDesc === 'System Changeover Procedure') {
      duration = "45-90 minutes";
    } else if (workDesc === 'Daily Startup Procedure' || workDesc === 'Daily Shutdown Procedure') {
      duration = "15-30 minutes";
    } else if (workDesc === 'Weekly System Check') {
      duration = "30-45 minutes";
    } else if (workDesc === 'Equipment Monitoring Protocol' || workDesc === 'Normal Operating Procedure') {
      duration = "15-20 minutes";
    } else if (workDesc === 'Alarm Response Procedure') {
      duration = "10-20 minutes";
    }
    
    // Get current date for input fields
    const currentDate = new Date().toLocaleDateString('en-US');
    
    // Calculate CET Level and Risk Level using the helper functions
    const cetLevelHtml = calculateCETLevel(formData.manufacturer, formData.modelNumber, formData.workDescription);
    const riskLevelHtml = calculateRiskLevel(formData.manufacturer, formData.modelNumber, formData.workDescription);
    
    // Define SOP_INSTRUCTIONS template with formData now in scope
    const SOP_INSTRUCTIONS = `
You are an expert data center operations engineer creating a Standard Operating Procedure (SOP) document.
Generate a comprehensive, professional SOP document in HTML format with ALL 12 sections listed below.

CRITICAL: This is an OPERATIONAL PROCEDURE, not maintenance. Focus on:
- Step-by-step operational instructions for running/operating equipment
- Normal operating parameters and monitoring checkpoints
- Response procedures for alarms and abnormal conditions
- System startup, shutdown, changeover, and monitoring procedures
- Do NOT include maintenance tasks, repairs, or component replacements

IMPORTANT: You must generate EQUIPMENT-SPECIFIC procedures based on the exact manufacturer and model provided.
Do NOT generate generic procedures. All steps, safety requirements, and technical details must be specific to the equipment.

CRITICAL: You MUST include ALL 12 sections in order:
- Section 01: SOP Schedule Information
- Section 02: Site Information
- Section 03: SOP Overview
- Section 04: Effect of SOP on Critical Facility
- Section 05: SOP Supporting Documentation
- Section 06: Safety Requirements
- Section 07: SOP Risks & Assumptions
- Section 08: SOP Details
- Section 09: Back-out Procedures
- Section 10: SOP Approval
- Section 11: SOP Completion
- Section 12: Comments

SECTION-BY-SECTION REQUIREMENTS:

Section 01: SOP Schedule Information
MUST use table format with these exact rows in this order:
- SOP Title: ${formData.componentType} ${formData.workDescription}
- SOP Identifier: ${formData.sopIdentifier || '<input type="text" placeholder="Enter SOP identifier" style="border: 1px solid #999; padding: 2px; width: 200px;">'}
- Version: V1
- Creation Date: ${new Date().toLocaleDateString()}
- Work Description: ${formData.workDescription}
- Component Type: ${formData.componentType}
- Manufacturer: ${formData.manufacturer}
- Model Number: ${formData.modelNumber}
- Serial Number: ${formData.serialNumber || 'UPDATE NEEDED'}
- Equipment Number: ${formData.equipmentNumber}
- Location: ${formData.location || 'UPDATE NEEDED'}
- Duration: [IMPORTANT: AI must research and provide estimated duration based on ${formData.workDescription} maintenance level for this specific ${formData.manufacturer} ${formData.modelNumber} equipment]
- Level of Risk (LOR): USE PROVIDED VALUE from CALCULATED VALUES section (display the full HTML with strong tags)
- CET Level Required: USE PROVIDED "CET Level Required" from CALCULATED VALUES section (display the full HTML with strong tags)
- Author: <input type="text" placeholder="Enter author name" style="border: 1px solid #999; padding: 2px; width: 200px;">
- Author CET Level: <input type="text" placeholder="Enter CET level" style="border: 1px solid #999; padding: 2px; width: 100px;">
- Approver: <input type="text" placeholder="Enter approver name" style="border: 1px solid #999; padding: 2px; width: 200px;">

Section 02: Site Information
Format as table with these exact rows:
- Customer: ${formData.customer}
- Site Name: ${formData.siteName || 'UPDATE NEEDED'}
- Data Center Location: ${formData.location || 'UPDATE NEEDED'}
- Site Address: ${formData.address?.street || 'UPDATE NEEDED'}, ${formData.address?.city || 'UPDATE NEEDED'}, ${formData.address?.state || 'UPDATE NEEDED'} ${formData.address?.zipCode || 'UPDATE NEEDED'}
- Site Contact: <input type="text" placeholder="Name, Phone, Job Title/Role" style="border: 1px solid #999; padding: 2px; width: 400px;">

Section 03: SOP Overview
MUST format as table with these rows:
- SOP Title: ${formData.componentType} ${formData.workDescription}
- Work Area: <input type="text" placeholder="Enter work area" style="border: 1px solid #999; padding: 2px; width: 200px;">
- Building/Floor/Room: <input type="text" placeholder="Enter building/floor/room" style="border: 1px solid #999; padding: 2px; width: 200px;">
- Access Requirements: <input type="text" placeholder="Enter access requirements" style="border: 1px solid #999; padding: 2px; width: 300px;">
- Personnel Required: [IMPORTANT: AI must generate based on the specific ${formData.workDescription} for ${formData.manufacturer} ${formData.modelNumber} ${formData.serialNumber}. Consider the complexity of the operational procedure, equipment criticality, and safety requirements. List specific roles (e.g., Lead Technician, Support Technician, Safety Observer) with brief explanations]
- Work Performed By: <input type="checkbox"> Self-Delivered <input type="checkbox"> Subcontractor
- # of Contractors #1: <input type="text" placeholder="Enter number" style="border: 1px solid #999; padding: 2px; width: 80px;">
- If Subcontractor - Company Name #1: <input type="text" placeholder="Company name" style="border: 1px solid #999; padding: 2px; width: 200px;">
- If Subcontractor - Personnel Name #1: <input type="text" placeholder="Personnel name" style="border: 1px solid #999; padding: 2px; width: 200px;">
- If Subcontractor - Contact Details #1: <input type="text" placeholder="Contact details" style="border: 1px solid #999; padding: 2px; width: 200px;">
- # of Contractors #2: <input type="text" placeholder="Enter number" style="border: 1px solid #999; padding: 2px; width: 80px;">
- If Subcontractor - Company Name #2: <input type="text" placeholder="Company name" style="border: 1px solid #999; padding: 2px; width: 200px;">
- If Subcontractor - Personnel Name #2: <input type="text" placeholder="Personnel name" style="border: 1px solid #999; padding: 2px; width: 200px;">
- If Subcontractor - Contact Details #2: <input type="text" placeholder="Contact details" style="border: 1px solid #999; padding: 2px; width: 200px;">
- Qualifications Required: [IMPORTANT: AI must generate specific qualifications based on ${formData.workDescription} complexity for ${formData.manufacturer} ${formData.modelNumber} ${formData.serialNumber}. Include certifications, training requirements, experience levels, and equipment-specific qualifications]
- Advance notifications required: [AI must research and explain based on equipment type and ${formData.workDescription}]
- Post notifications required: [AI must research and explain based on equipment type and ${formData.workDescription}]

Section 04: Effect of SOP on Critical Facility
The AI must follow this four-step analysis process:
Step 1: Identify the ${formData.manufacturer} ${formData.modelNumber} equipment function and role in data center
Step 2: Analyze maintenance scope for ${formData.workDescription} (shutdown needs, isolation requirements, components serviced)
Step 3: Apply universal rules:
  - Monitoring System is ALWAYS YES
  - Annual/Semi-Annual maintenance requires Lockout/Tagout = YES
  - Equipment being maintained is always affected by its own maintenance
Step 4: Apply equipment-specific logic based on ${formData.componentType}

IMPORTANT: Place a checkmark (✓) in the appropriate column (Yes, No, or N/A) for each system based on your analysis.

Create table with EXACTLY these 21 systems and columns:
| Facility Equipment or System | Yes | No | N/A | Details |

For each row in the table:
- If a system is affected: Put ✓ in the Yes column
- If not affected: Put ✓ in the No column  
- If not applicable: Put ✓ in the N/A column

Example format for table rows:
<tr>
    <td>Monitoring System</td>
    <td class="checkbox">✓</td>  <!-- Yes -->
    <td class="checkbox"></td>   <!-- No -->
    <td class="checkbox"></td>   <!-- N/A -->
    <td>Monitoring System is ALWAYS affected for data center equipment maintenance</td>
</tr>

Include these 21 systems exactly:
1. Electrical Utility Equipment
2. Emergency Generator System
3. Critical Cooling System
4. Ventilation System
5. Mechanical System
6. Uninterruptible Power Supply (UPS)
7. Critical Power Distribution System
8. Emergency Power Off (EPO)
9. Fire Detection Systems
10. Fire Suppression System
11. Disable Fire System
12. Monitoring System - ALWAYS mark YES with note: "Monitoring System is ALWAYS affected for data center equipment maintenance"
13. Control System
14. Security System
15. General Power and Lighting System
16. Lockout/Tagout Required? (YES for Annual/Semi-Annual)
17. Work to be performed "hot"?
18. Radio interference potential?
19. Transfer Switch System
20. Building Automation System (BAS)
21. Water/Leak Detection System

Section 05: SOP Supporting Documentation
Based on LOR value calculated in Section 01:
- LOR 1 (Low): "Basic operating procedure reference guide"
- LOR 2 (Medium): Add "Equipment safety data sheets"
- LOR 3 (High): Add "Equipment O&M manuals, electrical diagrams"
- LOR 4 (Critical): Add "Complete documentation package including OEM manuals, as-builts, commissioning reports"

Section 06: Safety Requirements
<h3>REQUIRED PERSONAL PROTECTIVE EQUIPMENT (PPE)</h3>
<table>
  <tr>
    <th>PPE Category</th>
    <th>Specification</th>
    <th>When Required</th>
  </tr>
  <tr>
    <td>Safety Glasses</td>
    <td>ANSI Z87.1 compliant</td>
    <td>Always in mechanical rooms</td>
  </tr>
  <!-- Add equipment-specific PPE based on manufacturer and model -->
</table>

<h3>Required Tools & Test Equipment for [Manufacturer] [Model]:</h3>
<table>
  <tr>
    <th>Tool/Equipment</th>
    <th>Specific Model/Type for [Model Number]</th>
    <th>Available</th>
  </tr>
  <!-- Generate equipment-specific tools -->
</table>

<h3>EMERGENCY CONTACTS</h3>
<table>
  <tr>
    <th>Emergency Type</th>
    <th>Contact</th>
    <th>Phone Number</th>
  </tr>
  <tr>
    <td>Fire/Medical/Police</td>
    <td>Emergency Services</td>
    <td>911</td>
  </tr>
  <tr>
    <td>Site Operations Manager</td>
    <td><input type="text" placeholder="Name" style="border: 1px solid #999; padding: 2px;"></td>
    <td><input type="text" placeholder="Phone" style="border: 1px solid #999; padding: 2px;"></td>
  </tr>
</table>

<h3>Site-Specific Hazards</h3>
<table>
  <tr>
    <th>Hazard Type</th>
    <th>Description</th>
    <th>Control Measures</th>
  </tr>
  <!-- Generate equipment-specific hazards -->
</table>

Section 07: SOP Risks & Assumptions
<h3>Risk Analysis Matrix</h3>
<table>
  <tr>
    <th>Risk Category</th>
    <th>Description</th>
    <th>Likelihood</th>
    <th>Impact</th>
    <th>Mitigation Strategy</th>
  </tr>
  <!-- Generate risks based on equipment and task -->
</table>

<h3>Key Project Assumptions</h3>
<table>
  <tr>
    <th>Category</th>
    <th>Assumption</th>
  </tr>
  <tr>
    <td>Equipment Status</td>
    <td>[Manufacturer] [Model] is operational</td>
  </tr>
  <!-- Add more assumptions -->
</table>

<h3>Critical Decision Points</h3>
<!-- List critical decision points -->

Section 08: SOP Details
Convert ALL subsections to table format:
<h3>8.1 Pre-Procedure Checks</h3>
<table>
  <tr>
    <th>Step</th>
    <th>Description</th>
    <th>Expected Result</th>
    <th>Actual Result</th>
    <th>Action if Not Met</th>
  </tr>
  <!-- Convert numbered list to table rows -->
</table>

<h3>8.2 Detailed Procedure Steps</h3>
<table>
  <tr>
    <th>Step</th>
    <th>Description</th>
    <th>Expected Range</th>
    <th>Source</th>
    <th>Recorded Value</th>
    <th>Action if Out of Range</th>
  </tr>
  <!-- Equipment-specific readings with sources: PIC5+/BMS/Physical Gauge -->
</table>

Section 09: Back-out Procedures
RENAME from "Escalation/Communication" to "Back-out Procedures"
Move Section 8.3 Post-Procedure Verification content here as table:
<h2>Section 09: Back-out Procedures</h2>
<table>
  <tr>
    <th>Step</th>
    <th>Description</th>
    <th>Verification</th>
    <th>Action Required</th>
  </tr>
  <!-- Post-procedure verification steps -->
</table>

Section 10: SOP Approval
Create an approval matrix table with:
- Role (Operations Manager, Facility Manager, Safety Officer, Customer Representative)
- Name (input field)
- Signature (input field)
- Date (input field)

Section 11: SOP Completion
ONLY include:
- Technician Sign-off table with Name, Signature, Date, Time fields

Section 12: Comments
Include:
- Revision History table: Version | Date | Author | Changes
- General comments field (optional)

FORMATTING REQUIREMENTS:
- Use professional green color theme (#198754 for headers, #20c997 for accents)
- Include input fields for data entry during execution
- Add checkboxes for verification steps
- Use tables for structured information
- Include "UPDATE NEEDED" markers for missing information
- Make the document printer-friendly
- Use clear section numbering (Section 01, Section 02, etc.)
`;
    
    // Prepare the prompt for Gemini
    const prompt = `${SOP_INSTRUCTIONS}

Equipment Details:
- Manufacturer: ${formData.manufacturer}
- Model Number: ${formData.modelNumber}
- Serial Number: ${formData.serialNumber || 'UPDATE NEEDED'}
- Location: ${formData.location || 'UPDATE NEEDED'}
- System: ${formData.system}
- Component Type: ${formData.componentType}
- Procedure Type: ${formData.procedureType}
- Work Description: ${formData.workDescription}

Customer Information:
- Customer: ${formData.customer}

Site Information:
- Site Name: ${formData.siteName || 'UPDATE NEEDED'}

Site Address:
- Street: ${formData.address?.street || 'UPDATE NEEDED'}
- City: ${formData.address?.city || 'UPDATE NEEDED'}
- State: ${formData.address?.state || 'UPDATE NEEDED'}
- ZIP Code: ${formData.address?.zipCode || 'UPDATE NEEDED'}

CALCULATED VALUES:
- Level of Risk (LOR): ${riskLevel} - ${['Low', 'Medium', 'High', 'Critical'][riskLevel-1]}
- Risk Justification: ${riskJustification}
- Duration: ${duration}
- CET Level Required: ${cetLevelHtml}
- Risk Level Assessment: ${riskLevelHtml}

Current Date: ${currentDate}

Generate ONLY the content that goes inside the container div - no DOCTYPE, html, head, body, or container tags.
Do NOT generate any <h1> tags, titles, or <div class="sop-document"> wrapper.
Start DIRECTLY with <h2>Section 01: SOP Schedule Information</h2> and proceed with all 12 sections using H2 headers.

CRITICAL REQUIREMENTS:
1. Generate ALL 12 sections completely - do not stop early
2. Section 01 MUST use the EXACT calculated values provided:
   - Duration: ${duration}
   - Level of Risk (LOR): ${riskLevelHtml} (display as HTML with strong tags)
   - CET Level Required: ${cetLevelHtml} (display as HTML with strong tags)
3. Section 01 MUST have editable input fields for Author, Author CET Level, and Approver
4. Section 02 MUST show Customer: ${formData.customer} AND Site Address from location input
5. Section 03 MUST use the EXACT format specified with tables for Work Area, Equipment Info, Personnel (NO '# of Facilities Personnel' field)
6. Section 04 MUST include the EXACT 15-system table with Yes/No/N/A/Details columns
7. Section 05 MUST base documentation on LOR ${riskLevel}
8. Section 06 MUST include PPE table, Tools table, Emergency Contacts, and Site Hazards
9. Section 07 MUST include Risk Matrix, Assumptions, and Decision Points in table format
10. Section 08 MUST use tables for Pre-checks, Procedure Steps, with Source column
11. Section 09 MUST be titled "Back-out Procedures" with verification table
12. Section 11 MUST ONLY have Technician Sign-off (no other content)

Generate comprehensive, detailed content for ALL sections. Do NOT use placeholder text.`;

    // Search Enhancement
    let enhancedPrompt = prompt;
    if (process.env.SEARCH_ENABLED === 'true') {
      try {
        enhancedPrompt = await enhancePromptWithSearchResults(prompt, formData.modelNumber, formData.manufacturer);
        console.log('Search enhancement applied successfully');
      } catch (error) {
        console.log('Search enhancement skipped:', error.message);
        // Use original prompt if search fails
      }
    }

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 32000, // Increased for complete 12 sections
        candidateCount: 1
      }
    });
    
    console.log('Sending prompt to Gemini AI...');
    
    let result, response, generatedContent;
    try {
      result = await model.generateContent(enhancedPrompt);
      response = await result.response;
      generatedContent = response.text();
    } catch (aiError) {
      console.error('AI Generation Error:', aiError);
      
      // Try with simpler configuration on retry
      console.log('Retrying with simpler configuration...');
      try {
        const retryModel = genAI.getGenerativeModel({ 
          model: 'gemini-2.5-flash',
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 28000
          }
        });
        result = await retryModel.generateContent(enhancedPrompt);
        response = await result.response;
        generatedContent = response.text();
      } catch (retryError) {
        console.error('Retry also failed:', retryError.message);
        throw new Error(`AI generation failed: ${aiError.message}`);
      }
    }
    
    console.log('AI Response received, length:', generatedContent ? generatedContent.length : 0);
    
    // Check if all sections are present
    const sectionMatches = generatedContent.match(/Section \d+:/g) || [];
    console.log('Number of sections found:', sectionMatches.length);
    
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
    
    // Add title and green banner with component type and work description
    const bannerHtml = `
<h1 style="color: #198754; text-align: center; margin-bottom: 20px; font-size: 2.5em;">Standard Operating Procedure (SOP)</h1>
<hr style="border-top: 2px solid #198754; margin: 20px 0; border-bottom: none; border-left: none; border-right: none;">
<div style="background: #198754; color: white; padding: 30px; margin: 20px 0; border-radius: 5px; text-align: center;">
    <h2 style="font-size: 2.5em; margin: 0; color: white; border-bottom: none; text-decoration: none;">${formData.componentType} ${formData.workDescription}</h2>
</div>`;
    
    // Add banner at the beginning
    generatedContent = `${bannerHtml}\n${generatedContent}`;
    
    // Generate dynamic SOP title
    const sopTitle = `SOP - ${formData.manufacturer} ${formData.modelNumber} - ${formData.procedureType}`;
    
    // Build complete HTML with dynamic title
    const completeHtml = HTML_TEMPLATE
      .replace('__SOP_TITLE__', sopTitle)
      .replace('{{CONTENT}}', generatedContent);
    
    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    const safeManufacturer = formData.manufacturer.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
    const safeModel = formData.modelNumber.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
    const safeProcedure = formData.procedureType.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
    const filename = `SOP_${safeManufacturer}_${safeModel}_${safeProcedure}_${date}_${timestamp}.html`;

    // Save to blob storage
    const blob = await put(`sops/${filename}`, completeHtml, {
      access: 'public',
      contentType: 'text/html',
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    console.log('SOP generation complete:', filename);
    
    return NextResponse.json({ 
      success: true,
      filename: filename,
      url: blob.url,
      message: 'SOP generated successfully'
    });
    
  } catch (error) {
    console.error('SOP generation error:', error);
    
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
      error: 'Failed to generate SOP',
      details: error.message,
      userMessage: 'Unable to generate SOP. Please try again.'
    }, { status: 500 });
  }
}