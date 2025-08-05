// lib/mop-knowledge/source-manager.js
class SourceManager {
  constructor() {
    this.sources = [];
    this.citationCounter = 1;
  }

  addSource(sourceData) {
    // Check if source already exists
    const existingIndex = this.sources.findIndex(s => 
      s.document === sourceData.document && 
      s.page === sourceData.page
    );

    if (existingIndex !== -1) {
      return existingIndex + 1; // Return existing citation number
    }

    // Add URL if not provided but can be generated
    const sourceWithUrl = {
      ...sourceData,
      citationNumber: this.citationCounter,
      url: sourceData.url || this.generateSourceUrl(sourceData)
    };

    this.sources.push(sourceWithUrl);
    
    return this.citationCounter++;
  }

  generateSourceUrl(sourceData) {
    // Generate URLs for common source types
    if (sourceData.type === 'osha_regulation' && sourceData.regulation) {
      const section = sourceData.regulation.replace('29 CFR ', '').replace(' ', '/');
      return `https://www.osha.gov/laws-regs/regulations/standardnumber/${section}`;
    }
    
    if (sourceData.type === 'safety_standard' && sourceData.standard) {
      if (sourceData.standard.includes('NFPA')) {
        const nfpaNumber = sourceData.standard.match(/NFPA (\d+[A-Z]?)/)?.[1];
        if (nfpaNumber) {
          return `https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=${nfpaNumber}`;
        }
      }
    }
    
    if (sourceData.type === 'manufacturer_manual') {
      // Could add manufacturer-specific URLs here
      return '#manufacturer-documentation';
    }
    
    return sourceData.url || '#';
  }

  getCitation(sourceData) {
    const citationNumber = this.addSource(sourceData);
    const source = this.sources.find(s => s.citationNumber === citationNumber);
    const url = source?.url || '#';
    
    // Return clickable citation with link
    return `<sup class="citation" data-source='${JSON.stringify(sourceData)}'>
      <a href="${url}" target="_blank" title="View source: ${sourceData.document || sourceData.standard || sourceData.regulation}" 
         style="color: #0066cc; text-decoration: none;">
        [${citationNumber}]📋
      </a>
    </sup>`;
  }

  generateReferencesSection() {
    const groupedSources = {
      manufacturer_manual: [],
      safety_standard: [],
      osha_regulation: [],
      field_verification: [],
      msds: [],
      other: []
    };

    this.sources.forEach(source => {
      const type = source.type || 'other';
      const group = groupedSources[type] || groupedSources.other;
      group.push(source);
    });

    let html = '<h2>References and Data Sources</h2>\n';
    
    if (groupedSources.manufacturer_manual.length > 0) {
      html += '<h3>Manufacturer Documentation</h3>\n<ol>\n';
      groupedSources.manufacturer_manual.forEach(source => {
        html += `<li><strong>${source.document}</strong>`;
        if (source.url && source.url !== '#') {
          html += ` <a href="${source.url}" target="_blank" style="color: #0066cc;">📋 View Document</a>`;
        }
        html += '<br>\n';
        if (source.documentId) html += `Document ID: ${source.documentId}<br>\n`;
        if (source.page) html += `Page(s): ${source.page}<br>\n`;
        if (source.section) html += `Section: ${source.section}<br>\n`;
        if (source.lastVerified) html += `Last Verified: ${source.lastVerified}\n`;
        html += '</li>\n';
      });
      html += '</ol>\n';
    }

    if (groupedSources.safety_standard.length > 0) {
      html += '<h3>Safety Standards and Regulations</h3>\n<ol>\n';
      groupedSources.safety_standard.forEach(source => {
        html += `<li><strong>${source.standard || source.regulation}</strong>`;
        if (source.url && source.url !== '#') {
          html += ` <a href="${source.url}" target="_blank" style="color: #0066cc;">📋 View Standard</a>`;
        }
        html += '<br>\n';
        if (source.article) html += `Article: ${source.article}<br>\n`;
        if (source.title) html += `${source.title}<br>\n`;
        html += '</li>\n';
      });
      html += '</ol>\n';
    }

    if (groupedSources.osha_regulation.length > 0) {
      html += '<h3>OSHA Regulations</h3>\n<ol>\n';
      groupedSources.osha_regulation.forEach(source => {
        html += `<li><strong>${source.regulation}</strong>`;
        if (source.url && source.url !== '#') {
          html += ` <a href="${source.url}" target="_blank" style="color: #0066cc;">📋 View Regulation</a>`;
        }
        html += '<br>\n';
        if (source.title) html += `${source.title}<br>\n`;
        html += '</li>\n';
      });
      html += '</ol>\n';
    }

    return html;
  }

  reset() {
    this.sources = [];
    this.citationCounter = 1;
  }
}

// Export as named export
export { SourceManager };

// Also export as default for compatibility
export default SourceManager;