import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROJECT_INSTRUCTIONS = `Generate a complete Emergency Operating Procedure (EOP) for data center equipment failures. Create a COMPLETE HTML document with ALL 8 sections - no placeholders or summaries.

IMPORTANT: This EOP must be INTERACTIVE with editable input fields. Include HTML input elements throughout.

The EOP must follow this EXACT structure with INTERACTIVE ELEMENTS:

SECTION 1: EOP Identification & Control
- EOP Title, Identifier, Equipment details
- Version: <input type="text" value="1.0" style="width:80px" />
- Date fields: <input type="text" value="[current_date]" style="width:150px" />
- Author: <input type="text" placeholder="Enter Author Name" style="width:250px" />
- Approver: <input type="text" placeholder="Enter Approver Name" style="width:250px" />

SECTION 2: Purpose & Scope
- Clear statement of emergency response goals
- Who this procedure applies to

SECTION 3: IMMEDIATE EMERGENCY ACTIONS
- Create a table with columns: Step, Action, Initials, Time
- Each action row should have:
  - Initials column: <input type="text" class="small-input" style="width:60px" />
  - Time column: <input type="text" class="small-input" style="width:60px" />
- 4-5 numbered steps for immediate response
- Use CAPITAL LETTERS for critical actions like PRESS, NOTIFY, PROCEED

SECTION 4: Trigger Conditions & Specific Scenarios
- Create 4 scenarios based on the emergency type provided
- Each scenario with trigger conditions and specific actions

SECTION 5: Communication & Escalation Protocol
- Table with contact levels 0-3 plus emergency services
- Phone number fields: <input type="text" placeholder="Enter phone" style="width:150px" />
- Contact name fields where appropriate: <input type="text" placeholder="Enter contact name" style="width:200px" />

Include a comprehensive Emergency Contacts subsection with the following categories in a table format:

Emergency Contacts Table with columns: Service Type, Contact Name/Organization, Phone Number, Notes/Address

Include these essential emergency contacts (use editable input fields for phone numbers):
- Police Emergency: 911
- Fire/EMS Emergency: 911  
- Police Non-Emergency: <input type="text" value="(630) 554-3426" style="width:150px" />
- Fire Non-Emergency (Oswego FPD): <input type="text" value="(630) 554-2110" style="width:150px" />
- Poison Control: <input type="text" value="1-800-222-1222" style="width:150px" />
- Electric Emergency (ComEd): <input type="text" value="(800) 334-7661" style="width:150px" />
- Natural Gas Emergency (Nicor): <input type="text" value="(888) 642-6748" style="width:150px" />
- Water/Sewer Emergency (Village): <input type="text" value="(630) 554-2282" style="width:150px" />
- EPA Emergency Hotline: <input type="text" value="(800) 424-8802" style="width:150px" />
- CHEMTREC (Chemical Emergency): <input type="text" value="1-800-424-9300" style="width:150px" />
- Building Department (AHJ): <input type="text" value="(630) 554-2310" style="width:150px" />
- JULIE (Dig Alert): <input type="text" value="(800) 892-0123" style="width:150px" />

Add this important note at the bottom of the Emergency Contacts section:
"⚠️ IMPORTANT: Verify all emergency contact numbers for your specific facility location. Update phone numbers as needed."

SECTION 6: Recovery & Return to Service
- Fault verification, system reset, return to service steps

SECTION 7: Supporting Information
- Equipment locations, PPE requirements, related documents

SECTION 8: EOP Approval & Review
- Approval matrix table with editable fields:
  - Name column: <input type="text" placeholder="Enter name" style="width:200px" />
  - Signature column: <input type="text" placeholder="Signature" style="width:200px" />
  - Date column: <input type="text" placeholder="MM/DD/YYYY" style="width:120px" />

CRITICAL FORMATTING REQUIREMENTS:
- Use red (color: #dc3545) for all emergency warnings and critical actions
- Replace ANY placeholder text like "[Signature Placeholder]" with proper input fields
- Use .emergency-action class for emergency action boxes
- Use .emergency-warning class for warning banners
- Use .critical-text class for critical text that should be red and uppercase
- Make tables professional with proper styling

Format as complete HTML content (body content only, not full HTML document).`;

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
    
    // Get current date for input fields
    const currentDate = new Date().toLocaleDateString('en-US');
    
    // Prepare the prompt for Gemini
    const prompt = `${PROJECT_INSTRUCTIONS.replace('[current_date]', currentDate)}

Emergency Details:
- Manufacturer: ${formData.manufacturer}
- Model Number: ${formData.modelNumber}
- Serial Number: ${formData.serialNumber || 'N/A'}
- Location: ${formData.location || 'N/A'}
- System: ${formData.system}
- Emergency Type: ${formData.emergencyType}
- Emergency Description: ${formData.description}

Generate a complete HTML document for the body content only (everything that goes inside the container div). 
Include ALL 8 sections with complete, detailed content with INTERACTIVE INPUT FIELDS as specified above.
For Section 4, create 4 specific scenarios based on the emergency type "${formData.emergencyType}".
Make sure all critical actions use the .critical-text class and emergency warnings use the .emergency-action or .emergency-warning classes.
IMPORTANT: Include interactive input fields throughout the document as specified in the instructions above.`;

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