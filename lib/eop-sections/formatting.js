export function getFormattingInstructions() {
  return `
CRITICAL FORMATTING REQUIREMENTS:
- DO NOT generate DOCTYPE, html, head, body tags or container div
- Start with <h1>Emergency Operating Procedure (EOP)</h1>
- Use H2 for section headers: "Section 01:", "Section 02:", etc. (with zero-padded numbers)
- Use H3 for subsection headers
- Use red (color: #dc3545) for all emergency warnings and critical actions
- Replace ANY placeholder text with proper input fields
- Use CSS classes: .emergency-action, .emergency-warning, .critical-text
- Make tables professional with proper styling and borders
- Generate COMPLETE content with NO placeholders`;
}