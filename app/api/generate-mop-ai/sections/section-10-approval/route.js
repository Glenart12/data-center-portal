import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { formData } = await request.json();
    
    const html = `<h2>Section 10: MOP Approval</h2>
<table>
    <thead>
        <tr>
            <th>Review Stage</th>
            <th>Reviewer's Name</th>
            <th>Reviewer's Title</th>
            <th>Date</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Tested for clarity:</strong></td>
            <td><input type="text" style="width:100%" placeholder="Print Name" /></td>
            <td><input type="text" style="width:100%" placeholder="Title" /></td>
            <td><input type="text" style="width:100px" placeholder="MM/DD/YYYY" /></td>
        </tr>
        <tr>
            <td><strong>Technical review:</strong></td>
            <td><input type="text" style="width:100%" placeholder="Print Name" /></td>
            <td><input type="text" style="width:100%" placeholder="Title" /></td>
            <td><input type="text" style="width:100px" placeholder="MM/DD/YYYY" /></td>
        </tr>
        <tr>
            <td><strong>Chief Engineer approval:</strong></td>
            <td><input type="text" style="width:100%" placeholder="Print Name" /></td>
            <td><input type="text" style="width:100%" placeholder="Title" /></td>
            <td><input type="text" style="width:100px" placeholder="MM/DD/YYYY" /></td>
        </tr>
        <tr>
            <td><strong>Customer approval:</strong></td>
            <td><input type="text" style="width:100%" placeholder="Print Name" /></td>
            <td><input type="text" style="width:100%" placeholder="Title" /></td>
            <td><input type="text" style="width:100px" placeholder="MM/DD/YYYY" /></td>
        </tr>
    </tbody>
</table>

<div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border: 1px solid #ccc;">
    <h4 style="margin-top: 0;">Approval Requirements:</h4>
    <ul style="margin-bottom: 0;">
        <li>All stages must be completed in sequence</li>
        <li>Technical review must verify all equipment specifications and procedures</li>
        <li>Chief Engineer must approve risk assessment and mitigation strategies</li>
        <li>Customer approval required before work commencement</li>
    </ul>
</div>

<div style="margin-top: 20px;">
    <table style="width: 100%; margin-top: 20px;">
        <tr>
            <td style="width: 50%; padding: 10px;">
                <strong>MOP Effective Date:</strong><br>
                <input type="text" style="width:150px" placeholder="MM/DD/YYYY" />
            </td>
            <td style="width: 50%; padding: 10px;">
                <strong>MOP Expiration Date:</strong><br>
                <input type="text" style="width:150px" placeholder="MM/DD/YYYY" />
            </td>
        </tr>
    </table>
</div>`;

    return NextResponse.json({ html, sources: [] });
  } catch (error) {
    console.error('Section 10 generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate approval section',
      details: error.message,
      userMessage: 'Unable to generate approval section. Please try again.'
    }, { status: 500 });
  }
}