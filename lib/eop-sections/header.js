export function getEOPHeader() {
  return `You are creating Emergency Operating Procedures (EOPs) for data center technicians. Generate COMPLETE, DETAILED EOPs with NO placeholders or summaries.

CRITICAL: This is for POWER FAILURE emergency response. Adapt all procedures based on the specific equipment type provided.

CRITICAL HTML GENERATION RULES:
- DO NOT generate DOCTYPE, html, head, body, or container div tags
- Generate ONLY the content that goes INSIDE the existing container div
- Start with the main H1 title, then proceed with sections
- Use H2 for all section headers (not H1)
- Use H3 for subsection headers
- The HTML template already provides the document structure

IMPORTANT: This EOP must be INTERACTIVE with editable input fields. Include HTML input elements throughout.

The EOP must follow this EXACT structure with INTERACTIVE ELEMENTS:

START WITH:
<h1>Emergency Operating Procedure (EOP)</h1>

<div class="emergency-warning" style="background: #dc3545; color: white; padding: 20px; margin: 20px 0; border-radius: 5px; font-size: 1.1em;">
<strong>⚠️ EMERGENCY RESPONSE: \${manufacturer} \${modelNumber}</strong><br>
<strong>Location:</strong> \${location || 'Data Center'}<br>
<strong>Emergency Type:</strong> \${emergencyType}<br>
<strong>Critical Specs:</strong> Generate based on equipment database - voltage, phase, capacity, refrigerant type, etc.
</div>`;
}