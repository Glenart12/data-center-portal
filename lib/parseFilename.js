// Utility function to parse document filenames
export function parseFilename(filename) {
  // Remove file extension if present
  const nameWithoutExt = filename.replace(/\.(pdf|html)$/i, '');
  
  // Try to parse new format: TYPE_EQUIP_ID_MANUFACTURER_WORK_DESC_DATE_VERSION
  const parts = nameWithoutExt.split('_');
  
  if (parts.length >= 6) {
    // New format
    const equipmentId = parts[1];
    const workDescParts = parts.slice(3, -2); // Everything between manufacturer and date
    const datePart = parts[parts.length - 2];
    const versionPart = parts[parts.length - 1];
    
    // Determine component type from equipment ID prefix
    let componentType = 'Equipment';
    const prefix = equipmentId.match(/^[A-Z]+/)?.[0];
    if (prefix) {
      const typeMap = {
        'GEN': 'Generator',
        'CH': 'Water Cooled Chiller',
        'UPS': 'UPS System',
        'CRAC': 'CRAC Unit',
        'AHU': 'Air Handler Unit',
        'SWG': 'Switchgear',
        'PDU': 'Power Distribution Unit'
      };
      componentType = typeMap[prefix] || 'Equipment';
    }
    
    // Format work description
    const workDescription = workDescParts
      .join(' ')
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
    
    // Format date from YYYY-MM-DD to MM/DD/YYYY
    let formattedDate = new Date().toLocaleDateString('en-US');
    if (datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      const [year, month, day] = datePart.split('-');
      formattedDate = `${month}/${day}/${year}`;
    }
    
    return {
      equipmentId,
      componentType,
      workDescription,
      date: formattedDate,
      version: versionPart || 'V1'
    };
  }
  
  // Legacy format or unparseable - graceful fallback
  return {
    equipmentId: '',
    componentType: 'Equipment',
    workDescription: nameWithoutExt
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase()),
    date: new Date().toLocaleDateString('en-US'),
    version: 'V1'
  };
}