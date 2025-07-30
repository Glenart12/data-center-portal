import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const PROJECT_INSTRUCTIONS = `You are creating Methods of Procedure (MOPs) for data center technicians.

Create a simple MOP with these sections:
SECTION 01 - MOP INFORMATION
SECTION 02 - EQUIPMENT DETAILS  
SECTION 03 - SAFETY REQUIREMENTS
SECTION 04 - PROCEDURE STEPS
SECTION 05 - COMPLETION

Use plain text only. Keep it simple.`;

export async function POST(request) {
  try {
    // Log everything
    console.log('1. MOP API called');
    
    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('2. API Key exists:', !!apiKey);
    console.log('3. API Key length:', apiKey?.length);
    
    // Parse body
    const body = await request.json();
    console.log('4. Body parsed successfully');
    
    const { formData } = body;
    const { manufacturer, modelNumber, system, category, description } = formData;
    console.log('5. Form data:', { manufacturer, modelNumber, system, category });
    
    // Simple filename
    const filename = `MOP_${Date.now()}.txt`;
    console.log('6. Filename:', filename);
    
    // Try to initialize Gemini
    let genAI;
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      console.log('7. Gemini initialized');
    } catch (initError) {
      console.error('7. ERROR initializing Gemini:', initError);
      return NextResponse.json({ 
        error: 'Failed to initialize Gemini',
        details: initError.toString(),
        stage: 'initialization'
      }, { status: 500 });
    }
    
    // Try to create model
    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('8. Model created');
    } catch (modelError) {
      console.error('8. ERROR creating model:', modelError);
      return NextResponse.json({ 
        error: 'Failed to create model',
        details: modelError.toString(),
        stage: 'model_creation'
      }, { status: 500 });
    }
    
    // Simple prompt
    const prompt = `Create a MOP for ${manufacturer} ${modelNumber} - ${description}`;
    console.log('9. Prompt created, length:', prompt.length);
    
    // Try to generate
    let mopContent;
    try {
      console.log('10. Calling generateContent...');
      const result = await model.generateContent(prompt);
      console.log('11. generateContent returned');
      
      const response = await result.response;
      console.log('12. Got response object');
      
      mopContent = response.text();
      console.log('13. Got text, length:', mopContent?.length);
      
    } catch (genError) {
      console.error('Generation ERROR details:', {
        name: genError.name,
        message: genError.message,
        stack: genError.stack,
        status: genError.status,
        statusText: genError.statusText,
        fullError: genError.toString()
      });
      
      return NextResponse.json({ 
        error: 'Generation failed',
        details: genError.message || genError.toString(),
        errorName: genError.name,
        stage: 'generation',
        apiKeyPresent: !!apiKey
      }, { status: 500 });
    }
    
    // Try to save
    try {
      console.log('14. Saving to blob...');
      const blob = await put(`mops/${filename}`, mopContent || 'Test content', {
        access: 'public',
        contentType: 'text/plain'
      });
      console.log('15. Saved successfully:', blob.url);
      
      return NextResponse.json({ 
        success: true,
        filename: filename,
        url: blob.url
      });
      
    } catch (blobError) {
      console.error('Blob ERROR:', blobError);
      return NextResponse.json({ 
        error: 'Save failed',
        details: blobError.message,
        stage: 'blob_storage',
        contentGenerated: !!mopContent
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Outer catch ERROR:', error);
    return NextResponse.json({ 
      error: 'Unexpected error',
      details: error.message || error.toString(),
      stage: 'outer_catch'
    }, { status: 500 });
  }
}