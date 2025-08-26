import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { SourceManager } from '@/lib/mop-knowledge/source-manager';
import { sanitizeForFilename, getNextVersion, abbreviateTask } from '@/lib/mop-version-manager';

// Import all section generation functions
import {
  generateSection01,
  generateSection02,
  generateSection03,
  generateSection04,
  generateSection05,
  generateSection06,
  generateSection07,
  generateSection08,
  generateSection09,
  generateSection10,
  generateSection11
} from '../section-generators.js';

// Import enhancement function for sections 1-3
import { enhanceSections1to3 } from '../enhance-sections-1-4/route.js';

// Map section names to generator functions
const SECTION_GENERATORS = [
  { name: 'section-01-schedule', generator: generateSection01 },
  { name: 'section-02-site', generator: generateSection02 },
  { name: 'section-03-overview', generator: generateSection03 },
  { name: 'section-04-facility', generator: generateSection04 },
  { name: 'section-05-safety', generator: generateSection05 },
  { name: 'section-06-risks', generator: generateSection06 },
  { name: 'section-07-procedures', generator: generateSection07 },
  { name: 'section-08-backout', generator: generateSection08 },
  { name: 'section-09-approval', generator: generateSection09 },
  { name: 'section-10-comments', generator: generateSection10 },
  { name: 'section-11-references', generator: generateSection11 }
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

// Export the compile function for direct use
export async function compileMOP(formData) {
  try {
    const globalSourceManager = new SourceManager();
    
    console.log('Starting modular MOP generation with direct function calls...');
    
    // Generate each section using direct function calls
    const sections = [];
    const sections1to3 = [];
    
    for (let i = 0; i < SECTION_GENERATORS.length; i++) {
      const { name, generator } = SECTION_GENERATORS[i];
      
      try {
        console.log(`Generating ${name}...`);
        
        // Call the generator function directly
        const result = await generator(formData);
        
        sections.push(result.html);
        
        // Collect sections 1-3 separately for enhancement
        if (i < 3) {
          sections1to3.push(result.html);
        }
        
        // Merge sources from each section
        if (result.sources && Array.isArray(result.sources)) {
          result.sources.forEach(source => globalSourceManager.addSource(source));
        }
        
      } catch (error) {
        console.error(`Error generating ${name}:`, error);
        
        // Check for specific error types
        if (error.message?.includes('429') || error.message?.includes('busy') || error.message?.includes('quota')) {
          throw new Error(`AI service is busy. Please wait 2-3 minutes and try again.`);
        }
        
        if (error.message?.includes('API key') || error.message?.includes('API_KEY')) {
          throw new Error(`AI service configuration error. Please contact support.`);
        }
        
        // Don't fail the whole MOP if one section fails
        sections.push(`<h2>Error generating section ${name}</h2><p>${error.message}</p>`);
        if (i < 3) {
          sections1to3.push(`<h2>Error generating section ${name}</h2><p>${error.message}</p>`);
        }
      }
    }
    
    // Enhance sections 1-3 with AI research after all basic generation is complete
    if (sections1to3.length === 3) {
      try {
        console.log('Enhancing sections 1-3 with AI research for placeholders...');
        
        // Combine sections 1-3 for enhancement
        const combinedHtml = sections1to3.join('\n<div class="section-separator"></div>\n');
        
        // Enhance with AI
        const enhancedHtml = await enhanceSections1to3(combinedHtml, formData);
        
        // Split enhanced HTML back into individual sections
        // Look for section headers to split properly
        const sectionPattern = /<h2>Section \d{2}:[^<]*<\/h2>/g;
        const headers = enhancedHtml.match(sectionPattern) || [];
        
        if (headers.length >= 3) {
          // Split by section headers and reconstruct
          const parts = enhancedHtml.split(sectionPattern);
          
          for (let i = 0; i < 3; i++) {
            if (headers[i] && parts[i + 1]) {
              // Reconstruct each section with its header
              sections[i] = headers[i] + parts[i + 1].split('<div class="section-separator">')[0];
            }
          }
          console.log('Successfully enhanced sections 1-3 with AI research');
        } else {
          // Fallback: try simpler split by section separator
          const enhancedSections = enhancedHtml.split('<div class="section-separator"></div>');
          for (let i = 0; i < Math.min(3, enhancedSections.length); i++) {
            if (enhancedSections[i] && enhancedSections[i].trim()) {
              sections[i] = enhancedSections[i];
            }
          }
        }
      } catch (error) {
        console.error('Error enhancing sections 1-4:', error);
        console.log('Continuing with original sections (placeholders not replaced)');
        // Continue with original sections if enhancement fails
      }
    } else {
      console.log('Not all sections 1-4 generated successfully, skipping enhancement');
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
    
    // Helper function to abbreviate long component types
    const getAbbreviatedComponentType = (componentType) => {
      if (!componentType) return '';
      
      const abbreviations = {
        'Automatic Transfer Switch': 'ATS',
        'Uninterruptible Power Supply': 'UPS',
        'Computer Room Air Handler': 'CRAH',
        'Computer Room Air Conditioner': 'CRAC',
        'Variable Frequency Drive': 'VFD',
        'Power Distribution Unit': 'PDU'
      };
      
      // Return abbreviation if it exists and is significantly shorter
      if (abbreviations[componentType] && componentType.length > 20) {
        return abbreviations[componentType];
      }
      
      return componentType;
    };

    // Add blue title card after h1
    const { category, componentType } = formData;
    const titleCard = `
        <div style="background: #0f3456; color: white; padding: 30px; margin: 20px 0; border-radius: 5px; text-align: center;">
            <h2 style="font-size: 2.5em; margin: 0; color: white;">${getAbbreviatedComponentType(formData.componentType)} ${formData.description || formData.workDescription || 'Maintenance'}</h2>
        </div>`;
    
    // Build complete HTML
    const completeHtml = HTML_TEMPLATE
      .replace('<h1>Method of Procedure (MOP)</h1>', `<h1>Method of Procedure (MOP)</h1>${titleCard}`)
      .replace('{{SECTIONS}}', sectionsHtml)
      .replace('{{SCRIPTS}}', scripts);
    
    // Get existing MOPs to determine version
    const existingFiles = await list({ prefix: 'mops/' });
    
    // Extract work description from form data
    const workDescription = formData.workDescription || formData.description || formData.category || formData.system || 'MAINTENANCE';
    
    // Generate filename components according to new format
    // TYPE_EQUIP_ID_MANUFACTURER_WORK_DESC_DATE_VERSION
    const equipmentId = (formData.equipmentNumber || '').replace(/-/g, ''); // Remove hyphens (GEN-3 → GEN3)
    const manufacturer = (formData.manufacturer || 'UNKNOWN')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 10); // Max 10 chars, alphanumeric only
    const workDesc = workDescription
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, ''); // Replace spaces with underscores
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get the next version number based on equipment number and date
    const version = getNextVersion(
      existingFiles.blobs,
      equipmentId,
      currentDate
    );
    
    const filename = `MOP_${equipmentId}_${manufacturer}_${workDesc}_${currentDate}_V${version}.html`;

    // Save to blob storage
    const blob = await put(`mops/${filename}`, completeHtml, {
      access: 'public',
      contentType: 'text/html'
    });
    
    console.log('MOP generation complete:', filename);
    
    return { 
      success: true,
      filename: filename,
      url: blob.url,
      message: 'MOP generated successfully with source attribution'
    };
    
  } catch (error) {
    console.error('MOP compilation error:', error);
    throw error;
  }
}

// Keep the POST handler for backward compatibility
export async function POST(request) {
  try {
    const { formData } = await request.json();
    const result = await compileMOP(formData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('MOP compilation route error:', error);
    return NextResponse.json({ 
      error: 'Failed to compile MOP',
      details: error.message
    }, { status: 500 });
  }
}