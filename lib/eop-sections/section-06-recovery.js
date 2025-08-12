export function getSection06Recovery(emergencyType = 'Power Failure') {
  return `<h2>Section 06: Recovery & Return to Service</h2>
<!-- MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Section title must change from "Power Restoration" to match the emergency type (Leak Recovery, Pressure Normalization, Temperature Recovery, etc.)
- MANDATORY: Step 1 must verify resolution of the ACTUAL emergency (not always power restoration)
- MANDATORY: For Refrigerant Leak: Verify leak sealed, area ventilated, refrigerant levels restored, EPA documentation complete
- MANDATORY: For High Pressure/Temperature: Verify pressures/temps within normal range, root cause addressed, safety limits reset
- MANDATORY: For Mechanical Failures: Verify repairs completed, alignment checked, vibration levels normal, test run performed
- MANDATORY: For Water emergencies: Verify leak stopped, water removed, equipment dried, electrical components tested
- MANDATORY: For Fire/Smoke: Verify fire department all-clear, suppression system reset, smoke cleared, equipment inspection complete
- MANDATORY: For Control failures: Verify control system restored, communication re-established, all points responding, setpoints verified
- MANDATORY: Pre-start checks must include emergency-specific items (refrigerant charge for leaks, bearing temps for mechanical, moisture for water damage)
- MANDATORY: Functionality verification table must measure parameters relevant to the emergency (not voltage for non-electrical issues)
- MANDATORY: Performance validation must check for emergency-specific issues (refrigerant bubbles in sight glass, pressure fluctuations, temperature stability)
- MANDATORY: Documentation requirements must include emergency-specific items (EPA forms for refrigerant, insurance for water damage, fire marshal report)
- FORBIDDEN: Using "power restoration" language for non-power emergencies
- FORBIDDEN: Generic recovery steps that don't address the specific emergency type
-->
<h3>${emergencyType.includes('Power') ? 'Power Restoration' : emergencyType.includes('Refrigerant') ? 'Leak Recovery' : emergencyType.includes('Fire') || emergencyType.includes('Smoke') ? 'Fire Recovery' : emergencyType.includes('Temperature') ? 'Temperature Recovery' : emergencyType.includes('Pressure') ? 'Pressure Normalization' : 'Emergency Recovery'} and Equipment Recovery Procedures</h3>
<p>Follow these steps in sequence to safely restore the \${manufacturer} \${modelNumber} to normal operation after power has been restored:</p>

<ol>
  <li>
    <strong>Power Restoration Verification</strong>
    <p>Confirm stable power supply is available at all distribution levels:</p>
    <ul>
      <li>Verify utility power restoration at main switchgear</li>
      <li>Check automatic transfer switch position (should be on "Normal" source)</li>
      <li>Confirm voltage readings at equipment disconnect: <input type="text" placeholder="Enter voltage" style="width:100px" /> VAC</li>
      <li>Verify phase rotation if applicable</li>
    </ul>
  </li>
  
  <li>
    <strong>Pre-Start Safety Checks</strong>
    <p>Complete all safety verifications before energizing equipment:</p>
    <ul>
      <li>Verify all LOTO devices have been removed</li>
      <li>Confirm no personnel are working on the \${manufacturer} \${modelNumber}</li>
      <li>Reset all emergency stops and safety interlocks</li>
      <li>Check control power availability: <input type="text" placeholder="Control voltage" style="width:100px" /> VAC</li>
    </ul>
  </li>
  
  <li>
    <strong>Equipment-Specific Restart Sequence</strong>
    <p>Follow the manufacturer-specific startup procedure for \${manufacturer} \${component} (Model: \${modelNumber}):</p>
    <!-- MANDATORY: Break down into detailed sub-steps specific to the make/model -->
    <ul>
      <li><strong>Step 3.1:</strong> Turn main disconnect to "ON" position for \${manufacturer} \${component}</li>
      <li><strong>Step 3.2:</strong> Wait for control power initialization (typically 30-60 seconds for \${manufacturer} controls)</li>
      <li><strong>Step 3.3:</strong> Verify control panel indicators:
        <ul>
          <li>Power LED: <input type="checkbox" /> Green/On</li>
          <li>Fault LED: <input type="checkbox" /> Off/Clear</li>
          <li>Run Status: <input type="checkbox" /> Ready</li>
        </ul>
      </li>
      <li><strong>Step 3.4:</strong> Clear any alarms present on the \${manufacturer} control panel:
        <ul>
          <li>Press [specific button sequence for \${manufacturer}]</li>
          <li>Verify all alarms cleared: <input type="checkbox" /></li>
        </ul>
      </li>
      <li><strong>Step 3.5:</strong> Initiate startup sequence specific to \${manufacturer} \${modelNumber}:
        <ul>
          <li>For Carrier: Press "Auto" on CCN controller</li>
          <li>For Trane: Select "Auto" mode on Tracer panel</li>
          <li>For York: Press "Start" on OptiView panel</li>
          <li>[Generate specific startup procedure for \${manufacturer}]</li>
        </ul>
      </li>
      <li><strong>Step 3.6:</strong> Monitor startup sequence (typical duration for \${component}: [X] minutes)</li>
      <li><strong>Step 3.7:</strong> Record startup time: <input type="text" placeholder="HH:MM" style="width:80px" /></li>
      <li><strong>Step 3.8:</strong> Verify successful start:
        <ul>
          <li>No abnormal sounds/vibrations: <input type="checkbox" /></li>
          <li>Oil pressure (if applicable): <input type="text" placeholder="PSI" style="width:60px" /> PSI</li>
          <li>Discharge pressure normal: <input type="checkbox" /></li>
        </ul>
      </li>
    </ul>
  </li>
  
  <li>
    <strong>System Functionality Verification</strong>
    <p>Monitor critical parameters during the startup phase:</p>
    <table>
      <tr>
        <th>Parameter</th>
        <th>Expected Range</th>
        <th>Actual Reading</th>
        <th>Pass/Fail</th>
      </tr>
      <tr>
        <td>Operating Voltage</td>
        <td>[Insert EXACT voltage for \${modelNumber}, e.g., "460V ±10%" or "480V ±5%"]</td>
        <td>
          <!-- For 3-phase systems, provide 3 fields -->
          L1-L2: <input type="text" placeholder="V" style="width:50px" />V
          L2-L3: <input type="text" placeholder="V" style="width:50px" />V
          L3-L1: <input type="text" placeholder="V" style="width:50px" />V
        </td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td>Operating Current</td>
        <td>[Insert EXACT FLA for \${modelNumber}, e.g., "325A" or "450A"]</td>
        <td>
          <!-- For 3-phase systems, provide 3 fields -->
          L1: <input type="text" placeholder="A" style="width:50px" />A
          L2: <input type="text" placeholder="A" style="width:50px" />A
          L3: <input type="text" placeholder="A" style="width:50px" />A
        </td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td>Flow Rate (if applicable)</td>
        <td>[Insert EXACT GPM for \${modelNumber}, e.g., "1200 GPM" or "850 GPM"]</td>
        <td><input type="text" placeholder="GPM" style="width:100px" /> GPM</td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td>Differential Pressure</td>
        <td>[Insert EXACT PSID for \${modelNumber}, e.g., "12 PSID" or "15 PSID"]</td>
        <td><input type="text" placeholder="PSID" style="width:100px" /> PSID</td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td>Temperature (Supply/Return)</td>
        <td>[Insert EXACT temps for \${modelNumber}, e.g., "44°F/54°F"]</td>
        <td>
          Supply: <input type="text" placeholder="°F" style="width:50px" />°F
          Return: <input type="text" placeholder="°F" style="width:50px" />°F
        </td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td>Control System Status</td>
        <td>Normal/No Alarms</td>
        <td><input type="text" placeholder="Status" style="width:100px" /></td>
        <td><input type="checkbox" /></td>
      </tr>
    </table>
  </li>
  
  <li>
    <strong>Load Transfer (if applicable)</strong>
    <p>For equipment with redundant systems or bypass capabilities:</p>
    <ul>
      <li>Gradually transfer load from backup to primary equipment</li>
      <li>Monitor load percentage: <input type="text" placeholder="% Load" style="width:80px" /></li>
      <li>Verify stable operation at each load increment</li>
      <li>Document final load distribution</li>
    </ul>
  </li>
  
  <li>
    <strong>Performance Validation</strong>
    <p>Confirm equipment is operating within normal parameters:</p>
    <ul>
      <li>Run equipment for minimum 15 minutes under normal load</li>
      <li>Verify all operational setpoints are correct</li>
      <li>Check for unusual noises, vibrations, or odors</li>
      <li>Confirm all auxiliary systems are functioning</li>
    </ul>
  </li>
  
  <li>
    <strong>Return to Normal Operation</strong>
    <p>Complete recovery documentation and notifications:</p>
    <ul>
      <li>Document all readings and observations</li>
      <li>Update equipment log book</li>
      <li>Notify operations team of successful restoration</li>
      <li>Clear any active alarms in monitoring systems</li>
      <li>Restoration completed by: <input type="text" placeholder="Name" style="width:200px" /> at <input type="text" placeholder="Time" style="width:80px" /></li>
    </ul>
  </li>
</ol>`;
}