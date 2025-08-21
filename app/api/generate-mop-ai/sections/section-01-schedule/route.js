import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('=== Section 01 Schedule Route ===');
    const requestBody = await request.json();
    console.log('Raw request body:', JSON.stringify(requestBody, null, 2));
    
    const { formData } = requestBody;
    console.log('Extracted formData:', JSON.stringify(formData, null, 2));
    
    if (!formData) {
      console.error('No formData found in request');
      throw new Error('Missing formData in request body');
    }
    
    const { manufacturer, modelNumber, serialNumber, location, system, componentType, equipmentNumber, workDescription, description } = formData;
    console.log('Destructured fields:', { manufacturer, modelNumber, serialNumber, location, system, componentType, equipmentNumber });
    
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    console.log('Generated current date:', currentDate);

    // Determine risk level based on system and work description
    let riskLevel = 2;
    let riskJustification = "Single system affected with redundancy available";
    
    const workDesc = workDescription || description || '';
    const systemLower = (system || '').toLowerCase();
    
    if (workDesc.toLowerCase().includes('electrical') && systemLower.includes('switchgear')) {
      riskLevel = 4;
      riskJustification = "Main switchgear work affects entire facility";
    } else if (systemLower.includes('chiller') && workDesc.toLowerCase().includes('major')) {
      riskLevel = 3;
      riskJustification = "Critical cooling system with limited redundancy";
    } else if (systemLower.includes('generator')) {
      riskLevel = 3;
      riskJustification = "Critical power system maintenance";
    } else if (systemLower.includes('ups')) {
      riskLevel = 3;
      riskJustification = "Critical power protection system";
    }

    const cetRequired = {
      1: "CET 1 (Technician) to execute, CET 2 (Lead Technician) to approve",
      2: "CET 2 (Technician) to execute, CET 3 (Lead Technician) to approve",
      3: "CET 3 (Lead Technician) to execute, CET 4 (Manager) to approve",
      4: "CET 4 (Manager) to execute, CET 5 (Director) to approve"
    };

    const html = `<h2>Section 01: MOP Schedule Information</h2>
<table class="info-table">
    <tr>
        <td>MOP Title:</td>
        <td>${componentType || system || 'System'} ${workDescription || description || 'Maintenance'}</td>
    </tr>
    <tr>
        <td>MOP Identifier:</td>
        <td><input type="text" placeholder="To be assigned" style="width:250px" /></td>
    </tr>
    <tr>
        <td>Component Type:</td>
        <td>${componentType || 'UPDATE NEEDED'}</td>
    </tr>
    <tr>
        <td>Manufacturer:</td>
        <td>${manufacturer || 'UPDATE NEEDED'}</td>
    </tr>
    <tr>
        <td>Model Number:</td>
        <td>${modelNumber || 'UPDATE NEEDED'}</td>
    </tr>
    <tr>
        <td>Serial Number:</td>
        <td>${serialNumber || 'UPDATE NEEDED'}</td>
    </tr>
    <tr>
        <td>Equipment Number:</td>
        <td>${equipmentNumber || 'UPDATE NEEDED'}</td>
    </tr>
    <tr>
        <td>Location:</td>
        <td>${location || 'UPDATE NEEDED'}</td>
    </tr>
    <tr>
        <td>Work Description:</td>
        <td>${workDescription || description || 'UPDATE NEEDED'}</td>
    </tr>
    <tr>
        <td>Version:</td>
        <td><input type="text" value="V1" style="width:100px" /></td>
    </tr>
    <tr>
        <td>Creation Date:</td>
        <td>${new Date().toLocaleDateString()}</td>
    </tr>
    <tr>
        <td>Affected Systems:</td>
        <td>PLACEHOLDER: AI will research systems affected by ${manufacturer} ${modelNumber} maintenance</td>
    </tr>
    <tr>
        <td>Duration:</td>
        <td>PLACEHOLDER: AI will research approximate duration for ${manufacturer} ${modelNumber} ${workDescription || description || 'maintenance'}</td>
    </tr>
    <tr>
        <td>Level of Risk:</td>
        <td><strong>Level ${riskLevel}</strong> (${['Low', 'Medium', 'High', 'Critical'][riskLevel-1]})<br><em>${riskJustification}</em></td>
    </tr>
    <tr>
        <td>CET Level Required:</td>
        <td><strong>${cetRequired[riskLevel]}</strong><br><em>Based on risk level assessment</em></td>
    </tr>
    <tr>
        <td>Author:</td>
        <td><input type="text" placeholder="Enter Author Name" style="width:250px" /></td>
    </tr>
    <tr>
        <td>Author CET Level:</td>
        <td><input type="text" placeholder="Enter Author CET level" style="width:250px" /></td>
    </tr>
    <tr>
        <td>Approver:</td>
        <td><input type="text" placeholder="Enter Approver Name" style="width:250px" /></td>
    </tr>
</table>`;

    console.log('Generated HTML length:', html.length);
    console.log('Section 01 completed successfully');
    
    return NextResponse.json({ html, sources: [] });
  } catch (error) {
    console.error('=== Section 01 Schedule Route ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Failed to generate schedule section',
      details: error.message,
      userMessage: 'Unable to generate schedule information. Please try again.'
    }, { status: 500 });
  }
}