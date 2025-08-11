export function getSection01Identification(emergencyType = 'Power Failure') {
  return `<h2>Section 01: EOP Identification & Control</h2>
<p><strong>EOP Title:</strong> Emergency Operating Procedure for \${manufacturer} \${modelNumber}</p>
<!-- IMPORTANT: Replace EOP Identifier line with emergency code mapping based on emergency type:
Emergency type codes:
- Power Failure / Outage = PWR
- High Discharge Pressure Alarm = HDP
- Low Suction Pressure/Temperature = LSP
- Compressor Failure = COMP
- High Water Temperature Alarm = HWT
- Refrigerant Leak Detection = REFL
- Control System Failure = CTRL
- Condenser Fan Failure = CDF
- Condenser Water Flow Failure = CWF
- Chilled Water Flow Failure = CHWF
- Extreme Ambient Temperature = TEMP
- Vibration/Noise Alarm = VIB
- Complete Chiller Shutdown = SHUT
- Fire/Smoke Detection = FIRE
- Recovery Procedures = RECV
- Fan Failure = FAN
- Pump Failure = PUMP
- Gear Box Failure = GEAR
- Pump Motor Failure = MTR
- Pump Seal Failure = SEAL
- Bearing Failure = BRG
- VFD Failure = VFD
- Blocked Strainer = STRN
- Pump Air Locked = AIRL
- Pump Cavitation = CAV
- Loss of airflow = FLOW
- Water leak detection = LEAK
- Communication Loss = COMM
- Frost Coil Alarm = FRST
- Differential pressure alarm = DIFF
- Humidity Alarm = HUM
- Emergency manual override = EMER
- Smoke Detection Alarm = SMOK
- Loss of cooling = COOL
- Condensate water alarm = COND
If emergency type doesn't match exactly, use first 3-4 relevant letters -->
<p><strong>EOP Identifier:</strong> EOP-\${manufacturer.toUpperCase().substring(0,3)}-\${modelNumber.replace(/[^A-Z0-9]/gi, '').substring(0,8)}-[emergency code]-001</p>
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