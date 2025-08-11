export function getSection03ImmediateActions() {
  return `<h2>Section 03: Immediate Emergency Actions - Power Failure Diagnostics</h2>
<!-- MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Step 1 title and checks must change based on emergency type (not always "Power Loss Indicators")
- MANDATORY: For non-power emergencies, Step 1 should check indicators specific to that emergency (refrigerant alarms, temperature readings, pressure gauges, etc.)
- MANDATORY: Step 3 diagnostics must match the emergency type - electrical for power issues, refrigerant for leaks, mechanical for compressor failures, etc.
- MANDATORY: PPE table must adapt to emergency type (respirator for refrigerant leak, burn protection for high temp, etc.)
- MANDATORY: Tools table must include emergency-specific tools (refrigerant detector for leaks, temperature gun for overheating, vibration meter for mechanical issues)
- MANDATORY: Diagnostic table columns must change based on emergency (not always "Voltage Verification" - could be "Pressure Reading", "Temperature Check", "Vibration Level", etc.)
- MANDATORY: Safety requirements must include emergency-specific hazards (chemical exposure for refrigerant, thermal hazards for high temp, etc.)
- MANDATORY: Power diagnosis determination box at end must change to match emergency type (not always about power)
- FORBIDDEN: Using electrical diagnostics for non-electrical emergencies
- FORBIDDEN: Generic "power loss" language when emergency is not power-related
-->

<h3>Pre-Action Safety & Equipment Requirements</h3>

<div class="emergency-action" style="background: #fee; border: 2px solid #dc3545; padding: 15px; margin: 20px 0;">
<h4>⚠️ CRITICAL SAFETY CHECKPOINT - STOP Before Proceeding:</h4>
<p><strong>Equipment-Specific PPE Requirements for \${manufacturer} \${modelNumber}:</strong></p>

Generate PPE requirements based on the SPECIFIC equipment type and voltage:
- For 480V 3-phase equipment (chillers, large motors): Arc Flash Category 2 PPE minimum
- For 208V/240V equipment: Arc Flash Category 1 PPE
- For DC systems (UPS batteries): Acid-resistant gloves, face shield
- For refrigerant systems: SCBA or respirator if leak suspected
- For generators: Hearing protection, CO monitor

<table>
<tr>
  <th>PPE Item</th>
  <th>Specification for \${modelNumber}</th>
  <th>Verified</th>
</tr>
<tr>
  <td>Arc Flash PPE</td>
  <td>Category [specify based on voltage] - [cal/cm²] rated</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Insulated Gloves</td>
  <td>Class [0-4 based on voltage] rated for [specific voltage]</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Safety Glasses/Face Shield</td>
  <td>ANSI Z87.1 rated with side shields</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Additional PPE</td>
  <td>[Equipment-specific: respirator for refrigerants, hearing protection for generators, etc.]</td>
  <td><input type="checkbox" /></td>
</tr>
</table>

<p><strong>Required Tools & Test Equipment for \${manufacturer} \${modelNumber}:</strong></p>

Generate tool list based on the SPECIFIC equipment model:
- For Carrier 19XRV5P5: Carrier CCN interface tool, specific control board diagnostic tools
- For Trane CVHE: Tracer SC+ interface, oil pressure gauges
- For Caterpillar generators: CAT ET diagnostic tool
- For Liebert UPS: Liebert monitoring interface cable

<table>
<tr>
  <th>Tool/Equipment</th>
  <th>Specific Model/Type for \${modelNumber}</th>
  <th>Available</th>
</tr>
<tr>
  <td>Multimeter</td>
  <td>True RMS, CAT III rated for [equipment voltage]</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Clamp Meter</td>
  <td>AC/DC capable, [amperage range based on equipment FLA]</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Non-Contact Voltage Detector</td>
  <td>Rated for [equipment voltage range]</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Manufacturer Interface Tool</td>
  <td>[Specific tool for \${manufacturer} \${modelNumber}]</td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>LOTO Equipment</td>
  <td>Lockout devices for [breaker type/disconnect type]</td>
  <td><input type="checkbox" /></td>
</tr>
</table>

<p><strong>\${manufacturer} \${modelNumber} Specific Safety Requirements:</strong></p>
<ul>
<li>□ Verify de-energization procedures per \${manufacturer} service manual</li>
<li>□ Check for stored energy in [capacitors/VFDs/control circuits] specific to this model</li>
<li>□ Review \${manufacturer} emergency shutdown sequence</li>
<li>□ Confirm [equipment-specific hazards: refrigerant pressure, battery acid, hot surfaces, etc.]</li>
<li>□ Emergency contact for \${manufacturer} technical support ready: <input type="text" placeholder="Support #" style="width:150px" /></li>
</ul>

<div style="background: #dc3545; color: white; padding: 10px; margin: 10px 0; font-weight: bold; text-align: center;">
DO NOT PROCEED until all safety requirements are verified for \${manufacturer} \${modelNumber}
</div>
</div>

<h3>Step 1: Obvious Power Loss Indicators Check (BEFORE opening any equipment)</h3>
<p><strong>Verify facility-wide power status indicators before approaching \${manufacturer} \${modelNumber}</strong></p>
<table>
<tr>
  <th>Check Item</th>
  <th>Expected Condition if Power Lost</th>
  <th>Verification Method</th>
  <th>Data Reading Field</th>
  <th>Pass/Fail</th>
</tr>
<tr>
  <td>Generator Running (Audible)</td>
  <td>Generator engine noise audible from equipment room</td>
  <td>Listen for engine sound upon entering facility</td>
  <td><input type="text" placeholder="Yes/No" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Generator Alarms</td>
  <td>Generator control panel showing "Running" or active alarms</td>
  <td>Visual check of generator control panel</td>
  <td><input type="text" placeholder="Status" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Emergency Lighting</td>
  <td>Emergency lights activated in corridors and equipment rooms</td>
  <td>Visual observation of emergency lighting status</td>
  <td><input type="text" placeholder="On/Off" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>UPS on Battery</td>
  <td>UPS alarm beeping, "On Battery" LED illuminated</td>
  <td>Check UPS front panel indicators and listen for alarms</td>
  <td><input type="text" placeholder="Status" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Facility Alarms</td>
  <td>BMS/EPMS showing utility power loss alarms</td>
  <td>Check alarm panel or BMS workstation</td>
  <td><input type="text" placeholder="Alarms present" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
</table>

<h3>Step 2: System Monitoring Verification</h3>
<p><strong>Verify how \${manufacturer} \${modelNumber} appears in monitoring systems</strong></p>
<table>
<tr>
  <th>System</th>
  <th>Check Location</th>
  <th>What to Verify</th>
  <th>Expected Reading for \${modelNumber}</th>
  <th>Actual Reading</th>
  <th>Pass/Fail</th>
</tr>
<tr>
  <td>EPMS</td>
  <td>Electrical Power Monitoring System</td>
  <td>Power consumption for \${modelNumber}</td>
  <td>0 kW if de-energized</td>
  <td><input type="text" placeholder="kW reading" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>BMS</td>
  <td>Building Management System</td>
  <td>\${manufacturer} \${modelNumber} status</td>
  <td>"Offline" or "No Communication"</td>
  <td><input type="text" placeholder="Status" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>SCADA (if available)</td>
  <td>SCADA System</td>
  <td>\${system} operational status</td>
  <td>Shows \${modelNumber} as non-operational</td>
  <td><input type="text" placeholder="Status" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>Generator Monitoring</td>
  <td>Generator Control Panel</td>
  <td>Load percentage and kW output</td>
  <td>Load increased if utility power lost</td>
  <td><input type="text" placeholder="% Load" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
<tr>
  <td>ATS Status</td>
  <td>Automatic Transfer Switch</td>
  <td>Source position (Utility/Generator)</td>
  <td>"Emergency" or "Generator" if transferred</td>
  <td><input type="text" placeholder="Position" style="width:100px" /></td>
  <td><input type="checkbox" /></td>
</tr>
</table>

<h3>Step 3: Electrical Diagnostics</h3>
<p><strong>Equipment-specific electrical verification for \${manufacturer} \${modelNumber}</strong></p>

First, identify the specific equipment type from the manufacturer and model provided. Determine:
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
- Lock-out/Tag-out specific to this equipment`;
}