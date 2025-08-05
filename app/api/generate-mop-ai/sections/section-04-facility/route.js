import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { formData } = await request.json();
    const { system } = formData;
    
    // Generate the facility impact table with all 19 systems
    const html = `<h2>Section 04: Effect of MOP on Critical Facility</h2>
<table>
    <thead>
        <tr>
            <th>Facility Equipment or System</th>
            <th width="60">Yes</th>
            <th width="60">No</th>
            <th width="60">N/A</th>
            <th>Details</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Electrical Utility Equipment</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Emergency Generator System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Critical Cooling System</td>
            <td class="checkbox">${system.includes('Chiller') ? '✓' : ''}</td>
            <td class="checkbox">${system.includes('Chiller') ? '' : '✓'}</td>
            <td class="checkbox"></td>
            <td>${system.includes('Chiller') ? 'Unit will be offline for maintenance' : ''}</td>
        </tr>
        <tr>
            <td>Ventilation System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Mechanical System</td>
            <td class="checkbox">${system.includes('Chiller') || system.includes('CRAC') ? '✓' : ''}</td>
            <td class="checkbox">${system.includes('Chiller') || system.includes('CRAC') ? '' : '✓'}</td>
            <td class="checkbox"></td>
            <td>${system.includes('Chiller') || system.includes('CRAC') ? 'Primary mechanical component' : ''}</td>
        </tr>
        <tr>
            <td>Uninterruptible Power Supply (UPS)</td>
            <td class="checkbox">${system.includes('UPS') ? '✓' : ''}</td>
            <td class="checkbox">${system.includes('UPS') ? '' : '✓'}</td>
            <td class="checkbox"></td>
            <td>${system.includes('UPS') ? 'UPS maintenance affects critical power' : ''}</td>
        </tr>
        <tr>
            <td>Critical Power Distribution System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Emergency Power Off (EPO)</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Fire Detection Systems</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Fire Suppression System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Monitoring System</td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td class="checkbox"></td>
            <td>Monitoring System is ALWAYS affected for data center equipment maintenance</td>
        </tr>
        <tr>
            <td>Control System</td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td class="checkbox"></td>
            <td>BAS/BMS control required for maintenance</td>
        </tr>
        <tr>
            <td>Security System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>General Power and Lighting System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Lockout/Tagout Required?</td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td class="checkbox"></td>
            <td>LOTO required on main disconnect</td>
        </tr>
        <tr>
            <td>Work to be performed "hot"?</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td>All work performed de-energized</td>
        </tr>
        <tr>
            <td>Radio interference potential?</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Water/Leak Detection System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
        <tr>
            <td>Building Automation System</td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td class="checkbox"></td>
            <td>BAS control interface required</td>
        </tr>
        <tr>
            <td>Transfer Switch System</td>
            <td class="checkbox"></td>
            <td class="checkbox">✓</td>
            <td class="checkbox"></td>
            <td></td>
        </tr>
    </tbody>
</table>`;

    return NextResponse.json({ html, sources: [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}