/**
 * SOP Version Management Utility
 * Handles version tracking and incrementation for Standard Operating Procedures
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
 * Get a unique key for a SOP based on equipment and work description
 * @param {string} manufacturer - Equipment manufacturer
 * @param {string} model - Equipment model number
 * @param {string} serial - Equipment serial number (optional)
 * @param {string} workDescription - Description of work to be performed
 * @returns {string} Unique key for the SOP
 */
export function getSOPKey(manufacturer, model, serial, workDescription) {
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
 * @param {string} filename - SOP filename
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
 * Get the next version number for a SOP
 * @param {Array} existingFiles - Array of existing SOP filenames or blob objects
 * @param {string} manufacturer - Equipment manufacturer
 * @param {string} model - Equipment model number
 * @param {string} serial - Equipment serial number (optional)
 * @param {string} workDescription - Description of work to be performed
 * @returns {number} Next version number
 */
export function getNextVersion(existingFiles, manufacturer, model, serial, workDescription) {
  // Use consistent sanitization for all inputs
  const normalizedManufacturer = sanitizeForFilename(manufacturer);
  const normalizedModel = sanitizeForFilename(model);
  const normalizedSerial = sanitizeForFilename(serial);
  const normalizedWork = sanitizeForFilename(workDescription);
  
  let maxVersion = 0;
  
  console.log('Looking for existing SOP versions with:', {
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
    if (filename.toUpperCase().includes('SOP')) {
      console.log(`Checking file: ${filename}`);
      console.log(`  - Has manufacturer (${normalizedManufacturer}): ${hasManufacturer}`);
      console.log(`  - Has model (${normalizedModel}): ${hasModel}`);
      console.log(`  - Has work (${normalizedWork}): ${hasWork}`);
      console.log(`  - Has serial (${normalizedSerial}): ${hasSerial}`);
    }
    
    // If all components match, this is a version of the same SOP
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
 * Generate versioned filename for SOP
 * @param {string} manufacturer - Equipment manufacturer
 * @param {string} model - Equipment model number
 * @param {string} serial - Equipment serial number (optional)
 * @param {string} workDescription - Description of work to be performed
 * @param {number} version - Version number
 * @returns {string} Versioned filename
 */
export function generateVersionedFilename(manufacturer, model, serial, workDescription, version) {
  const key = getSOPKey(manufacturer, model, serial, workDescription);
  return `SOP_${key}_V${version}.html`;
}

/**
 * Extract SOP metadata from filename
 * @param {string} filename - SOP filename
 * @returns {Object} Metadata object with manufacturer, model, serial, workDescription, and version
 */
export function extractSOPMetadata(filename) {
  // Remove SOP_ prefix and file extension
  const cleanName = filename.replace(/^SOP_/i, '').replace(/\.(html|pdf|txt)$/i, '');
  
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
 * Group SOPs by equipment and work description
 * @param {Array} files - Array of SOP filenames
 * @returns {Object} Grouped SOPs with version info
 */
export function groupSOPsByEquipment(files) {
  const grouped = {};
  
  files.forEach(filename => {
    const metadata = extractSOPMetadata(filename);
    const key = getSOPKey(
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
 * @param {string} filename - SOP filename
 * @returns {boolean} True if filename has version suffix
 */
export function hasVersionSuffix(filename) {
  return /_V\d+/i.test(filename);
}

/**
 * Add version suffix to filename if not present
 * @param {string} filename - SOP filename
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