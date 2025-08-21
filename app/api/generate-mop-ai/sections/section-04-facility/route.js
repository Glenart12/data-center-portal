import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateSection04(formData, sourceManager) {
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
  
  STEP 1: IDENTIFY what this equipment IS and what it DOES
  - Research ${formData.manufacturer} ${formData.modelNumber}
  - Understand its function in the data center
  - Identify what systems it belongs to or supports
  
  STEP 2: UNDERSTAND the maintenance scope
  - ${formData.workDescription || formData.description} typically involves what tasks?
  - Does it require equipment shutdown?
  - Does it require electrical isolation?
  - What components are serviced?
  
  STEP 3: APPLY THESE UNIVERSAL RULES
  - Equipment cannot be "not affected" by its own maintenance
  - If equipment IS part of a system, that system = YES
  - Monitoring System = ALWAYS YES for any maintenance
  - Annual/Semi-Annual maintenance = Lockout/Tagout YES
  - If equipment has electrical components = consider Electrical Utility
  - If equipment has motors/pumps/compressors = Mechanical System YES
  - If BAS/BMS controlled = Control System & Building Automation YES
  
  STEP 4: EQUIPMENT-SPECIFIC LOGIC
  - Cooling equipment (chiller/CRAC/CRAH) → Critical Cooling = YES
  - Power equipment (UPS/PDU/switchgear) → Critical Power = YES  
  - Generator → Emergency Generator = YES
  - Transfer switch → Transfer Switch & Emergency Generator = YES
  - Air handlers/fans → Ventilation = YES
  - Pumps → Mechanical & related water systems = YES
  
  Generate EXACTLY these 20 rows with accurate assessments:
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
  19. Building Automation System
  20. Transfer Switch System
  
  Format each row EXACTLY like this:
  <tr>
    <td>System Name</td>
    <td class="checkbox">✓</td>
    <td class="checkbox"></td>
    <td class="checkbox"></td>
    <td>Specific explanation why affected</td>
  </tr>
  
  Research the ACTUAL equipment and be ACCURATE!
  Generate ONLY the 20 <tr> rows.
`;

  try {
    const result = await model.generateContent(prompt);
    const tableContent = result.response.text();
    
    return `
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
  } catch (error) {
    console.error('Error generating Section 04:', error);
    throw error;
  }
}