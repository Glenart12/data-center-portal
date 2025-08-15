import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const { manufacturer, modelNumber, system, workDescription } = formData;
    
    // Use AI to generate comprehensive risks and assumptions
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
    
    const risksPrompt = `Generate exactly 8 detailed risks for ${manufacturer} ${modelNumber} ${system} ${workDescription || 'maintenance'}.
    
    CRITICAL ACCURACY REQUIREMENTS:
    - Research actual manufacturer specifications and known issues for ${manufacturer} ${modelNumber}
    - Use real regulatory requirements and industry standards
    - Base risks on accurate technical data and documented equipment characteristics
    - DO NOT make up specific technical values or manufacturer details
    - If specific data is not known, mark risks as "VERIFY WITH MANUFACTURER" or "SITE-SPECIFIC REQUIREMENT"
    - Focus on realistic, equipment-specific risks rather than generic maintenance risks
    
    Format as HTML table rows only. DO NOT include <table> tags or headers, just the <tr> rows.
    DO NOT use markdown code blocks or backticks.
    
    Each row should have 5 columns:
    1. Risk Category (e.g., Operational, Safety, Environmental, Technical, Schedule)
    2. Description (specific risk description based on actual equipment characteristics)
    3. Likelihood (High/Medium/Low - based on real equipment reliability data when available)
    4. Impact (High/Medium/Low - based on actual system criticality) 
    5. Mitigation Strategy (detailed prevention/response using real procedures and standards)
    
    Include equipment-specific risks such as:
    - Known failure modes for this equipment type and manufacturer
    - Actual regulatory compliance requirements
    - Real environmental factors affecting this specific equipment
    - Documented safety hazards for this equipment class
    - Realistic schedule risks based on equipment complexity
    
    Example format:
    <tr>
        <td><strong>Operational</strong></td>
        <td>Equipment failure during startup testing (specific to ${manufacturer} ${system} characteristics)</td>
        <td>Medium</td>
        <td>High</td>
        <td>Follow manufacturer's specific startup procedures, verify all prerequisite checks per ${manufacturer} documentation</td>
    </tr>`;
    
    const risksResult = await model.generateContent(risksPrompt);
    let risks = risksResult.response.text();
    
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
    risks = risks.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    assumptions = assumptions.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

    const html = `<h2>Section 07: MOP Risks & Assumptions</h2>
<p><strong>Risk Assessment and Key Assumptions</strong></p>

<h3>Risk Analysis Matrix</h3>
<table>
    <thead>
        <tr>
            <th>Risk Category</th>
            <th>Description</th>
            <th>Likelihood</th>
            <th>Impact</th>
            <th>Mitigation Strategy</th>
        </tr>
    </thead>
    <tbody>
        ${risks}
        <tr>
            <td><strong>Operational</strong></td>
            <td>Discovery of additional defects during maintenance requiring extended downtime</td>
            <td>Medium</td>
            <td>High</td>
            <td>Have contingency plan approved by management. Maintain clear communication channels for immediate escalation. Have manufacturer technical support contact available</td>
        </tr>
        <tr>
            <td><strong>Environmental</strong></td>
            <td>Weather conditions affecting outdoor equipment (for rooftop units)</td>
            <td>Low</td>
            <td>Medium</td>
            <td>Monitor weather forecasts 48 hours in advance. Have protective covers ready. Establish weather-related abort criteria</td>
        </tr>
    </tbody>
</table>

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

<p><strong>Critical Decision Points:</strong></p>
<ul>
    <li>If redundant equipment fails during maintenance - STOP work and return primary unit to service</li>
    <li>If major defects are discovered - Escalate to Chief Engineer for go/no-go decision</li>
    <li>If weather conditions deteriorate (outdoor equipment) - Implement weather abort procedures</li>
    <li>If estimated completion time exceeds approved window - Notify management for extension approval</li>
</ul>`;

    return NextResponse.json({ html, sources: [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}