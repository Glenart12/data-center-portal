import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

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
[Space for additional notes]`;

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request) {
  try {
    const body = await request.json();
    const { formData } = body;
    const { manufacturer, modelNumber, serialNumber, location, system, category, description } = formData;
    
    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const safeManufacturer = manufacturer.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
    const safeSystem = system.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
    const safeCategory = category.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
    const filename = `MOP_${safeManufacturer}_${safeSystem}_${safeCategory}_${date}.txt`;

    // Create prompt
    const userPrompt = `Create a comprehensive MOP based on this information:
    
Equipment Details:
- Manufacturer: ${manufacturer}
- Model Number: ${modelNumber}
- Serial Number: ${serialNumber || 'UPDATE NEEDED'}
- Location: ${location || 'UPDATE NEEDED'}
- System: ${system}
- Category: ${category}
- Work Description: ${description}

Generate a complete 11-section MOP following the exact format provided in the instructions.`;

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Try to generate with retries
    let mopContent;
    let lastError;
    
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        console.log(`Attempt ${attempt} to generate MOP...`);
        
        const result = await model.generateContent(`${PROJECT_INSTRUCTIONS}\n\n${userPrompt}`);
        const response = await result.response;
        mopContent = response.text();
        
        console.log('Successfully generated MOP');
        break; // Success! Exit the loop
        
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);
        
        // If it's a 503 error (overloaded), wait and retry
        if (error.message?.includes('503') || error.message?.includes('overloaded')) {
          if (attempt < 5) {
            const waitTime = attempt * 2000; // 2s, 4s, 6s, 8s
            console.log(`Waiting ${waitTime}ms before retry...`);
            await wait(waitTime);
            continue;
          }
        }
        
        // If it's not a 503 or we're out of retries, throw
        throw error;
      }
    }
    
    if (!mopContent) {
      throw lastError || new Error('Failed to generate after 5 attempts');
    }

    // Save to blob
    const blob = await put(`mops/${filename}`, mopContent, {
      access: 'public',
      contentType: 'text/plain'
    });

    return NextResponse.json({ 
      success: true,
      filename: filename,
      url: blob.url,
      message: 'MOP generated successfully'
    });

  } catch (error) {
    console.error('Final error:', error);
    
    // If it's still a 503 error after all retries
    if (error.message?.includes('503') || error.message?.includes('overloaded')) {
      return NextResponse.json({ 
        error: 'Google AI service is temporarily overloaded',
        details: 'Please wait a few minutes and try again. This is a temporary issue with Google\'s service.',
        suggestion: 'Try again in 2-3 minutes'
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to generate MOP',
      details: error.message 
    }, { status: 500 });
  }
}