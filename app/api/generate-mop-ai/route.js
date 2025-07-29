import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { MOP_PROJECT_KNOWLEDGE, EQUIPMENT_DATABASE, SAFETY_REQUIREMENTS } from '@/lib/mop-knowledge';

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    console.log('AI MOP Generation request received');
    
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { formData, supportingDocs } = await request.json();
    
    // Get equipment specs if available
    const equipmentSpecs = EQUIPMENT_DATABASE[formData.manufacturer]?.[formData.modelNumber] || {};
    
    // Extract content from supporting documents
    let documentContext = '';
    if (supportingDocs && supportingDocs.length > 0) {
      documentContext = '\n\nSUPPORTING DOCUMENTS PROVIDED:\n';
      for (const doc of supportingDocs) {
        documentContext += `\nDocument: ${doc.name}\n`;
        // Note: In production, you'd parse PDFs here
        // For now, we just note that documents were provided
      }
    }

    // Create comprehensive prompt
    const prompt = `
${MOP_PROJECT_KNOWLEDGE}

EQUIPMENT INFORMATION:
- Manufacturer: ${formData.manufacturer}
- Model Number: ${formData.modelNumber}
- Equipment ID: ${formData.equipmentId || 'TBD'}
- Serial Number: ${formData.serialNumber || 'TBD'}
- Work Type: ${formData.workType}
- Risk Level: ${formData.riskLevel}
- Location: ${formData.location || 'Data Center'}
- Affected Systems: ${formData.affectedSystems || 'TBD'}

EQUIPMENT SPECIFICATIONS:
${JSON.stringify(equipmentSpecs, null, 2)}

WORK DESCRIPTION:
${formData.description}

APPLICABLE SAFETY REQUIREMENTS:
${JSON.stringify(SAFETY_REQUIREMENTS, null, 2)}

${documentContext}

INSTRUCTIONS:
Generate a complete Method of Procedure (MOP) following the EXACT 11-section format provided above. The MOP should be:
1. Specific to the ${formData.manufacturer} ${formData.modelNumber} equipment
2. Detailed with step-by-step procedures
3. Include all safety requirements and PPE
4. Have complete back-out procedures
5. Professional and ready for use

Format as a professional document that can be saved as a text file and used immediately in the field.
`;

    console.log('Calling Gemini AI...');
    
    // Generate content with Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const mopContent = response.text();
    
    console.log('AI generation successful');

    // Create filename
    const timestamp = new Date().toISOString().split('T')[0];
    const safeManufacturer = formData.manufacturer.replace(/[^a-zA-Z0-9]/g, '_');
    const safeModel = formData.modelNumber.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `MOP_${safeManufacturer}_${safeModel}_${timestamp}`;

    // Ensure directory exists
    const mopsDir = path.join(process.cwd(), 'public', 'mops');
    if (!existsSync(mopsDir)) {
      await mkdir(mopsDir, { recursive: true });
    }

    // Save the generated MOP
    const filePath = path.join(mopsDir, `${filename}.txt`);
    await writeFile(filePath, mopContent, 'utf8');
    
    console.log(`MOP saved to: ${filePath}`);

    return NextResponse.json({ 
      message: 'MOP generated successfully with AI',
      filename: `${filename}.txt`,
      preview: mopContent.substring(0, 500) + '...' // Send preview
    });

  } catch (error) {
    console.error('Error generating MOP with AI:', error);
    return NextResponse.json(
      { error: `Failed to generate MOP: ${error.message}` },
      { status: 500 }
    );
  }
}