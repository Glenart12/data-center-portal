// Utility function to parse document filenames
export function parseFilename(filename) {
  // Remove file extension if present
  const nameWithoutExt = filename.replace(/\.(pdf|html)$/i, '');
  
  // Try to parse new format: TYPE_EQUIP_ID_COMPONENT_TYPE_MANUFACTURER_WORK_DESC_DATE_VERSION
  const parts = nameWithoutExt.split('_');
  
  if (parts.length >= 7) {
    // New format with component type included
    const type = parts[0]; // MOP, SOP, or EOP
    const equipmentId = parts[1];
    
    // Find where date starts (format: YYYY-MM-DD)
    let dateIndex = -1;
    for (let i = parts.length - 2; i >= 2; i--) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(parts[i])) {
        dateIndex = i;
        break;
      }
    }
    
    if (dateIndex > 0) {
      const versionPart = parts[parts.length - 1];
      const datePart = parts[dateIndex];
      
      // Known manufacturer names (single words typically)
      const knownManufacturers = ['CARRIER', 'TRANE', 'YORK', 'LIEBERT', 'ASCO', 'CATERPILLAR', 'CAT', 
                                   'EATON', 'SCHNEIDER', 'GE', 'GENERAC', 'CUMMINS', 'KOHLER', 
                                   'JOHNSON', 'CONTROLS', 'SIEMENS', 'ABB', 'VERTIV'];
      
      // Find the manufacturer position
      let manufacturerIndex = -1;
      let manufacturer = '';
      
      // Search for known manufacturer in the parts
      for (let i = 2; i < dateIndex; i++) {
        if (knownManufacturers.includes(parts[i].toUpperCase())) {
          manufacturerIndex = i;
          manufacturer = parts[i];
          break;
        }
      }
      
      // If no known manufacturer found, assume it's the part right before work description keywords
      if (manufacturerIndex === -1) {
        // Look for work description keywords
        const workKeywords = ['ANNUAL', 'QUARTERLY', 'MONTHLY', 'WEEKLY', 'SEMI', 'PREVENTATIVE', 'MAINTENANCE', 'PM'];
        for (let i = 3; i < dateIndex; i++) {
          if (workKeywords.includes(parts[i].toUpperCase())) {
            // Manufacturer is the part right before the work description
            manufacturerIndex = i - 1;
            manufacturer = parts[manufacturerIndex];
            break;
          }
        }
      }
      
      // If still no manufacturer found, use a default position
      if (manufacturerIndex === -1) {
        // Assume component type is 2-3 parts after equipment ID, manufacturer is next
        manufacturerIndex = Math.min(4, dateIndex - 3);
        manufacturer = parts[manufacturerIndex];
      }
      
      // Component type is everything between equipment ID and manufacturer
      const componentTypeParts = parts.slice(2, manufacturerIndex);
      
      // Work description is everything between manufacturer and date
      const workDescParts = parts.slice(manufacturerIndex + 1, dateIndex);
      
      // Format component type - just convert underscores to spaces and proper case
      const componentType = componentTypeParts
        .join(' ')
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
      
      // Format work description - just convert underscores to spaces and proper case
      const workDescription = workDescParts
        .join(' ')
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
      
      // Format date from YYYY-MM-DD to MM/DD/YYYY
      let formattedDate = new Date().toLocaleDateString('en-US');
      if (datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        const [year, month, day] = datePart.split('-');
        formattedDate = `${month}/${day}/${year}`;
      }
      
      return {
        equipmentId,
        componentType: componentType || 'Equipment',
        workDescription: workDescription || 'Maintenance',
        date: formattedDate,
        version: versionPart || 'V1'
      };
    }
  }
  
  // Try old format without component type: TYPE_EQUIP_ID_MANUFACTURER_WORK_DESC_DATE_VERSION
  if (parts.length >= 6) {
    const equipmentId = parts[1];
    const workDescParts = parts.slice(3, -2); // Everything between manufacturer and date
    const datePart = parts[parts.length - 2];
    const versionPart = parts[parts.length - 1];
    
    // Determine component type from equipment ID prefix for backward compatibility
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