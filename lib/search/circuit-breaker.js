/**
 * Circuit Breaker Pattern Implementation
 * Completely isolated - no dependencies on existing code
 */

class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000; // 60 seconds
    this.name = options.name || 'CircuitBreaker';
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttemptTime) {
        console.log(`[${this.name}] Circuit is OPEN. Rejecting request.`);
        return null;
      }
      // Try to move to HALF_OPEN state
      this.state = 'HALF_OPEN';
      console.log(`[${this.name}] Circuit moved to HALF_OPEN state.`);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      console.error(`[${this.name}] Operation failed:`, error.message);
      return null;
    }
  }

  onSuccess() {
    if (this.state === 'HALF_OPEN') {
      console.log(`[${this.name}] Success in HALF_OPEN state. Closing circuit.`);
    }
    this.failureCount = 0;
    this.state = 'CLOSED';
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.state === 'HALF_OPEN') {
      console.log(`[${this.name}] Failed in HALF_OPEN state. Opening circuit.`);
      this.openCircuit();
    } else if (this.failureCount >= this.failureThreshold) {
      console.log(`[${this.name}] Failure threshold reached (${this.failureCount}/${this.failureThreshold}). Opening circuit.`);
      this.openCircuit();
    } else {
      console.log(`[${this.name}] Failure count: ${this.failureCount}/${this.failureThreshold}`);
    }
  }

  openCircuit() {
    this.state = 'OPEN';
    this.nextAttemptTime = Date.now() + this.resetTimeout;
    console.log(`[${this.name}] Circuit OPENED. Will retry at ${new Date(this.nextAttemptTime).toISOString()}`);
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime
    };
  }

  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
    console.log(`[${this.name}] Circuit manually reset to CLOSED state.`);
  }
}

module.exports = CircuitBreaker;