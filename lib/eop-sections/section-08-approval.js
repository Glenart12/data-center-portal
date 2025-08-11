export function getSection08Approval(emergencyType = 'Power Failure') {
  return `<h2>Section 08: EOP Approval & Review</h2>
<!-- MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Include standard approvers: Author (Facilities Engineer), Approver (Facilities Manager), Reviewer (Safety Officer)
- MANDATORY: Add emergency-specific approvers based on type selected
- MANDATORY: For Refrigerant emergencies: Add Environmental Compliance Officer and Refrigerant Program Manager rows
- MANDATORY: For Fire/Smoke emergencies: Add Fire Marshal and Life Safety Officer rows
- MANDATORY: For Control System failures: Add IT Manager and Control Systems Engineer rows
- MANDATORY: For Water emergencies: Add Plumbing Supervisor and Risk Management rows
- MANDATORY: For High Temperature/Cooling Loss: Add Data Center Operations Manager and Critical Systems Manager rows
- MANDATORY: For Mechanical failures: Add Mechanical Engineering Lead and Reliability Engineer rows
- MANDATORY: Next Review Date must default to one year from current date
- MANDATORY: Include revision tracking table with columns: Revision Number, Date, Description of Changes, Changed By
- FORBIDDEN: Generic approval matrix that doesn't reflect the emergency type's stakeholders
- FORBIDDEN: Missing critical approvers for safety-sensitive emergencies (Fire, Refrigerant, etc.)
-->
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
</table>`;
}