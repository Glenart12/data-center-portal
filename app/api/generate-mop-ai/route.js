import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Your comprehensive MOP project instructions
const PROJECT_INSTRUCTIONS = `You are creating Methods of Procedure (MOPs) for data center technicians.

CRITICAL FORMATTING RULES:
1. Use plain text ONLY - no markdown, no special formatting
2. Use hyphens/dashes for lists (not *, not •, not ▪)
3. Use ALL CAPS for section headers (e.g., SECTION 01 - MOP SCHEDULE INFORMATION)
4. For tables, use simple ASCII formatting with | separators
5. Use red "UPDATE NEEDED" markers as specified

MOP Format (11 sections):

SECTION 01 - MOP SCHEDULE INFORMATION
- MOP Title: [Work type + Equipment]
- MOP Information: [Brief description]
- MOP Author: UPDATE NEEDED
- MOP Creation Date: [Current date]
- MOP Revision Date: [Current date]
- Document Number: UPDATE NEEDED
- Revision Number: 1.0
- Author CET Level: UPDATE NEEDED

SECTION 02 - SITE INFORMATION
- Data Center Location: 
  Street: UPDATE NEEDED
  City: UPDATE NEEDED
  State: UPDATE NEEDED
  ZIP: UPDATE NEEDED
- Service Ticket/Project Number: UPDATE NEEDED
- Level of Risk: [1-4 based on work type]
- MBM Required?: [Yes/No based on risk]

SECTION 03 - MOP OVERVIEW
- MOP Description: [Detailed work description]
- Work Area: [Specific location]
- Affected Systems: [List all affected systems]
- Equipment Information: 
  Manufacturer: [From input]
  Equipment ID: [From input or UPDATE NEEDED]
  Model #: [From input]
  Serial #: [From input or UPDATE NEEDED]
- Personnel Required: [List required personnel]
- Min. # of Facilities Personnel: [Number]
- Qualifications Required: [List qualifications]
- Tools Required: [List all tools needed]
- Advance notifications: [List required notifications]
- Post notifications: [List post-work notifications]

SECTION 04 - EFFECT OF MOP ON CRITICAL FACILITY
Create a table showing impact on systems (Yes/No/N/A):
- Electrical Utility Equipment
- Emergency Generator System
- Critical Cooling System
- Ventilation System
- UPS
- Critical Power Distribution
- Fire Detection/Suppression
- Monitoring Systems
- Security Systems
- etc.

SECTION 05 - MOP SUPPORTING DOCUMENTATION
[List all referenced documents, manuals, specifications]

SECTION 06 - SAFETY REQUIREMENTS
[Comprehensive safety requirements including PPE, LOTO, Arc Flash, etc.]

SECTION 07 - MOP RISKS & ASSUMPTIONS
[List all risks and mitigation strategies]

SECTION 08 - MOP DETAILS
[Step-by-step procedure with verification steps]

SECTION 09 - BACK-OUT PROCEDURES
[Detailed rollback procedures if issues occur]

SECTION 10 - MOP APPROVAL
[Approval signature blocks]

SECTION 11 - MOP COMMENTS
[Space for additional notes]

RESEARCH REQUIREMENTS:
- Always research the specific equipment model for accurate procedures
- Include manufacturer-specific maintenance requirements
- Reference actual voltage/amperage ratings
- Include proper torque specifications when applicable
- Research and include actual SDS information for any chemicals
- Include specific safety ratings (CAT ratings, Arc Flash boundaries)

USE RED "UPDATE NEEDED" MARKERS FOR:
- Missing serial numbers or equipment IDs
- Location details
- Personnel names
- Document numbers
- Any information that must be filled by the technician

Remember: You're creating professional technical documentation for critical infrastructure work. Be precise, thorough, and safety-focused.`;

export async function POST(request) {
  console.log('MOP Generation API called');
  
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json({ 
        error: 'API configuration error: Missing Gemini API key',
        details: 'Please check your environment variables'
      }, { status: 500 });
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ 
        error: 'Invalid request format',
        details: parseError.message
      }, { status: 400 });
    }

    const { formData, supportingDocs } = body;
    
    // Validate required fields
    if (!formData || !formData.manufacturer || !formData.modelNumber || !formData.system || 
        !formData.category || !formData.description) {
      console.error('Missing required fields:', formData);
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: 'Please fill in all required fields'
      }, { status: 400 });
    }
    
    // Extract all form data
    const { manufacturer, modelNumber, serialNumber, location, system, category, description } = formData;
    console.log('Generating MOP for:', { manufacturer, modelNumber, system, category });
    
    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const safeManufacturer = manufacturer.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
    const safeSystem = system.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
    const safeCategory = category.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
    const filename = `MOP_${safeManufacturer}_${safeSystem}_${safeCategory}_${date}.txt`;
    console.log('Generated filename:', filename);

    // Create the prompt
    const userPrompt = `Create a comprehensive MOP based on this information:
    
Equipment Details:
- Manufacturer: ${manufacturer}
- Model Number: ${modelNumber}
- Serial Number: ${serialNumber || 'UPDATE NEEDED'}
- Location: ${location || 'UPDATE NEEDED'}
- System: ${system}
- Category: ${category}
- Work Description: ${description}

Important context:
- This is for a ${system} in a data center environment
- The work category is: ${category}
- Follow all formatting rules exactly (plain text, no markdown)
- Research the specific ${manufacturer} ${modelNumber} equipment
- Include all safety requirements for ${system} work
- Consider the specific requirements for ${category} type work

${supportingDocs && supportingDocs.length > 0 ? `
Supporting Documents Provided:
${supportingDocs.map(doc => `- ${doc.name}`).join('\n')}
(Use these as reference for equipment-specific procedures)
` : ''}

Generate a complete 11-section MOP following the exact format provided in the instructions.`;

    // Initialize Gemini
    let genAI;
    try {
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      console.log('Gemini AI initialized');
    } catch (initError) {
      console.error('Failed to initialize Gemini:', initError);
      return NextResponse.json({ 
        error: 'Failed to initialize AI service',
        details: initError.message
      }, { status: 500 });
    }

    // Generate content
    let mopContent;
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8000,
        }
      });
      
      console.log('Generating content with Gemini...');
      const fullPrompt = `${PROJECT_INSTRUCTIONS}\n\n${userPrompt}`;
      const result = await model.generateContent(fullPrompt);
      
      if (!result.response) {
        throw new Error('No response from Gemini');
      }
      
      mopContent = result.response.text();
      console.log('Content generated successfully, length:', mopContent.length);
      
      if (!mopContent || mopContent.length < 100) {
        throw new Error('Generated content is too short or empty');
      }
    } catch (genError) {
      console.error('Gemini generation error:', genError);
      
      // Check for specific error types
      if (genError.message?.includes('quota')) {
        return NextResponse.json({ 
          error: 'AI quota exceeded',
          details: 'The AI service quota has been exceeded. Please try again later or contact support.'
        }, { status: 429 });
      }
      
      if (genError.message?.includes('API key')) {
        return NextResponse.json({ 
          error: 'Invalid API key',
          details: 'The Gemini API key is invalid or expired.'
        }, { status: 401 });
      }
      
      return NextResponse.json({ 
        error: 'Failed to generate MOP content',
        details: genError.message || 'Unknown error during generation'
      }, { status: 500 });
    }

    // Upload to Blob Storage
    let blob;
    try {
      console.log('Uploading to Blob storage...');
      blob = await put(`mops/${filename}`, mopContent, {
        access: 'public',
        contentType: 'text/plain'
      });
      console.log('Successfully uploaded to Blob storage:', blob.url);
    } catch (blobError) {
      console.error('Blob storage error:', blobError);
      
      // Even if blob storage fails, we generated the content
      // You could return the content directly as a fallback
      return NextResponse.json({ 
        error: 'Failed to save MOP to storage',
        details: blobError.message,
        // Include the content so user doesn't lose it
        generatedContent: mopContent,
        filename: filename
      }, { status: 500 });
    }

    // Success response
    return NextResponse.json({ 
      success: true,
      filename: filename,
      url: blob.url,
      message: 'MOP generated successfully'
    });

  } catch (error) {
    // Catch-all error handler
    console.error('Unexpected error in MOP generation:', error);
    return NextResponse.json({ 
      error: 'Unexpected error during MOP generation',
      details: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}