import { NextResponse } from 'next/server';
import { getSiteData } from '@/lib/mop-knowledge/site-data';

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const { location } = formData;
    const siteData = getSiteData(location);
    const escalation = siteData.escalationProcedure;

    const html = `<h2>Section 09: Back-out Procedures</h2>
<p><strong>CRITICAL BACK-OUT PROCEDURES</strong></p>
<p>If at any point during the maintenance procedure a critical issue is discovered that could affect data center operations, follow these detailed back-out procedures:</p>
<table>
    <thead>
        <tr>
            <th width="60">Step</th>
            <th>Back-out Procedures</th>
            <th width="80">Initials</th>
            <th width="80">Time</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center;">1</td>
            <td><strong>Immediate Actions:</strong> Stop all work immediately and secure the area</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">2</td>
            <td>Notify the ${escalation.level1} and ${escalation.level2} immediately</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">3</td>
            <td>Assess the situation and determine if equipment can be safely returned to service</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">4</td>
            <td>If issue cannot be resolved at technician level, escalate to ${escalation.level3}</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">5</td>
            <td>If ${escalation.level3} cannot resolve, escalate to ${escalation.level4}</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">6</td>
            <td>Contact equipment manufacturer service representative if required: ${escalation.level5}</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">7</td>
            <td>Document all findings and actions taken in the incident report</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">8</td>
            <td>If safe to return to service, follow re-energization procedures</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">9</td>
            <td>Monitor equipment for minimum 30 minutes after return to service</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
        <tr>
            <td style="text-align: center;">10</td>
            <td>Complete incident report and schedule follow-up maintenance if required</td>
            <td><input type="text" class="small-input" /></td>
            <td><input type="text" class="small-input" /></td>
        </tr>
    </tbody>
</table>`;

    return NextResponse.json({ html, sources: [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}