/**
 * Equipment Search Service
 * Completely isolated service for searching equipment specifications
 * No dependencies on existing code - completely standalone
 */

const SerpAPIClient = require('./serp-api-client');

class EquipmentSearchService {
  constructor() {
    this.serpClient = new SerpAPIClient();
    this.cache = new Map();
    this.cacheTTL = parseInt(process.env.SEARCH_CACHE_TTL) || 3600; // seconds
    this.searchLog = [];
    this.maxLogEntries = 100;
  }

  /**
   * Check if search functionality is enabled
   */
  isEnabled() {
    const enabled = process.env.SEARCH_ENABLED;
    return enabled === 'true' || enabled === true;
  }

  /**
   * Generate cache key from search parameters
   */
  getCacheKey(modelNumber, manufacturer) {
    return `${manufacturer || 'unknown'}_${modelNumber || 'unknown'}`.toLowerCase();
  }

  /**
   * Check if cached result is still valid
   */
  isCacheValid(cacheEntry) {
    if (!cacheEntry) return false;
    const ageInSeconds = (Date.now() - cacheEntry.timestamp) / 1000;
    return ageInSeconds < this.cacheTTL;
  }

  /**
   * Log search for debugging purposes
   */
  logSearch(modelNumber, manufacturer, result, source) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      modelNumber,
      manufacturer,
      source,
      success: !!result,
      hasSpecs: !!(result && (result.tonnage || result.voltage || result.refrigerantType))
    };

    this.searchLog.unshift(logEntry);
    
    // Keep log size manageable
    if (this.searchLog.length > this.maxLogEntries) {
      this.searchLog = this.searchLog.slice(0, this.maxLogEntries);
    }

    console.log('[EquipmentSearchService] Search logged:', logEntry);
  }

  /**
   * Main search method for equipment specifications
   */
  async searchForSpecifications(modelNumber, manufacturer) {
    try {
      // Check if search is enabled
      if (!this.isEnabled()) {
        console.log('[EquipmentSearchService] Search is disabled via SEARCH_ENABLED environment variable.');
        this.logSearch(modelNumber, manufacturer, null, 'disabled');
        return this.getEmptyResult();
      }

      // Validate input
      if (!modelNumber && !manufacturer) {
        console.log('[EquipmentSearchService] No model number or manufacturer provided.');
        this.logSearch(modelNumber, manufacturer, null, 'invalid_input');
        return this.getEmptyResult();
      }

      // Check cache first
      const cacheKey = this.getCacheKey(modelNumber, manufacturer);
      const cachedEntry = this.cache.get(cacheKey);
      
      if (this.isCacheValid(cachedEntry)) {
        console.log('[EquipmentSearchService] Returning cached result for:', cacheKey);
        this.logSearch(modelNumber, manufacturer, cachedEntry.data, 'cache');
        return cachedEntry.data;
      }

      // Perform search
      console.log(`[EquipmentSearchService] Searching for: ${manufacturer} ${modelNumber}`);
      const searchResult = await this.serpClient.searchEquipment(modelNumber, manufacturer);

      // Format result
      const formattedResult = this.formatSearchResult(searchResult);

      // Cache result
      if (formattedResult && (formattedResult.tonnage || formattedResult.voltage)) {
        this.cache.set(cacheKey, {
          timestamp: Date.now(),
          data: formattedResult
        });
        console.log('[EquipmentSearchService] Result cached for:', cacheKey);
      }

      // Log search
      this.logSearch(modelNumber, manufacturer, formattedResult, 'api');

      return formattedResult;

    } catch (error) {
      console.error('[EquipmentSearchService] Unexpected error during search:', error.message);
      this.logSearch(modelNumber, manufacturer, null, 'error');
      return this.getEmptyResult();
    }
  }

  /**
   * Format search results into standardized structure
   */
  formatSearchResult(searchResult) {
    if (!searchResult) {
      return this.getEmptyResult();
    }

    return {
      tonnage: searchResult.tonnage || null,
      voltage: searchResult.voltage || null,
      refrigerantType: searchResult.refrigerantType || null,
      flowRate: searchResult.flowRate || null,
      pressureDrop: searchResult.pressureDrop || null,
      additionalSpecs: this.extractAdditionalSpecs(searchResult),
      sourceSnippets: searchResult.raw_snippets || [],
      searchTimestamp: new Date().toISOString()
    };
  }

  /**
   * Extract additional specifications from search results
   */
  extractAdditionalSpecs(searchResult) {
    const specs = {};
    
    if (!searchResult || !searchResult.raw_snippets) {
      return specs;
    }

    // Combine all snippets for analysis
    const fullText = searchResult.raw_snippets.join(' ');

    // Try to extract additional common specifications
    const patterns = {
      power: /(\d+(?:\.\d+)?)\s*(?:kW|KW|hp|HP)/i,
      weight: /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:lbs|pounds|kg|kilograms)/i,
      dimensions: /(\d+)\s*[x×]\s*(\d+)\s*[x×]\s*(\d+)/i,
      efficiency: /(\d+(?:\.\d+)?)\s*(?:%|percent)\s*efficiency/i,
      noise: /(\d+)\s*(?:dB|dBA|decibels)/i
    };

    // Extract power rating
    const powerMatch = fullText.match(patterns.power);
    if (powerMatch) {
      specs.powerRating = powerMatch[0];
    }

    // Extract weight
    const weightMatch = fullText.match(patterns.weight);
    if (weightMatch) {
      specs.weight = weightMatch[0];
    }

    // Extract dimensions
    const dimensionsMatch = fullText.match(patterns.dimensions);
    if (dimensionsMatch) {
      specs.dimensions = dimensionsMatch[0];
    }

    // Extract efficiency
    const efficiencyMatch = fullText.match(patterns.efficiency);
    if (efficiencyMatch) {
      specs.efficiency = efficiencyMatch[0];
    }

    // Extract noise level
    const noiseMatch = fullText.match(patterns.noise);
    if (noiseMatch) {
      specs.noiseLevel = noiseMatch[0];
    }

    return specs;
  }

  /**
   * Return empty result structure
   */
  getEmptyResult() {
    return {
      tonnage: null,
      voltage: null,
      refrigerantType: null,
      flowRate: null,
      pressureDrop: null,
      additionalSpecs: {},
      sourceSnippets: [],
      searchTimestamp: new Date().toISOString()
    };
  }

  /**
   * Clear the cache
   */
  clearCache() {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`[EquipmentSearchService] Cache cleared. Removed ${size} entries.`);
    return size;
  }

  /**
   * Get service status and statistics
   */
  getStatus() {
    return {
      enabled: this.isEnabled(),
      cacheSize: this.cache.size,
      cacheTTL: this.cacheTTL,
      recentSearches: this.searchLog.slice(0, 10),
      serpApiStatus: this.serpClient.getStatus()
    };
  }

  /**
   * Get search logs for debugging
   */
  getSearchLogs() {
    return {
      totalSearches: this.searchLog.length,
      successfulSearches: this.searchLog.filter(log => log.success).length,
      failedSearches: this.searchLog.filter(log => !log.success).length,
      cacheHits: this.searchLog.filter(log => log.source === 'cache').length,
      apiCalls: this.searchLog.filter(log => log.source === 'api').length,
      logs: this.searchLog
    };
  }
}

// Export a singleton instance
let serviceInstance = null;

function getEquipmentSearchService() {
  if (!serviceInstance) {
    serviceInstance = new EquipmentSearchService();
  }
  return serviceInstance;
}

module.exports = {
  EquipmentSearchService,
  getEquipmentSearchService
};