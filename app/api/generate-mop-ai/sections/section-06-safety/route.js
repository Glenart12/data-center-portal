import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
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
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 30000,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
      tools: [{
        googleSearch: {}
      }]
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

export async function generateSection05(formData) {
  try {
    console.log('=== Section 06 Safety Generation ===');
    console.log('FormData:', JSON.stringify(formData, null, 2));
    
    if (!formData) {
      console.error('No formData found in request');
      throw new Error('Missing formData in request body');
    }
    
    const { manufacturer, modelNumber, system, componentType, workDescription, location, address } = formData;
    console.log('Destructured fields:', { manufacturer, modelNumber, system, componentType, workDescription, location, address });
    
    // Simplify equipment name for display
    const equipmentType = componentType || system || 'Equipment';
    const simplifiedEquipmentName = `${manufacturer} ${equipmentType}`;
    
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
    
    // Determine REQUIRED PPE based on specific maintenance task and equipment
    let ppeRows = '';
    
    // Analyze work description to determine which PPE is REQUIRED (not recommended)
    const workDesc = (workDescription || '').toLowerCase();
    const isElectricalWork = workDesc.includes('electrical') || workDesc.includes('power') || 
                            workDesc.includes('voltage') || workDesc.includes('breaker') ||
                            workDesc.includes('switchgear') || workDesc.includes('panel');
    const isHotWork = workDesc.includes('hot work') || workDesc.includes('energized') || 
                     workDesc.includes('live');
    const isConfinedSpace = workDesc.includes('confined') || workDesc.includes('enclosed');
    const isMechanicalWork = workDesc.includes('mechanical') || workDesc.includes('bearing') ||
                            workDesc.includes('motor') || workDesc.includes('compressor');
    const isChemicalWork = workDesc.includes('refrigerant') || workDesc.includes('chemical') ||
                          workDesc.includes('oil') || workDesc.includes('cleaning');
    
    // Eye protection - ALWAYS required per OSHA for maintenance work
    ppeRows += `
        <tr>
            <td><strong>Eye Protection</strong></td>
            <td>Safety glasses with side shields, ANSI Z87.1</td>
            <td>REQUIRED - At all times during maintenance work per OSHA 29 CFR 1910.133</td>
        </tr>`;
    
    // Hearing protection - Only if equipment noise exceeds 85 dBA
    if (componentType?.toLowerCase().includes('generator') || 
        componentType?.toLowerCase().includes('compressor') ||
        componentType?.toLowerCase().includes('chiller') ||
        workDesc.includes('running')) {
        ppeRows += `
        <tr>
            <td><strong>Hearing Protection</strong></td>
            <td>${hearingPPE?.specification || 'Hearing protection meeting OSHA requirements'}<br>Models: ${hearingPPE?.models?.join(', ') || 'TBD'}</td>
            <td>REQUIRED - When equipment noise exceeds 85 dBA per OSHA 29 CFR 1910.95</td>
        </tr>`;
    }
    
    // Electrical gloves - Only for actual electrical work
    if (isElectricalWork) {
        ppeRows += `
        <tr>
            <td><strong>Electrical Gloves</strong></td>
            <td>${electricalGloves?.specification || 'Class 0 insulated gloves'}<br>Models: ${electricalGloves?.models?.join(', ') || 'TBD'}</td>
            <td>REQUIRED - For electrical work per NFPA 70E and manufacturer specs for ${manufacturer} ${modelNumber}</td>
        </tr>`;
    }
    
    // Arc flash PPE - Only for energized electrical work
    if (isElectricalWork && (isHotWork || workDesc.includes('panel') || workDesc.includes('switchgear'))) {
        ppeRows += `
        <tr>
            <td><strong>Arc Flash PPE</strong></td>
            <td>Category ${arcFlashPPE?.rating || '2'} per arc flash study<br>Models: ${arcFlashPPE?.models?.join(', ') || 'TBD'}</td>
            <td>REQUIRED - For work on energized electrical equipment per NFPA 70E</td>
        </tr>`;
    }
    
    // Safety footwear - ALWAYS required in equipment areas
    ppeRows += `
        <tr>
            <td><strong>Safety Footwear</strong></td>
            <td>Steel-toed, slip-resistant, ASTM F2413</td>
            <td>REQUIRED - At all times in equipment areas per site safety policy</td>
        </tr>`;
    
    // Chemical gloves - Only for refrigerant/chemical work
    if (isChemicalWork) {
        ppeRows += `
        <tr>
            <td><strong>Chemical Gloves</strong></td>
            <td>Nitrile or neoprene gloves resistant to ${workDesc.includes('refrigerant') ? 'refrigerants' : 'chemicals'}</td>
            <td>REQUIRED - When handling refrigerants or chemicals per ${manufacturer} MSDS</td>
        </tr>`;
    }
    
    // Respirator - Only for confined spaces or chemical exposure
    if (isConfinedSpace || (isChemicalWork && workDesc.includes('leak'))) {
        ppeRows += `
        <tr>
            <td><strong>Respiratory Protection</strong></td>
            <td>Half-face respirator with appropriate cartridges or SCBA as required</td>
            <td>REQUIRED - For confined space entry or chemical exposure per OSHA 29 CFR 1910.134</td>
        </tr>`;
    }
    
    // Fall protection - Only for elevated work
    if (workDesc.includes('roof') || workDesc.includes('ladder') || workDesc.includes('elevated')) {
        ppeRows += `
        <tr>
            <td><strong>Fall Protection</strong></td>
            <td>Full body harness with shock-absorbing lanyard, ANSI Z359.1</td>
            <td>REQUIRED - For work at heights above 6 feet per OSHA 29 CFR 1926.501</td>
        </tr>`;
    }
    
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

    // Generate Tools Required table based on SPECIFIC equipment type and maintenance task
    // Analyze equipment type and work description to determine EXACT tools needed
    // workDesc already declared above, just reuse it
    const equipType = (componentType || system || '').toLowerCase();
    
    // Determine equipment category for tool selection
    const isElectricalEquipment = equipType.includes('ats') || equipType.includes('switchgear') || 
                                  equipType.includes('pdu') || equipType.includes('panel') || 
                                  equipType.includes('breaker') || equipType.includes('transfer switch');
    
    const isCoolingEquipment = equipType.includes('chiller') || equipType.includes('crac') || 
                               equipType.includes('crah') || equipType.includes('cooling') || 
                               equipType.includes('air handler') || equipType.includes('air conditioner');
    
    const isPowerEquipment = equipType.includes('ups') || equipType.includes('battery') || 
                            equipType.includes('uninterruptible') || equipType.includes('power supply');
    
    const isMechanicalEquipment = equipType.includes('generator') || equipType.includes('engine') || 
                                  equipType.includes('pump') || equipType.includes('motor') ||
                                  equipType.includes('compressor') || equipType.includes('fan');
    
    // Build tool rows based on ACTUAL equipment type and maintenance task
    let toolRows = '';
    
    // Electrical equipment tools - ONLY for electrical equipment
    if (isElectricalEquipment) {
        toolRows += `
        <tr>
            <td><strong>Electrical Test Equipment</strong></td>
            <td>• Fluke 87V or equivalent multimeter<br>
                • Fluke 376 FC clamp meter<br>
                • Megger MIT1025 insulation tester<br>
                • Phase rotation meter</td>
            <td>Voltage verification, current measurement, insulation testing for ${simplifiedEquipmentName}</td>
        </tr>
        <tr>
            <td><strong>Torque Tools</strong></td>
            <td>• Torque wrench (10-250 ft-lbs)<br>
                • Torque screwdriver set (5-50 in-lbs)<br>
                • Digital torque adapter</td>
            <td>Proper torquing of electrical connections per ${manufacturer} specifications</td>
        </tr>
        <tr>
            <td><strong>Safety Tools</strong></td>
            <td>• Lockout/tagout kit<br>
                • Non-contact voltage detector<br>
                • Ground fault tester<br>
                • Arc flash boundary tape</td>
            <td>Electrical safety and isolation for ${componentType} work</td>
        </tr>
        <tr>
            <td><strong>Hand Tools</strong></td>
            <td>• Insulated tool set (1000V rated)<br>
                • Cable pulling tools<br>
                • Wire strippers and crimpers</td>
            <td>Electrical component service on ${simplifiedEquipmentName}</td>
        </tr>`;
    }
    
    // Cooling equipment tools - ONLY for cooling equipment
    else if (isCoolingEquipment) {
        toolRows += `
        <tr>
            <td><strong>Refrigerant Service Tools</strong></td>
            <td>• Recovery machine (EPA certified)<br>
                • Vacuum pump (2-stage, 5 CFM min)<br>
                • Digital manifold gauge set<br>
                • Electronic leak detector</td>
            <td>Refrigerant service and leak detection for ${simplifiedEquipmentName}</td>
        </tr>
        <tr>
            <td><strong>Temperature & Pressure</strong></td>
            <td>• Infrared thermometer<br>
                • Thermocouple probe set<br>
                • Differential pressure gauge<br>
                • Psychrometer</td>
            <td>Temperature and pressure measurements for ${componentType} diagnostics</td>
        </tr>
        <tr>
            <td><strong>Mechanical Tools</strong></td>
            <td>• Socket set (metric and standard)<br>
                • Pipe wrenches<br>
                • Tube cutters and flaring tools<br>
                • Fin comb set</td>
            <td>Mechanical service on ${simplifiedEquipmentName} components</td>
        </tr>
        <tr>
            <td><strong>Electrical Test Equipment</strong></td>
            <td>• Multimeter<br>
                • Clamp meter<br>
                • Capacitor tester<br>
                • Motor rotation tester</td>
            <td>Electrical testing of ${componentType} controls and motors</td>
        </tr>`;
    }
    
    // Power equipment tools - ONLY for UPS/battery systems
    else if (isPowerEquipment) {
        toolRows += `
        <tr>
            <td><strong>Battery Test Equipment</strong></td>
            <td>• Battery load tester<br>
                • Digital hydrometer<br>
                • Battery impedance tester<br>
                • Thermal imaging camera</td>
            <td>Battery testing and diagnostics for ${simplifiedEquipmentName}</td>
        </tr>
        <tr>
            <td><strong>Electrical Test Equipment</strong></td>
            <td>• Power quality analyzer<br>
                • Oscilloscope<br>
                • Multimeter (True RMS)<br>
                • Insulation resistance tester</td>
            <td>Power quality and electrical testing for ${componentType}</td>
        </tr>
        <tr>
            <td><strong>Load Testing</strong></td>
            <td>• Load bank (appropriately sized)<br>
                • Power monitoring equipment<br>
                • Data logging equipment</td>
            <td>Load testing and verification of ${simplifiedEquipmentName} capacity</td>
        </tr>
        <tr>
            <td><strong>Safety Tools</strong></td>
            <td>• Acid spill kit<br>
                • Battery lifting equipment<br>
                • Insulated tools<br>
                • Lockout/tagout kit</td>
            <td>Safe handling and service of ${componentType} components</td>
        </tr>`;
    }
    
    // Mechanical equipment tools - ONLY for generators/engines/pumps
    else if (isMechanicalEquipment) {
        toolRows += `
        <tr>
            <td><strong>Engine Service Tools</strong></td>
            <td>• Oil analysis kit<br>
                • Coolant test kit<br>
                • Compression tester<br>
                • Fuel pressure gauge</td>
            <td>Engine diagnostics and fluid analysis for ${simplifiedEquipmentName}</td>
        </tr>
        <tr>
            <td><strong>Vibration Analysis</strong></td>
            <td>• Vibration analyzer<br>
                • Accelerometer sensors<br>
                • Tachometer<br>
                • Stroboscope</td>
            <td>Vibration and alignment analysis for ${componentType}</td>
        </tr>
        <tr>
            <td><strong>Mechanical Tools</strong></td>
            <td>• Torque wrench set<br>
                • Feeler gauges<br>
                • Dial indicators<br>
                • Alignment tools</td>
            <td>Mechanical adjustments and alignments on ${simplifiedEquipmentName}</td>
        </tr>
        <tr>
            <td><strong>Electrical Test Equipment</strong></td>
            <td>• Multimeter<br>
                • Megger tester<br>
                • Load bank connections<br>
                • Transfer switch test set</td>
            <td>Electrical testing of ${componentType} controls and transfer equipment</td>
        </tr>`;
    }
    
    // Default minimal tools if equipment type cannot be determined
    else {
        toolRows += `
        <tr>
            <td><strong>Basic Test Equipment</strong></td>
            <td>• Digital multimeter<br>
                • Infrared thermometer<br>
                • Flashlight</td>
            <td>Basic diagnostics for ${simplifiedEquipmentName}</td>
        </tr>
        <tr>
            <td><strong>Hand Tools</strong></td>
            <td>• Screwdriver set<br>
                • Wrench set<br>
                • Pliers</td>
            <td>General maintenance on ${simplifiedEquipmentName}</td>
        </tr>`;
    }
    
    // Always include safety equipment and manufacturer-specific tools
    toolRows += `
        <tr>
            <td><strong>Safety Equipment</strong></td>
            <td>• Lockout/tagout kit<br>
                • First aid kit<br>
                • Fire extinguisher (appropriate class)<br>
                • Emergency eyewash (if chemicals present)</td>
            <td>Safety equipment required for all maintenance work</td>
        </tr>
        <tr>
            <td><strong>Specialized ${manufacturer} Tools</strong></td>
            <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Enter ${manufacturer}-specific service tools per manual" style="width:100%" /></td>
            <td>Manufacturer-specific tools required per ${manufacturer} ${modelNumber} service manual</td>
        </tr>`;
    
    const toolsRequired = `
<h3>TOOLS REQUIRED</h3>
<p><strong>Specific tools required for ${simplifiedEquipmentName} ${workDescription || 'maintenance'} based on equipment type and task:</strong></p>
<table>
    <thead>
        <tr>
            <th>Tool Category</th>
            <th>Specific Tools</th>
            <th>Purpose</th>
        </tr>
    </thead>
    <tbody>
        ${toolRows}
    </tbody>
</table>`;

    const html = `<h2>Section 05: Safety Requirements</h2>

<h3>REQUIRED PERSONAL PROTECTIVE EQUIPMENT (PPE)</h3>
<p><strong>PPE requirements specific to ${simplifiedEquipmentName} maintenance:</strong></p>
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

${toolsRequired}

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
        ${(() => {
            // Build safety procedures based on SPECIFIC equipment type and maintenance task
            // Use existing variables already declared above
            let safetyRows = '';
            
            // Pre-Work Safety Briefing - ALWAYS required
            safetyRows += `
        <tr>
            <td><strong>Pre-Work Safety Briefing</strong></td>
            <td>Conduct safety briefing with all personnel, review hazards specific to ${simplifiedEquipmentName} maintenance, verify PPE</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>`;
            
            // LOTO - Required for ALL equipment with electrical or mechanical energy
            safetyRows += `
        <tr>
            <td><strong>Lockout/Tagout (LOTO)</strong></td>
            <td>Follow site LOTO procedure per <a href="https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147" target="_blank">OSHA 29 CFR 1910.147</a> for ${componentType} isolation</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>`;
            
            // Arc Flash Boundaries - ONLY for electrical equipment work
            if (isElectricalEquipment || (isElectricalWork && equipType.includes('panel'))) {
                safetyRows += `
        <tr>
            <td><strong>Arc Flash Boundary</strong></td>
            <td>Establish arc flash boundary per NFPA 70E and site arc flash study for ${componentType}</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>`;
            }
            
            // Electrical Safety - ONLY for electrical work
            if (isElectricalWork || isElectricalEquipment) {
                safetyRows += `
        <tr>
            <td><strong>Electrical Safety Verification</strong></td>
            <td>Verify zero energy state with meter, test meter on known source before and after</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>`;
            }
            
            // Refrigerant Handling - ONLY for cooling equipment with refrigerant work
            if (isCoolingEquipment && (workDesc.includes('refrigerant') || workDesc.includes('recharge') || workDesc.includes('leak'))) {
                safetyRows += `
        <tr>
            <td><strong>Refrigerant Handling</strong></td>
            <td>EPA 608 certified technician required, follow refrigerant recovery procedures for ${manufacturer} ${componentType}</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>`;
            }
            
            // Chemical Safety - ONLY if chemicals are involved
            if (isChemicalWork || workDesc.includes('chemical') || workDesc.includes('cleaning')) {
                safetyRows += `
        <tr>
            <td><strong>Chemical Safety</strong></td>
            <td>Review MSDS for all chemicals, ensure proper ventilation and PPE for ${workDesc.includes('refrigerant') ? 'refrigerant' : 'chemical'} exposure</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>`;
            }
            
            // Hot Work Permit - ONLY if welding/cutting/grinding is required
            if (workDesc.includes('weld') || workDesc.includes('cut') || workDesc.includes('grind') || workDesc.includes('torch')) {
                safetyRows += `
        <tr>
            <td><strong>Hot Work Permit</strong></td>
            <td>Required for welding, cutting, or grinding operations on ${componentType}</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>`;
            }
            
            // Confined Space - ONLY if work involves confined spaces
            if (workDesc.includes('confined') || workDesc.includes('tank') || workDesc.includes('vessel') || 
                equipType.includes('tank') || equipType.includes('vessel')) {
                safetyRows += `
        <tr>
            <td><strong>Confined Space Entry</strong></td>
            <td>Follow permit-required confined space procedures for ${componentType} entry</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>`;
            }
            
            // Fall Protection - ONLY if elevated work is required
            if (workDesc.includes('roof') || workDesc.includes('ladder') || workDesc.includes('elevated') || 
                workDesc.includes('lift') || location?.toLowerCase().includes('roof')) {
                safetyRows += `
        <tr>
            <td><strong>Fall Protection</strong></td>
            <td>Required for work above 6 feet, use proper fall arrest system for ${componentType} access</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>`;
            }
            
            // Fuel Handling - ONLY for generators/engines
            if (isMechanicalEquipment && (equipType.includes('generator') || equipType.includes('engine'))) {
                if (workDesc.includes('fuel') || workDesc.includes('tank') || workDesc.includes('diesel')) {
                    safetyRows += `
        <tr>
            <td><strong>Fuel System Safety</strong></td>
            <td>Ensure proper ventilation, no ignition sources, spill kit available for ${componentType} fuel system work</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>`;
                }
            }
            
            // Battery Safety - ONLY for UPS/battery work
            if (isPowerEquipment && (equipType.includes('battery') || equipType.includes('ups'))) {
                safetyRows += `
        <tr>
            <td><strong>Battery Safety</strong></td>
            <td>Ensure proper ventilation, acid spill kit available, use insulated tools for ${componentType} battery work</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>`;
            }
            
            // Noise Control - ONLY for loud equipment when running
            if ((isMechanicalEquipment || equipType.includes('compressor')) && 
                (workDesc.includes('running') || workDesc.includes('operational') || workDesc.includes('test'))) {
                safetyRows += `
        <tr>
            <td><strong>Noise Control</strong></td>
            <td>Hearing protection required when ${componentType} is running (>85 dBA)</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>`;
            }
            
            // Hot Surface Warning - ONLY for equipment with hot surfaces
            if (isMechanicalEquipment || isCoolingEquipment) {
                if (workDesc.includes('operational') || workDesc.includes('running') || !workDesc.includes('offline')) {
                    safetyRows += `
        <tr>
            <td><strong>Hot Surface Warning</strong></td>
            <td>Allow ${componentType} to cool before service, use thermal protection if required</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>`;
                }
            }
            
            return safetyRows;
        })()}
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
    
    return { 
      html, 
      sources: [] 
    };
    
  } catch (error) {
    console.error('=== Section 06 Safety Generation ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const result = await generateSection06(formData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Section 06 route error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate safety section',
      details: error.message,
      userMessage: 'Unable to generate safety requirements. Please try again.'
    }, { status: 500 });
  }
}