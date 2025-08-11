export function getSection02PurposeScope() {
  return `<h2>Section 02: Purpose & Scope</h2>
<!-- MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Replace "power failure emergencies" with the actual emergency type selected from the form
- MANDATORY: Purpose must state the specific goal based on emergency type (restore power, stop leak, reduce pressure, etc.)
- MANDATORY: Scope must reference the specific Component/Equipment Type (Chiller, Generator, UPS, CRAC, CRAH, Pump, etc.)
- MANDATORY: Activation Criteria must list the actual triggers for THIS emergency type, not generic power loss
- MANDATORY: Activation Criteria must include equipment-specific alarm points, pressure limits, or failure indicators
- MANDATORY: Safety Notice must include hazards specific to the equipment type (refrigerant, high voltage, rotating equipment, batteries, fuel, etc.)
- MANDATORY: Safety Notice must include hazards specific to the emergency type (electrical, chemical, thermal, mechanical)
- MANDATORY: Use the Location field exactly as entered throughout this section
- FORBIDDEN: Using "power failure" language when the emergency is not power-related
- FORBIDDEN: Generic activation criteria that don't match the selected emergency type
-->
<p><strong>Purpose:</strong> This Emergency Operating Procedure provides step-by-step instructions for responding to power failure emergencies affecting the \${manufacturer} \${modelNumber} \${system}. This document ensures rapid, safe, and effective response to restore critical infrastructure operations.</p>
<p><strong>Scope:</strong> This procedure applies to all data center operations personnel, facilities engineers, and emergency response teams responsible for maintaining the \${manufacturer} \${modelNumber} and associated critical infrastructure systems.</p>
<p><strong>Activation Criteria:</strong> This EOP shall be activated when power loss is detected or suspected on the \${manufacturer} \${modelNumber}, including but not limited to: utility power outages, automatic transfer switch failures, distribution panel failures, circuit breaker trips, or equipment-specific power supply failures.</p>
<p><strong>Safety Notice:</strong> All personnel must follow proper electrical safety procedures, use appropriate PPE, and verify de-energization before working on any electrical equipment.</p>`;
}