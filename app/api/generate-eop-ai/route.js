import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROJECT_INSTRUCTIONS = `Generate a complete Emergency Operating Procedure (EOP) for data center equipment failures. Create a COMPLETE HTML document with ALL 8 sections - no placeholders or summaries.

The EOP must follow this EXACT structure:

SECTION 1: EOP Identification & Control
- EOP Title, Identifier, Equipment details, Version, Dates, Author/Approver

SECTION 2: Purpose & Scope
- Clear statement of emergency response goals
- Who this procedure applies to

SECTION 3: IMMEDIATE EMERGENCY ACTIONS
- 4-5 numbered steps for immediate response
- Use CAPITAL LETTERS for critical actions like PRESS, NOTIFY, PROCEED

SECTION 4: Trigger Conditions & Specific Scenarios
- Create 4 scenarios based on the emergency type provided
- Each scenario with trigger conditions and specific actions

SECTION 5: Communication & Escalation Protocol
- Table with contact levels 0-3 plus emergency services

SECTION 6: Recovery & Return to Service
- Fault verification, system reset, return to service steps

SECTION 7: Supporting Information
- Equipment locations, PPE requirements, related documents

SECTION 8: EOP Approval & Review
- Approval matrix table

Use red (color: #dc3545) for all emergency warnings and critical actions. Format as a complete HTML document with professional styling.`;

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emergency Operating Procedure (EOP)</title>
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
            background-color: #dc3545; 
            color: white;
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
        !formData?.emergencyType || !formData?.description) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        userMessage: 'Please fill in all required fields'
      }, { status: 400 });
    }
    
    console.log('Starting EOP generation for:', formData.manufacturer, formData.modelNumber);
    
    // Prepare the prompt for Gemini
    const prompt = `${PROJECT_INSTRUCTIONS}

Emergency Details:
- Manufacturer: ${formData.manufacturer}
- Model Number: ${formData.modelNumber}
- Serial Number: ${formData.serialNumber || 'N/A'}
- Location: ${formData.location || 'N/A'}
- System: ${formData.system}
- Emergency Type: ${formData.emergencyType}
- Emergency Description: ${formData.description}

Generate a complete HTML document for the body content only (everything that goes inside the container div). 
Include ALL 8 sections with complete, detailed content. 
For Section 4, create 4 specific scenarios based on the emergency type "${formData.emergencyType}".
Make sure all critical actions use the .critical-text class and emergency warnings use the .emergency-action or .emergency-warning classes.`;

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp'
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedContent = response.text();
    
    // Clean up the response
    generatedContent = generatedContent
      .replace(/```html/g, '')
      .replace(/```/g, '')
      .replace(/<\/?html[^>]*>/gi, '')
      .replace(/<\/?head[^>]*>/gi, '')
      .replace(/<\/?body[^>]*>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
      .trim();
    
    // Add the main title if not present
    if (!generatedContent.includes('<h1>')) {
      generatedContent = `<h1>Emergency Operating Procedure (EOP)</h1>\n${generatedContent}`;
    }
    
    // Build complete HTML
    const completeHtml = HTML_TEMPLATE.replace('{{CONTENT}}', generatedContent);
    
    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    const safeManufacturer = formData.manufacturer.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
    const safeModel = formData.modelNumber.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
    const filename = `EOP_${safeManufacturer}_${safeModel}_${date}_${timestamp}.html`;

    // Save to blob storage
    const blob = await put(`eops/${filename}`, completeHtml, {
      access: 'public',
      contentType: 'text/html'
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