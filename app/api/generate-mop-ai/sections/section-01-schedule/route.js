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
    
    const { manufacturer, system, category, frequency } = formData;
    console.log('Destructured fields:', { manufacturer, system, category, frequency });
    
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    console.log('Generated current date:', currentDate);

    // Generate title based on equipment
    console.log('Processing system type:', system);
    const equipmentType = system && system.includes('Chiller') ? 'CHILLER' : 
                         system && system.includes('Generator') ? 'GENERATOR' :
                         system && system.includes('UPS') ? 'UPS' : 
                         system ? system.toUpperCase() : 'EQUIPMENT';
    console.log('Determined equipment type:', equipmentType);
    
    const title = `${(manufacturer || 'UNKNOWN').toUpperCase()} ${equipmentType} - ${(category || 'MAINTENANCE').toUpperCase()}`;
    console.log('Generated title:', title);

    const html = `<h2>Section 01: MOP Schedule Information</h2>
<table class="info-table">
    <tr>
        <td>MOP Title:</td>
        <td>${title}</td>
    </tr>
    <tr>
        <td>MOP Information:</td>
        <td>This is ${category && category.toLowerCase().includes('annual') ? 'an' : 'a'} ${(category || 'maintenance').toLowerCase()} on the ${manufacturer || 'equipment'} ${system || 'system'}.</td>
    </tr>
    <tr>
        <td>MOP Creation Date:</td>
        <td>${currentDate}</td>
    </tr>
    <tr>
        <td>MOP Revision Date:</td>
        <td><input type="text" value="${currentDate}" style="width:150px" /></td>
    </tr>
    <tr>
        <td>Document Number:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Assign per facility process" /></td>
    </tr>
    <tr>
        <td>Revision Number:</td>
        <td><input type="text" value="V1" style="width:100px" /></td>
    </tr>
    <tr>
        <td>Author CET Level:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Assign per facility process" /></td>
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