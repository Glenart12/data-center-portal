import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Comprehensive MOP generation instructions adapted for HTML
const PROJECT_INSTRUCTIONS = `You are creating Methods of Procedure (MOPs) for data center technicians. Generate COMPLETE, DETAILED MOPs in HTML format - no placeholders.

🔍 RESEARCH REQUIREMENT - CRITICAL
MANDATORY: Always research unknown information before generating MOPs

CRITICAL HTML GENERATION REQUIREMENTS:
1. Your response MUST be a complete HTML document
2. MUST start with <!DOCTYPE html>
3. MUST end with </html>
4. Do NOT include ANY text before <!DOCTYPE html> or after </html>
5. Do NOT say "content too large" or provide partial responses
6. Generate ALL 11 sections completely with proper HTML formatting

HTML STRUCTURE AND STYLING:
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
        .update-needed { 
            color: red; 
            font-weight: bold; 
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
        .field-box {
            border: 1px solid #999;
            padding: 5px;
            min-width: 150px;
            display: inline-block;
            background-color: #f9f9f9;
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
        .data-recording-table {
            background-color: #f5f5f5;
            margin: 10px 0;
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
`;

const HTML_GENERATION_PROMPT = `
GENERATE THE COMPLETE HTML DOCUMENT FOLLOWING THIS EXACT STRUCTURE:

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
        <td>[SAME AS CREATION DATE for new documents]</td>
    </tr>
    <tr>
        <td>Document Number:</td>
        <td><span class="update-needed">UPDATE NEEDED - Assign per facility process</span></td>
    </tr>
    <tr>
        <td>Revision Number:</td>
        <td>V1</td>
    </tr>
    <tr>
        <td>Author CET Level:</td>
        <td><span class="update-needed">UPDATE NEEDED - Assign per facility process</span></td>
    </tr>
</table>

<div class="section-separator"></div>

<h2>Section 02: Site Information</h2>
<table class="info-table">
    <tr>
        <td>Data Center Location:</td>
        <td><span class="update-needed">UPDATE NEEDED - Enter facility name and location</span></td>
    </tr>
    <tr>
        <td>Service Ticket/Project Number:</td>
        <td><span class="update-needed">UPDATE NEEDED - Assign per facility process</span></td>
    </tr>
    <tr>
        <td>Level of Risk:</td>
        <td>[Level 1-4] ([Risk Name]) - [Brief 1-sentence rationale]</td>
    </tr>
    <tr>
        <td>CET Level Required:</td>
        <td>CET [Level] ([Discipline] Technician) - [Brief 1-sentence rationale]</td>
    </tr>
</table>

<div class="section-separator"></div>

<h2>Section 03: MOP Overview</h2>
<table class="info-table">
    <tr>
        <td>MOP Description:</td>
        <td>[Detailed work description based on equipment and maintenance type]</td>
    </tr>
    <tr>
        <td>Work Area:</td>
        <td>[Location provided by user or general area]</td>
    </tr>
    <tr>
        <td>Manufacturer:</td>
        <td>[Exact manufacturer name]</td>
    </tr>
    <tr>
        <td>Equipment ID:</td>
        <td><span class="update-needed">UPDATE NEEDED - Record on-site</span></td>
    </tr>
    <tr>
        <td>Model #:</td>
        <td>[Exact model number]</td>
    </tr>
    <tr>
        <td>Serial #:</td>
        <td><span class="update-needed">UPDATE NEEDED - Record from nameplate</span></td>
    </tr>
    <tr>
        <td>Min. # of Facilities Personnel:</td>
        <td>[DETERMINE BY RESEARCH: "How many engineers does it take to perform [maintenance type] on [manufacturer] [model]?"]</td>
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
        <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
    </tr>
    <tr>
        <td>If Subcontractor - Personnel Name:</td>
        <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
    </tr>
    <tr>
        <td>If Subcontractor - Contact Details:</td>
        <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
    </tr>
    <tr>
        <td>Qualifications Required:</td>
        <td>[Specific certifications and training based on equipment type]</td>
    </tr>
    <tr>
        <td>Tools Required:</td>
        <td>[Comprehensive tool list based on equipment type]</td>
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
            <td>[Impact details if Yes]</td>
        </tr>
        <tr>
            <td>Emergency Generator System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Impact details if Yes]</td>
        </tr>
        <tr>
            <td>Critical Cooling System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Impact details if Yes]</td>
        </tr>
        <tr>
            <td>Ventilation System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Impact details if Yes]</td>
        </tr>
        <tr>
            <td>Mechanical System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Impact details if Yes]</td>
        </tr>
        <tr>
            <td>Uninterruptible Power Supply (UPS)</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Impact details if Yes]</td>
        </tr>
        <tr>
            <td>Critical Power Distribution System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Impact details if Yes]</td>
        </tr>
        <tr>
            <td>Emergency Power Off (EPO)</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Impact details if Yes]</td>
        </tr>
        <tr>
            <td>Fire Detection Systems</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Impact details if Yes]</td>
        </tr>
        <tr>
            <td>Fire Suppression System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Impact details if Yes]</td>
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
            <td>[Impact details if Yes]</td>
        </tr>
        <tr>
            <td>Security System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Impact details if Yes]</td>
        </tr>
        <tr>
            <td>General Power and Lighting System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Impact details if Yes]</td>
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
            <td>[Impact details if Yes]</td>
        </tr>
        <tr>
            <td>Building Automation System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Impact details if Yes]</td>
        </tr>
        <tr>
            <td>Transfer Switch System</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td class="checkbox">[✓ or blank]</td>
            <td>[Impact details if Yes]</td>
        </tr>
    </tbody>
</table>

<div class="section-separator"></div>

<h2>Section 05: MOP Supporting Documentation</h2>
<p><strong>MOP Supporting Documentation</strong></p>
<ul>
    <li><a href="[URL]" target="_blank">[Manufacturer model-specific operation/maintenance manual]</a></li>
    <li><a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147" target="_blank">OSHA 29 CFR 1910.147 - The Control of Hazardous Energy (Lockout/Tagout)</a></li>
    <li><a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910SubpartI" target="_blank">OSHA 29 CFR 1910 Subpart I - Personal Protective Equipment</a></li>
    <li><a href="[URL]" target="_blank">[Equipment-specific NFPA standards]</a></li>
    <li><a href="[URL]" target="_blank">[Safety Data Sheets for all chemicals]</a></li>
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
        <tr>
            <td><strong>Chemical Hazards</strong></td>
            <td>[Chemical names and hazards from SDS]</td>
            <td>[PPE and handling requirements]</td>
        </tr>
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
            <td><span class="update-needed">UPDATE NEEDED</span></td>
            <td><span class="update-needed">UPDATE NEEDED</span></td>
        </tr>
    </tbody>
</table>

<div class="safety-warning">
    <strong>CRITICAL:</strong> Work shall NOT proceed until safety briefing is completed and all required PPE is verified available.
</div>

<div class="section-separator"></div>

<h2>Section 07: MOP Risks & Assumptions</h2>
<p><strong>MOP Risks and Assumptions</strong></p>
<ul>
    <li>[Equipment-specific risks]</li>
    <li>[Chemical-specific risks based on SDS]</li>
    <li>[Operational assumptions]</li>
    <li>[Mitigation strategies]</li>
</ul>

<div class="section-separator"></div>

<h2>Section 08: MOP Details</h2>
<table class="info-table">
    <tr>
        <td>Date Performed:</td>
        <td style="width: 150px;"><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
        <td>Time Begun:</td>
        <td style="width: 150px;"><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
        <td>Time Completed:</td>
        <td style="width: 150px;"><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
    </tr>
    <tr>
        <td colspan="2">Facilities personnel performing work:</td>
        <td colspan="4"><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
    </tr>
    <tr>
        <td colspan="2">Contractor/Vendor personnel performing work:</td>
        <td colspan="4">[If subcontractor selected in Section 3, auto-populate with company name]</td>
    </tr>
</table>

<h3>Pre-Startup Checks & Restoration</h3>
<p><strong>Equipment Maintenance Log Sheet</strong></p>
[RESEARCH AND INCLUDE: Find the official Maintenance Log Sheet for [manufacturer] [model] and include specific criteria and readings that need to be recorded, such as:]

<table class="data-recording-table">
    <thead>
        <tr>
            <th>Circuit/Unit</th>
            <th>Oil Level</th>
            <th>Oil Pressure (PSI)</th>
            <th>Suction Temp (°F)</th>
            <th>Discharge Temp (°F)</th>
            <th>Suction Pressure (PSI)</th>
            <th>Discharge Pressure (PSI)</th>
            <th>Superheat (°F)</th>
            <th>Subcooling (°F)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Circuit 1</td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
        </tr>
        <tr>
            <td>Circuit 2</td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
            <td><span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>
        </tr>
    </tbody>
</table>

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
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td style="text-align: center;"><strong>2.0</strong></td>
            <td><strong>Pre-Maintenance Safety and Documentation</strong></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td style="text-align: center;">2.1</td>
            <td class="safety-critical">MANDATORY: Review all Safety Data Sheets (SDS) for chemicals</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td style="text-align: center;">2.2</td>
            <td>Check for active alarms on equipment control panel:
                <br>□ Yes (Detail: <span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>)
                <br>□ No
            </td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td style="text-align: center;">2.3</td>
            <td>Check for historical fault codes:
                <br>□ Yes (Detail: <span class="field-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>)
                <br>□ No
            </td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td style="text-align: center;">3.0</td>
            <td>
                <strong>Perform controlled shutdown of [equipment]</strong>
                <div class="sub-procedure">
                    [GENERATE DETAILED SUB-PROCEDURE: Create step-by-step procedure for shutting down [manufacturer] [model]]
                    <br>a) [Step 1 of shutdown procedure]
                    <br>b) [Step 2 of shutdown procedure]
                    <br>c) [Step 3 of shutdown procedure]
                    <br>d) [Continue with all necessary steps]
                </div>
            </td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td style="text-align: center;">4.0</td>
            <td>When torquing electrical connections, use manufacturer specified torque settings:
                <br>[INCLUDE SPECIFIC TORQUE VALUES: Research and list torque specifications for [manufacturer] [model]]
                <br>• Main power connections: ___ ft-lbs
                <br>• Control wiring: ___ in-lbs
                <br>• Compressor terminals: ___ ft-lbs
            </td>
            <td></td>
            <td></td>
        </tr>
        [CONTINUE WITH LOGICAL SEQUENCE: 
        - Complete all shutdown and LOTO procedures first
        - Then perform all maintenance tasks that require equipment to be off
        - Move running checks (oil levels, refrigerant checks, pressure readings) to AFTER startup
        - Include specific technical specifications where mentioned
        - Break down complex procedures into detailed sub-steps
        - Add data recording fields for all measurements]
    </tbody>
</table>

<div class="section-separator"></div>

<h2>Section 09: Back-out Procedures</h2>
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
            <td>[Equipment-specific backout procedure]</td>
            <td></td>
            <td></td>
        </tr>
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
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td><strong>Technical review:</strong></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td><strong>Chief Engineer approval:</strong></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td><strong>Customer approval:</strong></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
</table>

<div class="section-separator"></div>

<h2>Section 11: MOP Comments</h2>
<p><strong>MOP Comments</strong></p>
<ul>
    <li>[Relevant equipment-specific comments]</li>
</ul>

</div>
</body>
</html>`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { formData } = body;
    const { manufacturer, modelNumber, serialNumber, location, system, category, description } = formData;
    
    console.log('MOP generation started for:', manufacturer, modelNumber);
    
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

${HTML_GENERATION_PROMPT}

CRITICAL REQUIREMENTS FOR THIS MOP:
1. Research the specific model ${modelNumber} for accurate technical specifications
2. Section 1: Make MOP Information SUCCINCT (one sentence), set Revision Number to "V1", set Revision Date same as Creation Date
3. Section 3: Research "How many engineers does it take to perform ${frequency} maintenance on ${manufacturer} ${modelNumber}?"
4. Section 3: Include subcontractor checkbox options with fields for company, personnel, contact details
5. Section 3: Set notifications to ALWAYS include: Data Center Operations Manager, Site Security, NOC/BMS Operator
6. Section 4: Include ALL 20 systems listed (not just 6)
7. Section 5: Add actual hyperlinks to all referenced documents
8. Section 7: Research and include the official Maintenance Log Sheet for ${manufacturer} ${modelNumber}
9. Section 8: Break down ALL complex procedures into detailed sub-steps
10. Section 8: Include specific torque values and technical specifications
11. Section 8: Add data recording fields/tables for all measurements
12. Section 8: Fix procedural logic - running checks must be AFTER startup
13. Section 10: Remove "Contractor Review" row entirely
14. Monitoring System is ALWAYS affected (Yes) for data center equipment

REMEMBER: 
- Start with <!DOCTYPE html>
- End with </html>
- Generate complete HTML - do not truncate or say "content too large"
- Include ALL 11 sections with proper tables and formatting
- Research actual procedures for ${manufacturer} ${modelNumber}`;

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use the model - note: using regular flash, not 8b for better quality
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 50000,
      }
    });
    
    // Try to generate with retries
    let mopContent;
    let lastError;
    const maxAttempts = 5;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt} of ${maxAttempts}...`);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        mopContent = response.text();
        
        // Clean up the response - remove any markdown code blocks
        mopContent = mopContent.replace(/```html\n?/g, '').replace(/```\n?/g, '');
        
        // Remove any text before <!DOCTYPE html>
        const htmlStart = mopContent.indexOf('<!DOCTYPE html>');
        if (htmlStart > 0) {
          mopContent = mopContent.substring(htmlStart);
        }
        
        // Remove any text after </html>
        const htmlEnd = mopContent.lastIndexOf('</html>');
        if (htmlEnd > -1) {
          mopContent = mopContent.substring(0, htmlEnd + 7);
        }
        
        // Verify it's actual HTML
        if (!mopContent.includes('<!DOCTYPE html>') || !mopContent.includes('</html>')) {
          throw new Error('Generated content is not valid HTML');
        }
        
        console.log('Successfully generated MOP, length:', mopContent.length);
        break; // Success! Exit the loop
        
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);
        
        // If it's a rate limit or overload error, wait and retry
        if (error.message?.includes('503') || 
            error.message?.includes('overloaded') || 
            error.message?.includes('429') ||
            error.message?.includes('Resource has been exhausted')) {
          
          if (attempt < maxAttempts) {
            // Exponential backoff: 3s, 6s, 9s, 12s
            const waitTime = attempt * 3000;
            console.log(`Waiting ${waitTime}ms before retry...`);
            await wait(waitTime);
            continue;
          }
        }
        
        // For other errors, don't retry
        break;
      }
    }
    
    if (!mopContent) {
      const errorMessage = lastError?.message || 'Failed to generate after all attempts';
      
      // Better error messages for users
      if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
        return NextResponse.json({ 
          error: 'AI service is temporarily busy',
          details: 'The AI service is experiencing high demand. Please wait 2-3 minutes and try again.',
          userMessage: 'The AI is busy right now. Please try again in a few minutes.'
        }, { status: 503 });
      }
      
      if (errorMessage.includes('429') || errorMessage.includes('exhausted')) {
        return NextResponse.json({ 
          error: 'Rate limit reached',
          details: 'You\'ve made too many requests. Please wait a minute before trying again.',
          userMessage: 'Please wait 60 seconds before generating another MOP.'
        }, { status: 429 });
      }
      
      throw lastError || new Error(errorMessage);
    }

    // Add a small delay before saving to prevent race conditions
    await wait(500);

    // Save to blob with retry
    let blob;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        blob = await put(`mops/${filename}`, mopContent, {
          access: 'public',
          contentType: 'text/html'
        });
        console.log('Successfully saved to blob storage');
        break;
      } catch (blobError) {
        console.error(`Blob storage attempt ${attempt} failed:`, blobError.message);
        if (attempt === 3) {
          // Return the content even if storage fails
          return NextResponse.json({ 
            success: false,
            error: 'Generated but could not save',
            generatedContent: mopContent,
            filename: filename,
            userMessage: 'MOP was generated but could not be saved. Copy the content manually.'
          }, { status: 200 });
        }
        await wait(1000);
      }
    }

    return NextResponse.json({ 
      success: true,
      filename: filename,
      url: blob.url,
      message: 'MOP generated successfully'
    });

  } catch (error) {
    console.error('MOP generation error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to generate MOP',
      details: error.message,
      userMessage: 'Unable to generate MOP. Please check your inputs and try again.'
    }, { status: 500 });
  }
}