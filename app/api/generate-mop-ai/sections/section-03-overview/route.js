import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const { manufacturer, modelNumber, system, componentType, workDescription, description, workType } = formData;
    
    // Build contractor fields HTML conditionally based on workType
    const contractorFields = workType === 'subcontractor' ? `
    <tr>
        <td># of Contractors #1:</td>
        <td>${formData.contractors1 ? formData.contractors1 : '<input type="text" placeholder="Number" style="width:100px" />'}</td>
    </tr>
    <tr>
        <td>If Subcontractor - Company Name:</td>
        <td>${formData.contractorCompany1 ? formData.contractorCompany1 : '<input type="text" class="field-box" />'}</td>
    </tr>
    <tr>
        <td>If Subcontractor - Personnel Name:</td>
        <td>${formData.contractorPersonnel1 ? formData.contractorPersonnel1 : '<input type="text" class="field-box" />'}</td>
    </tr>
    <tr>
        <td>If Subcontractor - Contact Details:</td>
        <td>${formData.contractorContact1 ? formData.contractorContact1 : '<input type="text" class="field-box" />'}</td>
    </tr>
    <tr>
        <td># of Contractors #2:</td>
        <td>${formData.contractors2 ? formData.contractors2 : '<input type="text" placeholder="Number" style="width:100px" />'}</td>
    </tr>
    <tr>
        <td>If Subcontractor - Company Name:</td>
        <td>${formData.contractorCompany2 ? formData.contractorCompany2 : '<input type="text" class="field-box" />'}</td>
    </tr>
    <tr>
        <td>If Subcontractor - Personnel Name:</td>
        <td>${formData.contractorPersonnel2 ? formData.contractorPersonnel2 : '<input type="text" class="field-box" />'}</td>
    </tr>
    <tr>
        <td>If Subcontractor - Contact Details:</td>
        <td>${formData.contractorContact2 ? formData.contractorContact2 : '<input type="text" class="field-box" />'}</td>
    </tr>` : '';

    const html = `<h2>Section 03: MOP Overview</h2>
<table class="info-table">
    <tr>
        <td>MOP Title:</td>
        <td>${componentType || system || 'System'} ${workDescription || description || 'Maintenance'}</td>
    </tr>
    <tr>
        <td>Work Area:</td>
        <td><input type="text" placeholder="Enter work area" style="width:300px" /></td>
    </tr>
    <tr>
        <td>Building/Floor/Room:</td>
        <td><input type="text" placeholder="Building/Floor/Room" style="width:300px" /></td>
    </tr>
    <tr>
        <td>Access Requirements:</td>
        <td><input type="text" placeholder="Badge access, escort required, etc." style="width:400px" /></td>
    </tr>
    <tr>
        <td>Delivery Method:</td>
        <td>${workType === 'subcontractor' ? 'Subcontractor' : 'Self-Delivered'}</td>
    </tr>
    <tr>
        <td># of Facilities Personnel:</td>
        <td>PLACEHOLDER: AI will research number needed for ${manufacturer} ${modelNumber}</td>
    </tr>${contractorFields}
    <tr>
        <td>Qualifications Required:</td>
        <td>PLACEHOLDER: AI will research certifications needed for ${manufacturer} ${modelNumber}</td>
    </tr>
    <tr>
        <td>Advance notifications required:</td>
        <td>PLACEHOLDER: AI will research advance notices for ${manufacturer} ${modelNumber} in data center</td>
    </tr>
    <tr>
        <td>Post notifications required:</td>
        <td>PLACEHOLDER: AI will research post notices for ${manufacturer} ${modelNumber} in data center</td>
    </tr>
</table>`;

    return NextResponse.json({ html, sources: [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}