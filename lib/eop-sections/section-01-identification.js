export function getSection01Identification() {
  return `<h2>Section 01: EOP Identification & Control</h2>
<p><strong>EOP Title:</strong> Emergency Operating Procedure for \${manufacturer} \${modelNumber}</p>
<p><strong>EOP Identifier:</strong> EOP-\${manufacturer.toUpperCase().substring(0,3)}-\${modelNumber.replace(/[^A-Z0-9]/gi, '').substring(0,8)}-PWR-001</p>
<p><strong>Equipment Details:</strong></p>
<p><strong>Manufacturer:</strong> \${manufacturer}</p>
<p><strong>Model Number:</strong> \${modelNumber}</p>
<p><strong>Serial Number:</strong> \${serialNumber || 'N/A'}</p>
<p><strong>Location:</strong> \${location || 'Data Center'}</p>
<p><strong>System:</strong> \${system}</p>
<p><strong>Component Type:</strong> \${component}</p>
<p><strong>Version:</strong> <input type="text" value="1.0" style="width:80px" /></p>
<p><strong>Date:</strong> <input type="text" value="[current_date]" style="width:150px" /></p>
<p><strong>Author:</strong> <input type="text" placeholder="Enter Author Name" style="width:250px" /></p>
<p><strong>Approver:</strong> <input type="text" placeholder="Enter Approver Name" style="width:250px" /></p>`;
}