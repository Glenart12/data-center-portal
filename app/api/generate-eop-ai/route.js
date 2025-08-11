import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PROJECT_INSTRUCTIONS = `You are creating Emergency Operating Procedures (EOPs) for data center technicians. Generate COMPLETE, DETAILED EOPs with NO placeholders or summaries.

CRITICAL: This is for POWER FAILURE emergency response. Adapt all procedures based on the specific equipment type provided.

CRITICAL HTML GENERATION RULES:
- DO NOT generate DOCTYPE, html, head, body, or container div tags
- Generate ONLY the content that goes INSIDE the existing container div
- Start with the main H1 title, then proceed with sections
- Use H2 for all section headers (not H1)
- Use H3 for subsection headers
- The HTML template already provides the document structure

IMPORTANT: This EOP must be INTERACTIVE with editable input fields. Include HTML input elements throughout.

The EOP must follow this EXACT structure with INTERACTIVE ELEMENTS:

START WITH:
<h1>Emergency Operating Procedure (EOP)</h1>

<h2>Section 01: EOP Identification & Control</h2>
- EOP Title, Identifier
- Equipment Details as a properly formatted list:
  • Manufacturer: {actual manufacturer from form data}
  • Model Number: {actual model from form data}
  • Serial Number: {actual serial or "N/A" if not provided}
  • Location: {actual location from form data}
  • System: {actual system from form data}
  • Component Type: {actual component from form data}
- Version: <input type="text" value="1.0" style="width:80px" />
- Date fields: <input type="text" value="[current_date]" style="width:150px" />
- Author: <input type="text" placeholder="Enter Author Name" style="width:250px" />
- Approver: <input type="text" placeholder="Enter Approver Name" style="width:250px" />

<h2>Section 02: Purpose & Scope</h2>
- Clear statement of emergency response goals for power failure situations
- Who this procedure applies to
- When to activate this EOP

<h2>Section 03: Immediate Emergency Actions - Power Failure Diagnostics</h2>

First, research and identify the specific equipment type from the manufacturer and model provided. Determine:
- Equipment category (chiller, UPS, generator, PDU, CRAC unit, etc.)
- Voltage requirements (single-phase, 3-phase, DC voltage, etc.)
- Control voltage specifications
- Critical power components for this equipment type

Create a comprehensive diagnostic table with these EXACT columns:
<table>
<tr>
  <th>Step</th>
  <th>Action</th>
  <th>Voltage Verification</th>
  <th>Data Reading Field</th>
  <th>Pass/Fail</th>
</tr>
</table>

The diagnostic steps MUST be appropriate for the equipment type. Include:
- Main power verification steps specific to this equipment
- Control circuit checks relevant to this equipment
- Equipment-specific components (VFD for motors, rectifiers for UPS, transfer switches for generators, etc.)
- Protection device checks appropriate for this equipment
- Safety interlocks and emergency stops if applicable

Each row should have:
- Step number
- Detailed action description
- Expected voltage based on THIS SPECIFIC equipment's specs (e.g., "480VAC 3-phase" for industrial chillers)
- Data Reading Field: <input type="text" placeholder="Enter reading" style="width:100px" />
- Pass/Fail: <input type="checkbox" />

After the table, include:
<div class="emergency-action">
<h3>POWER DIAGNOSIS DETERMINATION:</h3>
<ul>
<li>IF power is present at main input but equipment won't operate = INTERNAL POWER ISSUE (specify internal components for THIS equipment type)</li>
<li>IF NO power at main input = EXTERNAL POWER ISSUE (proceed to Section 04)</li>
</ul>
</div>

Include equipment-specific measurement requirements:
- Correct multimeter settings for this equipment's voltages
- PPE requirements based on voltage levels
- Lock-out/Tag-out specific to this equipment

<h2>Section 04: External Power Supply Scenarios</h2>

Generate 4 scenarios based on the SPECIFIC EQUIPMENT TYPE and its typical installation:

<h3>SCENARIO 1 - PRIMARY POWER SOURCE FAILURE</h3>
[Adapt based on equipment: utility for most equipment, upstream UPS for critical loads, generator for emergency systems, etc.]
<div style="background: #f8d7da; color: #721c24; border: 2px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; font-weight: bold;">
Trigger Conditions: (specific to how this equipment is typically powered)
</div>
Verification Checks: (specific to this equipment's power source)
<table>
Include verification steps with input fields for readings
</table>

<h3>SCENARIO 2 - DISTRIBUTION FAILURE</h3>
[Adapt based on equipment: MCC for motors, PDU for IT equipment, panelboard for HVAC, switchgear for large equipment, etc.]
<div style="background: #f8d7da; color: #721c24; border: 2px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; font-weight: bold;">
Trigger Conditions: (specific to this equipment's distribution type)
</div>
Verification Checks: (appropriate for the distribution equipment)
<table>
Include verification steps with input fields for readings
</table>

<h3>SCENARIO 3 - FEEDER/CIRCUIT FAILURE</h3>
[Adapt based on equipment: cable types, voltage levels, typical routing for this equipment]
<div style="background: #f8d7da; color: #721c24; border: 2px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; font-weight: bold;">
Trigger Conditions: (based on this equipment's typical circuit configuration)
</div>
Verification Checks: (appropriate tests for this voltage level and cable type)
<table>
Include verification steps with input fields for readings
</table>

<h3>SCENARIO 4 - LOCAL PROTECTION DEVICE FAILURE</h3>
[Adapt based on equipment: disconnect type, breaker size, fusing, etc.]
<div style="background: #f8d7da; color: #721c24; border: 2px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; font-weight: bold;">
Trigger Conditions: (specific to protection devices used with this equipment)
</div>
Verification Checks: (appropriate for this equipment's protection scheme)
<table>
Include verification steps with input fields for readings
</table>

For EACH scenario:
- Tailor all checks to the specific equipment type
- Include voltage levels appropriate for this equipment
- Reference correct upstream systems for this equipment type
- Include relevant safety considerations for the voltage/current levels
- List appropriate spare parts for this specific equipment
- Include escalation contacts relevant to this equipment type

IMPORTANT EQUIPMENT-SPECIFIC ADAPTATIONS:
- If equipment is a CHILLER: Focus on 3-phase power (typically 480V), VFDs, control transformers (24V or 120V control), compressor contactors
- If equipment is a UPS: Focus on input/output voltages, bypass sources, DC bus voltage, battery strings
- If equipment is a GENERATOR: Focus on starting batteries (12V or 24V DC), transfer switches, control power, field excitation
- If equipment is a PDU: Focus on input breakers, monitoring circuits, branch circuits, transformer taps
- If equipment is a CRAC/CRAH: Focus on fan motors, control power (24VAC typical), humidification power, reheat elements
- If equipment is SWITCHGEAR: Focus on bus voltage, protection relays, control power (125VDC typical), breaker charging motors
- Adapt accordingly for any other equipment type

<h2>Section 05: Communication & Escalation Protocol</h2>
- Table with contact levels 0-3 plus emergency services
- Phone number fields: <input type="text" placeholder="Enter phone" style="width:150px" />
- Contact name fields where appropriate: <input type="text" placeholder="Enter contact name" style="width:200px" />

<h3>Emergency Contacts</h3>
Include a comprehensive Emergency Contacts table with columns: Service Type, Contact Name/Organization, Phone Number, Notes/Address

Include these essential emergency contacts (use editable input fields for phone numbers):
- Police Emergency: 911
- Fire/EMS Emergency: 911  
- Electric Utility Emergency: <input type="text" placeholder="Enter utility emergency #" style="width:150px" />
- Equipment Manufacturer Support: <input type="text" placeholder="Enter manufacturer support #" style="width:150px" />
- Electrical Contractor: <input type="text" placeholder="Enter contractor #" style="width:150px" />
- Facilities Manager: <input type="text" placeholder="Enter facilities manager #" style="width:150px" />

Add this important note at the bottom of the Emergency Contacts section:
"⚠️ IMPORTANT: Verify all emergency contact numbers for your specific facility location. Update phone numbers as needed."

<h2>Section 06: Recovery & Return to Service</h2>
- Power restoration verification steps
- Equipment-specific restart procedures
- System functionality checks
- Return to normal operation confirmation

<h2>Section 07: Supporting Information</h2>
- Equipment locations
- Electrical panel locations
- Disconnect switch locations
- Spare parts inventory

<h3>PPE Requirements for Electrical Work</h3>
Create a professional table with columns: PPE Category | Specification | When Required
Include voltage-specific PPE requirements based on the equipment type

<h3>Related Documents</h3>
Make these clickable hyperlinks:
- <a href="#" style="color: #0070f3; text-decoration: underline;">Equipment Electrical Drawings</a> (Internal Document)
- <a href="#" style="color: #0070f3; text-decoration: underline;">Single Line Diagram</a> (Internal Document)
- <a href="#" style="color: #0070f3; text-decoration: underline;">Arc Flash Study</a> (Internal Document)
- <a href="https://www.osha.gov/electrical" target="_blank" style="color: #0070f3; text-decoration: underline;">OSHA Electrical Safety Standards</a>
- <a href="https://www.nfpa.org/codes-and-standards/nfpa-70e" target="_blank" style="color: #0070f3; text-decoration: underline;">NFPA 70E Electrical Safety</a>

<h2>Section 08: EOP Approval & Review</h2>
- Approval matrix table with editable fields:
  - Name column: <input type="text" placeholder="Enter name" style="width:200px" />
  - Signature column: <input type="text" placeholder="Signature" style="width:200px" />
  - Date column: <input type="text" placeholder="MM/DD/YYYY" style="width:120px" />

CRITICAL FORMATTING REQUIREMENTS:
- DO NOT generate DOCTYPE, html, head, body tags or container div
- Start with <h1>Emergency Operating Procedure (EOP)</h1>
- Use H2 for section headers: "Section 01:", "Section 02:", etc. (with zero-padded numbers)
- Use H3 for subsection headers
- Use red (color: #dc3545) for all emergency warnings and critical actions
- Replace ANY placeholder text with proper input fields
- Use CSS classes: .emergency-action, .emergency-warning, .critical-text
- Make tables professional with proper styling and borders
- Generate COMPLETE content with NO placeholders`;

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

Equipment-Specific Power Requirements to Consider:
${formData.component?.toLowerCase().includes('chiller') ? `
- Main Power: Typically 480VAC 3-phase for compressors
- Control Power: 120VAC or 24VAC for control circuits
- VFD Power: Check Variable Frequency Drive if equipped
- Motor Starter: Check magnetic contactors and overloads
` : ''}
${formData.component?.toLowerCase().includes('ups') ? `
- Input Power: Verify utility input voltage (typically 480VAC 3-phase)
- DC Bus: Check battery voltage (typically 480-540VDC)
- Output Power: Verify output to critical loads
- Bypass Power: Check static and maintenance bypass sources
` : ''}
${formData.component?.toLowerCase().includes('generator') ? `
- Starting Batteries: 12VDC or 24VDC system
- Control Power: Verify control circuit voltage
- Transfer Switch: Check ATS position and control power
- Field Excitation: Verify excitation voltage when running
` : ''}
${formData.component?.toLowerCase().includes('pdu') ? `
- Input Breaker: Verify main input voltage
- Transformer: Check transformer secondary voltages
- Branch Circuits: Verify individual branch circuit voltages
- Monitoring: Check monitoring circuit power
` : ''}
${formData.component?.toLowerCase().includes('crac') || formData.component?.toLowerCase().includes('crah') ? `
- Fan Motor Power: Typically 480VAC 3-phase
- Control Power: 24VAC control transformer
- Humidifier Power: Check humidification system power
- Reheat Elements: Verify electric reheat power if equipped
` : ''}

Emergency Details:
- Manufacturer: ${formData.manufacturer}
- Model Number: ${formData.modelNumber}
- Serial Number: ${formData.serialNumber || 'N/A'}
- Location: ${formData.location || 'N/A'}
- System: ${formData.system}
- Component/Equipment Type: ${formData.component}
- Emergency Type: ${formData.emergencyType}

Generate ONLY the content that goes inside the container div - no DOCTYPE, html, head, body, or container tags.
Start with <h1>Emergency Operating Procedure (EOP)</h1> then proceed with sections using H2 headers.
Include ALL 8 sections with complete, detailed content and INTERACTIVE INPUT FIELDS as specified above.

CRITICAL FOR SECTION 03:
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