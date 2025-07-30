import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Shorter instructions for testing
const PROJECT_INSTRUCTIONS = `Create a Method of Procedure (MOP) for data center work.

Format: Plain text only, no markdown. Use ALL CAPS for section headers.

Include these sections:
1. MOP SCHEDULE INFORMATION
2. SITE INFORMATION
3. MOP OVERVIEW
4. SAFETY REQUIREMENTS
5. MOP DETAILS (step-by-step procedures)
6. BACK-OUT PROCEDURES

Use "UPDATE NEEDED" for missing information.`;

export async function POST(request) {
  console.log('=== MOP Generation Started ===');
  
  // Test 1: Check environment variables
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  
  console.log('Environment check:', {
    hasGeminiKey,
    hasBlobToken,
    geminiKeyLength: process.env.GEMINI_API_KEY?.length || 0
  });

  if (!hasGeminiKey) {
    return NextResponse.json({ 
      error: 'Missing Gemini API key',
      details: 'GEMINI_API_KEY environment variable is not set'
    }, { status: 500 });
  }

  try {
    // Parse request
    const body = await request.json();
    const { formData } = body;
    const { manufacturer, modelNumber, system, category, description } = formData;
    
    console.log('Form data received:', { manufacturer, modelNumber, system, category });

    // Test 2: Try to initialize Gemini
    let genAI;
    try {
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      console.log('✓ Gemini initialized successfully');
    } catch (error) {
      console.error('✗ Gemini initialization failed:', error);
      return NextResponse.json({ 
        error: 'Failed to initialize Gemini',
        details: error.message
      }, { status: 500 });
    }

    // Test 3: Try a simple generation first
    try {
      console.log('Testing Gemini with simple prompt...');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const testResult = await model.generateContent('Say "test successful"');
      const testText = testResult.response.text();
      console.log('✓ Gemini test successful:', testText.substring(0, 50));
    } catch (testError) {
      console.error('✗ Gemini test failed:', testError);
      
      // Check for specific errors
      if (testError.message?.includes('API_KEY_INVALID')) {
        return NextResponse.json({ 
          error: 'Invalid Gemini API key',
          details: 'Your API key is invalid. Please check your Gemini API key in Vercel environment variables.'
        }, { status: 401 });
      }
      
      if (testError.message?.includes('RATE_LIMIT_EXCEEDED') || testError.status === 429) {
        return NextResponse.json({ 
          error: 'Gemini rate limit exceeded',
          details: 'You have exceeded the API quota. Please wait a few minutes and try again.'
        }, { status: 429 });
      }
      
      return NextResponse.json({ 
        error: 'Gemini connection failed',
        details: testError.message || 'Could not connect to Gemini AI service'
      }, { status: 500 });
    }

    // Test 4: Generate the actual MOP
    let mopContent;
    try {
      console.log('Generating MOP content...');
      
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000, // Reduced for testing
        }
      });

      const prompt = `${PROJECT_INSTRUCTIONS}\n\nCreate a MOP for:\n- Equipment: ${manufacturer} ${modelNumber}\n- System: ${system}\n- Category: ${category}\n- Work: ${description}`;
      
      console.log('Prompt length:', prompt.length, 'characters');
      
      const result = await model.generateContent(prompt);
      mopContent = result.response.text();
      
      console.log('✓ MOP generated, length:', mopContent.length, 'characters');
      
      if (!mopContent || mopContent.length < 50) {
        throw new Error('Generated content is too short');
      }
      
    } catch (genError) {
      console.error('✗ MOP generation failed:', genError);
      console.error('Error details:', {
        name: genError.name,
        message: genError.message,
        status: genError.status,
        statusText: genError.statusText
      });
      
      return NextResponse.json({ 
        error: 'Failed to generate MOP content',
        details: genError.message,
        errorType: genError.name,
        suggestion: 'Check Vercel function logs for more details'
      }, { status: 500 });
    }

    // Test 5: Try to save to Blob (if we have the token)
    if (hasBlobToken) {
      try {
        console.log('Saving to Blob storage...');
        
        const date = new Date().toISOString().split('T')[0];
        const filename = `MOP_${manufacturer}_${system}_${date}_${Date.now()}.txt`;
        
        const blob = await put(filename, mopContent, {
          access: 'public',
          contentType: 'text/plain',
          token: process.env.BLOB_READ_WRITE_TOKEN
        });
        
        console.log('✓ Saved to Blob storage:', blob.url);
        
        return NextResponse.json({ 
          success: true,
          filename: filename,
          url: blob.url,
          message: 'MOP generated successfully'
        });
        
      } catch (blobError) {
        console.error('✗ Blob storage failed:', blobError);
        
        // Return the content anyway
        return NextResponse.json({ 
          success: false,
          error: 'Generated but could not save',
          details: 'MOP was generated but could not be saved to storage',
          generatedContent: mopContent,
          blobError: blobError.message
        }, { status: 200 }); // 200 because we have the content
      }
    } else {
      // No blob token, just return the content
      console.log('No Blob token, returning content directly');
      return NextResponse.json({ 
        success: false,
        error: 'No storage configured',
        details: 'MOP was generated but storage is not configured',
        generatedContent: mopContent
      }, { status: 200 });
    }

  } catch (error) {
    console.error('=== Unexpected error ===');
    console.error(error);
    
    return NextResponse.json({ 
      error: 'Unexpected error',
      details: error.message,
      type: error.constructor.name
    }, { status: 500 });
  }
}