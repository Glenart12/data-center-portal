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
- Version: [Provided version]
- Date: [Current date]
- Author: [Provided author name]
- Use green color (#198754) for the SOP header

CRITICAL: You MUST include ALL 12 sections in order:
- Section 01: SOP Schedule Information
- Section 02: Site Information
- Section 03: SOP Overview
- Section 04: Effect of SOP on Critical Facility (with a table for 15 systems)
- Section 05: SOP Supporting Documentation
- Section 06: Safety Requirements
- Section 07: SOP Risks & Assumptions
- Section 08: SOP Details
- Section 09: Escalation/Communication
- Section 10: SOP Approval
- Section 11: SOP Completion
- Section 12: Comments

SECTION-BY-SECTION REQUIREMENTS:

Section 01: SOP Schedule Information
- SOP Identifier: Generate unique ID (e.g., SOP-[SYSTEM]-[DATE]-[NUMBER])
- Procedure Title: Clear, descriptive title including manufacturer and model
- Level of Risk (LOR): Calculate based on task type + equipment model + frequency
  * Low: Daily routine checks on non-critical equipment
  * Medium: Weekly/monthly maintenance on redundant systems
  * High: Quarterly/annual maintenance or critical system work
  * Critical: Any work on single points of failure
- Version: Display the provided version (editable field)
- Author: Display the provided author name
- Date: Current date
- CET Level Required: Display the provided CET level (CET 1-4)
- Duration: AUTO-DETERMINE based on the specific equipment model and procedure complexity
- Frequency: Based on the procedure type provided
DO NOT include scheduling tables or scheduling requirements narrative

Section 02: Site Information
- Customer: Display the provided customer name
- Customer Address: Display the provided customer address
- Site Name: Data Center facility name
- Site Address: Full address with street, city, state, ZIP
- Location: Equipment location within facility
DO NOT include Emergency Contact, Site Access Requirements, or Site-Specific Hazards here (these move to Section 06)

Section 03: SOP Overview
- Purpose: Why this procedure is necessary
- Scope: What systems/equipment are covered
- Objectives: What the procedure aims to achieve
- Success Criteria: How to measure successful completion
- Related Systems: Other systems that may be affected
- Dependencies: Prerequisites or related procedures

Section 04: Effect of SOP on Critical Facility
Create EXACT MOP/EOP format table with these 15 systems:
| System | Yes | No | N/A |
|--------|-----|-----|-----|
| 1. Cooling System | | | |
| 2. Electrical System | | | |
| 3. UPS System | | | |
| 4. Generator System | | | |
| 5. Fire Protection | | | |
| 6. BMS/EPMS | | | |
| 7. Security System | | | |
| 8. Network Infrastructure | | | |
| 9. Water/Plumbing | | | |
| 10. Access Control | | | |
| 11. VESDA/Smoke Detection | | | |
| 12. Fuel System | | | |
| 13. Emergency Lighting | | | |
| 14. HVAC Controls | | | |
| 15. Communication Systems | | | |
For daily checks, most should be "No" impact (non-intrusive)

Section 05: SOP Supporting Documentation
RISK-BASED approach:
- Low LOR: Minimal documentation (basic equipment reference)
- Medium LOR: Standard manuals and procedures
- High LOR: Complete technical documentation
- Critical LOR: Full documentation package including schematics
DO NOT require owner's manual for daily routine checks
Include equipment-specific documentation when available

Section 06: Safety Requirements
Format as TABLE with columns:
| PPE Type | Specification | When Required |
Include asset-specific requirements:
- Hearing protection for chillers/generators
- Arc-flash PPE for electrical work
- Fall protection for elevated work
- Chemical PPE for refrigerant handling
ADD at bottom of section:
- Emergency Contacts (moved from Section 02)
- Site Access Requirements (moved from Section 02)
- Site-Specific Hazards (moved from Section 02)

Section 07: SOP Risks & Assumptions
Match MOP format exactly:
- Identified Risks: List all potential risks
- Risk Mitigation: How each risk is mitigated
- Assumptions: What conditions are assumed (include weather for outdoor equipment)
- Contingencies: What to do if assumptions are incorrect
- Risk Assessment Matrix: Likelihood vs Impact table

Section 08: SOP Details
Format as numbered steps with structured approach:
1. Pre-Procedure Checks
2. Equipment Readings and Observations
3. Post-Procedure Verification

Create a TABLE for readings with columns:
| Step | Description | Expected Range | Source | Computed/Manufacturer | Action if Out of Range |
Where Source = BMS/PIC5+/Physical gauge/Display panel

Include equipment-specific steps:
- Exact control panel locations for this model
- Model-specific setpoints and operating ranges
- Reference exact display screens and menu paths
- Include manufacturer-recommended values
Add troubleshooting as subsection 8.x (not main steps)

Section 09: Escalation/Communication
Format as TABLE:
| Who | When | Trigger | Notes |
Include:
- Shift supervisor notification
- Customer notification requirements
- Vendor escalation paths
- Emergency escalation procedures

Section 10: SOP Approval
Create an approval matrix table with:
- Role (Operations Manager, Facility Manager, Safety Officer, Customer Representative)
- Name (input field)
- Signature (input field)
- Date (input field)

Section 11: SOP Completion
ONLY include:
- Technician Sign-off table with Name, Signature, Date, Time fields
REMOVE: completion checklist, performance metrics, lessons learned

Section 12: Comments
Include:
- Revision History table: Version | Date | Author | Changes
- General comments field (optional)
REMOVE: Contact information section

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
        !formData?.category || !formData?.description || !formData?.procedureType) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        userMessage: 'Please fill in all required fields'
      }, { status: 400 });
    }
    
    console.log('Starting SOP generation for:', formData.manufacturer, formData.modelNumber);
    
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

Document Information:
- Version: ${formData.version || '1.0'}
- Author: ${formData.author || 'UPDATE NEEDED'}
- CET Level Required: ${formData.cetLevel || 'UPDATE NEEDED'}

Customer Information:
- Customer: ${formData.customer || 'UPDATE NEEDED'}
- Customer Address:
  * Street: ${formData.customerAddress?.street || 'UPDATE NEEDED'}
  * City: ${formData.customerAddress?.city || 'UPDATE NEEDED'}
  * State: ${formData.customerAddress?.state || 'UPDATE NEEDED'}
  * ZIP Code: ${formData.customerAddress?.zipCode || 'UPDATE NEEDED'}

Site Address:
- Street: ${formData.address?.street || 'UPDATE NEEDED'}
- City: ${formData.address?.city || 'UPDATE NEEDED'}
- State: ${formData.address?.state || 'UPDATE NEEDED'}
- ZIP Code: ${formData.address?.zipCode || 'UPDATE NEEDED'}

AUTO-DETERMINE THESE BASED ON EQUIPMENT AND PROCEDURE:
- Level of Risk (LOR): Calculate based on ${formData.procedureType} + ${formData.manufacturer} ${formData.modelNumber} + ${formData.frequency || 'frequency'}
- Duration: Determine based on ${formData.manufacturer} ${formData.modelNumber} specifications and ${formData.procedureType}

Current Date: ${currentDate}

Generate ONLY the content that goes inside the container div - no DOCTYPE, html, head, body, or container tags.
Start with the document header showing Version, Date, Author, then <h1>Standard Operating Procedure (SOP)</h1> and proceed with all 12 sections using H2 headers.

CRITICAL REQUIREMENTS:
1. Generate ALL 12 sections completely - do not stop early
2. Section 01 MUST use "Level of Risk (LOR)" NOT "Criticality Level"
3. Section 02 MUST include Customer and Customer Address at the top
4. Section 04 MUST include the EXACT 15-system table format as specified
5. Section 06 MUST be formatted as a PPE table with Emergency Contacts at bottom
6. Section 08 MUST include:
   - Numbered steps format with Pre-checks, Readings, Post-verification
   - Table with Source and Expected Range columns
   - Equipment-specific procedures for ${formData.manufacturer} ${formData.modelNumber}
   - Troubleshooting as subsection (not main steps)
7. Section 09 MUST be "Escalation/Communication" with table format
8. Section 11 MUST ONLY have Technician Sign-off (no checklist or metrics)
9. Section 12 MUST have Revision History but NO contact information
10. Use green color theme (#198754 for primary, #20c997 for accents) in inline styles

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