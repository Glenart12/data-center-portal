import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const { manufacturer, modelNumber, system, workDescription, location, description } = formData;
    
    // Use workDescription or description field, with fallback
    const mopDescription = workDescription || description || `${system} maintenance and inspection`;
    
    const html = `<h2>Section 03: MOP Overview</h2>
<table class="info-table">
    <tr>
        <td>MOP Description:</td>
        <td>${mopDescription}</td>
    </tr>
    <tr>
        <td>Work Area:</td>
        <td>${system.includes('Chiller') ? 'Mechanical Room / Rooftop' : 'Equipment Room'}</td>
    </tr>
    <tr>
        <td>Manufacturer:</td>
        <td>${manufacturer}</td>
    </tr>
    <tr>
        <td>Equipment ID:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Record on-site" /></td>
    </tr>
    <tr>
        <td>Model #:</td>
        <td>${modelNumber}</td>
    </tr>
    <tr>
        <td>Serial #:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Record from nameplate" /></td>
    </tr>
    <tr>
        <td>Min. # of Facilities Personnel:</td>
        <td>2</td>
    </tr>
    <tr>
        <td>Work Performed By:</td>
        <td colspan="3">
            <input type="checkbox" id="self-delivered" name="work-type" checked> 
            <label for="self-delivered">Self-Delivered</label>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="checkbox" id="subcontractor" name="work-type"> 
            <label for="subcontractor">Subcontractor</label>
        </td>
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
        <td>EPA 608 Universal Certification, Qualified Electrical Worker</td>
    </tr>
    <tr>
        <td>Tools Required:</td>
        <td>Standard mechanics tool set, refrigerant gauges, multimeter, torque wrench set</td>
    </tr>
    <tr>
        <td>Advance notifications required:</td>
        <td>Data Center Operations Manager, Site Security, NOC/BMS Operator</td>
    </tr>
    <tr>
        <td>Post notifications required:</td>
        <td>Data Center Operations Manager, Site Security, NOC/BMS Operator</td>
    </tr>
</table>`;

    return NextResponse.json({ html, sources: [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}