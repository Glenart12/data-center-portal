export function getSection07Supporting() {
  return `<h2>Section 07: Supporting Information</h2>
<h3>Critical Infrastructure Locations</h3>
<table>
  <tr>
    <th>Infrastructure Element</th>
    <th>Location Details</th>
    <th>Access Requirements</th>
  </tr>
  <tr>
    <td><strong>\${manufacturer} \${modelNumber} Location</strong></td>
    <td><input type="text" placeholder="Enter exact location (Room/Row/Rack)" style="width:250px" /></td>
    <td><input type="text" placeholder="Badge/Key required" style="width:150px" /></td>
  </tr>
  <tr>
    <td><strong>Main Electrical Panel</strong></td>
    <td><input type="text" placeholder="Panel designation and location" style="width:250px" /></td>
    <td><input type="text" placeholder="Access requirements" style="width:150px" /></td>
  </tr>
  <tr>
    <td><strong>Equipment Disconnect Switch</strong></td>
    <td><input type="text" placeholder="Disconnect location" style="width:250px" /></td>
    <td><input type="text" placeholder="Access requirements" style="width:150px" /></td>
  </tr>
  <tr>
    <td><strong>Distribution Panel</strong></td>
    <td><input type="text" placeholder="Panel ID and location" style="width:250px" /></td>
    <td><input type="text" placeholder="Access requirements" style="width:150px" /></td>
  </tr>
  <tr>
    <td><strong>Emergency Generator</strong></td>
    <td><input type="text" placeholder="Generator location" style="width:250px" /></td>
    <td><input type="text" placeholder="Access requirements" style="width:150px" /></td>
  </tr>
  <tr>
    <td><strong>UPS System (if applicable)</strong></td>
    <td><input type="text" placeholder="UPS location" style="width:250px" /></td>
    <td><input type="text" placeholder="Access requirements" style="width:150px" /></td>
  </tr>
</table>

<h3>Spare Parts Inventory</h3>
<p>Critical spare parts for \${manufacturer} \${modelNumber} emergency response:</p>
<table>
  <tr>
    <th>Part Description</th>
    <th>Part Number</th>
    <th>Quantity</th>
    <th>Storage Location</th>
  </tr>
  <tr>
    <td>Main Breaker/Fuses</td>
    <td><input type="text" placeholder="Part number" style="width:150px" /></td>
    <td><input type="text" placeholder="Qty" style="width:60px" /></td>
    <td><input type="text" placeholder="Location" style="width:200px" /></td>
  </tr>
  <tr>
    <td>Control Fuses</td>
    <td><input type="text" placeholder="Part number" style="width:150px" /></td>
    <td><input type="text" placeholder="Qty" style="width:60px" /></td>
    <td><input type="text" placeholder="Location" style="width:200px" /></td>
  </tr>
  <tr>
    <td>Control Board/Module</td>
    <td><input type="text" placeholder="Part number" style="width:150px" /></td>
    <td><input type="text" placeholder="Qty" style="width:60px" /></td>
    <td><input type="text" placeholder="Location" style="width:200px" /></td>
  </tr>
  <tr>
    <td>Power Supply Module</td>
    <td><input type="text" placeholder="Part number" style="width:150px" /></td>
    <td><input type="text" placeholder="Qty" style="width:60px" /></td>
    <td><input type="text" placeholder="Location" style="width:200px" /></td>
  </tr>
  <tr>
    <td>Contactors/Relays</td>
    <td><input type="text" placeholder="Part number" style="width:150px" /></td>
    <td><input type="text" placeholder="Qty" style="width:60px" /></td>
    <td><input type="text" placeholder="Location" style="width:200px" /></td>
  </tr>
</table>

<h3>Related Documents</h3>
Make these clickable hyperlinks:
- <a href="#" style="color: #0070f3; text-decoration: underline;">Equipment Electrical Drawings</a> (Internal Document)
- <a href="#" style="color: #0070f3; text-decoration: underline;">Single Line Diagram</a> (Internal Document)
- <a href="#" style="color: #0070f3; text-decoration: underline;">Arc Flash Study</a> (Internal Document)
- <a href="https://www.osha.gov/electrical" target="_blank" style="color: #0070f3; text-decoration: underline;">OSHA Electrical Safety Standards</a>
- <a href="https://www.nfpa.org/codes-and-standards/nfpa-70e" target="_blank" style="color: #0070f3; text-decoration: underline;">NFPA 70E Electrical Safety</a>`;
}