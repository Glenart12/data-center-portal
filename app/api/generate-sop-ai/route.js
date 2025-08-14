import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SOP_INSTRUCTIONS = `
You are an expert data center operations engineer creating a Standard Operating Procedure (SOP) document.
Generate a comprehensive, professional SOP document in HTML format with ALL 12 sections listed below.

CRITICAL: You MUST include ALL 12 sections in order:
- Section 01: SOP Schedule Information
- Section 02: Site Information
- Section 03: SOP Overview
- Section 04: Effect of SOP on Critical Facility (with a table for 15 systems)
- Section 05: SOP Supporting Documentation
- Section 06: Safety Requirements
- Section 07: SOP Risks & Assumptions
- Section 08: SOP Details
- Section 09: Back-out Procedures
- Section 10: SOP Approval
- Section 11: SOP Completion
- Section 12: SOP Comments

SECTION-BY-SECTION REQUIREMENTS:

Section 01: SOP Schedule Information
- SOP Identifier: Generate unique ID (e.g., SOP-[SYSTEM]-[DATE]-[NUMBER])
- Procedure Title: Clear, descriptive title
- Frequency: How often the procedure is performed
- Duration: Estimated time to complete
- Personnel Required: Number and type of personnel needed
- Scheduling Requirements: Time windows, coordination needs
- Include a scheduling table with columns for Date, Time, Technician, Status

Section 02: Site Information
- Site Name: Data Center facility name
- Site Address: Full address with street, city, state, ZIP
- Site Contact: Primary contact information
- Emergency Contact: Emergency contact details
- Site Access Requirements: Badge, escort, clearance requirements
- Site-Specific Hazards: Unique hazards at this location

Section 03: SOP Overview
- Purpose: Why this procedure is necessary
- Scope: What systems/equipment are covered
- Objectives: What the procedure aims to achieve
- Success Criteria: How to measure successful completion
- Related Systems: Other systems that may be affected
- Dependencies: Prerequisites or related procedures

Section 04: Effect of SOP on Critical Facility
Create a comprehensive table with 15 critical systems showing:
- System Name
- Impact Level (None/Low/Medium/High)
- Duration of Impact
- Mitigation Measures
Include systems like: Cooling, Power, UPS, Fire Suppression, BMS, Security, Network, etc.

Section 05: SOP Supporting Documentation
- Equipment Manuals: List relevant manuals with version/date
- Technical Drawings: P&IDs, electrical diagrams, etc.
- Vendor Documentation: Service bulletins, technical notes
- Previous SOPs: Related or superseded procedures
- Compliance Documents: Regulatory requirements
- Training Materials: Required certifications or training

Section 06: Safety Requirements
- PPE Requirements: Specific PPE for this procedure
- Lockout/Tagout: LOTO requirements if applicable
- Arc Flash: Arc flash boundaries and PPE categories
- Chemical Hazards: Any chemicals involved
- Environmental Hazards: Temperature, noise, confined spaces
- Emergency Procedures: What to do in case of emergency

Section 07: SOP Risks & Assumptions
- Identified Risks: List all potential risks
- Risk Mitigation: How each risk is mitigated
- Assumptions: What conditions are assumed
- Contingencies: What to do if assumptions are incorrect
- Risk Assessment Matrix: Likelihood vs Impact table
- Escalation Procedures: When and how to escalate issues

Section 08: SOP Details
COMPREHENSIVE STEP-BY-STEP PROCEDURES:
- Pre-Procedure Checklist: Verification before starting
- Detailed Steps: Numbered, clear, actionable steps
- Include verification points after critical steps
- Add caution/warning boxes for critical steps
- Include expected readings/values
- Add troubleshooting guidance for common issues
- Post-Procedure Verification: Confirmation of success

Section 09: Back-out Procedures
- Back-out Triggers: When to initiate back-out
- Back-out Steps: Detailed reversal procedures
- System Restoration: How to return to original state
- Verification: How to verify successful back-out
- Time Requirements: How long back-out takes
- Escalation: Who to notify if back-out fails

Section 10: SOP Approval
Create an approval matrix table with:
- Role (Operations Manager, Facility Manager, Safety Officer, Quality Assurance)
- Name (input field)
- Signature (input field)
- Date (input field)
- Comments (input field)

Section 11: SOP Completion
- Completion Checklist: Final verification items
- Performance Metrics: KPIs for the procedure
- Documentation Requirements: What records to keep
- Notification Requirements: Who to inform upon completion
- Lessons Learned: Space for improvement notes
- Next Steps: Follow-up actions if any

Section 12: SOP Comments
- Revision History: Table with Version, Date, Author, Changes
- General Comments: Space for additional notes
- Improvement Suggestions: Areas for enhancement
- Training Notes: Special training considerations
- References: Links to related documents
- Contact Information: Subject matter experts

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
- Frequency: ${formData.frequency || 'UPDATE NEEDED'}
- Duration: ${formData.duration || 'UPDATE NEEDED'}
- Personnel Required: ${formData.personnelRequired || 'UPDATE NEEDED'}
- Criticality Level: ${formData.criticalityLevel || 'UPDATE NEEDED'}
- Procedure Description: ${formData.description}

Site Address:
- Street: ${formData.address?.street || 'UPDATE NEEDED'}
- City: ${formData.address?.city || 'UPDATE NEEDED'}
- State: ${formData.address?.state || 'UPDATE NEEDED'}
- ZIP Code: ${formData.address?.zipCode || 'UPDATE NEEDED'}

Current Date: ${currentDate}

Generate ONLY the content that goes inside the container div - no DOCTYPE, html, head, body, or container tags.
Start with <h1>Standard Operating Procedure (SOP)</h1> and then proceed with all 12 sections using H2 headers.

CRITICAL REQUIREMENTS:
1. Generate ALL 12 sections completely - do not stop early
2. Section 04 MUST include a table with 15 critical facility systems
3. Section 08 MUST include detailed step-by-step procedures specific to ${formData.procedureType} for ${formData.manufacturer} ${formData.modelNumber}
4. Include input fields, checkboxes, and UPDATE NEEDED markers where appropriate
5. Use green color theme (#198754 for primary, #20c997 for accents) in inline styles
6. Make all procedures specific to the equipment and procedure type provided
7. Ensure Section 10 has an approval matrix table with input fields
8. Ensure Section 11 has a completion checklist
9. Ensure Section 12 includes revision history table

Generate comprehensive, detailed content for ALL sections. Do NOT use placeholder text.`;

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 15000, // Increased for 12 sections
        candidateCount: 1
      }
    });
    
    console.log('Sending prompt to Gemini AI...');
    
    let result, response, generatedContent;
    try {
      result = await model.generateContent(prompt);
      response = await result.response;
      generatedContent = response.text();
    } catch (aiError) {
      console.error('AI Generation Error:', aiError);
      
      // Try with simpler configuration on retry
      console.log('Retrying with simpler configuration...');
      try {
        const retryModel = genAI.getGenerativeModel({ 
          model: 'gemini-1.5-flash',
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 12000
          }
        });
        result = await retryModel.generateContent(prompt);
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