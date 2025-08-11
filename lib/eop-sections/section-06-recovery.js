export function getSection06Recovery() {
  return `<h2>Section 06: Recovery & Return to Service</h2>
<h3>Power Restoration and Equipment Recovery Procedures</h3>
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
    <p>Follow the manufacturer-specific startup procedure for \${manufacturer} \${modelNumber}:</p>
    <ul>
      <li>Turn main disconnect to "ON" position</li>
      <li>Verify control panel indicators show normal status</li>
      <li>Clear any alarms present on the control panel</li>
      <li>Initiate startup sequence per manufacturer's procedure</li>
      <li>Record startup time: <input type="text" placeholder="HH:MM" style="width:80px" /></li>
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
        <td>Per equipment nameplate</td>
        <td><input type="text" placeholder="Reading" style="width:100px" /></td>
        <td><input type="checkbox" /></td>
      </tr>
      <tr>
        <td>Operating Current</td>
        <td>Within FLA rating</td>
        <td><input type="text" placeholder="Reading" style="width:100px" /></td>
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