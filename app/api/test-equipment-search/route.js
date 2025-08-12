/**
 * Test API Endpoint for Equipment Search
 * TESTING ONLY - Not integrated with any existing code
 * Endpoint: GET /api/test-equipment-search?modelNumber=XXX&manufacturer=YYY
 */

import { NextResponse } from 'next/server';

// Mock data for testing when search is disabled
const MOCK_DATA = {
  'carrier_30xa080': {
    tonnage: '80 tons',
    voltage: '460V',
    refrigerantType: 'R-134a',
    flowRate: '192 GPM',
    pressureDrop: '12 psi',
    additionalSpecs: {
      powerRating: '75 kW',
      weight: '4,500 lbs',
      efficiency: '12.1 EER'
    }
  },
  'trane_rtac140': {
    tonnage: '140 tons',
    voltage: '460/3/60',
    refrigerantType: 'R-134a',
    flowRate: '336 GPM',
    pressureDrop: '15 psi',
    additionalSpecs: {
      powerRating: '125 kW',
      weight: '6,200 lbs',
      efficiency: '11.5 EER'
    }
  },
  'york_ycal0080': {
    tonnage: '80 tons',
    voltage: '460V',
    refrigerantType: 'R-410A',
    flowRate: '190 GPM',
    pressureDrop: '11 psi',
    additionalSpecs: {
      powerRating: '72 kW',
      weight: '4,200 lbs',
      efficiency: '12.5 EER'
    }
  },
  'default': {
    tonnage: '100 tons',
    voltage: '480V',
    refrigerantType: 'R-134a',
    flowRate: '240 GPM',
    pressureDrop: '14 psi',
    additionalSpecs: {
      powerRating: '90 kW',
      weight: '5,000 lbs',
      efficiency: '11.8 EER'
    }
  }
};

/**
 * Validate input to only allow alphanumeric and hyphens
 */
function validateInput(input) {
  if (!input) return true; // Empty is valid
  const pattern = /^[a-zA-Z0-9-]+$/;
  return pattern.test(input);
}

/**
 * Get mock data based on model/manufacturer
 */
function getMockData(modelNumber, manufacturer) {
  // Create a key from inputs
  const key = `${manufacturer}_${modelNumber}`.toLowerCase().replace(/[^a-z0-9_]/g, '');
  
  // Check if we have specific mock data
  if (MOCK_DATA[key]) {
    return MOCK_DATA[key];
  }
  
  // Check partial matches
  for (const [mockKey, data] of Object.entries(MOCK_DATA)) {
    if (mockKey !== 'default' && 
        (key.includes(mockKey) || mockKey.includes(key))) {
      return data;
    }
  }
  
  // Return default mock data
  return MOCK_DATA.default;
}

/**
 * Format response with consistent structure
 */
function formatResponse(success, results, metadata = {}) {
  return {
    success,
    results: results || [],
    metadata: {
      timestamp: new Date().toISOString(),
      searchEnabled: process.env.SEARCH_ENABLED === 'true',
      ...metadata
    }
  };
}

export async function GET(request) {
  console.log('[TestEquipmentSearch] Received request');
  
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const modelNumber = searchParams.get('modelNumber') || '';
    const manufacturer = searchParams.get('manufacturer') || '';
    
    console.log(`[TestEquipmentSearch] Params - Model: ${modelNumber}, Manufacturer: ${manufacturer}`);
    
    // Validate inputs
    if (!validateInput(modelNumber) || !validateInput(manufacturer)) {
      console.log('[TestEquipmentSearch] Invalid input characters detected');
      return NextResponse.json(
        formatResponse(false, [], { error: 'Invalid input characters' }),
        { status: 400 }
      );
    }
    
    // Check if search is enabled
    const searchEnabled = process.env.SEARCH_ENABLED === 'true';
    console.log(`[TestEquipmentSearch] Search enabled: ${searchEnabled}`);
    
    if (!searchEnabled) {
      // Return mock data for testing
      console.log('[TestEquipmentSearch] Returning mock data (search disabled)');
      const mockData = getMockData(modelNumber, manufacturer);
      
      return NextResponse.json(
        formatResponse(true, [mockData], {
          source: 'mock',
          message: 'Search is disabled. Returning mock data for testing.'
        }),
        { status: 200 }
      );
    }
    
    // Dynamic import to avoid loading if not needed
    console.log('[TestEquipmentSearch] Loading search service...');
    const { getEquipmentSearchService } = await import('../../../lib/search/equipment-search-service.js');
    const searchService = getEquipmentSearchService();
    
    // Check if service is enabled
    if (!searchService.isEnabled()) {
      console.log('[TestEquipmentSearch] Search service reports disabled state');
      const mockData = getMockData(modelNumber, manufacturer);
      
      return NextResponse.json(
        formatResponse(true, [mockData], {
          source: 'mock',
          message: 'Search service is disabled. Returning mock data.'
        }),
        { status: 200 }
      );
    }
    
    // Perform search
    console.log('[TestEquipmentSearch] Performing search...');
    const searchResult = await searchService.searchForSpecifications(modelNumber, manufacturer);
    
    // Check if we got valid results
    const hasResults = searchResult && (
      searchResult.tonnage || 
      searchResult.voltage || 
      searchResult.refrigerantType ||
      searchResult.flowRate ||
      searchResult.pressureDrop
    );
    
    if (!hasResults) {
      console.log('[TestEquipmentSearch] No results found, returning empty array');
      return NextResponse.json(
        formatResponse(true, [], {
          source: 'api',
          message: 'No specifications found'
        }),
        { status: 200 }
      );
    }
    
    console.log('[TestEquipmentSearch] Search successful, returning results');
    return NextResponse.json(
      formatResponse(true, [searchResult], {
        source: 'api',
        cached: searchResult.fromCache || false
      }),
      { status: 200 }
    );
    
  } catch (error) {
    // Log error internally but don't expose to client
    console.error('[TestEquipmentSearch] Error occurred:', error.message);
    console.error('[TestEquipmentSearch] Stack:', error.stack);
    
    // Return safe error response
    return NextResponse.json(
      formatResponse(false, [], {
        message: 'An error occurred during search'
      }),
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}