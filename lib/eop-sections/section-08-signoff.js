export function getSection08Signoff(emergencyType = 'Power Failure') {
  return `<h2>Section 08: Sign-off and Supporting Documentation</h2>
<!-- MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Generate a comprehensive sign-off table with 8-10 procedure verification items
- MANDATORY: Items must be specific to the emergency type and equipment
- MANDATORY: Each sign-off item should reference key steps from the emergency response
- MANDATORY: Include manufacturer-specific documentation based on equipment type
- MANDATORY: Documentation list must include 5-7 relevant documents
- MANDATORY: Select documents intelligently based on manufacturer, equipment type, and emergency
- FORBIDDEN: Generic sign-off items that don't relate to the specific emergency
- FORBIDDEN: Documentation list without manufacturer-specific manuals
-->

<h3>Procedure Sign-off Checklist</h3>
<p>The following critical tasks must be completed and verified for this ${emergencyType} emergency response on the \${manufacturer} \${modelNumber}:</p>
<table>
  <tr>
    <th style="width:45%">Procedure/Task Completed</th>
    <th style="width:20%">Technician Name</th>
    <th style="width:15%">Date/Time</th>
    <th style="width:20%">Signature/Initials</th>
  </tr>
  <!-- GENERATE 8-10 SPECIFIC SIGN-OFF ITEMS BASED ON EMERGENCY TYPE -->
  <!-- Examples for Power Failure:
  - Power failure confirmed and documented
  - Voltage readings recorded at all test points
  - Transfer switch operation verified
  - Equipment restart sequence completed
  - Load testing performed successfully
  - Control systems restored to normal
  - Alarms cleared and acknowledged
  - Post-incident testing completed
  -->
  <!-- Examples for Refrigerant Leak:
  - Leak location identified and marked
  - Area evacuated and ventilated
  - Refrigerant sensors calibrated
  - Leak repair completed
  - System pressure tested
  - Refrigerant charge verified
  - EPA documentation completed
  - System performance validated
  -->
  <!-- Examples for Cooling Loss:
  - Temperature readings documented
  - Backup cooling activated
  - Load shed procedures executed
  - Primary cooling restored
  - Temperature stabilization confirmed
  - Equipment thermal stress checked
  - Cooling capacity verified
  - Return to normal operations confirmed
  -->
  <tr>
    <td>[AI: Generate emergency-specific task 1 based on ${emergencyType}]</td>
    <td><input type="text" placeholder="Name" style="width:150px" /></td>
    <td><input type="text" placeholder="MM/DD/YY HH:MM" style="width:120px" /></td>
    <td><input type="text" placeholder="Initials" style="width:100px" /></td>
  </tr>
  <tr>
    <td>[AI: Generate emergency-specific task 2 based on ${emergencyType}]</td>
    <td><input type="text" placeholder="Name" style="width:150px" /></td>
    <td><input type="text" placeholder="MM/DD/YY HH:MM" style="width:120px" /></td>
    <td><input type="text" placeholder="Initials" style="width:100px" /></td>
  </tr>
  <tr>
    <td>[AI: Generate emergency-specific task 3 based on ${emergencyType}]</td>
    <td><input type="text" placeholder="Name" style="width:150px" /></td>
    <td><input type="text" placeholder="MM/DD/YY HH:MM" style="width:120px" /></td>
    <td><input type="text" placeholder="Initials" style="width:100px" /></td>
  </tr>
  <tr>
    <td>[AI: Generate emergency-specific task 4 based on ${emergencyType}]</td>
    <td><input type="text" placeholder="Name" style="width:150px" /></td>
    <td><input type="text" placeholder="MM/DD/YY HH:MM" style="width:120px" /></td>
    <td><input type="text" placeholder="Initials" style="width:100px" /></td>
  </tr>
  <tr>
    <td>[AI: Generate emergency-specific task 5 based on ${emergencyType}]</td>
    <td><input type="text" placeholder="Name" style="width:150px" /></td>
    <td><input type="text" placeholder="MM/DD/YY HH:MM" style="width:120px" /></td>
    <td><input type="text" placeholder="Initials" style="width:100px" /></td>
  </tr>
  <tr>
    <td>[AI: Generate emergency-specific task 6 based on ${emergencyType}]</td>
    <td><input type="text" placeholder="Name" style="width:150px" /></td>
    <td><input type="text" placeholder="MM/DD/YY HH:MM" style="width:120px" /></td>
    <td><input type="text" placeholder="Initials" style="width:100px" /></td>
  </tr>
  <tr>
    <td>[AI: Generate emergency-specific task 7 based on ${emergencyType}]</td>
    <td><input type="text" placeholder="Name" style="width:150px" /></td>
    <td><input type="text" placeholder="MM/DD/YY HH:MM" style="width:120px" /></td>
    <td><input type="text" placeholder="Initials" style="width:100px" /></td>
  </tr>
  <tr>
    <td>[AI: Generate emergency-specific task 8 based on ${emergencyType}]</td>
    <td><input type="text" placeholder="Name" style="width:150px" /></td>
    <td><input type="text" placeholder="MM/DD/YY HH:MM" style="width:120px" /></td>
    <td><input type="text" placeholder="Initials" style="width:100px" /></td>
  </tr>
  <tr>
    <td>[AI: Generate emergency-specific task 9 if needed]</td>
    <td><input type="text" placeholder="Name" style="width:150px" /></td>
    <td><input type="text" placeholder="MM/DD/YY HH:MM" style="width:120px" /></td>
    <td><input type="text" placeholder="Initials" style="width:100px" /></td>
  </tr>
  <tr>
    <td>[AI: Generate emergency-specific task 10 if needed]</td>
    <td><input type="text" placeholder="Name" style="width:150px" /></td>
    <td><input type="text" placeholder="MM/DD/YY HH:MM" style="width:120px" /></td>
    <td><input type="text" placeholder="Initials" style="width:100px" /></td>
  </tr>
</table>

<h3>Supporting Documentation</h3>
<p>The following documents should be referenced during and after this ${emergencyType} emergency response:</p>

<h4>Manufacturer-Specific Documentation for \${manufacturer} \${modelNumber}:</h4>
<ul>
  <!-- GENERATE 5-7 RELEVANT DOCUMENTS BASED ON:
  - Manufacturer (Carrier, Trane, York, Liebert, Caterpillar, etc.)
  - Equipment type (Chiller, UPS, Generator, CRAC, etc.)
  - Emergency type (Power Failure, Refrigerant Leak, Cooling Loss, etc.)
  -->
  <!-- Examples for Carrier Chiller + Power Failure:
  - Carrier 30XA Service Manual (Document #30XA-PRO-SVN)
  - Carrier Electrical Troubleshooting Guide
  - Carrier Control System Reset Procedures
  - Carrier VFD Programming Manual
  - Carrier Post-Power Failure Restart Sequence
  -->
  <!-- Examples for Liebert UPS + Power Failure:
  - Liebert NX Service Manual
  - Liebert Battery Management Guide
  - Liebert Transfer Switch Operation Manual
  - Liebert Emergency Bypass Procedures
  - Liebert Power Module Replacement Guide
  -->
  <li>[AI: Generate manufacturer document 1 - Service/Operation Manual for \${manufacturer} \${modelNumber}]</li>
  <li>[AI: Generate manufacturer document 2 - Emergency-specific troubleshooting guide]</li>
  <li>[AI: Generate manufacturer document 3 - Control system documentation if applicable]</li>
  <li>[AI: Generate manufacturer document 4 - Parts catalog or maintenance manual]</li>
  <li>[AI: Generate manufacturer document 5 - Technical bulletin relevant to ${emergencyType}]</li>
  <li>[AI: Generate additional document 6 if relevant - Safety procedures]</li>
  <li>[AI: Generate additional document 7 if relevant - Previous incident reports template]</li>
</ul>

<h4>Safety Data Sheets (if applicable):</h4>
<ul>
  <!-- GENERATE BASED ON EQUIPMENT TYPE -->
  <!-- For refrigerant systems: Include refrigerant SDS -->
  <!-- For battery systems: Include battery acid/electrolyte SDS -->
  <!-- For generators: Include fuel and oil SDS -->
  <li>[AI: Generate relevant SDS based on equipment type - e.g., R-410A SDS for chillers]</li>
  <li>[AI: Generate additional SDS if needed - e.g., Compressor Oil SDS]</li>
</ul>

<h4>Standard Operating Procedures:</h4>
<ul>
  <li>Site-specific Emergency Response Plan</li>
  <li>Equipment Restart Procedures after ${emergencyType}</li>
  <li>Incident Reporting and Documentation Requirements</li>
  <li>Post-Emergency Equipment Inspection Checklist</li>
</ul>

<h4>Regulatory Compliance Documents:</h4>
<ul>
  <!-- GENERATE BASED ON EMERGENCY TYPE -->
  <!-- For refrigerant: EPA Section 608 requirements -->
  <!-- For electrical: NFPA 70E requirements -->
  <!-- For fire: Local fire code requirements -->
  <li>[AI: Generate regulatory document 1 based on ${emergencyType}]</li>
  <li>[AI: Generate regulatory document 2 if applicable]</li>
</ul>

<div class="emergency-warning">
  <strong>IMPORTANT:</strong> All sign-off items must be completed and verified before declaring the emergency resolved. 
  Maintain all documentation for regulatory compliance and incident review.
</div>`;
}