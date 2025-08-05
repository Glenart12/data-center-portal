import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEquipmentData } from '@/lib/mop-knowledge/enhanced-equipment-database';
import { ENHANCED_PPE_REQUIREMENTS } from '@/lib/mop-knowledge/enhanced-safety-standards';
import { getRelevantEOPs } from '@/lib/mop-knowledge/eop-references';

// Function to research local emergency contacts using AI
async function researchLocalEmergencyContacts(address) {
  if (!address?.city || !address?.state || !address?.zipCode) {
    console.log('Insufficient address information for emergency contact research');
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-pro",
      generationConfig: {
        temperature: 0.1,
        topP: 0.1,
        topK: 1,
        maxOutputTokens: 2048,
      }
    });

    const prompt = `Research and provide ACTUAL phone numbers and addresses for local emergency services in ${address.city}, ${address.state} ${address.zipCode}. Look up real hospitals, real fire/police non-emergency numbers, and real utility companies serving this area. Only use 'XXX-XXX-XXXX' placeholders if you cannot find real information after searching.

For utilities, identify the actual companies based on location:
- For Illinois: ComEd or Ameren for electric, Nicor or Peoples Gas for gas
- For New York: ConEd or National Grid  
- For California: PG&E, SCE, or SDG&E
- For Texas: Oncor, CenterPoint, AEP Texas, etc.
- Research which utilities actually serve the specific zip code ${address.zipCode}

Provide the information in this JSON format:
{
  "buildingDepartment": {
    "name": "Actual building department name",
    "phone": "actual phone number",
    "address": "actual address"
  },
  "nearestHospital": {
    "name": "Actual hospital name",
    "phone": "actual phone number", 
    "address": "actual address"
  },
  "fireNonEmergency": {
    "name": "Actual fire department name",
    "phone": "actual non-emergency number",
    "address": "actual address"
  },
  "policeNonEmergency": {
    "name": "Actual police department name", 
    "phone": "actual non-emergency number",
    "address": "actual address"
  },
  "electricUtility": {
    "name": "Actual electric utility company name",
    "phone": "actual emergency/outage number"
  },
  "gasUtility": {
    "name": "Actual gas utility company name",
    "phone": "actual emergency number"
  }
}

Research this information thoroughly - these are real emergency contacts that may be needed during actual data center operations.`;

    console.log('Researching emergency contacts for:', address.city, address.state, address.zipCode);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log('AI emergency contact research response:', responseText);
    
    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    console.log('No valid JSON found in AI response');
    return null;
    
  } catch (error) {
    console.error('Error researching emergency contacts:', error);
    return null;
  }
}

export async function POST(request) {
  try {
    console.log('=== Section 06 Safety Route ===');
    const requestBody = await request.json();
    console.log('Raw request body:', JSON.stringify(requestBody, null, 2));
    
    const { formData } = requestBody;
    console.log('Extracted formData:', JSON.stringify(formData, null, 2));
    
    if (!formData) {
      console.error('No formData found in request');
      throw new Error('Missing formData in request body');
    }
    
    const { manufacturer, modelNumber, system, workDescription, location, address } = formData;
    console.log('Destructured fields:', { manufacturer, modelNumber, system, workDescription, location, address });
    
    // Get equipment data and EOPs
    console.log('Getting equipment data for:', manufacturer, modelNumber);
    const equipmentData = getEquipmentData(manufacturer, modelNumber);
    console.log('Equipment data result:', equipmentData);
    
    console.log('Getting relevant EOPs for:', system, workDescription);
    const relevantEOPs = getRelevantEOPs(system?.toLowerCase() || '', workDescription || '');
    
    console.log('Relevant EOPs result:', relevantEOPs);
    
    // Research local emergency contacts
    console.log('Researching local emergency contacts...');
    const emergencyContacts = await researchLocalEmergencyContacts(address);
    console.log('Emergency contacts research result:', emergencyContacts);
    
    
    // Build PPE table with specific models
    console.log('Building PPE requirements...');
    console.log('ENHANCED_PPE_REQUIREMENTS structure:', Object.keys(ENHANCED_PPE_REQUIREMENTS));
    
    const hearingPPE = ENHANCED_PPE_REQUIREMENTS.hearing?.standard;
    const electricalGloves = ENHANCED_PPE_REQUIREMENTS.electrical?.gloves;
    const arcFlashPPE = ENHANCED_PPE_REQUIREMENTS.electrical?.arcFlash?.category2;
    
    console.log('PPE data extracted:', { hearingPPE: !!hearingPPE, electricalGloves: !!electricalGloves, arcFlashPPE: !!arcFlashPPE });
    
    const ppeRows = `
        <tr>
            <td><strong>Eye Protection</strong></td>
            <td>Safety glasses with side shields, ANSI Z87.1</td>
            <td>At all times during maintenance work</td>
        </tr>
        <tr>
            <td><strong>Hearing Protection</strong></td>
            <td>${hearingPPE?.specification || 'Standard hearing protection required'}<br>Models: ${hearingPPE?.models?.join(', ') || 'TBD'}</td>
            <td>Equipment room, running equipment</td>
        </tr>
        <tr>
            <td><strong>Electrical Gloves</strong></td>
            <td>${electricalGloves?.specification || 'Class 0 insulated gloves'}<br>Models: ${electricalGloves?.models?.join(', ') || 'TBD'}</td>
            <td>All electrical work</td>
        </tr>
        <tr>
            <td><strong>Arc Flash PPE</strong></td>
            <td>Category ${arcFlashPPE?.rating || '2'}<br>Models: ${arcFlashPPE?.models?.join(', ') || 'TBD'}</td>
            <td>Electrical panel work</td>
        </tr>
        <tr>
            <td><strong>Safety Footwear</strong></td>
            <td>Steel-toed, slip-resistant, ASTM F2413</td>
            <td>At all times in equipment areas</td>
        </tr>`;
    
    // Build EOP references section
    let eopSection = '';
    if (relevantEOPs.length > 0) {
      eopSection = `
<h3>RELATED EMERGENCY OPERATING PROCEDURES</h3>
<div style="background-color: #e6f3ff; border-left: 4px solid #0066cc; padding: 10px; margin: 10px 0;">
    <ul>
${relevantEOPs.map(eop => `        <li><strong>${eop.number}:</strong> ${eop.title}</li>`).join('\n')}
    </ul>
</div>`;
    }

    const html = `<h2>Section 06: Safety Requirements</h2>
<p><strong>Pre Work Conditions / Safety Requirements</strong></p>

<h3>REQUIRED PERSONAL PROTECTIVE EQUIPMENT (PPE)</h3>
<table>
    <thead>
        <tr>
            <th>PPE Category</th>
            <th>Specification</th>
            <th>When Required</th>
        </tr>
    </thead>
    <tbody>
        ${ppeRows}
    </tbody>
</table>

${eopSection}

<h3>SAFETY PROCEDURES</h3>
<table>
    <thead>
        <tr>
            <th>Procedure</th>
            <th>Requirements</th>
            <th width="80">Initials</th>
            <th width="80">Time</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Pre-Work Safety Briefing</strong></td>
            <td>Conduct safety briefing with all personnel, review hazards, verify PPE</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Lockout/Tagout (LOTO)</strong></td>
            <td>Follow site LOTO procedure per <a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147" target="_blank">OSHA 29 CFR 1910.147</a> - The Control of Hazardous Energy</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Confined Space Entry</strong></td>
            <td>If applicable, follow permit-required confined space procedures</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Hot Work Permit</strong></td>
            <td>Required for any welding, cutting, or grinding operations</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
    </tbody>
</table>

<h3>EMERGENCY CONTACTS</h3>
<table>
    <thead>
        <tr>
            <th>Emergency Type</th>
            <th>Contact</th>
            <th>Phone Number</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Medical Emergency</td>
            <td>Emergency Medical Services</td>
            <td>911</td>
        </tr>
        <tr>
            <td>Fire Emergency</td>
            <td>Fire Department</td>
            <td>911</td>
        </tr>
        <tr>
            <td>Chemical Emergency</td>
            <td>Poison Control / CHEMTREC</td>
            <td>1-800-222-1222 / 1-800-424-9300</td>
        </tr>
        <tr>
            <td>Facility Emergency</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Site Emergency Contact" style="width:200px" /></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Phone" style="width:150px" /></td>
        </tr>
        <tr>
            <td>Equipment Manufacturer</td>
            <td>${manufacturer || 'Equipment'} Technical Support</td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED" style="width:150px" /></td>
        </tr>
    </tbody>
</table>

<h3>LOCAL EMERGENCY SERVICES</h3>
<p><strong>Location: ${address?.street || 'Site Address'}, ${address?.city || 'City'}, ${address?.state || 'State'} ${address?.zipCode || 'ZIP'}</strong></p>
${emergencyContacts ? `
<div style="background-color: #d4edda; border: 1px solid #28a745; padding: 10px; margin: 10px 0; border-radius: 4px;">
    <strong>✓ RESEARCHED:</strong> The contact information below has been researched for this specific location. Please verify current phone numbers before use as they may change over time.
</div>` : `
<div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 10px; margin: 10px 0; border-radius: 4px;">
    <strong>⚠️ IMPORTANT:</strong> Unable to research specific contact information for this location. Please verify all phone numbers below with local directory assistance or city/county offices before use.
</div>`}
<table>
    <thead>
        <tr>
            <th>Service</th>
            <th>Contact Name</th>
            <th>Phone Number</th>
            <th>Address</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Local AHJ (Authority Having Jurisdiction)</strong></td>
            <td>${emergencyContacts?.buildingDepartment?.name || `${address?.city || 'City'} Building Department`}</td>
            <td>${emergencyContacts?.buildingDepartment?.phone || 'XXX-XXX-XXXX (VERIFY LOCALLY)'}</td>
            <td>${emergencyContacts?.buildingDepartment?.address || `${address?.city || 'City'} Municipal Building`}</td>
        </tr>
        <tr>
            <td><strong>Nearest Hospital</strong></td>
            <td>${emergencyContacts?.nearestHospital?.name || `${address?.city || 'City'} General Hospital`}</td>
            <td>${emergencyContacts?.nearestHospital?.phone || 'XXX-XXX-XXXX (VERIFY LOCALLY)'}</td>
            <td>${emergencyContacts?.nearestHospital?.address || 'Address not available - verify locally'}</td>
        </tr>
        <tr>
            <td><strong>Fire Department (Non-Emergency)</strong></td>
            <td>${emergencyContacts?.fireNonEmergency?.name || `${address?.city || 'City'} Fire Department`}</td>
            <td>${emergencyContacts?.fireNonEmergency?.phone || 'XXX-XXX-XXXX (VERIFY LOCALLY)'}</td>
            <td>${emergencyContacts?.fireNonEmergency?.address || 'Address not available - verify locally'}</td>
        </tr>
        <tr>
            <td><strong>Police Department (Non-Emergency)</strong></td>
            <td>${emergencyContacts?.policeNonEmergency?.name || `${address?.city || 'City'} Police Department`}</td>
            <td>${emergencyContacts?.policeNonEmergency?.phone || 'XXX-XXX-XXXX (VERIFY LOCALLY)'}</td>
            <td>${emergencyContacts?.policeNonEmergency?.address || `${address?.city || 'City'} Police Headquarters`}</td>
        </tr>
        <tr>
            <td><strong>Local Utility - Electric</strong></td>
            <td>${emergencyContacts?.electricUtility?.name || `${address?.state || 'State'} Electric Company`}</td>
            <td>${emergencyContacts?.electricUtility?.phone || 'XXX-XXX-XXXX (VERIFY LOCALLY)'}</td>
            <td>24/7 Emergency Line</td>
        </tr>
        <tr>
            <td><strong>Local Utility - Gas</strong></td>
            <td>${emergencyContacts?.gasUtility?.name || `${address?.state || 'State'} Gas Company`}</td>
            <td>${emergencyContacts?.gasUtility?.phone || 'XXX-XXX-XXXX (VERIFY LOCALLY)'}</td>
            <td>24/7 Emergency Line</td>
        </tr>
    </tbody>
</table>

<div class="safety-warning">
    <strong>CRITICAL:</strong> Work shall NOT proceed until safety briefing is completed and all required PPE is verified available. All personnel must sign the safety briefing attendance sheet.
</div>`;

    console.log('Generated HTML length:', html.length);
    console.log('Section 06 completed successfully');
    
    return NextResponse.json({ 
      html, 
      sources: [] 
    });
    
  } catch (error) {
    console.error('=== Section 06 Safety Route ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Failed to generate safety section',
      details: error.message,
      userMessage: 'Unable to generate safety requirements. Please try again.'
    }, { status: 500 });
  }
}