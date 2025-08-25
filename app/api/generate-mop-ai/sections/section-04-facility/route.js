import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateSection04(formData) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 15000,
    }
  });

  const prompt = `
  Generate Section 04: Effect of MOP on Critical Facility for data center equipment maintenance.
  
  EQUIPMENT DETAILS:
  Manufacturer: ${formData.manufacturer}
  Model: ${formData.modelNumber}
  Component Type: ${formData.componentType || formData.system}
  Maintenance Type: ${formData.workDescription || formData.description}
  
  The AI must follow this four-step analysis process:
  
  STEP 1: Identify the ${formData.manufacturer} ${formData.modelNumber} equipment function and role in data center
  - What type of equipment is this?
  - What is its primary function?
  - What systems does it belong to or support?
  
  STEP 2: Analyze maintenance scope for ${formData.workDescription || formData.description}
  - What specific tasks are involved?
  - Does it require equipment shutdown?
  - Does it require electrical isolation?
  - What components will be serviced?
  
  STEP 3: Apply universal rules:
  - Monitoring System is ALWAYS YES
  - Annual/Semi-Annual maintenance requires Lockout/Tagout = YES
  - Equipment being maintained is always affected by its own maintenance
  
  STEP 4: Apply equipment-specific logic based on ${formData.componentType || formData.system}
  
  CRITICAL DECISION LOGIC (USE THIS TO DETERMINE YES/NO/N/A):
  
  FOR UPS WORK:
  - Uninterruptible Power Supply (UPS) = YES
  - Critical Power Distribution System = YES (if UPS feeds critical loads)
  - Electrical Utility Equipment = YES (if working on input/output breakers)
  - Monitoring System = YES (always)
  - Control System = YES (if BMS integrated)
  - Lockout/Tagout = YES (for annual/semi-annual)
  - Most other systems = NO or N/A
  
  FOR CHILLER/COOLING WORK:
  - Critical Cooling System = YES
  - Mechanical System = YES
  - Monitoring System = YES (always)
  - Control System = YES (if BMS controlled)
  - Building Automation System = YES (if BAS integrated)
  - Water/Leak Detection = YES (if water-cooled)
  - Lockout/Tagout = YES (for annual/semi-annual)
  - Power systems = NO unless electrical work involved
  
  FOR GENERATOR WORK:
  - Emergency Generator System = YES
  - Transfer Switch System = YES (if ATS testing involved)
  - Electrical Utility Equipment = YES (if paralleling with utility)
  - Monitoring System = YES (always)
  - Control System = YES
  - Lockout/Tagout = YES (for major maintenance)
  - Cooling systems = NO unless generator cooling affected
  
  FOR ELECTRICAL DISTRIBUTION:
  - Critical Power Distribution System = YES
  - Electrical Utility Equipment = YES
  - Emergency Power Off (EPO) = Check if EPO circuits affected
  - Monitoring System = YES (always)
  - Lockout/Tagout = YES
  - UPS = YES only if downstream of UPS
  
  FOR VISUAL INSPECTION/MONITORING ONLY:
  - Monitoring System = YES (always)
  - All other systems = NO or N/A (no physical work performed)
  - Lockout/Tagout = NO (no hazardous energy exposure)
  - Work performed hot = NO (observation only)
  
  Generate EXACTLY these 18 rows with intelligent YES/NO/N/A decisions:
  1. Electrical Utility Equipment
  2. Emergency Generator System
  3. Critical Cooling System
  4. Ventilation System
  5. Mechanical System
  6. Uninterruptible Power Supply (UPS)
  7. Critical Power Distribution System
  8. Emergency Power Off (EPO)
  9. Fire Detection Systems
  10. Fire Suppression System
  11. Monitoring System
  12. Control System
  13. Security System
  14. General Power and Lighting System
  15. Lockout/Tagout Required?
  16. Work to be performed "hot"?
  17. Radio interference potential?
  18. Water/Leak Detection System
  
  Format each row EXACTLY like this:
  <tr>
    <td>System Name</td>
    <td class="checkbox">✓</td>
    <td class="checkbox"></td>
    <td class="checkbox"></td>
    <td>Specific explanation why affected</td>
  </tr>
  
  IMPORTANT RULES:
  - Place a checkmark (✓) in the appropriate column (Yes, No, or N/A) based on your analysis
  - Only put ✓ in ONE column per row. Leave other columns empty
  - CRITICAL: If system is marked NO or N/A, leave the description cell COMPLETELY EMPTY (no text at all)
  - Only generate descriptions for systems marked YES
  
  Generate ONLY the 18 <tr> rows.
`;

  try {
    const result = await model.generateContent(prompt);
    let tableContent = result.response.text();
    
    // Clean up any markdown code blocks from AI output
    tableContent = tableContent.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    
    const html = `
      <h2>Section 04: Effect of MOP on Critical Facility</h2>
      <table>
        <thead>
          <tr>
            <th>Facility Equipment or System</th>
            <th width="60">Yes</th>
            <th width="60">No</th>
            <th width="60">N/A</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${tableContent}
        </tbody>
      </table>
    `;
    
    return { html, sources: [] };
  } catch (error) {
    console.error('Error generating Section 04:', error);
    throw error;
  }
}