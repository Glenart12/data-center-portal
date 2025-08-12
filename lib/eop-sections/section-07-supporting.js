export function getSection07Supporting(emergencyType = 'Power Failure') {
  return `<h2>Section 07: Supporting Information</h2>
<!-- MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Infrastructure locations must include emergency-specific critical locations
- MANDATORY: For Refrigerant emergencies: Add refrigerant storage, recovery equipment, leak detectors, ventilation controls, PPE storage locations
- MANDATORY: For Water emergencies: Add water shutoff valves, floor drains, sump pumps, wet vacs, water sensors locations
- MANDATORY: For Fire/Smoke: Add fire alarm panel, suppression controls, extinguishers, evacuation routes, fire pump locations
- MANDATORY: For Mechanical failures: Add spare motor location, bearing storage, belt/coupling storage, alignment tools locations
- MANDATORY: For Temperature emergencies: Add temporary cooling connection points, load bank locations, portable unit staging areas
- MANDATORY: For Control failures: Add network closets, control panels, BMS workstations, backup control locations
- MANDATORY: Spare parts table must list parts relevant to the emergency type (not just electrical parts)
- MANDATORY: For Refrigerant: Include refrigerant cylinders, recovery cylinders, filter driers, leak repair kits, detection equipment
- MANDATORY: For Mechanical: Include bearings, belts, couplings, shaft seals, vibration dampeners, alignment shims
- MANDATORY: For Water: Include pipe repair clamps, drain hoses, submersible pumps, absorbent materials, tarps
- MANDATORY: For Control: Include control boards, sensors, network cards, communication modules, programming cables
- MANDATORY: Related documents must include emergency-specific references (EPA guidelines for refrigerant, mechanical vibration standards, water damage procedures)
- FORBIDDEN: Only listing electrical infrastructure for non-electrical emergencies
- FORBIDDEN: Generic spare parts list that doesn't match the emergency type
-->
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
<p>Critical spare parts for \${manufacturer} \${component} (Model: \${modelNumber}, S/N: \${serialNumber}):</p>
<!-- MANDATORY: Research and provide ACTUAL part numbers for the specific make/model/serial number -->
<!-- Use manufacturer's official part catalog for exact part numbers -->
<table>
  <tr>
    <th>Part Description</th>
    <th>Manufacturer Part Number</th>
    <th>Qty on Hand</th>
    <th>Min Stock</th>
    <th>Storage Location</th>
  </tr>
  <tr>
    <td>Main Breaker/Fuses</td>
    <td>[Research EXACT part # for \${manufacturer} \${modelNumber}]</td>
    <td><input type="text" placeholder="Qty" style="width:50px" /></td>
    <td>[Recommended: 2-3]</td>
    <td><input type="text" placeholder="Location" style="width:180px" /></td>
  </tr>
  <tr>
    <td>Control Fuses (24V/120V)</td>
    <td>[Research EXACT fuse type/rating for \${modelNumber}]</td>
    <td><input type="text" placeholder="Qty" style="width:50px" /></td>
    <td>[Recommended: 5-10]</td>
    <td><input type="text" placeholder="Location" style="width:180px" /></td>
  </tr>
  <tr>
    <td>Control Board/Module</td>
    <td>[Research EXACT board P/N for \${manufacturer} \${modelNumber}]</td>
    <td><input type="text" placeholder="Qty" style="width:50px" /></td>
    <td>[Recommended: 1]</td>
    <td><input type="text" placeholder="Location" style="width:180px" /></td>
  </tr>
  <tr>
    <td>VFD/Soft Starter (if equipped)</td>
    <td>[Research EXACT VFD model for \${modelNumber}]</td>
    <td><input type="text" placeholder="Qty" style="width:50px" /></td>
    <td>[Recommended: 1]</td>
    <td><input type="text" placeholder="Location" style="width:180px" /></td>
  </tr>
  <tr>
    <td>Contactors/Relays</td>
    <td>[Research EXACT contactor P/N for \${manufacturer}]</td>
    <td><input type="text" placeholder="Qty" style="width:50px" /></td>
    <td>[Recommended: 2-3]</td>
    <td><input type="text" placeholder="Location" style="width:180px" /></td>
  </tr>
  <tr>
    <td>Temperature Sensors</td>
    <td>[Research EXACT sensor P/N for \${modelNumber}]</td>
    <td><input type="text" placeholder="Qty" style="width:50px" /></td>
    <td>[Recommended: 3-5]</td>
    <td><input type="text" placeholder="Location" style="width:180px" /></td>
  </tr>
  <tr>
    <td>Pressure Transducers</td>
    <td>[Research EXACT transducer P/N for \${manufacturer}]</td>
    <td><input type="text" placeholder="Qty" style="width:50px" /></td>
    <td>[Recommended: 2]</td>
    <td><input type="text" placeholder="Location" style="width:180px" /></td>
  </tr>
  <tr>
    <td>Filter Driers (if refrigerant system)</td>
    <td>[Research EXACT filter drier size for \${modelNumber}]</td>
    <td><input type="text" placeholder="Qty" style="width:50px" /></td>
    <td>[Recommended: 3-5]</td>
    <td><input type="text" placeholder="Location" style="width:180px" /></td>
  </tr>
  <tr>
    <td>Oil Filters (if applicable)</td>
    <td>[Research EXACT oil filter P/N for \${modelNumber}]</td>
    <td><input type="text" placeholder="Qty" style="width:50px" /></td>
    <td>[Recommended: 3]</td>
    <td><input type="text" placeholder="Location" style="width:180px" /></td>
  </tr>
  <tr>
    <td>Refrigerant (\${refrigerant type})</td>
    <td>[Specify cylinder size and refrigerant type]</td>
    <td><input type="text" placeholder="Lbs" style="width:50px" /> lbs</td>
    <td>[Full charge + 20%]</td>
    <td><input type="text" placeholder="Location" style="width:180px" /></td>
  </tr>
</table>

<h3>Related Documents</h3>
<h4>Internal Documents:</h4>
- <a href="#" style="color: #0070f3; text-decoration: underline;">Equipment Electrical Drawings</a> (Site-Specific)
- <a href="#" style="color: #0070f3; text-decoration: underline;">Single Line Diagram</a> (Site-Specific)
- <a href="#" style="color: #0070f3; text-decoration: underline;">Arc Flash Study</a> (Site-Specific)
- <a href="#" style="color: #0070f3; text-decoration: underline;">Equipment Maintenance History</a> (Site-Specific)

<h4>Manufacturer Documents for \${manufacturer} \${modelNumber}:</h4>
<!-- MANDATORY: Generate actual manufacturer document links based on the specific make/model -->
- <a href="[Generate actual URL for \${manufacturer} \${modelNumber} performance data]" target="_blank" style="color: #0070f3; text-decoration: underline;">Performance Data Sheet - \${modelNumber}</a>
- <a href="[Generate actual URL for \${manufacturer} \${modelNumber} service manual]" target="_blank" style="color: #0070f3; text-decoration: underline;">Service Manual - \${modelNumber}</a>
- <a href="[Generate actual URL for \${manufacturer} \${modelNumber} installation guide]" target="_blank" style="color: #0070f3; text-decoration: underline;">Installation Guide - \${modelNumber}</a>
- <a href="[Generate actual URL for \${manufacturer} technical bulletins]" target="_blank" style="color: #0070f3; text-decoration: underline;">Technical Bulletins - \${manufacturer}</a>
- <a href="[Generate actual URL for \${manufacturer} wiring diagrams]" target="_blank" style="color: #0070f3; text-decoration: underline;">Wiring Diagrams - \${modelNumber}</a>
- <a href="[Generate actual URL for \${manufacturer} parts catalog]" target="_blank" style="color: #0070f3; text-decoration: underline;">Parts Catalog - \${modelNumber}</a>

<!-- Manufacturer Support Websites -->
<h4>Manufacturer Support Links:</h4>
<!-- Generate based on manufacturer -->
<!-- Carrier: https://www.carrier.com/commercial/en/us/support/ -->
<!-- Trane: https://www.trane.com/commercial/north-america/us/en/support.html -->
<!-- York: https://www.york.com/commercial-equipment/support -->
<!-- Caterpillar: https://www.cat.com/en_US/support.html -->
<!-- Liebert: https://www.vertiv.com/en-us/support/ -->
<!-- Eaton: https://www.eaton.com/us/en-us/support.html -->
<!-- Schneider: https://www.se.com/us/en/work/support/ -->
- <a href="[Generate manufacturer support website for \${manufacturer}]" target="_blank" style="color: #0070f3; text-decoration: underline;">\${manufacturer} Technical Support Portal</a>

<h4>Regulatory Standards:</h4>
- <a href="https://www.osha.gov/electrical" target="_blank" style="color: #0070f3; text-decoration: underline;">OSHA Electrical Safety Standards</a>
- <a href="https://www.nfpa.org/codes-and-standards/nfpa-70e" target="_blank" style="color: #0070f3; text-decoration: underline;">NFPA 70E Electrical Safety</a>
- <a href="https://www.epa.gov/section608" target="_blank" style="color: #0070f3; text-decoration: underline;">EPA Section 608 (Refrigerant Management)</a>
- <a href="https://www.ashrae.org/technical-resources/standards-and-guidelines" target="_blank" style="color: #0070f3; text-decoration: underline;">ASHRAE Standards</a>`;
}