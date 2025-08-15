/**
 * EOP Version Management Utility
 * Handles version tracking and incrementation for Emergency Operating Procedures
 */

/**
 * Sanitize a string for use in filenames
 * Ensures consistent formatting across all filename generation
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeForFilename(str) {
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
 * Get a unique key for an EOP based on equipment and emergency type
 * @param {string} manufacturer - Equipment manufacturer
 * @param {string} model - Equipment model number
 * @param {string} serial - Equipment serial number (optional)
 * @param {string} emergencyType - Type of emergency
 * @returns {string} Unique key for the EOP
 */
export function getEOPKey(manufacturer, model, serial, emergencyType) {
  // Use consistent sanitization for all inputs
  const normalizedManufacturer = sanitizeForFilename(manufacturer);
  const normalizedModel = sanitizeForFilename(model);
  const normalizedSerial = sanitizeForFilename(serial);
  const normalizedEmergency = sanitizeForFilename(emergencyType);
  
  // Build key from non-empty parts
  const parts = [
    normalizedManufacturer,
    normalizedModel,
    normalizedSerial,
    normalizedEmergency
  ].filter(Boolean); // Remove empty strings
  
  return parts.join('_');
}

/**
 * Parse version number from filename
 * @param {string} filename - EOP filename
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
 * Get the next version number for an EOP
 * @param {Array} existingFiles - Array of existing EOP filenames
 * @param {string} manufacturer - Equipment manufacturer
 * @param {string} model - Equipment model number
 * @param {string} serial - Equipment serial number (optional)
 * @param {string} emergencyType - Type of emergency
 * @returns {number} Next version number
 */
export function getNextVersion(existingFiles, manufacturer, model, serial, emergencyType) {
  // Use consistent sanitization for all inputs
  const normalizedManufacturer = sanitizeForFilename(manufacturer);
  const normalizedModel = sanitizeForFilename(model);
  const normalizedSerial = sanitizeForFilename(serial);
  const normalizedEmergency = sanitizeForFilename(emergencyType);
  
  let maxVersion = 0;
  
  console.log('Looking for existing versions with:', {
    manufacturer: normalizedManufacturer,
    model: normalizedModel,
    serial: normalizedSerial,
    emergencyType: normalizedEmergency
  });
  
  // Check all existing files for matching equipment and emergency type
  existingFiles.forEach(filename => {
    // Normalize the filename for comparison - use sanitization to ensure consistency
    const normalizedFilename = sanitizeForFilename(filename);
    
    // Check if this file matches our equipment and emergency type
    const hasManufacturer = normalizedFilename.includes(normalizedManufacturer);
    const hasModel = normalizedFilename.includes(normalizedModel);
    const hasEmergency = normalizedFilename.includes(normalizedEmergency);
    const hasSerial = !normalizedSerial || normalizedFilename.includes(normalizedSerial);
    
    // Debug logging
    if (filename.toUpperCase().includes('EOP')) {
      console.log(`Checking file: ${filename}`);
      console.log(`  - Has manufacturer (${normalizedManufacturer}): ${hasManufacturer}`);
      console.log(`  - Has model (${normalizedModel}): ${hasModel}`);
      console.log(`  - Has emergency (${normalizedEmergency}): ${hasEmergency}`);
      console.log(`  - Has serial (${normalizedSerial}): ${hasSerial}`);
    }
    
    // If all components match, this is a version of the same EOP
    if (hasManufacturer && hasModel && hasEmergency && hasSerial) {
      const version = parseVersionFromFilename(filename);
      console.log(`  - MATCH! Version found: ${version}`);
      maxVersion = Math.max(maxVersion, version);
    }
  });
  
  console.log(`Maximum version found: ${maxVersion}, returning version: ${maxVersion + 1}`);
  return maxVersion + 1;
}

/**
 * Generate versioned filename for EOP
 * @param {string} manufacturer - Equipment manufacturer
 * @param {string} model - Equipment model number
 * @param {string} serial - Equipment serial number (optional)
 * @param {string} emergencyType - Type of emergency
 * @param {number} version - Version number
 * @returns {string} Versioned filename
 */
export function generateVersionedFilename(manufacturer, model, serial, emergencyType, version) {
  const key = getEOPKey(manufacturer, model, serial, emergencyType);
  return `EOP_${key}_V${version}.html`;
}

/**
 * Extract EOP metadata from filename
 * @param {string} filename - EOP filename
 * @returns {Object} Metadata object with manufacturer, model, serial, emergencyType, and version
 */
export function extractEOPMetadata(filename) {
  // Remove EOP_ prefix and file extension
  const cleanName = filename.replace(/^EOP_/i, '').replace(/\.(html|pdf|txt)$/i, '');
  
  // Extract version
  const versionMatch = cleanName.match(/_V(\d+)$/i);
  const version = versionMatch ? parseInt(versionMatch[1], 10) : 1;
  
  // Remove version suffix to get the key
  const keyPart = versionMatch ? cleanName.replace(/_V\d+$/i, '') : cleanName;
  
  // Split by underscore to extract components
  const parts = keyPart.split('_');
  
  // Try to intelligently parse the parts
  // Format could be: MANUFACTURER_MODEL_SERIAL_EMERGENCY or MANUFACTURER_MODEL_EMERGENCY
  let metadata = {
    manufacturer: '',
    model: '',
    serial: '',
    emergencyType: '',
    version: version
  };
  
  if (parts.length >= 3) {
    metadata.manufacturer = parts[0];
    metadata.model = parts[1];
    
    // Check if this looks like a serial number (typically alphanumeric mix)
    if (parts.length > 3 && /[A-Z]+\d+|\d+[A-Z]+/i.test(parts[2])) {
      metadata.serial = parts[2];
      metadata.emergencyType = parts.slice(3).join('_');
    } else {
      // No serial, emergency type starts at index 2
      metadata.emergencyType = parts.slice(2).join('_');
    }
  }
  
  return metadata;
}

/**
 * Group EOPs by equipment and emergency type
 * @param {Array} files - Array of EOP filenames
 * @returns {Object} Grouped EOPs with version info
 */
export function groupEOPsByEquipment(files) {
  const grouped = {};
  
  files.forEach(filename => {
    const metadata = extractEOPMetadata(filename);
    const key = getEOPKey(
      metadata.manufacturer,
      metadata.model,
      metadata.serial,
      metadata.emergencyType
    );
    
    if (!grouped[key]) {
      grouped[key] = {
        key: key,
        manufacturer: metadata.manufacturer,
        model: metadata.model,
        serial: metadata.serial,
        emergencyType: metadata.emergencyType,
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
 * @param {string} filename - EOP filename
 * @returns {boolean} True if filename has version suffix
 */
export function hasVersionSuffix(filename) {
  return /_V\d+/i.test(filename);
}

/**
 * Add version suffix to filename if not present
 * @param {string} filename - EOP filename
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