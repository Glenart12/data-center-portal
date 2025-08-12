/**
 * SerpAPI Client Wrapper
 * Completely isolated - no dependencies on existing code
 */

const https = require('https');
const CircuitBreaker = require('./circuit-breaker');

class SerpAPIClient {
  constructor() {
    this.apiKey = process.env.SERP_API_KEY;
    this.baseUrl = 'serpapi.com';
    this.timeout = parseInt(process.env.SEARCH_TIMEOUT) || 5000;
    
    this.circuitBreaker = new CircuitBreaker({
      name: 'SerpAPI',
      failureThreshold: 5,
      resetTimeout: 60000
    });
  }

  /**
   * Build optimized search query for equipment specifications
   */
  buildEquipmentQuery(modelNumber, manufacturer) {
    const terms = [];
    
    if (manufacturer) {
      terms.push(manufacturer);
    }
    
    if (modelNumber) {
      // Clean the model number for better search results
      const cleanModel = modelNumber.replace(/[^a-zA-Z0-9\s-]/g, ' ').trim();
      terms.push(cleanModel);
    }
    
    // Add specification keywords for better results
    terms.push('specifications', 'datasheet', 'technical', 'manual');
    
    return terms.join(' ');
  }

  /**
   * Parse search results to extract equipment specifications
   */
  parseSpecifications(searchResults) {
    if (!searchResults || !searchResults.organic_results) {
      return null;
    }

    const specs = {
      tonnage: null,
      voltage: null,
      refrigerantType: null,
      flowRate: null,
      pressureDrop: null,
      raw_snippets: []
    };

    // Patterns for extracting specifications
    const patterns = {
      tonnage: /(\d+(?:\.\d+)?)\s*(?:ton|tons|TR)/i,
      voltage: /(\d{3,4})\s*V(?:AC)?|(\d{3,4}\/\d{3,4})\s*V/i,
      refrigerant: /R-?(\d{2,3}[A-Za-z]?)|refrigerant[:\s]+([A-Z0-9-]+)/i,
      flowRate: /(\d+(?:\.\d+)?)\s*(?:GPM|gpm|CFM|cfm|m³\/h)/i,
      pressureDrop: /(\d+(?:\.\d+)?)\s*(?:psi|PSI|kPa|bar)/i
    };

    // Search through organic results
    for (const result of searchResults.organic_results.slice(0, 5)) {
      const text = `${result.title || ''} ${result.snippet || ''}`;
      specs.raw_snippets.push(text);

      // Extract tonnage
      if (!specs.tonnage) {
        const tonnageMatch = text.match(patterns.tonnage);
        if (tonnageMatch) {
          specs.tonnage = tonnageMatch[1] + ' tons';
        }
      }

      // Extract voltage
      if (!specs.voltage) {
        const voltageMatch = text.match(patterns.voltage);
        if (voltageMatch) {
          specs.voltage = voltageMatch[1] || voltageMatch[2];
        }
      }

      // Extract refrigerant
      if (!specs.refrigerantType) {
        const refrigerantMatch = text.match(patterns.refrigerant);
        if (refrigerantMatch) {
          specs.refrigerantType = refrigerantMatch[1] || refrigerantMatch[2];
        }
      }

      // Extract flow rate
      if (!specs.flowRate) {
        const flowMatch = text.match(patterns.flowRate);
        if (flowMatch) {
          specs.flowRate = flowMatch[0];
        }
      }

      // Extract pressure drop
      if (!specs.pressureDrop) {
        const pressureMatch = text.match(patterns.pressureDrop);
        if (pressureMatch) {
          specs.pressureDrop = pressureMatch[0];
        }
      }
    }

    return specs;
  }

  /**
   * Make HTTP request with timeout
   */
  makeRequest(query) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        q: query,
        engine: 'google',
        num: 10
      });

      const options = {
        hostname: this.baseUrl,
        path: `/search?${params.toString()}`,
        method: 'GET',
        timeout: this.timeout
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }

  /**
   * Search for equipment specifications with error handling
   */
  async searchEquipment(modelNumber, manufacturer) {
    if (!this.apiKey) {
      console.log('[SerpAPIClient] No API key configured. Returning null.');
      return null;
    }

    try {
      const query = this.buildEquipmentQuery(modelNumber, manufacturer);
      console.log(`[SerpAPIClient] Searching for: ${query}`);

      const searchResult = await this.circuitBreaker.execute(
        () => this.makeRequest(query)
      );

      if (!searchResult) {
        console.log('[SerpAPIClient] Circuit breaker returned null or search failed.');
        return null;
      }

      const specs = this.parseSpecifications(searchResult);
      console.log('[SerpAPIClient] Extracted specifications:', specs);
      
      return specs;
    } catch (error) {
      console.error('[SerpAPIClient] Unexpected error:', error.message);
      return null;
    }
  }

  /**
   * Get circuit breaker status
   */
  getStatus() {
    return {
      apiKeyConfigured: !!this.apiKey,
      circuitBreakerState: this.circuitBreaker.getState()
    };
  }
}

module.exports = SerpAPIClient;