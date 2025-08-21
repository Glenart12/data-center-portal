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
    Generate Section 04: Effect of MOP on Critical Facility for data center equipment.
    
    Equipment: ${formData.manufacturer} ${formData.modelNumber}
    Component Type: ${formData.componentType || formData.system}
    Equipment ID: ${formData.equipmentNumber}
    Maintenance: ${formData.workDescription || formData.description}
    
    CRITICAL RULES:
    1. Equipment cannot be "not affected" by its own maintenance
    2. If it's a chiller/CRAC/CRAH → Critical Cooling System = YES
    3. If it's a UPS → UPS System = YES
    4. If it's a generator → Emergency Generator = YES
    
    For ${formData.workDescription || formData.description}, research what's involved:
    - Does it require shutdown? → Affected systems = YES
    - Does it require electrical isolation? → Electrical Utility = YES
    - Does it have motors/compressors? → Mechanical System = YES
    - Annual/Semi-Annual maintenance? → Lockout/Tagout = YES
    - ANY equipment maintenance → Monitoring System = YES
    - BAS/BMS connected? → Control System = YES
    
    Generate ONLY the table body rows (<tr> tags) with:
    - Each system name in first column
    - ✓ in appropriate Yes/No/N/A column with class="checkbox"
    - Detailed explanation in Details column for YES items
    
    Format exactly like this for each row:
    <tr>
      <td>System Name</td>
      <td class="checkbox">✓</td>
      <td class="checkbox"></td>
      <td class="checkbox"></td>
      <td>Detailed explanation why affected</td>
    </tr>
    
    Include ALL 20 systems from the standard facility impact table.
    Be ACCURATE - a chiller maintenance MUST show cooling system affected!
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