export function getSection04Scenarios() {
  return `<h2>Section 04: External Power Supply Scenarios</h2>
<!-- MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Generate 4 completely different scenarios based on the specific emergency type selected
- MANDATORY: For Power/Electrical emergencies (Power Failure, VFD Failure, Loss of Electrical Power): Use power supply scenarios as currently written
- MANDATORY: For Pressure emergencies (High Discharge Pressure, Low Suction Pressure): Generate pressure-related scenarios (gradual increase, sudden spike, multiple circuit issues, refrigerant charge issues)
- MANDATORY: For Temperature emergencies (High Water Temp, High Temp Alarm, Extreme Ambient, Frost Coil): Generate thermal scenarios (heat rejection failure, flow restriction, ambient conditions, load imbalance)
- MANDATORY: For Refrigerant emergencies (Refrigerant Leak Detection): Generate leak scenarios (minor leak <25ppm, major leak >100ppm, catastrophic rupture, multiple circuit leaks)
- MANDATORY: For Mechanical emergencies (Compressor/Fan/Pump Failure, Bearing Failure, Vibration, Gear Box): Generate mechanical failure scenarios (bearing wear, coupling failure, impeller damage, motor failure)
- MANDATORY: For Flow emergencies (Chilled/Condenser Water Flow, Loss of Airflow, Cavitation, Air Locked): Generate flow disruption scenarios (blockage, pump failure, valve position, air entrainment)
- MANDATORY: For Control emergencies (Control System Failure, Communication Loss, BMS Failure): Generate control scenarios (local control loss, network failure, sensor failure, setpoint drift)
- MANDATORY: For Water emergencies (Water Leak, Condensate Alarm, Blocked Strainer): Generate water-related scenarios (pipe leak, drain blockage, condensate overflow, strainer clog)
- MANDATORY: For Safety emergencies (Fire/Smoke, Emergency Override): Generate safety scenarios (detector activation zones, suppression system status, evacuation requirements, override locations)
- MANDATORY: Each scenario must include emergency-specific verification tables with appropriate measurements (PSI for pressure, °F for temperature, PPM for refrigerant, dB/in/sec for vibration, GPM for flow, etc.)
- FORBIDDEN: Using voltage/electrical checks for non-electrical emergencies
- FORBIDDEN: Generic "power" language in scenarios for non-power emergencies
-->

Generate 4 scenarios based on the SPECIFIC EQUIPMENT TYPE and its typical installation:

<h3>SCENARIO 1 - PRIMARY POWER SOURCE FAILURE</h3>
[Adapt based on equipment: utility for most equipment, upstream UPS for critical loads, generator for emergency systems, etc.]
<div style="background: #f8d7da; color: #721c24; border: 2px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; font-weight: bold;">
Trigger Conditions: (specific to how this equipment is typically powered)
</div>
Verification Checks: (specific to this equipment's power source)
<table>
Include verification steps with input fields for readings
</table>

<h3>SCENARIO 2 - DISTRIBUTION FAILURE</h3>
[Adapt based on equipment: MCC for motors, PDU for IT equipment, panelboard for HVAC, switchgear for large equipment, etc.]
<div style="background: #f8d7da; color: #721c24; border: 2px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; font-weight: bold;">
Trigger Conditions: (specific to this equipment's distribution type)
</div>
Verification Checks: (appropriate for the distribution equipment)
<table>
Include verification steps with input fields for readings
</table>

<h3>SCENARIO 3 - FEEDER/CIRCUIT FAILURE</h3>
[Adapt based on equipment: cable types, voltage levels, typical routing for this equipment]
<div style="background: #f8d7da; color: #721c24; border: 2px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; font-weight: bold;">
Trigger Conditions: (based on this equipment's typical circuit configuration)
</div>
Verification Checks: (appropriate tests for this voltage level and cable type)
<table>
Include verification steps with input fields for readings
</table>

<h3>SCENARIO 4 - LOCAL PROTECTION DEVICE FAILURE</h3>
[Adapt based on equipment: disconnect type, breaker size, fusing, etc.]
<div style="background: #f8d7da; color: #721c24; border: 2px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; font-weight: bold;">
Trigger Conditions: (specific to protection devices used with this equipment)
</div>
Verification Checks: (appropriate for this equipment's protection scheme)
<table>
Include verification steps with input fields for readings
</table>

For EACH scenario:
- Tailor all checks to the specific equipment type
- Include voltage levels appropriate for this equipment
- Reference correct upstream systems for this equipment type
- Include relevant safety considerations for the voltage/current levels
- List appropriate spare parts for this specific equipment
- Include escalation contacts relevant to this equipment type

IMPORTANT EQUIPMENT-SPECIFIC ADAPTATIONS:
- If equipment is a CHILLER: Focus on 3-phase power (typically 480V), VFDs, control transformers (24V or 120V control), compressor contactors
- If equipment is a UPS: Focus on input/output voltages, bypass sources, DC bus voltage, battery strings
- If equipment is a GENERATOR: Focus on starting batteries (12V or 24V DC), transfer switches, control power, field excitation
- If equipment is a PDU: Focus on input breakers, monitoring circuits, branch circuits, transformer taps
- If equipment is a CRAC/CRAH: Focus on fan motors, control power (24VAC typical), humidification power, reheat elements
- If equipment is SWITCHGEAR: Focus on bus voltage, protection relays, control power (125VDC typical), breaker charging motors
- Adapt accordingly for any other equipment type`;
}