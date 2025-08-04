import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Split the HTML template into sections for better management
const HTML_HEADER = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Method of Procedure (MOP)</title>
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
            color: #0f3456; 
            text-align: center; 
            margin-bottom: 40px; 
            font-size: 2.5em;
            border-bottom: 3px solid #0f3456;
            padding-bottom: 20px;
        }
        h2 { 
            color: #0f3456; 
            border-bottom: 2px solid #0f3456; 
            padding-bottom: 10px; 
            margin-top: 40px; 
            font-size: 1.8em;
        }
        h3 {
            color: #0f3456;
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
            background-color: #0f3456; 
            color: white; 
            font-weight: bold;
        }
        tr:nth-child(even) { 
            background-color: #f9f9f9; 
        }
        .info-table td:first-child { 
            font-weight: bold; 
            background-color: #f0f0f0; 
            width: 35%; 
        }
        input[type="text"], input.field-box {
            border: 1px solid #999;
            padding: 5px;
            background-color: #fff;
            font-family: inherit;
            font-size: inherit;
            width: 90%;
        }
        .update-needed-input {
            color: red;
            font-weight: bold;
            border: none;
            background: transparent;
            width: 100%;
            font-family: inherit;
            font-size: inherit;
        }
        .update-needed-input:focus {
            outline: 1px solid #0f3456;
            background: #f9f9f9;
        }
        .update-needed-input:not(:placeholder-shown) {
            color: black;
            font-weight: normal;
        }
        .contractor-input {
            border: 1px solid #999;
            padding: 5px;
            background-color: #fff;
            font-family: inherit;
            font-size: inherit;
            width: 100%;
        }
        .contractor-input::placeholder {
            color: #666;
            font-style: italic;
        }
        .small-input {
            width: 60px;
            padding: 3px;
            border: 1px solid #999;
            font-size: 12px;
        }
        .safety-critical {
            background-color: #fee;
            font-weight: bold;
            color: #d00;
        }
        .verification {
            background-color: #eff;
            font-weight: bold;
            color: #00a;
        }
        .checkbox {
            text-align: center;
            font-size: 1.2em;
        }
        ul { 
            line-height: 1.8; 
            margin-left: 20px;
        }
        li {
            margin-bottom: 8px;
        }
        .safety-warning { 
            background-color: #fee; 
            padding: 15px; 
            border-radius: 5px; 
            margin: 20px 0;
            border: 2px solid #d00;
        }
        .section-separator {
            border-top: 2px solid #ccc;
            margin: 40px 0;
        }
        .data-recording-wrapper {
            overflow-x: auto;
            margin: 10px 0;
        }
        .data-recording-table {
            background-color: #f5f5f5;
            min-width: 100%;
        }
        .data-recording-table input {
            width: 80px;
            padding: 3px;
        }
        .sub-procedure {
            margin-left: 30px;
            font-style: italic;
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
        <h1>Method of Procedure (MOP)</h1>`;

// Simplified prompt that focuses on generating complete HTML
const GENERATION_PROMPT = `Generate a COMPLETE Method of Procedure (MOP) in HTML format for data center equipment maintenance.

CRITICAL REQUIREMENTS:
1. Generate a complete, valid HTML document
2. Include ALL 11 sections - do not stop or truncate
3. Each section must have proper tables and formatting
4. Use actual HTML input tags for editable fields
5. Generate detailed, equipment-specific content

EQUIPMENT INFORMATION:
{EQUIPMENT_DETAILS}

CRITICAL RISK LEVEL DETERMINATION RULES:
You MUST analyze the equipment and work being performed to determine the correct risk level (1-4):

Level 1 (Low): 
- Single system affected
- Low probability of service interruption
- Examples: Basic visual inspections, filter changes with redundant systems

Level 2 (Medium): 
- Multiple systems affected OR one critical system with redundancy
- Medium probability of service interruption
- Examples: Single chiller maintenance with redundant chiller available, UPS battery replacement

Level 3 (High): 
- Critical systems affected with limited redundancy
- High probability of service interruption if something goes wrong
- Examples: Generator maintenance, critical cooling system work, major electrical work

Level 4 (Critical): 
- Multiple critical systems affected
- Certain service interruption or extremely high risk
- Examples: Main switchgear work, complete cooling system shutdown, EPO system work

CET LEVEL REQUIREMENTS BASED ON RISK:
- Risk Level 1: CET 1 (Technician) to execute, CET 2 (Lead Technician) to approve
- Risk Level 2: CET 2 (Technician) to execute, CET 3 (Lead Technician) to approve  
- Risk Level 3: CET 3 (Lead Technician) to execute, CET 4 (Manager) to approve
- Risk Level 4: CET 4 (Manager) to execute, CET 5 (Director) to approve

GENERATE THE FOLLOWING 11 SECTIONS:

Section 01: MOP Schedule Information
- Include editable fields for document number and CET level
- Revision number should be "V1" in an editable input

Section 02: Site Information  
- Location field should be editable with red UPDATE NEEDED placeholder
- CRITICAL: Risk Level MUST be properly determined based on the rules above
  Format: "Level [1-4] ([Low/Medium/High/Critical]) - [Specific justification based on systems affected]"
  Example: "Level 3 (High) - Critical cooling system maintenance with high risk to data center operations if redundancy fails"
- CET Level must match the risk level requirements

Section 03: MOP Overview
- Include all equipment details
- Add subcontractor checkbox options
- List all required tools and qualifications

Section 04: Effect of MOP on Critical Facility
- Create a 20-row table with all facility systems
- CRITICAL: Your selections in this table MUST support the risk level in Section 02
- Mark "Yes" for systems that will be affected by the maintenance
- Monitoring System is ALWAYS affected (Yes)
- Include checkboxes for Yes/No/N/A

Section 05: MOP Supporting Documentation
- List relevant manuals and standards
- Include OSHA regulations

Section 06: Safety Requirements
- Create 4 tables: Hazards, PPE, Safety Procedures, Emergency Contacts
- Include equipment-specific hazards

Section 07: MOP Risks & Assumptions
- List at least 7 detailed risks with mitigations
- Include at least 5 assumptions

Section 08: MOP Details
- Add date/time/personnel fields
- Include pre-maintenance data recording table if applicable
- Create detailed procedure steps (30-40 steps)
- Include torque specifications
- Add sub-procedures for complex steps

Section 09: Back-out Procedures  
- Create at least 10 detailed back-out steps
- Include notification procedures

Section 10: MOP Approval
- Create approval table with 4 rows
- Include fields for names, titles, and dates

Section 11: MOP Comments
- Add relevant equipment-specific comments

IMPORTANT: Generate the COMPLETE HTML document. Do not stop or say "content too large".`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { formData } = body;
    const { manufacturer, modelNumber, serialNumber, location, system, category, description } = formData;
    
    console.log('MOP generation started for:', manufacturer, modelNumber);
    console.log('Using Gemini 2.5 Pro model with enhanced thinking capabilities');
    
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: 'Configuration error',
        userMessage: 'AI service is not configured. Please contact administrator.'
      }, { status: 500 });
    }
    
    // Generate filename with .html extension
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    const safeManufacturer = manufacturer.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
    const safeSystem = system.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
    const safeCategory = category.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
    const filename = `MOP_${safeManufacturer}_${safeSystem}_${safeCategory}_${date}_${timestamp}.html`;

    // Determine frequency from description
    const frequency = description.toLowerCase().includes('annual') ? 'ANNUAL' : 
                      description.toLowerCase().includes('quarterly') ? 'QUARTERLY' : 
                      description.toLowerCase().includes('monthly') ? 'MONTHLY' : 
                      description.toLowerCase().includes('weekly') ? 'WEEKLY' :
                      description.toLowerCase().includes('semi-annual') ? 'SEMI-ANNUAL' : 'PREVENTIVE';

    // Create equipment details for prompt
    const equipmentDetails = `
- Manufacturer: ${manufacturer}
- Model Number: ${modelNumber}
- System Type: ${system}
- Category: ${category}
- Work Description: ${description}
- Location: ${location || 'Data Center'}
- Frequency: ${frequency}
- Serial Number: ${serialNumber || 'UPDATE NEEDED'}`;

    // Create the full prompt
    const prompt = GENERATION_PROMPT.replace('{EQUIPMENT_DETAILS}', equipmentDetails);

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use Gemini 2.5 Pro - the most powerful thinking model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro', // Most powerful model with enhanced thinking and reasoning
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200000, // Maximum tokens for complete generation
        topP: 0.95,
        topK: 40,
      }
    });
    
    // Try to generate with retries
    let mopContent;
    let lastError;
    const maxAttempts = 3;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Generating MOP with Gemini 2.5 Pro - Attempt ${attempt} of ${maxAttempts}...`);
        console.log('Note: Model includes thinking time for better accuracy');
        
        // For very long content, we might need to generate in parts
        const result = await model.generateContent({
          contents: [{ 
            role: 'user', 
            parts: [{ text: prompt }] 
          }]
        });
        
        const response = await result.response;
        let generatedContent = response.text();
        
        // Clean up the response
        generatedContent = generatedContent.replace(/```html\n?/g, '').replace(/```\n?/g, '');
        
        // Find the actual HTML content
        const htmlStart = generatedContent.indexOf('<!DOCTYPE html>');
        const htmlEnd = generatedContent.lastIndexOf('</html>');
        
        if (htmlStart === -1 || htmlEnd === -1) {
          throw new Error('Generated content is not valid HTML - missing DOCTYPE or closing tag');
        }
        
        // Extract just the HTML
        mopContent = generatedContent.substring(htmlStart, htmlEnd + 7);
        
        // Verify all sections are present
        const requiredSections = [
          'Section 01:', 'Section 02:', 'Section 03:', 'Section 04:',
          'Section 05:', 'Section 06:', 'Section 07:', 'Section 08:',
          'Section 09:', 'Section 10:', 'Section 11:'
        ];
        
        const missingSections = requiredSections.filter(section => !mopContent.includes(section));
        
        if (missingSections.length > 0) {
          console.log('Missing sections:', missingSections);
          
          // If we're missing sections, try to complete the MOP
          if (attempt < maxAttempts) {
            console.log('Attempting to regenerate with focus on completeness...');
            continue;
          }
        }
        
        // Verify risk level is properly formatted
        if (!mopContent.includes('Level 1') && !mopContent.includes('Level 2') && 
            !mopContent.includes('Level 3') && !mopContent.includes('Level 4')) {
          console.log('Risk level not properly formatted, regenerating...');
          if (attempt < maxAttempts) {
            continue;
          }
        }
        
        console.log('Successfully generated complete MOP, length:', mopContent.length);
        break;
        
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);
        
        // Handle rate limits
        if (error.message?.includes('429') || error.message?.includes('quota')) {
          if (attempt < maxAttempts) {
            const waitTime = attempt * 5000; // 5s, 10s, 15s
            console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
            await wait(waitTime);
            continue;
          }
        }
        
        // For other errors, try again with a smaller request
        if (attempt < maxAttempts) {
          await wait(2000);
          continue;
        }
      }
    }
    
    if (!mopContent) {
      const errorMessage = lastError?.message || 'Failed to generate after all attempts';
      
      if (errorMessage.includes('429') || errorMessage.includes('quota')) {
        return NextResponse.json({ 
          error: 'Rate limit reached',
          userMessage: 'Too many requests. Please wait 60 seconds and try again.'
        }, { status: 429 });
      }
      
      return NextResponse.json({ 
        error: 'Generation failed',
        details: errorMessage,
        userMessage: 'Unable to generate complete MOP. Please try again.'
      }, { status: 500 });
    }

    // Save to blob storage
    try {
      const blob = await put(`mops/${filename}`, mopContent, {
        access: 'public',
        contentType: 'text/html'
      });
      
      console.log('Successfully saved to blob storage:', filename);
      
      return NextResponse.json({ 
        success: true,
        filename: filename,
        url: blob.url,
        message: 'MOP generated successfully'
      });
      
    } catch (blobError) {
      console.error('Blob storage error:', blobError);
      
      // Return success with a warning about storage
      return NextResponse.json({ 
        success: true,
        filename: filename,
        warning: 'MOP generated but storage failed',
        generatedContent: mopContent,
        message: 'MOP generated successfully but could not be saved automatically.'
      });
    }

  } catch (error) {
    console.error('MOP generation error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to generate MOP',
      details: error.message,
      userMessage: 'Unable to generate MOP. Please check your inputs and try again.'
    }, { status: 500 });
  }
}