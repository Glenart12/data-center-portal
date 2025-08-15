import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { SourceManager } from '@/lib/mop-knowledge/source-manager'; // Fixed import
import { sanitizeForFilename, getNextVersion } from '@/lib/mop-version-manager';

const SECTION_ENDPOINTS = [
  'section-01-schedule',
  'section-02-site', 
  'section-03-overview',
  'section-04-facility',
  'section-05-documentation',
  'section-06-safety',
  'section-07-risks',
  'section-08-procedures',
  'section-09-backout',
  'section-10-approval',
  'section-11-comments',
  'section-12-references'
];

// Import the existing HTML template and styles from your current implementation
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Method of Procedure (MOP)</title>
    <style>
        /* YOUR EXACT EXISTING STYLES */
        body { 
            font-family: 'Century Gothic', Arial, sans-serif; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #f5f5f5; 
            line-height: 1.6;
        }
        .container { 
            background-color: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        h1 { 
            color: #0f3456; 
            text-align: center; 
            margin-bottom: 40px; 
            font-size: 2.5em;
            border-bottom: 3px solid #0f3456;
            padding-bottom: 20px;
        }
        h2 { 
            color: #0f3456; 
            border-bottom: 2px solid #0f3456; 
            padding-bottom: 10px; 
            margin-top: 40px; 
            font-size: 1.8em;
        }
        h3 {
            color: #0f3456;
            margin-top: 25px;
            font-size: 1.3em;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: left; 
        }
        th { 
            background-color: #0f3456; 
            color: white; 
            font-weight: bold;
        }
        tr:nth-child(even) { 
            background-color: #f9f9f9; 
        }
        .info-table td:first-child { 
            font-weight: bold; 
            background-color: #f0f0f0; 
            width: 35%; 
        }
        .citation {
            color: #0066cc;
            cursor: help;
            font-size: 0.8em;
            vertical-align: super;
        }
        .citation:hover {
            text-decoration: underline;
        }
        input[type="text"], input.field-box {
            border: 1px solid #999;
            padding: 5px;
            background-color: #fff;
            font-family: inherit;
            font-size: inherit;
            width: 90%;
        }
        .update-needed-input {
            color: red;
            font-weight: bold;
            border: none;
            background: transparent;
            width: 100%;
            font-family: inherit;
            font-size: inherit;
        }
        .update-needed-input:focus {
            outline: 1px solid #0f3456;
            background: #f9f9f9;
        }
        .update-needed-input:not(:placeholder-shown) {
            color: black;
            font-weight: normal;
        }
        .contractor-input {
            border: 1px solid #999;
            padding: 5px;
            background-color: #fff;
            font-family: inherit;
            font-size: inherit;
            width: 100%;
        }
        .contractor-input::placeholder {
            color: #666;
            font-style: italic;
        }
        .small-input {
            width: 60px;
            padding: 3px;
            border: 1px solid #999;
            font-size: 12px;
        }
        .safety-critical {
            background-color: #fee;
            font-weight: bold;
            color: #d00;
        }
        .verification {
            background-color: #eff;
            font-weight: bold;
            color: #00a;
        }
        .checkbox {
            text-align: center;
            font-size: 1.2em;
        }
        ul { 
            line-height: 1.8; 
            margin-left: 20px;
        }
        li {
            margin-bottom: 8px;
        }
        .safety-warning { 
            background-color: #fee; 
            padding: 15px; 
            border-radius: 5px; 
            margin: 20px 0;
            border: 2px solid #d00;
        }
        .section-separator {
            border-top: 2px solid #ccc;
            margin: 40px 0;
        }
        .data-recording-wrapper {
            overflow-x: auto;
            margin: 10px 0;
        }
        .data-recording-table {
            background-color: #f5f5f5;
            min-width: 100%;
        }
        .data-recording-table input {
            width: 80px;
            padding: 3px;
        }
        .notes-section {
            background-color: #f9f9f9;
            border: 1px dashed #ccc;
            padding: 10px;
            margin: 10px 0;
            min-height: 50px;
        }
        .sub-procedure {
            margin-left: 30px;
            font-style: italic;
        }
        @media print {
            body { background-color: white; }
            .container { box-shadow: none; padding: 20px; }
            h1, h2 { page-break-after: avoid; }
            table { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Method of Procedure (MOP)</h1>
        {{SECTIONS}}
    </div>
    {{SCRIPTS}}
</body>
</html>`;

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const globalSourceManager = new SourceManager();
    
    console.log('Starting modular MOP generation...');
    
    // Generate each section
    const sections = [];
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    for (const endpoint of SECTION_ENDPOINTS) {
      try {
        console.log(`Generating ${endpoint}...`);
        
        const response = await fetch(`${baseUrl}/api/generate-mop-ai/sections/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formData })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: response.statusText }));
          console.error(`Failed to generate ${endpoint}:`, errorData);
          
          // Check for specific error types
          if (response.status === 429 || errorData.error?.includes('busy') || errorData.error?.includes('quota')) {
            throw new Error(`AI service is busy. Please wait 2-3 minutes and try again.`);
          }
          
          if (errorData.error?.includes('API key') || errorData.error?.includes('API_KEY')) {
            throw new Error(`AI service configuration error. Please contact support.`);
          }
          
          throw new Error(`Failed to generate ${endpoint}: ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        sections.push(data.html);
        
        // Merge sources from each section
        if (data.sources && Array.isArray(data.sources)) {
          data.sources.forEach(source => globalSourceManager.addSource(source));
        }
        
      } catch (error) {
        console.error(`Error generating ${endpoint}:`, error);
        // Don't fail the whole MOP if one section fails
        sections.push(`<h2>Error generating section ${endpoint}</h2><p>${error.message}</p>`);
      }
    }
    
    // Compile sections with separators
    const sectionsHtml = sections.join('\n<div class="section-separator"></div>\n');
    
    // Citation tooltip script
    const scripts = `
    <script>
    // Tooltip functionality for citations
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('.citation').forEach(citation => {
        citation.addEventListener('mouseenter', function(e) {
          const sourceData = JSON.parse(this.dataset.source || '{}');
          const tooltip = document.createElement('div');
          tooltip.className = 'citation-tooltip';
          tooltip.style.cssText = 'position:absolute;background:#333;color:white;padding:8px;border-radius:4px;font-size:12px;z-index:1000;max-width:300px;';
          
          let content = '';
          if (sourceData.document) content += '<strong>' + sourceData.document + '</strong><br>';
          if (sourceData.page) content += 'Page: ' + sourceData.page + '<br>';
          if (sourceData.section) content += 'Section: ' + sourceData.section;
          
          tooltip.innerHTML = content || 'Source information';
          document.body.appendChild(tooltip);
          
          const rect = this.getBoundingClientRect();
          tooltip.style.left = rect.left + 'px';
          tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
          
          this._tooltip = tooltip;
        });
        
        citation.addEventListener('mouseleave', function() {
          if (this._tooltip) {
            this._tooltip.remove();
            delete this._tooltip;
          }
        });
      });
    });
    </script>`;
    
    // Build complete HTML
    const completeHtml = HTML_TEMPLATE
      .replace('{{SECTIONS}}', sectionsHtml)
      .replace('{{SCRIPTS}}', scripts);
    
    // Get existing MOPs to determine version
    const existingFiles = await list({ prefix: 'mops/' });
    
    // Extract work description from form data
    const workDescription = formData.workDescription || formData.category || formData.system || 'MAINTENANCE';
    
    // Get the next version number
    const version = getNextVersion(
      existingFiles.blobs,
      formData.manufacturer || '',
      formData.modelNumber || formData.model || '',
      formData.serialNumber || formData.serial || '',
      workDescription
    );
    
    // Generate consistent versioned filename
    const cleanManufacturer = sanitizeForFilename(formData.manufacturer || '');
    const cleanModel = sanitizeForFilename(formData.modelNumber || formData.model || '');
    const cleanSerial = sanitizeForFilename(formData.serialNumber || formData.serial || '');
    const cleanWorkDesc = sanitizeForFilename(workDescription);
    
    const filename = `MOP_${cleanManufacturer}_${cleanModel}_${cleanSerial}_${cleanWorkDesc}_V${version}.html`;

    // Save to blob storage
    const blob = await put(`mops/${filename}`, completeHtml, {
      access: 'public',
      contentType: 'text/html'
    });
    
    console.log('MOP generation complete:', filename);
    
    return NextResponse.json({ 
      success: true,
      filename: filename,
      url: blob.url,
      message: 'MOP generated successfully with source attribution'
    });
    
  } catch (error) {
    console.error('MOP compilation error:', error);
    return NextResponse.json({ 
      error: 'Failed to compile MOP',
      details: error.message
    }, { status: 500 });
  }
}