import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCompressorCount } from '@/lib/mop-knowledge/enhanced-equipment-database';
import { SourceManager } from '@/lib/mop-knowledge/source-manager';

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const { manufacturer, modelNumber, system, workDescription } = formData;
    const sourceManager = new SourceManager();
    
    // Generate equipment-specific data recording tables
    const generateDataRecordingTable = (system, manufacturer, modelNumber) => {
      const systemType = system.toLowerCase();
      
      if (systemType.includes('chiller')) {
        const compressorCount = getCompressorCount(manufacturer, modelNumber);
        return generateChillerDataTable(compressorCount);
      } else if (systemType.includes('generator')) {
        return generateGeneratorDataTable();
      } else if (systemType.includes('ups')) {
        return generateUPSDataTable();
      } else if (systemType.includes('cooling')) {
        return generateCoolingDataTable();
      } else if (systemType.includes('transformer')) {
        return generateTransformerDataTable();
      } else {
        return generateGenericDataTable(system);
      }
    };

    const generateChillerDataTable = (compressorCount) => {
      if (compressorCount <= 0) compressorCount = 2; // Default to 2 compressors
      return `
<h3>Chiller Operational Data Log</h3>
<div class="data-recording-wrapper">
<table class="data-recording-table">
    <thead>
        <tr>
            <th rowspan="2">Parameter</th>
            ${Array.from({length: compressorCount}, (_, i) => 
              `<th colspan="2">Compressor ${i + 1}</th>`
            ).join('\n            ')}
            <th rowspan="2">Units</th>
        </tr>
        <tr>
            ${Array.from({length: compressorCount}, () => 
              `<th>As Found</th><th>As Left</th>`
            ).join('\n            ')}
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Voltage L1-L2</td>
            ${Array.from({length: compressorCount * 2}, () => 
              `<td><input type="text" /></td>`
            ).join('')}
            <td>VAC</td>
        </tr>
        <tr>
            <td>Voltage L2-L3</td>
            ${Array.from({length: compressorCount * 2}, () => 
              `<td><input type="text" /></td>`
            ).join('')}
            <td>VAC</td>
        </tr>
        <tr>
            <td>Voltage L1-L3</td>
            ${Array.from({length: compressorCount * 2}, () => 
              `<td><input type="text" /></td>`
            ).join('')}
            <td>VAC</td>
        </tr>
        <tr>
            <td>Current L1</td>
            ${Array.from({length: compressorCount * 2}, () => 
              `<td><input type="text" /></td>`
            ).join('')}
            <td>Amps</td>
        </tr>
        <tr>
            <td>Current L2</td>
            ${Array.from({length: compressorCount * 2}, () => 
              `<td><input type="text" /></td>`
            ).join('')}
            <td>Amps</td>
        </tr>
        <tr>
            <td>Current L3</td>
            ${Array.from({length: compressorCount * 2}, () => 
              `<td><input type="text" /></td>`
            ).join('')}
            <td>Amps</td>
        </tr>
        <tr>
            <td>Oil Level</td>
            ${Array.from({length: compressorCount * 2}, () => 
              `<td><input type="text" /></td>`
            ).join('')}
            <td>%</td>
        </tr>
        <tr>
            <td>Discharge Temp</td>
            ${Array.from({length: compressorCount * 2}, () => 
              `<td><input type="text" /></td>`
            ).join('')}
            <td>°F</td>
        </tr>
        <tr>
            <td>Suction Temp</td>
            ${Array.from({length: compressorCount * 2}, () => 
              `<td><input type="text" /></td>`
            ).join('')}
            <td>°F</td>
        </tr>
        <tr>
            <td>Discharge Pressure</td>
            ${Array.from({length: compressorCount * 2}, () => 
              `<td><input type="text" /></td>`
            ).join('')}
            <td>PSIG</td>
        </tr>
        <tr>
            <td>Suction Pressure</td>
            ${Array.from({length: compressorCount * 2}, () => 
              `<td><input type="text" /></td>`
            ).join('')}
            <td>PSIG</td>
        </tr>
        <tr>
            <td>Chilled Water Temp In</td>
            ${Array.from({length: compressorCount * 2}, () => 
              `<td><input type="text" /></td>`
            ).join('')}
            <td>°F</td>
        </tr>
        <tr>
            <td>Chilled Water Temp Out</td>
            ${Array.from({length: compressorCount * 2}, () => 
              `<td><input type="text" /></td>`
            ).join('')}
            <td>°F</td>
        </tr>
    </tbody>
</table>
</div>

<h3>Chiller Performance Data</h3>
<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>As Found</th>
            <th>As Left</th>
            <th>Units</th>
            <th>Acceptable Range</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Chilled Water Flow Rate</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>GPM</td>
            <td>Per design specs</td>
        </tr>
        <tr>
            <td>Condenser Water Flow Rate</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>GPM</td>
            <td>Per design specs</td>
        </tr>
        <tr>
            <td>kW Input</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>kW</td>
            <td>Per nameplate</td>
        </tr>
        <tr>
            <td>Cooling Capacity</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>Tons</td>
            <td>Per nameplate</td>
        </tr>
    </tbody>
</table>`;
    };

    const generateGeneratorDataTable = () => {
      return `
<h3>Generator Operational Data Log</h3>
<div class="data-recording-wrapper">
<table class="data-recording-table">
    <thead>
        <tr>
            <th>Parameter</th>
            <th>As Found</th>
            <th>As Left</th>
            <th>Units</th>
            <th>Acceptable Range</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Output Voltage L1-L2</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>480 ±5%</td>
        </tr>
        <tr>
            <td>Output Voltage L2-L3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>480 ±5%</td>
        </tr>
        <tr>
            <td>Output Voltage L1-L3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>480 ±5%</td>
        </tr>
        <tr>
            <td>Output Current L1</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>Amps</td>
            <td>Per load</td>
        </tr>
        <tr>
            <td>Output Current L2</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>Amps</td>
            <td>Per load</td>
        </tr>
        <tr>
            <td>Output Current L3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>Amps</td>
            <td>Per load</td>
        </tr>
        <tr>
            <td>Frequency</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>Hz</td>
            <td>60 ±0.5</td>
        </tr>
        <tr>
            <td>Engine RPM</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>RPM</td>
            <td>1800 ±1%</td>
        </tr>
        <tr>
            <td>Oil Pressure</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>PSI</td>
            <td>30-80 PSI</td>
        </tr>
        <tr>
            <td>Coolant Temperature</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>°F</td>
            <td>160-200°F</td>
        </tr>
        <tr>
            <td>Fuel Level</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>%</td>
            <td>>25%</td>
        </tr>
        <tr>
            <td>Battery Voltage</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VDC</td>
            <td>24-28 VDC</td>
        </tr>
    </tbody>
</table>
</div>

<h3>Engine Performance Data</h3>
<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Reading</th>
            <th>Units</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Hours of Operation</td>
            <td><input type="text" /></td>
            <td>Hours</td>
            <td><input type="text" /></td>
        </tr>
        <tr>
            <td>Last Service Date</td>
            <td><input type="text" /></td>
            <td>Date</td>
            <td><input type="text" /></td>
        </tr>
        <tr>
            <td>Next Service Due</td>
            <td><input type="text" /></td>
            <td>Hours/Date</td>
            <td><input type="text" /></td>
        </tr>
    </tbody>
</table>`;
    };

    const generateUPSDataTable = () => {
      return `
<h3>UPS System Data Log</h3>
<div class="data-recording-wrapper">
<table class="data-recording-table">
    <thead>
        <tr>
            <th>Parameter</th>
            <th>As Found</th>
            <th>As Left</th>
            <th>Units</th>
            <th>Acceptable Range</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Input Voltage L1-L2</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>480 ±10%</td>
        </tr>
        <tr>
            <td>Input Voltage L2-L3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>480 ±10%</td>
        </tr>
        <tr>
            <td>Input Voltage L1-L3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>480 ±10%</td>
        </tr>
        <tr>
            <td>Output Voltage L1-L2</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>480 ±2%</td>
        </tr>
        <tr>
            <td>Output Voltage L2-L3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>480 ±2%</td>
        </tr>
        <tr>
            <td>Output Voltage L1-L3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>480 ±2%</td>
        </tr>
        <tr>
            <td>Load Current L1</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>Amps</td>
            <td>Per load</td>
        </tr>
        <tr>
            <td>Load Current L2</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>Amps</td>
            <td>Per load</td>
        </tr>
        <tr>
            <td>Load Current L3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>Amps</td>
            <td>Per load</td>
        </tr>
        <tr>
            <td>Output Frequency</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>Hz</td>
            <td>60 ±0.1</td>
        </tr>
        <tr>
            <td>Load Percentage</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>%</td>
            <td><80%</td>
        </tr>
    </tbody>
</table>
</div>

<h3>Battery System Data</h3>
<table>
    <thead>
        <tr>
            <th>Battery String</th>
            <th>Voltage (VDC)</th>
            <th>Current (ADC)</th>
            <th>Temperature (°F)</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>String 1</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
        </tr>
        <tr>
            <td>String 2</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
        </tr>
        <tr>
            <td>String 3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
        </tr>
        <tr>
            <td>String 4</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
        </tr>
    </tbody>
</table>

<h3>UPS Performance Test Results</h3>
<table>
    <thead>
        <tr>
            <th>Test Parameter</th>
            <th>Result</th>
            <th>Pass/Fail</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Battery Runtime Test</td>
            <td><input type="text" /> minutes</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
        </tr>
        <tr>
            <td>Transfer Time Test</td>
            <td><input type="text" /> ms</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
        </tr>
        <tr>
            <td>Bypass Operation Test</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
        </tr>
    </tbody>
</table>`;
    };

    const generateCoolingDataTable = () => {
      return `
<h3>Cooling System Data Log</h3>
<div class="data-recording-wrapper">
<table class="data-recording-table">
    <thead>
        <tr>
            <th>Parameter</th>
            <th>As Found</th>
            <th>As Left</th>
            <th>Units</th>
            <th>Acceptable Range</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Supply Air Temperature</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>°F</td>
            <td>65-75°F</td>
        </tr>
        <tr>
            <td>Return Air Temperature</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>°F</td>
            <td>75-85°F</td>
        </tr>
        <tr>
            <td>Supply Air Humidity</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>%RH</td>
            <td>40-60%</td>
        </tr>
        <tr>
            <td>Return Air Humidity</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>%RH</td>
            <td>40-60%</td>
        </tr>
        <tr>
            <td>Fan Speed</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>%</td>
            <td>Per load</td>
        </tr>
        <tr>
            <td>Airflow</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>CFM</td>
            <td>Per design</td>
        </tr>
    </tbody>
</table>
</div>`;
    };

    const generateTransformerDataTable = () => {
      return `
<h3>Transformer Data Log</h3>
<div class="data-recording-wrapper">
<table class="data-recording-table">
    <thead>
        <tr>
            <th>Parameter</th>
            <th>As Found</th>
            <th>As Left</th>
            <th>Units</th>
            <th>Acceptable Range</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Primary Voltage L1-L2</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>Per nameplate ±5%</td>
        </tr>
        <tr>
            <td>Primary Voltage L2-L3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>Per nameplate ±5%</td>
        </tr>
        <tr>
            <td>Primary Voltage L1-L3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>Per nameplate ±5%</td>
        </tr>
        <tr>
            <td>Secondary Voltage L1-L2</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>Per nameplate ±2%</td>
        </tr>
        <tr>
            <td>Secondary Voltage L2-L3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>Per nameplate ±2%</td>
        </tr>
        <tr>
            <td>Secondary Voltage L1-L3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td>Per nameplate ±2%</td>
        </tr>
        <tr>
            <td>Load Current L1</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>Amps</td>
            <td>Per load</td>
        </tr>
        <tr>
            <td>Load Current L2</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>Amps</td>
            <td>Per load</td>
        </tr>
        <tr>
            <td>Load Current L3</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>Amps</td>
            <td>Per load</td>
        </tr>
        <tr>
            <td>Oil Temperature</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>°F</td>
            <td><180°F</td>
        </tr>
    </tbody>
</table>
</div>`;
    };

    const generateGenericDataTable = (system) => {
      return `
<h3>${system} System Data Log</h3>
<div class="data-recording-wrapper">
<table class="data-recording-table">
    <thead>
        <tr>
            <th>Parameter</th>
            <th>As Found</th>
            <th>As Left</th>
            <th>Units</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Voltage Reading</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>VAC</td>
            <td><input type="text" /></td>
        </tr>
        <tr>
            <td>Current Reading</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>Amps</td>
            <td><input type="text" /></td>
        </tr>
        <tr>
            <td>Temperature</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>°F</td>
            <td><input type="text" /></td>
        </tr>
        <tr>
            <td>Pressure</td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td>PSI</td>
            <td><input type="text" /></td>
        </tr>
    </tbody>
</table>
</div>`;
    };

    // Generate the appropriate data table
    let operationalDataTable = generateDataRecordingTable(system, manufacturer, modelNumber);

    // Add fault/alarm history table for all equipment types
    operationalDataTable += `

<h3>System Fault/Alarm History</h3>
<table>
    <thead>
        <tr>
            <th>Date/Time</th>
            <th>Fault/Alarm Code</th>
            <th>Description</th>
            <th>Action Taken</th>
            <th>Initials</th>
        </tr>
    </thead>
    <tbody>
        ${Array.from({length: 5}, () => `
        <tr>
            <td><input type="text" style="width:120px" /></td>
            <td><input type="text" style="width:80px" /></td>
            <td><input type="text" style="width:250px" /></td>
            <td><input type="text" style="width:250px" /></td>
            <td><input type="text" style="width:60px" /></td>
        </tr>`).join('')}
    </tbody>
</table>`;
    
    
    // Use AI to generate detailed procedures
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    
    // Get equipment-specific details for procedures
    const getEquipmentSpecificData = (manufacturer, modelNumber) => {
      const mfg = manufacturer?.toLowerCase() || '';
      const model = modelNumber?.toLowerCase() || '';
      
      if (mfg.includes('york') && model.includes('yvaa')) {
        return {
          torqueValues: {
            electrical: '45 ft-lbs (power connections)',
            mechanical: '25 ft-lbs (pump coupling)',
            refrigerant: '15 ft-lbs (service valves)'
          },
          pressures: {
            operating: '125-145 PSIG (condenser)',
            suction: '35-45 PSIG (evaporator)',
            oilPressure: '18-25 PSID (minimum)'
          },
          temperatures: {
            dischargeTempMax: '220°F',
            approachTempMax: '5°F condenser, 2°F evaporator'
          },
          refrigerant: 'R-134a',
          oilType: 'York Oil 00022',
          specificProcedures: true
        };
      } else if (mfg.includes('trane')) {
        return {
          torqueValues: {
            electrical: '50 ft-lbs (power connections)',
            mechanical: '30 ft-lbs (pump coupling)',
            refrigerant: '18 ft-lbs (service valves)'
          },
          pressures: {
            operating: '120-150 PSIG (condenser)',
            suction: '32-42 PSIG (evaporator)',
            oilPressure: '20-30 PSID (minimum)'
          },
          refrigerant: 'R-134a',
          oilType: 'Trane Oil 00022',
          specificProcedures: false
        };
      }
      
      return {
        torqueValues: { electrical: '40-50 ft-lbs', mechanical: '25-35 ft-lbs', refrigerant: '12-18 ft-lbs' },
        pressures: { operating: '120-150 PSIG', suction: '30-50 PSIG', oilPressure: '15-25 PSID' },
        refrigerant: 'R-134a or R-410A',
        oilType: 'Manufacturer specified',
        specificProcedures: false
      };
    };

    const equipmentData = getEquipmentSpecificData(manufacturer, modelNumber);

    const getDynamicProcedurePrompt = (system, workDescription, equipmentData) => {
      const systemType = system.toLowerCase();
      
      return `Generate comprehensive maintenance procedure steps for ${manufacturer} ${modelNumber} ${system} ${workDescription || 'maintenance'}.
      
      CRITICAL ACCURACY REQUIREMENTS:
      - Generate procedures SPECIFIC to ${manufacturer} ${modelNumber} ${system}
      - Research actual ${manufacturer} ${modelNumber} specifications and maintenance procedures
      - Use real regulatory requirements (OSHA, EPA, NFPA) and industry standards
      - Base procedures on accurate technical data and documented manufacturer requirements
      - DO NOT make up specific technical values, torque specifications, or pressure readings
      - If specific manufacturer data is not known, mark as "VERIFY WITH MANUFACTURER" or "REFER TO ${manufacturer} MANUAL"
      - Use genuine safety procedures and industry-standard practices
      - Reference actual equipment characteristics and known maintenance requirements
      - ALWAYS reference the specific equipment: ${manufacturer} ${modelNumber} Serial #${formData.serialNumber || 'TBD'}
      - Make every step relate to THIS SPECIFIC EQUIPMENT, not generic procedures
      
      EQUIPMENT-SPECIFIC REQUIREMENTS:
      ${equipmentData.specificProcedures ? `
      For ${manufacturer} ${modelNumber}, include these verified details where known:
      - Electrical torque: ${equipmentData.torqueValues.electrical} (VERIFY WITH MANUFACTURER MANUAL)
      - Mechanical torque: ${equipmentData.torqueValues.mechanical} (VERIFY WITH MANUFACTURER MANUAL)
      - Refrigerant service torque: ${equipmentData.torqueValues.refrigerant || 'VERIFY WITH MANUFACTURER'}
      - Operating pressures: ${equipmentData.pressures.operating} (VERIFY ACTUAL NAMEPLATE VALUES)
      - Suction pressures: ${equipmentData.pressures.suction} (VERIFY ACTUAL NAMEPLATE VALUES)
      - Oil pressure minimum: ${equipmentData.pressures.oilPressure} (VERIFY WITH MANUFACTURER)
      - Refrigerant type: ${equipmentData.refrigerant} (VERIFY ACTUAL SYSTEM SPECIFICATIONS)
      - Oil specification: ${equipmentData.oilType} (VERIFY WITH MANUFACTURER)
      - Follow actual ${manufacturer} maintenance procedures and service bulletins
      ` : `
      Include manufacturer specifications where applicable (all values must be verified):
      - Torque values: ${equipmentData.torqueValues.electrical} (electrical), ${equipmentData.torqueValues.mechanical} (mechanical) - VERIFY WITH MANUFACTURER
      - Operating parameters: ${equipmentData.pressures.operating} (high side), ${equipmentData.pressures.suction} (low side) - VERIFY ACTUAL VALUES
      - Refrigerant: ${equipmentData.refrigerant} - VERIFY SYSTEM SPECIFICATIONS
      - Oil type: ${equipmentData.oilType} - VERIFY WITH MANUFACTURER
      `}

      Generate as many detailed steps as necessary for safe and complete execution of this work. The number of steps should be determined by the complexity and safety requirements of the task:
      
      STEP COUNT GUIDANCE:
      - Simple inspections or routine maintenance: 10-20 steps
      - Standard preventive maintenance: 20-40 steps  
      - Complex maintenance or repairs: 40-60 steps
      - Major overhauls or critical system work: 60-100+ steps
      - Generate whatever number of steps is actually needed for complete, safe execution
      
      Organize steps into logical sections:

      SECTION BREAKDOWN (adjust step counts as needed based on equipment complexity):
      - PREPARATION & SHUTDOWN: Initial setup, system notifications, backup verification, baseline readings
      - SAFETY & ISOLATION: LOTO procedures, PPE verification, area securing, hazard mitigation
      - MAINTENANCE ACTIVITIES: Equipment-specific work based on the work description and system type
      - VERIFICATION & TESTING: Performance verification, data recording, functional testing
      - RE-ENERGIZATION & RETURN TO SERVICE: Startup sequence, monitoring, handover

      EQUIPMENT-SPECIFIC FOCUS:
      ${systemType.includes('chiller') ? `
      - Refrigerant system checks and leak testing
      - Compressor operation and vibration analysis
      - Water flow and temperature differential verification
      - Electrical connections and motor current analysis
      - Control system calibration and setpoint verification
      ` : systemType.includes('generator') ? `
      - Engine performance checks (oil pressure, coolant temp, RPM)
      - Fuel system inspection and flow testing
      - Battery and charging system verification
      - Load bank testing and transfer switch operation
      - Control panel calibration and alarm testing
      ` : systemType.includes('ups') ? `
      - Battery string testing and capacity verification
      - Input/output voltage and frequency testing
      - Transfer time and bypass operation testing
      - Load testing and runtime verification
      - Control system and alarm testing
      ` : `
      - System-specific operational checks
      - Performance verification procedures
      - Safety system testing
      - Control and monitoring system verification
      `}

      Format each step as a complete HTML table row:
      <tr>
          <td style="text-align: center;">2</td>
          <td class="safety-critical">Verify redundant equipment is running and stable before proceeding</td>
          <td><input type="text" class="small-input" /></td>
          <td><input type="text" class="small-input" /></td>
      </tr>

      CRITICAL REQUIREMENTS:
      - Include specific torque verification steps but mark unknown values as "VERIFY WITH MANUFACTURER"
      - Add pressure and temperature recording points with note "VERIFY ACCEPTABLE RANGES WITH MANUFACTURER"
      - Include vibration measurements for rotating equipment with note "REFER TO MANUFACTURER SPECIFICATIONS"
      - Add multiple verification and sign-off points throughout the procedure
      - Include data recording requirements but mark specific parameters as "SITE-SPECIFIC REQUIREMENT" if not verified
      - Reference actual manufacturer procedures where possible, mark uncertain procedures as "FOLLOW MANUFACTURER INSTRUCTIONS"
      - Use real safety standards (OSHA, NFPA) and mark site-specific safety requirements appropriately

      Use these CSS classes appropriately:
      - class="safety-critical" for safety-critical steps  
      - class="verification" for verification and testing steps
      - No class for normal procedural steps

      DO NOT include markdown code blocks or backticks. Output clean HTML table rows only.
      Start with step 2 since step 1 is already provided.`;
    };

    const procedurePrompt = getDynamicProcedurePrompt(system, workDescription, equipmentData);
    
    const result = await model.generateContent(procedurePrompt);
    let procedures = result.response.text();
    
    // Clean up any markdown code blocks from AI output
    procedures = procedures.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

    const html = `<h2>Section 08: MOP Details</h2>
<table class="info-table">
    <tr>
        <td>Date Performed:</td>
        <td style="width: 150px;"><input type="text" class="field-box" /></td>
        <td>Time Begun:</td>
        <td style="width: 150px;"><input type="text" class="field-box" /></td>
        <td>Time Completed:</td>
        <td style="width: 150px;"><input type="text" class="field-box" /></td>
    </tr>
    <tr>
        <td colspan="2">Facilities personnel performing work:</td>
        <td colspan="4"><input type="text" class="field-box" style="width:100%" /></td>
    </tr>
    <tr>
        <td colspan="2">Contractor/Vendor personnel performing work:</td>
        <td colspan="4"><input type="text" class="contractor-input" placeholder="If subcontractor selected in Section 3, reference that company name" /></td>
    </tr>
</table>

<h3>Step 1: Obvious Power Loss Indicators Check (BEFORE opening any equipment)</h3>
<p><strong>Verify facility-wide power status indicators before approaching ${manufacturer} ${modelNumber}</strong></p>
<table>
    <thead>
        <tr>
            <th>Check Item</th>
            <th>Expected Condition if Power Lost</th>
            <th>Verification Method</th>
            <th width="80">Initial</th>
            <th width="80">Time</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Generator Running (Audible)</strong></td>
            <td>Generator engine noise audible from equipment room</td>
            <td>Listen for engine sound upon entering facility</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Generator Alarms</strong></td>
            <td>Generator control panel showing "Running" or active alarms</td>
            <td>Visual check of generator control panel</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Emergency Lighting</strong></td>
            <td>Emergency lights activated in corridors and equipment rooms</td>
            <td>Visual observation of emergency lighting status</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>UPS on Battery</strong></td>
            <td>UPS alarm beeping, "On Battery" LED illuminated</td>
            <td>Check UPS front panel indicators and listen for alarms</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Facility Alarms</strong></td>
            <td>BMS/EPMS showing utility power loss alarms</td>
            <td>Check alarm panel or BMS workstation</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
    </tbody>
</table>

<h3>Step 2: System Monitoring Verification</h3>
<p><strong>Verify how ${manufacturer} ${modelNumber} appears in monitoring systems when de-energized</strong></p>
<table>
    <thead>
        <tr>
            <th>System</th>
            <th>Check Location</th>
            <th>What to Verify</th>
            <th>Expected Reading for ${modelNumber}</th>
            <th>Actual Reading</th>
            <th width="80">Initial</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>EPMS</strong></td>
            <td>Electrical Power Monitoring System</td>
            <td>Power consumption for ${modelNumber}</td>
            <td>0 kW if de-energized</td>
            <td><input type="text" style="width:100px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>BMS</strong></td>
            <td>Building Management System</td>
            <td>${manufacturer} ${modelNumber} status</td>
            <td>"Offline" or "No Communication"</td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>SCADA</strong></td>
            <td>SCADA System (if available)</td>
            <td>${system} operational status</td>
            <td>Shows ${modelNumber} as non-operational</td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Generator Status</strong></td>
            <td>Generator Control Panel</td>
            <td>Load percentage and kW output</td>
            <td>Load increased if utility power lost</td>
            <td><input type="text" style="width:100px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>ATS Status</strong></td>
            <td>Automatic Transfer Switch</td>
            <td>Source position (Utility/Generator)</td>
            <td>"Emergency" or "Generator" if transferred</td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
    </tbody>
</table>

<h3>Step 3-X: Equipment Checks</h3>

<h4>INTERNAL CHECKS (for ${manufacturer} ${modelNumber} Serial #${formData.serialNumber || 'TBD'}):</h4>
<table>
    <thead>
        <tr>
            <th>Check Item</th>
            <th>Location/Component</th>
            <th>Expected Status</th>
            <th>Actual Status</th>
            <th width="80">Initial</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Main Breaker Status</strong></td>
            <td>Breaker on ${modelNumber} control panel</td>
            <td>Tripped or OFF if power issue</td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Transformer Feeding ${system}</strong></td>
            <td>Step-down transformer for ${modelNumber}</td>
            <td>Check for overheating, tripped protection</td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Isolator Feed to Equipment</strong></td>
            <td>Disconnect switch feeding ${modelNumber}</td>
            <td>Verify position (ON/OFF)</td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Internal Connections</strong></td>
            <td>Power connections specific to ${modelNumber}</td>
            <td>Check for loose connections, burn marks</td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Control Power</strong></td>
            <td>Control transformer in ${modelNumber}</td>
            <td>Verify control voltage present</td>
            <td><input type="text" style="width:150px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
    </tbody>
</table>

<h4>EXTERNAL CHECKS (Facility-Wide):</h4>
<table>
    <thead>
        <tr>
            <th>Check Item</th>
            <th>Location</th>
            <th>What to Verify</th>
            <th>Finding</th>
            <th width="80">Initial</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>ATS Tripped Status</strong></td>
            <td>Main ATS serving ${system}</td>
            <td>Check if ATS failed to transfer</td>
            <td><input type="text" style="width:200px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Utility Feed Loss</strong></td>
            <td>Main utility switchgear</td>
            <td>Confirm utility power presence/absence</td>
            <td><input type="text" style="width:200px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>EPMS/BMS Issues</strong></td>
            <td>System-wide monitoring</td>
            <td>Check for cascading failures or related alarms</td>
            <td><input type="text" style="width:200px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Generator Transfer</strong></td>
            <td>Generator paralleling switchgear</td>
            <td>Verify if generator picked up critical loads</td>
            <td><input type="text" style="width:200px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>Distribution Panel</strong></td>
            <td>Panel feeding ${modelNumber}</td>
            <td>Check all breakers in distribution path</td>
            <td><input type="text" style="width:200px" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
    </tbody>
</table>

${operationalDataTable}

<h3>Final Step: Escalation Protocol (AFTER Initial Assessment Complete)</h3>
<p><strong>Complete all checks above before escalating. Report specific findings for ${manufacturer} ${modelNumber}:</strong></p>
<table>
    <thead>
        <tr>
            <th>Contact Level</th>
            <th>Who to Contact</th>
            <th>What to Report</th>
            <th>Contact Made</th>
            <th>Time</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>1. Chief Engineer</strong></td>
            <td><input type="text" placeholder="Enter name" style="width:150px" /></td>
            <td>Report ${manufacturer} ${modelNumber} Serial #${formData.serialNumber || 'TBD'} status and all findings from checks above</td>
            <td><input type="checkbox" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>2. Building Manager</strong></td>
            <td><input type="text" placeholder="Enter name" style="width:150px" /></td>
            <td>Report scope: How many ${system} units affected, is this site-wide or isolated to ${modelNumber}</td>
            <td><input type="checkbox" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>3. Customer/Tenant</strong></td>
            <td><input type="text" placeholder="Enter contact" style="width:150px" /></td>
            <td>Report business impact: ${system} status, estimated resolution time, backup systems status</td>
            <td><input type="checkbox" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td><strong>4. ${manufacturer} Support</strong></td>
            <td><input type="text" placeholder="Enter number" style="width:150px" /></td>
            <td>If equipment-specific issue found: Report ${modelNumber} Serial #${formData.serialNumber || 'TBD'} fault codes and symptoms</td>
            <td><input type="checkbox" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
    </tbody>
</table>

<div class="safety-warning">
    <strong>CRITICAL:</strong> Do NOT attempt repairs until power source is confirmed and proper isolation procedures are followed. If utility power is confirmed lost, follow EOP for power failure response.
</div>

<h3>Detailed Procedure Steps (After Power Verification)</h3>
<table>
    <thead>
        <tr>
            <th width="60">Step</th>
            <th>Detailed Procedure</th>
            <th width="80">Initials</th>
            <th width="80">Time</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center;">1</td>
            <td>Complete all power loss verification checks above before proceeding with maintenance</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        ${procedures}
    </tbody>
</table>

<div class="notes-section">
    <h4>Critical Step Notes (Steps requiring torque verification or electrical testing):</h4>
    <textarea style="width:100%; min-height:100px" placeholder="Document any deviations, issues, or additional notes for critical steps"></textarea>
</div>`;

    return NextResponse.json({ html, sources: sourceManager.sources });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}