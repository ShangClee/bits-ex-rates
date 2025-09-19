/**
 * Test Runner
 * Custom test runner for no-build environment
 */

import { jest } from '@jest/globals';

// Global test configuration
global.jest = jest;

// Export test utilities for easy access
export * from './utils/test-helpers.js';
export * from './mocks/sample-data.js';

// Test suite runner
export class TestRunner {
  constructor() {
    this.suites = new Map();
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      errors: []
    };
  }
  
  addSuite(name, testFn) {
    this.suites.set(name, testFn);
  }
  
  async runAll() {
    console.log('🧪 Running Bitcoin Exchange Rates Test Suite\n');
    
    for (const [name, testFn] of this.suites) {
      try {
        console.log(`📋 Running ${name}...`);
        await testFn();
        this.results.passed++;
        console.log(`✅ ${name} passed\n`);
      } catch (error) {
        this.results.failed++;
        this.results.errors.push({ suite: name, error });
        console.error(`❌ ${name} failed:`, error.message, '\n');
      }
      this.results.total++;
    }
    
    this.printSummary();
  }
  
  printSummary() {
    console.log('📊 Test Summary:');
    console.log(`Total: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.errors.forEach(({ suite, error }) => {
        console.log(`- ${suite}: ${error.message}`);
      });
    }
    
    const success = this.results.failed === 0;
    console.log(`\n${success ? '🎉' : '💥'} Tests ${success ? 'passed' : 'failed'}!`);
  }
}

// Create global test runner instance
export const testRunner = new TestRunner();