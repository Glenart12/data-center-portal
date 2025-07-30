import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const PROJECT_INSTRUCTIONS = `You are creating Methods of Procedure (MOPs) for data center technicians. Generate COMPLETE, DETAILED MOPs in HTML format with professional styling.

CRITICAL HTML FORMATTING RULES:
1. Generate a complete HTML document starting with <!DOCTYPE html>
2. Use proper HTML tables for sections requiring tabular data
3. For fields that need updates, use: <span style="color: red; font-weight: bold;">UPDATE NEEDED - [instruction]</span>
4. No unicode characters - use standard HTML entities where needed
5. For checkmarks in tables, use "Yes", "X", or leave blank as specified
6. NEVER include model numbers in the MOP Title
7. Generate COMPLETE procedures - no "research needed" placeholders
8. Always determine Risk Level and CET Level based on the work

RISK LEVEL DETERMINATION:
- Level 4 (Critical Risk): Affects entire facility, guaranteed outage
- Level 3 (High Risk): Single point of failure, service impact likely
- Level 2 (Medium Risk): Redundant component, impact possible but not expected  
- Level 1 (Low Risk): Non-critical system, no service impact possible

CET LEVEL MAPPING:
- Risk Level 4 → CET 3 (Lead Technician) to execute, CET 4 (Chief Engineer) to approve
- Risk Level 3 → CET 2 (Technician) to execute, CET 3 (Lead Technician) to approve
- Risk Level 2 → CET 2 (Technician) to execute, CET 3 (Lead Technician) to approve
- Risk Level 1 → CET 1 (Junior Technician) to execute, CET 2 (Technician) to approve

GENERATE THIS EXACT HTML STRUCTURE:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MOP - [TITLE]</title>
    <style>
        body {
            font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
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
        }
        h2 {
            color: #0f3456;
            border-bottom: 2px solid #0f3456;
            padding-bottom: 10px;
            margin-top: 40px;
            margin-bottom: 20px;
        }
        h3 {
            color: #0f3456;
            margin-top: 20px;
            margin-bottom: 15px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background-color: white;
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
            width: 30%;
            background-color: #f0f0f0;
        }
        .check-table {
            text-align: center;
        }
        .check-table td {
            text-align: center;
        }
        .update-needed {
            color: red;
            font-weight: bold;
        }
        .section {
            margin-bottom: 30px;
        }
        .procedure-table td:first-child {
            text-align: center;
            font-weight: bold;
            width: 8%;
        }
        .approval-table input[type="text"], .approval-table input[type="date"] {
            width: 100%;
            border: none;
            border-bottom: 1px solid #ddd;
            padding: 5px;
        }
        @media print {
            body {
                background-color: white;
            }
            .container {
                box-shadow: none;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <h1>Method of Procedure (MOP)</h1>

    <section class="section">
        <h2>Section 01: MOP Schedule Information</h2>
        <table class="info-table">
            <tr>
                <td>MOP Title:</td>
                <td>[MANUFACTURER] [EQUIPMENT TYPE] - [FREQUENCY] PREVENTIVE MAINTENANCE</td>
            </tr>
            <tr>
                <td>MOP Information:</td>
                <td>[Frequency] preventive maintenance procedure for [manufacturer] [equipment type]</td>
            </tr>
            <tr>
                <td>MOP Creation Date:</td>
                <td>[Current date MM/DD/YYYY]</td>
            </tr>
            <tr>
                <td>MOP Revision Date:</td>
                <td><span class="update-needed">UPDATE NEEDED - Update upon revision</span></td>
            </tr>
            <tr>
                <td>Document Number:</td>
                <td><span class="update-needed">UPDATE NEEDED - Assign per facility process</span></td>
            </tr>
            <tr>
                <td>Revision Number:</td>
                <td><span class="update-needed">UPDATE NEEDED - Assign per facility process</span></td>
            </tr>
            <tr>
                <td>Author CET Level:</td>
                <td><span class="update-needed">UPDATE NEEDED - Assign per facility process</span></td>
            </tr>
        </table>
    </section>

    <section class="section">
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
                <td>Level [1-4] ([Risk Name]) - [One sentence explaining why this risk level applies]</td>
            </tr>
            <tr>
                <td>CET Level Required:</td>
                <td>CET [1-4] ([Title]) - [One sentence explaining why this CET level is required]</td>
            </tr>
        </table>
    </section>

    <section class="section">
        <h2>Section 03: MOP Overview</h2>
        <table class="info-table">
            <tr>
                <td>MOP Description:</td>
                <td>[Detailed description of the work to be performed]</td>
            </tr>
            <tr>
                <td>Work Area:</td>
                <td>[Location from user or UPDATE NEEDED]</td>
            </tr>
            <tr>
                <td>Manufacturer:</td>
                <td>[Manufacturer name]</td>
            </tr>
            <tr>
                <td>Equipment ID:</td>
                <td><span class="update-needed">UPDATE NEEDED - Record on-site</span></td>
            </tr>
            <tr>
                <td>Model #:</td>
                <td>[Model number]</td>
            </tr>
            <tr>
                <td>Serial #:</td>
                <td>[Serial from user or <span class="update-needed">UPDATE NEEDED - Record from nameplate</span>]</td>
            </tr>
            <tr>
                <td>Min. # of Facilities Personnel:</td>
                <td>[Number based on equipment complexity]</td>
            </tr>
            <tr>
                <td># of Contractors #1:</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td># Contractors #2:</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>Personnel from other departments:</td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>Qualifications Required:</td>
                <td>[List specific certifications and training]</td>
            </tr>
            <tr>
                <td>Tools Required:</td>
                <td>[Comprehensive list of tools and equipment]</td>
            </tr>
            <tr>
                <td>Advance notifications required:</td>
                <td>[List who needs to be notified before work]</td>
            </tr>
            <tr>
                <td>Post notifications required:</td>
                <td>[List who needs to be notified after work]</td>
            </tr>
        </table>
    </section>

    <section class="section">
        <h2>Section 04: Effect of MOP on Critical Facility</h2>
        <table>
            <thead>
                <tr>
                    <th>Facility Equipment or System</th>
                    <th style="width: 8%; text-align: center;">Yes</th>
                    <th style="width: 8%; text-align: center;">No</th>
                    <th style="width: 8%; text-align: center;">N/A</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Electrical Utility Equipment</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Impact details if Yes]</td>
                </tr>
                <tr>
                    <td>Emergency Generator System</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Impact details if Yes]</td>
                </tr>
                <tr>
                    <td>Critical Cooling System</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Impact details if Yes]</td>
                </tr>
                <tr>
                    <td>Ventilation System</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Impact details if Yes]</td>
                </tr>
                <tr>
                    <td>Mechanical System</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Impact details if Yes]</td>
                </tr>
                <tr>
                    <td>Uninterruptible Power Supply (UPS)</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Impact details if Yes]</td>
                </tr>
                <tr>
                    <td>Critical Power Distribution System</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Impact details if Yes]</td>
                </tr>
                <tr>
                    <td>Emergency Power Off (EPO)</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Impact details if Yes]</td>
                </tr>
                <tr>
                    <td>Fire Detection Systems</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Impact details if Yes]</td>
                </tr>
                <tr>
                    <td>Fire Suppression System</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Impact details if Yes]</td>
                </tr>
                <tr>
                    <td>Disable Fire System</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Impact details if Yes]</td>
                </tr>
                <tr>
                    <td>Monitoring System</td>
                    <td style="text-align: center;">Yes</td>
                    <td style="text-align: center;"></td>
                    <td style="text-align: center;"></td>
                    <td>BMS monitoring will be affected</td>
                </tr>
                <tr>
                    <td>Control System</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Impact details if Yes]</td>
                </tr>
                <tr>
                    <td>Security System</td>
                    <td style="text-align: center;"></td>
                    <td style="text-align: center;">X</td>
                    <td style="text-align: center;"></td>
                    <td></td>
                </tr>
                <tr>
                    <td>General Power and Lighting System</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Impact details if Yes]</td>
                </tr>
                <tr>
                    <td>Lockout/Tagout Required?</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[LOTO details if Yes]</td>
                </tr>
                <tr>
                    <td>Work to be performed "hot" (live electrical equipment)?</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Details if Yes]</td>
                </tr>
                <tr>
                    <td>Radio interference potential?</td>
                    <td style="text-align: center;">[Yes/blank]</td>
                    <td style="text-align: center;">[X/blank]</td>
                    <td style="text-align: center;">[blank]</td>
                    <td>[Details if Yes]</td>
                </tr>
            </tbody>
        </table>
    </section>

    <section class="section">
        <h2>Section 05: MOP Supporting Documentation</h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <h3>MOP Supporting Documentation</h3>
            <ul>
                <li>[Manufacturer] [Model] Operation and Maintenance Manual</li>
                <li>OSHA 29 CFR 1910.147 - The Control of Hazardous Energy (Lockout/Tagout)</li>
                <li>OSHA 29 CFR 1910 Subpart I - Personal Protective Equipment</li>
                <li>[List applicable NFPA standards based on equipment]</li>
                <li>[List applicable industry standards]</li>
                <li>[List specific SDS documents for chemicals used]</li>
            </ul>
        </div>
    </section>

    <section class="section">
        <h2>Section 06: Safety Requirements</h2>
        <h3>Pre Work Conditions / Safety Requirements</h3>

        <h4>KEY HAZARDS IDENTIFIED</h4>
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
                    <td>[List specific chemicals and hazards]</td>
                    <td>[List specific controls and PPE]</td>
                </tr>
                <tr>
                    <td><strong>Electrical Hazards</strong></td>
                    <td>[Voltage levels, shock/arc flash risks]</td>
                    <td>LOTO required, qualified person, proper PPE</td>
                </tr>
                <tr>
                    <td><strong>Mechanical Hazards</strong></td>
                    <td>[Moving parts, pinch points, etc.]</td>
                    <td>[Specific controls]</td>
                </tr>
                <tr>
                    <td><strong>Pressure Hazards</strong></td>
                    <td>[If applicable]</td>
                    <td>[Specific controls]</td>
                </tr>
            </tbody>
        </table>

        <h4>REQUIRED PERSONAL PROTECTIVE EQUIPMENT (PPE)</h4>
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
                    <td>At all times during maintenance</td>
                </tr>
                <tr>
                    <td><strong>Eye Protection (Chemical)</strong></td>
                    <td>Chemical safety goggles</td>
                    <td>When handling chemicals</td>
                </tr>
                <tr>
                    <td><strong>Hand Protection</strong></td>
                    <td>[Specify glove type and material]</td>
                    <td>[When required]</td>
                </tr>
                <tr>
                    <td><strong>Foot Protection</strong></td>
                    <td>Steel-toe safety boots, slip-resistant</td>
                    <td>Always in maintenance areas</td>
                </tr>
                <tr>
                    <td><strong>Respiratory Protection</strong></td>
                    <td>[Type or "Not required with adequate ventilation"]</td>
                    <td>[When required]</td>
                </tr>
                <tr>
                    <td><strong>Additional PPE</strong></td>
                    <td>[As needed]</td>
                    <td>[When required]</td>
                </tr>
            </tbody>
        </table>

        <h4>SAFETY PROCEDURES</h4>
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
                    <td>Conduct safety briefing with all personnel, document attendees, review all hazards</td>
                </tr>
                <tr>
                    <td><strong>PPE Inspection</strong></td>
                    <td>Verify all required PPE is available and in good condition</td>
                </tr>
                <tr>
                    <td><strong>Lockout/Tagout (LOTO)</strong></td>
                    <td>De-energize at [location], apply personal locks, verify zero energy</td>
                </tr>
                <tr>
                    <td><strong>Chemical Handling</strong></td>
                    <td>[Specific handling requirements]</td>
                </tr>
                <tr>
                    <td><strong>Emergency Preparedness</strong></td>
                    <td>Verify emergency equipment locations</td>
                </tr>
            </tbody>
        </table>

        <h4>EMERGENCY CONTACTS</h4>
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
                    <td>[Facility Emergency Line]</td>
                    <td><span class="update-needed">UPDATE NEEDED - Add facility number</span></td>
                </tr>
            </tbody>
        </table>

        <div style="background-color: #fee; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <strong>CRITICAL:</strong> Work shall NOT proceed until safety briefing is completed and all required PPE is verified available.
        </div>
    </section>

    <section class="section">
        <h2>Section 07: MOP Risks & Assumptions</h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <h3>MOP Risks and Assumptions</h3>
            <ul>
                <li>[List specific risks for this equipment and work]</li>
                <li>[List assumptions about facility conditions]</li>
                <li>[List mitigation strategies for each risk]</li>
            </ul>
        </div>
    </section>

    <section class="section">
        <h2>Section 08: MOP Details</h2>
        
        <table class="info-table" style="margin-bottom: 20px;">
            <tr>
                <td>Date Performed:</td>
                <td style="width: 25%;">&nbsp;</td>
                <td>Time Begun:</td>
                <td style="width: 25%;">&nbsp;</td>
            </tr>
            <tr>
                <td>Time Completed:</td>
                <td style="width: 25%;">&nbsp;</td>
                <td>Total Time:</td>
                <td style="width: 25%;">&nbsp;</td>
            </tr>
            <tr>
                <td>Facilities personnel performing work:</td>
                <td colspan="3">&nbsp;</td>
            </tr>
            <tr>
                <td>Contractor/Vendor personnel performing work:</td>
                <td colspan="3">&nbsp;</td>
            </tr>
        </table>

        <h3>Detailed Procedure Steps</h3>
        <table class="procedure-table">
            <thead>
                <tr>
                    <th style="width: 8%;">Step</th>
                    <th>Detailed Procedure</th>
                    <th style="width: 10%;">Initials</th>
                    <th style="width: 10%;">Time</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Notify client Point(s) of Contact (POC) that the procedure is about to begin, what the procedure consists of, and the corresponding approved MOP title. Have all required signatures before procedure starts.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td><strong>2.0</strong></td>
                    <td><strong>Pre-Maintenance Safety and Documentation</strong></td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>2.1</td>
                    <td><strong>MANDATORY:</strong> Review all Safety Data Sheets (SDS) for chemicals and materials to be used.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>2.2</td>
                    <td><strong>MANDATORY:</strong> Conduct pre-work safety briefing with all personnel. Document attendees. Review all hazards and emergency procedures.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>2.3</td>
                    <td><strong>MANDATORY:</strong> Verify all required PPE is available and in good condition.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>2.4</td>
                    <td><strong>MANDATORY:</strong> Ensure adequate ventilation in work area.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>2.5</td>
                    <td>Record initial equipment readings and status.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td><strong>3.0</strong></td>
                    <td><strong>System Isolation and Lockout/Tagout (CRITICAL SAFETY)</strong></td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>3.1</td>
                    <td><strong>SAFETY-CRITICAL:</strong> Identify the correct electrical disconnect. Verify equipment nameplate matches work order.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>3.2</td>
                    <td><strong>SAFETY-CRITICAL:</strong> Place equipment in OFF/STOP mode using local controls.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>3.3</td>
                    <td><strong>SAFETY-CRITICAL:</strong> De-energize at electrical disconnect. Apply personal LOTO device per OSHA 29 CFR 1910.147.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>3.4</td>
                    <td><strong>SAFETY-CRITICAL:</strong> Using calibrated multimeter, verify ZERO ENERGY STATE. Test all phases. DOCUMENT READINGS.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>3.5</td>
                    <td><strong>SAFETY-CRITICAL:</strong> Test multimeter on known energized source to verify functionality.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td><strong>4.0</strong></td>
                    <td><strong>[Equipment-Specific Maintenance Tasks]</strong></td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>4.1</td>
                    <td>[Generate detailed maintenance steps based on equipment type]</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>4.2</td>
                    <td>[Continue with specific procedures]</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <!-- Continue with all maintenance steps - minimum 20-30 steps total -->
                <tr>
                    <td><strong>X.0</strong></td>
                    <td><strong>System Restoration and Verification</strong></td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>X.1</td>
                    <td><strong>SAFETY-CRITICAL:</strong> Ensure all personnel and tools are clear of equipment.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>X.2</td>
                    <td><strong>SAFETY-CRITICAL:</strong> Remove LOTO devices (only by person who applied them).</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>X.3</td>
                    <td><strong>VERIFICATION:</strong> Perform startup sequence.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>X.4</td>
                    <td><strong>VERIFICATION:</strong> Record operational parameters and verify normal operation.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>X.5</td>
                    <td><strong>VERIFICATION:</strong> Monitor equipment for proper operation.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            </tbody>
        </table>
    </section>

    <section class="section">
        <h2>Section 09: Back-out Procedures</h2>
        <table class="procedure-table">
            <thead>
                <tr>
                    <th style="width: 8%;">Step</th>
                    <th>Back-out Procedures</th>
                    <th style="width: 10%;">Initials</th>
                    <th style="width: 10%;">Time</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td><strong>IMMEDIATE ACTIONS:</strong> If any issue occurs, immediately stop work and secure the equipment in a safe state.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td><strong>EQUIPMENT SAFETY:</strong> Ensure all energy sources remain isolated and locked out.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td><strong>ASSESSMENT:</strong> Evaluate the nature and severity of the issue.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td><strong>NOTIFICATION:</strong> Immediately notify facility management and affected departments.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td><strong>SYSTEM RESTORATION:</strong> If safe to do so, follow emergency restoration procedures to return equipment to operational status.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td><strong>DOCUMENTATION:</strong> Document all issues encountered and actions taken.</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            </tbody>
        </table>

        <div style="background-color: #fee; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <strong>IMPORTANT NOTES:</strong><br>
            1. Back-out procedures will commence immediately if any problem/failure occurs that affects the critical load.<br>
            2. Any Issues Encountered, at any of the listed verification steps, will signal a STOP of work. Issues will be immediately identified for Root Cause. Corrections will be made. The system(s) will be returned to normal operating condition and allowed to stabilize. Evaluation will be conducted before a decision is to continue or stop work. The Emergency will be immediately notified and work will STOP.
        </div>
    </section>

    <section class="section">
        <h2>Section 10: MOP Approval</h2>
        <table class="approval-table">
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
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td><strong>Technical review:</strong></td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td><strong>Chief Engineer approval:</strong></td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td><strong>Contractor Review (if applicable):</strong></td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td><strong>Customer approval:</strong></td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            </tbody>
        </table>
    </section>

    <section class="section">
        <h2>Section 11: MOP Comments</h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <h3>MOP Comments</h3>
            <ul>
                <li>[Add relevant comments about the procedure]</li>
                <li>[Note any special considerations]</li>
            </ul>
        </div>
    </section>

</div>
</body>
</html>

CRITICAL REQUIREMENTS FOR GENERATION:
1. Generate a COMPLETE HTML document with all 11 sections
2. Use proper HTML tables where specified
3. For "UPDATE NEEDED" fields, use: <span class="update-needed">UPDATE NEEDED - [instruction]</span>
4. NEVER put model numbers in the MOP Title - only manufacturer and equipment type
5. ALWAYS determine the risk level based on the work and provide a rationale
6. ALWAYS determine the CET level based on the risk level and provide a rationale
7. Use "Yes", "X", or leave blank in checkbox columns of tables
8. Generate COMPLETE procedures in Section 08 - minimum 20-30 detailed steps
9. Generate COMPLETE back-out procedures in Section 09 - minimum 6 steps
10. Include specific chemical names and safety requirements based on equipment type
11. Format dates as MM/DD/YYYY
12. Use proper HTML entities instead of unicode characters
13. Include all embedded CSS styling as shown
14. Make tables responsive and professional looking`;

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

    // Create enhanced prompt
    const userPrompt = `Create a COMPLETE MOP in HTML format based on this information:
    
Equipment Details:
- Manufacturer: ${manufacturer}
- Model Number: ${modelNumber} (DO NOT include this in the title)
- Serial Number: ${serialNumber || 'UPDATE NEEDED'}
- Location: ${location || 'UPDATE NEEDED'}
- System: ${system}
- Category: ${category}
- Work Description: ${description}

CRITICAL INSTRUCTIONS:
1. Generate a COMPLETE HTML document starting with <!DOCTYPE html>
2. The MOP Title in Section 01 should be: "${manufacturer.toUpperCase()} ${system.toUpperCase()} - ${description.includes('annual') ? 'ANNUAL' : description.includes('quarterly') ? 'QUARTERLY' : description.includes('monthly') ? 'MONTHLY' : ''} PREVENTIVE MAINTENANCE"
3. Use proper HTML tables for all sections as shown in the template
4. For fields needing updates, use: <span class="update-needed">UPDATE NEEDED - [instruction]</span>
5. Include ALL embedded CSS styling from the template
6. Determine the risk level (1-4) based on whether this is critical equipment
7. Determine the CET level based on the risk level
8. Generate COMPLETE detailed procedures in Section 08 (minimum 20-30 steps) in the table format shown
9. Generate COMPLETE back-out procedures in Section 09 (minimum 6 steps) in the table format shown
10. Section 04 must be a complete table with all 18 facility systems listed
11. Section 06 must include all 4 tables: Key Hazards, PPE, Safety Procedures, and Emergency Contacts
12. Section 10 must be a table with all 5 approval stages
13. For yes/no columns in tables, use "Yes" or "X" or leave blank - no other values
14. Generate specific, detailed procedures based on the equipment type - no placeholders

Generate a complete 11-section MOP in HTML format following the EXACT template provided with professional styling and all required tables.`;

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use the lighter model that's less likely to be overloaded
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash-8b',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8000,
      }
    });
    
    // Try to generate with retries
    let mopContent;
    let lastError;
    const maxAttempts = 5;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt} of ${maxAttempts}...`);
        
        const result = await model.generateContent(`${PROJECT_INSTRUCTIONS}\n\n${userPrompt}`);
        const response = await result.response;
        mopContent = response.text();
        
        if (!mopContent || mopContent.length < 100) {
          throw new Error('Generated content is too short');
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