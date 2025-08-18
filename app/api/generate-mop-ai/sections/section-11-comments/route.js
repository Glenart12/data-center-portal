import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export async function generateSection11(formData) {
  try {
    const { manufacturer, modelNumber, system, workDescription } = formData;
    
    // Use AI to generate relevant comments
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
    
    const commentsPrompt = `Generate 5 relevant MOP comments for ${manufacturer} ${modelNumber} ${system} ${workDescription || 'maintenance'}.
    
    CRITICAL ACCURACY REQUIREMENTS:
    - Research actual ${manufacturer} ${modelNumber} maintenance requirements and known issues
    - Use real manufacturer specifications and documented maintenance intervals
    - Base recommendations on genuine industry standards and regulatory requirements
    - DO NOT make up specific technical values, part numbers, or maintenance frequencies
    - If specific data is not known, mark as "VERIFY WITH MANUFACTURER" or "SITE-SPECIFIC REQUIREMENT"
    - Reference actual equipment characteristics and documented maintenance practices
    - Use real safety standards and regulatory requirements
    
    Include:
    1. A note about maintenance frequency (based on actual manufacturer recommendations or mark as "VERIFY WITH MANUFACTURER")
    2. Special tools or parts requirements (based on real requirements or mark as "REFER TO MANUFACTURER MANUAL")
    3. Common issues to watch for (based on documented equipment characteristics or mark as "CONSULT MANUFACTURER SERVICE BULLETINS")
    4. Documentation requirements (based on actual regulatory and manufacturer requirements)
    5. Future recommendations (based on real industry practices or mark as "SITE-SPECIFIC REQUIREMENT")
    
    Format as complete HTML unordered list with list items. DO NOT use markdown code blocks or backticks.
    Example: 
    <ul>
    <li>Maintenance frequency should follow ${manufacturer} recommendations (VERIFY WITH MANUFACTURER MANUAL).</li>
    <li>Special tools required per ${manufacturer} service procedures (REFER TO MANUFACTURER TOOL LIST).</li>
    </ul>`;
    
    const result = await model.generateContent(commentsPrompt);
    let generatedComments = result.response.text();
    
    // Clean up any markdown code blocks from AI output
    generatedComments = generatedComments.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

    const html = `<h2>Section 11: MOP Comments</h2>
<p><strong>MOP Comments</strong></p>
${generatedComments}
<ul>
    <li>This MOP is valid for one year from the approval date and must be reviewed/updated if equipment modifications occur.</li>
    <li>All test data and readings must be recorded in the equipment log book and uploaded to the CMMS within 48 hours.</li>
    <li>Any deviations from this procedure must be documented and approved by the Chief Engineer before proceeding.</li>
    <li>Lessons learned from this maintenance should be documented and incorporated into the next revision.</li>
</ul>

<div style="margin-top: 30px; padding: 15px; background-color: #fffacd; border: 1px solid #daa520;">
    <h4 style="margin-top: 0;">Post-Maintenance Requirements:</h4>
    <ul style="margin-bottom: 0;">
        <li>Complete and submit maintenance report within 24 hours</li>
        <li>Update equipment history in CMMS</li>
        <li>Schedule follow-up inspection if any issues were identified</li>
        <li>Review and update PM schedule based on equipment condition</li>
    </ul>
</div>

<div style="margin-top: 20px;">
    <p><strong>Additional Notes:</strong></p>
    <textarea style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #ccc;" 
              placeholder="Space for technician notes, observations, or recommendations for future maintenance..."></textarea>
</div>`;

    return { html, sources: [] };
  } catch (error) {
    console.error('Section 11 generation error:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const result = await generateSection11(formData);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}