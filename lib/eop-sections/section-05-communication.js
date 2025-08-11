export function getSection05Communication() {
  return `<h2>Section 05: Communication & Escalation Protocol</h2>
- Table with contact levels 0-3 plus emergency services
- Phone number fields: <input type="text" placeholder="Enter phone" style="width:150px" />
- Contact name fields where appropriate: <input type="text" placeholder="Enter contact name" style="width:200px" />

<h3>Emergency Contacts</h3>
Include a comprehensive Emergency Contacts table with columns: Service Type, Contact Name/Organization, Phone Number, Notes/Address

Include these essential emergency contacts (use editable input fields for phone numbers):
- Police Emergency: 911
- Fire/EMS Emergency: 911  
- Electric Utility Emergency: <input type="text" placeholder="Enter utility emergency #" style="width:150px" />
- Equipment Manufacturer Support: <input type="text" placeholder="Enter manufacturer support #" style="width:150px" />
- Electrical Contractor: <input type="text" placeholder="Enter contractor #" style="width:150px" />
- Facilities Manager: <input type="text" placeholder="Enter facilities manager #" style="width:150px" />

Add this important note at the bottom of the Emergency Contacts section:
"⚠️ IMPORTANT: Verify all emergency contact numbers for your specific facility location. Update phone numbers as needed."`;
}