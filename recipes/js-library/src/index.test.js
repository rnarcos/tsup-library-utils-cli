/**
 * @fileoverview Tests for the JavaScript library example
 * Uses Node.js native test runner (node --test)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  Calculator,
  createCalculator,
  add,
  multiply,
  formatNumber,
} from './index.js';

describe('Calculator class', () => {
  test('should initialize with default value of 0', () => {
    const calc = new Calculator();
    assert.strictEqual(calc.value, 0);
  });

  test('should initialize with provided value', () => {
    const calc = new Calculator(10);
    assert.strictEqual(calc.value, 10);
  });

  test('should add numbers correctly', () => {
    const calc = new Calculator(5);
    calc.add(3);
    assert.strictEqual(calc.value, 8);
  });

  test('should multiply numbers correctly', () => {
    const calc = new Calculator(4);
    calc.multiply(3);
    assert.strictEqual(calc.value, 12);
  });

  test('should support method chaining', () => {
    const calc = new Calculator(2);
    const result = calc.add(3).multiply(4).add(1);
    assert.strictEqual(result.value, 21);
    assert.strictEqual(result, calc); // Returns same instance
  });

  test('should reset to zero', () => {
    const calc = new Calculator(10);
    calc.add(5).reset();
    assert.strictEqual(calc.value, 0);
  });

  test('should format numbers correctly', () => {
    const calc = new Calculator(3.14159);
    assert.strictEqual(calc.toString(), '3.14');
    assert.strictEqual(calc.toString(4), '3.1416');
  });
});

describe('createCalculator factory function', () => {
  test('should create calculator with default value', () => {
    const calc = createCalculator();
    assert.strictEqual(calc.value, 0);
    assert.ok(calc instanceof Calculator);
  });

  test('should create calculator with initial value', () => {
    const calc = createCalculator(42);
    assert.strictEqual(calc.value, 42);
    assert.ok(calc instanceof Calculator);
  });
});

describe('Utility functions', () => {
  test('add function should work correctly', () => {
    assert.strictEqual(add(2, 3), 5);
    assert.strictEqual(add(-1, 1), 0);
    assert.strictEqual(add(0.1, 0.2), 0.30000000000000004); // Floating point precision
  });

  test('add function should throw on invalid input', () => {
    // @ts-expect-error - Testing error handling with wrong types
    assert.throws(() => add('2', 3), TypeError);
    // @ts-expect-error - Testing error handling with null
    assert.throws(() => add(2, null), TypeError);
  });

  test('multiply function should work correctly', () => {
    assert.strictEqual(multiply(3, 4), 12);
    assert.strictEqual(multiply(-2, 3), -6);
    assert.strictEqual(multiply(0, 100), 0);
  });

  test('multiply function should throw on invalid input', () => {
    // @ts-expect-error - Testing error handling with wrong types
    assert.throws(() => multiply('3', 4), TypeError);
    // @ts-expect-error - Testing error handling with undefined
    assert.throws(() => multiply(3, undefined), TypeError);
  });

  test('formatNumber should format correctly', () => {
    assert.strictEqual(formatNumber(3.14159), '3.14');
    assert.strictEqual(formatNumber(3.14159, 0), '3');
    assert.strictEqual(formatNumber(3.14159, 4), '3.1416');
    assert.strictEqual(formatNumber(10), '10.00');
  });

  test('formatNumber should throw on invalid input', () => {
    // @ts-expect-error - Testing error handling with wrong types
    assert.throws(() => formatNumber('3.14'), TypeError);
    assert.throws(() => formatNumber(3.14, -1), TypeError);
    assert.throws(() => formatNumber(3.14, 1.5), TypeError);
  });
});

describe('Integration tests', () => {
  test('should work with complex calculations', () => {
    const calc = createCalculator(100);

    // Calculate: ((100 + 50) * 2) = 300
    calc.add(50).multiply(2);

    assert.strictEqual(calc.value, 300);
    assert.strictEqual(calc.toString(0), '300');
  });

  test('should handle edge cases', () => {
    const calc = new Calculator(0);

    // Adding zero should not change value
    calc.add(0);
    assert.strictEqual(calc.value, 0);

    // Multiplying by zero should result in zero
    calc.add(10).multiply(0);
    assert.strictEqual(calc.value, 0);

    // Reset should work after any operations
    calc.add(999).reset();
    assert.strictEqual(calc.value, 0);
  });
});
