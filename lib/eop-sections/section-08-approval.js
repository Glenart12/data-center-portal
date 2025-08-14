export function getSection08Approval(emergencyType = 'Power Failure') {
  return `<h2>Section 08: Sign-off and Supporting Documentation</h2>
<!-- MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Generate a comprehensive sign-off table with 8-10 procedure verification items
- MANDATORY: Items must be specific to the emergency type and equipment
- MANDATORY: Each sign-off item should reference key steps from the emergency response
- MANDATORY: Include manufacturer-specific documentation based on equipment type
- MANDATORY: Documentation list must include 5-7 relevant documents
- MANDATORY: Include approval matrix with standard and emergency-specific approvers
- FORBIDDEN: Generic sign-off items that don't relate to the specific emergency
- FORBIDDEN: Documentation list without manufacturer-specific manuals
-->

<h3>Procedure Sign-off Checklist</h3>
<p>The following critical tasks must be completed and verified for this ${emergencyType} emergency response:</p>
<table>
  <tr>
    <th style="width:45%">Procedure/Task Completed</th>
    <th style="width:20%">Technician Name</th>
    <th style="width:15%">Date/Time</th>
    <th style="width:20%">Signature/Initials</th>
  </tr>
  <!-- AI MUST GENERATE 8-10 SPECIFIC SIGN-OFF ITEMS BASED ON EMERGENCY TYPE -->
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
</table>

<h3>Supporting Documentation</h3>
<p>The following documents should be referenced during and after this ${emergencyType} emergency response:</p>

<h4>Manufacturer-Specific Documentation:</h4>
<ul>
  <!-- AI MUST GENERATE 5-7 RELEVANT DOCUMENTS BASED ON:
  - Manufacturer (Carrier, Trane, York, Liebert, Caterpillar, etc.)
  - Equipment type (Chiller, UPS, Generator, CRAC, etc.)
  - Emergency type (Power Failure, Refrigerant Leak, Cooling Loss, etc.)
  -->
</ul>

<h4>Safety Data Sheets (if applicable):</h4>
<ul>
  <!-- GENERATE BASED ON EQUIPMENT TYPE -->
  <!-- For refrigerant systems: Include refrigerant SDS -->
  <!-- For battery systems: Include battery acid/electrolyte SDS -->
  <!-- For generators: Include fuel and oil SDS -->
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
</ul>

<h3>Approval Matrix</h3>
<table>
  <tr>
    <th>Role</th>
    <th>Name</th>
    <th>Signature</th>
    <th>Date</th>
  </tr>
  <tr>
    <td>Author (Facilities Engineer)</td>
    <td><input type="text" placeholder="Enter name" style="width:200px" /></td>
    <td><input type="text" placeholder="Signature" style="width:200px" /></td>
    <td><input type="text" placeholder="MM/DD/YYYY" style="width:120px" /></td>
  </tr>
  <tr>
    <td>Approver (Facilities Manager)</td>
    <td><input type="text" placeholder="Enter name" style="width:200px" /></td>
    <td><input type="text" placeholder="Signature" style="width:200px" /></td>
    <td><input type="text" placeholder="MM/DD/YYYY" style="width:120px" /></td>
  </tr>
  <tr>
    <td>Reviewer (Safety Officer)</td>
    <td><input type="text" placeholder="Enter name" style="width:200px" /></td>
    <td><input type="text" placeholder="Signature" style="width:200px" /></td>
    <td><input type="text" placeholder="MM/DD/YYYY" style="width:120px" /></td>
  </tr>
  <!-- AI MUST ADD EMERGENCY-SPECIFIC APPROVERS:
  - For Refrigerant emergencies: Add Environmental Compliance Officer
  - For Fire/Smoke emergencies: Add Fire Marshal
  - For Control System failures: Add IT Manager
  - For Water emergencies: Add Risk Management
  - For High Temperature: Add Data Center Operations Manager
  - For Mechanical failures: Add Mechanical Engineering Lead
  -->
</table>

<p><strong>Next Review Date:</strong> <input type="text" placeholder="MM/DD/YYYY (one year from today)" style="width:200px" /></p>

<h3>Revision History</h3>
<table>
  <tr>
    <th>Revision</th>
    <th>Date</th>
    <th>Description of Changes</th>
    <th>Changed By</th>
  </tr>
  <tr>
    <td>1.0</td>
    <td><input type="text" placeholder="MM/DD/YYYY" style="width:120px" /></td>
    <td><input type="text" placeholder="Initial release" style="width:300px" /></td>
    <td><input type="text" placeholder="Name" style="width:150px" /></td>
  </tr>
</table>

<div class="emergency-warning">
  <strong>IMPORTANT:</strong> All sign-off items must be completed and verified before declaring the emergency resolved. 
  Maintain all documentation for regulatory compliance and incident review.
</div>`;
}