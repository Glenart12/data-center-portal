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

    // Create a very explicit prompt that FORCES HTML generation
    const prompt = `You MUST generate a complete HTML document. Start your response with <!DOCTYPE html> and end with </html>. Do NOT include any explanation or text outside the HTML tags.

Generate an HTML document for this equipment:
- Manufacturer: ${manufacturer}
- Model: ${modelNumber}
- System: ${system}
- Work: ${description}

Here is the EXACT HTML structure you MUST follow:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MOP - ${manufacturer.toUpperCase()} ${system.toUpperCase()}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
        .container { background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #0f3456; text-align: center; margin-bottom: 40px; }
        h2 { color: #0f3456; border-bottom: 2px solid #0f3456; padding-bottom: 10px; margin-top: 40px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #0f3456; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .info-table td:first-child { font-weight: bold; background-color: #f0f0f0; width: 30%; }
        .update-needed { color: red; font-weight: bold; }
        ul { line-height: 1.8; }
        .safety-warning { background-color: #fee; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Method of Procedure (MOP)</h1>

        <h2>Section 01: MOP Schedule Information</h2>
        <table class="info-table">
            <tr>
                <td>MOP Title:</td>
                <td>${manufacturer.toUpperCase()} ${system.toUpperCase()} - ${frequency} MAINTENANCE</td>
            </tr>
            <tr>
                <td>MOP Information:</td>
                <td>${description}</td>
            </tr>
            <tr>
                <td>MOP Creation Date:</td>
                <td>${new Date().toLocaleDateString('en-US')}</td>
            </tr>
            <tr>
                <td>MOP Revision Date:</td>
                <td><span class="update-needed">UPDATE NEEDED - Update upon revision</span></td>
            </tr>
            <tr>
                <td>Document Number:</td>
                <td><span class="update-needed">UPDATE NEEDED - Assign per facility</span></td>
            </tr>
            <tr>
                <td>Revision Number:</td>
                <td><span class="update-needed">UPDATE NEEDED - Assign per facility</span></td>
            </tr>
            <tr>
                <td>Author CET Level:</td>
                <td><span class="update-needed">UPDATE NEEDED - Enter CET level</span></td>
            </tr>
        </table>

        [CONTINUE WITH ALL 11 SECTIONS IN PROPER HTML FORMAT]
    </div>
</body>
</html>

CRITICAL INSTRUCTIONS:
1. Your response MUST start with <!DOCTYPE html>
2. Your response MUST end with </html>
3. Do NOT include ANY text before <!DOCTYPE html> or after </html>
4. Generate ALL 11 sections with proper HTML tables
5. Fill in realistic equipment-specific procedures (20-30 steps minimum)
6. Use <span class="update-needed"> for fields needing updates
7. Do NOT say "content too large" or truncate - generate everything`;

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use the model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
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
        
        // Remove any text before <!DOCTYPE html>
        const htmlStart = mopContent.indexOf('<!DOCTYPE html>');
        if (htmlStart > 0) {
          mopContent = mopContent.substring(htmlStart);
        }
        
        // Remove any text after </html>
        const htmlEnd = mopContent.lastIndexOf('</html>');
        if (htmlEnd > -1) {
          mopContent = mopContent.substring(0, htmlEnd + 7);
        }
        
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