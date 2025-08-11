import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { getEquipmentSpecs, getEmergencyPPE } from '@/lib/equipment-database';

// Import EOP sections
import { getEOPHeader } from '@/lib/eop-sections/header';
import { getSection01Identification } from '@/lib/eop-sections/section-01-identification';
import { getSection02PurposeScope } from '@/lib/eop-sections/section-02-purpose-scope';
import { getSection03ImmediateActions } from '@/lib/eop-sections/section-03-immediate-actions';
import { getSection04Scenarios } from '@/lib/eop-sections/section-04-scenarios';
import { getSection05Communication } from '@/lib/eop-sections/section-05-communication';
import { getSection06Recovery } from '@/lib/eop-sections/section-06-recovery';
import { getSection07Supporting } from '@/lib/eop-sections/section-07-supporting';
import { getSection08Approval } from '@/lib/eop-sections/section-08-approval';
import { getFormattingInstructions } from '@/lib/eop-sections/formatting';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Build PROJECT_INSTRUCTIONS from modular sections
function buildProjectInstructions(emergencyType) {
  return [
    getEOPHeader(emergencyType),
    '',
    getSection01Identification(emergencyType),
    '',
    getSection02PurposeScope(emergencyType),
    '',
    getSection03ImmediateActions(emergencyType),
    '',
    getSection04Scenarios(emergencyType),
    '',
    getSection05Communication(emergencyType),
    '',
    getSection06Recovery(emergencyType),
    '',
    getSection07Supporting(emergencyType),
    '',
    getSection08Approval(emergencyType),
    '',
    getFormattingInstructions(emergencyType)
  ].join('\n');
}

// PROJECT_INSTRUCTIONS will be built dynamically with emergency type

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>__EOP_TITLE__</title>
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
            color: #dc3545; 
            text-align: center; 
            margin-bottom: 40px; 
            font-size: 2.5em;
            border-bottom: 3px solid #dc3545;
            padding-bottom: 20px;
        }
        h2 { 
            color: #dc3545; 
            border-bottom: 2px solid #dc3545; 
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
            background-color: #dc3545; 
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
        .emergency-action {
            background-color: #fee;
            padding: 15px;
            border-left: 5px solid #dc3545;
            margin: 15px 0;
            font-weight: bold;
        }
        .critical-text {
            color: #dc3545;
            font-weight: bold;
            text-transform: uppercase;
        }
        input[type="text"], input.field-box {
            border: 1px solid #999;
            padding: 5px;
            background-color: #fff;
            font-family: inherit;
            font-size: inherit;
            width: 90%;
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
        .emergency-warning { 
            background-color: #f8d7da; 
            color: #721c24;
            border: 2px solid #dc3545;
            padding: 15px; 
            border-radius: 5px; 
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
        }
        .section-separator {
            border-top: 2px solid #ccc;
            margin: 40px 0;
        }
        .small-input {
            width: 60px;
            padding: 3px;
            border: 1px solid #999;
            font-size: 12px;
        }
        .field-box {
            border: 1px solid #999;
            padding: 5px;
            background-color: #fff;
            font-family: inherit;
            font-size: inherit;
            width: 90%;
        }
        input[type="text"] {
            border: 1px solid #999;
            padding: 5px;
            background-color: #fff;
            font-family: inherit;
            font-size: inherit;
        }
        a {
            color: #0070f3;
            text-decoration: underline;
        }
        a:hover {
            color: #0051cc;
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
    const body = await request.json();
    const { formData } = body;
    
    // Validate required fields
    if (!formData?.manufacturer || !formData?.modelNumber || !formData?.system || 
        !formData?.component || !formData?.emergencyType) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        userMessage: 'Please fill in all required fields'
      }, { status: 400 });
    }

    // Additional specific validation for component
    if (!formData?.component) {
      return NextResponse.json({ 
        error: 'Component/Equipment Type is required',
        userMessage: 'Component/Equipment Type is required'
      }, { status: 400 });
    }
    
    console.log('Starting EOP generation for:', formData.manufacturer, formData.modelNumber);
    
    // Get current date for input fields
    const currentDate = new Date().toLocaleDateString('en-US');
    
    // Build project instructions with the specific emergency type
    const PROJECT_INSTRUCTIONS = buildProjectInstructions(formData.emergencyType);
    
    // Prepare the prompt for Gemini
    const prompt = `${PROJECT_INSTRUCTIONS.replace('[current_date]', currentDate)}

CRITICAL EQUIPMENT TYPE: ${formData.component}
THIS IS A: ${formData.component?.toUpperCase()} - Make sure ALL procedures are specific to ${formData.component}

EMERGENCY TYPE FOCUS: ${formData.emergencyType}
${formData.emergencyType.toLowerCase().includes('power') ? `
POWER FAILURE EMERGENCY - This EOP is specifically for power failure response. 
Section 03 MUST include comprehensive power diagnostics with voltage verification tables.
Section 04 MUST include the 4 external power supply scenarios with equipment-specific adaptations.
` : ''}

// Get equipment specifications from database
const equipmentSpecs = getEquipmentSpecs(formData.manufacturer, formData.modelNumber);
const emergencyPPE = getEmergencyPPE(formData.emergencyType, equipmentSpecs);

Equipment-Specific Details for ${formData.manufacturer} ${formData.modelNumber}:
${equipmentSpecs ? `
VERIFIED EQUIPMENT SPECIFICATIONS FROM DATABASE:
- Voltage: ${equipmentSpecs.voltage || 'Unknown'}
- Phase: ${equipmentSpecs.phase || 'Unknown'}
- Control Voltage: ${equipmentSpecs.controlVoltage || 'Unknown'}
- Control System: ${equipmentSpecs.controlSystem || 'Unknown'}
${equipmentSpecs.refrigerant ? `- Refrigerant: ${equipmentSpecs.refrigerant}` : ''}
${equipmentSpecs.compressorType ? `- Compressor Type: ${equipmentSpecs.compressorType}` : ''}
${equipmentSpecs.capacity ? `- Capacity: ${equipmentSpecs.capacity}` : ''}
${equipmentSpecs.fuelType ? `- Fuel Type: ${equipmentSpecs.fuelType}` : ''}
${equipmentSpecs.batteryType ? `- Battery Type: ${equipmentSpecs.batteryType}` : ''}
${equipmentSpecs.vfd ? '- Variable Frequency Drive (VFD) Equipped' : ''}
- Arc Flash PPE Required: ${equipmentSpecs.arcFlashPPE || 'Verify on site'}
${emergencyPPE.respiratory ? `- Respiratory Protection: ${emergencyPPE.respiratory}` : ''}
${emergencyPPE.additional ? `- Additional PPE: ${emergencyPPE.additional}` : ''}
` : `
EQUIPMENT SPECIFICATIONS NOT IN DATABASE - USE YOUR KNOWLEDGE:
Generate accurate specifications for ${formData.manufacturer} ${formData.modelNumber} based on:
- Component Type: ${formData.component}
- Manufacturer standards and typical configurations
- Industry standard voltages and control systems
- Emergency Type: ${formData.emergencyType} (adapt PPE requirements accordingly)
`}

Emergency Details:
- Manufacturer: ${formData.manufacturer}
- Model Number: ${formData.modelNumber}
- Serial Number: ${formData.serialNumber || 'N/A'}
- Location: ${formData.location || 'N/A'}
- System: ${formData.system}
- Component/Equipment Type: ${formData.component}
- Emergency Type: ${formData.emergencyType}

Generate ONLY the content that goes inside the container div - no DOCTYPE, html, head, body, or container tags.
Start with <h1>Emergency Operating Procedure (EOP)</h1> followed by the Quick Response header div, then proceed with sections using H2 headers.

IMPORTANT: In Section 07, do NOT include PPE Requirements or Tools Required subsections - these are now in Section 03 where they're needed immediately.
Include ALL 8 sections with complete, detailed content and INTERACTIVE INPUT FIELDS as specified above.

CRITICAL FOR SECTION 03:
- FIRST add Pre-Action Safety & Equipment Requirements subsection with:
  * PPE requirements specific to ${formData.component} voltage and hazards
  * Tool requirements based on ${formData.manufacturer} ${formData.modelNumber}
  * Safety checkpoint with equipment-specific hazards
- Create a detailed diagnostic table with voltage verification specific to ${formData.component}
- Include actual expected voltages based on equipment type
- Add input fields for technician readings
- Include Pass/Fail checkboxes

CRITICAL FOR SECTION 04:
- Generate 4 complete scenarios for external power issues
- Each scenario must be specific to ${formData.component} equipment type
- Include verification tables with input fields
- Reference appropriate upstream power sources for this equipment

Use proper section numbering: "Section 01:", "Section 02:", etc. (zero-padded numbers).
Make sure all critical actions use the .critical-text class and emergency warnings use the .emergency-action or .emergency-warning classes.
CRITICAL: Generate content only - NO document structure tags (DOCTYPE, html, head, body, container div).`;

    // Generate content using Gemini with optimized configuration
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro',
      generationConfig: {
        temperature: 0.3,  // Lower for more consistent, factual output
        maxOutputTokens: 12000,  // Sufficient for detailed EOP
        candidateCount: 1
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedContent = response.text();
    
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
      generatedContent = `<h1>Emergency Operating Procedure (EOP)</h1>\n${generatedContent}`;
    }
    
    // Generate dynamic EOP title
    const eopTitle = `EOP - ${formData.manufacturer} ${formData.modelNumber} - ${formData.emergencyType}`;
    
    // Build complete HTML with dynamic title
    const completeHtml = HTML_TEMPLATE
      .replace('__EOP_TITLE__', eopTitle)
      .replace('{{CONTENT}}', generatedContent);
    
    // Extract EOP Identifier from generated content for filename
    let filename = '';
    try {
      // Try multiple regex patterns to extract EOP Identifier
      const identifierPatterns = [
        // Specific pattern for <b> or <strong> tags
        /EOP Identifier:<\/(?:b|strong|span)>\s*([A-Z0-9\-_]+)/i,
        // Broader pattern for any HTML tags after EOP Identifier:
        /EOP Identifier:.*?>\s*([A-Z0-9\-_]+)/i,
        // Even broader pattern that handles multiple tags and whitespace
        /EOP Identifier:[^>]*>.*?([A-Z0-9\-_]{3,})/i,
        // Simple pattern without HTML tags
        /EOP Identifier:\s*([A-Z0-9\-_]+)/i
      ];
      
      let eopIdentifier = '';
      let matchedPattern = -1;
      
      for (let i = 0; i < identifierPatterns.length; i++) {
        const identifierMatch = completeHtml.match(identifierPatterns[i]);
        if (identifierMatch && identifierMatch[1] && identifierMatch[1].trim().length >= 3) {
          eopIdentifier = identifierMatch[1].trim();
          matchedPattern = i;
          break;
        }
      }
      
      if (eopIdentifier) {
        console.log(`Extracted EOP Identifier using pattern ${matchedPattern}:`, eopIdentifier);
        
        // Sanitize the identifier to remove invalid filename characters
        const sanitizedIdentifier = eopIdentifier
          .replace(/[<>:"/\\|?*]/g, '_')  // Replace invalid Windows filename characters
          .replace(/\s+/g, '_')          // Replace spaces with underscores
          .replace(/[^\w\-_.]/g, '')     // Keep only alphanumeric, dash, underscore, dot
          .replace(/_{2,}/g, '_')        // Replace multiple underscores with single
          .trim();
        
        filename = `${sanitizedIdentifier}.html`;
      } else {
        // Fallback to current naming convention
        const date = new Date().toISOString().split('T')[0];
        const timestamp = Date.now();
        const safeManufacturer = formData.manufacturer.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
        const safeModel = formData.modelNumber.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
        filename = `EOP_${safeManufacturer}_${safeModel}_${date}_${timestamp}.html`;
        console.log('No EOP Identifier found, using current naming convention:', filename);
      }
    } catch (parseError) {
      console.error('Error parsing EOP Identifier:', parseError);
      // Fallback to current naming convention
      const date = new Date().toISOString().split('T')[0];
      const timestamp = Date.now();
      const safeManufacturer = formData.manufacturer.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
      const safeModel = formData.modelNumber.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
      filename = `EOP_${safeManufacturer}_${safeModel}_${date}_${timestamp}.html`;
      console.log('Error extracting identifier, using current naming convention:', filename);
    }

    // Save to blob storage
    const blob = await put(`eops/${filename}`, completeHtml, {
      access: 'public',
      contentType: 'text/html',
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    console.log('EOP generation complete:', filename);
    
    return NextResponse.json({ 
      success: true,
      filename: filename,
      url: blob.url,
      message: 'EOP generated successfully'
    });
    
  } catch (error) {
    console.error('EOP generation error:', error);
    
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
      error: 'Failed to generate EOP',
      details: error.message,
      userMessage: 'Unable to generate EOP. Please try again.'
    }, { status: 500 });
  }
}