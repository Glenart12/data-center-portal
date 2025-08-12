/**
 * Search Cache System
 * Standalone caching system with TTL and automatic cleanup
 * Completely independent - no interaction with existing code
 */

class SearchCache {
  constructor(options = {}) {
    this.maxEntries = options.maxEntries || 100;
    this.defaultTTL = options.defaultTTL || 3600000; // 1 hour in milliseconds
    this.cleanupInterval = options.cleanupInterval || 300000; // 5 minutes
    this.cache = new Map();
    this.accessOrder = []; // Track access order for LRU eviction
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0,
      expirations: 0
    };

    // Start automatic cleanup
    this.startCleanupTimer();
  }

  /**
   * Generate normalized cache key
   */
  normalizeKey(key) {
    if (typeof key === 'object') {
      return JSON.stringify(key);
    }
    return String(key).toLowerCase().trim();
  }

  /**
   * Get value from cache
   */
  get(key) {
    const normalizedKey = this.normalizeKey(key);
    const entry = this.cache.get(normalizedKey);

    if (!entry) {
      this.stats.misses++;
      console.log(`[SearchCache] Cache miss for key: ${normalizedKey}`);
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(normalizedKey);
      this.removeFromAccessOrder(normalizedKey);
      this.stats.expirations++;
      this.stats.misses++;
      console.log(`[SearchCache] Expired entry removed for key: ${normalizedKey}`);
      return null;
    }

    // Update access order for LRU
    this.updateAccessOrder(normalizedKey);
    this.stats.hits++;
    console.log(`[SearchCache] Cache hit for key: ${normalizedKey}`);
    
    return entry.value;
  }

  /**
   * Set value in cache with optional TTL
   */
  set(key, value, ttl = null) {
    const normalizedKey = this.normalizeKey(key);
    const expirationTime = ttl || this.defaultTTL;
    
    // Check if we need to evict entries
    if (this.cache.size >= this.maxEntries && !this.cache.has(normalizedKey)) {
      this.evictLRU();
    }

    const entry = {
      value: value,
      expiresAt: Date.now() + expirationTime,
      createdAt: Date.now(),
      size: this.estimateSize(value)
    };

    this.cache.set(normalizedKey, entry);
    this.updateAccessOrder(normalizedKey);
    this.stats.sets++;
    
    console.log(`[SearchCache] Set cache entry for key: ${normalizedKey}, TTL: ${expirationTime}ms`);
    return true;
  }

  /**
   * Clear all cache entries
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    this.accessOrder = [];
    console.log(`[SearchCache] Cache cleared. Removed ${size} entries.`);
    return size;
  }

  /**
   * Remove specific entry from cache
   */
  delete(key) {
    const normalizedKey = this.normalizeKey(key);
    const deleted = this.cache.delete(normalizedKey);
    if (deleted) {
      this.removeFromAccessOrder(normalizedKey);
      console.log(`[SearchCache] Deleted entry for key: ${normalizedKey}`);
    }
    return deleted;
  }

  /**
   * Check if key exists in cache (regardless of expiration)
   */
  has(key) {
    const normalizedKey = this.normalizeKey(key);
    return this.cache.has(normalizedKey);
  }

  /**
   * Get cache size and statistics
   */
  getStats() {
    let totalSize = 0;
    let validEntries = 0;
    let expiredEntries = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
      totalSize += entry.size || 0;
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      maxEntries: this.maxEntries,
      estimatedMemoryBytes: totalSize,
      stats: { ...this.stats },
      hitRate: this.stats.hits > 0 ? 
        (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2) + '%' : '0%'
    };
  }

  /**
   * Update access order for LRU tracking
   */
  updateAccessOrder(key) {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);
  }

  /**
   * Remove key from access order
   */
  removeFromAccessOrder(key) {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  /**
   * Evict least recently used entry
   */
  evictLRU() {
    if (this.accessOrder.length === 0) return;

    const lruKey = this.accessOrder.shift();
    this.cache.delete(lruKey);
    this.stats.evictions++;
    console.log(`[SearchCache] Evicted LRU entry: ${lruKey}`);
  }

  /**
   * Estimate size of value in bytes
   */
  estimateSize(value) {
    try {
      const str = JSON.stringify(value);
      return str.length * 2; // Rough estimate (2 bytes per character)
    } catch {
      return 1024; // Default size if serialization fails
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        this.removeFromAccessOrder(key);
        removed++;
      }
    }

    if (removed > 0) {
      this.stats.expirations += removed;
      console.log(`[SearchCache] Cleanup removed ${removed} expired entries.`);
    }

    return removed;
  }

  /**
   * Start automatic cleanup timer
   */
  startCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);

    // Ensure timer doesn't prevent process from exiting
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }

    console.log(`[SearchCache] Automatic cleanup scheduled every ${this.cleanupInterval}ms`);
  }

  /**
   * Stop automatic cleanup timer
   */
  stopCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
      console.log('[SearchCache] Automatic cleanup stopped.');
    }
  }

  /**
   * Get all keys in cache
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all valid (non-expired) entries
   */
  getValidEntries() {
    const now = Date.now();
    const validEntries = {};

    for (const [key, entry] of this.cache.entries()) {
      if (now <= entry.expiresAt) {
        validEntries[key] = {
          value: entry.value,
          expiresIn: entry.expiresAt - now,
          age: now - entry.createdAt
        };
      }
    }

    return validEntries;
  }

  /**
   * Batch get multiple keys
   */
  mget(keys) {
    const results = {};
    for (const key of keys) {
      results[key] = this.get(key);
    }
    return results;
  }

  /**
   * Batch set multiple key-value pairs
   */
  mset(entries, ttl = null) {
    const results = {};
    for (const [key, value] of Object.entries(entries)) {
      results[key] = this.set(key, value, ttl);
    }
    return results;
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0,
      expirations: 0
    };
    console.log('[SearchCache] Statistics reset.');
  }

  /**
   * Export cache data for persistence
   */
  export() {
    const now = Date.now();
    const data = {};

    for (const [key, entry] of this.cache.entries()) {
      if (now <= entry.expiresAt) {
        data[key] = {
          value: entry.value,
          expiresAt: entry.expiresAt,
          createdAt: entry.createdAt
        };
      }
    }

    return {
      version: '1.0',
      exportedAt: now,
      entries: data,
      stats: { ...this.stats }
    };
  }

  /**
   * Import cache data
   */
  import(data) {
    if (!data || data.version !== '1.0') {
      console.error('[SearchCache] Invalid import data format.');
      return false;
    }

    const now = Date.now();
    let imported = 0;

    for (const [key, entry] of Object.entries(data.entries)) {
      if (entry.expiresAt > now) {
        this.cache.set(key, {
          value: entry.value,
          expiresAt: entry.expiresAt,
          createdAt: entry.createdAt,
          size: this.estimateSize(entry.value)
        });
        imported++;
      }
    }

    console.log(`[SearchCache] Imported ${imported} valid entries.`);
    return true;
  }

  /**
   * Destroy cache and cleanup
   */
  destroy() {
    this.stopCleanupTimer();
    this.clear();
    console.log('[SearchCache] Cache destroyed.');
  }
}

// Factory function for creating cache instances
function createSearchCache(options = {}) {
  return new SearchCache(options);
}

module.exports = {
  SearchCache,
  createSearchCache
};