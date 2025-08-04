import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Comprehensive MOP generation instructions adapted for HTML
const PROJECT_INSTRUCTIONS = `You are creating Methods of Procedure (MOPs) for data center technicians. Generate COMPLETE, DETAILED MOPs in HTML format - no placeholders.

CRITICAL HTML GENERATION REQUIREMENTS:
1. Your response MUST be a complete HTML document
2. MUST start with <!DOCTYPE html>
3. MUST end with </html>
4. Do NOT include ANY text before <!DOCTYPE html> or after </html>
5. Do NOT include an EQUIPMENT DETAILS section before Section 01
6. Do NOT say "content too large" or provide partial responses
7. Generate ALL 11 sections completely with proper HTML formatting
8. FOLLOW THE EXACT HTML TEMPLATE PROVIDED - DO NOT CHANGE THE FORMAT

RISK LEVEL DETERMINATION RULES (ONLY CHANGE THIS PART):
Analyze the equipment and work to determine the correct risk level (1-4):

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

HTML STRUCTURE AND STYLING (USE EXACTLY THIS):
<!DOCTYPE html>
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
        <h1>Method of Procedure (MOP)</h1>

[GENERATE THE EXACT HTML FORMAT BELOW WITH NO CHANGES TO STRUCTURE]

<h2>Section 01: MOP Schedule Information</h2>
<table class="info-table">
    <tr>
        <td>MOP Title:</td>
        <td>[MANUFACTURER] [EQUIPMENT TYPE] - [FREQUENCY] PREVENTIVE MAINTENANCE</td>
    </tr>
    <tr>
        <td>MOP Information:</td>
        <td>[Be SUCCINCT - One sentence like "This is an annual maintenance on the [manufacturer] [equipment type]."]</td>
    </tr>
    <tr>
        <td>MOP Creation Date:</td>
        <td>[Current date MM/DD/YYYY]</td>
    </tr>
    <tr>
        <td>MOP Revision Date:</td>
        <td><input type="text" value="[SAME AS CREATION DATE]" style="width:150px" /></td>
    </tr>
    <tr>
        <td>Document Number:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Assign per facility process" /></td>
    </tr>
    <tr>
        <td>Revision Number:</td>
        <td><input type="text" value="V1" style="width:100px" /></td>
    </tr>
    <tr>
        <td>Author CET Level:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Assign per facility process" /></td>
    </tr>
</table>

<div class="section-separator"></div>

<h2>Section 02: Site Information</h2>
<table class="info-table">
    <tr>
        <td>Data Center Location:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Enter facility name and location" /></td>
    </tr>
    <tr>
        <td>Service Ticket/Project Number:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Assign per facility process" /></td>
    </tr>
    <tr>
        <td>Level of Risk:</td>
        <td>[CRITICAL: Must be "Level [1-4] ([Low/Medium/High/Critical]) - [Specific justification based on systems affected]"]</td>
    </tr>
    <tr>
        <td>CET Level Required:</td>
        <td>[Match risk level: CET X ([Role]) - [Brief rationale]]</td>
    </tr>
</table>

<div class="section-separator"></div>

<h2>Section 03: MOP Overview</h2>
<table class="info-table">
    <tr>
        <td>MOP Description:</td>
        <td>[Detailed work description]</td>
    </tr>
    <tr>
        <td>Work Area:</td>
        <td>[Location]</td>
    </tr>
    <tr>
        <td>Manufacturer:</td>
        <td>[Manufacturer]</td>
    </tr>
    <tr>
        <td>Equipment ID:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Record on-site" /></td>
    </tr>
    <tr>
        <td>Model #:</td>
        <td>[Model number]</td>
    </tr>
    <tr>
        <td>Serial #:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Record from nameplate" /></td>
    </tr>
    <tr>
        <td>Min. # of Facilities Personnel:</td>
        <td>[Number based on research]</td>
    </tr>
    <tr>
        <td>Work Performed By:</td>
        <td colspan="3">
            <input type="checkbox" id="self-delivered" name="work-type"> 
            <label for="self-delivered">Self-Delivered</label>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="checkbox" id="subcontractor" name="work-type"> 
            <label for="subcontractor">Subcontractor</label>
        </td>
    </tr>
    <tr>
        <td>If Subcontractor - Company Name:</td>
        <td><input type="text" class="field-box" /></td>
    </tr>
    <tr>
        <td>If Subcontractor - Personnel Name:</td>
        <td><input type="text" class="field-box" /></td>
    </tr>
    <tr>
        <td>If Subcontractor - Contact Details:</td>
        <td><input type="text" class="field-box" /></td>
    </tr>
    <tr>
        <td>Qualifications Required:</td>
        <td>[Specific certifications]</td>
    </tr>
    <tr>
        <td>Tools Required:</td>
        <td>[Comprehensive tool list]</td>
    </tr>
    <tr>
        <td>Advance notifications required:</td>
        <td>Data Center Operations Manager, Site Security, NOC/BMS Operator</td>
    </tr>
    <tr>
        <td>Post notifications required:</td>
        <td>Data Center Operations Manager, Site Security, NOC/BMS Operator</td>
    </tr>
</table>

<div class="section-separator"></div>

<h2>Section 04: Effect of MOP on Critical Facility</h2>
<table>
    <thead>
        <tr>
            <th>Facility Equipment or System</th>
            <th width="60">Yes</th>
            <th width="60">No</th>
            <th width="60">N/A</th>
            <th>Details</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Electrical Utility Equipment</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Emergency Generator System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Critical Cooling System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Ventilation System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Mechanical System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Uninterruptible Power Supply (UPS)</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Critical Power Distribution System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Emergency Power Off (EPO)</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Fire Detection Systems</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Fire Suppression System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Monitoring System</td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td class="checkbox"></td>
            <td>Monitoring System is ALWAYS affected for data center equipment maintenance</td>
        </tr>
        <tr>
            <td>Control System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Security System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>General Power and Lighting System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Lockout/Tagout Required?</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Work to be performed "hot"?</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Radio interference potential?</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Water/Leak Detection System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Building Automation System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
        <tr>
            <td>Transfer Switch System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Details if Yes]</td>
        </tr>
    </tbody>
</table>

<div class="section-separator"></div>

<h2>Section 05: MOP Supporting Documentation</h2>
<p><strong>MOP Supporting Documentation</strong></p>
<ul>
    <li><a href="#" target="_blank">[Manufacturer model-specific operation/maintenance manual]</a></li>
    <li><a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147" target="_blank">OSHA 29 CFR 1910.147 - The Control of Hazardous Energy (Lockout/Tagout)</a></li>
    <li><a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910SubpartI" target="_blank">OSHA 29 CFR 1910 Subpart I - Personal Protective Equipment</a></li>
    <li><a href="#" target="_blank">[Equipment-specific NFPA standards]</a></li>
    <li><a href="#" target="_blank">[Safety Data Sheets for all chemicals]</a></li>
</ul>

<div class="section-separator"></div>

<h2>Section 06: Safety Requirements</h2>
<p><strong>Pre Work Conditions / Safety Requirements</strong></p>

<h3>KEY HAZARDS IDENTIFIED</h3>
<table>
    <thead>
        <tr>
            <th>Hazard Type</th>
            <th>Specific Hazards</th>
            <th>Safety Controls Required</th>
        </tr>
    </thead>
    <tbody>
        [GENERATE 5-7 EQUIPMENT-SPECIFIC HAZARDS WITH CONTROLS]
    </tbody>
</table>

<h3>REQUIRED PERSONAL PROTECTIVE EQUIPMENT (PPE)</h3>
<table>
    <thead>
        <tr>
            <th>PPE Category</th>
            <th>Specification</th>
            <th>When Required</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Eye Protection</strong></td>
            <td>Safety glasses with side shields, ANSI Z87.1</td>
            <td>At all times during maintenance work</td>
        </tr>
        [ADD MORE PPE ROWS BASED ON EQUIPMENT]
    </tbody>
</table>

<h3>SAFETY PROCEDURES</h3>
<table>
    <thead>
        <tr>
            <th>Procedure</th>
            <th>Requirements</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Pre-Work Safety Briefing</strong></td>
            <td>Conduct safety briefing with all personnel, review hazards</td>
        </tr>
        [ADD MORE SAFETY PROCEDURES]
    </tbody>
</table>

<h3>EMERGENCY CONTACTS</h3>
<table>
    <thead>
        <tr>
            <th>Emergency Type</th>
            <th>Contact</th>
            <th>Phone Number</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Medical Emergency</td>
            <td>Emergency Medical Services</td>
            <td>911</td>
        </tr>
        <tr>
            <td>Chemical Emergency</td>
            <td>Poison Control / CHEMTREC</td>
            <td>1-800-222-1222 / 1-800-424-9300</td>
        </tr>
        <tr>
            <td>Facility Emergency</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:200px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
        </tr>
    </tbody>
</table>

<div class="safety-warning">
    <strong>CRITICAL:</strong> Work shall NOT proceed until safety briefing is completed and all required PPE is verified available.
</div>

<div class="section-separator"></div>

<h2>Section 07: MOP Risks & Assumptions</h2>
<p><strong>MOP Risks and Assumptions</strong></p>

<p><strong>Detailed Risks and Mitigation Strategies:</strong></p>
<ul>
    [GENERATE AT LEAST 7 DETAILED RISKS WITH COMPREHENSIVE MITIGATION STRATEGIES]
</ul>

<p><strong>Key Assumptions:</strong></p>
<ul>
    [GENERATE AT LEAST 5 DETAILED ASSUMPTIONS]
</ul>

<div class="section-separator"></div>

<h2>Section 08: MOP Details</h2>
<table class="info-table">
    <tr>
        <td>Date Performed:</td>
        <td style="width: 150px;"><input type="text" class="field-box" /></td>
        <td>Time Begun:</td>
        <td style="width: 150px;"><input type="text" class="field-box" /></td>
        <td>Time Completed:</td>
        <td style="width: 150px;"><input type="text" class="field-box" /></td>
    </tr>
    <tr>
        <td colspan="2">Facilities personnel performing work:</td>
        <td colspan="4"><input type="text" class="field-box" style="width:100%" /></td>
    </tr>
    <tr>
        <td colspan="2">Contractor/Vendor personnel performing work:</td>
        <td colspan="4"><input type="text" class="contractor-input" placeholder="If subcontractor selected in Section 3, reference that company name" /></td>
    </tr>
</table>

[IF EQUIPMENT HAS MAINTENANCE LOG REQUIREMENTS, ADD DATA RECORDING TABLE HERE]

<h3>Detailed Procedure Steps</h3>
<table>
    <thead>
        <tr>
            <th width="60">Step</th>
            <th>Detailed Procedure</th>
            <th width="80">Initials</th>
            <th width="80">Time</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center;">1</td>
            <td>Notify Data Center Operations Manager, Site Security, and NOC/BMS Operator that procedure is about to begin</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        [GENERATE 30-40 DETAILED STEPS WITH PROPER SEQUENCE]
    </tbody>
</table>

<div class="section-separator"></div>

<h2>Section 09: Back-out Procedures</h2>
<p><strong>CRITICAL BACK-OUT PROCEDURES</strong></p>
<p>If at any point during the maintenance procedure a critical issue is discovered that could affect data center operations, follow these detailed back-out procedures:</p>
<table>
    <thead>
        <tr>
            <th width="60">Step</th>
            <th>Back-out Procedures</th>
            <th width="80">Initials</th>
            <th width="80">Time</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center;">1</td>
            <td><strong>Immediate Actions:</strong> Stop all work immediately and secure the area</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        [GENERATE AT LEAST 10 BACK-OUT STEPS]
    </tbody>
</table>

<div class="section-separator"></div>

<h2>Section 10: MOP Approval</h2>
<table>
    <thead>
        <tr>
            <th>Review Stage</th>
            <th>Reviewer's Name</th>
            <th>Reviewer's Title</th>
            <th>Date</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Tested for clarity:</strong></td>
            <td><input type="text" style="width:100%" /></td>
            <td><input type="text" style="width:100%" /></td>
            <td><input type="text" style="width:100px" /></td>
        </tr>
        <tr>
            <td><strong>Technical review:</strong></td>
            <td><input type="text" style="width:100%" /></td>
            <td><input type="text" style="width:100%" /></td>
            <td><input type="text" style="width:100px" /></td>
        </tr>
        <tr>
            <td><strong>Chief Engineer approval:</strong></td>
            <td><input type="text" style="width:100%" /></td>
            <td><input type="text" style="width:100%" /></td>
            <td><input type="text" style="width:100px" /></td>
        </tr>
        <tr>
            <td><strong>Customer approval:</strong></td>
            <td><input type="text" style="width:100%" /></td>
            <td><input type="text" style="width:100%" /></td>
            <td><input type="text" style="width:100px" /></td>
        </tr>
    </tbody>
</table>

<div class="section-separator"></div>

<h2>Section 11: MOP Comments</h2>
<p><strong>MOP Comments</strong></p>
<ul>
    <li>[Relevant equipment-specific comments]</li>
    <li>[Maintenance frequency recommendations]</li>
    <li>[Special considerations for this equipment]</li>
    <li>[Reference to manufacturer bulletins or updates]</li>
</ul>

</div>
</body>
</html>

CRITICAL: YOU MUST USE THIS EXACT HTML TEMPLATE. DO NOT CHANGE THE STYLING, STRUCTURE, OR FORMAT.`;

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

    // Create comprehensive prompt
    const prompt = `${PROJECT_INSTRUCTIONS}

EQUIPMENT DETAILS:
- Manufacturer: ${manufacturer}
- Model Number: ${modelNumber}
- System Type: ${system}
- Category: ${category}
- Work Description: ${description}
- Location: ${location || 'Data Center'}
- Frequency: ${frequency}

REMEMBER: 
- Use the EXACT HTML template provided above
- Do NOT change the styling or structure
- ONLY determine the correct risk level based on the rules
- Generate complete HTML - do not truncate
- Research actual procedures for ${manufacturer} ${modelNumber}`;

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