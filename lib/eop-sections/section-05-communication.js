export function getSection05Communication(emergencyType = 'Power Failure') {
  return `<h2>Section 05: Communication & Escalation Protocol</h2>
<!-- MANDATORY GENERATION INSTRUCTIONS:
- MANDATORY: Equipment Manufacturer Support must show the actual manufacturer name from the form input (Carrier, Trane, Caterpillar, Liebert, etc.)
- MANDATORY: Add emergency-specific contacts based on the emergency type selected
- MANDATORY: For Refrigerant Leak: Add Environmental Response Team, Refrigerant Recovery Service, and EPA Hotline contacts
- MANDATORY: For Fire/Smoke: Add Fire Marshal, Suppression System Vendor, and Evacuation Coordinator contacts
- MANDATORY: For Water emergencies: Add Plumbing Contractor, Water Restoration Service, and Water Utility contacts
- MANDATORY: For Control System failures: Add IT Support, Control System Vendor (specific to manufacturer), and Network Operations Center contacts
- MANDATORY: For Mechanical failures: Add Mechanical Contractor, Vibration Specialist, and Equipment Rental (for temporary cooling/power) contacts
- MANDATORY: For High Temperature emergencies: Add HVAC Contractor, Temporary Cooling Vendor, and Load Shedding Coordinator contacts
- MANDATORY: Escalation table notes must reference the specific emergency type (not generic "issue")
- MANDATORY: Include manufacturer-specific technical support numbers when known (Carrier Commercial Service, Trane Service, Caterpillar Support, etc.)
- FORBIDDEN: Generic "equipment manufacturer" - must specify actual manufacturer from input
- FORBIDDEN: Missing critical emergency-specific contacts (like EPA for refrigerant leaks)
-->
- Table with contact levels 0-3 plus emergency services
- Phone number fields: <input type="text" placeholder="Enter phone" style="width:150px" />
- Contact name fields where appropriate: <input type="text" placeholder="Enter contact name" style="width:200px" />

<h3>Emergency Contacts</h3>
Include a comprehensive Emergency Contacts table with columns: Service Type, Contact Name/Organization, Phone Number, Notes/Address

Include these essential emergency contacts (use editable input fields for phone numbers):
- Police Emergency: 911
- Fire/EMS Emergency: 911  
- Electric Utility Emergency: <input type="text" placeholder="Enter utility emergency #" style="width:150px" />
- \${manufacturer} Technical Support: <input type="text" placeholder="Enter \${manufacturer} support #" style="width:150px" />
- Electrical Contractor: <input type="text" placeholder="Enter contractor #" style="width:150px" />
- Facilities Manager: <input type="text" placeholder="Enter facilities manager #" style="width:150px" />

Add emergency-specific contacts based on the emergency type (include additional rows as needed)

Add this important note at the bottom of the Emergency Contacts section:
"⚠️ IMPORTANT: Verify all emergency contact numbers for your specific facility location. Update phone numbers as needed."`;
}