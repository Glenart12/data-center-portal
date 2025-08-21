import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const { manufacturer, modelNumber, system, componentType, workDescription, description } = formData;
    
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
        <td>Personnel Required:</td>
        <td>PLACEHOLDER: AI will research specific roles needed for ${manufacturer} ${modelNumber} maintenance</td>
    </tr>
    <tr>
        <td>Work Performed By:</td>
        <td>
            <input type="checkbox" id="self-delivered" checked> Self-Delivered
            &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="checkbox" id="subcontractor"> Subcontractor
        </td>
    </tr>
    <tr>
        <td># of Facilities Personnel:</td>
        <td>PLACEHOLDER: AI will research number needed for ${manufacturer} ${modelNumber}</td>
    </tr>
    <tr>
        <td># of Contractors #1:</td>
        <td><input type="text" placeholder="Number" style="width:100px" /></td>
    </tr>
    <tr>
        <td>If Subcontractor - Company Name:</td>
        <td><input type="text" class="field-box" /></td>
    </tr>
    <tr>
        <td>If Subcontractor - Personnel Name:</td>
        <td><input type="text" class="field-box" /></td>
    </tr>
    <tr>
        <td>If Subcontractor - Contact Details:</td>
        <td><input type="text" class="field-box" /></td>
    </tr>
    <tr>
        <td># of Contractors #2:</td>
        <td><input type="text" placeholder="Number" style="width:100px" /></td>
    </tr>
    <tr>
        <td>If Subcontractor - Company Name:</td>
        <td><input type="text" class="field-box" /></td>
    </tr>
    <tr>
        <td>If Subcontractor - Personnel Name:</td>
        <td><input type="text" class="field-box" /></td>
    </tr>
    <tr>
        <td>If Subcontractor - Contact Details:</td>
        <td><input type="text" class="field-box" /></td>
    </tr>
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