import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function enhanceSections1to3(htmlContent, formData) {
  try {
    console.log('Enhancing sections 1-3 with AI research...');
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8000,
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
    });

    const prompt = `
    You are enhancing a Method of Procedure (MOP) for data center equipment maintenance.
    
    Equipment Details:
    - Manufacturer: ${formData.manufacturer || 'Not specified'}
    - Model Number: ${formData.modelNumber || 'Not specified'}
    - Component Type: ${formData.componentType || 'Not specified'}
    - System: ${formData.system || 'Not specified'}
    - Work Description: ${formData.workDescription || formData.description || 'Not specified'}
    - Equipment Number: ${formData.equipmentNumber || 'Not specified'}
    
    TASK: Replace ALL text that starts with "PLACEHOLDER:" in the HTML with accurate, researched information.
    
    REPLACEMENT GUIDELINES:
    
    1. [REMOVED - No longer needed for MOP generation]
    
    2. For "PLACEHOLDER: AI will research approximate duration for [manufacturer] [model] [work]":
       - Provide realistic time range based on maintenance type
       - Weekly PM: 1-2 hours
       - Monthly PM: 2-3 hours  
       - Quarterly PM: 3-4 hours
       - Semi-Annual PM: 4-6 hours
       - Annual PM: 6-8 hours
       - Include brief justification
    
    3. For "PLACEHOLDER: AI will research specific roles needed for [manufacturer] [model] maintenance":
       - List 2-4 specific job roles
       - Examples: "Lead HVAC Technician, Electrical Technician, Controls Specialist"
       - For chillers: Include refrigeration specialist
       - For generators: Include diesel mechanic
       - For UPS: Include battery technician
    
    4. For "PLACEHOLDER: AI will research number needed for [manufacturer] [model]":
       - Provide specific number (typically 2-3 for safety)
       - Include justification: "2 technicians - One lead technician for primary work, one assistant for safety/LOTO verification"
    
    5. For "PLACEHOLDER: AI will research certifications needed for [manufacturer] [model]":
       - List relevant certifications based on equipment type
       - Chillers: "EPA 608 Universal Certification, OSHA 10, Electrical Safety Training"
       - Generators: "Diesel Engine Certification, Electrical License, OSHA 10"
       - UPS: "Battery Safety Certification, Electrical License, Arc Flash Training"
       - Include manufacturer-specific training if applicable
    
    6. For "PLACEHOLDER: AI will research advance notices":
       - List: "Data Center Manager (24 hours), NOC/BMS Operator (4 hours), IT Operations (24 hours), Security (Day of work)"
       - Include timing for each notification
    
    7. For "PLACEHOLDER: AI will research post notices":
       - List: "Data Center Manager (Completion confirmation), NOC/BMS Operator (System status), IT Operations (All-clear), Maintenance Log (Updated)"
    
    CRITICAL RULES:
    - Return ONLY the modified HTML with no markdown formatting
    - Do NOT add any text before or after the HTML
    - Keep ALL HTML tags and structure exactly as provided
    - Replace ONLY the PLACEHOLDER text, preserving all other content
    - If uncertain about specific details, use industry standards with note "(Verify with manufacturer documentation)"
    - Be specific to data center operations and the actual equipment specified
    - Use professional technical language appropriate for MOPs
    
    HTML to enhance:
    ${htmlContent}
    `;

    const result = await model.generateContent(prompt);
    let enhancedHtml = result.response.text();
    
    // Clean up any potential markdown formatting
    enhancedHtml = enhancedHtml.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('Successfully enhanced sections 1-4');
    return enhancedHtml;
    
  } catch (error) {
    console.error('Error enhancing sections 1-4:', error);
    // Return original HTML if enhancement fails
    return htmlContent;
  }
}

// POST endpoint for testing/direct calls
export async function POST(request) {
  try {
    const { htmlContent, formData } = await request.json();
    
    if (!htmlContent || !formData) {
      return NextResponse.json({ 
        error: 'Missing required fields: htmlContent and formData' 
      }, { status: 400 });
    }
    
    const enhancedHtml = await enhanceSections1to4(htmlContent, formData);
    
    return NextResponse.json({ 
      html: enhancedHtml,
      enhanced: true 
    });
    
  } catch (error) {
    console.error('Enhancement route error:', error);
    return NextResponse.json({ 
      error: 'Failed to enhance sections',
      details: error.message 
    }, { status: 500 });
  }
}