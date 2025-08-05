# MOP Section Route Template

This is the standard template for all MOP section generation routes.

## Standard Structure

```javascript
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
// Import any specific knowledge base modules needed

export async function POST(request) {
  try {
    // 1. EXTRACT DATA FROM FORMDATA
    const { formData } = await request.json();
    const { manufacturer, modelNumber, system, workDescription, location, frequency, category } = formData;
    
    // 2. INITIALIZE AI IF NEEDED
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    // 3. CREATE AI PROMPT (if using AI)
    const prompt = `Generate content for ${manufacturer} ${modelNumber} ${system}.
    
    IMPORTANT: 
    - Output clean HTML only
    - DO NOT use markdown code blocks or backticks
    - Format as proper HTML table rows/elements
    
    Example format:
    <tr><td>Field</td><td>Value</td></tr>`;
    
    // 4. GENERATE CONTENT
    let aiContent = '';
    if (prompt) {
      const result = await model.generateContent(prompt);
      aiContent = result.response.text();
      
      // Clean up any markdown formatting
      aiContent = aiContent.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    }
    
    // 5. BUILD HTML STRUCTURE
    const html = `<h2>Section XX: Title</h2>
<table class="info-table">
    <!-- Static content -->
    ${aiContent}
</table>`;

    // 6. PREPARE SOURCES (if applicable)
    const sources = [
      {
        type: "source_type",
        document: "Document Name",
        section: "Section",
        lastVerified: new Date().toISOString().split('T')[0]
      }
    ];

    // 7. RETURN RESPONSE
    return NextResponse.json({ html, sources });
    
  } catch (error) {
    console.error('Section generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate section',
      details: error.message,
      userMessage: 'Unable to generate section content. Please try again.'
    }, { status: 500 });
  }
}
```

## Key Requirements

1. **Extract from formData**: Always use `const { formData } = await request.json()`
2. **Clean AI output**: Remove markdown code blocks with regex
3. **Proper error handling**: Include user-friendly error messages
4. **Consistent structure**: Follow the 7-step template
5. **HTML only**: No markdown in final output