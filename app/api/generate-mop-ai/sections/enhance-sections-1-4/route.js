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
    - Serial Number: ${formData.serialNumber || 'Not specified'}
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
    
    3. For "PLACEHOLDER: AI will generate specific roles and number of personnel based on [manufacturer] [model] [work] complexity and equipment requirements":
       - Analyze the specific task complexity and equipment specifications
       - Consider manufacturer ${formData.manufacturer}, model ${formData.modelNumber}, serial ${formData.serialNumber}
       - Base personnel count on work complexity:
         * Simple PM (filters, visual inspection): 2 technicians
         * Medium complexity (belt changes, calibration): 2-3 technicians  
         * Complex work (compressor service, major repairs): 3-4 technicians
         * Critical/hazardous work: 4+ technicians
       - List specific roles based on equipment:
         * Chillers: "Lead HVAC Technician, Refrigeration Specialist, Controls Technician (3 total)"
         * Generators: "Lead Diesel Mechanic, Electrical Technician, Fuel Systems Specialist (3 total)"
         * UPS: "Lead Electrical Technician, Battery Specialist, Controls Technician (3 total)"
         * CRAC/CRAH: "Lead HVAC Technician, Controls Specialist (2 total)"
       - Include safety observer for high-risk work
       - Format: "Lead [Type] Technician, [Specialty] Technician, Safety Observer (3 total) - Based on ${formData.manufacturer} ${formData.modelNumber} complexity"
    
    4. [REMOVED - Now integrated into Personnel Required field above]
    
    5. For "PLACEHOLDER: AI will generate required certifications and qualifications based on [manufacturer] [model] [serial] equipment specifications and [work] complexity":
       - Analyze specific equipment: ${formData.manufacturer} ${formData.modelNumber} Serial: ${formData.serialNumber}
       - Consider work complexity: ${formData.workDescription || formData.description}
       - Base certifications on equipment type AND manufacturer:
         * Trane/Carrier/York Chillers: "EPA 608 Universal, ${formData.manufacturer} Factory Certification, OSHA 30, Refrigerant Handling License, High Voltage Safety (for centrifugal units > 460V)"
         * Caterpillar/Cummins Generators: "${formData.manufacturer} Certified Technician, Diesel Engine Specialist, NFPA 110 Certification, Electrical License, OSHA 10"
         * Liebert/Eaton/APC UPS: "${formData.manufacturer} Service Certification, Battery Safety NFPA 70E, Electrical License, Arc Flash Level 2, OSHA 10"
         * Specific voltage requirements: Add "High Voltage Certification" for equipment > 600V
       - Add specialized requirements based on serial number patterns:
         * Newer models (recent serials): "${formData.manufacturer} Digital Controls Certification"
         * Older models: "Legacy Equipment Specialist Certification"
       - Include task-specific qualifications:
         * Compressor work: "Vibration Analysis Level II, Alignment Certification"
         * Controls work: "BAS Programming Certification, ${formData.manufacturer} Controls Specialist"
         * Refrigerant work: "EPA 608 Universal, Refrigerant Recovery Certification"
       - Format: "Required: [Primary Certs]. Preferred: [Additional Certs]. Manufacturer-specific: ${formData.manufacturer} Model ${formData.modelNumber} Service Certification"
    
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