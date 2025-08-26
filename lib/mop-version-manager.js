/**
 * MOP Version Management Utility
 * Handles version tracking and incrementation for Method of Procedures
 */

/**
 * Sanitize a string for use in filenames
 * Ensures consistent formatting across all filename generation
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeForFilename(str) {
  if (!str) return '';
  return str
    .toString()
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')  // Replace spaces with single underscore
    .replace(/[^A-Z0-9_]/g, '') // Remove special characters except underscore
    .replace(/_+/g, '_')  // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
}

/**
 * Abbreviate common terms for task naming
 * @param {string} task - Task description
 * @returns {string} Abbreviated task string (max 30 chars)
 */
export function abbreviateTask(task) {
  if (!task) return '';
  
  let abbreviated = task
    .toUpperCase()
    .replace(/PREVENTIVE\s*MAINTENANCE/gi, 'PM')
    .replace(/ANNUAL/gi, 'ANN')
    .replace(/QUARTERLY/gi, 'QTR')
    .replace(/EMERGENCY/gi, 'EMRG')
    .replace(/REFRIGERANT/gi, 'REF')
    .replace(/SHUTDOWN/gi, 'SHTDWN')
    .replace(/GENERATOR/gi, 'GEN')
    .replace(/CHILLER/gi, 'CHLR')
    .replace(/COOLING/gi, 'CLG')
    .replace(/STANDARD\s*OPERATING\s*PROCEDURE/gi, 'STD_OP')
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  
  // Truncate to 30 characters if needed
  if (abbreviated.length > 30) {
    abbreviated = abbreviated.substring(0, 30).replace(/_$/, '');
  }
  
  return abbreviated;
}

/**
 * Get a unique key for a MOP based on equipment and work description
 * @param {string} manufacturer - Equipment manufacturer
 * @param {string} model - Equipment model number
 * @param {string} serial - Equipment serial number (optional)
 * @param {string} workDescription - Description of work to be performed
 * @returns {string} Unique key for the MOP
 */
export function getMOPKey(manufacturer, model, serial, workDescription) {
  // Use consistent sanitization for all inputs
  const normalizedManufacturer = sanitizeForFilename(manufacturer);
  const normalizedModel = sanitizeForFilename(model);
  const normalizedSerial = sanitizeForFilename(serial);
  const normalizedWork = sanitizeForFilename(workDescription);
  
  // Build key from non-empty parts
  const parts = [
    normalizedManufacturer,
    normalizedModel,
    normalizedSerial,
    normalizedWork
  ].filter(Boolean); // Remove empty strings
  
  return parts.join('_');
}

/**
 * Parse version number from filename
 * @param {string} filename - MOP filename
 * @returns {number} Version number (0 if not found)
 */
export function parseVersionFromFilename(filename) {
  // Match patterns like _V1, _V2, _V10, etc.
  const versionMatch = filename.match(/_V(\d+)/i);
  if (versionMatch && versionMatch[1]) {
    return parseInt(versionMatch[1], 10);
  }
  return 0; // No version found
}

/**
 * Get the next version number for a MOP based on equipment number, manufacturer, component type, work description, and date
 * @param {Array} existingFiles - Array of existing MOP filenames or blob objects
 * @param {string} equipmentNumber - Equipment number/identifier
 * @param {string} componentType - Component type
 * @param {string} manufacturer - Equipment manufacturer
 * @param {string} workDescription - Work description
 * @param {string} currentDate - Date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {number} Next version number
 */
export function getNextVersion(existingFiles, equipmentNumber, componentType, manufacturer, workDescription, currentDate = null) {
  // Use today's date if not provided
  const dateToCheck = currentDate || new Date().toISOString().split('T')[0];
  const normalizedEquipmentNumber = sanitizeForFilename(equipmentNumber);
  const normalizedComponentType = sanitizeForFilename(componentType);
  const normalizedManufacturer = sanitizeForFilename(manufacturer);
  const normalizedWorkDescription = sanitizeForFilename(workDescription);
  
  let maxVersion = 0;
  
  console.log('Looking for existing MOP versions with:', {
    equipmentNumber: normalizedEquipmentNumber,
    componentType: normalizedComponentType,
    manufacturer: normalizedManufacturer,
    workDescription: normalizedWorkDescription,
    date: dateToCheck
  });
  
  // Check all existing files for matching all criteria
  existingFiles.forEach(file => {
    // Handle both string filenames and blob objects
    const filename = typeof file === 'string' ? file : (file.pathname || file.url || '');
    
    // Check if filename contains all the required components
    const hasEquipmentNumber = filename.toUpperCase().includes(normalizedEquipmentNumber.toUpperCase());
    const hasComponentType = filename.toUpperCase().includes(normalizedComponentType.toUpperCase());
    const hasManufacturer = filename.toUpperCase().includes(normalizedManufacturer.toUpperCase());
    const hasWorkDescription = filename.toUpperCase().includes(normalizedWorkDescription.toUpperCase());
    const hasDate = filename.includes(dateToCheck);
    
    // Debug logging for MOP files
    if (filename.toUpperCase().includes('MOP') && hasEquipmentNumber && hasDate) {
      console.log(`Checking file: ${filename}`);
      console.log(`  - Has equipment number (${normalizedEquipmentNumber}): ${hasEquipmentNumber}`);
      console.log(`  - Has component type (${normalizedComponentType}): ${hasComponentType}`);
      console.log(`  - Has manufacturer (${normalizedManufacturer}): ${hasManufacturer}`);
      console.log(`  - Has work description (${normalizedWorkDescription}): ${hasWorkDescription}`);
      console.log(`  - Has date (${dateToCheck}): ${hasDate}`);
    }
    
    // If ALL components match (equipment, component type, manufacturer, work description, and date), extract version
    if (hasEquipmentNumber && hasComponentType && hasManufacturer && hasWorkDescription && hasDate) {
      const version = parseVersionFromFilename(filename);
      console.log(`  - EXACT MATCH! Version found: ${version}`);
      maxVersion = Math.max(maxVersion, version);
    }
  });
  
  console.log(`Maximum version found: ${maxVersion}, returning version: ${maxVersion + 1}`);
  return maxVersion + 1;
}

/**
 * Legacy version - kept for backward compatibility
 * Get the next version number for a MOP
 * @param {Array} existingFiles - Array of existing MOP filenames or blob objects
 * @param {string} manufacturer - Equipment manufacturer
 * @param {string} model - Equipment model number
 * @param {string} serial - Equipment serial number (optional)
 * @param {string} workDescription - Description of work to be performed
 * @returns {number} Next version number
 */
export function getNextVersionLegacy(existingFiles, manufacturer, model, serial, workDescription) {
  // Use consistent sanitization for all inputs
  const normalizedManufacturer = sanitizeForFilename(manufacturer);
  const normalizedModel = sanitizeForFilename(model);
  const normalizedSerial = sanitizeForFilename(serial);
  const normalizedWork = sanitizeForFilename(workDescription);
  
  let maxVersion = 0;
  
  console.log('Looking for existing MOP versions with:', {
    manufacturer: normalizedManufacturer,
    model: normalizedModel,
    serial: normalizedSerial,
    workDescription: normalizedWork
  });
  
  // Check all existing files for matching equipment and work description
  existingFiles.forEach(file => {
    // Handle both string filenames and blob objects
    const filename = typeof file === 'string' ? file : (file.pathname || file.url || '');
    
    // Normalize the filename for comparison - use sanitization to ensure consistency
    const normalizedFilename = sanitizeForFilename(filename);
    
    // Check if this file matches our equipment and work description
    const hasManufacturer = normalizedFilename.includes(normalizedManufacturer);
    const hasModel = normalizedFilename.includes(normalizedModel);
    const hasWork = normalizedFilename.includes(normalizedWork);
    const hasSerial = !normalizedSerial || normalizedFilename.includes(normalizedSerial);
    
    // Debug logging
    if (filename.toUpperCase().includes('MOP')) {
      console.log(`Checking file: ${filename}`);
      console.log(`  - Has manufacturer (${normalizedManufacturer}): ${hasManufacturer}`);
      console.log(`  - Has model (${normalizedModel}): ${hasModel}`);
      console.log(`  - Has work (${normalizedWork}): ${hasWork}`);
      console.log(`  - Has serial (${normalizedSerial}): ${hasSerial}`);
    }
    
    // If all components match, this is a version of the same MOP
    if (hasManufacturer && hasModel && hasWork && hasSerial) {
      const version = parseVersionFromFilename(filename);
      console.log(`  - MATCH! Version found: ${version}`);
      maxVersion = Math.max(maxVersion, version);
    }
  });
  
  console.log(`Maximum version found: ${maxVersion}, returning version: ${maxVersion + 1}`);
  return maxVersion + 1;
}

/**
 * Generate versioned filename for MOP
 * @param {string} manufacturer - Equipment manufacturer
 * @param {string} model - Equipment model number
 * @param {string} serial - Equipment serial number (optional)
 * @param {string} workDescription - Description of work to be performed
 * @param {number} version - Version number
 * @returns {string} Versioned filename
 */
export function generateVersionedFilename(manufacturer, model, serial, workDescription, version) {
  const key = getMOPKey(manufacturer, model, serial, workDescription);
  return `MOP_${key}_V${version}.html`;
}

/**
 * Extract MOP metadata from filename
 * @param {string} filename - MOP filename
 * @returns {Object} Metadata object with manufacturer, model, serial, workDescription, and version
 */
export function extractMOPMetadata(filename) {
  // Remove MOP_ prefix and file extension
  const cleanName = filename.replace(/^MOP_/i, '').replace(/\.(html|pdf|txt)$/i, '');
  
  // Extract version
  const versionMatch = cleanName.match(/_V(\d+)$/i);
  const version = versionMatch ? parseInt(versionMatch[1], 10) : 1;
  
  // Remove version suffix to get the key
  const keyPart = versionMatch ? cleanName.replace(/_V\d+$/i, '') : cleanName;
  
  // Split by underscore to extract components
  const parts = keyPart.split('_');
  
  // Try to intelligently parse the parts
  // Format could be: MANUFACTURER_MODEL_SERIAL_WORK or MANUFACTURER_MODEL_WORK
  let metadata = {
    manufacturer: '',
    model: '',
    serial: '',
    workDescription: '',
    version: version
  };
  
  if (parts.length >= 3) {
    metadata.manufacturer = parts[0];
    metadata.model = parts[1];
    
    // Check if this looks like a serial number (typically alphanumeric mix)
    if (parts.length > 3 && /[A-Z]+\d+|\d+[A-Z]+/i.test(parts[2])) {
      metadata.serial = parts[2];
      metadata.workDescription = parts.slice(3).join('_');
    } else {
      // No serial, work description starts at index 2
      metadata.workDescription = parts.slice(2).join('_');
    }
  }
  
  return metadata;
}

/**
 * Group MOPs by equipment and work description
 * @param {Array} files - Array of MOP filenames
 * @returns {Object} Grouped MOPs with version info
 */
export function groupMOPsByEquipment(files) {
  const grouped = {};
  
  files.forEach(filename => {
    const metadata = extractMOPMetadata(filename);
    const key = getMOPKey(
      metadata.manufacturer,
      metadata.model,
      metadata.serial,
      metadata.workDescription
    );
    
    if (!grouped[key]) {
      grouped[key] = {
        key: key,
        manufacturer: metadata.manufacturer,
        model: metadata.model,
        serial: metadata.serial,
        workDescription: metadata.workDescription,
        versions: []
      };
    }
    
    grouped[key].versions.push({
      filename: filename,
      version: metadata.version,
      displayVersion: `V${metadata.version}`
    });
  });
  
  // Sort versions within each group
  Object.values(grouped).forEach(group => {
    group.versions.sort((a, b) => b.version - a.version); // Newest first
    group.latestVersion = group.versions[0];
    group.totalVersions = group.versions.length;
  });
  
  return grouped;
}

/**
 * Check if a filename already has version suffix
 * @param {string} filename - MOP filename
 * @returns {boolean} True if filename has version suffix
 */
export function hasVersionSuffix(filename) {
  return /_V\d+/i.test(filename);
}

/**
 * Add version suffix to filename if not present
 * @param {string} filename - MOP filename
 * @param {number} version - Version number
 * @returns {string} Filename with version suffix
 */
export function ensureVersionSuffix(filename, version) {
  if (hasVersionSuffix(filename)) {
    // Replace existing version with new one
    return filename.replace(/_V\d+/i, `_V${version}`);
  }
  
  // Add version before file extension
  const extensionMatch = filename.match(/\.(html|pdf|txt)$/i);
  if (extensionMatch) {
    const extension = extensionMatch[0];
    const nameWithoutExt = filename.replace(extension, '');
    return `${nameWithoutExt}_V${version}${extension}`;
  }
  
  // No extension found, just append version
  return `${filename}_V${version}`;
}