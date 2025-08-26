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
      
      // Component type is after equipment ID, before manufacturer
      // Find how many parts make up the component type by checking from position 2
      // until we hit what looks like manufacturer (typically shorter, all caps)
      let componentTypeParts = [];
      let manufacturerStartIndex = 2;
      
      // Simple heuristic: component type usually has multiple words, 
      // manufacturer is typically one word or abbreviated
      for (let i = 2; i < dateIndex; i++) {
        // If we haven't found manufacturer yet and this could be part of component type
        if (componentTypeParts.length < 4 && i < dateIndex - 2) {
          componentTypeParts.push(parts[i]);
        } else {
          manufacturerStartIndex = i;
          break;
        }
      }
      
      // If we didn't find a clear break, assume first 2-3 parts after equipment are component
      if (componentTypeParts.length === 0 && dateIndex > 3) {
        componentTypeParts = parts.slice(2, Math.min(4, dateIndex - 1));
        manufacturerStartIndex = Math.min(4, dateIndex - 1);
      }
      
      // Everything between manufacturer and date is work description
      const workDescParts = parts.slice(manufacturerStartIndex + 1, dateIndex);
      
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