import { NextResponse } from 'next/server';
import { getSiteData } from '@/lib/mop-knowledge/site-data';

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const { system, workDescription, location, address } = formData;
    const siteData = getSiteData(location || 'stewart');
    
    // Determine risk level based on system and work description
    let riskLevel = 2;
    let riskJustification = "Single system affected with redundancy available";
    
    if (workDescription && workDescription.toLowerCase().includes('electrical') && system.toLowerCase().includes('switchgear')) {
      riskLevel = 4;
      riskJustification = "Main switchgear work affects entire facility";
    } else if (system.toLowerCase().includes('chiller') && workDescription && workDescription.toLowerCase().includes('major')) {
      riskLevel = 3;
      riskJustification = "Critical cooling system with limited redundancy";
    } else if (system.toLowerCase().includes('generator')) {
      riskLevel = 3;
      riskJustification = "Critical power system maintenance";
    } else if (system.toLowerCase().includes('ups')) {
      riskLevel = 3;
      riskJustification = "Critical power protection system";
    }

    const cetRequired = {
      1: "CET 1 (Technician) to execute, CET 2 (Lead Technician) to approve",
      2: "CET 2 (Technician) to execute, CET 3 (Lead Technician) to approve",
      3: "CET 3 (Lead Technician) to execute, CET 4 (Manager) to approve",
      4: "CET 4 (Manager) to execute, CET 5 (Director) to approve"
    };

    const html = `<h2>Section 02: Site Information</h2>
<table class="info-table">
    <tr>
        <td>Data Center Location:</td>
        <td>${location || siteData.name}<br>${address?.street || siteData.address.street}<br>${address?.city || siteData.address.city}, ${address?.state || siteData.address.state} ${address?.zipCode || siteData.address.zipCode}</td>
    </tr>
    <tr>
        <td>Service Ticket/Project Number:</td>
        <td><input type="text" class="update-needed-input" placeholder="UPDATE NEEDED - Assign per facility process" style="width:300px" /></td>
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
        <td>Site Contact:</td>
        <td><input type="text" placeholder="Site Manager Name" style="width:250px" /> <input type="text" placeholder="Phone" style="width:150px" /></td>
    </tr>
    <tr>
        <td>Building/Floor/Room:</td>
        <td><input type="text" placeholder="Building" style="width:120px" /> / <input type="text" placeholder="Floor" style="width:80px" /> / <input type="text" placeholder="Room" style="width:120px" /></td>
    </tr>
    <tr>
        <td>Access Requirements:</td>
        <td><input type="text" placeholder="Badge access, escort required, etc." style="width:400px" /></td>
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