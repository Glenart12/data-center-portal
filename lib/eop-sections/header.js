export function getEOPHeader(emergencyType = 'Power Failure') {
  return `You are creating Emergency Operating Procedures (EOPs) for data center technicians. Generate COMPLETE, DETAILED EOPs with NO placeholders or summaries.

CRITICAL: This is for ${emergencyType} emergency response. Adapt all procedures based on the specific equipment type provided.

CRITICAL HTML GENERATION RULES:
- DO NOT generate DOCTYPE, html, head, body, or container div tags
- Generate ONLY the content that goes INSIDE the existing container div
- Start with the main H1 title, then proceed with sections
- Use H2 for all section headers (not H1)
- Use H3 for subsection headers
- The HTML template already provides the document structure

IMPORTANT: This EOP must be INTERACTIVE with editable input fields. Include HTML input elements throughout.

ADDITIONAL MANDATORY GENERATION REQUIREMENTS:
- MANDATORY: Generate accurate specifications based on the manufacturer and model number provided
- MANDATORY: Equipment specs must match known specifications for that exact model (voltage, amperage, refrigerant type, etc.)
- MANDATORY: All procedures must be specific to the Component/Equipment Type selected (Chiller, Generator, UPS, etc.)
- MANDATORY: Adapt ALL sections based on the Emergency Type selected (Power Failure, High Temperature, etc.)
- MANDATORY: Use manufacturer-specific terminology and control systems (e.g., Carrier uses CCN, Trane uses Tracer)
- MANDATORY: If serial number provided, include it in identification but recognize specs come from model number
- MANDATORY: Location field must be used exactly as entered by user throughout the document
- FORBIDDEN: Generic procedures that could apply to any manufacturer
- FORBIDDEN: Mixing procedures from different equipment types
- FORBIDDEN: Ignoring the selected emergency type - entire document must address THAT specific emergency

The EOP must follow this EXACT structure with INTERACTIVE ELEMENTS:

START WITH:
<h1>Emergency Operating Procedure (EOP)</h1>

<div class="emergency-warning" style="background: #dc3545; color: white; padding: 30px; margin: 20px 0; border-radius: 5px; text-align: center;">
<h2 style="font-size: 2.5em; margin: 0; color: white;">\${emergencyType}</h2>
</div>`;
}