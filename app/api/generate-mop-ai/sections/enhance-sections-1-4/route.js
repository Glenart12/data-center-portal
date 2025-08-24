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
    
    3. For "PLACEHOLDER: AI must generate based on the specific [work] for [manufacturer] [model]":
       - Generate detailed personnel requirements with HTML formatting
       - Use <ul> and <li> tags for bullet points, <strong> tags for role names
       - Include 2-4 specific roles with descriptions for each:
         * <li><strong>Lead Technician (CET 2+):</strong> Primary responsibility for equipment operation, safety protocols, and procedure execution</li>
         * <li><strong>Assistant Technician:</strong> Support lead tech, monitor gauges, record data, assist with tools</li>
         * <li><strong>Safety Observer:</strong> Dedicated safety monitoring, emergency response readiness</li>
       - Adjust roles based on equipment type:
         * Chillers: Add <li><strong>Refrigeration Specialist:</strong> Handle refrigerant recovery, pressure testing, leak detection</li>
         * Generators: Add <li><strong>Diesel Mechanic:</strong> Engine maintenance, fuel system checks, load testing</li>
         * UPS: Add <li><strong>Battery Technician:</strong> Battery testing, replacement, disposal procedures</li>
       - DO NOT use markdown asterisks (**), only HTML tags
    
    4. For "PLACEHOLDER: AI will research number needed for [manufacturer] [model]":
       - Provide specific number (typically 2-3 for safety)
       - Include justification: "2 technicians - One lead technician for primary work, one assistant for safety/LOTO verification"
    
    5. For "PLACEHOLDER: AI must generate specific qualifications based on [work] complexity for [manufacturer] [model]":
       - Generate detailed qualifications with HTML formatting
       - Use <ul> and <li> tags for bullet points, <strong> tags for emphasis
       - Include comprehensive qualifications:
         * <li><strong>Required Certifications:</strong> List specific certifications based on equipment</li>
         * <li><strong>Experience Level:</strong> Minimum years of experience with similar equipment</li>
         * <li><strong>Manufacturer Training:</strong> Any OEM-specific training requirements</li>
       - Equipment-specific qualifications:
         * Chillers: <li><strong>EPA 608 Universal:</strong> Required for refrigerant handling</li>
         * Generators: <li><strong>Diesel Engine Certification:</strong> For engine maintenance procedures</li>
         * UPS: <li><strong>Battery Safety NFPA 70E:</strong> For working with battery systems</li>
       - Add <li><strong>OSHA 10/30:</strong> General industry safety certification</li>
       - DO NOT use markdown asterisks (**), only HTML tags
    
    6. For "PLACEHOLDER: AI must research and explain based on equipment type and [work]":
       - Generate advance notifications with HTML formatting
       - Use <ul> and <li> tags for each notification
       - Format: <li><strong>[Role/Department]:</strong> [Timeframe] - [Reason for notification]</li>
       - Standard notifications:
         * <li><strong>Data Center Manager:</strong> 24 hours advance - Approve maintenance window and coordinate resources</li>
         * <li><strong>NOC/BMS Operator:</strong> 4 hours advance - Prepare monitoring systems and acknowledge alarms</li>
         * <li><strong>IT Operations:</strong> 24 hours advance - Plan for any affected systems or redundancy needs</li>
         * <li><strong>Security:</strong> Day of work - Arrange access and visitor badges for any contractors</li>
       - DO NOT use markdown asterisks (**), only HTML tags
    
    7. For "PLACEHOLDER: AI must research and explain based on equipment type and [work]":
       - Generate post-completion notifications with HTML formatting
       - Use <ul> and <li> tags for each notification
       - Format: <li><strong>[Role/Department]:</strong> [Action required]</li>
       - Standard notifications:
         * <li><strong>Data Center Manager:</strong> Completion confirmation with any issues encountered</li>
         * <li><strong>NOC/BMS Operator:</strong> System status update and alarm points restored to normal</li>
         * <li><strong>IT Operations:</strong> All-clear notification that equipment is back online</li>
         * <li><strong>Maintenance Log:</strong> Updated with work performed, readings, and next due date</li>
       - DO NOT use markdown asterisks (**), only HTML tags
    
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