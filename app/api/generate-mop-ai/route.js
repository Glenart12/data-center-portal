import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request) {
  try {
    const body = await request.json();
    const { formData } = body;
    const { manufacturer, modelNumber, serialNumber, location, system, category, description } = formData;
    
    console.log('MOP generation started for:', manufacturer, modelNumber);
    
    // Generate filename with .html extension
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    const safeManufacturer = manufacturer.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 20);
    const safeSystem = system.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
    const safeCategory = category.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 15);
    const filename = `MOP_${safeManufacturer}_${safeSystem}_${safeCategory}_${date}_${timestamp}.html`;

    // Determine frequency from description
    const frequency = description.includes('annual') ? 'ANNUAL' : 
                     description.includes('quarterly') ? 'QUARTERLY' : 
                     description.includes('monthly') ? 'MONTHLY' : 'PREVENTIVE';

    // Create a simpler, more focused prompt
    const prompt = `Generate a complete HTML document for a Method of Procedure (MOP) for data center equipment maintenance.

EQUIPMENT DETAILS:
- Manufacturer: ${manufacturer}
- Model: ${modelNumber}
- System: ${system}
- Category: ${category}
- Work: ${description}
- Serial: ${serialNumber || 'UPDATE NEEDED'}
- Location: ${location || 'UPDATE NEEDED'}

REQUIREMENTS:
1. Generate a COMPLETE, VALID HTML document starting with <!DOCTYPE html>
2. Include ALL 11 sections as shown below
3. Use proper HTML tables where indicated
4. For fields needing updates, use: <span class="update-needed">UPDATE NEEDED - [instruction]</span>
5. Generate realistic, detailed procedures based on the equipment type (minimum 20-30 steps)
6. Do NOT say "content too large" or truncate - generate the complete document

HTML TEMPLATE TO FOLLOW:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MOP - ${manufacturer.toUpperCase()} ${system.toUpperCase()}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1, h2 { color: #0f3456; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #0f3456; color: white; }
        .update-needed { color: red; font-weight: bold; }
        .info-table td:first-child { font-weight: bold; background-color: #f0f0f0; width: 30%; }
    </style>
</head>
<body>
    <h1>Method of Procedure (MOP)</h1>

    <h2>Section 01: MOP Schedule Information</h2>
    <table class="info-table">
        <tr><td>MOP Title:</td><td>${manufacturer.toUpperCase()} ${system.toUpperCase()} - ${frequency} MAINTENANCE</td></tr>
        <tr><td>MOP Information:</td><td>${description}</td></tr>
        <tr><td>MOP Creation Date:</td><td>${new Date().toLocaleDateString('en-US')}</td></tr>
        <tr><td>MOP Revision Date:</td><td><span class="update-needed">UPDATE NEEDED - Update upon revision</span></td></tr>
        <tr><td>Document Number:</td><td><span class="update-needed">UPDATE NEEDED - Assign per facility</span></td></tr>
        <tr><td>Revision Number:</td><td><span class="update-needed">UPDATE NEEDED - Assign per facility</span></td></tr>
        <tr><td>Author CET Level:</td><td><span class="update-needed">UPDATE NEEDED - Enter CET level</span></td></tr>
    </table>

    <h2>Section 02: Site Information</h2>
    <table class="info-table">
        <tr><td>Data Center Location:</td><td>${location || '<span class="update-needed">UPDATE NEEDED - Enter location</span>'}</td></tr>
        <tr><td>Service Ticket/Project Number:</td><td><span class="update-needed">UPDATE NEEDED - Enter ticket number</span></td></tr>
        <tr><td>Level of Risk:</td><td>[Determine based on equipment criticality - Level 1-4]</td></tr>
        <tr><td>CET Level Required:</td><td>[Determine based on risk level]</td></tr>
    </table>

    <h2>Section 03: MOP Overview</h2>
    <table class="info-table">
        <tr><td>MOP Description:</td><td>${description}</td></tr>
        <tr><td>Work Area:</td><td>${location || '<span class="update-needed">UPDATE NEEDED</span>'}</td></tr>
        <tr><td>Manufacturer:</td><td>${manufacturer}</td></tr>
        <tr><td>Equipment ID:</td><td><span class="update-needed">UPDATE NEEDED - Record on-site</span></td></tr>
        <tr><td>Model #:</td><td>${modelNumber}</td></tr>
        <tr><td>Serial #:</td><td>${serialNumber || '<span class="update-needed">UPDATE NEEDED - Record from nameplate</span>'}</td></tr>
        <tr><td>Min. # of Facilities Personnel:</td><td>[Based on equipment]</td></tr>
        <tr><td>Qualifications Required:</td><td>[List certifications]</td></tr>
        <tr><td>Tools Required:</td><td>[List all tools]</td></tr>
        <tr><td>Advance notifications required:</td><td>[List notifications]</td></tr>
        <tr><td>Post notifications required:</td><td>[List notifications]</td></tr>
    </table>

    <h2>Section 04: Effect of MOP on Critical Facility</h2>
    <table>
        <thead>
            <tr>
                <th>Facility Equipment or System</th>
                <th>Yes</th>
                <th>No</th>
                <th>N/A</th>
                <th>Details</th>
            </tr>
        </thead>
        <tbody>
            [Generate all 18 rows based on equipment type]
        </tbody>
    </table>

    <h2>Section 05: MOP Supporting Documentation</h2>
    <ul>
        <li>${manufacturer} ${modelNumber} Operation and Maintenance Manual</li>
        <li>OSHA 29 CFR 1910.147 - Lockout/Tagout</li>
        <li>OSHA 29 CFR 1910 Subpart I - PPE</li>
        <li>[Add relevant standards]</li>
    </ul>

    <h2>Section 06: Safety Requirements</h2>
    <h3>Key Hazards Identified</h3>
    <table>
        <thead>
            <tr><th>Hazard Type</th><th>Specific Hazards</th><th>Safety Controls Required</th></tr>
        </thead>
        <tbody>
            [Generate hazards based on equipment]
        </tbody>
    </table>

    <h3>Required PPE</h3>
    <table>
        <thead>
            <tr><th>PPE Category</th><th>Specification</th><th>When Required</th></tr>
        </thead>
        <tbody>
            [Generate PPE requirements]
        </tbody>
    </table>

    <h2>Section 07: MOP Risks & Assumptions</h2>
    <ul>
        [Generate risks and assumptions]
    </ul>

    <h2>Section 08: MOP Details</h2>
    <table>
        <tr><td>Date Performed:</td><td></td><td>Time Begun:</td><td></td></tr>
        <tr><td>Time Completed:</td><td></td><td>Total Time:</td><td></td></tr>
    </table>

    <h3>Detailed Procedure Steps</h3>
    <table>
        <thead>
            <tr><th>Step</th><th>Procedure</th><th>Initials</th><th>Time</th></tr>
        </thead>
        <tbody>
            [Generate 20-30 detailed steps specific to the equipment]
        </tbody>
    </table>

    <h2>Section 09: Back-out Procedures</h2>
    <table>
        <thead>
            <tr><th>Step</th><th>Back-out Procedures</th><th>Initials</th><th>Time</th></tr>
        </thead>
        <tbody>
            [Generate 6+ back-out steps]
        </tbody>
    </table>

    <h2>Section 10: MOP Approval</h2>
    <table>
        <thead>
            <tr><th>Review Stage</th><th>Reviewer's Name</th><th>Reviewer's Title</th><th>Date</th></tr>
        </thead>
        <tbody>
            <tr><td>Tested for clarity:</td><td></td><td></td><td></td></tr>
            <tr><td>Technical review:</td><td></td><td></td><td></td></tr>
            <tr><td>Chief Engineer approval:</td><td></td><td></td><td></td></tr>
            <tr><td>Contractor Review:</td><td></td><td></td><td></td></tr>
            <tr><td>Customer approval:</td><td></td><td></td><td></td></tr>
        </tbody>
    </table>

    <h2>Section 11: MOP Comments</h2>
    <p>[Add any relevant comments]</p>
</body>
</html>

IMPORTANT: Generate the COMPLETE HTML document with ALL sections filled in with realistic content based on the equipment type. Do NOT truncate or say the content is too large.`;

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
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        mopContent = response.text();
        
        // Clean up the response - remove any markdown code blocks
        mopContent = mopContent.replace(/```html\n?/g, '').replace(/```\n?/g, '');
        
        // Verify it's actual HTML
        if (!mopContent.includes('<!DOCTYPE html>') || !mopContent.includes('</html>')) {
          throw new Error('Generated content is not valid HTML');
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
          contentType: 'text/html'
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