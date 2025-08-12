/**
 * Search Enhancement Adapter for EOP Generation
 * Enhances prompts with verified manufacturer specifications
 * STANDALONE - Does not import or modify any existing files
 */

/**
 * Format search results into a readable specification block
 */
function formatSearchResults(searchResults) {
  if (!searchResults) {
    return null;
  }

  const specs = [];
  
  // Add primary specifications
  if (searchResults.tonnage) {
    specs.push(`- Exact Tonnage: ${searchResults.tonnage}`);
  }
  
  if (searchResults.voltage) {
    specs.push(`- Voltage: ${searchResults.voltage}`);
  }
  
  if (searchResults.refrigerantType) {
    specs.push(`- Refrigerant Type: ${searchResults.refrigerantType}`);
  }
  
  if (searchResults.flowRate) {
    specs.push(`- Flow Rate: ${searchResults.flowRate}`);
  }
  
  if (searchResults.pressureDrop) {
    specs.push(`- Pressure Drop: ${searchResults.pressureDrop}`);
  }

  // Add additional specifications if available
  if (searchResults.additionalSpecs && Object.keys(searchResults.additionalSpecs).length > 0) {
    const additional = searchResults.additionalSpecs;
    
    if (additional.powerRating) {
      specs.push(`- Power Rating: ${additional.powerRating}`);
    }
    
    if (additional.weight) {
      specs.push(`- Weight: ${additional.weight}`);
    }
    
    if (additional.dimensions) {
      specs.push(`- Dimensions: ${additional.dimensions}`);
    }
    
    if (additional.efficiency) {
      specs.push(`- Efficiency: ${additional.efficiency}`);
    }
    
    if (additional.noiseLevel) {
      specs.push(`- Noise Level: ${additional.noiseLevel}`);
    }
  }

  // Only return if we have actual specifications
  return specs.length > 0 ? specs : null;
}

/**
 * Build the enhanced prompt section with search results
 */
function buildEnhancementSection(specs, modelNumber, manufacturer) {
  const header = '\n\nVERIFIED SPECIFICATIONS FROM MANUFACTURER DATA:';
  const subheader = `Equipment: ${manufacturer || 'Unknown Manufacturer'} ${modelNumber || 'Unknown Model'}`;
  
  const specLines = specs.join('\n');
  
  const footer = '\nNote: Use these verified specifications for accurate procedure generation.';
  
  return `${header}\n${subheader}\n${specLines}${footer}`;
}

/**
 * Main function to enhance prompts with search results
 */
async function enhancePromptWithSearchResults(originalPrompt, modelNumber, manufacturer) {
  try {
    // Check if search is enabled
    const searchEnabled = process.env.SEARCH_ENABLED === 'true';
    
    if (!searchEnabled) {
      console.log('[SearchEnhancementAdapter] Search is disabled. Returning original prompt.');
      return originalPrompt;
    }

    // Validate inputs
    if (!modelNumber && !manufacturer) {
      console.log('[SearchEnhancementAdapter] No model or manufacturer provided. Returning original prompt.');
      return originalPrompt;
    }

    // Ensure original prompt exists
    if (!originalPrompt) {
      console.log('[SearchEnhancementAdapter] No original prompt provided.');
      return '';
    }

    console.log(`[SearchEnhancementAdapter] Attempting to enhance prompt for ${manufacturer} ${modelNumber}`);

    // Dynamically import the search service to avoid dependencies
    let searchService;
    try {
      const searchModule = await import('../search/equipment-search-service.js');
      searchService = searchModule.getEquipmentSearchService();
    } catch (importError) {
      console.error('[SearchEnhancementAdapter] Failed to import search service:', importError.message);
      return originalPrompt;
    }

    // Check if search service is enabled
    if (!searchService.isEnabled()) {
      console.log('[SearchEnhancementAdapter] Search service is not enabled. Returning original prompt.');
      return originalPrompt;
    }

    // Perform the search
    const searchResults = await searchService.searchForSpecifications(modelNumber, manufacturer);

    // Format the search results
    const formattedSpecs = formatSearchResults(searchResults);

    // If no specifications found, return original prompt
    if (!formattedSpecs || formattedSpecs.length === 0) {
      console.log('[SearchEnhancementAdapter] No specifications found. Returning original prompt.');
      return originalPrompt;
    }

    // Build the enhancement section
    const enhancementSection = buildEnhancementSection(formattedSpecs, modelNumber, manufacturer);

    // Combine original prompt with enhancement
    const enhancedPrompt = `${originalPrompt}${enhancementSection}`;

    console.log('[SearchEnhancementAdapter] Successfully enhanced prompt with search results.');
    console.log(`[SearchEnhancementAdapter] Added ${formattedSpecs.length} specifications.`);

    return enhancedPrompt;

  } catch (error) {
    // Log error but don't expose it
    console.error('[SearchEnhancementAdapter] Error during enhancement:', error.message);
    
    // Always return original prompt on error
    return originalPrompt;
  }
}

/**
 * Synchronous version that returns a promise
 * Useful for environments that don't support async/await
 */
function enhancePromptWithSearchResultsSync(originalPrompt, modelNumber, manufacturer) {
  return enhancePromptWithSearchResults(originalPrompt, modelNumber, manufacturer)
    .then(result => result)
    .catch(() => originalPrompt);
}

/**
 * Batch enhancement for multiple prompts
 */
async function enhanceMultiplePrompts(prompts, modelNumber, manufacturer) {
  try {
    const enhanced = [];
    
    for (const prompt of prompts) {
      const enhancedPrompt = await enhancePromptWithSearchResults(prompt, modelNumber, manufacturer);
      enhanced.push(enhancedPrompt);
    }
    
    return enhanced;
  } catch (error) {
    console.error('[SearchEnhancementAdapter] Batch enhancement error:', error.message);
    return prompts; // Return original prompts on error
  }
}

/**
 * Test function to verify adapter is working
 */
async function testAdapter() {
  const testPrompt = 'Generate emergency procedures for equipment failure.';
  const testModel = '30XA080';
  const testManufacturer = 'Carrier';
  
  console.log('[SearchEnhancementAdapter] Running test...');
  console.log('[SearchEnhancementAdapter] Original prompt:', testPrompt);
  
  const enhanced = await enhancePromptWithSearchResults(testPrompt, testModel, testManufacturer);
  
  console.log('[SearchEnhancementAdapter] Enhanced prompt:', enhanced);
  console.log('[SearchEnhancementAdapter] Test complete.');
  
  return enhanced;
}

/**
 * Get adapter status
 */
function getAdapterStatus() {
  return {
    searchEnabled: process.env.SEARCH_ENABLED === 'true',
    adapterVersion: '1.0.0',
    features: [
      'Prompt enhancement',
      'Search integration',
      'Error resilience',
      'Batch processing'
    ]
  };
}

// Export functions
module.exports = {
  enhancePromptWithSearchResults,
  enhancePromptWithSearchResultsSync,
  enhanceMultiplePrompts,
  testAdapter,
  getAdapterStatus
};