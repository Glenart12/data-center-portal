import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export async function generateSection06(formData) {
  try {
    const { manufacturer, modelNumber, system, workDescription, serialNumber, equipmentNumber } = formData;
    
    // Use AI to generate assumptions only (no risks)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 30000,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
      tools: [{
        googleSearch: {}
      }]
    });
    
    const assumptionsPrompt = `Generate exactly 6 key assumptions for ${manufacturer} ${modelNumber} ${system} maintenance.
    
    CRITICAL ACCURACY REQUIREMENTS:
    - Base assumptions on real manufacturer specifications and requirements
    - Use actual industry standards and regulatory requirements
    - Reference genuine equipment characteristics and maintenance needs
    - DO NOT make up specific technical requirements or manufacturer procedures
    - If specific requirements are not known, mark as "VERIFY WITH MANUFACTURER" or "SITE-SPECIFIC REQUIREMENT"
    - Focus on realistic assumptions based on actual equipment and industry practices
    
    Include assumptions about: equipment condition, spare parts availability, system redundancy, environmental conditions, personnel qualifications, and system documentation.
    
    Format as HTML table rows only. DO NOT include <table> tags or headers, just the <tr> rows.
    DO NOT use markdown code blocks or backticks.
    
    Each row should have 2 columns:
    1. Assumption Category (e.g., Equipment, Personnel, Environment, Resources, Documentation)
    2. Assumption Description (based on real requirements and industry standards)
    
    Example format:
    <tr>
        <td><strong>Equipment</strong></td>
        <td>Equipment is in good operating condition per ${manufacturer} maintenance guidelines (VERIFY WITH MANUFACTURER for specific condition requirements)</td>
    </tr>`;
    
    const assumptionsResult = await model.generateContent(assumptionsPrompt);
    let assumptions = assumptionsResult.response.text();
    
    // Clean up any markdown code blocks from AI output
    assumptions = assumptions.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

    const html = `<h2>Section 06: MOP Assumptions</h2>

<h3>Key Project Assumptions</h3>
<table>
    <thead>
        <tr>
            <th>Category</th>
            <th>Assumption</th>
        </tr>
    </thead>
    <tbody>
        ${assumptions}
        <tr>
            <td><strong>Resources</strong></td>
            <td>All required test equipment is calibrated and available on-site</td>
        </tr>
        <tr>
            <td><strong>Infrastructure</strong></td>
            <td>The facility's electrical and mechanical infrastructure can support equipment isolation without affecting other critical systems</td>
        </tr>
        <tr>
            <td><strong>Management</strong></td>
            <td>Management approval has been obtained for the maintenance window and potential risks have been communicated to stakeholders</td>
        </tr>
    </tbody>
</table>

<p><strong>Critical Decision Points for ${manufacturer} ${modelNumber} (Unit: ${equipmentNumber || 'TBD'}, Serial: ${serialNumber || 'TBD'}):</strong></p>
<ul>
    <li>If redundant ${system} fails while performing ${workDescription || 'maintenance'} on ${manufacturer} ${modelNumber} ${equipmentNumber || ''} - STOP work immediately and return primary ${modelNumber} to service following ${manufacturer} restart procedures</li>
    <li>If ${system.toLowerCase().includes('chiller') ? 'refrigerant leak detected' : system.toLowerCase().includes('ups') ? 'battery failure detected' : system.toLowerCase().includes('generator') ? 'fuel leak detected' : 'major defect discovered'} on ${manufacturer} ${modelNumber} unit ${equipmentNumber || 'TBD'} - Escalate to Chief Engineer for immediate go/no-go decision</li>
    <li>If ${system.toLowerCase().includes('chiller') ? 'chilled water temperature rises above setpoint' : system.toLowerCase().includes('ups') ? 'critical load transfer fails' : system.toLowerCase().includes('generator') ? 'automatic transfer switch fails to operate' : 'system parameters exceed normal ranges'} during ${workDescription || 'maintenance'} on unit ${equipmentNumber || 'TBD'} - Implement emergency ${system} recovery procedures</li>
    <li>If ${workDescription || 'maintenance'} reveals ${system.toLowerCase().includes('chiller') ? 'compressor damage' : system.toLowerCase().includes('ups') ? 'inverter failure' : system.toLowerCase().includes('generator') ? 'alternator issues' : 'component failure'} on ${manufacturer} ${modelNumber} ${equipmentNumber || ''} - Notify management for extended maintenance window approval</li>
    <li>If building automation system shows critical alarms for ${manufacturer} ${modelNumber} during ${workDescription || 'maintenance'} - Verify with BMS operator before continuing work on unit ${equipmentNumber || 'TBD'}</li>
</ul>`;

    return { html, sources: [] };
  } catch (error) {
    console.error('Section 07 generation error:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const result = await generateSection07(formData);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}