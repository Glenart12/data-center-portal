import { NextResponse } from 'next/server';
import { getSiteData } from '@/lib/mop-knowledge/site-data';

export async function POST(request) {
  try {
    const { formData } = await request.json();

    const html = `<h2>Section 02: Site Information</h2>
<table class="info-table">
    <tr>
        <td>Customer:</td>
        <td>${formData.customer || 'UPDATE NEEDED'}</td>
    </tr>
    <tr>
        <td>Site Name:</td>
        <td>${formData.siteName || 'UPDATE NEEDED'}</td>
    </tr>
    <tr>
        <td>Data Center Location:</td>
        <td>${formData.location || 'UPDATE NEEDED'}</td>
    </tr>
    <tr>
        <td>Site Contact:</td>
        <td><input type="text" placeholder="Name, Phone, Job Title/Role" style="width:400px" /></td>
    </tr>
</table>`;

    const sources = [{
      type: "site_specific",
      document: "Site Configuration Database",
      section: "Facility Information",
      lastVerified: new Date().toISOString().split('T')[0]
    }];

    return NextResponse.json({ html, sources });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}