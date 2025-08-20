import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { enhancePromptWithSearchResults } from '@/lib/eop-generation/search-enhancement-adapter';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SOP_INSTRUCTIONS = `
You are an expert data center operations engineer creating a Standard Operating Procedure (SOP) document.
Generate a comprehensive, professional SOP document in HTML format with ALL 12 sections listed below.

IMPORTANT: You must generate EQUIPMENT-SPECIFIC procedures based on the exact manufacturer and model provided.
Do NOT generate generic procedures. All steps, safety requirements, and technical details must be specific to the equipment.

HEADER FORMAT (At the very top of document):
- Title: Standard Operating Procedure (SOP)
- Use green color (#198754) for the SOP header

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
- SOP Identifier: Generate unique ID (e.g., SOP-[SYSTEM]-[DATE]-[NUMBER])
- Procedure Title: Clear, descriptive title including manufacturer and model
- Duration: AUTO-CALCULATE based on task complexity:
  * Daily checks: 30-45 minutes
  * Weekly maintenance: 1-2 hours
  * Monthly maintenance: 2-4 hours
  * Quarterly/Annual: 4-8 hours
- Level of Risk (LOR): Calculate using exact same logic as MOP generation:
  * Level 1 (Low): Routine non-intrusive checks
  * Level 2 (Medium): Standard maintenance with redundancy
  * Level 3 (High): Work on critical systems (UPS, generators, chillers)
  * Level 4 (Critical): Work on single points of failure or switchgear
- Author: <input type="text" placeholder="Enter Author Name" style="border: 1px solid #999; padding: 2px; width: 200px;">
- Date: ${new Date().toLocaleDateString('en-US')} (today's date)
- Version: <input type="text" value="1.0" style="border: 1px solid #999; padding: 2px; width: 80px;">
- CET Level Required to Perform Task: <input type="text" placeholder="CET Level" style="border: 1px solid #999; padding: 2px; width: 100px;">
- Author CET Level: <input type="text" placeholder="Author CET Level" style="border: 1px solid #999; padding: 2px; width: 100px;">
- Frequency: Based on the procedure type provided

Section 02: Site Information
- Customer: [Customer name from form]
- Site Name: [Site name or UPDATE NEEDED]
- Site Address: [Full site address or UPDATE NEEDED]
DO NOT include Customer Address

Section 03: SOP Overview
MUST format EXACTLY as:
<h2>Section 03: SOP Overview</h2>
<table class="info-table">
  <tr><td>Work Area:</td><td>[Work area or Data Hall 1]</td></tr>
  <tr><td>Affected Systems:</td><td>[Affected systems or Cooling System]</td></tr>
</table>
<h3>Equipment Information:</h3>
<table class="info-table">
  <tr><td>Manufacturer:</td><td>[Manufacturer from form]</td></tr>
  <tr><td>Model #:</td><td>[Model number from form]</td></tr>
  <tr><td>Serial #:</td><td>[Serial number or UPDATE NEEDED]</td></tr>
</table>
<h3>Personnel Required:</h3>
<table class="info-table">
  <tr><td># of Facilities Personnel:</td><td><input type="text" value="2" style="border: 1px solid #999; padding: 2px; width: 50px;"></td></tr>
  <tr><td># of Contractors #1:</td><td><input type="text" value="0" style="border: 1px solid #999; padding: 2px; width: 50px;"></td></tr>
  <tr><td># of Contractors #2:</td><td><input type="text" value="0" style="border: 1px solid #999; padding: 2px; width: 50px;"></td></tr>
  <tr><td># of Customers:</td><td><input type="text" value="0" style="border: 1px solid #999; padding: 2px; width: 50px;"></td></tr>
</table>

Section 04: Effect of SOP on Critical Facility
Create table with EXACTLY these 15 systems and columns:
| Facility Equipment or System | Yes | No | N/A | Details |
Include these 15 systems exactly:
1. Cooling System
2. Electrical System
3. UPS System
4. Generator System
5. Fire Protection
6. BMS/EPMS
7. Security System
8. Network Infrastructure
9. Water/Plumbing
10. Access Control
11. VESDA/Smoke Detection
12. Fuel System
13. Emergency Lighting
14. HVAC Controls
15. Communication Systems

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
            border-bottom: 3px solid #198754;
            padding-bottom: 20px;
        }
        h2 { 
            color: #198754; 
            border-bottom: 2px solid #20c997; 
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
            background-color: #e8f5e9; 
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
            border-top: 2px solid #ccc;
            margin: 40px 0;
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
        !formData?.category || !formData?.description || !formData?.procedureType || !formData?.customer) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        userMessage: 'Please fill in all required fields'
      }, { status: 400 });
    }
    
    console.log('Starting SOP generation for:', formData.manufacturer, formData.modelNumber);
    
    // Determine LOR based on same logic as MOP generation
    let riskLevel = 2;
    let riskJustification = "Single system affected with redundancy available";
    
    const workDescription = formData.description?.toLowerCase() || '';
    const system = formData.system?.toLowerCase() || '';
    const procedureType = formData.procedureType?.toLowerCase() || '';
    
    if (workDescription.includes('electrical') && system.includes('switchgear')) {
      riskLevel = 4;
      riskJustification = "Main switchgear work affects entire facility";
    } else if (system.includes('chiller') && (workDescription.includes('major') || procedureType.includes('annual'))) {
      riskLevel = 3;
      riskJustification = "Critical cooling system with limited redundancy";
    } else if (system.includes('generator')) {
      riskLevel = 3;
      riskJustification = "Critical power system maintenance";
    } else if (system.includes('ups')) {
      riskLevel = 3;
      riskJustification = "Critical power protection system";
    } else if (procedureType.includes('daily') || procedureType.includes('routine')) {
      riskLevel = 1;
      riskJustification = "Routine non-intrusive checks";
    }
    
    // Auto-calculate duration based on procedure type
    let duration = "45 minutes";
    if (procedureType.includes('weekly')) {
      duration = "1-2 hours";
    } else if (procedureType.includes('monthly')) {
      duration = "2-4 hours";
    } else if (procedureType.includes('quarterly') || procedureType.includes('annual')) {
      duration = "4-8 hours";
    } else if (procedureType.includes('daily')) {
      duration = "30-45 minutes";
    }
    
    // Get current date for input fields
    const currentDate = new Date().toLocaleDateString('en-US');
    
    // Prepare the prompt for Gemini
    const prompt = `${SOP_INSTRUCTIONS}

Equipment Details:
- Manufacturer: ${formData.manufacturer}
- Model Number: ${formData.modelNumber}
- Serial Number: ${formData.serialNumber || 'UPDATE NEEDED'}
- Location: ${formData.location || 'UPDATE NEEDED'}
- System: ${formData.system}
- Category: ${formData.category}
- Procedure Type: ${formData.procedureType}
- Frequency: ${formData.frequency || 'As per procedure type'}
- Procedure Description: ${formData.description}

Customer Information:
- Customer: ${formData.customer}

Site Address:
- Street: ${formData.address?.street || 'UPDATE NEEDED'}
- City: ${formData.address?.city || 'UPDATE NEEDED'}
- State: ${formData.address?.state || 'UPDATE NEEDED'}
- ZIP Code: ${formData.address?.zipCode || 'UPDATE NEEDED'}

CALCULATED VALUES:
- Level of Risk (LOR): ${riskLevel} - ${['Low', 'Medium', 'High', 'Critical'][riskLevel-1]}
- Risk Justification: ${riskJustification}
- Duration: ${duration}

Current Date: ${currentDate}

Generate ONLY the content that goes inside the container div - no DOCTYPE, html, head, body, or container tags.
Start with <h1>Standard Operating Procedure (SOP)</h1> and proceed with all 12 sections using H2 headers.

CRITICAL REQUIREMENTS:
1. Generate ALL 12 sections completely - do not stop early
2. Section 01 MUST include calculated LOR: ${riskLevel} and Duration: ${duration}
3. Section 01 MUST have editable input fields for Author, Version, CET Level Required, Author CET Level
4. Section 02 MUST show Customer: ${formData.customer} ONLY (no Customer Address)
5. Section 03 MUST use the EXACT format specified with tables for Work Area, Equipment Info, Personnel
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
    
    // Add the main title if not present
    if (!generatedContent.includes('<h1>')) {
      generatedContent = `<h1>Standard Operating Procedure (SOP)</h1>\n${generatedContent}`;
    }
    
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