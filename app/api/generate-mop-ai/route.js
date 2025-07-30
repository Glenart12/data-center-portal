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
    
    console.log('MOP generation started for:', manufacturer, modelNumber);
    
    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    const safeManufacturer = manufacturer.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
    const safeSystem = system.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
    const safeCategory = category.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
    const filename = `MOP_${safeManufacturer}_${safeSystem}_${safeCategory}_${date}_${timestamp}.txt`;

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
    
    // Use the lighter model that's less likely to be overloaded
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash-8b',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8000,
      }
    });
    
    // Try to generate with retries
    let mopContent;
    let lastError;
    const maxAttempts = 5;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt} of ${maxAttempts}...`);
        
        const result = await model.generateContent(`${PROJECT_INSTRUCTIONS}\n\n${userPrompt}`);
        const response = await result.response;
        mopContent = response.text();
        
        if (!mopContent || mopContent.length < 100) {
          throw new Error('Generated content is too short');
        }
        
        console.log('Successfully generated MOP, length:', mopContent.length);
        break; // Success! Exit the loop
        
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);
        
        // If it's a rate limit or overload error, wait and retry
        if (error.message?.includes('503') || 
            error.message?.includes('overloaded') || 
            error.message?.includes('429') ||
            error.message?.includes('Resource has been exhausted')) {
          
          if (attempt < maxAttempts) {
            // Exponential backoff: 3s, 6s, 9s, 12s
            const waitTime = attempt * 3000;
            console.log(`Waiting ${waitTime}ms before retry...`);
            await wait(waitTime);
            continue;
          }
        }
        
        // For other errors, don't retry
        break;
      }
    }
    
    if (!mopContent) {
      const errorMessage = lastError?.message || 'Failed to generate after all attempts';
      
      // Better error messages for users
      if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
        return NextResponse.json({ 
          error: 'AI service is temporarily busy',
          details: 'The AI service is experiencing high demand. Please wait 2-3 minutes and try again.',
          userMessage: 'The AI is busy right now. Please try again in a few minutes.'
        }, { status: 503 });
      }
      
      if (errorMessage.includes('429') || errorMessage.includes('exhausted')) {
        return NextResponse.json({ 
          error: 'Rate limit reached',
          details: 'You\'ve made too many requests. Please wait a minute before trying again.',
          userMessage: 'Please wait 60 seconds before generating another MOP.'
        }, { status: 429 });
      }
      
      throw lastError || new Error(errorMessage);
    }

    // Add a small delay before saving to prevent race conditions
    await wait(500);

    // Save to blob with retry
    let blob;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        blob = await put(`mops/${filename}`, mopContent, {
          access: 'public',
          contentType: 'text/plain'
        });
        console.log('Successfully saved to blob storage');
        break;
      } catch (blobError) {
        console.error(`Blob storage attempt ${attempt} failed:`, blobError.message);
        if (attempt === 3) {
          // Return the content even if storage fails
          return NextResponse.json({ 
            success: false,
            error: 'Generated but could not save',
            generatedContent: mopContent,
            filename: filename,
            userMessage: 'MOP was generated but could not be saved. Copy the content manually.'
          }, { status: 200 });
        }
        await wait(1000);
      }
    }

    return NextResponse.json({ 
      success: true,
      filename: filename,
      url: blob.url,
      message: 'MOP generated successfully'
    });

  } catch (error) {
    console.error('MOP generation error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to generate MOP',
      details: error.message,
      userMessage: 'Unable to generate MOP. Please check your inputs and try again.'
    }, { status: 500 });
  }
}